import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";

export function useFavorite(productId: number, session: Session | null) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFavorite = useCallback(async () => {
    if (!session?.user?.id) return;
    const { data, error } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("product_id", productId)
      .maybeSingle();
    if (!error && data) setIsWishlisted(true);
  }, [productId, session?.user?.id]);

  useEffect(() => {
    fetchFavorite();
  }, [fetchFavorite]);

  const toggleFavorite = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    if (!isWishlisted) {
      const { error } = await supabase.from("user_favorites").insert({
        user_id: session.user.id,
        product_id: productId,
      });
      if (!error) {
        setIsWishlisted(true);
        toast.success("Produto adicionado aos favoritos!");
      } else toast.error("Erro ao adicionar produto aos favoritos.");
    } else {
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("product_id", productId);
      if (!error) {
        setIsWishlisted(false);
        toast.success("Produto removido dos favoritos!");
      } else toast.error("Erro ao remover produto dos favoritos.");
    }

    setLoading(false);
  }, [isWishlisted, session?.user?.id, productId]);

  return { isWishlisted, loading, toggleFavorite };
}
