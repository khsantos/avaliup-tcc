import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import StarRating from "../StarRating";

export default function ProductCriteriaStars({
  productId,
}: {
  productId: number;
}) {
  const [characteristics, setCharacteristics] = useState<
    { name: string; rating: number }[]
  >([]);

  useEffect(() => {
    async function fetchCriteria() {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("id")
        .eq("product_id", productId);

      if (!reviews?.length) {
        setCharacteristics([]);
        return;
      }

      const reviewIds = reviews.map((r) => r.id);

      const { data: ratings } = await supabase
        .from("review_criteria_rating")
        .select("criterion, rating")
        .in("review_id", reviewIds);

      if (!ratings?.length) {
        setCharacteristics([]);
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

      const avgRatings = Object.entries(totals).map(
        ([criterion, { sum, count }]) => ({
          name: criterionNamesMap[criterion] || criterion, // usa o nome amigável ou o original se não tiver no map
          rating: parseFloat((sum / count).toFixed(1)),
        })
      );

      setCharacteristics(avgRatings);
    }

    fetchCriteria();
  }, [productId]);

  if (characteristics.length === 0) return null;
  console.log("Characteristics:", characteristics);

  return (
    <div>
      <h2 className="text-[#010b62] text-2xl mb-2">
        Avaliações por características
      </h2>
      <div className="flex gap-4">
        {characteristics.map(({ name, rating }) => (
          <div key={name} className="text-center text-[#010b62]">
            <div>{name}</div>
            <StarRating rating={rating} size={16} />
          </div>
        ))}
      </div>
    </div>
  );
}
