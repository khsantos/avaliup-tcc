"use client";

import {
  Star,
  ThumbsUp,
  MessageCircle,
  MoreVertical,
  ThumbsDown,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { UserReview } from "@/src/types/User_Review";
import { cn } from "@/lib/utils";
import ReviewDetailsModal from "../UserReviewDetails";

export default function UserReviews() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [userVotes, setUserVotes] = useState<
    Record<string, "like" | "dislike" | null>
  >({});
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  type ReviewVote = {
    vote_type: "like" | "dislike";
  };

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
    const fetchUserVotes = async () => {
      if (!userId) return;
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
      alert("Você precisa estar logado para votar.");
      return;
    }

    const currentVote = userVotes[reviewId];

    if (currentVote === voteType) {
      const { error: deleteError } = await supabase
        .from("review_votes")
        .delete()
        .eq("review_id", reviewId)
        .eq("user_id", userId);

      if (deleteError) {
        console.error("Erro ao remover voto:", deleteError);
        return;
      }

      setUserVotes((prev) => ({
        ...prev,
        [reviewId]: null,
      }));

      await updateReviewVoteCounts(reviewId);
      return;
    }

    if (currentVote && currentVote !== voteType) {
      const { error: updateError } = await supabase
        .from("review_votes")
        .update({ vote_type: voteType })
        .eq("review_id", reviewId)
        .eq("user_id", userId);

      if (updateError) {
        console.error("Erro ao atualizar voto:", updateError);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("review_votes")
        .insert({
          review_id: reviewId,
          user_id: userId,
          vote_type: voteType,
        });

      if (insertError) {
        console.error("Erro ao registrar voto:", insertError);
        return;
      }
    }

    setUserVotes((prev) => ({
      ...prev,
      [reviewId]: voteType,
    }));

    await updateReviewVoteCounts(reviewId);
  };

  const updateReviewVoteCounts = async (reviewId: string) => {
    const { data: votes } = await supabase
      .from("review_votes")
      .select("vote_type")
      .eq("review_id", reviewId);

    const likes = votes?.filter((v) => v.vote_type === "like").length || 0;
    const dislikes =
      votes?.filter((v) => v.vote_type === "dislike").length || 0;

    await supabase
      .from("reviews")
      .update({ likes, dislikes })
      .eq("id", reviewId);

    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, likes, dislikes } : r))
    );
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("reviews")
        .select(
          `
          *,
          users (id, name, profile_img),
          review_votes (vote_type)
        `
        )
        .order("created_at", { ascending: false });

      if (data) {
        const parsed = data.map((item) => {
          const likes =
            item.review_votes?.filter((v: ReviewVote) => v.vote_type === "like")
              .length || 0;
          const dislikes =
            item.review_votes?.filter(
              (v: ReviewVote) => v.vote_type === "dislike"
            ).length || 0;

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
            comments: item.comments,
            images: item.images ? JSON.parse(item.images) : [],
            user_profile_img: item.users?.profile_img || "/placeholder.svg",
            user_name: item.users?.name || "Usuário Anônimo",
            store: item.store || "Loja Desconhecida",
            badges: ["Compra Verificada"],
          };
        });

        setReviews(parsed);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "fill-[#FFB24B] text-[#FFB24B]"
            : "text-[#FFB24B] fill-none"
        }`}
      />
    ));
  };

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-bold text-[#010b62] dark:text-white mt-6">
          Avaliações dos usuários
        </h2>
        <div className="flex gap-6">
          {/* Ordenar */}
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
              <select className="w-48 px-4 py-2 border border-[#010b62]/50 dark:border-[#FFFFFF]/50 rounded-[4px] text-[#64748b] bg-white dark:bg-[#030712] focus:outline-none hover:border-[#010b62] transition-colors appearance-none">
                <option>Mais recentes</option>
                <option>Mais úteis</option>
                <option>Maior nota</option>
                <option>Menor nota</option>
              </select>
            </div>
          </div>

          {/* Filtrar por */}
          <div className="flex flex-col">
            <label className="text-[#010b62] dark:text-white ">
              Filtrar por
            </label>
            <div className="relative">
              <select className="w-48 px-4 py-2 border border-[#010b62]/50 rounded-[4px] dark:border-[#FFFFFF]/50 text-[#64748b] bg-white dark:bg-[#030712] focus:outline-none hover:border-[#010b62] transition-colors appearance-none">
                <option>Todos</option>
                <option>5 estrelas</option>
                <option>4 estrelas</option>
                <option>3 estrelas</option>
                <option>2 estrelas</option>
                <option>1 estrela</option>
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

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {reviews.length > 0 ? (
          reviews.map((review) => {
            const isExpanded = expandedIds.includes(review.id);
            const hasLiked = userVotes[review.id] === "like";
            const hasDisliked = userVotes[review.id] === "dislike";
            return (
              <Card
                key={review.id}
                className="shadow-lg hover:shadow-2xl transition-transform hover:scale-102 dark:bg-[#030712] border border-[#010b62] dark:border-[#ffffff]/20 rounded-sm text-white"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2 ">
                    <div className="flex items-center gap-3 ">
                      <Avatar className="w-10 h-10 border-[#010b62]  text-[#010b62] dark:text-[#01BAEF]/70 border dark:border-[#01BAEF]/70">
                        <AvatarImage
                          src={review.user_profile_img || "/placeholder.svg"}
                          alt={review.user_name}
                        />
                        <AvatarFallback className="dark:bg-[#030712] border border-white bg-white dark:border-none">
                          {review.user_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-[#010b62] dark:text-white">
                            {review.user_name}
                          </span>
                          <span className="text-xs text-[#010b62]/50 dark:text-gray-400">
                            Avaliado em 28/08/2024
                          </span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {review.badges?.slice(0, 3).map((badge, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-white rounded-full text-[#010b62] text-xs font-semibold border border-[#010b62]/50"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[#FFB24B] -mt-2">
                          {review.rating}
                        </span>
                        <div className="flex gap-1 text-[FFB24B] -mt-2">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedReview(review);
                          setIsModalOpen(true);
                        }}
                        className="-mt-2 dark:bg-[#01BAEF] bg-[#010b62] hover:bg-[#010b62]/70 text-white text-sm rounded-se-lg px-2 dark:over:bg-[#0096c7] transition"
                      >
                        Ver Detalhes
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 16 16"
                          className="inline ml-1"
                        >
                          <path
                            d="M5 8h6M9 6l2 2-2 2"
                            stroke="#fff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  <div className="dark:text-[#00b6f3] text-gray-500 text-sm mb-2">
                    Tempo de uso: {review.time_of_use} | Valor pago:{" "}
                    {review.price_paid} | Loja: {review.store}
                  </div>

                  <div className="font-bold text-lg mb-1 text-[#010b62] dark:text-white">
                    {review.title}
                  </div>

                  <div className="flex justify-between gap-4 mb-2">
                    <div className="flex-1 relative">
                      <p
                        className={`dark:text-white text-[#010b62] text-base text-justify leading-snug whitespace-pre-line pr-4 ${
                          isExpanded ? "" : "line-clamp-[4]"
                        }`}
                      >
                        {review.text}
                      </p>

                      {!isExpanded && (
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#ffffff] dark:from-[#030712] to-transparent pointer-events-none" />
                      )}
                    </div>

                    <div className="w-20 shrink-0 flex items-center justify-center">
                      {/* <div className="bg-gray-500 dark:bg-[#64748b] bg-opacity-30 rounded-lg w-20 h-20 flex items-center justify-center text-2xl text-white font-semibold">
                        +3
                      </div> */}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="dark:text-[#00b6f3] text-[#010b62] hover:text-[#010b62]/70 dark:hover:text-white p-0 h-auto"
                    onClick={() => handleToggleExpand(review.id)}
                  >
                    {isExpanded ? "Ver menos" : "Ver mais"}
                  </Button>

                  <div className="flex items-center gap-6 mt-2">
                    <span
                      className={cn(
                        "cursor-pointer flex items-center gap-1 text-[#010b62]/50",
                        hasLiked && "text-green-600"
                      )}
                      onClick={() => handleVote(review.id, "like")}
                    >
                      <ThumbsUp className="w-6 h-6" />
                      {review.likes}
                    </span>

                    <span
                      className={cn(
                        "cursor-pointer flex items-center gap-1 text-[#010b62]/50",
                        hasDisliked && "text-red-500"
                      )}
                      onClick={() => handleVote(review.id, "dislike")}
                    >
                      <ThumbsDown className="w-5 h-5" />
                      {review.dislikes}
                    </span>
                    <span className="flex items-center gap-1 text-[#010b62]/50 dark:text-[#b6c2cd] text-base">
                      <MessageCircle className="w-5 h-5" />
                      {review.comments}
                    </span>
                    <span className="ml-auto text-[#010b62]/50 dark:text-[#b6c2cd]">
                      <MoreVertical className="w-5 h-5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-6 col-span-2">
            {loading ? (
              <p className="text-gray-500">Carregando avaliações...</p>
            ) : (
              <p className="text-gray-500">
                Nenhuma avaliação encontrada. Seja o primeiro a avaliar!
              </p>
            )}
          </div>
        )}
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
