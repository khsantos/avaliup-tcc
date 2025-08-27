"use client";

import React from "react";
import { useSupabase } from "../../../contexts/supabase-provider";

export default function ProfileEditPage() {
  const { user, loading } = useSupabase();

  if (loading) {
    return <div className="text-white">Carregando...</div>;
  }

  const userName = user?.user_metadata?.name || "Usuário";
  const userEmail = user?.email || "Seu e-mail";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navbar Tabs */}
      <div className="bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <a
                href="#"
                className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-blue-400 border-blue-400"
                aria-current="page"
              >
                Geral
              </a>
              <a
                href="/profile-general"
                className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-400 hover:text-gray-200 hover:border-gray-500"
              >
                Editar
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto p-8 bg-gray-800 shadow-md rounded-md mt-6">
        <h2 className="text-2xl font-bold text-blue-300 mb-6">Perfil</h2>
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            {/* Placeholder para imagem do perfil */}
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold">
              Bem vindo(a), {userName}!
            </p>
            <p className="text-sm text-gray-400">{userEmail}</p>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Informe seu Nome completo"
              defaultValue={userName}
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Informe seu e-mail"
              defaultValue={userEmail}
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-300"
            >
              CPF
            </label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              placeholder="Informe seu CPF"
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-300"
            >
              Gênero
            </label>
            <select
              id="gender"
              name="gender"
              defaultValue="Feminino"
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Informe a nova senha"
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-300"
            >
              Confirmar senha
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="Confirme a nova senha"
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 text-blue-400 bg-gray-900 border border-blue-400 rounded-md hover:bg-gray-700"
            >
              Salvar alterações
            </button>
            <button
              type="button"
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Excluir conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
