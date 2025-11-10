"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSupabase } from "@/src/contexts/supabase-provider";
import ProfileReview from "@/src/components/ProfileOwnReviews";
import ProfileUserActivity from "@/src/components/ProfileUserActivity";
import FavoritesTab from "@/src/components/ProfileFavorites";
import { AchievementBadges } from "@/src/components/AchievementsBadges";
import { supabase } from "@/src/lib/supabase";
import { FaStar, FaThumbsUp } from "react-icons/fa";

export default function Page() {
  const { user, loading } = useSupabase();

  const [tab, setTab] = useState(0);
  const [username, setUsername] = useState<string | null>("Usuário");
  const [email, setEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [upvotes, setUpvotes] = useState<number>(0);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar usuário na tabela users:", error);
          return;
        }

        if (data) {
          setUsername(data.name || "Usuário");
          setEmail(data.email || "");
          setAvatarUrl(data.profile_img || null);
          setUserId(user.id);
          setReviewCount(data.review_count || 0);
          setUpvotes(data.upvotes || 0);
        }
      } catch (err) {
        console.error("Erro inesperado ao buscar usuário:", err);
      }
    }

    fetchUserData();
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-white">
          Carregando perfil...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-6 flex justify-center px-4 sm:px-6">
      <div className="max-w-7xl w-full">
        <div className="bg-white dark:bg-[#030712] shadow-[0_0_7px_2px_rgba(0,0,255,0.1)] dark:shadow-[0_0_7px_2px_rgba(255,255,255,0.1)] rounded-lg px-4 py-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full lg:w-auto">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-[#E3E8F3] border border-[#010b62] dark:border-[#01BAEF] rounded-md flex items-center justify-center overflow-hidden relative">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Foto de perfil"
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />
              ) : (
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="40" cy="30" r="20" fill="#3B4DA1" />
                  <rect
                    x="16"
                    y="50"
                    width="48"
                    height="20"
                    rx="10"
                    fill="#3B4DA1"
                  />
                </svg>
              )}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-[#010b62] dark:text-white">
                {username}
              </h2>
              <p className="text-gray-500 text-sm mb-3 dark:text-white/80">
                {email || "Nada informado."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                <div className="border border-[#010b62] rounded-sm px-3 py-2 min-w-[120px] text-left dark:border-white/90">
                  <p className="text-sm font-medium text-[#010b62] dark:text-white">
                    Upvotes
                  </p>
                  <div className="flex items-center gap-1.5 text-2xl font-semibold text-[#010b62] dark:text-white">
                    {upvotes}
                    <FaThumbsUp className="text-[#010b62] w-4 h-4 dark:text-white" />
                  </div>
                </div>

                <div className="border border-[#010b62] rounded-sm px-3 py-2 min-w-[120px] text-left dark:border-white">
                  <p className="text-sm font-medium text-[#010b62] dark:text-white">
                    Avaliações
                  </p>
                  <div className="flex items-center gap-1.5 text-2xl font-semibold text-[#010b62] dark:text-white">
                    {reviewCount}
                    <FaStar className="text-[#FFB24B] w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
            <div className="text-[#1C2A76] text-md font-medium dark:text-white/90">
              Insígnias
            </div>

            <div className="flex justify-center lg:justify-start mb-2">
              {userId && <AchievementBadges userId={userId} />}
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-2 w-full sm:w-auto">
              <a
                href="/achievements"
                className="w-full sm:w-36 text-center bg-[#FFB24B] text-white rounded-md px-6 py-2 font-semibold hover:bg-[#e6a33c] transition"
              >
                Coleção
              </a>

              <a
                href="/profile-edit"
                className="w-full sm:w-36 text-center bg-[#010b62] text-white rounded-md px-6 py-2 font-semibold hover:bg-[#1C2CA3] transition dark:bg-[#01BAEF] dark:hover:bg-[#019ED9]"
              >
                Editar Perfil
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex border-b-2 border-[#bfc8e6] dark:text-white">
          {[
            "Minhas avaliações",
            "Interações",
            "Favoritos",
            "Configurações",
          ].map((label, idx) => (
            <button
              key={label}
              onClick={() => setTab(idx)}
              className={`flex-1 sm:flex-[1_1_0%] text-center py-3 text-sm sm:text-base font-medium transition cursor-pointer ${
                tab === idx
                  ? "border-b-4 border-[#010B62] dark:border-[#01BAEF] text-[#010B62] dark:text-white font-bold"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-2 bg-white dark:bg-[#030712] rounded-xl shadow-md px-4 sm:px-8 py-6 sm:py-8">
          {tab === 0 && <ProfileReview userId={user?.id} />}
          {tab === 1 && <ProfileUserActivity />}
          {tab === 2 && <FavoritesTab />}
          {tab === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-[#010B62] mb-6 dark:text-white">
                Configurações Gerais
              </h2>

              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                  <label className="sm:w-40 text-base text-[#010B62] dark:text-white mb-2 sm:mb-0">
                    Idioma
                  </label>
                  <select className="cursor-pointer border border-gray-300 rounded-md px-3 py-1 text-[#010B62] bg-white dark:bg-[#030712] dark:text-white">
                    <option>Português</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                  <div className="flex items-center"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
