import { UserReview } from "@/src/types/UserReview";

export default function ReviewMeta({ review }: { review: UserReview }) {
  return (
    <div className="dark:text-[#00b6f3] text-gray-500 text-sm mb-2">
      <div className="flex flex-col sm:flex-row sm:gap-2">
        <span>Tempo de uso: {review.time_of_use}</span>
        <span>Valor pago: {review.price_paid}</span>
        <span>Loja: {review.store}</span>
      </div>
    </div>
  );
}
