import { notFound } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import ProductTabs from "@/src/components/ProductTabs";
import ProductLayout from "@/src/components/ProductLayout";
import { RelatedProducts } from "@/src/components/RelatedProducts";
import type { Metadata } from "next";
import { getProductImageUrl } from "@/src/lib/supabase-storage";
import AdBanner from "@/src/components/AdBanner";

type PageParams = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: product ? `${product.name} | Avali.up` : "Produto | Avali.up",
    description: product
      ? `Veja avaliações e detalhes do produto ${product.name}`
      : "Detalhes do produto",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { id } = await params;

  // Buscar produto
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product || error) return notFound();

  // Buscar menor preço
  const { data: lowestPrice } = await supabase
    .from("product_prices")
    .select("price, marketplace")
    .eq("products_id", id)
    .order("price", { ascending: true })
    .limit(1)
    .single();

  const signedImageUrl = await getProductImageUrl(product.image);

  const productWithSignedUrl = {
    ...product,
    imageUrl: signedImageUrl || product.image,
    lowestPrice: lowestPrice?.price || null,
    lowestPlatform: lowestPrice?.marketplace || null,
  };

  return (
    <div className="w-[80%] mx-auto text-white">
      <ProductLayout product={productWithSignedUrl} />
      <ProductTabs productId={product.id} />
      <AdBanner slot="2165327748" height={40} margin="my-20" />
      <RelatedProducts productId={product.id} />
    </div>
  );
}
