import { Product } from "@/src/types/Product";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({
  id,
  rank,
  name,
  rating,
  image,
}: Product) {
  const getMedal = (rank?: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="border border-[#010b62] dark:border-white rounded-xl p-4 text-white w-full min-h-[380px] flex flex-col justify-between">
      {/* Medalha e Rank */}
      {rank && rank <= 10 && (
        <div className="text-[#010b62] dark:text-white mb-2 text-sm font-semibold flex items-center gap-1">
          {rank <= 3 && <span className="text-lg">{getMedal(rank)}</span>}
          <span>TOP #{rank}</span>
        </div>
      )}

      {/* Nome */}
      <h3 className="text-[#010b62] dark:text-white text-sm font-medium line-clamp-2 mb-2">
        {name}
      </h3>

      {/* Imagem */}
      <div className="relative w-28 h-28 my-4 mx-auto">
        <Image
          src={image}
          alt={`Imagem do ${name}`}
          fill
          className="object-contain"
        />
      </div>

      {/* Nota Avaliação */}
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-1 text-[#FFB24B] font-semibold text-md">
          <span>⭐</span>
          <span>{rating != null ? rating.toFixed(1) : "0.0"}</span>
        </div>
        <p className="text-sm text-[#010b62]/90 dark:text-white">
          Nota Avaliup
        </p>
      </div>

      {/* Botão */}
      <Link href={`/produto/${id}`} className="w-full mt-4">
        <button className="bg-[#010b62] hover:bg-cyan-600 transition text-white text-sm px-4 py-2 rounded w-full">
          Ver avaliações
        </button>
      </Link>
    </div>
  );
}
