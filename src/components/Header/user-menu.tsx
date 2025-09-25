// src/components/layout/Header/UserMenu.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import type { Session, SupabaseClient } from "@supabase/supabase-js";

type Props = {
  session: Session | null;
  profileName?: string | null;
  supabase: SupabaseClient;
  variant?: "desktop" | "mobile";
  onAfterAction?: () => void;
};

export function UserMenu({
  session,
  profileName,
  supabase,
  variant = "desktop",
  onAfterAction,
}: Props) {
  const router = useRouter();

  if (!session?.user) {
    return (
      <Link href="/signIn">
        <button className="cursor-pointer flex items-center justify-center h-10 p-2 border text-[#010b62] dark:text-white border-[#010b62] rounded-md hover:bg-[#0969da]/15 dark:hover:bg-[#00afd3]/30 dark:border-white transition w-full">
          Entrar
        </button>
      </Link>
    );
  }

  const trigger =
    variant === "desktop" ? (
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer border h-10 w-10 sm:h-10 border-[#010b62] bg-white dark:bg-[#030712] dark:border-white">
          <AvatarFallback className="text-[#010b62] bg-white dark:text-white font-bold">
            {session.user.email?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
    ) : (
      <DropdownMenuTrigger asChild>
        <button className="w-full px-3 py-2 rounded-sm bg-white text-[#010b62] dark:bg-[#030712] dark:text-white border border-[#010b62] dark:border-white hover:bg-[#0969da]/15 dark:hover:bg-[#00afd3]/30 transition">
          Meu perfil
        </button>
      </DropdownMenuTrigger>
    );

  return (
    <DropdownMenu>
      {trigger}
      <DropdownMenuContent align={variant === "desktop" ? "end" : "start"}>
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {profileName ?? "Usuário"}
            </span>
            <span className="text-xs text-muted-foreground">
              {session.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile-general" onClick={onAfterAction}>
            Meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
            onAfterAction?.();
            router.refresh();
          }}
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
