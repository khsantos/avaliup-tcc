"use client";

import Image from "next/image";
import { MdHome, MdInventory } from "react-icons/md";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import ThemeSwitch from "@/src/components/ThemeSwitch";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const redirectToProductTab = () => router.push("/admin/manage-products");
  const redirectToIndex = () => router.push("/admin");

  return (
    <div className="flex h-screen bg-white text-black dark:bg-[#030712] dark:text-white">
      <aside className="w-64 bg-[#010B62] dark:bg-[#01BAEF] text-white flex flex-col justify-between rounded-md">
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
                className="px-6 py-3 hover:bg-blue-800 dark:hover:bg-cyan-600 cursor-pointer flex items-center gap-2"
                onClick={redirectToIndex}
              >
                <MdHome />
                Início
              </li>
              <li
                className="px-6 py-3 hover:bg-blue-800 dark:hover:bg-cyan-600 cursor-pointer flex items-center gap-2"
                onClick={redirectToProductTab}
              >
                <MdInventory />
                Gerenciar Produtos
              </li>
            </ul>
          </nav>
        </div>

        <div className="px-6 py-4 border-t border-blue-700 dark:border-blue-400 bg-blue-900 dark:bg-cyan-600 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 dark:bg-cyan-500 rounded-full" />
            <span className="text-sm">Administrator</span>
          </div>

          <ThemeSwitch />
        </div>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
