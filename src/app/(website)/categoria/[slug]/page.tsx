// src/app/(website)/categoria/[slug]/page.tsx
import type { Metadata } from "next";
import CategoryPage from "@/src/components/CategoryPage";

interface PageParams {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;

  const categoryName =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");

  return {
    title: `${categoryName} | Avali.up`,
    description: `Veja os melhores ${categoryName} gamers custo-benefício.`,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;

  return <CategoryPage slug={slug} />;
}
