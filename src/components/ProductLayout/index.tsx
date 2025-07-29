"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Star, Heart, Share2, Award, ChevronLeft, Crown } from "lucide-react";
import Image from "next/image";
import { Product } from "@/src/types/Product";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { formatRating } from "@/src/lib/formatRating";
import StarRating from "../StarRating";
import StarRatingInput from "../StarRatingInput";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function ProductLayout({ product }: { product: Product }) {
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [ratings, setRatings] = useState({
    performance: 0,
    costBenefit: 0,
    comfort: 0,
    weight: 0,
    durability: 0,
  });

  function StarRatingDisplay({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-5 h-5 fill-orange-500 text-orange-500"
          />
        ))}
        {hasHalfStar && (
          <Star className="w-5 h-5 fill-orange-500/50 text-orange-500" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="w-5 h-5 fill-muted stroke-muted-foreground"
          />
        ))}
      </div>
    );
  }

  function RatingBar({
    label,
    percentage,
  }: {
    label: string;
    percentage: number;
  }) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
        <div className="flex-1 h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-700 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  // Helper component for characteristic ratings display
  function CharacteristicRating({
    label,
    rating,
  }: {
    label: string;
    rating: number;
  }) {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="text-sm font-medium text-gray-700 mb-1">{label}</span>
        <StarRatingDisplay rating={rating} />
      </div>
    );
  }

  function FormCharacteristicRating({ label }: { label: string }) {
    return (
      <div className="flex flex-col items-center text-center">
        <Label className="text-sm text-gray-600 mb-1">{label}</Label>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={`form-star-${i}`}
              className="w-5 h-5 fill-muted stroke-muted-foreground cursor-pointer"
            />
          ))}
        </div>
      </div>
    );
  }

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
            <div className="flex gap-10 items-start w-full">
              {/* Thumbnails */}
              <div className="flex min-w-fit gap-8">
                <div className="flex flex-col gap-2">
                  {thumbnails.map((thumbUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedThumb(index)}
                      className={`w-16 h-16 border rounded-lg flex items-center justify-center transition-colors ${
                        selectedThumb === index
                          ? "border-[#010b62] dark:border-[#01BAEF] dark:bg-gray-800 border-2"
                          : "border-[#010b62] dark:border-[#01BAEF]"
                      }`}
                    >
                      <Image
                        src={thumbUrl}
                        alt={`Thumbnail ${index + 1}`}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
                <div className="w-64 h-64 rounded-lg flex items-center justify-center mt-35">
                  <Image
                    src={
                      thumbnails[selectedThumb] ||
                      product.image ||
                      "/placeholder.svg"
                    }
                    alt={product.name}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Conteúdo do produto */}
              <div className="flex-1 space-y-4 self-end">
                <div className="bg-[#010b62] text-white px-4 py-2 rounded-lg flex items-center gap-2 w-fit dark:bg-[#01BAEF]">
                  <Award className="w-5 h-5 text-[#FFB24B]" />
                  <span className="text-xl font-semibold dark:text-white">
                    {getRankingText(product.rank, product.category)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-[#010b62] dark:text-white">
                    {product.name}
                  </h1>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-[#010b62] mb-6 hover:bg-[#010b62] hover:text-white "
                  >
                    <Share2 className="w-12 h-12 dark:text-white" />
                  </Button>
                </div>

                <div className="flex items-center gap-6">
                  {product.rating !== null ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-[#FFB24B]">
                          {formatRating(product.rating)}
                        </span>
                        <StarRating rating={product.rating} size={16} />
                      </div>
                      <span className="text-gray-600 text-sm">
                        {product.review_count.toLocaleString()} avaliações
                      </span>
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

                <div className="pt-2">
                  <div className="text-2xl font-bold text-[#010b62] dark:text-white">
                    R${product.price.toFixed(2)}{" "}
                    <span className="text-base">à vista</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-light">
                    menor preço atual
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
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
                className="flex items-center text-blue-700 hover:underline"
                onClick={() => setShowForm(false)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Voltar
              </button>
            </header>

            <div className="flex gap-10 items-start w-full">
              {/* Left Column: Product Details and Ratings */}
              <div className="space-y-8">
                {/* Top Banner */}
                <div className="bg-[#000080] text-white px-4 py-2 rounded-md flex items-center gap-2 w-fit">
                  <Crown className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    Top #1 - Mouses gamers custo-benefício
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-[#000080] mb-4">
                  {product.name}
                </h1>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Thumbnails */}
                  <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                    {product.images.map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        width={80}
                        height={80}
                        className="border rounded-md object-cover shrink-0"
                      />
                    ))}
                  </div>
                  {/* Main Image */}
                  <Image
                    src={
                      product.images[selectedThumb] ||
                      product.image ||
                      "/placeholder.svg"
                    }
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-contain w-full h-auto max-w-full"
                  />
                </div>

                {/* Public Rating */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 text-[#010b62]">
                    Nota do Público
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl font-bold text-orange-500">
                      {formatRating(product.rating)}
                    </span>
                    <div className="flex flex-col">
                      <StarRatingDisplay rating={4.9} />
                      <span className="text-sm text-gray-500">
                        12,321 avaliações
                        {/* Adicionar tratamento se receber nulo */}
                      </span>
                    </div>
                  </div>

                  {/* Rating Distribution Bars */}
                  <div className="space-y-2">
                    <RatingBar label="5" percentage={90} />
                    <RatingBar label="4" percentage={70} />
                    <RatingBar label="3" percentage={40} />
                    <RatingBar label="2" percentage={20} />
                    <RatingBar label="1" percentage={10} />
                  </div>
                </div>

                {/* Evaluations by Characteristics */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 text-[#010b62]">
                    Avaliações por características
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <CharacteristicRating label="Performance" rating={4.5} />
                    <CharacteristicRating
                      label="Custo-benefício"
                      rating={4.0}
                    />
                    <CharacteristicRating label="Conforto" rating={3.5} />
                    <CharacteristicRating label="Peso" rating={4.0} />
                    <CharacteristicRating label="Durabilidade" rating={3.0} />
                  </div>
                </div>
              </div>

              {/* Right Column: Review Form */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#000080]">
                  Avaliar Produto
                </h2>
                <form className="space-y-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="review-title"
                      className="text-sm text-gray-600"
                    >
                      Título da avaliação
                    </Label>
                    <Input
                      id="review-title"
                      placeholder=""
                      className="border border-blue-700 focus:border-blue-900"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="review-description"
                      className="text-sm text-gray-600"
                    >
                      Descrição da avaliação
                    </Label>
                    <Textarea
                      id="review-description"
                      placeholder=""
                      rows={5}
                      className="border border-blue-700 focus:border-blue-900"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="purchase-store"
                      className="text-sm text-gray-600"
                    >
                      Loja / Site da compra
                    </Label>
                    <Input
                      id="purchase-store"
                      placeholder=""
                      className="border border-blue-700 focus:border-blue-900"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="price-paid"
                      className="text-sm text-gray-600"
                    >
                      Valor pago
                    </Label>
                    <Input
                      id="price-paid"
                      placeholder=""
                      type="number"
                      className="border border-blue-700 focus:border-blue-900"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="time-of-use"
                      className="text-sm text-gray-600"
                    >
                      Tempo de uso
                    </Label>
                    <Input
                      id="time-of-use"
                      placeholder=""
                      className="border border-blue-700 focus:border-blue-900"
                    />
                  </div>

                  {/* Form Characteristic Ratings */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <FormCharacteristicRating label="Performance" />
                    <FormCharacteristicRating label="Custo-benefício" />
                    <FormCharacteristicRating label="Conforto" />
                    <FormCharacteristicRating label="Peso" />
                    <FormCharacteristicRating label="Durabilidade" />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#000080] hover:bg-[#000060] text-white py-3 text-lg font-semibold"
                  >
                    Enviar Avaliação
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
