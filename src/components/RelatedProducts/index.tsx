"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/src/components/ui/card";

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
          <Card
            key={product.id}
            className="flex flex-col items-center justify-between border border-[#010b62] dark:border-white dark:bg-[#030712] rounded-xl shadow-md p-4"
          >
            {/* Nome */}
            <h3 className="text-sm font-semibold text-left dark:text-white text-[#010b62] line-clamp-2 mb-3">
              {product.name}
            </h3>

            {/* Imagem */}
            <div className="w-28 h-28 flex items-center justify-center mb-3">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={112}
                height={112}
                className="object-contain"
              />
            </div>

            {/* Nota */}
            <div className="flex flex-col items-start self-start">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#FFB24B] fill-[#FFB24B]" />
                <span className="text-sm font-bold text-[#FFB24B]">
                  {product.rating?.toFixed(1) || "Sem nota"}
                </span>
              </div>
              <p className="text-sm text-[#010b62]/70 dark:text-white/50">
                Nota Avali.up
              </p>
            </div>

            {/* Botão */}
            <Link
              href={`/produto/${product.id}`}
              className="w-full bg-[#010b62] hover:bg-[#021052] text-white text-sm dark:bg-[#01BAEF] hover:dark:bg-[#01BAFE] font-medium py-2 rounded-md text-center transition -mt-2"
            >
              Ver avaliações
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};
