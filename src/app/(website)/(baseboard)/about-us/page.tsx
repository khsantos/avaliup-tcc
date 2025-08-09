"use client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712] px-4">
      <div className="w-[345px] space-y-4 mt-8">
        <h1 className="text-2xl font-bold text-[#010B62] dark:text-white text-center">
          Sobre a Avali.UP
        </h1>
        <p className="text-sm text-[#010B62] dark:text-white">
          <p className="text-sm text-[#010B62] dark:text-white">
            O Avali.UP nasceu com o objetivo de centralizar avaliações de
            periféricos em um único lugar, oferecendo uma fonte confiável para
            quem busca tomar decisões mais assertivas na hora de adquirir novos
            equipamentos.
          </p>
          <br />
          <p className="text-sm text-[#010B62] dark:text-white">
            Sabemos que periféricos costumam ter preços elevados, o que torna
            essencial uma análise cuidadosa antes da compra. O Avali.UP ajuda a
            alinhar as expectativas dos usuários em relação à realidade e às
            funcionalidades do produto, evitando frustrações e gastos
            desnecessários.
          </p>
          <br />
          <p className="text-sm text-[#010B62] dark:text-white">
            Nosso propósito é criar uma comunidade engajada, onde os próprios
            usuários possam avaliar os periféricos disponíveis na plataforma.
            Essas opiniões são livres de influências externas, como patrocínios
            ou marketing, permitindo que as decisões sejam baseadas em
            experiências reais de consumidores comuns.
          </p>
          <br />
          <p className="text-sm text-[#010B62] dark:text-white">
            O principal objetivo do Avali.UP é se tornar uma referência no
            mercado de avaliações de periféricos, criando uma cultura de
            pesquisa pré-compra. Queremos ser a plataforma de consulta
            indispensável antes de qualquer investimento em novos equipamentos.
          </p>
        </p>
      </div>
    </div>
  );
}
