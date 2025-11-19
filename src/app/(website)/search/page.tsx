import SearchClient from "@/src/components/SearchPage";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Avali.up |`,
  };
}

export default function Search() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <SearchClient />
    </Suspense>
  );
}
