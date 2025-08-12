// src/app/(website)/layout.tsx
import type { Metadata } from "next";
import Header from "@/src/components/Header/header"; // <- novo
import "@/src/app/globals.css";

export const metadata: Metadata = {
  title: "Avali.UP",
  description: "Avaliações reais para decisões melhores",
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white dark:bg-[#030712]">
      <Header />
      <main className="p-2 sm:p-4">{children}</main>
    </div>
  );
}
