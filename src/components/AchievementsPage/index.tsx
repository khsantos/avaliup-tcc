"use client";

import { useEffect, useState } from "react";
import { Award } from "lucide-react";

type Achievement = {
  id: number;
  title: string;
  description: string;
  unlocked: boolean; // novo campo para saber se foi conquistado
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Placeholders
    const placeholderAchievements: Achievement[] = Array.from({
      length: 12,
    }).map((_, i) => ({
      id: i,
      title: "Seja bem-vindo!",
      description: "Realize login no Avali.up pela primeira vez.",
      unlocked: i % 3 === 0, // só para exemplo: 1/3 desbloqueadas
    }));

    setAchievements(placeholderAchievements);
  }, []);

  return (
    <div className="min-h-screen p-4 dark:bg-[#030712] flex justify-center">
      <div className="max-w-7xl w-full p-6">
        {/* Cabeçalho */}
        <h2 className="text-[#010b62] text-3xl font-semibold mb-2 dark:text-white">
          Coleção
        </h2>
        <p className="text-[#010B62]/60 dark:text-[#FFFFFF]/60 mb-10">
          Cumpra os desafios e colecione insígnias!
        </p>

        {/* Grid responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`flex items-center rounded-lg p-4 shadow-sm transition ${
                a.unlocked
                  ? "bg-gray-100 dark:bg-[#030712]"
                  : "bg-gray-100/60 dark:bg-[#030712]/60"
              }`}
            >
              {/* Bloco da imagem */}
              <div
                className={`flex items-center justify-center w-20 h-20 border rounded-md mr-4 shrink-0 transition ${
                  a.unlocked
                    ? "bg-gray-200 dark:bg-[#030712] border-[#01BAEF]"
                    : "bg-gray-200/50 dark:bg-[#030712]/50 border-gray-400 dark:border-gray-600 opacity-50"
                }`}
              >
                <Award
                  size={40}
                  className={`transition ${
                    a.unlocked
                      ? "text-[#010b62] dark:text-[#01baef]"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                />
              </div>

              {/* Bloco do texto */}
              <div
                className={`flex flex-col ${!a.unlocked ? "opacity-60" : ""}`}
              >
                <h3
                  className={`font-semibold text-base mb-1 transition ${
                    a.unlocked
                      ? "text-[#010b62] dark:text-[#01baef]"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {a.title}
                </h3>
                <p
                  className={`text-sm transition ${
                    a.unlocked
                      ? "text-[#010B62]/60 dark:text-[#FFFFFF]/90"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {a.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
