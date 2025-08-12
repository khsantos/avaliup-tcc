// src/components/layout/Header/MobileDrawer.tsx
"use client";
import { useRef } from "react";
import { NAV } from "./nav/nav.config";
import { NavSection } from "./nav-section";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { SupabaseClient } from "@supabase/supabase-js";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  dropdownOpen: false | string;
  setDropdownOpen: (k: false | string) => void;
  session: SupabaseClient;
  profileName?: string | null;
  supabase: SupabaseClient;
  logoSize?: { w: number; h: number };
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
}: Props) {
  useLockBodyScroll(open);
  const ref = useRef<HTMLDivElement>(null);

  if (!open) return null;

  return (
    <div ref={ref} className="fixed inset-0 z-40 bg-black/40 flex lg:hidden">
      <div className="bg-white dark:bg-[#030712] w-4/5 max-w-xs h-screen overflow-y-auto p-6 flex flex-col gap-4 shadow-lg">
        <div className="flex justify-center mb-2">
          <Logo size={logoSize} />
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

        <div className="mt-4">
          <UserMenu
            session={session}
            supabase={supabase}
            profileName={profileName ?? undefined}
            variant="mobile"
            onAfterAction={() => setOpen(false)}
          />
        </div>
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
