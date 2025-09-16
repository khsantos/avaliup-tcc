"use client";

import { supabase } from "@/src/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import Logo from "@/src/components/Logo";
import ThemeSwitch from "@/src/components/ThemeSwitch";
import { toast } from "sonner";
import Image from "next/image";
import TwoFactorAuthDialog from "@/src/components/TwoFactorAuthDialog";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  const [show2FA, setShow2FA] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    accessToken?: string;
  } | null>(null);
  const [step2FA, setStep2FA] = useState<"choose" | "verify">("choose");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("confirmed") === "true") {
      setEmailConfirmed(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: signInData, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("not confirmed")) {
          toast.error("Confirme seu e-mail antes de fazer login.");
          setError("Confirme seu e-mail antes de fazer login.");
          return;
        }
        if (msg.includes("invalid login credentials")) {
          toast.error("E-mail ou senha incorretos.");
          setError("E-mail ou senha incorretos.");
          return;
        }
        toast.error(error.message);
        setError(error.message);
        return;
      }

      if (!signInData.user?.email) {
        setError("Usuário não possui e-mail cadastrado.");
        return;
      }

      setCurrentUser({
        id: signInData.user.id,
        email: signInData.user.email,
        accessToken: signInData.session?.access_token,
      });

      const { data: userData } = await supabase
        .from("users")
        .select("two_factor_enabled")
        .eq("id", signInData.user.id)
        .single();

      if (userData?.two_factor_enabled) {
        setStep2FA("verify");
      } else {
        setStep2FA("choose");
      }

      setShow2FA(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    }
  };

  const completeLogin = async () => {
    if (!currentUser?.accessToken) return;
    await supabase.auth.setSession({
      access_token: currentUser.accessToken,
      refresh_token: "",
    });
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712] relative">
      <div className="w-[345px] space-y-6">
        <div className="">
          <Link
            href="/"
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
        <h2 className="text-2xl font-bold text-[#010B62] text-center dark:text-white">
          Faça Login no Avali.up
        </h2>

        {emailConfirmed && (
          <p className="text-sm text-[#010b62] dark:text-[#01BAEF] text-center font-bold">
            E-mail confirmado com sucesso! Faça login abaixo.
          </p>
        )}

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
                href="/forgot-password"
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
            disabled={loading}
            className={`w-[345px] h-[45px] px-4 py-2 text-white rounded-md cursor-pointer
              bg-[#010B62] dark:bg-[#01BAEF] hover:bg-[#202766] dark:hover:bg-[#0D91AC] 
              ${loading ? "opacity-70 cursor-not-allowed" : ""}
            `}
            onClick={handleLogin}
          >
            {loading ? "Entrando..." : "Entrar"}
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
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-[#010B62] border rounded-md border-[#010B62] hover:bg-gray-300 cursor-pointer dark:text-white dark:hover:bg-[#202766] dark:border-white"
        >
          <Image
            src="/google-icon.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
            width={20}
            height={20}
          />
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
      {currentUser && (
        <TwoFactorAuthDialog
          userId={currentUser.id}
          email={currentUser.email}
          accessToken={currentUser.accessToken}
          open={show2FA}
          initialStep={step2FA}
          onClose={completeLogin}
          onVerified={completeLogin}
        />
      )}
    </div>
  );
}
