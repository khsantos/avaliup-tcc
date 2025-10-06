import { UserReview } from "@/src/types/UserReview";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import RatingAndButton from "../RatingAndMoreDetails";
import { AchievementBadges } from "../AchievementsBadges";

export function ReviewUserHeader({
  review,
  onOpenDetails,
}: {
  review: UserReview;
  onOpenDetails: (review: UserReview) => void;
}) {
  return (
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 border-[#010b62] text-[#010b62] dark:text-[#01BAEF]/70 border dark:border-[#01BAEF]/70">
          <AvatarImage src={review.user_profile_img || "/placeholder.svg"} />
          <AvatarFallback>{review.user_name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-[#010b62] dark:text-white">
              {review.user_name || "Usuário Anônimo"}
            </span>
            <span className="text-xs text-[#010b62]/50 dark:text-gray-400">
              Avaliado em{" "}
              {new Date(review.created_at).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="flex gap-1 mt-1">
            {review.users_id && (
              <AchievementBadges userId={review.users_id} size="sm" />
            )}
          </div>
        </div>
      </div>

      <RatingAndButton review={review} onOpenDetails={onOpenDetails} />
    </div>
  );
}
