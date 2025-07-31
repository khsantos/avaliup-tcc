import { useEffect, useState } from "react";
import StarRatingInput from "../StarRatingInput";
import { Button } from "../ui/button";

type RatingKey =
  | "performance"
  | "costBenefit"
  | "comfort"
  | "weight"
  | "durability";

export default function ReviewForm() {
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    performance: 0,
    costBenefit: 0,
    comfort: 0,
    weight: 0,
    durability: 0,
  });

  const ratingFields: { label: string; key: RatingKey }[] = [
    { label: "Performance", key: "performance" },
    { label: "Custo-benefício", key: "costBenefit" },
    { label: "Conforto", key: "comfort" },
    { label: "Peso", key: "weight" },
    { label: "Durabilidade", key: "durability" },
  ];

  const [starSize, setStarSize] = useState(18); // Valor padrão

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setStarSize(16); // celular pequeno
      } else if (width < 768) {
        setStarSize(18); // celular/tablet
      } else if (width < 1024) {
        setStarSize(20); // tablet grande
      } else {
        setStarSize(22); // desktop
      }
    };

    handleResize(); // define na primeira renderização
    window.addEventListener("resize", handleResize); // atualiza ao redimensionar
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="space-y-8 max-w-xl w-full mx-auto">
      <h2 className="text-3xl font-medium text-[#010b62] dark:text-white">
        Avaliar Produto
      </h2>
      <form className="space-y-6">
        {[
          { id: "review-title", label: "Título da avaliação", type: "text" },
          {
            id: "review-description",
            label: "Descrição da avaliação",
            type: "textarea",
          },
          {
            id: "purchase-store",
            label: "Loja / Site da compra",
            type: "text",
          },
          { id: "price-paid", label: "Valor pago", type: "number" },
          { id: "time-of-use", label: "Tempo de uso", type: "text" },
        ].map((field) => (
          <div className="relative w-full" key={field.id}>
            {field.type === "textarea" ? (
              <textarea
                id={field.id}
                rows={5}
                className="w-full border-1 border-[#010b62]/50 dark:border-[#01BAEF] rounded-md px-3 pt-5 pb-2 text-sm bg-white dark:bg-[#030712] text-[#010b62] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#010b62] dark:focus:ring-[#01BAEF]"
              />
            ) : (
              <input
                id={field.id}
                type={field.type}
                className={`w-full border-1 border-[#010b62]/50 dark:border-[#01BAEF] rounded-md px-3 pt-5 pb-2 text-sm bg-white dark:bg-[#030712] text-[#010b62] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#010b62] dark:focus:ring-[#01BAEF] ${
                  field.type === "number" ? "no-spinner" : ""
                }`}
              />
            )}
            <label
              htmlFor={field.id}
              className="absolute -top-2 left-3 bg-white dark:bg-[#030712] px-1 text-sm text-[#010b62] dark:text-white"
            >
              {field.label}
            </label>
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
              <label className="text-sm text-[#010b62] dark:text-white mb-1 break-words whitespace-normal leading-snug">
                {label}
              </label>
              <StarRatingInput
                value={ratings[key]}
                onChange={(value) =>
                  setRatings((prev) => ({
                    ...prev,
                    [key]: value,
                  }))
                }
                size={starSize}
              />
            </div>
          ))}
        </div>
        <Button
          type="submit"
          className="w-full bg-[#010b62] hover:bg-[#020B24] dark:bg-[#01BAEF] dark:hover:bg-[#0969DA] text-white py-4 text-lg font-semibold mt-9"
        >
          Enviar Avaliação
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
