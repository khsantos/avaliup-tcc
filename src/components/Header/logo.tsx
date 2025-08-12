// src/components/layout/Header/Logo.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import LogoTeclado from "@/public/logo-menu.svg";
import LogoTecladoDark from "@/public/logo-menu-dark.svg";

export function Logo({ className = "", size = { w: 78, h: 49 } }: { className?: string; size?: { w: number; h: number } }) {
    const { theme, systemTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;
    const logo = currentTheme === "dark" ? LogoTecladoDark : LogoTeclado;

    return (
        <Link href="/" className={className}>
            <Image src={logo} alt="logo" width={size.w} height={size.h} priority className="w-full h-full" />
        </Link>
    );
}
