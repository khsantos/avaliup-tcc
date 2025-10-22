"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

type SupabaseContextType = {
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const user = session?.user || null;

  return (
    <SupabaseContext.Provider value={{ supabase, session, user, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}
