"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ProductCard from "../ProductCard";
import { Product } from "@/src/types/Product";
import { useEffect, useState } from "react";

type ProductCarouselProps = {
  products: Product[];
};

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [mounted, setMounted] = useState(false);

  // ✅ Aguarda o componente montar (evita problemas de SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 4,
      spacing: 12,
    },
    mode: "free-snap",
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 1.2, spacing: 12 },
      },
      "(max-width: 1024px)": {
        slides: { perView: 2, spacing: 14 },
      },
    },
  });

  if (!mounted) return null; // evita erro de layout quebrado

  return (
    <div className="overflow-x-hidden pr-4" style={{ scrollbarWidth: "none" }}>
      <div
        ref={sliderRef}
        className="keen-slider flex gap-3 pb-2 pl-1 pr-8 w-auto overflow-visible"
      >
        {products.slice(0, 10).map((product) => (
          <div
            key={product.id}
            className="keen-slider__slide min-w-[250px] max-w-[250px]"
          >
            <ProductCard {...product} />
          </div>
        ))}

        {/* slide fantasma opcional */}
        <div className="keen-slider__slide w-64" />
      </div>
    </div>
  );
}
