import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/src/lib/supabase";
import { PriceNotification } from "../types/PriceNotification";

export function usePriceAlerts(
  notifications: PriceNotification[],
  setNotifications: React.Dispatch<React.SetStateAction<PriceNotification[]>>
) {
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;

    const channel = supabase
      .channel("prices")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "product_prices" },
        (payload) => {
          const newPrice = payload.new.price as number;
          const productId = payload.new.product_id as string;

          setNotifications((prev) =>
            prev.map((n) => {
              if (n.product_id === productId) {
                const triggered =
                  newPrice >= n.min_price && newPrice <= n.max_price;

                if (triggered) {
                  toast.success(
                    `O produto "${n.product?.name ?? "desconhecido"}" está por R$ ${newPrice}!`
                  );
                }

                return {
                  ...n,
                  current_price: newPrice,
                  triggered,
                };
              }
              return n;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [notifications, setNotifications]);
}
