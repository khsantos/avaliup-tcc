"use client";

import { useState } from "react";
import ProductSpecification from "../ProductSpecification";
import PriceMarketplaceComparison from "../PriceMarketplaceComparison";
import UserReviews from "../UserReview";
import FAQ from "../FAQ";

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
          <div className="">
            <UserReviews />
          </div>
        );

      case "precos":
        return (
          <div>
            <PriceMarketplaceComparison />
          </div>
        );

      case "especificacoes":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-1 text-[#010b62] dark:text-white">
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
          <div className="">
            <div className="mb-10">
              <h3 className="text-2xl font-semibold mb-1 text-[#010b62] dark:text-white">
                Dúvidas
              </h3>
              <span className="text-[#010b62]/50 dark:text-white/50">
                Observe e interaja com as dúvidas de nossa comunidade
              </span>
            </div>
            <div className="space-y-4">
              <FAQ />
              <FAQ />
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
                      ? "text-[#010b62] dark:text-white"
                      : "text-gray-600 hover:text-gray-700"
                  }
                `}
                style={{
                  borderBottom: isActive
                    ? "3px solid #ffffff"
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
