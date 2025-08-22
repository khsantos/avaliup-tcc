import { UserReview } from "@/src/types/User_Review";
import { Star } from "lucide-react";
import { Button } from "../ui/button";

export default function RatingAndButton({
  review,
  onOpenDetails,
}: {
  review: UserReview;
  onOpenDetails: (review: UserReview) => void;
}) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "fill-[#FFB24B] text-[#FFB24B]"
            : "text-[#FFB24B] fill-none"
        }`}
      />
    ));
  };
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-[#FFB24B] -mt-2">
          {review.rating}
        </span>
        <div className="flex gap-1 -mt-2">{renderStars(review.rating)}</div>
      </div>
      <Button
        size="sm"
        onClick={() => onOpenDetails(review)}
        className="-mt-2 dark:bg-[#01BAEF] bg-[#010b62] hover:bg-[#010b62]/70 text-white text-sm rounded-se-lg px-2"
      >
        Ver Detalhes
      </Button>
    </div>
  );
}
