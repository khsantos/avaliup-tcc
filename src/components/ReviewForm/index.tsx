"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, Star, Crown } from "lucide-react";
import StarRatingInput from "@/src/components/StarRatingInput";

// Helper component to display star ratings
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

// Helper component for rating distribution bars
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

// Form rating input com StarRatingInput real
function FormCharacteristicRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-sm text-gray-600 mb-1">{label}</span>
      <StarRatingInput value={value} onChange={onChange} />
    </div>
  );
}

export default function ProductReviewPage() {
  const [ratings, setRatings] = useState({
    performance: 0,
    costBenefit: 0,
    comfort: 0,
    weight: 0,
    durability: 0,
  });

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12">
      <header className="mb-6">
        <Link
          href="#"
          className="flex items-center text-blue-700 hover:underline"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Voltar
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Esquerda */}
        <div className="space-y-8">
          <div className="bg-[#000080] text-white px-4 py-2 rounded-md flex items-center gap-2 w-fit">
            <Crown className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">
              Top #1 - Mouses gamers custo-benefício
            </span>
          </div>

          <h1 className="text-3xl font-bold text-[#000080] mb-4">
            Mouse Zaopin-Z2 4K Hotswappable Wireless
          </h1>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {[...Array(4)].map((_, i) => (
                <Image
                  key={i}
                  src="/placeholder.svg?height=80&width=80"
                  alt="Thumb"
                  width={80}
                  height={80}
                  className="border rounded-md object-cover shrink-0"
                />
              ))}
            </div>

            <div className="flex-1 flex justify-center items-center min-w-0">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Main"
                width={400}
                height={400}
                className="object-contain w-full h-auto max-w-full"
              />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Nota do Público</h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-bold text-orange-500">4.9</span>
              <div className="flex flex-col">
                <StarRatingDisplay rating={4.9} />
                <span className="text-sm text-gray-500">12,321 avaliações</span>
              </div>
            </div>

            <div className="space-y-2">
              <RatingBar label="5" percentage={90} />
              <RatingBar label="4" percentage={70} />
              <RatingBar label="3" percentage={40} />
              <RatingBar label="2" percentage={20} />
              <RatingBar label="1" percentage={10} />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Avaliações por características
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <FormCharacteristicRating
                label="Performance"
                value={ratings.performance}
                onChange={(v) => setRatings({ ...ratings, performance: v })}
              />
              <FormCharacteristicRating
                label="Custo-benefício"
                value={ratings.costBenefit}
                onChange={(v) => setRatings({ ...ratings, costBenefit: v })}
              />
              <FormCharacteristicRating
                label="Conforto"
                value={ratings.comfort}
                onChange={(v) => setRatings({ ...ratings, comfort: v })}
              />
              <FormCharacteristicRating
                label="Peso"
                value={ratings.weight}
                onChange={(v) => setRatings({ ...ratings, weight: v })}
              />
              <FormCharacteristicRating
                label="Durabilidade"
                value={ratings.durability}
                onChange={(v) => setRatings({ ...ratings, durability: v })}
              />
            </div>
          </div>
        </div>

        {/* Direita */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-[#000080]">Avaliar Produto</h2>
          <form className="space-y-6">
            <div className="grid gap-2">
              <h3 className="text-sm text-gray-600">Título da avaliação</h3>
              <input
                placeholder=""
                className="border border-blue-700 px-4 py-2 rounded-md"
              />
            </div>
            <div className="grid gap-2">
              <h3 className="text-sm text-gray-600">Descrição da avaliação</h3>
              <textarea
                rows={5}
                className="border border-blue-700 px-4 py-2 rounded-md"
              />
            </div>
            <div className="grid gap-2">
              <h3 className="text-sm text-gray-600">Loja / Site da compra</h3>
              <input
                placeholder=""
                className="border border-blue-700 px-4 py-2 rounded-md"
              />
            </div>
            <div className="grid gap-2">
              <h3 className="text-sm text-gray-600">Valor pago</h3>
              <input
                type="number"
                className="border border-blue-700 px-4 py-2 rounded-md"
              />
            </div>
            <div className="grid gap-2">
              <h3 className="text-sm text-gray-600">Tempo de uso</h3>
              <input
                placeholder=""
                className="border border-blue-700 px-4 py-2 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#000080] hover:bg-[#000060] text-white py-3 text-lg font-semibold rounded-md"
            >
              Enviar Avaliação
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
