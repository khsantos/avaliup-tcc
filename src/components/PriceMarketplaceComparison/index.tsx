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
      installments: "à vista",
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stores.map((store, index) => (
          <Card
            key={index}
            className="relative overflow-hidden rounded-md border border-white bg-[#050b1e] flex flex-col justify-between min-h-[220px] min-w-[210px] lg:min-h-[250px] lg:min-w-[240px]"
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
              {/* Layout principal: imagem à esquerda, nome e preços à direita */}
              <div className="flex gap-3 flex-1 items-start">
                {/* Imagem */}
                <div className="w-14 h-28 bg-white rounded flex items-center justify-center shrink-0 mt-1">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Produto"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                {/* Nome da loja e preços alinhados à direita */}
                <div className="flex flex-col justify-start w-full">
                  <h3 className="font-normal text-md leading-tight text-left mb-1">
                    {store.name}
                  </h3>
                  <div>
                    <div className="text-lg font-normal mt-12">
                      {store.price} à vista
                    </div>
                    <div className="text-[14px] text-gray-400 leading-tight">
                      ou{" "}
                      <span className="font-semibold">
                        {store.originalPrice}
                      </span>{" "}
                      {store.installments}
                    </div>
                  </div>
                </div>
              </div>
              {/* Botão sempre colado ao final do card */}
              <div className="mt-auto pt-3">
                <Button className="w-full bg-[#01BAEF] hover:bg-[#00a3e6] text-white font-semibold text-md h-8">
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
