import { UserReview } from "@/src/types/UserReview";
import { Button } from "../ui/button";
import StarRating from "../StarRating";

export default function RatingAndButton({
  review,
  onOpenDetails,
}: {
  review: UserReview;
  onOpenDetails: (review: UserReview) => void;
}) {
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-[#FFB24B] -mt-2">
          {review.rating}
        </span>
        <div className="flex gap-1 -mt-2">
          <StarRating rating={review.rating} />
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => onOpenDetails(review)}
        className="-mt-2 dark:bg-[#01BAEF] dark:hover:bg-[#33C9F2] bg-[#010b62] hover:bg-[#1C2CA3]/70 text-white text-sm rounded-se-lg px-2"
      >
        Ver Detalhes
      </Button>
    </div>
  );
}
