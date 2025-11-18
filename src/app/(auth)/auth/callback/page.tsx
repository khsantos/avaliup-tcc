"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.log("Aguardando sessão...");
        supabase.auth.onAuthStateChange(async (_event, newSession) => {
          if (newSession) {
            await processUser(newSession.user);
          }
        });
        return;
      }

      await processUser(session.user);
    };

    const processUser = async (user: User) => {
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!existingUser) {
        await supabase.from("users").insert({
          id: user.id,
          name:
            user.user_metadata.full_name ||
            user.user_metadata.name ||
            user.email?.split("@")[0],
          email: user.email,
          profile_img: user.user_metadata.avatar_url ?? "",
        });
      }

      await supabase
        .from("users")
        .update({ last_sign_in_at: new Date().toISOString() })
        .eq("id", user.id);

      router.replace("/");
    };

    handleSession();
  }, [router]);

  return <p className="text-center mt-10">Redirecionando...</p>;
}
