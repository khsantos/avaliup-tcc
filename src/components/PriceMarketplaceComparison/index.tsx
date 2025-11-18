import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/src/lib/supabase";
import { Product_Prices } from "@/src/types/Product_Prices";
import normalizePrice from "@/src/lib/normalizePrice";

type StoreItem = Product_Prices & {
  product_image?: string;
};

export default function PriceMarketplaceComparison({
  productId,
}: {
  productId: number;
}) {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function capitalizeWords(str: string) {
    return str
      .split(",")
      .map((s) => s.trim())
      .map((s) =>
        s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ""
      )
      .join(", ");
  }

  useEffect(() => {
    let mounted = true;
    async function fetchPrices() {
      if (!productId) {
        setStores([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("product_prices")
          .select(
            `
            name,
            marketplace,
            price,
            old_price,
            href,
            is_on_sale,
            products_id,
            products ( image )
          `
          )
          .eq("products_id", productId)
          .order("price", { ascending: true });

        if (error) throw error;

        const { data: productData } = await supabase
          .from("products")
          .select("id, name, price, old_price, href, image, marketplace")
          .eq("id", productId)
          .single();

        const typedData = (data || []) as unknown as {
          name: string;
          marketplace: string;
          price: number;
          old_price: number | null;
          href: string;
          is_on_sale: boolean;
          products_id: number;
          products?: { image: string } | null;
        }[];

        const mapped: StoreItem[] = typedData.map((item) => ({
          ...item,
          product_image: item.products?.image || "/logo-menu.svg",
        }));

        let allStores: StoreItem[] = mapped;

        if (productData) {
          const exists = mapped.some(
            (item) =>
              item.marketplace.toLowerCase().trim() ===
              (productData.marketplace?.toLowerCase().trim() || "")
          );

          if (!exists) {
            allStores = [
              {
                name: productData.name,
                marketplace: productData.marketplace || "Produto Principal",
                price: productData.price,
                old_price: productData.old_price ?? null,
                href: productData.href,
                is_on_sale:
                  productData.old_price !== null &&
                  productData.old_price > productData.price,
                products_id: productData.id,
                product_image: productData.image || "/logo-menu.svg",
              },
              ...mapped,
            ];
          }
        }

        allStores.sort((a, b) => {
          if ((a.is_on_sale ?? false) === (b.is_on_sale ?? false))
            return (a.price ?? 0) - (b.price ?? 0);
          return a.is_on_sale ? -1 : 1;
        });

        if (mounted) {
          setStores(allStores);
        }
      } catch (err: unknown) {
        console.error("Erro ao buscar preços: ", err);
        if (mounted) setError("Não foi possível carregar os preços.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchPrices();

    return () => {
      mounted = false;
    };
  }, [productId]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }),
    []
  );

  if (loading) {
    return (
      <div className="mt-6 max-w-[1600px] mx-auto px-2 sm:px-4" aria-busy>
        <h2 className="text-2xl font-bold text-[#010b62] dark:text-white mb-0">
          Opções de lojas
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Encontre a melhor opção para o seu bolso.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-md bg-white/60 dark:bg-[#020317]/60 h-44 p-4"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 max-w-[1600px] mx-auto px-2 sm:px-4">
      <h2 className="text-2xl font-bold text-[#010b62] mb-0 dark:text-white">
        Opções de lojas
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Encontre a melhor opção para o seu bolso.
      </p>

      {error ? (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      ) : stores.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">
          Nenhum preço disponível ainda
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
          role="list"
        >
          {stores.map((store, index) => {
            const price = normalizePrice(store.price);
            const oldPrice =
              store.old_price !== null ? normalizePrice(store.old_price) : null;

            return (
              <a
                key={`${store.marketplace}-${String(
                  store.products_id ?? ""
                )}-${index}`}
                href={store.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
                aria-label={`Ir para ${store.marketplace} - ${store.name}`}
                role="listitem"
              >
                <Card
                  className={`relative overflow-hidden rounded-md border transition-all duration-200 ease-in-out group-hover:scale-[1.02] group-hover:shadow-lg
                    flex flex-col justify-between h-full cursor-pointer border-[#010b62] dark:border-white dark:bg-[#030712] bg-white`}
                >
                  <CardContent className="pt-6 px-3 pb-3 flex flex-col min-h-[220px] md:min-h-[240px]">
                    <div className="flex gap-3 items-start">
                      <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center shrink-0 mt-1">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src={store.product_image || "/logo-menu.svg"}
                            alt={store.name || store.marketplace}
                            width={280}
                            height={200}
                            sizes="(min-width:1024px) 160px, (min-width:768px) 140px, 120px"
                            className="object-contain"
                            loading="lazy"
                            priority={false}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col justify-start w-full min-w-0">
                        <h3 className="mb-1 font-semibold text-[#010b62] dark:text-white text-sm md:text-base truncate">
                          {capitalizeWords(store.marketplace)}
                        </h3>

                        <p className="text-sm md:text-[15px] text-[#010b62] dark:text-white line-clamp-2 overflow-hidden mb-2 min-w-0">
                          {store.name}
                        </p>

                        <div className="mt-auto">
                          <div className="text-lg sm:text-xl font-bold text-[#010b62] dark:text-white leading-snug">
                            {formatter.format(price)}{" "}
                            <span className="text-sm font-normal">à vista</span>
                          </div>

                          <div className="text-[12px] sm:text-[14px] text-gray-400 leading-tight">
                            {oldPrice !== null ? (
                              <>
                                ou{" "}
                                <span className="font-semibold text-[#010b62]/70 dark:text-white/70">
                                  {formatter.format(oldPrice)}{" "}
                                  <span className="text-[12px] font-normal">
                                    à prazo
                                  </span>
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold text-[#010b62]/70 dark:text-white/70">
                                sem preço a prazo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3">
                      <Button
                        className="w-full dark:bg-[#01BAEF] dark:hover:bg-[#33C9F2] bg-[#010b62] hover:bg-[#1C2CA3] text-white font-semibold text-sm sm:text-md h-9 transition-all duration-200 transform group-hover:scale-[1.03] group-hover:brightness-110"
                        type="button"
                        aria-label={`Acessar ${store.marketplace}`}
                      >
                        Acessar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
