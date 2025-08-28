"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import ProductCard from "@/src/components/ProductCard";

interface RelatedProductsProps {
  productId: number;
}

interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  rating: number;
}

export const RelatedProducts = ({ productId }: RelatedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchRelated() {
      const { data: currentProduct } = await supabase
        .from("products")
        .select("category")
        .eq("id", productId)
        .single();

      if (!currentProduct) return;

      const { data, error } = await supabase
        .from("products")
        .select("id, name, image, category, rating")
        .eq("category", currentProduct.category)
        .neq("id", productId);

      if (!error && data) {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 5));
      }
    }

    fetchRelated();
  }, [productId]);

  if (!products.length) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6 dark:text-white text-[#010b62]">
        Produtos relacionados
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            image={product.image}
            rating={product.rating}
            // rank não é usado aqui, então podemos omitir
          />
        ))}
      </div>
    </div>
  );
};
