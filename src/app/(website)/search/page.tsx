import SearchPage from "@/src/components/SearchPage";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Avali.up |`,
  };
}

export default function Search() {
  return <SearchPage />;
}
