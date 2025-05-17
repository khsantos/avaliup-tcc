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
      className="p-2 border border-blue-900 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 dark:border-white transition"
    >
      {isDark ? (
        <FiMoon className="w-5 h-5 text-white" />
      ) : (
        <FiSun className="w-5 h-5 text-blue-900" />
      )}
    </button>
  );
}
