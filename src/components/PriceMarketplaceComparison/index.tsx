import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

export default function PriceMarketplaceComparison() {
  const stores = [
    {
      name: "AliExpress",
      price: "R$335,00",
      originalPrice: "R$385,00",
      installments: "à vista",
      isPromotion: true,
      color: "bg-orange-500",
    },
    {
      name: "Kabum",
      price: "R$385,00",
      originalPrice: "R$405,00",
      installments: "3x sem juros",
      isPromotion: false,
      color: "bg-blue-900",
    },
    {
      name: "Mercado Livre",
      price: "R$395,00",
      originalPrice: "R$415,00",
      installments: "3x sem juros",
      isPromotion: false,
      color: "bg-blue-900",
    },
    {
      name: "Amazon",
      price: "R$405,00",
      originalPrice: "R$425,00",
      installments: "3x sem juros",
      isPromotion: false,
      color: "bg-blue-900",
    },
    {
      name: "Magalu",
      price: "R$415,00",
      originalPrice: "R$435,00",
      installments: "3x sem juros",
      isPromotion: false,
      color: "bg-blue-900",
    },
  ];

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stores.map((store, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border hover:shadow-lg transition-shadow bg-white flex flex-col min-h-[270px]"
          >
            {store.isPromotion && (
              <div className="absolute top-0 left-0 right-0 bg-[#FFB24B] text-white text-center py-1 text-xs font-medium">
                🔥 Promoção
              </div>
            )}

            <CardContent className="p-4 pt-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  {/* Product Image - Left Side */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?height=50&width=50"
                        alt="Mouse sem fio"
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Content - Right Side */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-2 text-gray-900 truncate">
                      {store.name}
                    </h3>

                    <div className="text-left">
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {store.price}
                      </div>
                      <div className="text-xs text-gray-500">
                        de{" "}
                        <span className="line-through">
                          {store.originalPrice}
                        </span>{" "}
                        {store.installments}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button - Full Width at Bottom */}
              <Button className="w-full bg-[#010b62] hover:bg-[#010b62]/90 text-white font-semibold text-sm mt-auto">
                Acessar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
