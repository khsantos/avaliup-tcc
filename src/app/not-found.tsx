"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white text-center">
      <AlertTriangle className="w-16 h-16 text-[#010b62] mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Página não encontrada
      </h1>
      <p className="text-gray-600 mb-8">
        Parece que essa página não existe ou foi movida. 😕
      </p>
      <Link href="/">
        <button className="bg-[#010b62] hover:bg-blue-800 text-white px-6 py-3 rounded-lg">
          Voltar para o início
        </button>
      </Link>
    </div>
  );
}
