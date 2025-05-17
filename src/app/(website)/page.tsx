"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Mouse = {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
};

export default function Page() {
  const MousesContainer = () => {
    const [mouses, setMouses] = useState<Mouse[]>([]);

    useEffect(() => {
      const fetchMouses = async () => {
        const response = await fetch("sua-api-aqui");
        const data = await response.json();
        setMouses(data);
      };
      fetchMouses();
    }, []);
  };

  return (
    <div className="min-h-screen bg-white p-4 space-y-10">
      <section className="bg-[#191970] text-white p-6 flex flex-col md:flex-row justify-between items-center relative">
        <div className="space-y-2 max-w-md">
          <p className="text-3xl font-bold">⭐ TOP #1</p>
          <h1 className="text-2xl font-semibold">
            Mouses Gamers Custo-benefício
          </h1>
          <h2 className="text-3xl font-bold">ZAOPIN-Z2</h2>
          <p className="text-sm">4K Hotswappable Wireless</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-yellow-400 text-2xl font-bold">4.9</span>
            <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition text-sm">
              Avaliações
            </button>
          </div>
        </div>
        <div className="relative w-48 h-48 mt-6 md:mt-0">
          <Image
            src="/mouse.png"
            alt="Mouse destaque"
            fill
            className="object-contain"
          />
        </div>
      </section>
    </div>
  );
}
