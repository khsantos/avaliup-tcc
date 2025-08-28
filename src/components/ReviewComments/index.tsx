"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/src/contexts/supabase-provider";
import { useFetchComments } from "@/src/hooks/useFetchComments";
import { Button } from "../ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { UserReview } from "@/src/types/UserReview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface ReviewCommentsProps {
  reviewId: string;
  onCommentAdded?: () => void;
  setReviews?: React.Dispatch<React.SetStateAction<UserReview[]>>;
}

export function ReviewComments({
  reviewId,
  onCommentAdded,
}: ReviewCommentsProps) {
  const { supabase } = useSupabase();
  const { comments, loading, setComments } = useFetchComments(reviewId);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, [supabase]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Digite algo antes de comentar.");
      return;
    }

    setIsSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsSubmitting(false);
      toast.error("Você precisa estar logado para comentar.");
      return;
    }

    const { data, error } = await supabase
      .from("review_comments")
      .insert([{ review_id: reviewId, user_id: user.id, text: newComment }])
      .select("*, users(name, profile_img)");

    if (error) {
      toast.error("Erro ao adicionar comentário. Tente novamente.");
      setIsSubmitting(false);
      return;
    }

    if (data) {
      const updatedComments = [data[0], ...comments];
      setComments(updatedComments);
      setNewComment("");

      await supabase
        .from("reviews")
        .update({ comments: updatedComments.length })
        .eq("id", reviewId);

      if (onCommentAdded) onCommentAdded();
      toast.success("Comentário adicionado com sucesso!");
    }

    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error(
        "Você precisa estar logado para deletar comentários próprios."
      );
      return;
    }

    const { error } = await supabase
      .from("review_comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Ocorreu um problema ao tentar deletar seu comentário.");
      return;
    }

    const updatedComments = comments.filter((c) => c.id !== commentId);
    setComments(updatedComments);

    await supabase
      .from("reviews")
      .update({ comments: updatedComments.length })
      .eq("id", reviewId);

    toast.success("Comentário deletado com sucesso");
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#010b62]/20 dark:border-white/20 space-y-3">
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 dark:bg-none dark:text-white text-[#010b62] border-[#010b62] dark:border-[#01BAEF]"
          placeholder="Escreva um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isSubmitting}
        />
        <Button
          size="sm"
          disabled={isSubmitting}
          className="dark:bg-[#01BAEF] bg-[#010b62] hover:bg-[#1c2ca3] dark:text-white dark:hover:bg-[#33C9F2]"
          onClick={handleAddComment}
        >
          {isSubmitting ? "Enviando..." : "Comentar"}
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="flex gap-2 w-full justify-between">
            <div className="flex gap-2">
              {c.users?.profile_img ? (
                <Image
                  src={c.users.profile_img}
                  alt="user"
                  className="w-10 h-10 rounded-full border border-[#010b62]"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center">
                  <Avatar className="w-10 h-10 border-[#010b62] text-[#010b62] dark:text-[#01BAEF]/70 border dark:border-[#01BAEF]/70">
                    <AvatarImage
                      src={c.users?.profile_img || "/placeholder.svg"}
                    />
                    <AvatarFallback>{c.users?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-[#010b62] dark:text-white">
                  {c.users?.name}
                </p>
                <p className="text-sm text-[#010b62] dark:text-white">
                  {c.text}
                </p>
                <span className="text-xs dark:text-gray-400 text-gray-500">
                  {new Date(c.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {currentUser?.id === c.user_id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                    <MoreVertical size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDeleteComment(c.id)}
                  >
                    Deletar comentário
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))
      )}
    </div>
  );
}
