"use client";

import { supabase } from "@/src/lib/supabase";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "@/src/components/Logo";
import ThemeSwitch from "@/src/components/ThemeSwitch";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const hasShownToast = useRef(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!hasShownToast.current && searchParams.get("success") === "1") {
      toast.success("Conta criada com sucesso! Faça login para continuar.", {
        description: "Seja bem-vindo(a) ao Avali.up!",
        duration: 4000,
      });
      hasShownToast.current = true;
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      setError(error.message);
      return;
    }

    toast.success("Login realizado com sucesso!");
    setRedirecting(true);

    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712]">
      <div className="w-[345px] space-y-6">
        <div className="mt-8">
          <Logo />
        </div>
        <div className="fixed bottom-2 left-4">
          <ThemeSwitch />
        </div>
        <h2 className="text-2xl font-bold text-[#010B62] text-center dark:text-white">
          Faça Login no Avali.up
        </h2>

        {error && <p className="text-sm text-red-500">{error}</p>}
        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-[#010B62] dark:text-white"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Insira seu e-mail"
              className="w-[345px] h-[45px] px-3 py-2 mt-1 border rounded-md border-[#010B62] dark:border-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:placeholder-gray-500 dark:bg-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#010b62] dark:text-white"
              >
                Senha
              </label>
              <Link
                href="/reset-password"
                className="text-sm text-[#0969da] dark:text-[#00AFD3] hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Insira sua senha"
                className="w-[345px] h-[45px] px-3 py-2 mt-1 border rounded-md border-[#010B62] dark:border-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:placeholder-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <button
            type="submit"
            disabled={loading || redirecting}
            className={`w-[345px] h-[45px] px-4 py-2 text-white rounded-md cursor-pointer
    bg-[#010B62] dark:bg-[#01BAEF] hover:bg-[#202766] dark:hover:bg-[#0D91AC] 
    ${loading || redirecting ? "opacity-70 cursor-not-allowed" : ""}
  `}
            onClick={handleLogin}
          >
            {loading
              ? "Entrando..."
              : redirecting
              ? "Redirecionando..."
              : "Entrar"}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-[#010B62] dark:text-white">
            É novo no Avali.up?{" "}
            <Link
              href="/signUp"
              className="text-[#0969da] dark:text-[#00AFD3] hover:underline"
            >
              Crie sua conta
            </Link>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <hr className="w-full border-[#010B62] dark:border-white" />
          <span className="px-2 text-sm text-[#010B62] dark:text-white ">
            OU
          </span>
          <hr className="w-full border-[#010B62] dark:border-white" />
        </div>
        <button
          type="button"
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-[#010B62] border rounded-md border-[#010B62] hover:bg-gray-300 cursor-pointer dark:text-white dark-border-white dark:hover:bg-[#202766] dark:border-white"
        >
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
          Google
        </button>
        <div className="text-center justify-center text-sm text-gray-500">
          <Link
            href="/terms"
            className="hover:underline text-[#0969da] dark:text-[#00AFD3]"
          >
            Termos de uso
          </Link>{" "}
          |{" "}
          <Link
            href="/privacy"
            className="hover:underline text-[#0969da] dark:text-[#00AFD3]"
          >
            Política de Privacidade
          </Link>
        </div>
      </div>
    </div>
  );
}
