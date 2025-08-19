"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

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
      // Buscar categoria do produto atual
      const { data: currentProduct } = await supabase
        .from("products")
        .select("category")
        .eq("id", productId)
        .single();

      if (!currentProduct) return;

      // Buscar produtos da mesma categoria (exclui o atual)
      const { data, error } = await supabase
        .from("products")
        .select("id, name, image, category, rating")
        .eq("category", currentProduct.category)
        .neq("id", productId);

      if (!error && data) {
        // Embaralhar no client-side
        const shuffled = data.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 5)); // pega só 5
      }
    }

    fetchRelated();
  }, [productId]);

  if (!products.length) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6 text-white">
        Produtos relacionados
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-[#0A0A12] rounded-xl shadow-md flex flex-col items-center p-4"
          >
            {/* Imagem */}
            <div className="w-28 h-28 flex items-center justify-center">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={112}
                height={112}
                className="object-contain"
              />
            </div>

            {/* Nome */}
            <h3 className="mt-4 text-sm font-semibold text-center text-white line-clamp-2">
              {product.name}
            </h3>

            {/* Nota */}
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">
                {product.rating?.toFixed(1) || "0"}
              </span>
            </div>
            <p className="text-xs text-gray-400 -mt-1">Nota Avali.up</p>

            {/* Botão */}
            <Link
              href={`/produto/${product.id}`}
              className="mt-3 w-full bg-[#01BAEF] hover:bg-[#009FCC] text-white text-sm font-medium py-2 rounded-md text-center transition"
            >
              Ver avaliações
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
