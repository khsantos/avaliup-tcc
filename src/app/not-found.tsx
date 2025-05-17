"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/src/app/(public)/(site)/");
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors">
      <h1 className="text-3xl font-bold mb-4">Modo de Tema</h1>
      <p className="mb-6">
        Se o fundo for escuro, o dark mode está funcionando.
      </p>
    </div>
  );
}
