import { useEffect, useState } from "react";
import { useSupabase } from "../contexts/supabase-provider";
import { Comments } from "../types/Comment";

export function useFetchComments(reviewId: string) {
  const { supabase } = useSupabase();
  const [comments, setComments] = useState<Comments[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reviewId) return;

    const fetchComments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("review_comments")
        .select("*, users(name, profile_img)")
        .eq("review_id", reviewId)
        .order("created_at", { ascending: false });

      if (!error) setComments(data);
      setLoading(false);
    };

    fetchComments();
  }, [reviewId, supabase]);

  return { comments, loading, setComments };
}
