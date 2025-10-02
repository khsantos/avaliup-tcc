"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroPNG from "../../../public/hero.png";
import { supabase } from "@/src/lib/supabase";

export default function Hero() {
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopMouse() {
      const { data, error } = await supabase
        .from("products")
        .select("id")
        .eq("category", "mouse")
        .eq("rank", 1)
        .single();

      if (error) {
        console.error("Erro ao buscar produto top 1:", error);
      } else if (data) {
        setProductId(data.id);
      }
    }

    fetchTopMouse();
  }, []);

  if (!productId) return null;

  return (
    <Link
      href={`/produto/${productId}`}
      className="inline-block rounded-lg overflow-hidden"
    >
      <Image
        src={HeroPNG}
        alt="Hero completo"
        width={HeroPNG.width}
        height={HeroPNG.height}
        className="object-contain"
        priority
      />
    </Link>
  );
}
