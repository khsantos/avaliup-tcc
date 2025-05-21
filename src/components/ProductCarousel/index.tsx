"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ProductCard from "../ProductCard";
type Product = {
  rank: number;
  name: string;
  description: string;
  rating: number;
  imageUrl: string;
};

type ProductCarouselProps = {
  products: Product[];
};

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 4.2,
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

  return (
    <div className="overflow-x-hidden pr-4">
      <div ref={sliderRef} className="flex gap-3 min-w-full pb-2 pl-1">
        {products.map((product) => (
          <div key={product.rank} className="keen-slider__slide">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}
