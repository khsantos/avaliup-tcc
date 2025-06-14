"use client"

import { useState } from "react"
import { Card } from "../ui/card"
import { Star, DollarSign, Settings, HelpCircle } from "lucide-react"
import PriceHistoryChart from "../PriceHistoryChart"
import ProductSpecification from "../ProductSpecification"

export default function ProductTabs() {
    const [activeTab, setActiveTab] = useState("especificacoes")

    const tabs = [
        { id: "avaliacoes", label: "Avaliações", icon: Star },
        { id: "precos", label: "Preços", icon: DollarSign },
        { id: "especificacoes", label: "Especificações", icon: Settings },
        { id: "duvidas", label: "Dúvidas", icon: HelpCircle },
    ]

    const renderTabContent = () => {
        switch (activeTab) {
            case "avaliacoes":
                return (
                    <div className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Avaliações dos Usuários</h3>
                        <div className="space-y-4">
                            <div className="border-b pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">João Silva</span>
                                </div>
                                <p className="text-gray-700">Excelente mouse para gaming! Muito preciso e confortável.</p>
                            </div>
                            <div className="border-b pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(4)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-current" />
                                        ))}
                                        <Star className="w-4 h-4 text-gray-300" />
                                    </div>
                                    <span className="text-sm text-gray-600">Maria Santos</span>
                                </div>
                                <p className="text-gray-700">Boa qualidade, mas poderia ter mais opções de customização.</p>
                            </div>
                        </div>
                    </div>
                )

            case "precos":
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-1 text-[#010b62]">
                            Histórico de preços
                        </h2>
                        <p className="text-sm text-gray-400 mb-4">
                            Acompanhe a variação do preço deste produto ao longo do tempo.
                        </p>
                        <PriceHistoryChart />
                    </div>
                )

            case "especificacoes":
                return (
                    <ProductSpecification />
                )

            case "duvidas":
                return (
                    <div className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Dúvidas Frequentes</h3>
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-2">Como configurar o DPI?</h4>
                                <p className="text-gray-600 text-sm">
                                    Você pode ajustar o DPI através do software oficial ou usando os botões dedicados no mouse.
                                </p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-2">A bateria dura quanto tempo?</h4>
                                <p className="text-gray-600 text-sm">
                                    Com uso moderado, a bateria de 500mAh dura aproximadamente 70 horas de uso contínuo.
                                </p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-2">É compatível com Mac?</h4>
                                <p className="text-gray-600 text-sm">
                                    Sim, é compatível com Windows, Mac e Linux através de conexão USB ou Bluetooth.
                                </p>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="max-w-9xl mx-auto p-6">
            <div className=" mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-3 px-1 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>
            </div>

            <div className="">{renderTabContent()}</div>
        </div>
    )
}
