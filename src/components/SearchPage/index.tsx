"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import ProductCard from "@/src/components/ProductCard";
import { Product } from "@/src/types/Product";
import { useSearchParams } from "next/navigation";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("query") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;

    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${q}%`);

      if (error) console.error(error);
      else setProducts(data as Product[]);

      setLoading(false);
    };

    fetchProducts();
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#010b62] dark:text-white mb-6">
        Resultados para: <span className="italic"> {q}</span>
      </h1>

      {loading ? (
        <p></p>
      ) : products.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-300">
          Nenhum produto encontrado.
        </p>
      )}
    </div>
  );
}
