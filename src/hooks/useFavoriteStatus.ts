import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
import { useSupabase } from "@/src/contexts/supabase-provider";

export function useFavoriteStatus(productId: string) {
  const { session } = useSupabase();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchFavorite = async () => {
      const { data } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("product_id", productId)
        .maybeSingle();
      if (data) setIsWishlisted(true);
    };
    fetchFavorite();
  }, [productId, session?.user?.id]);

  const toggleFavorite = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    if (isWishlisted) {
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("product_id", productId);
      if (!error) {
        toast.success("Produto removido dos favoritos!");
        setIsWishlisted(false);
      }
    } else {
      const { error } = await supabase.from("user_favorites").insert({
        user_id: session.user.id,
        product_id: productId,
      });
      if (!error) {
        toast.success("Produto adicionado aos favoritos!");
        setIsWishlisted(true);
      }
    }
    setLoading(false);
  };

  return { isWishlisted, toggleFavorite, loading };
}
