import { supabase } from "@/src/lib/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.storage
      .from("products")
      .getPublicUrl("mouse.png");

    setBannerUrl(data.publicUrl);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-[#010B62] to-[#021087] text-white p-6 flex flex-col md:flex-row justify-between items-center overflow-hidden rounded-lg h-100">
      <div className="space-y-2 max-w-md z-10">
        <p className="text-3xl font-bold flex items-center gap-2">
          <span className="text-[#FF9800] text-4xl">⭐</span> TOP #1
        </p>
        <h1 className="text-2xl font-semibold">
          Mouses Gamers Custo-benefício
        </h1>
        <h2 className="text-3xl font-bold">ZAOPIN-Z2</h2>
        <p className="text-sm">4K Hotswappable Wireless</p>
        <div className="flex items-center space-x-3 mt-2">
          <span className="text-yellow-400 text-2xl font-bold flex items-center gap-1">
            ⭐ 4.9
          </span>
          <button className="bg-cyan-500 text-white px-4 py-1 rounded hover:bg-cyan-600 transition text-sm">
            Avaliações
          </button>
        </div>
      </div>

      <div className="relative w-60 h-60 mt-6 md:mt-0 z-10">
        <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-2xl scale-110" />

        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-[180%] h-[180%] border border-white/20 rounded-full rotate-[25deg] z-0" />

        {bannerUrl && (
          <Image
            src={bannerUrl}
            alt="Mouse destaque"
            fill
            className="object-contain relative z-10"
          />
        )}
      </div>
    </section>
  );
}
