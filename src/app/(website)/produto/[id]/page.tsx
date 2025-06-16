import { notFound } from "next/navigation";
import PriceHistoryChart from "@/src/components/PriceHistoryChart";
import { supabase } from "@/src/lib/supabase";
import Image from "next/image";
import { LuPiggyBank } from "react-icons/lu";
import ProductSpecification from "@/src/components/ProductSpecification";
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
      <ProductLayout />
      <ProductTabs />


    </div>
  );
}
