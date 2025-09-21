"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSupabase } from "@/src/contexts/supabase-provider";
import ProfileReview from "@/src/components/ProfileReview";
import ProfileUserActivity from "@/src/components/ProfileUserActivity";
import FavoritesTab from "@/src/components/ProfileFavorites";

export default function Page() {
  const { user, loading } = useSupabase();

  const [notifications, setNotifications] = useState(true);
  const [tab, setTab] = useState(0);
  const [username, setUsername] = useState<string>("Usuário");
  const [email, setEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      setUsername(user.user_metadata?.username || "Usuário");
      setEmail(user.email || "");
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
  }, [loading, user]);

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
    <div className="min-h-screen pt-8 pb-6 flex justify-center">
      <div className="w-[80%]">
        <div className="bg-white dark:bg-[#030712] rounded-xl shadow-lg px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-24 h-24 bg-[#e3eafc] rounded-xl flex items-center justify-center mr-6 border-2 border-[#bfc8e6] overflow-hidden">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Foto de perfil"
                  fill
                  className="object-cover"
                />
              ) : (
                <svg width="64" height="64" viewBox="0 0 80 80">
                  <circle cx="40" cy="32" r="24" fill="#bfc8e6" />
                  <rect
                    x="16"
                    y="56"
                    width="48"
                    height="18"
                    rx="9"
                    fill="#bfc8e6"
                  />
                </svg>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-[#010B62] dark:text-white">
                {username}
              </div>
              <div className="text-base text-gray-600 mb-3">
                {email || "Nada informado."}
              </div>
              <div className="flex gap-4">
                <div className="bg-white dark:bg-[#030712] border-2 border-[#e3eafc] rounded-lg px-4 py-2 text-center min-w-[90px]">
                  <div className="text-xl font-bold text-[#010B62] dark:text-white">
                    352{" "}
                    <span role="img" aria-label="Upvotes">
                      👍
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-white">
                    Upvotes
                  </div>
                </div>
                <div className="bg-white dark:bg-[#030712] border-2 border-[#e3eafc] rounded-lg px-4 py-2 text-center min-w-[90px]">
                  <div className="text-xl font-bold text-[#010B62] dark:text-white">
                    27 <span className="text-[#f7b500]">★</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-white">
                    Avaliações
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-600 text-base mb-2 dark:text-white">
              Insígnias
            </div>
            <div className="mb-4 flex justify-end">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="mx-1">
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" fill="#e3eafc" />
                    <path d="M16 8v10" stroke="#bfc8e6" strokeWidth="2" />
                    <circle cx="16" cy="22" r="2" fill="#bfc8e6" />
                  </svg>
                </span>
              ))}
            </div>
            <div className="flex flex-col items-end gap-2">
              <a href="/achievements">
                <button
                  type="button"
                  className="bg-[#FFB24B] cursor-pointer text-white rounded-lg px-6 py-2 font-bold hover:bg-[#e6a800] transition"
                >
                  Coleção
                </button>
              </a>
              <a href="/profile-edit" className="inline-block w-full">
                <button
                  type="button"
                  className="bg-[#010B62] cursor-pointer text-white rounded-lg px-6 py-2 font-bold w-full hover:bg-[#010B62]/90 transition"
                >
                  Editar Perfil
                </button>
              </a>
              <button
                type="button"
                onClick={() => alert("Abrir modal de edição de foto")}
                className="bg-gray-500 cursor-pointer text-white rounded-lg px-6 py-2 font-bold hover:bg-gray-600 transition"
              >
                Editar Foto
              </button>
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
              className={`flex-1 py-3 text-base font-medium transition cursor-pointer ${
                tab === idx
                  ? "border-b-4 border-[#010B62] cursor-pointer text-[#010B62] dark:text-white font-bold"
                  : "text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div className="mt-0.5 bg-white dark:bg-[#030712] rounded-xl shadow-md px-8 py-8">
            <ProfileReview userId={user?.id} />
          </div>
        )}

        {tab === 1 && (
          <div className="mt-0.5 bg-white dark:bg-[#030712] rounded-xl shadow-md px-8 py-8">
            <ProfileUserActivity />
          </div>
        )}

        {tab === 2 && (
          <div className="mt-0.5 bg-white dark:bg-[#030712] rounded-xl shadow-md px-8 py-8">
            <FavoritesTab />
          </div>
        )}

        {tab === 3 && (
          <div className="mt-10 bg-white dark:bg-[#030712] rounded-xl shadow-md px-8 py-8">
            <h2 className="text-2xl font-bold text-[#010B62] mb-6 dark:text-white">
              Configurações Gerais
            </h2>
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#010B62] mb-4 dark:text-white">
                Configurações Gerais
              </h3>
              <div className="flex items-center mb-4">
                <label className="w-40 text-base text-[#010B62] dark:text-white">
                  Idioma
                </label>
                <select className="cursor-pointer border border-gray-300 rounded-md px-3 py-1 text-[#010B62] bg-white dark:bg-[#030712] dark:text-white">
                  <option>Português</option>
                  <option>Inglês</option>
                </select>
              </div>
              <div className="flex items-center mb-4">
                <label className="w-40 text-base text-[#010B62] dark:text-white">
                  Notificações
                </label>
                <button
                  type="button"
                  onClick={() => setNotifications((v) => !v)}
                  className={`relative inline-flex items-center cursor-pointer h-6 rounded-full w-12 focus:outline-none transition ${
                    notifications ? "bg-[#010B62]" : "bg-gray-300"
                  }`}
                >
                  <span className="sr-only">Toggle Notifications</span>
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ${
                      notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  ></span>
                </button>
                <span className="ml-3 text-sm text-gray-600">
                  {notifications ? "Ativadas" : "Desativadas"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
