// src/components/layout/Header/Header.tsx
"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeSwitch from "@/src/components/ThemeSwitch";
import { SearchBar } from "./search-bar";
import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { UserMenu } from "./user-menu";
import { MobileDrawer } from "./mobile-drawer";
import { useSupabase } from "@/src/contexts/supabase-provider";

interface UserProfile { name?: string; }

export default function Header() {
    const { session, supabase } = useSupabase();
    const [mounted, setMounted] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<false | string>(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        let alive = true;
        (async () => {
            if (!session?.user?.id) { setProfile(null); return; }
            const { data, error } = await supabase.from("users").select("name").eq("id", session.user.id).single();
            if (!alive) return;
            error ? console.error("Erro ao carregar perfil:", error) : setProfile(data);
        })();
        return () => { alive = false; };
    }, [session?.user?.id, supabase]);

    if (!mounted) return null;

    return (
        <header className="bg-white dark:bg-[#030712] h-20 flex items-center justify-between px-4 sm:px-6 md:px-8 relative">
            <div className="flex items-center">
                <div className="relative w-[60px] h-[38px] sm:w-[78px] sm:h-[49px] shrink-0">
                    <Logo />
                </div>
                <DesktopNav />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <SearchBar />
                <ThemeSwitch />
                <div className="hidden sm:block">
                    <UserMenu session={session} profileName={profile?.name ?? null} supabase={supabase} />
                </div>
                <button
                    className="lg:hidden cursor-pointer flex items-center justify-center h-10 w-10 p-2 border text-[#010b62] dark:text-white border-[#010b62] rounded-md hover:bg-[#0969da]/15 dark:hover:bg-[#00afd3]/30 dark:border-white transition"
                    onClick={() => setMobileOpen(v => !v)}
                    aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                    type="button"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* linha decorativa */}
            <div
                className="absolute inset-x-0 bottom-0 h-[4px] pointer-events-none
          dark:bg-[radial-gradient(ellipse_at_center,_#01baef_0%,_#01baef_40%,_#030712_72%,_#030712_100%)]
          bg-[radial-gradient(ellipse_at_center,_#010b62_0%,_#010b62_40%,_#ffffff_72%,_#ffffff_100%)]"
            />

            <MobileDrawer
                open={mobileOpen}
                setOpen={setMobileOpen}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                session={session}
                supabase={supabase}
                profileName={profile?.name ?? null}
            />
        </header>
    );
}
