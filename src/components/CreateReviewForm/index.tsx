"use client";

import { useEffect, useState } from "react";
import StarRatingInput from "../StarRatingInput";
import { Button } from "../ui/button";
import { supabase } from "@/src/lib/supabase";
import { Product } from "@/src/types/Product";
import { useSupabase } from "@/src/contexts/supabase-provider";
import { toast } from "sonner";

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
  onProductUpdate?: (updatedProduct: Product) => void;
}

export default function ReviewForm({
  product,
  onProductUpdate,
}: ReviewFormProps) {
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
      const container = document.querySelector(".grid");
      if (container) {
        const containerWidth = container.clientWidth;
        const starCount = ratingFields.length;
        const maxStarSize = Math.floor(containerWidth / (starCount * 5)); // 5 estrelas por critério
        const adjustedStarSize = Math.min(maxStarSize, 22); // Limita o tamanho máximo a 22
        setStarSize(Math.max(adjustedStarSize, 18)); // Define um tamanho mínimo de 18 para mobile
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ratingFields]);

  async function fetchUpdatedProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", product.id)
      .single();

    if (error) {
      console.error("Erro ao buscar produto atualizado:", error);
      return;
    }

    if (data && onProductUpdate) {
      onProductUpdate(data);
    }
  }

  const INVALID_CHARS_REGEX = /[<>]/;

  const ALLOWED_TEXT_REGEX =
    /^[a-zA-Z0-9À-ÖØ-öø-ÿ\s\.,\-'\"()\/:;?!%$@#&+\n]*$/;

  // limites
  const TITLE_MAX = 100;
  const DESCRIPTION_MAX = 5000;
  const STORE_MAX = 100;
  const USAGE_TIME_MAX = 100;
  const MAX_PRICE = 1_000_000_00;

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;

    const newErrors: typeof errorMessages = {};

    const title = String(formData.title ?? "").trim();
    const description = String(formData.description ?? "").trim();
    const store = String(formData.store ?? "").trim();
    const usage_time = String(formData.usage_time ?? "").trim();
    const priceValue = Number(formData.price);

    if (!title) newErrors.title = "O título é obrigatório.";
    if (!description) newErrors.description = "A descrição é obrigatória.";
    if (!store) newErrors.store = "A loja é obrigatória.";
    if (!usage_time) newErrors.usage_time = "Informe o tempo de uso.";
    if (Number.isNaN(priceValue) || priceValue <= 0)
      newErrors.price = "Informe um valor válido.";

    const allRatingsValid = Object.values(ratings).every((val) => val > 0);
    if (!allRatingsValid)
      newErrors.ratings = "Avalie todos os critérios para enviar.";

    if (title && INVALID_CHARS_REGEX.test(title))
      newErrors.title = "O título contém caracteres inválidos.";
    if (description && INVALID_CHARS_REGEX.test(description))
      newErrors.description = "A descrição contém caracteres inválidos.";
    if (store && INVALID_CHARS_REGEX.test(store))
      newErrors.store = "O nome da loja contém caracteres inválidos.";
    if (usage_time && INVALID_CHARS_REGEX.test(usage_time))
      newErrors.usage_time = "O tempo de uso contém caracteres inválidos.";

    if (title && (title.length > TITLE_MAX || !ALLOWED_TEXT_REGEX.test(title)))
      newErrors.title = `Título inválido ou muito longo (máx. ${TITLE_MAX} caracteres).`;
    if (
      description &&
      (description.length > DESCRIPTION_MAX ||
        !ALLOWED_TEXT_REGEX.test(description))
    )
      newErrors.description = `Descrição inválida ou muito longa (máx. ${DESCRIPTION_MAX} caracteres).`;
    if (store && (store.length > STORE_MAX || !ALLOWED_TEXT_REGEX.test(store)))
      newErrors.store = `Nome da loja inválido ou muito longo (máx. ${STORE_MAX} caracteres).`;
    if (
      usage_time &&
      (usage_time.length > USAGE_TIME_MAX ||
        !ALLOWED_TEXT_REGEX.test(usage_time))
    )
      newErrors.usage_time = `Tempo de uso inválido ou muito longo (máx. ${USAGE_TIME_MAX} caracteres).`;

    if (priceValue > MAX_PRICE)
      newErrors.price = "Valor informado excede o máximo permitido.";

    if (Object.keys(newErrors).length > 0) {
      setErrorMessages(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrorMessages({});

    const users_id = session.user.id;
    const product_id = product.id;

    const {
      title: titleToInsert,
      description: descToInsert,
      store: storeToInsert,
      price: priceToInsert,
      usage_time: usageToInsert,
    } = formData;

    const rating =
      Object.values(ratings).reduce((a, b) => a + b, 0) /
      Object.values(ratings).length;

    const { data: insertedReview, error: insertError } = await supabase
      .from("reviews")
      .insert([
        {
          users_id,
          product_id,
          rating,
          text: descToInsert,
          title: titleToInsert,
          store: storeToInsert,
          price_paid: Number(priceToInsert),
          time_of_use: usageToInsert,
          rating_performance: ratings.performance,
          rating_cost_benefit: ratings.costBenefit,
          rating_comfort: ratings.comfort,
          rating_weight: ratings.weight,
          rating_durability: ratings.durability,
          likes: 0,
          dislikes: 0,
          comments: 0,
        },
      ])
      .select("id")
      .single();

    if (insertError) {
      console.error("Erro ao enviar avaliação:", insertError);
      setIsSubmitting(false);
      return;
    }

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

    await fetchUpdatedProduct();

    setIsSubmitting(false);
    toast.success("Avaliação enviada com sucesso!");

    setFormData({
      title: "",
      description: "",
      store: "",
      price: 0,
      usage_time: "",
    });
    setRatings({
      performance: 0,
      costBenefit: 0,
      comfort: 0,
      weight: 0,
      durability: 0,
    });

    setTimeout(() => {
      window.location.reload();
    }, 3000);
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
        className={`space-y-6 ${!session ? "pointer-events-none select-none opacity-60" : ""
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
                  ${errorMessages[id as keyof FormData]
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
                  ${errorMessages[id as keyof FormData]
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
              className={`flex flex-col text-left min-w-0 ${key === "durability" ? "lg:col-span-4" : ""
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
