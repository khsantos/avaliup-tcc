import { useEffect, useState } from "react";
import { useSupabase } from "../contexts/supabase-provider";
import { UserReview } from "../types/User_Review";

export default function useFetchUserReviews(productId?: number) {
  const { supabase } = useSupabase();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

type RawReview = {
  id: string;
  title: string;
  text: string;
  time_of_use?: string;
  price_paid?: string;
  rating: number;
  rating_performance?: number;
  rating_cost_benefit?: number;
  rating_comfort?: number;
  rating_weight?: number;
  rating_durability?: number;
  likes?: number;
  dislikes?: number;
  comments?: number;
  images?: string[];
  store?: string;
  badges?: string[];
  created_at: string;
  product_id: string | number;
  products?: {
    id: string;
    name: string;
    image: string | null;
  }[];
  users?: {
    id: string;
    name: string;
    profile_img: string | null;
  }[];
};

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("reviews")
        .select(`
          id,
          title,
          text,
          time_of_use,
          price_paid,
          rating,
          rating_performance,
          rating_cost_benefit,
          rating_comfort,
          rating_weight,
          rating_durability,
          likes,
          dislikes,
          comments,
          images,
          store,
          created_at,
          product_id,
          products (
            id,
            name,
            image
          ),
          users:users_id (
            id,
            name,
            profile_img
          )
        `)
        .order("created_at", { ascending: false });

      if (productId) query = query.eq("product_id", productId);

      const { data, error } = await query;

      if (error) {
        console.error(error);
        setError(error.message);
      } else if (data) {
        const normalized: UserReview[] = (data as RawReview[]).map((review) => ({
          id: review.id,
          title: review.title,
          text: review.text,
          time_of_use: review.time_of_use ?? "",
          price_paid: review.price_paid ?? "",
          rating: review.rating,
          rating_performance: review.rating_performance ?? 0,
          rating_cost_benefit: review.rating_cost_benefit ?? 0,
          rating_comfort: review.rating_comfort ?? 0,
          rating_weight: review.rating_weight ?? 0,
          rating_durability: review.rating_durability ?? 0,
          likes: review.likes ?? 0,
          dislikes: review.dislikes ?? 0,
          comments: review.comments ?? 0,
          images: review.images ?? [],
          badges: review.badges ?? [],
          store: review.store ?? "Loja desconhecida",
          created_at: review.created_at,
          product_id: Number(review.product_id),
          products: review.products?.[0] ?? null,
user_name: review.users?.[0]?.name ?? "Usuário desconhecido",
user_profile_img: review.users?.[0]?.profile_img ?? "/placeholder.svg",
        }));

        setReviews(normalized);
      }

      setLoading(false);
    }

    fetchReviews();
  }, [supabase, productId]);

  return { reviews, loading, error };
}
