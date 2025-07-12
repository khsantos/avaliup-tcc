"use client";

import { useState } from "react";
import ProductSpecification from "../ProductSpecification";
import PriceMarketplaceComparison from "../PriceMarketplaceComparison";
import UserReviews from "../UserReview";

type ProductTabsProps = {
  productId: string;
};

export default function ProductTabs({ productId }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("especificacoes");

  const tabs = [
    { id: "avaliacoes", label: "Avaliações" },
    { id: "precos", label: "Preços" },
    { id: "especificacoes", label: "Especificações" },
    { id: "duvidas", label: "Dúvidas" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "avaliacoes":
        return (
          <div className="p-6">
            <UserReviews />
          </div>
        );

      case "precos":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-1 text-[#010b62]">
              Histórico de preços
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Acompanhe a variação do preço deste produto ao longo do tempo.
            </p>
            {/* <PriceHistoryChart /> */}
            <PriceMarketplaceComparison />
          </div>
        );

      case "especificacoes":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-1 text-[#010b62]">
              Ficha técnica
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Consulte as especificações técnicas deste produto.
            </p>
            <ProductSpecification productId={productId} />
          </div>
        );

      case "duvidas":
        return (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Dúvidas Frequentes</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Como configurar o DPI?</h4>
                <p className="text-gray-600 text-sm">
                  Você pode ajustar o DPI através do software oficial ou usando
                  os botões dedicados no mouse.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">
                  A bateria dura quanto tempo?
                </h4>
                <p className="text-gray-600 text-sm">
                  Com uso moderado, a bateria de 500mAh dura aproximadamente 70
                  horas de uso contínuo.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">É compatível com Mac?</h4>
                <p className="text-gray-600 text-sm">
                  Sim, é compatível com Windows, Mac e Linux através de conexão
                  USB ou Bluetooth.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-9xl mx-auto p-6">
      <div className="mb-6">
        <nav className="flex border-b border-gray-300">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-end pb-1 text-xs sm:text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "text-[#010b62]"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
                style={{
                  borderBottom: isActive
                    ? "3px solid #010b62"
                    : "2px solid #e5e7eb", // gray-300
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
}
