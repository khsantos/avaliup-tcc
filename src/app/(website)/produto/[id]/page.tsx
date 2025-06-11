import { notFound } from "next/navigation";
import PriceHistoryChart from "@/src/components/PriceHistoryChart";
import { supabase } from "@/src/lib/supabase";
import Image from "next/image";
import { LuPiggyBank } from "react-icons/lu";

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
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-shrink-0 mx-auto">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            quality={100}
            className="rounded-2xl shadow-lg"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div className="inline-block bg-blue-900 text-sm text-white font-semibold px-4 py-1 rounded-sm shadow">
            Top #{product.rank} - Mouses gamers custo-benefício
          </div>

          <h1 className="text-2xl font-bold leading-tight text-[#010b62]">
            {product.name}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-gray-400 line-through text-sm">R$415,12</p>
              <p className="text-2xl font-bold text-[#010b62]">
                R$ {product.price.toFixed(2)}
              </p>
              <p className="text-gray-400 text-sm">melhor preço via Kabum</p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#010b62] hover:bg-blue-800 text-white px-8 py-2 rounded-sm shadow font-medium"
              >
                Acessar
              </a>
              <button className="w-10 h-10 border border-[#010b62] rounded-sm">
                <LuPiggyBank />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-[#010b62]">
              Produtos semelhantes
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {/* Carousel de Produtos Semelhantes */}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-1 text-[#010b62]">
          Histórico de preços
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Acompanhe a variação do preço deste produto ao longo do tempo.
        </p>
        <div className="bg-white/5 rounded-xl p-4 shadow border border-white/10">
          <PriceHistoryChart />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-2 text-[#010b62]">
          Ficha técnica
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Consulte as especificações técnicas deste produto.
        </p>
        <table className="w-full text-left border border-white/10 rounded-xl overflow-hidden text-sm">
          <tbody>
            {product.specs &&
              Object.entries(product.specs).map(([key, value]) => (
                <tr
                  key={key}
                  className="border-t border-white/10 even:bg-white/5"
                >
                  <td className="p-3 font-medium capitalize">{key}</td>
                  <td className="p-3">{value}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
