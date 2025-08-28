import type { Metadata } from "next";
import CategoryPage from "@/src/components/CategoryPage";

interface PageProps {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = params.slug;
  const categoryName =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");

  return {
    title: `${categoryName} | Avali.up`,
    description: `Veja os melhores ${categoryName} gamers custo-benefício.`,
  };
}

export default function CategoriaPage({ params }: PageProps) {
  return <CategoryPage slug={params.slug} />;
}
