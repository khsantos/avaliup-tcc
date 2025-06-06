import { Product } from "@/src/types/Product";
import Image from "next/image";

export default function ProductCard({ rank, name, rating, image }: Product) {
  return (
    <div className="border border-[#010b62] dark:border-white rounded-xl p-4 flex flex-col items-center text-white w-64 h-[360px]">
      <div className="text-[#010b62] dark:text-white self-start mb-2 text-sm font-semibold flex items-center gap-1 ">
        <span className="text-[#FF9800] text-lg">Ö</span> TOP #{rank}
      </div>

      <h3 className="text-[#010b62] dark:text-white text-center text-sm font-medium ">
        {name}
      </h3>

      <div className="relative w-28 h-28 my-4">
        <Image
          src={image}
          alt={`Imagem do ${name}`}
          fill
          className="object-contain"
        />
      </div>

      {rating != null ? (
        <div className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
          <span>⭐</span>
          <span>{rating.toFixed(1)}</span>
        </div>
      ) : (
        <div className="text-sm text-yellow-400">
          <span>⭐</span>0.0
        </div>
      )}
      <p className="text-xs text-[#010b62] mb-3">Nota Avaliup</p>

      <button className="bg-[#010b62] hover:bg-cyan-600 transition text-white text-sm px-4 py-2 rounded w-full">
        Ver avaliações
      </button>
    </div>
  );
}
