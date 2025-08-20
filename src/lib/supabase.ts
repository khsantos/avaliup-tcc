// lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr";
export const runtime = "nodejs";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);