import type { Metadata } from "next";
import Header from "@/src/components/Header/header";
import "@/src/app/globals.css";
import Footer from "@/src/components/Footer";

export const metadata: Metadata = {
  title: "Avali.UP",
  description: "Avaliações reais para decisões melhores",
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white dark:bg-[#030712]">
      <Header />
      <main className="max-w-[1280px] mx-auto w-full">{children}</main>
      <Footer />
    </div>
  );
}
