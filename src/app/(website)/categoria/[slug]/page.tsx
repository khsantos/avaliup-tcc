// src/app/(website)/categoria/[slug]/page.tsx
import type { Metadata } from "next";
import CategoryPage from "@/src/components/CategoryPage";

// Tipagem explícita dos parâmetros da rota
interface PageParams {
  slug: string;
}

// Função de metadata para a página
export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const slug = params.slug;
  const categoryName =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");

  return {
    title: `${categoryName} | Avali.up`,
    description: `Veja os melhores ${categoryName} gamers custo-benefício.`,
  };
}

// Página principal da categoria
export default function CategoriaPage({ params }: { params: PageParams }) {
  return <CategoryPage slug={params.slug} />;
}
