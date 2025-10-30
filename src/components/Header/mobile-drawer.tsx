// src/components/layout/Header/MobileDrawer.tsx
"use client";
import { useRef } from "react";
import { NAV } from "./nav/nav.config";
import { NavSection } from "./nav-section";
import { UserMenu } from "./user-menu";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import Logo from "../Logo";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  dropdownOpen: false | string;
  setDropdownOpen: (k: false | string) => void;
  session: Session | null; // agora aceita null
  profileName?: string | null;
  supabase: SupabaseClient;
  logoSize?: { w: number; h: number };
  setFavoritesOpen?: (v: boolean) => void;
};

export function MobileDrawer({
  open,
  setOpen,
  dropdownOpen,
  setDropdownOpen,
  session,
  profileName,
  supabase,
  logoSize = { w: 78, h: 49 },
  setFavoritesOpen = () => { }
}: Props) {
  useLockBodyScroll(open);
  const ref = useRef<HTMLDivElement>(null);

  if (!open) return null;

  return (
    <div ref={ref} className="fixed inset-0 z-40 bg-black/40 flex lg:hidden">
      <div className="bg-white dark:bg-[#030712] w-4/5 max-w-xs h-screen overflow-y-auto p-6 flex flex-col gap-4 shadow-lg">

        <div className="flex justify-center mb-2">
          <div className="relative" style={{ width: logoSize.w, height: logoSize.h }}>
            <Logo />
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-base text-[#010b62] dark:text-white">
          {NAV.map((group) => (
            <NavSection
              key={group.key}
              group={group}
              isMobile
              openKey={dropdownOpen}
              setOpenKey={setDropdownOpen}
              onItemClick={() => setOpen(false)}
            />
          ))}
        </nav>
        {session && (
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setTimeout(() => setFavoritesOpen(true), 100);
            }}
            className="text-[#010b62] border h-10 hover:text-[#010b62] dark:text-white border-[#010b62] rounded-md hover:bg-[#0969da]/15 dark:hover:bg-[#00afd3]/30 dark:border-white dark:bg-[#0000] dark:hover:text-white transition cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            Favoritos
          </Button>
        )}

        <UserMenu
          session={session}
          supabase={supabase}
          profileName={profileName ?? undefined}
          variant="mobile"
          onAfterAction={() => setOpen(false)}
        />

      </div>

      {/* overlay: primeiro fecha dropdown, depois fecha drawer */}
      <div
        className="flex-1"
        onClick={() => {
          if (dropdownOpen) setDropdownOpen(false);
          else setOpen(false);
        }}
      />
    </div>
  );
}