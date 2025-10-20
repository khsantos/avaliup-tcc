import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { BiSolidDiscount } from "react-icons/bi";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { Product_Prices } from "@/src/types/Product_Prices";

export default function PriceMarketplaceComparison({
  productId,
}: {
  productId: number;
}) {
  const [stores, setStores] = useState<Product_Prices[]>([]);
  const [loading, setLoading] = useState(true);

  function capitalizeWords(str: string) {
    return str
      .split(",")
      .map((s) => s.trim())
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      .join(", ");
  }

  useEffect(() => {
    async function fetchPrices() {
      if (!productId) return;

      setLoading(true);

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

      if (error) {
        console.error("Erro ao buscar preços: ", error);
        return;
      }

      const { data: productData } = await supabase
        .from("products")
        .select("id, name, price, old_price, href, image, marketplace")
        .eq("id", productId)
        .single();

      const typedData = data as unknown as {
        name: string;
        marketplace: string;
        price: number;
        old_price: number | null;
        href: string;
        is_on_sale: boolean;
        products_id: number;
        products?: { image: string } | null;
      }[];

      const mapped = typedData.map((item) => ({
        ...item,
        product_image: item.products?.image || "/logo-menu.svg",
      }));

      let allStores = mapped;

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
              old_price: productData.old_price,
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
        if (a.is_on_sale === b.is_on_sale) return a.price - b.price;
        return a.is_on_sale ? -1 : 1;
      });

      setStores(allStores);
      setLoading(false);
    }

    fetchPrices();
  }, [productId]);

  return (
    <div className="mt-6 max-w-[1600px] mx-auto px-2 sm:px-4">
      <h2 className="text-2xl font-bold text-[#010b62] mb-0 dark:text-white">
        Opções de lojas
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Encontre a melhor opção para o seu bolso.
      </p>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Carregando preços...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stores.map((store, index) => (
            <a
              key={index}
              href={store.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card
                className={`relative overflow-hidden rounded-md border transition-all duration-200 ease-in-out group-hover:scale-[1.02] group-hover:shadow-lg ${
                  store.is_on_sale
                    ? "border-[#FFB24B] bg-white dark:bg-[#010a24]"
                    : "border-[#010b62] dark:border-white dark:bg-[#010a24]"
                } flex flex-col justify-between h-full cursor-pointer`}
              >
                {store.is_on_sale && (
                  <div className="absolute top-0 left-0 right-0 bg-[#FFB24B] text-white text-md font-bold text-center py-1 z-10">
                    <span className="inline-flex items-center justify-center gap-1">
                      <BiSolidDiscount size={16} />
                      Promoção
                    </span>
                  </div>
                )}

                <CardContent className="pt-6 px-3 pb-3 flex flex-col min-h-[250px]">
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="w-full sm:w-24 h-32 flex items-center justify-center shrink-0 mt-4 sm:mt-0">
                      <Image
                        src={store.product_image!}
                        alt={store.name}
                        width={140}
                        height={120}
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-start w-full">
                      <h1 className="mb-2 font-bold text-[#010b62] dark:text-white text-base sm:text-lg">
                        {capitalizeWords(store.marketplace)}
                      </h1>
                      <h3 className="font-normal text-sm sm:text-md leading-tight text-left mb-1 text-[#010b62] dark:text-white line-clamp-2 overflow-hidden">
                        {store.name}
                      </h3>
                      <div className="mt-2">
                        <div className="text-lg sm:text-xl font-bold text-[#010b62] dark:text-white leading-snug">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            minimumFractionDigits: 2,
                          }).format(store.price)}{" "}
                          <span className="text-sm font-normal">à vista</span>
                        </div>
                        <div className="text-[12px] sm:text-[14px] text-gray-400 leading-tight">
                          {store.old_price !== null ? (
                            <>
                              ou{" "}
                              <span className="font-semibold text-[#010b62]/70 dark:text-white/70">
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                  minimumFractionDigits: 2,
                                }).format(store.old_price)}{" "}
                                à prazo
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

                  <div className="pt-3 mt-auto">
                    <Button
                      className="w-full dark:bg-[#01BAEF] dark:hover:bg-[#00a3e6] bg-[#010b62] hover:bg-[#010A24] text-white font-semibold text-sm sm:text-md h-8 transition-all duration-200 transform group-hover:scale-[1.03] group-hover:brightness-110"
                      type="button"
                    >
                      Acessar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
