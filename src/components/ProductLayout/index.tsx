"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Star, Heart, Share2, Award, ChevronLeft, Crown } from "lucide-react";
import Image from "next/image";
import { Product } from "@/src/types/Product";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { formatRating } from "@/src/lib/formatRating";
import StarRating from "../StarRating";
import { motion, AnimatePresence } from "framer-motion";
import ReviewForm from "../ReviewForm";

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
            <div className="flex gap-16 items-start w-full px-2">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3 min-w-fit">
                {thumbnails.map((thumbUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedThumb(index)}
                    className={`w-12 h-12 border rounded-lg flex items-center justify-center transition-colors ${
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
              <div className="flex items-center justify-center w-[340px] h-[340px] rounded-lg">
                <Image
                  src={
                    product.images[selectedThumb] ||
                    product.image ||
                    "/placeholder.svg"
                  }
                  alt={product.name}
                  width={320}
                  height={320}
                  className="object-contain"
                />
              </div>
              {/* Conteúdo do produto */}
              <div className="flex-1 flex flex-col gap-4 self-start">
                <div className="bg-[#010b62] text-white px-4 py-2 rounded-lg flex items-center gap-2 w-fit dark:bg-[#01BAEF] mb-2">
                  <Award className="w-5 h-5 text-[#FFB24B]" />
                  <span className="text-xl font-semibold dark:text-white">
                    {getRankingText(product.rank, product.category)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold text-[#010b62] dark:text-white">
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
                <div className="flex items-center gap-4 mb-2">
                  {product.rating !== null ? (
                    <>
                      <span className="text-5xl font-bold text-[#FFB24B]">
                        {formatRating(product.rating)}
                      </span>
                      <div className="flex flex-col">
                        <StarRating rating={product.rating} size={20} />
                        <span className="text-sm text-gray-500">
                          {(product.review_count
                            ? product.review_count.toLocaleString()
                            : "0") + " avaliações"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-300 text-sm italic">
                      Sem avaliações ainda
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {ratingBreakdown.map((item) => (
                    <div key={item.stars} className="flex items-center gap-2">
                      <span className="text-xs text-[#010b62] dark:text-white w-2">
                        {item.stars}
                      </span>
                      <Star className="w-3 h-3 fill-[#FFB24B] text-[#FFB24B]" />
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-48">
                        <div
                          className="bg-[#010b62] dark:bg-[#01BAEF] h-1.5 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {item.stars}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <h2 className="text-base font-bold text-[#010b62] dark:text-white mb-2">
                    Avaliações por características
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {characteristics.map((c) => (
                      <div
                        key={c.name}
                        className="flex flex-col items-center text-center"
                      >
                        <span className="text-sm font-medium text-gray-700 mb-1">
                          {c.name}
                        </span>
                        <StarRating rating={c.rating} size={18} />
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
            <header className="mb-6">
              <button
                className="flex items-center text-[#010b62] hover:underline"
                onClick={() => setShowForm(false)}
              >
                <ChevronLeft className="w-4 h-4 mr-1 text-[#010b62]" />
                Voltar
              </button>
            </header>

            <div className="flex gap-10 items-start w-full py-2">
              {/* Left Column: Product Details and Ratings */}
              <div className="space-y-8">
                {/* Top Banner */}
                <div className="bg-[#010b62] text-white px-4 py-2 rounded-md flex items-center gap-2 w-fit">
                  <Crown className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    Top #1 - Mouses gamers custo-benefício
                  </span>
                </div>
                <h1 className="text-2xl font-medium text-[#010b62] -mt-6">
                  {product.name}
                </h1>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Thumbnails */}
                  <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedThumb(i)}
                        className={`w-12 h-12 border rounded-lg flex items-center justify-center transition-colors ${
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
                  {/* Main Image */}
                  <div className="flex items-center mx-auto justify-center w-[400] h-[400] rounded-lg">
                    <Image
                      src={
                        product.images[selectedThumb] ||
                        product.image ||
                        "/placeholder.svg"
                      }
                      alt={product.name}
                      width={200}
                      height={200}
                      className="object-contain w-full h-auto max-w-full"
                    />
                  </div>
                </div>

                {/* Public Rating */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 text-[#010b62]">
                    Nota do Público
                  </h2>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    {/* Nota, estrelas e avaliações */}
                    <div className="flex flex-col items-start min-w-[120px]">
                      <span className="text-5xl font-bold text-orange-500 leading-none">
                        {formatRating(product.rating)}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={product.rating} size={22} />
                        <span className="text-sm text-gray-500 ml-2">
                          {(product.review_count
                            ? product.review_count.toLocaleString()
                            : "0") + " avaliações"}
                        </span>
                      </div>
                    </div>
                    {/* Barras de avaliações */}
                    <div className="flex-1 space-y-1">
                      {ratingBreakdown.map((item) => (
                        <div
                          key={item.stars}
                          className="flex items-center gap-2"
                        >
                          <Star className="w-4 h-4 fill-[#FFB24B] text-[#FFB24B]" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-full">
                            <div
                              className="bg-[#010b62] dark:bg-[#01BAEF] h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#010b62] dark:text-white w-4 text-right">
                            {item.stars}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Evaluations by Characteristics */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 text-[#010b62]">
                    Avaliações por características
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {characteristics.map((c) => (
                      <div
                        key={c.name}
                        className="flex flex-col items-center text-center"
                      >
                        <span className="text-sm font-medium text-gray-700 mb-1">
                          {c.name}
                        </span>
                        <StarRating rating={c.rating} size={18} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Review Form */}
              <ReviewForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
