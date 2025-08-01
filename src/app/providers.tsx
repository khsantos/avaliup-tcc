"use client";

import { ThemeProvider } from "next-themes";
import { SupabaseProvider } from "../contexts/supabase-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SupabaseProvider>{children}</SupabaseProvider>
    </ThemeProvider>
  );
}
