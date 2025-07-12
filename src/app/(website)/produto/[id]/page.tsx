import { notFound } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import ProductTabs from "@/src/components/ProductTabs";
import ProductLayout from "@/src/components/ProductLayout";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product || error) return notFound();

  return (
    <div className="w-[80%] mx-auto py-10 text-white">
      <ProductLayout product={product} />
      <ProductTabs productId={product.id} />
    </div>
  );
}
