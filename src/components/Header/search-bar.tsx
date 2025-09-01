// src/components/layout/Header/SearchBar.tsx
"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar() {
    const [term, setTerm] = useState("");
    const router = useRouter();

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        const q = term.trim();
        if (q) {
            router.push(`/search?query=${encodeURIComponent(q)}`);
            setTerm("");
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            // mobile: 180px | md: 260px | lg+: 320px, e não deixa encolher
            className="shrink-0 w-[180px] md:w-[260px] lg:w-[320px]"
        >
            <div className="relative w-full">
                <label htmlFor="site-search" className="sr-only">
                    Buscar produtos
                </label>
                <input
                    id="site-search"
                    type="search"
                    placeholder="Buscar produtos"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    autoComplete="off"
                    enterKeyHint="search"
                    className="w-full h-10 pl-8 text-xs sm:text-sm border border-[#010B62] dark:border-white rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                />
                <Search
                    className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#010b62] dark:text-white"
                    aria-hidden
                />
            </div>
        </form>
    );
}
