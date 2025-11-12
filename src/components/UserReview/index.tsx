"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { UserReview } from "@/src/types/UserReview";

import ReviewDetailsModal from "../UserReviewDetails";
import { Pagination } from "../Pagination";
import { ReviewCard } from "../ReviewCard";
import { toast } from "sonner";
import {
  PostgrestError,
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { ReviewVoteRow } from "@/src/types/ReviewVoteRow";

type UserReviewProps = {
  productId: number;
};

export default function UserReviews({ productId }: UserReviewProps) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<
    Record<string, "like" | "dislike" | null>
  >({});
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "high" | "low" | "useful">(
    "recent"
  );
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const REVIEWS_PER_PAGE = 8;

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
      let supabaseError: PostgrestError | null = null;
      let result:
        | PostgrestSingleResponse<ReviewVoteRow | null>
        | PostgrestResponse<ReviewVoteRow>;

      console.log(
        `%c[VOTE] Tentando registrar voto: reviewId=${reviewId}, userId=${userId}, tipo=${voteType}`,
        "color: #00aaff;"
      );

      if (currentVote === voteType) {
        result = await supabase
          .from("review_votes")
          .delete()
          .eq("review_id", reviewId)
          .eq("user_id", userId);
        supabaseError = result.error;
      } else if (currentVote && currentVote !== voteType) {
        result = await supabase
          .from("review_votes")
          .update({ vote_type: voteType })
          .eq("review_id", reviewId)
          .eq("user_id", userId);
        supabaseError = result.error;
      } else {
        result = await supabase.from("review_votes").insert({
          review_id: reviewId,
          user_id: userId,
          vote_type: voteType,
        });
        supabaseError = result.error;
      }

      if (supabaseError) {
        console.group(
          "%c❌ ERRO AO REGISTRAR VOTO",
          "color: red; font-weight: bold;"
        );
        console.error("Mensagem:", supabaseError.message);
        if (supabaseError.details)
          console.error("Detalhes:", supabaseError.details);
        if (supabaseError.hint) console.error("Dica:", supabaseError.hint);
        if (supabaseError.code)
          console.error("Código do erro:", supabaseError.code);
        console.error("Erro completo:", JSON.stringify(supabaseError, null, 2));
        console.groupEnd();

        // Reverte estado local
        toast("Não foi possível registrar seu voto.");
        setUserVotes((prev) => ({ ...prev, [reviewId]: currentVote }));
        return;
      }

      console.log("%c✅ Voto registrado com sucesso:", "color: green;", result);

      const {
        data,
        error: countError,
        status,
      } = await supabase
        .from("review_votes")
        .select("vote_type")
        .eq("review_id", reviewId);

      if (countError) {
        console.error("Erro ao atualizar contagem:", countError);
        return;
      }

      console.log(
        `%c[COUNT SYNC] Status=${status} - Likes: ${
          data?.filter((v) => v.vote_type === "like").length || 0
        }, Dislikes: ${
          data?.filter((v) => v.vote_type === "dislike").length || 0
        }`,
        "color: #ffaa00;"
      );

      const newLikes = data?.filter((v) => v.vote_type === "like").length || 0;
      const newDislikes =
        data?.filter((v) => v.vote_type === "dislike").length || 0;

      setReviews((prev) =>
        prev.map((rev) =>
          rev.id === reviewId
            ? { ...rev, likes: newLikes, dislikes: newDislikes }
            : rev
        )
      );
    } catch (err: unknown) {
      console.error("Erro inesperado ao votar:", err);
      toast("Não foi possível registrar seu voto.");
      console.group(
        "%c🚨 ERRO INESPERADO AO VOTAR",
        "color: darkred; font-weight: bold;"
      );
      console.error(err);
      console.groupEnd();

      setUserVotes((prev) => ({ ...prev, [reviewId]: currentVote }));
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;

      setLoading(true);

      console.groupCollapsed(
        "%c🔎 Iniciando busca de reviews",
        "color: #00aaff; font-weight: bold;"
      );
      console.log("📦 Parâmetros iniciais:", {
        productId,
        sortBy,
        filterRating,
        currentPage,
      });

      try {
        // 1️⃣ Contagem total de reviews para paginação
        let countQuery = supabase
          .from("reviews")
          .select("*", { count: "exact", head: true })
          .eq("product_id", productId);

        if (filterRating) {
          countQuery = countQuery
            .gte("rating", filterRating)
            .lt("rating", filterRating + 1);
        }

        const { count } = await countQuery;
        if (count) {
          setTotalPages(Math.ceil(count / REVIEWS_PER_PAGE));
        }

        // 2️⃣ Busca das reviews
        let query = supabase
          .from("reviews")
          .select(
            `
    *,
    users_id,
    users!reviews_users_id_fkey2 (id, name, profile_img),
    review_votes (vote_type),
    products (id, name, image)
  `
          )
          .eq("product_id", productId);

        if (filterRating) {
          query = query
            .gte("rating", filterRating)
            .lt("rating", filterRating + 1);
        }

        // 3️⃣ Ordenação
        if (sortBy === "recent") {
          query = query.order("created_at", { ascending: false });
        } else if (sortBy === "high") {
          query = query.order("rating", { ascending: false });
        } else if (sortBy === "low") {
          query = query.order("rating", { ascending: true });
        } else if (sortBy === "useful") {
          query = query.order("likes", { ascending: false });
        }

        // 4️⃣ Paginação
        const from = (currentPage - 1) * REVIEWS_PER_PAGE;
        const to = from + REVIEWS_PER_PAGE - 1;
        query = query.range(from, to);

        // 5️⃣ Execução da query
        const { data, error } = await query;

        if (error) {
          console.group(
            "%c❌ ERRO AO BUSCAR REVIEWS",
            "color: red; font-weight: bold;"
          );
          console.error("Mensagem:", error.message);
          if (error.details) console.error("Detalhes:", error.details);
          if (error.hint) console.error("Dica:", error.hint);
          if (error.code) console.error("Código:", error.code);
          console.error("Erro completo:", JSON.stringify(error, null, 2));
          console.groupEnd();
          setLoading(false);
          console.groupEnd(); // Fecha "fetchReviews"
          return;
        }

        if (!data) {
          setReviews([]);
          setLoading(false);
          return;
        }

        // 6️⃣ Mapeamento para UserReview
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
            users_id: item.users_id || item.users?.id || null,
            store: item.store || "Loja Desconhecida",
            badges: ["Compra Verificada"],
            created_at: item.created_at,
            product_id: item.product_id,
            product_name: item.products?.name || "Produto Desconhecido",
            product_image: item.products?.image || "/placeholder.svg",
          };
        });

        setReviews(parsed);
      } catch (err) {
        console.error("Erro ao buscar reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, sortBy, filterRating, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-[#010b62] dark:text-white text-center md:text-left">
          Avaliações dos usuários
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto justify-center">
          <div className="flex flex-col w-full sm:w-auto">
            <label
              htmlFor="sortBy"
              className="text-[#010b62] flex items-center gap-1 dark:text-white"
            >
              Ordenar
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "recent" | "high" | "low" | "useful"
                )
              }
              className="w-full sm:w-48 px-4 py-2 border border-[#010b62]/50 dark:border-white/40 rounded-md text-[#64748b] bg-white dark:bg-[#030712] focus:outline-none"
            >
              <option value="recent">Mais recentes</option>
              <option value="high">Maior nota</option>
              <option value="low">Menor nota</option>
              <option value="useful">Mais úteis</option>
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-auto">
            <label
              htmlFor="filterRating"
              className="text-[#010b62] dark:text-white"
            >
              Filtrar por
            </label>
            <select
              id="filterRating"
              value={filterRating ?? ""}
              onChange={(e) =>
                setFilterRating(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              className="w-full sm:w-48 px-4 py-2 border border-[#010b62]/50 dark:border-white/40 rounded-md text-[#64748b] bg-white dark:bg-[#030712] focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="5">5 estrelas</option>
              <option value="4">4 estrelas</option>
              <option value="3">3 estrelas</option>
              <option value="2">2 estrelas</option>
              <option value="1">1 estrela</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              variant="user"
              setReviews={setReviews}
              onOpenDetails={(rev) => {
                setSelectedReview(rev);
                setIsModalOpen(true);
              }}
              onVote={handleVote}
              hasLiked={userVotes[review.id] === "like"}
              hasDisliked={userVotes[review.id] === "dislike"}
            />
          ))
        ) : (
          <div className="text-center py-6 col-span-full">
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

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
