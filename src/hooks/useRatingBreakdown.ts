import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export function useRatingBreakdown(productId: string) {
  const [breakdown, setBreakdown] = useState<
    { stars: number; percentage: number }[]
  >([]);

  useEffect(() => {
    async function fetchBreakdown() {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_id", productId);

      const total = reviews?.length || 0;
      const count: Record<number, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };
      reviews?.forEach(
        (r) => ((count as Record<number, number>)[Math.round(r.rating)] += 1)
      );

      const formatted = [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        percentage: total ? Math.round((count[stars] / total) * 100) : 0,
      }));

      setBreakdown(formatted);
    }

    fetchBreakdown();
  }, [productId]);

  return breakdown;
}
