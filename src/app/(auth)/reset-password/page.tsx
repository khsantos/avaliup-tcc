"use client";
import Logo from "@/src/components/Logo";
import ThemeSwitch from "@/src/components/ThemeSwitch";
import { supabase } from "@/src/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ data, error }) => {
          if (!error && data.session) {
            setSessionReady(true);
          } else {
            toast.error("Token inválido ou expirado.");
          }
        });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSessionReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (!sessionReady) {
      toast.error("Sessão inválida. Acesse pelo link enviado ao seu e-mail.");
      return;
    }

    if (!isValidPassword(password)) {
      toast.error(
        "A senha deve ter pelo menos 8 caracteres e não conter sequências numéricas comuns."
      );
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error("Erro ao redefinir a senha.");
    } else {
      toast.success("Senha redefinida com sucesso!");
      router.push("/signIn");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712]">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="mt-8">
          <Logo />
        </div>
        <div className="fixed bottom-2 left-4">
          <ThemeSwitch />
        </div>
        <h2 className="text-2xl font-bold text-center text-[#010b62] dark:text-white">
          Alteração de senha
        </h2>
        <p className="text-md text-center text-gray-700">
          Informe sua nova senha para confirmar a alteração.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-md font-medium text-[#010b62] dark:text-white"
            >
              Nova senha
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              placeholder="Insira sua nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border-2 rounded-md border-[#010b62] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white"
            />
          </div>
          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-md font-medium text-[#010b62] dark:text-white"
            >
              Confirmação da nova senha
            </label>
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              required
              placeholder="Insira novamente sua nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border-2 rounded-md border-[#010b62] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-[#010b62] rounded-md hover:bg-[#202766] cursor-pointer dark:bg-[#01baef] dark:hover:bg-[#0D91AC]"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
        <div className="text-center">
          <Link
            href="signIn"
            className="text-md text-[#0969da] dark:text-[#00AFD3] hover:underline"
          >
            &larr; Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}
