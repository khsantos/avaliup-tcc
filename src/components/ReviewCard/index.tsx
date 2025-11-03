import { UserReview } from "@/src/types/UserReview";
import { Card, CardContent } from "../ui/card";
import { ReviewUserHeader } from "../ReviewUserHeader";
import ReviewProductHeader from "../ReviewProductHeader";

import { ReviewContent } from "../ReviewContent";
import ReviewActions from "../ReviewActions";
import { ReviewComments } from "../ReviewComments";
import { ReviewOptions } from "../ReviewOptions";
import ReviewMeta from "../ReviewMeta";

type ReviewCardProps = {
  review: UserReview;
  variant?: "user" | "product";
  onOpenDetails: (review: UserReview) => void;
  onVote: (id: string, type: "like" | "dislike") => void;
  hasLiked?: boolean;
  hasDisliked?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
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
    <Card
      className="h-full flex flex-col justify-between shadow-lg hover:shadow-2xl 
                 transition-transform hover:scale-102 dark:bg-[#030712] 
                 border border-[#010b62] dark:border-[#ffffff]/20 
                 rounded-sm text-white max-w-full sm:max-w-2xl mx-auto"
    >
      <CardContent className="p-4 sm:p-6 flex flex-col gap-3">
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
          onToggleExpand={() => onToggleExpand?.(review.id)}
        />

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <ReviewActions
            review={review}
            hasLiked={hasLiked}
            hasDisliked={hasDisliked}
            onVote={onVote}
            onToggleComments={() => onToggleComments?.(review.id)}
          />

          <ReviewOptions review={review} setReviews={setReviews} />
        </div>

        {showComments && (
          <div className="w-full mt-4">
            <ReviewComments
              reviewId={review.id}
              setReviews={setReviews}
              onCommentAdded={() => {
                setReviews?.((prev) =>
                  prev.map((r) =>
                    r.id === review.id
                      ? { ...r, comments: (r.comments || 0) + 1 }
                      : r
                  )
                );
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
