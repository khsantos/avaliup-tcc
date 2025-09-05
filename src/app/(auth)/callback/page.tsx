"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro na autenticação:", error);
        router.replace("/login");
        return;
      }

      if (data.session) {
        router.replace("/");
      } else {
        router.replace("/login");
      }
    };

    handleCallback();
  }, [router]);

  return <p className="text-center mt-10">Redirecionando...</p>;
}
