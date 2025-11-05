import { UserReview } from "@/src/types/UserReview";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import RatingAndButton from "../RatingAndButton";
import { AchievementBadges } from "../AchievementsBadges";

export function ReviewUserHeader({
  review,
  onOpenDetails,
}: {
  review: UserReview;
  onOpenDetails: (review: UserReview) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 sm:gap-0 w-full">
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10 border-[#010b62] text-[#010b62] dark:text-[#01BAEF]/70 border dark:border-[#01BAEF]/70">
            <AvatarImage src={review.user_profile_img || "/placeholder.svg"} />
            <AvatarFallback>{review.user_name?.charAt(0)}</AvatarFallback>
          </Avatar>

          <span className="font-bold text-lg text-[#010b62] dark:text-white">
            {review.user_name || "Usuário Deletado"}
          </span>
        </div>

        <span className="text-xs text-[#010b62]/50 dark:text-gray-400">
          Avaliado em {new Date(review.created_at).toLocaleDateString("pt-BR")}
        </span>

        {review.users_id && (
          <div className="mt-1">
            <AchievementBadges userId={review.users_id} size="sm" />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:gap-4 gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
        <RatingAndButton review={review} onOpenDetails={onOpenDetails} />
      </div>
    </div>
  );
}
