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
        <form onSubmit={onSubmit} className="flex items-center max-w-[180px] sm:max-w-xs md:max-w-sm">
            <div className="relative w-full">
                <label htmlFor="site-search" className="sr-only">Buscar produtos</label>
                <input
                    id="site-search"
                    type="text"
                    placeholder="Buscar produtos"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="border border-[#010B62] rounded-sm h-10 text-xs sm:text-sm pl-8 focus:outline-none focus:ring-2 focus:ring-[#0969DA] dark:border-white w-full"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#010b62] dark:text-white" />
            </div>
        </form>
    );
}
