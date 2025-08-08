"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import ThemeSwitch from "@/src/components/ThemeSwitch";
import { useEffect, useState } from "react";

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
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { useSupabase } from "@/src/contexts/supabase-provider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, supabase } = useSupabase();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  interface UserProfile {
    name?: string;
  }

  useEffect(() => {
    if (!session?.user?.id) {
      setProfile(null);
      return;
    }

    async function loadProfile() {
      const { data, error } = await supabase
        .from("users")
        .select("name")
        .eq("id", session?.user.id)
        .single();

      if (error) {
        console.error("Erro ao carregar perfil:", error);
      } else {
        setProfile(data);
      }
    }

    loadProfile();
  }, [session?.user?.id, supabase]);

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const logo = currentTheme === "dark" ? LogoTecladoDark : LogoTeclado;

  if (!mounted) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

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

          <nav className="flex gap-4 text-sm text-blue-900 dark:text-white">
            {/* Periféricos */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:underline cursor-pointer">
                Periféricos ▾
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/categoria/mouses" className="hover:bg-gray-600">
                    Mouses
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categoria/teclados">Teclados</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categoria/headsets">Headsets</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categoria/mousepads">Mousepads</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categoria/monitores">Monitores</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categoria/microfones">Microfones</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hardware */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:underline cursor-pointer">
                Hardware ▾
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/categoria/processadores">Processadores</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categoria/placas-de-video">Placas de Vídeo</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categoria/ssds">SSDs</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Subcategorias */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:underline cursor-pointer">
                Subcategorias ▾
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/subcategoria/low-end">Low-end</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subcategoria/mid-end">Mid-end</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subcategoria/high-end">High-end</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Ranking */}
            <Link href="/ranking" className="hover:underline">
              Ranking
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar produtos"
                value={searchTerm || ""}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-[#010B62] rounded-sm p-2 text-sm pl-8 focus:outline-none focus:ring-2 focus:ring-[#0969DA] dark:border-white"
              />
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-[#010b62] dark:text-white" />
            </div>
          </form>
          <ThemeSwitch />

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="border border-blue-900  bg-white dark:bg-[#030712] dark:border-white">
                  <AvatarFallback className="text-blue-900 dark:text-white font-bold">
                    {session.user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {profile?.name ?? "Usuário"}
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
              <button className="cursor-pointer bg-white border border-[#010b62] text-[#010b62] dark:text-white dark:border-white dark:bg-[#030712] p-2 rounded text-sm hover:bg-gray-300">
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
