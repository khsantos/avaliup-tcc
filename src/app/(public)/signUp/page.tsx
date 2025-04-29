"use client"

import ThemeSwitch from "@/src/components/ThemeSwitch";
import { supabase } from "@/src/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        const { error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
        } else {
            setSuccess("Conta criada com sucesso...")
            router.push("/signIn");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-[345px] space-y-6">
                <div className="flex items-center justify-center">
                    <ThemeSwitch />
                </div>
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={120}
                    height={69}
                    className="mx-auto pt-5 mb-15 dark:bg-white"
                />
                <h2 className="text-2xl font-bold text-left text-[#010B62]">Cadastro</h2>
                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-md text-green-500">{success}</p>}
                <form className="space-y-4" onSubmit={handleSignUp}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1 text-[#010B62] dark:text-white">
                            E-mail
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Insira seu e-mail"
                            className="w-full px-3 py-2 mt-1 border rounded-md border-[#010B62] dark:border-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:placeholder-gray-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#010B62] ">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Insira sua senha"
                                className="w-full px-3 py-2 mt-1 border rounded-md border-[#010B62] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:placeholder-gray-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 mt-0.5 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-[#010B62] ">
                            Confirmar senha
                        </label>
                        <div className="relative">
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Confirme sua senha"
                                className="w-full px-3 py-2 mt-1 border rounded-md border-[#010B62] dark:border-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:placeholder-gray-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 mt-0.5 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-[#010B62] rounded-md hover:bg-[#202766]"
                    >
                        Cadastrar
                    </button>
                </form>
                <div className="text-center">
                    <p className="text-sm text-black">
                        Já possui conta?{" "}
                        <Link href="/signIn" className="text-blue-600 hover:underline">
                            Entrar
                        </Link>
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <hr className="w-full border-gray-300" />
                    <span className="px-2 text-sm text-gray-500">OU</span>
                    <hr className="w-full border-gray-300" />
                </div>
                <button
                    type="button"
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-100"
                >
                    <img
                        src="google-icon.svg"
                        alt="Google"
                        className="w-5 h-5 mr-2"
                    />
                    Google
                </button>
                <div className="text-center text-sm text-white">
                    <Link href="/terms" className="hover:underline">
                        Termos de uso
                    </Link>{" "}
                    |{" "}
                    <Link href="/privacy" className="hover:underline">
                        Política de Privacidade
                    </Link>
                </div>
            </div>
        </div>
    );
}