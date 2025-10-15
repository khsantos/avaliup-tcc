import { Share2, Award, Star } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { formatRating } from "@/src/lib/formatRating";
import StarRating from "../StarRating";
import ProductCriteriaStars from "../ProductCriteriaRatings";

interface ProductHeaderProps {
  name: string;
  rank?: number;
  category?: string;
  rating?: number;
  reviewCount?: number;
  ratingBreakdown?: { stars: number; percentage: number; count?: number }[];
  productId: number;
}

export default function ProductHeader({
  name,
  rank,
  category,
  rating,
  reviewCount,
  ratingBreakdown = [],
  productId,
}: ProductHeaderProps) {
  const getRankingText = (rank: number, category: string) => {
    switch (category.toLowerCase()) {
      case "mouse":
        return `Top #${rank} - Mouses gamers custo-benefício`;
      case "teclado":
        return `Top #${rank} - Teclados mecânicos custo-benefício`;
      case "headset":
        return `Top #${rank} - Headsets gamers recomendados`;
      default:
        return `Top #${rank} - Produto em destaque`;
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: name,
      text: `Confira este produto: ${name}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Link compartilhado!");
      } catch {
        toast.error("Não foi possível compartilhar o link.");
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Ranking */}
      <div className="bg-[#010b62] text-white px-4 py-2 rounded-md flex items-center gap-2 w-full dark:bg-[#01BAEF] mb-2">
        <Award className="w-5 h-5 text-[#FFB24B]" />
        <span className="text-xl font-bold dark:text-white">
          {getRankingText(rank ?? 0, category ?? "")}
        </span>
      </div>

      {/* Nome + botão compartilhar */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl -mt-3.5 font-bold text-[#010b62] dark:text-white">
          {name}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#010b62] hover:bg-[#010b62] hover:text-white dark:hover:bg-gray-800 cursor-pointer mb-8"
          onClick={handleShare}
        >
          <Share2 className="w-6 h-6 dark:text-white" />
        </Button>
      </div>

      {/* Avaliação geral */}
      <div className="flex items-center min-w-[220px]">
        <span className="text-5xl font-bold text-[#FFB24B] leading-none">
          {formatRating(rating)}
        </span>
        <div className="flex flex-col ml-4">
          <StarRating rating={rating ?? 0} size={22} />
          <span className="text-sm text-gray-500 mt-1">
            {reviewCount?.toLocaleString() ?? 0} avaliações
          </span>
        </div>
      </div>

      {/* Rating breakdown */}
      <div className="flex-2 -space-y-0.5 max-w-[400px] min-w-[200px] w-1/2">
        {ratingBreakdown.map((item) => (
          <div key={item.stars} className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#010b62] dark:bg-[#01BAEF] h-2 rounded-full"
                style={{
                  width: item.percentage > 0 ? `${item.percentage}%` : "4px",
                }}
              />
            </div>

            <span className="text-s text-[#010b62] dark:text-gray-400 w-4 text-right">
              {item.stars}
            </span>
            <Star className="w-4 h-4 fill-[#FFB24B] text-[#FFB24B] flex" />
          </div>
        ))}
      </div>

      {/* Critérios detalhados */}
      <div className="mt-2">
        <div className="flex overflow-x-auto no-scrollbar divide-x divide-[#010b62]/40 dark:divide-[#FFFFFF]/50">
          <ProductCriteriaStars productId={productId} />
        </div>
      </div>
    </div>
  );
}
