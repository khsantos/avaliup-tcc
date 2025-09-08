"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/src/components/ui/sheet";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import StarRating from "@/src/components/StarRating";
import { supabase } from "@/src/lib/supabase";
import { useSupabase } from "@/src/contexts/supabase-provider";
import { FavoriteProduct } from "@/src/types/FavoriteProduct";
import { useEffect, useState } from "react";

interface FavoritesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserFavoriteRow {
  product: FavoriteProduct[];
}

export function FavoritesSheet({ open, onOpenChange }: FavoritesSheetProps) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const { session } = useSupabase();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from("user_favorites")
        .select(
          `
      product:products (
        id,
        name,
        price,
        image,
        rating
      )
    `
        )
        .eq("user_id", session.user.id);

      if (!error && data) {
        const products: FavoriteProduct[] = data.flatMap(
          (item: UserFavoriteRow) =>
            Array.isArray(item.product)
              ? item.product
              : item.product
              ? [item.product]
              : []
        );

        setFavorites(products);
      }

      setLoading(false);
    };
    fetchFavorites();
  }, [open, session?.user?.id]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[480px] flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="text-[#010b62] -mb-0.5 dark:text-white">
            Favoritos
          </SheetTitle>
          <SheetDescription>Veja seus produtos favoritados</SheetDescription>
        </SheetHeader>

        {/* Container scrollável */}
        <div className="mt-6 flex-1 overflow-y-auto flex flex-col gap-4">
          {loading ? (
            <p>Carregando...</p>
          ) : favorites.length === 0 ? (
            <p>Nenhum produto favoritado ainda.</p>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b pb-3 last:border-none"
              >
                <div className="w-[60px] h-[60px] relative shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-sm">R$ {item.price.toFixed(2)}</p>
                  <StarRating rating={item.rating || 0} size={16} />
                </div>
                <Button
                  onClick={() => window.open(`/produto/${item.id}`, "_blank")}
                  className="bg-[#010b62] hover:bg-[#1C2CA3] dark:bg-[#01BAEF] dark:hover:bg-[#33C9F2] dark:text-white"
                >
                  Visitar
                </Button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
