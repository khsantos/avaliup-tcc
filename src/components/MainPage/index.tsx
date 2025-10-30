"use client";

import Hero from "@/src/components/Hero";
import ProductCarousel from "@/src/components/ProductCarousel";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import LoadingOrEmpty from "@/src/components/LoadingOrEmpty";
import { Product } from "@/src/types/Product";

const PLACEHOLDER_IMAGE = "/placeholder-image.webp";

const CATEGORIES = [
  { key: "mouse", title: "Mouses gamers custo-benefício" },
  { key: "teclado", title: "Teclados gamers custo-benefício" },
  { key: "headset", title: "Headsets gamers custo-benefício" },
  { key: "mousepad", title: "Mousepads gamers custo-benefício" },
  { key: "controle", title: "Controles gamers custo-benefício" },
] as const;

function mapToProduct(item: Product): Product {
  return {
    id: item.id ?? "",
    name: item.name ?? "",
    price: typeof item.price === "number" ? item.price : undefined,
    image: item.image ?? PLACEHOLDER_IMAGE,
    images: item.images ?? undefined,
    category: item.category ?? undefined,
    subcategory: item.subcategory ?? undefined,
    isActive: item.isActive ?? undefined,
    rank: typeof item.rank === "number" ? item.rank : undefined,
    rating: typeof item.rating === "number" ? item.rating : undefined,
    review_count:
      typeof item.review_count === "number" ? item.review_count : undefined,
    lowestPrice: typeof item.lowestPrice === "number" ? item.lowestPrice : null,
    lowestPlatform: item.lowestPlatform ?? null,
  };
}

export default function MainPage() {
  const [dataByCategory, setDataByCategory] = useState<
    Record<string, Product[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchCategory(category: string): Promise<Product[]> {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, rank, rating, image, category")
        .eq("category", category)
        .order("rank", { ascending: true })
        .limit(10);

      if (error) {
        console.error(`Erro ao buscar ${category}:`, error);
        return [];
      }

      return (data ?? []).map(mapToProduct);
    }

    async function fetchAll() {
      setLoading(true);
      try {
        const results = await Promise.all(
          CATEGORIES.map((c) => fetchCategory(c.key))
        );
        if (!mounted) return;

        const grouped = Object.fromEntries(
          CATEGORIES.map((c, i) => [c.key, results[i]])
        );

        setDataByCategory(grouped);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen p-4 dark:bg-[#030712]">
      <Hero />

      {CATEGORIES.map((c) => (
        <section key={c.key} className="px-4 py-10 flex justify-center">
          <div className="py-8 w-full px-4">
            <span className="font-medium text-lg text-[#010B62]/60 dark:text-[#FFFFFF]/60">
              Top 10
            </span>
            <h2 className="text-[#010b62] text-3xl font-semibold mb-6 text-left dark:text-white">
              {c.title}
            </h2>

            <LoadingOrEmpty
              loading={loading}
              items={dataByCategory[c.key] ?? []}
              renderEmpty="Nenhum produto encontrado."
              renderContent={(items) => <ProductCarousel products={items} />}
            />
          </div>
        </section>
      ))}
    </div>
  );
}