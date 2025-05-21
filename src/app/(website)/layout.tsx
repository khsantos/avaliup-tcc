"use client";

import Link from "next/link";
import { Search, User } from "lucide-react";
import ThemeSwitch from "@/src/components/ThemeSwitch";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import Image from "next/image";
import LogoTeclado from "@/public/logo-teclado.svg";
import LogoTecladoDark from "@/public/logo-teclado-dark.svg";
import { useTheme } from "next-themes";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const logo = currentTheme === "dark" ? LogoTecladoDark : LogoTeclado;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <header className="bg-white dark:bg-[#030712] shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1 font-bold text-blue-900">
            <span className="text-2xl">
              {}
              <Link href={"/"}>
                <Image src={logo} alt="logo" width={50} height={50} />
              </Link>
            </span>
            <Link href="/" className="text-xl font-semibold dark:text-white">
              Avali.up
            </Link>
          </div>

          <nav className="flex gap-4 text-sm text-blue-900">
            <button className="hover:underline cursor-pointer dark:text-white">
              Periféricos ▾
            </button>
            <button className="hover:underline dark:text-white">
              Hardware ▾
            </button>
            <button className="hover:underline dark:text-white">
              Subcategorias ▾
            </button>
            <button className="hover:underline dark:text-white">
              Ranking ▾
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar produtos"
              className="border border-[#010B62] rounded-sm p-2 text-sm pl-8 focus:outline-none focus:ring-2 focus:ring-[#0969DA] dark:border-white"
            />
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-[#010b62] dark:text-white" />
          </div>
          <ThemeSwitch />

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 border border-blue-900 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 dark:border-white transition"
                  aria-label="Abrir menu do usuário"
                >
                  <User className="w-5 h-5 text-blue-900 dark:text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {session.user.user_metadata?.name ?? "Usuário"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session.user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Meu perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await supabase.auth.signOut();
                    location.reload();
                  }}
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/signIn">
              <button className="bg-white border border-[#010b62] text-[#010b62] p-2 rounded text-sm hover:bg-blue-800">
                Entrar
              </button>
            </Link>
          )}
        </div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
