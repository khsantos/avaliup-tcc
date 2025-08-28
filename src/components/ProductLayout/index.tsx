"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Star, Heart, Share2, Award } from "lucide-react";
import Image from "next/image";
import { Product } from "@/src/types/Product";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { formatRating } from "@/src/lib/formatRating";
import StarRating from "../StarRating";
import { motion, AnimatePresence } from "framer-motion";
import ProductReviewView from "../ProductReview";
import ProductCriteriaStars from "../ProductCriteriaRatings";
import { supabase } from "@/src/lib/supabase";

export default function ProductLayout({ product }: { product: Product }) {
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const thumbnails = product.images;

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
    async function fetchRatingBreakdown() {
      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_id", product.id);

      const total = reviews?.length || 0;
      const countMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      if (!error && reviews) {
        reviews.forEach(({ rating }) => {
          const rounded = Math.round(rating);
          if (rounded >= 1 && rounded <= 5) {
            countMap[rounded]++;
          }
        });
      }

      const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        percentage: total > 0 ? Math.round((countMap[stars] / total) * 100) : 0,
        count: countMap[stars],
      }));

      setRatingBreakdown(breakdown);
    }

    fetchRatingBreakdown();
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
    <div className="max-w-9xl mx-auto px-6 py-10">
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="layout"
            initial={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex gap-10 items-start w-full px-2 max-w-6xl mx-auto">
              <div className="flex flex-col gap-2 min-w-[56px]">
                {thumbnails.map((thumbUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedThumb(index)}
                    className={`w-12 h-12 border rounded-md flex items-center justify-center transition-colors ${
                      selectedThumb === index
                        ? "border-[#010b62] dark:border-[#01BAEF] dark:bg-gray-800 border-2"
                        : "border-[#010b62] dark:border-[#01BAEF]"
                    }`}
                  >
                    <Image
                      src={thumbUrl}
                      alt={`Thumbnail ${index + 1}`}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
              <div className="w-[320px] h-[320px] flex items-center justify-center rounded-lg mt-[15%]">
                <Image
                  src={
                    product.images[selectedThumb] ||
                    product.image ||
                    "/placeholder.svg"
                  }
                  alt={product.name}
                  width={600}
                  height={600}
                  className="object-contain"
                />
              </div>
              {/* Conteúdo do produto */}
              <div className="flex-1 max-w-[600px] flex flex-col gap-4 self-start">
                <div className="bg-[#010b62] text-white px-4 py-2 rounded-md flex items-center gap-2 w-full dark:bg-[#01BAEF] mb-2">
                  <Award className="w-5 h-5 text-[#FFB24B]" />
                  <span className="text-xl font-bold dark:text-white">
                    {getRankingText(product.rank, product.category)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl -mt-3.5 font-bold text-[#010b62] dark:text-white">
                    {product.name}
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#010b62] hover:bg-[#010b62] hover:text-white"
                  >
                    <Share2 className="w-6 h-6 dark:text-white" />
                  </Button>
                </div>
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
                <div className="flex-2 -space-y-0.5 max-w-[400px] min-w-[200px] w-1/2">
                  {ratingBreakdown.map((item) => (
                    <div key={item.stars} className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#010b62] dark:bg-[#01BAEF] h-2 rounded-full"
                          style={{
                            width:
                              item.percentage > 0
                                ? `${item.percentage}%`
                                : "4px",
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
                <div className="mt-2">
                  <div className="flex overflow-x-auto no-scrollbar divide-x divide-[#010b62]/40 dark:divide-[#FFFFFF]/50">
                    <ProductCriteriaStars productId={product.id} />
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-2xl font-bold text-[#010b62] dark:text-white">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    }).format(product.price)}{" "}
                    <span className="text-base">à vista</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-light">
                    menor preço atual
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    className="bg-[#010b62] hover:bg-[#1C2CA3] text-white px-6 cursor-pointer dark:bg-[#01BAEF] dark:hover:bg-[#33C9F2]"
                    onClick={() => setShowForm(true)}
                  >
                    Avaliar Produto
                    <MdOutlineKeyboardArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={
                      isWishlisted
                        ? "text-white bg-[#010b62] dark:text-[#01BAEF]  dark:border-[#01BAEF]"
                        : "text-[#010b62] border border-[#010b62] hover:text-white hover:bg-[#010b62] dark:bg-[#030712] dark:text-white dark:border-white"
                    }
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProductReviewView
              product={product}
              selectedThumb={selectedThumb}
              setSelectedThumb={setSelectedThumb}
              setShowForm={setShowForm}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
