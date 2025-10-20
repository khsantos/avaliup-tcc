"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712] px-4 py-12">
      <Card className="max-w-xl w-full bg-transparent border dark:border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] border-[#010b62] backdrop-blur-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#010B62] dark:text-white">
            Termos de Uso
          </CardTitle>
          <p className="text-sm text-center text-muted-foreground">
            Última atualização: 26 de junho de 2025
          </p>
        </CardHeader>

        <CardContent className="space-y-4 text-sm leading-relaxed text-[#010B62] dark:text-white">
          <p>
            Bem-vindo ao <strong>Avali.up</strong>! Ao acessar este site, você
            concorda com os seguintes termos e condições. Leia-os com atenção
            antes de usar nosso serviço.
          </p>

          <p>
            O Avali.up é uma plataforma online para avaliação, resenha e
            comparação de periféricos de informática como teclados, mouses,
            headsets, entre outros.
          </p>

          <p>
            Ao enviar conteúdos como comentários e avaliações, você declara ser
            o autor e nos concede direito de uso e exibição pública desse
            conteúdo.
          </p>

          <p>
            Todo o conteúdo do site é protegido por direitos autorais. O uso
            indevido é proibido.
          </p>

          <p>
            Reservamo-nos o direito de alterar estes termos a qualquer momento.
          </p>

          <p>
            Em caso de dúvidas, entre em contato via{" "}
            <a
              href="mailto:contato@avaliup.com"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              contato@avaliup.com
            </a>
            .
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
