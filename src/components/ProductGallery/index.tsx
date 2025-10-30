"use client";

import Image from "next/image";
import React, { useMemo } from "react";

interface ProductGalleryProps {
  images?: string[];
  selectedThumb: number;
  setSelectedThumb: (index: number) => void;
  productName: string;
  preloadFirst?: boolean; // pré-carregar primeira imagem
  align?: "right" | "center"; // controle de alinhamento
}

export default function ProductGallery({
  images = [],
  selectedThumb,
  setSelectedThumb,
  productName,
  preloadFirst = false,
  align = "right",
}: ProductGalleryProps) {
  const thumbnails = useMemo(
    () =>
      images.map((thumbUrl, index) => (
        <button
          key={index}
          onClick={() => setSelectedThumb(index)}
          className={`w-12 h-12 border rounded-md flex items-center justify-center transition-colors ${selectedThumb === index
            ? "border-[#010b62] dark:border-[#01BAEF] dark:bg-gray-800 border-2"
            : "border-[#010b62] dark:border-[#01BAEF]"
            }`}
        >
          <Image
            src={thumbUrl || "/placeholder.svg"}
            alt={`${productName} thumbnail ${index + 1}`}
            width={40}
            height={40}
            className="object-contain"
            loading="lazy"
          />
        </button>
      )),
    [images, selectedThumb, productName, setSelectedThumb]
  );

  // Classes para alinhar a imagem principal
  const mainImageWrapperClasses =
    align === "center"
      ? "w-[320px] h-[320px] flex items-center justify-center rounded-lg mx-auto"
      : "w-[320px] h-[320px] flex items-center justify-center rounded-lg mt-4 lg:mt-[15%]";

  return (
    <div
      className={`flex gap-2 ${align === "center" ? "flex-col md:flex-row" : "flex-row"
        }`}
    >
      {/* Miniaturas */}
      <div className="flex flex-col gap-2 min-w-[56px]">{thumbnails}</div>

      {/* Imagem principal */}
      <div className={mainImageWrapperClasses}>
        <Image
          src={images?.[selectedThumb] || "/placeholder.svg"}
          alt={productName}
          width={600}
          height={600}
          className="object-contain"
          priority={preloadFirst} // pré-carrega a primeira imagem se necessário
        />
      </div>
    </div>
  );
}
