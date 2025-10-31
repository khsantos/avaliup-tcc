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
import { X } from "lucide-react";
import { toast } from "sonner";

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
      setLoading(true);
      const { data, error } = await supabase
        .from("user_favorites")
        .select(`
          product:products (
            id,
            name,
            price,
            image,
            rating
          )
        `)
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

  const handleRemoveFavorite = async (productId: number) => {
    if (!session?.user?.id) return;

    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", session.user.id)
      .eq("product_id", productId);

    if (!error) {
      setFavorites((prev) => prev.filter((p) => p.id !== productId));
    } else {
      toast.error("Erro ao remover favorito.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="
      fixed inset-0 z-50 w-full h-full
      sm:max-w-[90vw] md:max-w-[700px]
      flex flex-col overflow-hidden
      transition-all duration-300
    "
      >
        <SheetHeader>
          <SheetTitle className="text-[#010b62] dark:text-white">
            Favoritos
          </SheetTitle>
          <SheetDescription className="text-sm sm:text-base">
            Veja seus produtos favoritados
          </SheetDescription>
        </SheetHeader>

        <div
          className="
flex-1 overflow-y-auto mt-6 flex flex-col gap-3 sm:gap-4 pr-2 sm:pr-4
    "
        >
          {loading ? (
            <p>Carregando...</p>
          ) : favorites.length === 0 ? (
            <p>Nenhum produto favoritado ainda.</p>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                onClick={() => window.open(`/produto/${item.id}`, "_blank")}
                className="relative group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b pb-4 sm:pb-3 last:border-none p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                {/* Overlay "Visitar" */}
                <div className="absolute inset-0 bg-black/50 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <span className="text-white font-semibold text-lg">Visitar</span>
                </div>

                {/* Botão remover */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(item.id);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 z-10"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>

                {/* Imagem */}
                <div className="w-[70px] h-[70px] sm:w-[60px] sm:h-[60px] relative shrink-0 mx-auto sm:mx-0">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    fill
                    className="object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Informações */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-medium text-sm sm:text-base mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-[#010b62] dark:text-[#01BAEF]">
                    R$ {item.price.toFixed(2)}
                  </p>

                  <div className="flex justify-center sm:justify-start items-center gap-1">
                    <StarRating rating={item.rating || 0} size={16} />
                    <span className="text-xs sm:text-sm text-[#FFB24B]">
                      {item.rating?.toFixed(1) ?? '0.0'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
