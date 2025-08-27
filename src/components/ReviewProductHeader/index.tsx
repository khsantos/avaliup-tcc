// ReviewProductHeader.tsx
import { UserReview } from "@/src/types/UserReview";
import Image from "next/image";
import RatingAndButton from "../RatingAndMoreDetails";

type ReviewProductHeaderProps = {
  review: UserReview;
  onOpenDetails: (review: UserReview) => void;
};

export default function ReviewProductHeader({
  review,
  onOpenDetails,
}: ReviewProductHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-3">
        <Image
          src={review.product_image || "/placeholder.svg"}
          alt={review.product_name || "Imagem do produto"}
          className="w-12 h-12 object-cover rounded-md border border-[#010b62]/40"
          width={48}
          height={48}
        />

        <div>
          <div className="flex flex-col">
            <span className="text-md text-[#010b62] dark:text-white line-clamp-1">
              {review.product_name || "Produto Desconhecido"}
            </span>
            <span className="text-xs text-[#010b62]/50 dark:text-gray-400">
              Avaliado em{" "}
              {new Date(review.created_at).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1"></div>
        </div>
      </div>

      <RatingAndButton review={review} onOpenDetails={onOpenDetails} />
    </div>
  );
}
