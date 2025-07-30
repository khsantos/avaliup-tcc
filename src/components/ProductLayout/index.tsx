"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Star, Heart, Share2, Award } from "lucide-react";
import Image from "next/image";
import { Product } from "@/src/types/Product";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { formatRating } from "@/src/lib/formatRating";
import StarRating from "../StarRating";
import { motion, AnimatePresence } from "framer-motion";
import ProductReviewView from "../ProductReview";

export default function ProductLayout({ product }: { product: Product }) {
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const thumbnails = product.images;

  const ratingBreakdown = [
    { stars: 5, percentage: 75 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 6 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 1 },
  ];

  const characteristics = [
    { name: "Performance", rating: 3.5 },
    { name: "Custo-benefício", rating: 4.8 },
    { name: "Conforto", rating: 3.7 },
    { name: "Preço", rating: 4.6 },
    { name: "Durabilidade", rating: 3.2 },
  ];

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
            {/* Layout do produto */}
            <div className="flex gap-20 items-start w-full px-2">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2 min-w-fit">
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
              {/* Main Image */}
              <div className="flex items-center justify-center w-[340px] h-[340px] rounded-lg mt-[15%]">
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
              <div className="flex-1 flex flex-col gap-4 self-start">
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
                <div className="mt-2">
                  <h2 className="text-base font-bold text-[#010b62] dark:text-white mb-2">
                    Avaliações por características
                  </h2>
                  <div className="grid grid-cols-5 divide-x divide-[#010b62]/40 dark:divide-[#FFFFFF]/50">
                    {characteristics.map((c) => (
                      <div
                        key={c.name}
                        className="flex flex-col items-start text-left first:pl-0 pl-3"
                      >
                        <span className="text-sm font-medium text-[#010b62] dark:text-white mb-1">
                          {c.name}
                        </span>
                        <StarRating rating={c.rating} size={20} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-[#010b62] dark:text-white">
                    R${product.price.toFixed(2)}{" "}
                    <span className="text-base">à vista</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-light">
                    menor preço atual
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    className="bg-[#010b62] hover:bg-[#0060B1] text-white px-6 cursor-pointer dark:bg-[#01BAEF]"
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
                        ? "text-white bg-[#010b62] dark:text-[#01BAEF] dark:bg-white dark:border-[#01BAEF]"
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
