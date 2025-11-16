"use client";

import React, { useEffect, useState } from "react";
import { useSupabase } from "../../../contexts/supabase-provider";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
import Image from "next/image";
import formatCpf from "@/src/lib/formatCpf";
import { useValidateCPF } from "@/src/hooks/useValidateCpf";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { ChangeProfilePhotoDialog } from "@/src/components/ChangeProfileDialog";
import { DeleteAccountDialog } from "@/src/components/DeleteAccountDialog";
import { UserUpdate } from "@/src/types/UserUpdate";
import Link from "next/link";

export default function ProfileEditPage() {
  const { user, loading } = useSupabase();

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [gender, setGender] = useState("Escolher");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const { validateCPF, cpfError } = useValidateCPF();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [originalData, setOriginalData] = useState({
    name: "",
    cpf: "",
    gender: "",
  });

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);
    const numericCpf = formatted.replace(/\D/g, "");
    if (numericCpf.length === 11) validateCPF(formatted);
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
        const formattedCpf = data.cpf ? formatCpf(data.cpf) : "";
        setName(data.name || "");
        setCpf(formattedCpf);
        setGender(data.gender || "Escolher");
        setOriginalData({
          name: data.name || "",
          cpf: formattedCpf,
          gender: data.gender || "Escolher",
        });
        setProfileImg(data.profile_img || null);
      }
    }

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:text-white text-gray-700">
        Carregando...
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (!userId) throw new Error("Usuário não autenticado.");
      if (password && password !== confirmPassword)
        throw new Error("As senhas não coincidem.");
      if (password && password.length <= 6)
        throw new Error("A nova senha deve conter mais de 6 caracteres.");
      if (gender === "Escolher")
        throw new Error("Por favor, selecione um gênero válido.");
      if (cpf !== originalData.cpf && !validateCPF(cpf))
        throw new Error("CPF inválido. Corrija antes de salvar.");

      const updatedFields: UserUpdate = {};
      if (name !== originalData.name) updatedFields.name = name;
      if (cpf !== originalData.cpf) updatedFields.cpf = cpf;
      if (gender !== originalData.gender) updatedFields.gender = gender;

      if (Object.keys(updatedFields).length === 0 && !password) {
        toast.info("Nenhuma alteração detectada.");
        setSaving(false);
        return;
      }

      if (Object.keys(updatedFields).length > 0) {
        const { error } = await supabase
          .from("users")
          .update(updatedFields)
          .eq("id", userId);
        if (error) throw error;
      }

      if (password) {
        const { error: updateError } = await supabase.auth.updateUser({
          password,
        });
        if (updateError) throw updateError;
      }

      toast.success("Perfil atualizado com sucesso!");
      setMessage("Perfil atualizado com sucesso!");

      setOriginalData({ name, cpf, gender });
    } catch (err: unknown) {
      let errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao atualizar o perfil.";

      if (
        errorMessage.includes(
          "New password should be different from the old password"
        )
      ) {
        errorMessage = "A nova senha deve ser diferente da senha atual.";
      }

      setMessage(`Erro: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen   py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/profile-general"
          className="flex items-center text-[#010B62] dark:text-white hover:underline"
        >
          <FiArrowLeft className="mr-2" size={20} />
          Voltar
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-[#030712] p-6 sm:p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-[#010b62] mb-6 dark:text-white text-center sm:text-left">
          Perfil
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <div className="w-24 h-24 relative rounded-full overflow-hidden bg-gray-200">
              {profileImg ? (
                <Image
                  src={profileImg}
                  alt="Foto de perfil"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <span className="text-gray-500 text-sm flex items-center justify-center h-full w-full">
                  Sem foto
                </span>
              )}
            </div>

            <div>
              <p className="text-lg font-medium dark:text-white text-[#010b62]">
                Bem-vindo(a){name ? `, ${name}` : ""}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {userEmail}
              </p>
            </div>
          </div>

          <div className="w-full flex justify-center sm:justify-end sm:w-auto">
            <div className="mx-auto sm:mx-0">
              <ChangeProfilePhotoDialog
                currentPhoto={profileImg}
                userId={userId!}
                onPhotoUpdated={(newUrl) => setProfileImg(newUrl)}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full px-3 py-2 mt-1 border rounded-md dark:border-white border-[#010b62] focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
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
              className="w-full px-3 py-2 mt-1 border rounded-md dark:border-white border-[#010b62] focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
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
              className="w-full px-3 py-2 mt-1 border rounded-md dark:border-white border-[#010b62] dark:bg-[#030712] focus:ring-2 focus:ring-blue-500"
            >
              <option value="Escolher" disabled>
                Escolher
              </option>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Nova senha
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Informe a nova senha"
                className="w-full px-3 py-2 mt-1 border rounded-md dark:border-white border-[#010b62] focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-white"
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
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                className="w-full px-3 py-2 mt-1 border rounded-md dark:border-white border-[#010b62] focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-white"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>

          {message && (
            <p className="text-md mt-2 text-center text-[#010b62] dark:text-[#01BAEF]">{message}</p>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2 text-white bg-[#010b62] dark:bg-[#01BAEF] border rounded-md hover:bg-[#1C2CA3] dark:hover:bg-[#33C9F2] disabled:opacity-70 transition"
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
