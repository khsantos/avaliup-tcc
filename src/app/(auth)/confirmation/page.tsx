"use client";

import Link from "next/link";

export default function Confirmation() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712]">
      <div className="text-center space-y-4 p-6 border rounded-md shadow-md bg-white dark:bg-[#030712]">
        <h1 className="text-2xl font-bold text-[#010B62] dark:text-white">
          Confirme seu e-mail
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Um link de confirmação foi enviado para seu e-mail. Por favor,
          verifique sua caixa de entrada e confirme sua conta antes de fazer
          login.
        </p>
        <Link
          href="/signIn"
          className="inline-block px-4 py-2 mt-2 text-white bg-[#010B62] rounded-md hover:bg-[#202766] dark:bg-[#01BAEF] dark:hover:bg-[#0D91AC]"
        >
          Voltar para Login
        </Link>
      </div>
    </div>
  );
}
