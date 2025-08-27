import { useState } from "react";
import { useSupabase } from "@/src/contexts/supabase-provider";
import { useFetchComments } from "@/src/hooks/useFetchComments";
import { Button } from "../ui/button";
import Image from "next/image";

interface ReviewCommentsProps {
  reviewId: string;
  onCommentAdded?: () => void;
}

export function ReviewComments({
  reviewId,
  onCommentAdded,
}: ReviewCommentsProps) {
  const { supabase } = useSupabase();
  const { comments, loading, setComments } = useFetchComments(reviewId);
  const [newComment, setNewComment] = useState("");
  const newCommentsCount = (comments?.length || 0) + 1;

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("review_comments")
      .insert([{ review_id: reviewId, user_id: user.id, text: newComment }])
      .select("*, users(name, profile_img)");

    if (!error && data) {
      setComments((prev) => [data[0], ...prev]);
      setNewComment("");

      if (onCommentAdded) onCommentAdded();

      await supabase
        .from("reviews")
        .update({ comments: newCommentsCount })
        .eq("id", reviewId);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#010b62]/20 dark:border-white/20 space-y-3">
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 dark:bg-none dark:text-white text-[#010b62] border-[#010b62] dark:border-[#01BAEF]"
          placeholder="Escreva um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          size="sm"
          className="dark:bg-[#01BAEF] bg-[#010b62] hover:bg-[]"
          onClick={handleAddComment}
        >
          Comentar
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="flex gap-2">
            {c.users?.profile_img ? (
              <Image
                src={c.users.profile_img}
                alt="user"
                className="w-10 h-10 rounded-full border border-[#010b62]"
                width={40}
                height={40}
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 border-2 border-[#010b62] rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#010b62"
                  className="w-6 h-6"
                >
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                </svg>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-[#010b62] dark:text-white">
                {c.users?.name}
              </p>
              <p className="text-sm text-[#010b62] dark:text-white">{c.text}</p>
              <span className="text-xs dark:text-gray-400 text-gray-500">
                {new Date(c.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
