"use client";

import Hero from "@/src/components/Hero";
import ProductCarousel from "@/src/components/ProductCarousel";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { Product } from "@/src/types/Product";
import AdSensePlaceholder from "@/src/components/TestAdPlaceholder";
import LoadingOrEmpty from "@/src/components/LoadingOrEmpty";
//teste comentário
// outro comentário
export default function Page() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllProducts() {
      console.log("Fetching all products from Supabase...");
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("rank", { ascending: true });

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        console.log("Fetched products:", data);
        if (data) setAllProducts(data);
      }

      setLoading(false);
    }

    fetchAllProducts();
  }, []);

  const productsMouse = useMemo(
    () => allProducts.filter((p) => p.category === "mouse"),
    [allProducts]
  );
  const productsKeyboard = useMemo(
    () => allProducts.filter((p) => p.category === "teclado"),
    [allProducts]
  );

  return (
    <div className="min-h-screen p-4 dark:bg-[#030712]">
      <Hero />

      <section className="px-4 py-10 flex justify-center">
        <div className="max-w-7xl w-full p-6">
          <span className="text-gray-500">Top 10</span>
          <h2 className="text-[#010b62] text-xl font-semibold mb-6 text-left dark:text-white">
            Mouses gamers custo-benefício
          </h2>

          <LoadingOrEmpty
            loading={loading}
            items={productsMouse}
            renderEmpty="Nenhum produto encontrado."
            renderContent={(items) => <ProductCarousel products={items} />}
          />
        </div>
      </section>

      <AdSensePlaceholder />

      <section className="px-4 py-10 flex justify-center">
        <div className="max-w-7xl w-full p-6">
          <span className="text-gray-500">Top 10</span>
          <h2 className="text-[#010b62] text-xl font-semibold mb-6 text-left dark:text-white">
            Teclados gamers custo-benefício
          </h2>

          <LoadingOrEmpty
            loading={loading}
            items={productsKeyboard}
            renderEmpty="Nenhum produto encontrado."
            renderContent={(items) => <ProductCarousel products={items} />}
          />
        </div>
      </section>
    </div>
  );
}
