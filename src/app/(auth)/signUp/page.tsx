"use client";

import Logo from "@/src/components/Logo";
import ThemeSwitch from "@/src/components/ThemeSwitch";
import { supabase } from "@/src/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner"; // <-- import do sonner

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    if (username.trim().length < 3) {
      toast.error("O nome de usuário deve ter pelo menos 3 caracteres.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Email inválido. Verifique e tente novamente.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      let message = signUpError.message;
      if (message.includes("already registered")) {
        message = "Este email já está cadastrado.";
      }
      toast.error(message);
      return;
    }

    if (!data?.user) {
      toast.error("Não foi possível criar o usuário.");
      return;
    }

    const userId = data.user.id;

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("name", username.trim())
      .single();

    if (existingUser) {
      toast.error("Nome de usuário já está em uso. Escolha outro.");
      return;
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        name: username.trim(),
        email,
        profile_img: "",
        badges: [],
      },
    ]);

    if (insertError) {
      toast.error(
        "Conta criada, mas houve um problema ao salvar os dados do perfil."
      );
      return;
    }

    toast.success("Conta criada com sucesso! Você será redirecionado.");

    setTimeout(() => {
      router.push("/signIn?success=1");
    }, 1500);
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
            className="w-full px-4 py-2 text-white bg-[#010B62] cursor-pointer rounded-md hover:bg-[#202766] dark:bg-[#01BAEF] dark:hover:bg-[#0D91AC]"
          >
            Cadastrar
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
        {/* restante do seu código */}
      </div>
    </div>
  );
}
