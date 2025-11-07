"use client";

import Logo from "@/src/components/Logo";
import ThemeSwitch from "@/src/components/ThemeSwitch";
import { supabase } from "@/src/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { FiInfo } from "react-icons/fi";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password: string) => {
    if (password.length < 8) return false;

    const sequences = [
      "1234",
      "2345",
      "3456",
      "4567",
      "5678",
      "6789",
      "abcd",
      "bcde",
      "cdef",
      "qwerty",
      "senha",
    ];
    const hasSequence = sequences.some((seq) =>
      password.toLowerCase().includes(seq)
    );

    return !hasSequence;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!username.trim() || !email.trim() || !password || !confirmPassword) {
        toast.error("Preencha todos os campos.");
        return;
      }
      if (username.trim().length < 3) {
        toast.error("Nome de usuário precisa ter pelo menos 3 caracteres.");
        return;
      }
      if (!isValidEmail(email)) {
        toast.error("Email inválido.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Senhas não coincidem.");
        return;
      }
      if (!isValidPassword(password)) {
        toast.error("Senha muito fraca ou contém sequências comuns.");
        return;
      }

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("name", username.trim())
        .maybeSingle();

      if (existingUser) {
        toast.error("Nome de usuário já está em uso.");
        return;
      }

      const { data: existingEmail } = await supabase
        .from("users")
        .select("id")
        .eq("email", email.trim())
        .maybeSingle();

      if (existingEmail) {
        toast.error("E-mail já está em uso.");
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/signIn?confirmed=true`,
        },
      });

      if (signUpError) {
        toast.error(
          signUpError.message + "Aqui está o erro do supabase. signUpError"
        );
        return;
      }
      if (!data?.user) {
        toast.error("Não foi possível criar o usuário.");
        return;
      }

      const res = await fetch(
        "https://qjpnvzrmiibksdvxmzop.supabase.co/functions/v1/insert_user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            user_id: data.user.id,
            username: username.trim(),
            email,
          }),
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao criar usuário");

      toast.success(
        "Conta criada com sucesso! Verifique seu e-mail para ativar a conta."
      );

      router.push("/confirmation");
    } catch (err: unknown) {
      console.error("Erro ao criar usuário:", err);
      toast.error(
        "Ocorreu um erro. Conta criada parcialmente ou não foi possível criar."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712]">
      <div className="w-[345px] space-y-6">
        <div className="">
          <Link
            href="/signIn"
            className="flex items-center text-[#010B62] dark:text-white hover:underline"
          >
            <FiArrowLeft className="mr-2" size={20} />
            Voltar
          </Link>
        </div>
        <div className="mt-8">
          <Logo />
        </div>
        <div className="fixed bottom-2 left-4">
          <ThemeSwitch />
        </div>

        <h2 className="text-2xl font-bold text-center text-[#010B62] dark:text-white">
          Cadastre-se no Avali.up
        </h2>

        <form className="space-y-4" onSubmit={handleSignUp} noValidate>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1 text-[#010B62] dark:text-white"
            >
              Nome de usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Insira seu nome de usuário"
              className="w-full px-3 py-2 mt-1 border rounded-md border-[#010B62] dark:border-white focus:outline-none focus:ring-2 focus:ring-[#202766] dark:placeholder-gray-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              required
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-[#010B62] dark:text-white"
              >
                E-mail
              </label>
              <div className="relative group">
                <FiInfo className="dark:text-[#33C9F2] text-[#010b62] cursor-pointer" />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 w-max px-2 py-1 text-xs text-white bg-black dark:bg-[#030712] rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Use um e-mail válido — será necessário para verificação
                </span>
              </div>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Insira seu e-mail"
              className="w-full px-3 py-2 mt-1 border rounded-md border-[#010B62] dark:border-white focus:outline-none focus:ring-2 focus:ring-[#202766] dark:placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#010B62] dark:text-white"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Insira sua senha"
                className="w-full px-3 py-2 mt-1 border rounded-md border-[#010B62] focus:outline-none focus:ring-2 focus:ring-[#202766] dark:placeholder-gray-500 dark:border-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 mt-0.5 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-[#010B62] dark:text-white"
            >
              Confirmar senha
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                className="w-full px-3 py-2 mt-1 border rounded-md border-[#010B62] dark:border-white focus:outline-none focus:ring-2 focus:ring-[#202766] dark:placeholder-gray-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 mt-0.5 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading} // desabilita enquanto estiver carregando
            className={`w-full px-4 py-2 text-white bg-[#010B62] cursor-pointer rounded-md hover:bg-[#202766] dark:bg-[#01BAEF] dark:hover:bg-[#0D91AC] ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Cadastrando...
              </span>
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-[#010B62] dark:text-white">
            Já possui conta?{" "}
            <Link
              href="/signIn"
              className="text-[#0969da] dark:text-[#01BAEF] hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
