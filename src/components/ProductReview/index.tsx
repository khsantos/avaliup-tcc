"use client";

import ReviewForm from "../ReviewForm";
import StarRating from "../StarRating";
import { formatRating } from "@/src/lib/formatRating";
import { Award, ChevronLeft, Star } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Product } from "@/src/types/Product";
import { supabase } from "@/src/lib/supabase";
import ProductCriteriaStars from "../ProductCriteriaRatings";

interface ProductReviewViewProps {
  product: Product;
  selectedThumb: number;
  setSelectedThumb: Dispatch<SetStateAction<number>>;
  setShowForm: Dispatch<SetStateAction<boolean>>;
}

const ProductReviewView = ({
  product,
  selectedThumb,
  setSelectedThumb,
  setShowForm,
}: ProductReviewViewProps) => {
  const [ratingBreakdown, setRatingBreakdown] = useState<
    { stars: number; percentage: number }[]
  >([]);

  function calculateRatingBreakdown(reviews: { rating: number }[]) {
    const starCounts = [0, 0, 0, 0, 0];
    for (const { rating } of reviews) {
      const rounded = Math.round(rating);
      if (rounded >= 1 && rounded <= 5) {
        starCounts[rounded - 1]++;
      }
    }

    const total = reviews.length;
    return starCounts
      .map((count, i) => ({
        stars: i + 1,
        percentage: total ? Math.round((count / total) * 100) : 0,
      }))
      .reverse();
  }

  useEffect(() => {
    async function fetchRatingsData() {
      const { data: reviews, error: errorReviews } = await supabase
        .from("reviews")
        .select("id, rating")
        .eq("product_id", product.id);

      if (errorReviews || !reviews || reviews.length === 0) {
        console.error("Erro ao buscar reviews:", errorReviews);
        return;
      }

      setRatingBreakdown(calculateRatingBreakdown(reviews));
    }

    fetchRatingsData();
  }, [product.id]);

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

  return (
    <div key="form" className="w-full">
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
        <div className="space-y-8 px-4 w-full">
          <div className="bg-[#010b62] dark:bg-[#01BAEF] text-white px-4 py-2 rounded-md flex items-center gap-2 w-full">
            <Award className="w-5 h-5 text-[#FFB24B]" />
            <span className="text-xl font-bold dark:text-white">
              {getRankingText(product.rank, product.category)}
            </span>
          </div>
          <h1 className="text-2xl font-medium text-[#010b62] -mt-6 dark:text-white">
            {product.name}
          </h1>

          <div className="flex flex-col md:flex-row gap-6 -mt-4 max-w-[1200px] w-full mx-auto">
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 px-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedThumb(i)}
                  className={`w-12 h-12 border rounded-md flex items-center justify-center transition-colors ${
                    selectedThumb === i
                      ? "border-[#010b62] dark:border-[#01BAEF] dark:bg-gray-800 border-2"
                      : "border-[#010b62] dark:border-[#01BAEF]"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center w-full max-w-md min-h-[200px]">
              <Image
                src={
                  product.images[selectedThumb] ||
                  product.image ||
                  "/placeholder.svg"
                }
                alt={product.name}
                width={400}
                height={400}
                className="object-contain w-auto max-h-[300px]"
              />
            </div>
          </div>

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
                  <StarRating rating={product.rating} size={22} />
                  <span className="text-sm text-gray-500 mt-1">
                    {(product.review_count
                      ? product.review_count.toLocaleString()
                      : "0") + " avaliações"}
                  </span>
                </div>
              </div>
              <div className="flex-2 -space-y-0.5">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-full">
                      <div
                        className="bg-[#010b62] dark:bg-[#01BAEF] h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
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
};

export default ProductReviewView;
