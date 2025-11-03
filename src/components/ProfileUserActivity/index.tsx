"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { UserReview } from "@/src/types/UserReview";

import ReviewDetailsModal from "../UserReviewDetails";
import { ReviewCard } from "../ReviewCard";
import { toast } from "sonner";
import { Pagination } from "../Pagination";

export default function ProfileUserActivity() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [userVotes, setUserVotes] = useState<
    Record<string, "like" | "dislike" | null>
  >({});
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<"recent" | "high" | "low" | "useful">(
    "recent"
  );
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const REVIEWS_PER_PAGE = 8;
  type ReviewVote = { vote_type: "like" | "dislike" };

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserVotes = async () => {
      const { data } = await supabase
        .from("review_votes")
        .select("review_id, vote_type")
        .eq("user_id", userId);

      if (data) {
        const votesMap: Record<string, "like" | "dislike"> = {};
        data.forEach((v) => (votesMap[v.review_id] = v.vote_type));
        setUserVotes(votesMap);
      }
    };

    fetchUserVotes();
  }, [userId]);

  const handleVote = async (reviewId: string, voteType: "like" | "dislike") => {
    if (!userId) {
      toast("Você precisa estar logado para votar.");
      return;
    }

    const currentVote = userVotes[reviewId];

    setUserVotes((prev) => ({
      ...prev,
      [reviewId]: currentVote === voteType ? null : voteType,
    }));

    setReviews((prev) =>
      prev.map((rev) => {
        if (rev.id !== reviewId) return rev;

        let likes = rev.likes ?? 0;
        let dislikes = rev.dislikes ?? 0;

        if (currentVote === voteType) {
          if (voteType === "like") likes -= 1;
          else dislikes -= 1;
        } else if (currentVote && currentVote !== voteType) {
          if (voteType === "like") {
            likes += 1;
            dislikes -= 1;
          } else {
            likes -= 1;
            dislikes += 1;
          }
        } else {
          if (voteType === "like") likes += 1;
          else dislikes += 1;
        }

        return { ...rev, likes, dislikes };
      })
    );

    try {
      if (currentVote === voteType) {
        await supabase
          .from("review_votes")
          .delete()
          .eq("review_id", reviewId)
          .eq("user_id", userId);
      } else if (currentVote && currentVote !== voteType) {
        await supabase
          .from("review_votes")
          .update({ vote_type: voteType })
          .eq("review_id", reviewId)
          .eq("user_id", userId);
      } else {
        await supabase.from("review_votes").insert({
          review_id: reviewId,
          user_id: userId,
          vote_type: voteType,
        });
      }

      const { data } = await supabase
        .from("review_votes")
        .select("vote_type")
        .eq("review_id", reviewId);

      const newLikes = data?.filter((v) => v.vote_type === "like").length || 0;
      const newDislikes =
        data?.filter((v) => v.vote_type === "dislike").length || 0;

      await supabase
        .from("reviews")
        .update({ likes: newLikes, dislikes: newDislikes })
        .eq("id", reviewId);
    } catch (error) {
      console.error("Erro ao registrar voto:", error);
      toast("Não foi possível registrar seu voto.");
    }
  };

  useEffect(() => {
    const fetchUserInteractedReviews = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        const { data: votesData, error: votesError } = await supabase
          .from("review_votes")
          .select("review_id")
          .eq("user_id", userId);
        if (votesError) throw votesError;
        const votedReviewIds = votesData?.map((v) => v.review_id) || [];

        const { data: commentsData, error: commentsError } = await supabase
          .from("review_comments")
          .select("review_id")
          .eq("user_id", userId);
        if (commentsError) throw commentsError;
        const commentedReviewIds = commentsData?.map((c) => c.review_id) || [];

        const interactedReviewIds = Array.from(
          new Set([...votedReviewIds, ...commentedReviewIds])
        );

        if (interactedReviewIds.length === 0) {
          setReviews([]);
          setTotalPages(1);
          setLoading(false);
          return;
        }

        const totalCount = interactedReviewIds.length;
        setTotalPages(Math.ceil(totalCount / REVIEWS_PER_PAGE));

        const from = (currentPage - 1) * REVIEWS_PER_PAGE;
        const to = from + REVIEWS_PER_PAGE - 1;

        let query = supabase
          .from("reviews")
          .select(
            `
          *,
          users (id, name, profile_img),
          review_votes (vote_type, user_id),
          review_comments (id, user_id),
          products (id, name, image)
        `
          )
          .in("id", interactedReviewIds)
          .range(from, to);

        if (filterRating) {
          query = query
            .gte("rating", filterRating)
            .lt("rating", filterRating + 1);
        }

        if (sortBy === "recent")
          query = query.order("created_at", { ascending: false });
        else if (sortBy === "high")
          query = query.order("rating", { ascending: false });
        else if (sortBy === "low")
          query = query.order("rating", { ascending: true });
        else if (sortBy === "useful")
          query = query.order("likes", { ascending: false });

        const { data, error } = await query;
        if (error) throw error;

        if (data) {
          const parsed = data.map((item) => {
            const likes =
              item.review_votes?.filter(
                (v: ReviewVote) => v.vote_type === "like"
              ).length || 0;
            const dislikes =
              item.review_votes?.filter(
                (v: ReviewVote) => v.vote_type === "dislike"
              ).length || 0;
            const commentCount = item.review_comments?.length || 0;

            return {
              id: item.id,
              title: item.title,
              text: item.text,
              time_of_use: item.time_of_use,
              price_paid: `R$${Number(item.price_paid)?.toFixed(2) || "0,00"}`,
              rating: item.rating,
              rating_performance: item.rating_performance || 0,
              rating_cost_benefit: item.rating_cost_benefit || 0,
              rating_comfort: item.rating_comfort || 0,
              rating_weight: item.rating_weight || 0,
              rating_durability: item.rating_durability || 0,
              likes,
              dislikes,
              comments: commentCount,
              images: item.images ? JSON.parse(item.images) : [],
              user_profile_img: item.users?.profile_img || "/placeholder.svg",
              user_name: item.users?.name || "Usuário Anônimo",
              store: item.store || "Loja Desconhecida",
              badges: ["Compra Verificada"],
              created_at: item.created_at,
              product_id: item.product_id,
              product_name: item.products?.name || "Produto Desconhecido",
              product_image: item.products?.image || "/placeholder.svg",
            };
          });

          setReviews(parsed);
        }
      } catch (error) {
        console.error("Erro ao buscar reviews interagidas:", error);
        toast("Não foi possível carregar suas interações.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInteractedReviews();
  }, [userId, currentPage, sortBy, filterRating]);

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#010b62] dark:text-white mt-6">
          Interações
        </h2>
        <div className="flex gap-6">
          <div className="flex flex-col">
            <label className="text-[#010b62] flex items-center gap-1 dark:text-white">
              Ordenar
              <span className="inline-flex">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7 15V5M7 5L4 8M7 5L10 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 5V15M13 15L16 12M13 15L10 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "recent" | "high" | "low" | "useful"
                  )
                }
                className="w-48 px-4 py-2 border border-[#010b62]/50 dark:border-[#FFFFFF]/50 rounded-[4px] text-[#64748b] bg-white dark:bg-[#030712] focus:outline-none hover:border-[#010b62] transition-colors appearance-none"
              >
                <option value="recent">Mais recentes</option>
                <option value="high">Maior nota</option>
                <option value="low">Menor nota</option>
                <option value="useful">Mais úteis</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[#010b62] dark:text-white ">
              Filtrar por
            </label>
            <div className="relative">
              <select
                value={filterRating ?? ""}
                onChange={(e) =>
                  setFilterRating(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                className="w-48 px-4 py-2 border border-[#010b62]/50 rounded-[4px] dark:border-[#FFFFFF]/50 text-[#64748b] bg-white dark:bg-[#030712] focus:outline-none hover:border-[#010b62] transition-colors appearance-none"
              >
                <option value="">Todos</option>
                <option value="5">5 estrelas</option>
                <option value="4">4 estrelas</option>
                <option value="3">3 estrelas</option>
                <option value="2">2 estrelas</option>
                <option value="1">1 estrela</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="#64748b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      {loading && <p className="text-gray-500">Carregando avaliações...</p>}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {reviews.length > 0
          ? reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                variant="product"
                onOpenDetails={(rev) => {
                  setSelectedReview(rev);
                  setIsModalOpen(true);
                }}
                onVote={handleVote}
                hasLiked={userVotes[review.id] === "like"}
                hasDisliked={userVotes[review.id] === "dislike"}
                isExpanded={expandedIds.includes(review.id)}
                onToggleExpand={handleToggleExpand}
              />
            ))
          : !loading && (
              <p className="text-gray-500">Nenhuma avaliação encontrada.</p>
            )}
      </div>
      <div className="flex justify-center mt-4 md:col-span-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      {selectedReview && (
        <ReviewDetailsModal
          review={selectedReview}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
