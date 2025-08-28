"use client";
import React, { useState } from "react";

export default function Page() {
  const [notifications, setNotifications] = useState(true);
  const [tab, setTab] = useState(3);

  return (
    <div className="min-h-screen pt-8 pb-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#030712] rounded-xl shadow-lg px-8 py-6 flex items-center justify-between">
        {/* Avatar e dados */}
        <div className="flex items-center">
          <div className="w-24 h-24 bg-[#e3eafc] rounded-xl flex items-center justify-center mr-6 border-2 border-[#bfc8e6]">
            {/* Avatar SVG */}
            <svg width="64" height="64" viewBox="0 0 80 80">
              <circle cx="40" cy="32" r="24" fill="#bfc8e6" />
              <rect x="16" y="56" width="48" height="18" rx="9" fill="#bfc8e6" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#010B62] dark:text-white">Usuário 1</div>
            <div className="text-base text-gray-600 mb-3">Nada informado.</div>
            <div className="flex gap-4">
              <div className="bg-white dark:bg-[#030712] border-2 border-[#e3eafc] rounded-lg px-4 py-2 text-center min-w-[90px]">
                <div className="text-xl font-bold text-[#010B62] dark:text-white">
                  352 <span role="img" aria-label="Upvotes">👍</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-white">Upvotes</div>
              </div>
              <div className="bg-white dark:bg-[#030712] border-2 border-[#e3eafc] rounded-lg px-4 py-2 text-center min-w-[90px]">
                <div className="text-xl font-bold text-[#010B62] dark:text-white">
                  27 <span className="text-[#f7b500]">★</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-white">Avaliações</div>
              </div>
            </div>
          </div>
        </div>
        {/* Insígnias e botões */}
        <div className="text-right">
          <div className="text-gray-600 text-base mb-2 dark:text-white">Insígnias</div>
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
          <div>
            <button
              type="button"
              className="bg-[#FFB24B] cursor-pointer text-white rounded-lg px-6 py-2 font-bold mr-2 hover:bg-[#e6a800] transition"
            >
              Coleção
            </button>
            <a href="/profile-edit" className="inline-block">
              <button
                type="button"
                className="bg-[#010B62] cursor-pointer text-white rounded-lg px-6 py-2 font-bold hover:bg-[#010B62]/90 transition"
              >
                Editar Perfil
              </button>
            </a>
          </div>
        </div>
      </div>
      {/* Abas de navegação */}
      <div className="max-w-4xl mx-auto mt-6 flex border-b-2 border-[#bfc8e6] dark:text-white">
        {["Minhas avaliações", "Interações", "Favoritos", "Configurações"].map((label, idx) => (
          <button
            key={label}
            onClick={() => setTab(idx)}
            className={`flex-1 py-3 text-base font-medium transition cursor-pointer ${tab === idx
              ? "border-b-4 border-[#010B62] cursor-pointer text-[#010B62] dark:text-white font-bold"
              : "text-gray-600"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Configurações Gerais */}
      {tab === 3 && (
        <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-[#030712] rounded-xl shadow-md px-8 py-8">
          <h2 className="text-2xl font-bold text-[#010B62] mb-6 dark:text-white">Configurações Gerais</h2>
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#010B62] mb-4 dark:text-white">Configurações Gerais</h3>
            <div className="flex items-center mb-4">
              <label className="w-40 text-base text-[#010B62] dark:text-white">Idioma</label>
              <select className="cursor-pointer border border-gray-300 rounded-md px-3 py-1 text-[#010B62] bg-white dark:bg-[#030712] dark:text-white">
                <option>Português</option>
                <option>Inglês</option>
              </select>
            </div>
            <div className="flex items-center mb-4">
              <label className="w-40 text-base text-[#010B62] dark:text-white">Notificações</label>
              <button
                type="button"
                onClick={() => setNotifications((v) => !v)}
                className={`relative inline-flex items-center cursor-pointer h-6 rounded-full w-12 focus:outline-none transition ${notifications ? "bg-[#010B62]" : "bg-gray-300"
                  }`}
              >
                <span className="sr-only">Toggle Notifications</span>
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ${notifications ? "translate-x-6" : "translate-x-1"
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
  );
}


