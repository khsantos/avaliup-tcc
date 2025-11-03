import { UserReview } from "@/src/types/UserReview";
import Image from "next/image";
import RatingAndButton from "../RatingAndMoreDetails";
import Link from "next/link";

type ReviewProductHeaderProps = {
  review: UserReview;
  onOpenDetails: (review: UserReview) => void;
};

export default function ReviewProductHeader({
  review,
  onOpenDetails,
}: ReviewProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 sm:gap-0">
      <div className="flex items-start sm:items-center gap-3">
        <Image
          src={review.product_image || "/placeholder.svg"}
          alt={review.product_name || "Imagem do produto"}
          className="w-12 h-12 object-cover rounded-md border border-[#010b62]/40 dark:border-[#01BAEF]"
          width={48}
          height={48}
        />

        <div className="flex flex-col">
          <span className="text-md text-[#010b62] dark:text-white line-clamp-1 hover:underline">
            <Link
              href={review.product_id ? `/produto/${review.product_id}` : "#"}
            >
              {review.product_name || "Produto Desconhecido"}
            </Link>
          </span>
          <span className="text-xs text-[#010b62]/50 dark:text-gray-400">
            Avaliado em{" "}
            {new Date(review.created_at).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </div>

      <div className="mt-2 sm:mt-0">
        <RatingAndButton review={review} onOpenDetails={onOpenDetails} />
      </div>
    </div>
  );
}
