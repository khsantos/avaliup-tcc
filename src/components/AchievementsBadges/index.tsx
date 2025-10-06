"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { FaAward } from "react-icons/fa";

type Achievement = {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  unlocked_at?: string;
};

interface AchievementBadgesProps {
  userId?: string;
  size?: "sm" | "md";
}

export function AchievementBadges({ userId, size }: AchievementBadgesProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      if (!userId) {
        console.warn("⚠️ userId não fornecido, pulando busca de conquistas");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_achievements")
          .select(
            `
            unlocked_at,
            achievements (
              id,
              title,
              description,
              image_url
            )
          `
          )
          .eq("user_id", userId)
          .order("unlocked_at", { ascending: false });

        if (error) {
          console.error("❌ Erro completo do Supabase:", error);
          setLoading(false);
          return;
        }

        const formatted: Achievement[] = data
          ?.flatMap((ua) => {
            const ach = ua.achievements;
            return Array.isArray(ach) ? ach : [ach];
          })
          .filter((a) => a != null) as Achievement[];

        setAchievements(formatted.slice(0, 3));
      } catch (err: unknown) {
        console.error("🔥 Erro inesperado ao buscar conquistas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, [userId]);

  if (loading)
    return (
      <p className="text-sm text-muted-foreground">Carregando conquistas...</p>
    );

  if (achievements.length === 0)
    return (
      <p className="text-sm text-muted-foreground">Nenhuma conquista ainda.</p>
    );

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2 mt-2">
        {achievements.map((a) => (
          <Tooltip key={a.id}>
            <TooltipTrigger asChild>
              <div
                className={`relative ${
                  size === "sm" ? "w-6 h-6" : "w-8 h-8"
                } cursor-pointer`}
              >
                {a.image_url ? (
                  <Image
                    src={a.image_url}
                    alt={a.title}
                    fill
                    className="object-contain rounded-full"
                  />
                ) : (
                  <FaAward
                    className={`${
                      size === "sm" ? "w-4 h-4" : "w-6 h-6"
                    } text-yellow-500`}
                  />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="font-semibold text-center">{a.title}</p>
              <p className="text-xs text-center text-gray-500">
                {a.description}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
