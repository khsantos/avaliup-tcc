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
      ? "w-full max-w-[320px] h-[320px] flex items-center justify-center rounded-lg mx-auto sm:max-w-[240px] sm:h-[240px] md:max-w-[280px] md:h-[280px]"
      : "w-full max-w-[320px] h-[320px] flex items-center justify-center rounded-lg mt-4 lg:mt-[15%] md:max-w-[280px] md:h-[280px] sm:max-w-[240px] sm:h-[240px]";

  return (
    <div className="flex flex-col md:flex-row gap-2">
      {/* Miniaturas: alinhadas à esquerda no mobile, coluna à esquerda no desktop */}
      <div className="flex flex-row flex-wrap gap-2 justify-start mt-4 order-2 md:order-1 md:mt-0 md:flex-col md:flex-nowrap w-full md:w-auto">
        {thumbnails}
      </div>
      {/* Imagem principal: acima em mobile (order-1), à direita em desktop (order-2) */}
      <div className={`${mainImageWrapperClasses} order-1 md:order-2`}>
        <Image
          src={images?.[selectedThumb] || "/placeholder.svg"}
          alt={productName}
          width={600}
          height={600}
          className="object-contain"
          priority={preloadFirst}
        />
      </div>
    </div>
  );
}
