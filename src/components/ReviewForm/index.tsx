import { useState } from "react";
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

  return (
    <div className="space-y-8">
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
                className="w-full border-2 border-[#010b62]/50 dark:border-[#01BAEF] rounded-md px-3 pt-5 pb-2 text-sm bg-white dark:bg-[#030712] text-[#010b62] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#010b62] dark:focus:ring-[#01BAEF]"
              />
            ) : (
              <input
                id={field.id}
                type={field.type}
                className={`w-full border-2 border-[#010b62]/50 dark:border-[#01BAEF] rounded-md px-3 pt-5 pb-2 text-sm bg-white dark:bg-[#030712] text-[#010b62] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#010b62] dark:focus:ring-[#01BAEF] ${
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

        {/* Form Characteristic Ratings */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ratingFields.map(({ label, key }) => (
            <div key={key} className="flex flex-col items-center text-center">
              <label className="text-sm text-gray-600 mb-1">{label}</label>
              <StarRatingInput
                value={ratings[key]}
                onChange={(value) =>
                  setRatings((prev) => ({
                    ...prev,
                    [key]: value,
                  }))
                }
                size={20}
              />
            </div>
          ))}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#010b62] hover:bg-[#020B24] text-white py-5 text-lg font-semibold"
        >
          Enviar Avaliação
        </Button>
      </form>

      {/* ✅ CSS que remove os spinners */}
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
