"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712] px-4 py-12">
      <Card className="max-w-xl w-full bg-transparent border dark:border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] border-[#010b62] backdrop-blur-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#010B62] dark:text-white">
            Sobre a Avali.UP
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm leading-relaxed text-[#010B62] dark:text-white">
          <p>
            O Avali.UP nasceu com o objetivo de centralizar avaliações de
            periféricos em um único lugar, oferecendo uma fonte confiável para
            quem busca tomar decisões mais assertivas na hora de adquirir novos
            equipamentos.
          </p>

          <p>
            Sabemos que periféricos costumam ter preços elevados, o que torna
            essencial uma análise cuidadosa antes da compra. O Avali.UP ajuda a
            alinhar as expectativas dos usuários em relação à realidade e às
            funcionalidades do produto, evitando frustrações e gastos
            desnecessários.
          </p>

          <p>
            Nosso propósito é criar uma comunidade engajada, onde os próprios
            usuários possam avaliar os periféricos disponíveis na plataforma.
            Essas opiniões são livres de influências externas, como patrocínios
            ou marketing, permitindo que as decisões sejam baseadas em
            experiências reais de consumidores comuns.
          </p>

          <p>
            O principal objetivo do Avali.UP é se tornar uma referência no
            mercado de avaliações de periféricos, criando uma cultura de
            pesquisa pré-compra. Queremos ser a plataforma de consulta
            indispensável antes de qualquer investimento em novos equipamentos.
          </p>

          <div className="pt-4 text-center">
            <Link href="/">
              <Button
                variant="outline"
                className="cursor-pointer border-[#010b62] dark:border-[#01BAEF] hover:bg-gray-200 hover:text-[#010b62] dark:hover:text-[#01BAEF] dark:bg-[#030712] dark:hover:bg-[#02102e]"
              >
                Voltar à página inicial
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
