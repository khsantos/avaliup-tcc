"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors">
      <h1 className="text-3xl font-bold mb-4">Modo de Tema</h1>
      <p className="mb-6">
        Se o fundo for escuro, o dark mode está funcionando.
      </p>

      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-black dark:text-white rounded hover:opacity-80 transition"
        >
          {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
          {theme === "dark" ? "Tema Claro" : "Tema Escuro"}
        </button>
      )}
    </div>
  );
}
