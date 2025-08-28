import type { Metadata } from "next";
import CategoryPage from "@/src/components/CategoryPage";

interface Params {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const slug = params.slug;
  const categoryName =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");

  return {
    title: `${categoryName} | Avali.up`,
    description: `Veja os melhores ${categoryName} gamers custo-benefício.`,
  };
}

export default function CategoriaPage({ params }: { params: Params }) {
  return <CategoryPage slug={params.slug} />;
}
