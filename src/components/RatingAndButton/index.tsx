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
    <div className="flex flex-col items-stretch gap-1 w-full">
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-[#FFB24B]">
          {review.rating}
        </span>
        <StarRating rating={review.rating} />
      </div>
      <Button
        size="sm"
        onClick={() => onOpenDetails(review)}
        className="dark:bg-[#01BAEF] dark:hover:bg-[#33C9F2] bg-[#010b62] hover:bg-[#1C2CA3]/70 text-white text-sm rounded-se-lg px-2 w-full"
      >
        Ver Detalhes
      </Button>
    </div>
  );
}
