"use client";

import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import Image from "next/image";
import { useSupabase } from "@/src/contexts/supabase-provider";
import { Achievement } from "@/src/types/Achievements";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { supabase, user } = useSupabase();

  interface AchievementRow {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
  }

  interface UserAchievement {
    achievements_id: string;
    unlocked_at: string;
  }

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    async function fetchAchievements() {
      const { data: allAchievements, error: achError } = await supabase
        .from("achievements")
        .select("id, title, description, image_url");

      if (achError || !allAchievements) {
        console.error("Erro ao buscar conquistas:", achError?.message);
        return;
      }

      const { data: userAchData, error: uaError } = await supabase
        .from("user_achievements")
        .select("achievements_id, unlocked_at")
        .eq("user_id", userId);

      if (uaError || !userAchData) {
        console.error(
          "Erro ao buscar conquistas do usuário:",
          uaError?.message
        );
      }

      const userAchievementsIds = new Set(
        (userAchData || []).map((ua: UserAchievement) => ua.achievements_id)
      );

      const mapped = (allAchievements as AchievementRow[])
        .map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          image_url: a.image_url,
          unlocked: userAchievementsIds.has(a.id),
        }))
        .sort((a, b) => {
          if (a.unlocked === b.unlocked) return 0;
          return a.unlocked ? -1 : 1;
        });

      setAchievements(mapped);
    }

    fetchAchievements();
  }, [supabase, user?.id]);

  return (
    <div className="min-h-screen p-4 dark:bg-[#030712] flex justify-center">
      <div className="max-w-7xl w-full p-6">
        <h2 className="text-[#010b62] text-3xl font-semibold mb-2 dark:text-white">
          Coleção
        </h2>
        <p className="text-[#010B62]/60 dark:text-[#FFFFFF]/60 mb-10">
          Cumpra os desafios e colecione insígnias!
        </p>

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
              <div
                className={`flex items-center justify-center w-20 h-20 border rounded-md mr-4 shrink-0 transition ${
                  a.unlocked
                    ? "bg-gray-200 dark:bg-[#030712] dark:border-[#01BAEF] border-[#010b62]"
                    : "bg-gray-200/50 dark:bg-[#030712]/50 border-gray-400 dark:border-gray-600 opacity-50"
                }`}
              >
                {a.image_url ? (
                  <Image
                    src={a.image_url}
                    alt={a.title}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <Award
                    size={40}
                    className={`transition ${
                      a.unlocked
                        ? "text-[#010b62] dark:text-[#01baef]"
                        : "text-gray-400 dark:text-gray-600"
                    }`}
                  />
                )}
              </div>

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
