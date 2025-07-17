"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { Product } from "@/src/types/Product";
import ProductCard from "@/src/components/ProductCard";
import dynamic from "next/dynamic";
import { Pagination } from "@/src/components/Pagination";
import AdSensePlaceholder from "@/src/components/TestAdPlaceholder";

const slugToCategoryMap: Record<string, string> = {
  mouses: "mouse",
  teclados: "teclado",
  headsets: "headset",
  monitores: "monitor",
  mousepads: "mousepad",
  microfones: "microfone",
  processadores: "processador",
  ssds: "ssd",
  "placas-de-video": "placa de vídeo",
};

export default function CategoriaPage() {
  const ProductCarousel = dynamic(
    () => import("@/src/components/ProductCarousel"),
    {
      ssr: false,
    }
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const category = slugToCategoryMap[slug];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .order("rank", { ascending: true });

      if (!error && data) {
        setProducts(data);
      }

      setLoading(false);
    }

    if (category) fetchProducts();
  }, [category]);

  const topProducts = products.slice(0, 10);
  const otherProducts = products.slice(10);

  const PRODUCTS_PER_PAGE = 25;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(otherProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = otherProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="pb-10">
        <h2 className="text-md text-gray-600 dark:text-white">Top 10</h2>
        <h1 className="text-3xl font-bold text-[#010b62] dark:text-white mb-4">
          {slug.charAt(0).toUpperCase() + slug.slice(1)} Gamers Custo-Benefício
        </h1>

        <div className="-mx-1">
          <ProductCarousel products={topProducts} />
        </div>
      </section>

      <AdSensePlaceholder />

      {loading ? (
        <p className="text-gray-500">Carregando produtos...</p>
      ) : (
        <>
          {otherProducts.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-[#010b62] dark:text-white mb-4">
                Outros {slug} gamers custo-benefício
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
