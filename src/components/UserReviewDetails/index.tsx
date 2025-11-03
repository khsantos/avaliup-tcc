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
      <DialogContent className="!max-w-[95vw] sm:!max-w-[700px] lg:!max-w-[900px] w-[95vw] sm:w-full mx-auto rounded-xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-[#010b62] dark:text-white">
            Mais detalhes
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <h3 className="font-semibold mb-4 sm:mb-6 text-[#010b62] dark:text-white">
            Avaliações por características
          </h3>

          <div className="flex flex-wrap gap-4 border border-gray-200 dark:border-gray-600 rounded-lg p-4 sm:p-6">
            {characteristics.map((char) => (
              <div
                key={char.label}
                className="flex flex-col items-center flex-1 min-w-[100px] sm:min-w-[120px]"
              >
                <span className="text-sm sm:text-base font-medium text-[#010b62] dark:text-white mb-2 text-center">
                  {char.label}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        i < (char.value ?? 0)
                          ? "fill-[#FFB24B] text-[#FFB24B]"
                          : "text-gray-300 dark:text-gray-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="justify-center sm:justify-start mt-4 sm:mt-6">
          <Button
            className="bg-[#010b62] text-white hover:bg-[#010b62]/80 dark:bg-[#01BAEF] dark:hover:bg-[#33C9F2] px-4 sm:px-6 py-2 text-sm sm:text-lg rounded"
            onClick={onClose}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
