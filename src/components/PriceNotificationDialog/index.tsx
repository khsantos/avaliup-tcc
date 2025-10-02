"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { supabase } from "@/src/lib/supabase";
import { useSupabase } from "@/src/contexts/supabase-provider";
import { toast } from "sonner";

interface PriceNotificationDialogProps {
  productId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PriceNotificationDialog({
  productId,
  open,
  onOpenChange,
}: PriceNotificationDialogProps) {
  const { session } = useSupabase();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast.error("Você precisa estar logado para criar notificações.");
      return;
    }

    if (!minPrice || !maxPrice) {
      toast.error("Preencha os valores mínimo e máximo.");
      return;
    }

    setLoading(true);

    const { data: existing, error: selectError } = await supabase
      .from("price_notifications")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("product_id", productId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      toast.error("Erro ao verificar notificações existentes.");
      setLoading(false);
      console.error(selectError);
      return;
    }

    if (existing) {
      toast.error("Você já possui uma notificação para este produto.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("price_notifications").insert({
      user_id: session.user.id,
      product_id: productId,
      min_price: parseFloat(minPrice),
      max_price: parseFloat(maxPrice),
    });

    setLoading(false);

    if (error) {
      toast.error("Erro ao salvar notificação.");
      console.error(error);
    } else {
      toast.success("Notificação criada com sucesso!");
      onOpenChange(false);
      setMinPrice("");
      setMaxPrice("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[728px] bg-gray-100 border-white dark:bg-[#030712] dark:border-white">
        <DialogHeader>
          <DialogTitle className="dark:text-white text-[#010b62]">
            Alerta de preços
          </DialogTitle>
          <DialogDescription className="text-[#010b62]/70 dark:text-gray-400">
            Configure um alerta de preço para este produto e defina um intervalo
            desejado. Você será notificado assim que o preço estiver dentro
            desse limite.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium dark:text-white mb-1 text-center text-[#010b62]">
              Valor mínimo
            </label>
            <div className="flex w-52 border dark:border-white border-[#010b62] rounded-md overflow-hidden">
              <span className="px-2 py-2 text-[#010b62] dark:text-white flex items-center justify-center">
                R$
              </span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1 px-2 py-2 text-[#010b62] dark:text-white outline-none"
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <label className="text-sm font-medium dark:text-white text-[#010b62] mb-1 text-center">
              Valor máximo
            </label>
            <div className="flex w-52 border dark:border-white border-[#010b62] rounded-md overflow-hidden">
              <span className="px-2 py-2 text-[#010b62] dark:text-white flex items-center justify-center">
                R$
              </span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1 px-2 py-2 dark:text-white text-[#010b62] outline-none"
                placeholder="0,00"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-start gap-2 w-full">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#010b62] hover:bg-[#1C2CA3] dark:bg-[#01BAEF] px-10 dark:hover:bg-[#33C9F2] dark:text-white"
            >
              {loading ? "Salvando..." : "Confirmar"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border border-[#010b62] text-[#010b62] px-10 ml-2 hover:bg-gray-200 hover:text-[#1C2CA3] dark:bg-[#030712] dark:text-white dark:hover:text-gray-300 "
            >
              Cancelar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
