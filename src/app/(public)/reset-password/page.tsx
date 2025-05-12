"use client"

import Logo from "@/src/components/Logo";
import ThemeSwitch from "@/src/components/ThemeSwitch";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712]">
            <div className="w-full max-w-md p-8 space-y-6">
                <div className="mt-8"><Logo /></div>
                <div className="fixed bottom-2 left-4"><ThemeSwitch /></div>
                <h2 className="text-2xl font-bold text-center text-[#010b62] dark:text-white">Recuperar senha</h2>
                <p className="text-sm text-center text-gray-500">
                    Informe o seu endereço de e-mail para que possamos enviar o link de recuperação da senha.
                </p>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#010b62] dark:text-white">
                            E-mail
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Insira seu e-mail"
                            className="w-full px-3 py-2 mt-1 border-2 rounded-md border-[#010b62] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-[#010b62] rounded-md hover:bg-[#202766] cursor-pointer dark:bg-[#01baef] dark:hover:bg-[#0D91AC]"
                    >
                        Enviar
                    </button>
                </form>
                <div className="text-center">
                    <Link href="signIn" className="text-sm text-[#0969da] dark:text-[#00AFD3] hover:underline">
                        &larr; Voltar
                    </Link>
                </div>
            </div>
        </div>
    );
}