import { formatCurrencyBRL } from "@/src/lib/formatCurrencyBrl";
import { UserReview } from "@/src/types/UserReview";

export default function ReviewMeta({ review }: { review: UserReview }) {
  const formattedPrice = formatCurrencyBRL(review.price_paid);

  return (
    <div className="dark:text-[#00b6f3] text-gray-500 text-sm">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-2">
        <span>Tempo de uso: {review.time_of_use}</span>
        <span>Valor pago: {formattedPrice}</span>
        <span>Loja: {review.store}</span>
      </div>
    </div>
  );
}
