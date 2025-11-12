"use client";

import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Product } from "@/src/types/Product";
import ProductGallery from "../ProductGallery";
import ReviewForm from "../CreateReviewForm";
import StarRating from "../StarRating";
import ProductCriteriaStars from "../ProductCriteriaRatings";
import { formatRating } from "@/src/lib/formatRating";
import { Award, ChevronLeft, Star } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

interface ProductReviewViewProps {
  product: Product;
  selectedThumb: number;
  setSelectedThumb: Dispatch<SetStateAction<number>>;
  setShowForm: Dispatch<SetStateAction<boolean>>;
}

export default function ProductReviewView({
  product,
  selectedThumb,
  setSelectedThumb,
  setShowForm,
}: ProductReviewViewProps) {
  const [ratingBreakdown, setRatingBreakdown] = useState<
    { stars: number; percentage: number }[]
  >([
    { stars: 5, percentage: 0 },
    { stars: 4, percentage: 0 },
    { stars: 3, percentage: 0 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ]);

  useEffect(() => {
    const fetchRatings = async () => {
      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_id", product.id);

      if (error || !reviews) return;

      const total = reviews.length;
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach(({ rating }) => {
        const rounded = Math.round(rating);
        if (rounded >= 1 && rounded <= 5) counts[rounded]++;
      });

      setRatingBreakdown(
        [5, 4, 3, 2, 1].map((stars) => ({
          stars,
          percentage: total ? Math.round((counts[stars] / total) * 100) : 0,
        }))
      );
    };

    fetchRatings();
  }, [product.id]);

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

  return (
    <div className="w-full">
      <header className="mb-6">
        <button
          className="flex items-center text-[#010b62] dark:text-[#01BAEF] hover:underline"
          onClick={() => setShowForm(false)}
        >
          <ChevronLeft className="w-4 h-4 mr-1 text-[#010b62] dark:text-[#01BAEF]" />
          Voltar
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 items-start w-full py-2">
        <div className="space-y-8 w-full">
          <div className="bg-[#010b62] dark:bg-[#01BAEF] text-white px-4 py-2 rounded-md flex items-center gap-2 w-full">
            <Award className="w-5 h-5 text-[#FFB24B]" />
            <span className="text-xl font-bold dark:text-white">
              {getRankingText(product.rank ?? 0, product.category ?? "")}
            </span>
          </div>

          <h1 className="text-2xl font-medium text-[#010b62] -mt-6 dark:text-white">
            {product.name}
          </h1>

          <ProductGallery
            images={product.images}
            selectedThumb={selectedThumb}
            setSelectedThumb={setSelectedThumb}
            productName={product.name}
            preloadFirst={true}
            align="center"
          />

          {/* ⭐ Nota do público */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-[#010b62] dark:text-white">
              Nota do Público
            </h2>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="flex items-center min-w-[220px]">
                <span className="text-5xl font-bold text-[#FFB24B] leading-none">
                  {formatRating(product.rating)}
                </span>
                <div className="flex flex-col ml-4">
                  <StarRating rating={product.rating ?? 0} size={22} />
                  <span className="text-sm text-gray-500 mt-1">
                    {(product.review_count || 0).toLocaleString() +
                      " avaliações"}
                  </span>
                </div>
              </div>

              <div className="flex-2 -space-y-0.5">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-full">
                      <div
                        className="bg-[#010b62] dark:bg-[#01BAEF] h-2 rounded-full"
                        style={{
                          width:
                            item.percentage > 0 ? `${item.percentage}%` : "4px",
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
            </div>
          </div>

          <ProductCriteriaStars productId={product.id} />
        </div>

        <ReviewForm product={product} />
      </div>
    </div>
  );
}
