import { UserReview } from "@/src/types/User_Review";
import Image from "next/image";
import RatingAndButton from "../RatingAndMoreDetails";
import useFetchUserReviews from "@/src/hooks/useFetchUserReviews";

type ReviewProductHeaderProps = {
  productId: number;
  onOpenDetails: (review: UserReview) => void;
};

export default function ReviewProductHeader({
  productId,
  onOpenDetails,
}: ReviewProductHeaderProps) {
  const { reviews, loading, error } = useFetchUserReviews(productId);

  if (loading) return <p>Carregando avaliações...</p>;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  return (
    <div className="space-y-4">
      {reviews.length === 0 && (
        <p className="text-gray-500">Nenhuma avaliação encontrada.</p>
      )}

      {reviews.map((review) => (
        <div key={review.id} className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <Image
              src={review.products?.image || "/placeholder.svg"}
              alt={review.products?.name || "Produto Desconhecido"}
              className="w-12 h-12 object-cover rounded-md border border-[#010b62]/40"
              width={48}
              height={48}
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#010b62] dark:text-white">
                  {review.products?.name || "Produto Desconhecido"}
                </span>
                <span className="text-xs text-[#010b62]/50 dark:text-gray-400">
                  Avaliado em{" "}
                  {new Date(review.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <Image
                  src={review.user_profile_img || "/placeholder.svg"}
                  alt={review.user_name || "Usuário desconhecido"}
                  className="w-6 h-6 rounded-full"
                  width={24}
                  height={24}
                />
                <span className="text-sm text-[#010b62] dark:text-white">
                  {review.user_name || "Usuário desconhecido"}
                </span>
              </div>
            </div>
          </div>

          <RatingAndButton review={review} onOpenDetails={onOpenDetails} />
        </div>
      ))}
    </div>
  );
}
