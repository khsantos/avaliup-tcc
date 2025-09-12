"use client";

import { useKeenSlider } from "keen-slider/react";
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

  function updateFades(slider: any) {
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
    created(slider) { updateFades(slider); },
    slideChanged(slider) { updateFades(slider); },
    updated(slider) { updateFades(slider); },
  });

  // Garantir atualização quando instancia disponível
  useEffect(() => {
    if (instanceRef.current) updateFades(instanceRef.current);
  }, [instanceRef]);

  if (!mounted) return null;

  return (
    <div className="overflow-x-hidden relative" style={{ scrollbarWidth: "none" }}>
      {showLeftFade && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/70 dark:from-[#030712]/70 to-transparent z-10 transition-opacity" />
      )}
      {showRightFade && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/70 dark:from-[#030712]/70 to-transparent z-10 transition-opacity" />
      )}
      {showLeftFade && (
        <button
          onClick={() => instanceRef.current?.prev()}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 dark:bg-[#030712]/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-[#030712] transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {showRightFade && (
        <button
          onClick={() => instanceRef.current?.next()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 dark:bg-[#030712]/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-[#030712] transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      )}
      <div
        ref={sliderRef}
        className="keen-slider pb-2 px-1" /* slider controla spacing */
      >
        {products.slice(0, 10).map((product) => (
          <div key={product.id} className="keen-slider__slide flex justify-center p-1">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}