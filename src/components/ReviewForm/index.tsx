import { useState } from "react";
import StarRatingInput from "../StarRatingInput";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

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
      <h2 className="text-3xl font-medium text-[#000080]">Avaliar Produto</h2>
      <form className="space-y-6">
        <div className="grid gap-2">
          <div className="relative w-full">
            <input
              type="text"
              id="review-title"
              placeholder=" "
              className="peer w-full border-2 border-[#010b62] dark:border-[#01BAEF] rounded-md px-3 pt-5 pb-2 text-sm bg-white dark:bg-[#030712] text-[#010b62] dark:text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#010b62] dark:focus:ring-[#01BAEF] transition-all"
            />
            <label
              htmlFor="review-title"
              className="absolute left-3 top-2 text-sm text-[#010b62] dark:text-white bg-white dark:bg-[#030712] px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#010b62] dark:peer-focus:text-white"
            >
              Título da avaliação
            </label>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="review-description" className="text-sm text-gray-600">
            Descrição da avaliação
          </Label>
          <Textarea
            id="review-description"
            placeholder=""
            rows={5}
            className="border border-blue-700 focus:border-blue-900"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="purchase-store" className="text-sm text-gray-600">
            Loja / Site da compra
          </Label>
          <Input
            id="purchase-store"
            placeholder=""
            className="border border-blue-700 focus:border-blue-900"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price-paid" className="text-sm text-gray-600">
            Valor pago
          </Label>
          <Input
            id="price-paid"
            placeholder=""
            type="number"
            className="border border-blue-700 focus:border-blue-900"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="time-of-use" className="text-sm text-gray-600">
            Tempo de uso
          </Label>
          <Input
            id="time-of-use"
            placeholder=""
            className="border border-blue-700 focus:border-blue-900"
          />
        </div>

        {/* Form Characteristic Ratings */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ratingFields.map(({ label, key }) => (
            <div key={key} className="flex flex-col items-center text-center">
              <Label className="text-sm text-gray-600 mb-1">{label}</Label>
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
          className="w-full bg-[#000080] hover:bg-[#000060] text-white py-3 text-lg font-semibold"
        >
          Enviar Avaliação
        </Button>
      </form>
    </div>
  );
}
