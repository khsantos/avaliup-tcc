import Link from "next/link";
import { Search } from "lucide-react";
import ThemeSwitch from "@/src/components/ThemeSwitch";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="bg-white dark:bg-[#030712] shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <span className="text-2xl">⌨️</span>
            <Link href="/" className="text-xl font-semibold">
              Avali.up
            </Link>
          </div>

          <nav className="flex gap-4 text-sm text-blue-900">
            <div className="relative group">
              <button className="hover:underline">Periféricos ▾</button>
            </div>

            <div className="relative group">
              <button className="hover:underline"> Hardware ▾</button>
            </div>

            <div className="relative group">
              <button className="hover:underline">Subcategorias ▾</button>
            </div>

            <div className="relative group">
              <button className="hover:underline">Ranking ▾</button>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar produtos"
              className="border border-[#010B62] rounded-sm p-2 text-sm pl-8 focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
            />
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-[#010b62]" />
          </div>
          <ThemeSwitch />
          <Link href="signIn">
            <button className="bg-white border border-[#010b62] text-[#010b62] p-2 rounded text-sm hover:bg-blue-800">
              Entrar
            </button>
          </Link>
        </div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
