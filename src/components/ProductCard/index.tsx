"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/src/types/Product";
import Image from "next/image";

export default function ProductCard({
  id,
  rank,
  name,
  rating,
  image,
}: Product) {
  const router = useRouter();
  const [cardLoading, setCardLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const getMedal = (rank?: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  async function navigateToProduct() {
    await new Promise((r) => setTimeout(r, 300)); // pequeno delay para feedback visual
    router.push(`/produto/${id}`);
  }

  async function handleCardClick() {
    setCardLoading(true);
    await navigateToProduct();
  }

  async function handleButtonClick(e: React.MouseEvent) {
    e.stopPropagation(); // evita disparar clique do card
    setBtnLoading(true);
    await navigateToProduct();
  }

  return (
    <div
      onClick={handleCardClick}
      className={`border border-[#010b62] dark:border-white rounded-xl p-4 text-white w-full min-h-[380px] flex flex-col justify-between cursor-pointer hover:border-3 hover:shadow-lg
        ${cardLoading ? "opacity-70 pointer-events-none" : ""}
      `}
    >
      {rank && rank <= 10 && (
        <div className="text-[#010b62] dark:text-white mb-2 text-sm font-semibold flex items-center gap-1">
          {rank <= 3 && <span className="text-lg">{getMedal(rank)}</span>}
          <span>TOP #{rank}</span>
        </div>
      )}

      <h3 className="text-[#010b62] dark:text-white text-sm font-medium line-clamp-2 mb-2">
        {name}
      </h3>

      <div className="relative w-28 h-28 my-4 mx-auto">
        <Image
          src={image}
          alt={`Imagem do ${name}`}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex flex-col items-start mt-auto">
        <div className="flex items-center gap-1 text-[#FFB24B] font-semibold text-md">
          <span>⭐</span>
          <span>{rating != null ? rating.toFixed(1) : "0.0"}</span>
        </div>
        <p className="text-sm text-[#010b62]/90 dark:text-white">
          Nota Avaliup
        </p>
      </div>

      <button
        disabled={btnLoading}
        onClick={handleButtonClick}
        className={`bg-[#010b62] hover:bg-cyan-600 transition text-white text-sm px-4 py-2 rounded w-full mt-4 flex justify-center items-center cursor-pointer
          ${btnLoading ? "opacity-70 cursor-not-allowed" : ""}
        `}
      >
        {btnLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Carregando...
          </>
        ) : (
          "Ver avaliações"
        )}
      </button>
    </div>
  );
}
