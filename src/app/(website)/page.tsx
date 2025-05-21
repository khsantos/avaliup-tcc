"use client";

import Hero from "@/src/components/Hero";
import products from "@/src/data/homeData";
import ProductCarousel from "@/src/components/ProductCarousel";

export default function Page() {
  return (
    <div className="min-h-screen  p-4 space-y-10 dark:bg-[#030712] border rounded-md">
      <Hero />
      <div className=" px-4 py-10 flex justify-center">
        <div className=" max-w-7xl w-full p-6">
          <span className="text-gray-500">Top 10</span>
          <h2 className="text-[#010b62] text-xl font-semibold mb-6 text-left dark:text-white">
            Mouses gamers custo-benefício
          </h2>
          <ProductCarousel products={products} />
        </div>
      </div>
    </div>
  );
}
