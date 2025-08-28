import MainPage from "@/src/components/MainPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "O melhor site para encontrar produtos de qualidade.",
};

export default function Page() {
  return <MainPage />;
}
