import { useEffect, useState, useCallback } from "react";
import { Product } from "@/src/types/Product";
import { supabase } from "@/src/lib/supabase";

export function useFetchProduct(productId: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      setError("Erro ao buscar produto.");
      setProduct(null);
    } else {
      setProduct(data);
    }

    setLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, fetchProduct, setProduct };
}
