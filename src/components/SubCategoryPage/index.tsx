"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { Product } from "@/src/types/Product";
import ProductCard from "@/src/components/ProductCard";
import dynamic from "next/dynamic";
import { Pagination } from "@/src/components/Pagination";
import AdBanner from "../AdBanner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
  slug: string;
}

const slugToSubcategoryMap: Record<string, string> = {
  "low-end": "low-end",
  "mid-end": "mid-end",
  "high-end": "high-end",
};

export default function SubcategoryPage({ slug }: Props) {
  const ProductCarousel = dynamic(
    () => import("@/src/components/ProductCarousel"),
    { ssr: false }
  );

  const [categoriesFilter, setCategoriesFilter] = useState<string[]>([]);
  const subcategory = slugToSubcategoryMap[slug];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      let query = supabase
        .from("products")
        .select("*")
        .eq("subcategory", subcategory);

      if (categoriesFilter.length > 0) {
        query = query.in("category", categoriesFilter);
      }

      query = query.order("rank", { ascending: true });

      const { data, error } = await query;

      if (!error && data) setProducts(data);

      setLoading(false);
    }

    if (subcategory) fetchProducts();
  }, [subcategory, categoriesFilter]);

  const topProducts = products.slice(0, 10);
  const otherProducts = products.slice(10);

  const PRODUCTS_PER_PAGE = 25;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(otherProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = otherProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const categories = [
    "mouse",
    "teclado",
    "headset",
    "mousepad",
    "controle",
    "monitor",
    "cpu",
    "memoria-ram",
    "ssd",
    "gpu",
  ];

  const categoryLabels: Record<string, string> = {
    mouse: "Mouse",
    teclado: "Teclado",
    headset: "Headset",
    mousepad: "Mousepad",
    controle: "Controle",
    monitor: "Monitor",
    cpu: "Processador",
    gpu: "Placa de vídeo",
    ssd: "SSD",
    "memoria-ram": "Memória RAM",
  };

  return (
    <div className="py-4 w-full px-4">
      <section className="px-2 py-4 flex justify-center">
        <div className="w-full px-4 pb-2">
          <span className="font-medium text-lg text-[#010B62]/60 dark:text-[#FFFFFF]/60">
            Top 10
          </span>

          <h1 className="text-3xl font-bold text-[#010b62] dark:text-white mb-6 text-left">
            {slug.charAt(0).toUpperCase() + slug.slice(1)} – Subcategoria
          </h1>

          <div className="mb-6 width-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-md border-gray-300 bg-white dark:bg-[#01BAEF] dark:hover:bg-[#33C9F2] text-[#010b62] hover:bg-[#010B62] hover:text-white dark:text-gray-200 shadow-sm cursor-pointer"
                >
                  Filtros de categoria
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-64 p-4 rounded-xl shadow-lg bg-white dark:bg-[#030712] border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-sm mb-3 text-[#010b62] dark:text-gray-100">
                  Selecionar categorias
                </p>

                <ScrollArea className="h-48">
                  <div className="flex flex-col gap-3">
                    {categories.map((cat) => (
                      <div key={cat} className="flex items-center gap-2">
                        <Checkbox
                          checked={categoriesFilter.includes(cat)}
                          onCheckedChange={() => {
                            setCategoriesFilter((prev) =>
                              prev.includes(cat)
                                ? prev.filter((c) => c !== cat)
                                : [...prev, cat]
                            );
                          }}
                          className="
                            border-[#010B62] dark:border-gray-300
                            data-[state=checked]:bg-[#010B62]
                            data-[state=checked]:border-[#010B62]
                            dark:data-[state=checked]:bg-[#01BAEF]
                            dark:data-[state=checked]:border-[#01BAEF]
                          "
                        />
                        <span className="capitalize text-sm text-[#010b62] dark:text-white">
                          {categoryLabels[cat] || cat}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Button
                  variant="ghost"
                  className="mt-4 w-full text-sm bg-[#010b62] border hover:border-[#010b62] hover:text-[#010b62] text-white dark:bg-[#01BAEF] dark:hover:bg-[#33C9F2] dark:text-white cursor-pointer"
                  onClick={() => setCategoriesFilter([])}
                >
                  Limpar filtros
                </Button>
              </PopoverContent>
            </Popover>
          </div>

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
            <AdBanner slot="2165327748" height={55} margin="my-6" />
          )}

          {otherProducts.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-300 mt-10 text-lg">
              Nenhum produto encontrado para os filtros selecionados.
            </p>
          )}

          {otherProducts.length > 0 && (
            <section className="px-4 py-10 flex justify-center">
              <div className="w-full px-4 py-8">
                <h2 className="text-xl font-semibold text-[#010b62] dark:text-white mb-4">
                  Outros produtos {slug}
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
