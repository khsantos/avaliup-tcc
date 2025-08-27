import { cn } from "@/lib/utils";
import { UserReview } from "@/src/types/UserReview";
import {
  MessageCircle,
  MoreVertical,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

export default function ReviewActions({
  review,
  hasLiked,
  hasDisliked,
  onVote,
  onToggleComments,
}: {
  review: UserReview;
  hasLiked?: boolean;
  hasDisliked?: boolean;
  onVote: (id: string, type: "like" | "dislike") => void;
  onToggleComments: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-6 mt-2">
      <span
        className={cn(
          "cursor-pointer flex items-center gap-1 text-[#010b62]/50 dark:text-white/70",
          hasLiked && "text-[#010b62] dark:text-[#01BAEF]"
        )}
        onClick={() => onVote(review.id, "like")}
      >
        <ThumbsUp className="w-6 h-6" />
        {review.likes}
      </span>

      <span
        className={cn(
          "cursor-pointer flex items-center gap-1 text-[#010b62]/50 dark:text-white/70",
          hasDisliked && "text-red-500 dark:text-red-500"
        )}
        onClick={() => onVote(review.id, "dislike")}
      >
        <ThumbsDown className="w-5 h-5" />
        {review.dislikes}
      </span>

      <span
        className="cursor-pointer flex items-center gap-1 text-[#010b62]/50 dark:text-[#b6c2cd] text-base"
        onClick={() => onToggleComments(review.id)}
      >
        <MessageCircle className="w-5 h-5" />
        {review.comments}
      </span>

      <span className="ml-auto text-[#010b62]/50 dark:text-[#b6c2cd]">
        <MoreVertical className="w-5 h-5" />
      </span>
    </div>
  );
}
