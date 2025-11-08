import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { formatRating } from "@/src/lib/formatRating";
import StarRating from "../StarRating";
import { Star } from "lucide-react";

const DEFAULT_CRITERIA = [
  { name: "Peso", rating: 0 },
  { name: "Performance", rating: 0 },
  { name: "Custo-benefício", rating: 0 },
  { name: "Conforto", rating: 0 },
  { name: "Durabilidade", rating: 0 },
];

interface ProductCriteriaStarsProps {
  productId: number;
  rating?: number;
  reviewCount?: number;
  ratingBreakdown?: { stars: number; percentage: number; count?: number }[];
}

export default function ProductCriteriaStars({
  productId,
  rating,
  reviewCount,
  ratingBreakdown = [],
}: ProductCriteriaStarsProps) {
  const [characteristics, setCharacteristics] = useState(DEFAULT_CRITERIA);

  useEffect(() => {
    async function fetchCriteria() {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("id")
        .eq("product_id", productId);

      if (!reviews?.length) {
        // Sem reviews → mantém lista padrão com 0
        setCharacteristics(DEFAULT_CRITERIA);
        return;
      }

      const reviewIds = reviews.map((r) => r.id);

      const { data: ratings } = await supabase
        .from("review_criteria_rating")
        .select("criterion, rating")
        .in("review_id", reviewIds);

      if (!ratings?.length) {
        setCharacteristics(DEFAULT_CRITERIA);
        return;
      }

      const criterionNamesMap: Record<string, string> = {
        weight: "Peso",
        performance: "Performance",
        costBenefit: "Custo-benefício",
        comfort: "Conforto",
        durability: "Durabilidade",
      };

      const totals: Record<string, { sum: number; count: number }> = {};
      ratings.forEach(({ criterion, rating }) => {
        if (!totals[criterion]) totals[criterion] = { sum: 0, count: 0 };
        totals[criterion].sum += rating;
        totals[criterion].count++;
      });

      const avgRatings = Object.entries(criterionNamesMap).map(
        ([key, name]) => {
          const total = totals[key];
          return {
            name,
            rating: total
              ? parseFloat((total.sum / total.count).toFixed(1))
              : 0,
          };
        }
      );

      setCharacteristics(avgRatings);
    }

    fetchCriteria();
  }, [productId]);

  return (
    <div>
      {/* Avaliação geral */}
      {rating !== undefined && (
        <div className="flex items-center min-w-[220px]">
          <span className="text-5xl font-bold text-[#FFB24B] leading-none">
            {formatRating(rating)}
          </span>
          <div className="flex flex-col ml-4">
            <StarRating rating={rating} size={22} />
            <span className="text-sm text-gray-500 mt-1">
              {reviewCount?.toLocaleString() ?? 0} avaliações
            </span>
          </div>
        </div>
      )}

      {/* Rating breakdown */}
      {ratingBreakdown.length > 0 && (
        <div className="flex-2 -space-y-0.5 max-w-[400px] min-w-[200px] w-1/2">
          {ratingBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
      )}

      {/* Critérios detalhados */}
      <h2 className="text-[#010b62] text-2xl mb-2 dark:text-white">
        Avaliações por características
      </h2>
      <div className="flex flex-wrap gap-4">
        {characteristics.map(({ name, rating }) => (
          <div
            key={name}
            className="text-left text-sm text-[#010b62] dark:text-white w-full sm:w-auto"
          >
            <div>{name}</div>
            <StarRating rating={rating} size={16} />
          </div>
        ))}
      </div>
    </div>
  );
}
