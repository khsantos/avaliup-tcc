"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Ativar modo ${isDark ? "claro" : "escuro"}`}
      className="flex items-center justify-center h-10 w-10 p-2 border border-[#010b62] rounded-md bg-[#ffffff] dark:bg-[#030712] hover:bg-[#0969da]/15 dark:hover:bg-[#00afd3]/30 dark:border-white transition cursor-pointer"
    >
      {isDark ? (
        <FiMoon className="w-5 h-5 text-white" />
      ) : (
        <FiSun className="w-5 h-5 text-[#010b62]" />
      )}
    </button>
  );
}
