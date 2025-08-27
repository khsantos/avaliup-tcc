import { UserReview } from "@/src/types/UserReview";

export default function ReviewMeta({ review }: { review: UserReview }) {
  return (
    <div className="dark:text-[#00b6f3] text-gray-500 text-sm mb-2">
      Tempo de uso: {review.time_of_use} | Valor pago: {review.price_paid} |
      Loja: {review.store}
    </div>
  );
}
