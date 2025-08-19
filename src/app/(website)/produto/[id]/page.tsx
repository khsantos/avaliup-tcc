import { notFound } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import ProductTabs from "@/src/components/ProductTabs";
import ProductLayout from "@/src/components/ProductLayout";
import { RelatedProducts } from "@/src/components/RelatedProducts";

export default async function ProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
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
