// src/components/layout/Header/NavSection.tsx
"use client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import type { NavGroup } from "./nav/nav.config";

type Props = {
    group: NavGroup;
    isMobile?: boolean;
    openKey?: string | false;
    setOpenKey?: (key: string | false) => void;
    onItemClick?: () => void; // fechar menu mobile ao clicar
};

// NavSection.tsx (ajuste)
export function NavSection({ group, isMobile, openKey, setOpenKey, onItemClick }: Props) {
    if (group.href) {
        return (
            <Link
                href={group.href}
                className="flex items-center gap-1 px-2 py-1 rounded-sm hover:bg-[#0969da]/15 dark:hover:bg-[#00afd3]/30 cursor-pointer transition-colors"
                onClick={onItemClick}
            >
                {group.label}
            </Link>
        );
    }

    const isOpen = openKey === group.key;
    const handleOpenChange = (open: boolean) => setOpenKey?.(open ? group.key : false);

    // ✅ Só controlamos no mobile (ou quando setOpenKey existir)
    const controlledProps = setOpenKey
        ? { open: isOpen, onOpenChange: handleOpenChange as (open: boolean) => void }
        : {};

    return (
        <DropdownMenu
            modal={!isMobile}
            {...controlledProps}   // <- aqui a mágica
        >
            <DropdownMenuTrigger
                aria-expanded={!!isOpen}
                className="group flex items-center gap-1 px-2 py-1 rounded-sm hover:bg-[#0969da]/15 dark:hover:bg-[#00afd3]/30 cursor-pointer focus:outline-none transition-colors"
            >
                {group.label}
                <ChevronDown aria-hidden className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>

            <DropdownMenuContent side={isMobile ? "bottom" : undefined} align="start">
                {group.items?.map((it) => (
                    <DropdownMenuItem key={it.href} asChild>
                        <Link href={it.href} onClick={onItemClick}>
                            {it.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
