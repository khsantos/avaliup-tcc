import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import StarRating from "../StarRating";

const DEFAULT_CRITERIA = [
  { name: "Peso", rating: 0 },
  { name: "Performance", rating: 0 },
  { name: "Custo-benefício", rating: 0 },
  { name: "Conforto", rating: 0 },
  { name: "Durabilidade", rating: 0 },
];

export default function ProductCriteriaStars({
  productId,
}: {
  productId: number;
}) {
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
      <h2 className="text-[#010b62] text-2xl mb-2 dark:text-white">
        Avaliações por características
      </h2>
      <div className="flex gap-4">
        {characteristics.map(({ name, rating }) => (
          <div key={name} className="text-left text-[#010b62] dark:text-white ">
            <div>{name}</div>
            <StarRating rating={rating} size={16} />
          </div>
        ))}
      </div>
    </div>
  );
}
