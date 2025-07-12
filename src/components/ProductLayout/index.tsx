"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Star, Heart, Share2, Award } from "lucide-react";
import Image from "next/image";
import { Product } from "@/src/types/Product";

export default function ProductLayout({ product }: { product: Product }) {
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const thumbnails = product.images;

  const ratingBreakdown = [
    { stars: 5, percentage: 75 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 6 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 1 },
  ];

  const characteristics = [
    { name: "Performance", rating: 4.5 },
    { name: "Custo-benefício", rating: 4.8 },
    { name: "Conforto", rating: 4.3 },
    { name: "Preço", rating: 4.6 },
    { name: "Durabilidade", rating: 4.2 },
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

  const renderStars = (rating: number, showEmpty = true) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = showEmpty ? 5 - fullStars - (hasHalfStar ? 1 : 0) : 0;

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-4 h-4 fill-[#FFB24B] text-[#FFB24B]"
          />
        ))}
        {hasHalfStar && (
          <Star className="w-4 h-4 fill-[#FFB24B] text-[#FFB24B]" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="w-[80%] mx-auto py-10">
      <div className="flex gap-10 items-start">
        <div className="flex min-w-fit gap-8">
          <div className="flex flex-col gap-2">
            {thumbnails.map((thumbUrl, index) => (
              <button
                key={index}
                onClick={() => setSelectedThumb(index)}
                className={`w-12 h-12 border rounded-lg flex items-center justify-center transition-colors ${
                  selectedThumb === index
                    ? "border-[#010b62] bg-gray-100 border-2"
                    : "border-[#010b62] bg-gray-50"
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
          <div className="w-64 h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <Image
              src={
                thumbnails[selectedThumb] || product.image || "/placeholder.svg"
              }
              alt={product.name}
              width={200}
              height={200}
              className="object-contain mt-35"
            />
          </div>
        </div>

        <div className="flex-1 space-y-4 self-end">
          <div className="bg-[#010b62] text-white px-4 py-2 rounded-lg flex items-center gap-2 w-fit">
            <Award className="w-5 h-5 text-[#FFB24B]" />
            <span className="text-xl font-semibold">
              {getRankingText(product.rank, product.category)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-[#010b62]">
              {product.name}
            </h1>
            <Button
              variant="ghost"
              size="lg"
              className="text-[#010b62] mb-6 hover:bg-[#010b62] hover:text-white "
            >
              <Share2 className="w-12 h-12" />
            </Button>
          </div>

          <div className="flex items-center gap-6">
            {product.rating !== null ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-[#FFB24B]">
                    {product.rating.toFixed(1)}
                  </span>
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-600 text-sm">
                  {product.review_count.toLocaleString()} avaliações
                </span>
              </>
            ) : (
              <span className="text-gray-500 text-sm italic">
                Sem avaliações ainda
              </span>
            )}
          </div>

          <div className="space-y-1">
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-2">
                <span className="text-xs text-[#010b62] w-2">{item.stars}</span>
                <Star className="w-3 h-3 fill-[#FFB24B] text-[#FFB24B]" />
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-48">
                  <div
                    className="bg-[#010b62] h-1.5 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{item.stars}</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-bold text-[#010b62] mb-2">
              Avaliações por características
            </h3>
            <div className="flex gap-0">
              {characteristics.map((char, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-start px-4 ${
                    index !== characteristics.length - 1
                      ? "border-r border-[#010b62]"
                      : ""
                  }`}
                >
                  <div className="text-xs text-[#010b62] mb-1">{char.name}</div>
                  {renderStars(char.rating)}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <div className="text-2xl font-bold text-[#010b62]">
              R${product.price.toFixed(2)}{" "}
              <span className="text-base">à vista</span>
            </div>
            <div className="text-sm text-gray-600 font-light">
              menor preço atual
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button className="bg-[#010b62] hover:bg-[#0060B1] text-white px-6 cursor-pointer">
              Avaliar Produto
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={
                isWishlisted
                  ? "text-white bg-[#010b62]"
                  : "text-[#010b62] border border-[#010b62] cursor-pointer hover:text-white hover:bg-[#010b62]"
              }
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
