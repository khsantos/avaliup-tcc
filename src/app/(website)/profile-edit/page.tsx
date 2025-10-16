"use client";

import React, { useEffect, useState } from "react";
import { useSupabase } from "../../../contexts/supabase-provider";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
import Image from "next/image";
import formatCpf from "@/src/lib/formatCpf";
import { useValidateCPF } from "@/src/hooks/useValidateCpf";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ChangeProfilePhotoDialog } from "@/src/components/ChangeProfileDialog";
import { DeleteAccountDialog } from "@/src/components/DeleteAccountDialog";

export default function ProfileEditPage() {
  const { user, loading } = useSupabase();

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [gender, setGender] = useState("Outro");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const { validateCPF, cpfError } = useValidateCPF();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);

    const numericCpf = formatted.replace(/\D/g, "");

    if (numericCpf.length === 11) {
      validateCPF(formatted);
    }
  };

  const userEmail = user?.email || "Seu e-mail";
  const userId = user?.id;

  useEffect(() => {
    async function fetchUserData() {
      if (!userId) return;

      const { data, error } = await supabase
        .from("users")
        .select("name, cpf, gender, profile_img")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erro ao carregar dados do usuário:", error.message);
        return;
      }

      if (data) {
        setName(data.name || "");
        setCpf(data.cpf ? formatCpf(data.cpf) : "");
        setGender(data.gender || "Outro");
        setProfileImg(data.profile_img || null);
      }
    }

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div className="text-white">Carregando...</div>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }

      if (password && password !== confirmPassword) {
        throw new Error("As senhas não coincidem.");
      }

      const { error } = await supabase
        .from("users")
        .update({
          name,
          cpf,
          gender,
        })
        .eq("id", userId);

      if (error) throw error;

      if (password) {
        const { error: updateError } = await supabase.auth.updateUser({
          password,
        });
        if (updateError) throw updateError;
      }

      setMessage("Perfil atualizado com sucesso!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        let errorMessage = err.message;

        if (errorMessage.includes("New password should be different")) {
          errorMessage = "A nova senha deve ser diferente da atual.";
        } else if (errorMessage.includes("Password should be at least")) {
          errorMessage = "A senha deve ter pelo menos 6 caracteres.";
        } else if (errorMessage.includes("Invalid login credentials")) {
          errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha.";
        } else {
          errorMessage = "Ocorreu um erro ao atualizar o perfil.";
        }

        setMessage(`Erro: ${errorMessage}`);
        toast.error(errorMessage);
      } else {
        const fallback = "Ocorreu um erro inesperado.";
        setMessage(fallback);
        toast.error(fallback);
      }
    }
    if (!validateCPF(cpf)) {
      setMessage("CPF inválido. Corrija antes de salvar.");
      setSaving(false);
      return;
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white shadow-sm dark:bg-[#030712]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <a
                href="/profile-general"
                className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm dark:text-white text-gray-700 hover:text-gray-700"
              >
                Geral
              </a>
              <a
                href="#"
                className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-[#010b62] border-[#010b62] cursor-auto dark:text-[#01BAEF] dark:border-[#01BAEF]"
              >
                Editar
              </a>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-[#010b62] mb-6 dark:text-white">
          Perfil
        </h2>

        <div className="flex items-center mb-6">
          <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200">
            {profileImg ? (
              <Image
                src={profileImg}
                alt="Foto de perfil"
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <span className="text-gray-500 text-sm flex items-center justify-center h-full w-full">
                Sem foto
              </span>
            )}
          </div>

          <div className="ml-4">
            <p className="text-lg font-medium dark:text-white text-[#010b62]">
              Bem-vindo(a){name ? `, ${name}` : ""}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {userEmail}
            </p>
          </div>

          <ChangeProfilePhotoDialog
            currentPhoto={profileImg}
            userId={userId!}
            onPhotoUpdated={(newUrl) => setProfileImg(newUrl)}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Informe seu nome"
              className="w-full px-2 py-2 mt-1 border rounded-md focus:outline-none dark:border-white border-[#010b62] focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              CPF
            </label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              inputMode="numeric"
              value={cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 dark:border-white border-[#010b62] focus:ring-blue-500 placeholder-gray-400"
            />
            {cpfError && (
              <p className="text-sm text-red-500 mt-1">{cpfError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Gênero
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md dark:border-white border-[#010b62] dark:bg-[#030712] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Nova senha
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Informe a nova senha"
              className="w-full px-3 py-2 mt-1 border rounded-md dark:border-white border-[#010b62] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11.5 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <div className="relative">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Confirmar senha
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova senha"
              className="w-full px-3 py-2 mt-1 border rounded-md dark:border-white border-[#010b62] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-11.5 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
            >
              {showConfirmPassword ? (
                <FiEyeOff size={20} />
              ) : (
                <FiEye size={20} />
              )}
            </button>
          </div>

          {message && (
            <p className="text-sm mt-2 text-center text-gray-700 dark:text-gray-300">
              {message}
            </p>
          )}

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-white dark:bg-[#01BAEF] bg-[#010b62] border rounded-md hover:bg-[#1C2CA3] dark:hover:bg-[#33C9F2] disabled:opacity-70 cursor-pointer"
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>

            <DeleteAccountDialog userId={userId!} />
          </div>
        </form>
      </div>
    </div>
  );
}
