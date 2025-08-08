import { useEffect, useState } from "react";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { useSupabase } from "@/src/contexts/supabase-provider";
import Image from "next/image";

interface CommentFormProps {
  questionId: string;
  onCommentSent?: () => void;
}

type UserInfo = {
  name: string;
  profile_img: string;
};

export default function CommentForm({
  questionId,
  onCommentSent,
}: CommentFormProps) {
  const { user, supabase } = useSupabase();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 👇 Buscar dados da tabela 'users'
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("users")
        .select("name, profile_img")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar dados do usuário:", error.message);
      } else {
        setUserInfo(data);
      }
    };

    fetchUserInfo();
  }, [user, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setErrorMsg("Você precisa estar logado para comentar.");
      return;
    }

    if (!comment.trim()) {
      setErrorMsg("Digite um comentário.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.from("faq_answers").insert({
      question_id: questionId,
      user_id: user.id,
      content: comment.trim(),
    });

    if (error) {
      console.error(error);
      setErrorMsg("Erro ao enviar comentário.");
    } else {
      setComment("");
      if (onCommentSent) onCommentSent();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      {user && userInfo && (
        <div className="flex items-center gap-3">
          <Image
            src={userInfo.profile_img}
            alt="Avatar do usuário"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-sm font-medium text-[#010b62] dark:text-white">
            {userInfo.name}
          </span>
        </div>
      )}

      <label className="text-sm font-medium text-[#010b62] dark:text-white">
        Comentar
      </label>

      <Textarea
        placeholder="Escreva sua resposta aqui..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mt-1 dark:text-white"
      />

      {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="bg-[#010b62] hover:bg-[#019ACF] dark:bg-[#01BAEF] dark:hover:bg-[#019ACF] dark:text-white"
      >
        {loading ? "Enviando..." : "Enviar comentário"}
      </Button>
    </form>
  );
}
