// src/components/layout/Header/DesktopNav.tsx
"use client";
import { NAV } from "./nav/nav.config";
import { NavSection } from "./nav-section";

export function DesktopNav() {
  return (
    <nav className="hidden lg:flex gap-2 xl:gap-4 text-base xl:text-lg text-[#010b62] dark:text-white ml-2 xl:ml-[36px]">
      {NAV.map((group) => (
        <NavSection key={group.key} group={group} />
      ))}
    </nav>
  );
}
