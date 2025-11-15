import type { Metadata } from "next";
import SubcategoryPage from "@/src/components/SubCategoryPage";

interface PageParams {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;

  const formatted =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");

  return {
    title: `${formatted} | Avali.up`,
    description: `Veja os melhores produtos ${formatted}.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;

  return <SubcategoryPage slug={slug} />;
}
