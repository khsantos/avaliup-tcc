"use client";

import React, { useEffect, useState } from "react";
import { useSupabase } from "@/src/contexts/supabase-provider";
import ProductCard from "@/src/components/ProductCard";
import { Product } from "@/src/types/Product";

export default function FavoritesTab() {
  const { supabase, user } = useSupabase();
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      const { data: favs, error } = await supabase
        .from("user_favorites")
        .select("product_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Erro ao buscar favoritos:", error);
        return;
      }

      if (!favs || favs.length === 0) {
        setFavorites([]);
        return;
      }

      const productIds = favs.map((f) => f.product_id);

      const { data: products, error: prodError } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds)
        .order("rank", { ascending: true });

      if (prodError) {
        console.error("Erro ao buscar produtos favoritos:", prodError);
        return;
      }

      setFavorites(products || []);
    };

    fetchFavorites();
  }, [supabase, user]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {favorites.length > 0 ? (
        favorites.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            rank={item.rank}
            name={item.name}
            rating={item.rating || 0}
            image={item.image}
          />
        ))
      ) : (
        <p className="text-muted-foreground">Nenhum favorito ainda</p>
      )}
    </div>
  );
}
