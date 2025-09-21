"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("Erro na autenticação:", error);
        router.replace("/login");
        return;
      }

      const user = session.user;

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!existingUser) {
        await supabase.from("users").insert([
          {
            id: user.id,
            name:
              user.user_metadata.full_name ||
              user.user_metadata.name ||
              user.email?.split("@")[0],
            email: user.email,
            profile_img: user.user_metadata.avatar_url || "",
            badges: [],
          },
        ]);
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({ last_sign_in_at: new Date().toISOString() })
        .eq("id", user.id);

      if (updateError) {
        console.error(
          "Erro ao atualizar last_sign_in_at no callback:",
          updateError.message
        );
      }

      router.replace("/");
    };

    handleCallback();
  }, [router]);

  return <p className="text-center mt-10">Redirecionando...</p>;
}
