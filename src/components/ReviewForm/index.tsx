"use client";

import { useEffect, useState } from "react";
import StarRatingInput from "../StarRatingInput";
import { Button } from "../ui/button";
import { supabase } from "@/src/lib/supabase";
import { Product } from "@/src/types/Product";
import { useSupabase } from "@/src/contexts/supabase-provider";

type RatingKey =
  | "performance"
  | "costBenefit"
  | "comfort"
  | "weight"
  | "durability";

interface FormData {
  title: string;
  description: string;
  store: string;
  price: number;
  usage_time: string;
}

interface ReviewFormProps {
  product: Product;
}

export default function ReviewForm({ product }: ReviewFormProps) {
  const { session } = useSupabase();
  const [errorMessages, setErrorMessages] = useState<
    Partial<Record<keyof FormData | "ratings", string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    store: "",
    price: 0,
    usage_time: "",
  });

  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    performance: 0,
    costBenefit: 0,
    comfort: 0,
    weight: 0,
    durability: 0,
  });

  const [starSize, setStarSize] = useState(18);

  const ratingFields: { label: string; key: RatingKey }[] = [
    { label: "Performance", key: "performance" },
    { label: "Custo-benefício", key: "costBenefit" },
    { label: "Conforto", key: "comfort" },
    { label: "Peso", key: "weight" },
    { label: "Durabilidade", key: "durability" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setStarSize(16);
      else if (width < 768) setStarSize(18);
      else if (width < 1024) setStarSize(20);
      else setStarSize(22);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;

    const newErrors: typeof errorMessages = {};

    if (!formData.title.trim()) newErrors.title = "O título é obrigatório.";
    if (!formData.description.trim())
      newErrors.description = "A descrição é obrigatória.";
    if (!formData.store.trim()) newErrors.store = "A loja é obrigatória.";
    if (formData.price <= 0) newErrors.price = "Informe um valor válido.";
    if (!formData.usage_time.trim())
      newErrors.usage_time = "Informe o tempo de uso.";

    const allRatingsValid = Object.values(ratings).every((val) => val > 0);
    if (!allRatingsValid)
      newErrors.ratings = "Avalie todos os critérios para enviar.";

    if (Object.keys(newErrors).length > 0) {
      setErrorMessages(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrorMessages({});

    const users_id = session.user.id;
    const product_id = product.id;

    const { title, description, store, price, usage_time } = formData;

    // Média das notas
    const rating =
      Object.values(ratings).reduce((a, b) => a + b, 0) /
      Object.values(ratings).length;

    // Inserir a review principal na tabela reviews
    const { data: insertedReview, error: insertError } = await supabase
      .from("reviews")
      .insert([
        {
          users_id,
          product_id,
          rating,
          text: description,
          title,
          store,
          price_paid: Number(price),
          time_of_use: usage_time,
          rating_performance: ratings.performance,
          rating_cost_benefit: ratings.costBenefit,
          rating_comfort: ratings.comfort,
          rating_weight: ratings.weight,
          rating_durability: ratings.durability,
          likes: 0,
          dislikes: 0,
          comments: 0,
          // images não enviado no momento
        },
      ])
      .select("id")
      .single();

    if (insertError) {
      console.error("Erro ao enviar avaliação:", insertError);
      setIsSubmitting(false);
      return;
    }

    // Agora inserir os ratings individuais na tabela review_criteria_rating
    const review_id = insertedReview.id;

    const criteriaInsertData = Object.entries(ratings).map(([key, value]) => ({
      review_id,
      criterion: key,
      rating: value,
    }));

    const { error: criteriaInsertError } = await supabase
      .from("review_criteria_rating")
      .insert(criteriaInsertData);

    if (criteriaInsertError) {
      console.error("Erro ao inserir critérios:", criteriaInsertError);
      setIsSubmitting(false);
      return;
    }

    // Atualizar média geral do produto e quantidade de avaliações
    const { data: allReviews, error: fetchError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", product_id);

    if (fetchError || !allReviews) {
      console.error("Erro ao buscar avaliações:", fetchError?.message);
      setIsSubmitting(false);
      return;
    }

    const totalReviews = allReviews.length;
    const totalRating = allReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / totalReviews;

    const { error: updateError } = await supabase
      .from("products")
      .update({
        rating: averageRating,
        review_count: totalReviews,
      })
      .eq("id", product_id);

    if (updateError) {
      console.error("Erro ao atualizar produto:", updateError.message);
    }

    setIsSubmitting(false);
    // Opcional: limpar formulário ou avisar sucesso
  }

  return (
    <div className="relative space-y-8 max-w-xl w-full mx-auto">
      <h2 className="text-3xl font-medium text-[#010b62] dark:text-white">
        Avaliar Produto
      </h2>

      {!session && (
        <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs bg-white/20 dark:bg-black/50 rounded-md">
          <p className="text-center text-[#010b62] dark:text-white font-medium text-lg px-6">
            Você precisa estar logado para enviar uma avaliação.
          </p>
        </div>
      )}

      <form
        onSubmit={submitReview}
        className={`space-y-6 ${
          !session ? "pointer-events-none select-none opacity-60" : ""
        }`}
      >
        {[
          { id: "title", label: "Título da avaliação", type: "text" },
          {
            id: "description",
            label: "Descrição da avaliação",
            type: "textarea",
          },
          { id: "store", label: "Loja / Site da compra", type: "text" },
          { id: "price", label: "Valor pago", type: "number" },
          { id: "usage_time", label: "Tempo de uso", type: "text" },
        ].map(({ id, label, type }) => (
          <div className="relative w-full" key={id}>
            {type === "textarea" ? (
              <textarea
                id={id}
                rows={5}
                value={formData[id as keyof FormData]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [id]:
                      e.target.type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  }))
                }
                className={`w-full border rounded-md px-3 pt-5 pb-2 text-sm bg-white dark:bg-[#030712] text-[#010b62] dark:text-white
                  ${
                    errorMessages[id as keyof FormData]
                      ? "border-red-600 focus:ring-red-600"
                      : "border-[#010b62]/50 dark:border-[#01BAEF] focus:ring-[#010b62] dark:focus:ring-[#01BAEF]"
                  }`}
              />
            ) : (
              <input
                id={id}
                type={type}
                value={formData[id as keyof FormData]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [id]:
                      e.target.type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  }))
                }
                className={`w-full border rounded-md px-3 pt-5 pb-2 text-sm bg-white dark:bg-[#030712] text-[#010b62] dark:text-white
                  ${
                    errorMessages[id as keyof FormData]
                      ? "border-red-600 focus:ring-red-600"
                      : "border-[#010b62]/50 dark:border-[#01BAEF] focus:ring-2 focus:ring-[#010b62] dark:focus:ring-[#01BAEF]"
                  } ${type === "number" ? "no-spinner" : ""}`}
              />
            )}

            <label
              htmlFor={id}
              className="absolute -top-2 left-3 bg-white dark:bg-[#030712] px-1 text-sm text-[#010b62] dark:text-white"
            >
              {label}
            </label>

            {errorMessages[id as keyof FormData] && (
              <p className="text-red-600 text-xs mt-1">
                {errorMessages[id as keyof FormData]}
              </p>
            )}
          </div>
        ))}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ratingFields.map(({ label, key }) => (
            <div
              key={key}
              className={`flex flex-col text-left min-w-0 ${
                key === "durability" ? "lg:col-span-4" : ""
              }`}
            >
              <label className="text-sm text-[#010b62] dark:text-white mb-1">
                {label}
              </label>
              <StarRatingInput
                value={ratings[key]}
                onChange={(value) =>
                  setRatings((prev) => ({ ...prev, [key]: value }))
                }
                size={starSize}
              />
            </div>
          ))}
        </div>

        {errorMessages.ratings && (
          <p className="text-red-600 text-sm font-semibold">
            {errorMessages.ratings}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#010b62] hover:bg-[#020B24] dark:bg-[#01BAEF] dark:hover:bg-[#0969DA] text-white py-4 text-lg font-semibold mt-9 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
        </Button>
      </form>

      <style jsx>{`
        input.no-spinner::-webkit-outer-spin-button,
        input.no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input.no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
