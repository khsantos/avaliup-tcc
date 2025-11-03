"use client";

import { Card } from "../ui/card";
import { Specification } from "@/src/types/Specification";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";

type SpecificationProductProps = {
  productId: number;
};

export default function ProductSpecification({
  productId,
}: SpecificationProductProps) {
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpecifications() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("specifications")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Erro ao buscar especificações do produto:", error);
        setSpecifications([]);
      } else if (data?.specifications) {
        const specsArray = Object.entries(data.specifications).map(
          ([key, value]) => ({
            label: key,
            value: String(value),
          })
        );
        setSpecifications(specsArray);
      } else {
        setSpecifications([]);
      }
      setLoading(false);
    }

    if (productId) {
      fetchSpecifications();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="p-4 text-center text-[#010b62] dark:text-white font-semibold">
        Carregando especificações...
      </div>
    );
  }

  if (specifications.length === 0) {
    return (
      <div className="p-4 text-center text-[#010b62] dark:text-white font-semibold">
        Nenhuma especificação encontrada.
      </div>
    );
  }

  return (
    <div className="p-2 max-w-full mx-auto overflow-x-auto">
      <Card className="rounded-2xl border border-[#b9b9d1] bg-border-white overflow-hidden">
        {specifications.map((spec, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 sm:grid-cols-[150px_1fr] md:grid-cols-[220px_1fr] text-sm sm:text-base px-2 sm:px-4 py-2 sm:py-3
              ${
                index % 2 === 0
                  ? "bg-[#e4e4f5] dark:bg-[#030712]"
                  : "bg-[#f7f7fb] dark:bg-[#020B24]/85"
              }
              ${
                index !== specifications.length - 1
                  ? "border-b border-[#b9b9d1] dark:border-none"
                  : ""
              }`}
          >
            <div className="font-medium text-[#010b62] dark:text-white">
              {spec.label}
            </div>
            <div className="text-[#010b62] dark:text-white sm:border-l border-white/60 dark:border-white pl-0 sm:pl-4">
              {spec.value}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
