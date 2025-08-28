"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Star } from "lucide-react";
import { UserReview } from "@/src/types/UserReview";

type ReviewDetailsModalProps = {
  review: UserReview;
  open: boolean;
  onClose: () => void;
};

export default function ReviewDetailsModal({
  review,
  open,
  onClose,
}: ReviewDetailsModalProps) {
  const characteristics = [
    { label: "Performance", value: review.rating_performance },
    { label: "Custo-benefício", value: review.rating_cost_benefit },
    { label: "Conforto", value: review.rating_comfort },
    { label: "Peso", value: review.rating_weight },
    { label: "Durabilidade", value: review.rating_durability },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[900px] w-[900px]  rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#010b62] dark:text-white">
            Mais detalhes
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <h3 className="font-semibold mb-6 text-[#010b62] dark:text-white">
            Avaliações por características
          </h3>

          {/* Layout horizontal com separadores */}
          <div className="flex items-start justify-between border border-gray-200 rounded-lg px-6 py-4 gap-6">
            {characteristics.map((char, index) => (
              <div
                key={char.label}
                className={`flex flex-col items-center flex-1 ${
                  index !== characteristics.length - 1 ? "border-r pr-4" : ""
                }`}
              >
                <span className="text-base font-medium text-[#010b62] dark:text-white mb-2">
                  {char.label}
                </span>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < (char.value ?? 0)
                          ? "fill-[#FFB24B] text-[#FFB24B]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="justify-start mt-6">
          <Button
            className="bg-[#010b62] text-white hover:bg-[#010b62]/80 dark:bg-[#01BAEF] dark:hover:bg-[#33C9F2] px-6 py-2 text-lg rounded"
            onClick={onClose}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
