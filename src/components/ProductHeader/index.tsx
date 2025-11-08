import { Share2, Award } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

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
}: ProductHeaderProps) {
  const getRankingText = (rank: number, category: string) => {
    switch (category.toLowerCase()) {
      case "mouse":
        return `Top #${rank} - Mouses gamers`;
      case "teclado":
        return `Top #${rank} - Teclados mecânicos`;
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
    </div>
  );
}
