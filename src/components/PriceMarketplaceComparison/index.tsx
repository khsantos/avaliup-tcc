import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { BiSolidDiscount } from "react-icons/bi";

export default function PriceMarketplaceComparison() {
  const stores = [
    {
      name: "AliExpress",
      price: "R$335,00",
      originalPrice: "R$385,00",
      installments: "a prazo",
      isPromotion: true,
    },
    {
      name: "Kabum",
      price: "R$385,00",
      originalPrice: "R$405,00",
      installments: "a prazo",
      isPromotion: false,
    },
    {
      name: "Mercado Livre",
      price: "R$395,00",
      originalPrice: "R$415,00",
      installments: "a prazo",
      isPromotion: false,
    },
    {
      name: "Amazon",
      price: "R$405,00",
      originalPrice: "R$425,00",
      installments: "a prazo",
      isPromotion: false,
    },
    {
      name: "Magalu",
      price: "R$415,00",
      originalPrice: "R$435,00",
      installments: "a prazo",
      isPromotion: false,
    },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-[#010b62] mb-0 dark:text-white">
        Opções de lojas
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Encontre a melhor opção para o seu bolso.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stores.map((store, index) => (
          <Card
            key={index}
            className={`relative overflow-hidden rounded-md border ${
              store.isPromotion
                ? "border-[#FFB24B] bg-white dark:bg-[#010a24]"
                : "border-[#010b62] dark:border-white dark:bg-[#010a24]"
            } flex flex-col justify-between h-[220px]`}
          >
            {/* Promo banner */}
            {store.isPromotion && (
              <div className="absolute top-0 left-0 right-0 bg-[#FFB24B] text-white text-md font-bold text-center py-1 z-10">
                <span className="inline-flex items-center justify-center gap-1">
                  <BiSolidDiscount size={16} />
                  Promoção
                </span>
              </div>
            )}

            <CardContent className="pt-6 px-3 pb-3 flex flex-col h-full">
              {/* Layout principal */}
              <div className="flex gap-3 items-start flex-1">
                <div className="w-14 h-28 flex items-center justify-center shrink-0 mt-1">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Produto"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col justify-start w-full">
                  <h3 className="font-normal text-md leading-tight text-left mb-1 text-[#010b62] dark:text-white">
                    {store.name}
                  </h3>
                  <div>
                    <div className="text-lg font-bold text-[#010b62] dark:text-white leading-snug mt-10">
                      {store.price}{" "}
                      <span className="text-sm font-normal">à vista</span>
                    </div>
                    <div className="text-[14px] text-gray-400 leading-tight">
                      ou{" "}
                      <span className="font-semibold text-[#010b62]/70 dark:text-white/70">
                        {store.originalPrice}
                      </span>{" "}
                      {store.installments}
                    </div>
                  </div>
                </div>
              </div>
              {/* Botão */}
              <div className="pt-3">
                <Button className="w-full dark:bg-[#01BAEF] dark:hover:bg-[#00a3e6] bg-[#010b62] hover:bg-[#010A24] text-white font-semibold text-md h-8">
                  Acessar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
