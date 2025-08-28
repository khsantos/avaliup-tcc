import { notFound } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import ProductTabs from "@/src/components/ProductTabs";
import ProductLayout from "@/src/components/ProductLayout";
import { RelatedProducts } from "@/src/components/RelatedProducts";
import type { Metadata } from "next";

// Tipagem dos parâmetros da rota
type PageParams = { id: string };

// Tipagem correta do props do generateMetadata
type GenerateMetadataProps = { params: PageParams };

export async function generateMetadata(
  props: GenerateMetadataProps
): Promise<Metadata> {
  const { params } = props; // NÃO usar await

  const { data: product } = await supabase
    .from("products")
    .select("name")
    .eq("id", params.id)
    .single();

  return {
    title: product ? `${product.name} | Avali.up` : "Produto | Avali.up",
    description: product
      ? `Veja avaliações e detalhes do produto ${product.name}`
      : "Detalhes do produto",
  };
}

// Página principal — params já resolvido
export default async function ProductPage({ params }: { params: PageParams }) {
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product || error) return notFound();

  return (
    <div className="w-[80%] mx-auto text-white">
      <ProductLayout product={product} />
      <ProductTabs productId={product.id} />
      <RelatedProducts productId={product.id} />
    </div>
  );
}
