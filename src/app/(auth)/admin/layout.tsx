"use client";

import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { MdHome, MdInventory, MdDarkMode, MdLightMode } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    console.log("Theme:", theme);
    console.log("Mounted:", mounted);
  }, [theme, mounted]);

  const redirectToProductTab = () => router.push("/admin/manage-products");
  const redirectToIndex = () => router.push("/admin");

  return (
    <div className="flex h-screen bg-white text-black dark:bg-zinc-900 dark:text-white">
      <aside className="w-64 bg-blue-900 dark:bg-blue-600 text-white flex flex-col justify-between">
        <div>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={80}
            height={80}
            className="mx-auto pt-5"
          />
          <div className="p-2 text-center font-bold text-lg">Avali.up</div>
          <nav className="mt-10">
            <ul>
              <li
                className="px-6 py-3 hover:bg-blue-800 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
                onClick={redirectToIndex}
              >
                <MdHome />
                Início
              </li>
              <li
                className="px-6 py-3 hover:bg-blue-800 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
                onClick={redirectToProductTab}
              >
                <MdInventory />
                Gerenciar Produtos
              </li>
            </ul>
          </nav>
        </div>

        <div className="px-6 py-4 border-t border-blue-700 dark:border-zinc-700 bg-blue-900 dark:bg-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 dark:bg-zinc-600 rounded-full" />
            <span className="text-sm">Administrator</span>
          </div>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white hover:opacity-75 transition"
              title={
                theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
              }
            >
              {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
