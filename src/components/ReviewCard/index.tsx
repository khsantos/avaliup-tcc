import { UserReview } from "@/src/types/UserReview";
import { Card, CardContent } from "../ui/card";
import { ReviewUserHeader } from "../ReviewUserHeader";
import ReviewProductHeader from "../ReviewProductHeader";
import ReviewMeta from "../ReviewMeta";
import { ReviewContent } from "../ReviewContent";
import ReviewActions from "../ReviewActions";
import { ReviewComments } from "../ReviewComments";

type ReviewCardProps = {
  review: UserReview;
  variant?: "user" | "product";
  onOpenDetails: (review: UserReview) => void;
  onVote: (id: string, type: "like" | "dislike") => void;
  hasLiked?: boolean;
  hasDisliked?: boolean;
  isExpanded?: boolean;
  onToggleExpand: (id: string) => void;
  setReviews?: React.Dispatch<React.SetStateAction<UserReview[]>>;
  showComments?: boolean;
  onToggleComments?: (id: string) => void;
};

export function ReviewCard({
  review,
  variant = "user",
  onOpenDetails,
  onVote,
  hasLiked,
  hasDisliked,
  isExpanded,
  onToggleExpand,
  setReviews,
  onToggleComments,
  showComments = false,
}: ReviewCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-2xl transition-transform hover:scale-102 dark:bg-[#030712] border border-[#010b62] dark:border-[#ffffff]/20 rounded-sm text-white">
      <CardContent className="p-4">
        {variant === "user" ? (
          <ReviewUserHeader review={review} onOpenDetails={onOpenDetails} />
        ) : (
          <ReviewProductHeader review={review} onOpenDetails={onOpenDetails} />
        )}

        <ReviewMeta review={review} />

        <ReviewContent
          title={review.title}
          text={review.text}
          isExpanded={isExpanded}
          onToggleExpand={() => onToggleExpand(review.id)}
        />

        <ReviewActions
          review={review}
          hasLiked={hasLiked}
          hasDisliked={hasDisliked}
          onVote={onVote}
          onToggleComments={() => onToggleComments?.(review.id)}
        />

        {showComments && (
          <ReviewComments
            reviewId={review.id}
            onCommentAdded={() => {
              // Atualiza apenas este review no estado de reviews do pai
              setReviews?.((prev) =>
                prev.map((r) =>
                  r.id === review.id
                    ? { ...r, comments: (r.comments || 0) + 1 }
                    : r
                )
              );
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
