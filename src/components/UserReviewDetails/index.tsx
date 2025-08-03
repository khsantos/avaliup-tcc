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
import { UserReview } from "@/src/types/User_Review";

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
      <DialogContent className="max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-[#010b62] dark:text-white">
            Mais detalhes
          </DialogTitle>
        </DialogHeader>

        <div>
          <h3 className="font-semibold mb-4 text-[#010b62] dark:text-white">
            Avaliações por características
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {characteristics.map((char) => (
              <div key={char.label} className="flex flex-col">
                <span className="text-sm font-medium text-[#010b62] dark:text-white">
                  {char.label}
                </span>
                <div className="flex mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < char.value
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

        <DialogFooter>
          <Button
            className="bg-[#010b62] text-white hover:bg-[#010b62]/80 dark:bg-[#01BAEF] dark:hover:bg-[#0096c7]"
            onClick={onClose}
          >
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
