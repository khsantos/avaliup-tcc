"use client";

import { KeenSliderInstance, useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ProductCard from "../ProductCard";
import { Product } from "@/src/types/Product";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Added import for icons

type ProductCarouselProps = {
  products: Product[];
};

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [mounted, setMounted] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  useEffect(() => setMounted(true), []);

  function updateFades(slider: KeenSliderInstance) {
    const details = slider.track.details;
    setShowLeftFade(details.rel > 0);
    setShowRightFade(details.rel < details.maxIdx);
  }

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 3.5, spacing: 24 }, // ajustado para mostrar parte do 4º card e espaçamento de 24px
    mode: "free-snap",
    breakpoints: {
      "(max-width: 1280px)": { slides: { perView: 3, spacing: 20 } },
      "(max-width: 1024px)": { slides: { perView: 2.4, spacing: 20 } },
      "(max-width: 860px)": { slides: { perView: 2, spacing: 18 } },
      "(max-width: 640px)": { slides: { perView: 1.2, spacing: 16 } },
      "(max-width: 480px)": { slides: { perView: 1, spacing: 14 } },
    },
    created(slider) {
      updateFades(slider);
    },
    slideChanged(slider) {
      updateFades(slider);
    },
    updated(slider) {
      updateFades(slider);
    },
  });

  // Garantir atualização quando instancia disponível
  useEffect(() => {
    if (instanceRef.current) updateFades(instanceRef.current);
  }, [instanceRef]);

  if (!mounted) return null;

  return (
    <div
      className="overflow-x-hidden relative"
      style={{ scrollbarWidth: "none" }}
    >
      {showLeftFade && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/70 dark:from-[#030712]/70 to-transparent z-10 transition-opacity" />
      )}
      {showRightFade && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/70 dark:from-[#030712]/70 to-transparent z-10 transition-opacity" />
      )}

      {/* Always render arrows; disable + dim at extremes */}
      <button
        onClick={() => instanceRef.current?.prev()}
        disabled={!showLeftFade}
        aria-disabled={!showLeftFade}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-[#030712] p-2 rounded-full shadow-md transition-colors border border-[#010b62] dark:border-white ${!showLeftFade
          ? "opacity-40"
          : "hover:bg-[#DAE9FA] dark:hover:bg-[#02394C] cursor-pointer"
          }`}
      >
        <ChevronLeft size={20} className="text-[#010b62] dark:text-white" />
      </button>

      <button
        onClick={() => instanceRef.current?.next()}
        disabled={!showRightFade}
        aria-disabled={!showRightFade}
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-[#030712] p-2 rounded-full shadow-md transition-colors border border-[#010b62] dark:border-white ${!showRightFade
          ? "opacity-40"
          : "hover:bg-[#DAE9FA] dark:hover:bg-[#02394C] cursor-pointer"
          }`}
      >
        <ChevronRight size={20} className="text-[#010b62] dark:text-white" />
      </button>

      <div
        ref={sliderRef}
        className="keen-slider pb-2 px-1" /* slider controla spacing */
      >
        {products.slice(0, 10).map((product) => (
          <div
            key={product.id}
            className="keen-slider__slide flex justify-center p-1"
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}
