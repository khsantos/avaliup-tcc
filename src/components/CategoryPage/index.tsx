"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { Product } from "@/src/types/Product";
import ProductCard from "@/src/components/ProductCard";
import dynamic from "next/dynamic";
import { Pagination } from "@/src/components/Pagination";

interface CategoryPageProps {
  slug: string;
}

const slugToCategoryMap: Record<string, string> = {
  mouses: "mouse",
  teclados: "teclado",
  headsets: "headset",
  monitores: "monitor",
  mousepads: "mousepad",
  controles: "controle",
  processadores: "cpu",
  ssds: "ssd",
  "memorias-ram": "memoria-ram",
  "placas-de-video": "gpu",
};

export default function CategoryPage({ slug }: CategoryPageProps) {
  const ProductCarousel = dynamic(
    () => import("@/src/components/ProductCarousel"),
    {
      ssr: false,
    }
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = slugToCategoryMap[slug];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .order("rank", { ascending: true });

      if (!error && data) setProducts(data);

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
    <div className="py-4 w-full px-4">
      <section className="px-2 py-4 flex justify-center">
        <div className="w-full px-4 pb-2">
          <span className="font-medium text-lg text-[#010B62]/60 dark:text-[#FFFFFF]/60">
            Top 10
          </span>
          <h1 className="text-3xl font-bold text-[#010b62] dark:text-white mb-6 text-left">
            {slug.charAt(0).toUpperCase() + slug.slice(1)} Gamers Custo-Benefício
          </h1>
          <div className="-ml-1">
            <ProductCarousel products={topProducts} />
          </div>
        </div>

      </section>

      {loading ? (
        <p className="text-gray-500">Carregando produtos...</p>
      ) : (
        <>
          {otherProducts.length > 0 && (
            <section className="px-4 py-10 flex justify-center">
              <div className="w-full px-4 py-8">
                <h2 className="text-xl font-semibold text-[#010b62] dark:text-white mb-4">
                  Outros {slug} gamers custo-benefício
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
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