"use client";

import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Link from "next/link";
import { toast } from "sonner";
import { PriceNotification } from "@/src/types/PriceNotification";
import { usePriceAlerts } from "@/src/hooks/usePriceAlerts";

type Props = {
  onClose: () => void;
  open: boolean;
};

export default function NotificationsSheet({ onClose, open }: Props) {
  const [notifications, setNotifications] = useState<PriceNotification[]>([]);
  const [loading, setLoading] = useState(true);

  usePriceAlerts(notifications, setNotifications);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data: notificationsData, error: notificationsError } =
      await supabase
        .from("price_notifications")
        .select("id, product_id, min_price, max_price, created_at")
        .order("created_at", { ascending: false });

    if (notificationsError) {
      console.error("Erro ao buscar notificações:", notificationsError.message);
      setLoading(false);
      return;
    }

    if (!notificationsData || notificationsData.length === 0) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const productIds = notificationsData.map((n) => n.product_id);
    const { data: productsData } = await supabase
      .from("products")
      .select("id, name")
      .in("id", productIds);

    const merged = notificationsData.map((n) => ({
      ...n,
      product: productsData?.find((p) => p.id === n.product_id) ?? null,
    }));

    setNotifications(merged);
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("price_notifications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir notificação:", error.message);
      return;
    }

    toast.success("Notificação excluída com sucesso!");
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <SheetContent
      side="right"
      className="w-[400px] sm:w-[500px] border-white dark:bg-[#030712] dark:border-white"
    >
      <SheetHeader>
        <SheetTitle className="dark:text-white text-[#010b62]">
          Minhas notificações
        </SheetTitle>
        <SheetDescription className="text-[#010b62]/70 dark:text-gray-400">
          Aqui estão os alertas de preço que você configurou.
        </SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto">
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : notifications.length > 0 ? (
          notifications.map((n) => {
            const cardClasses = n.triggered
              ? "p-3 border border-green-500 rounded-md flex flex-col gap-2 bg-green-50 dark:border-green-400 dark:bg-green-900/30"
              : "p-3 border border-[#010b62] rounded-md flex flex-col gap-2 bg-white dark:border-white dark:bg-[#030712]";

            return (
              <div key={n.id} className={cardClasses}>
                <div className="flex justify-between items-center">
                  {n.product ? (
                    <Link
                      href={`/produto/${n.product.id}`}
                      onClick={onClose}
                      className={`font-medium hover:underline ${
                        n.triggered
                          ? "text-green-600 dark:text-green-400"
                          : "text-[#010b62] dark:text-[#01BAEF]"
                      }`}
                    >
                      {n.product.name}
                    </Link>
                  ) : (
                    <span className="font-medium text-[#010b62] dark:text-[#01BAEF]">
                      Produto desconhecido
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    {n.triggered && (
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">
                        Dentro do preço!
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(n.id)}
                      className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:bg-[#030712] dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-white px-3 cursor-pointer"
                    >
                      Excluir
                    </Button>
                  </div>
                </div>

                <p className="text-sm">
                  Alerta: R$ {n.min_price} - R$ {n.max_price}
                  {n.current_price !== undefined && (
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">
                      (Atual: R$ {n.current_price})
                    </span>
                  )}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Criado em:{" "}
                  {new Date(n.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground text-sm">
            Você ainda não configurou notificações.
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="border border-[#010b62] hover:bg-[#010b62] hover:text-white text-[#010b62] dark:border-none dark:text-white dark:bg-[#01BAEF] dark:hover:bg-[#33C9F2] px-8 cursor-pointer"
        >
          Fechar
        </Button>
      </div>
    </SheetContent>
  );
}
