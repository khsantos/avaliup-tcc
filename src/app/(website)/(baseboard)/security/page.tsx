"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function SecurityPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712] px-4 py-12">
      <Card className="max-w-xl w-full bg-transparent border dark:border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] border-[#010b62] backdrop-blur-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#010B62] dark:text-white">
            Segurança
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm leading-relaxed text-[#010B62] dark:text-white">
          <p>
            🔒 Nosso site adota práticas rigorosas de segurança para proteger
            seus dados. Utilizamos conexão segura (HTTPS), criptografia de
            senhas e protocolos atualizados para garantir a integridade das suas
            informações. As contas de usuário são protegidas e os dados pessoais
            não são compartilhados com terceiros sem consentimento. Recomendamos
            o uso de senhas fortes e únicas para sua conta.
          </p>

          <p>
            🛒 Transparência com Afiliados: Alguns links presentes em nosso site
            podem ser afiliados. Isso significa que podemos receber comissões
            caso você realize uma compra por meio deles – sem custo adicional
            para você. Essa prática nos ajuda a manter o site e continuar
            oferecendo conteúdo gratuito e imparcial.
          </p>

          <p>
            📊 Compromisso com a Imparcialidade: Todos os rankings e avaliações
            de periféricos são baseados em critérios técnicos e análises
            especializadas. Prezamos pela imparcialidade e pela experiência real
            do usuário.
          </p>

          <p>
            Em caso de dúvidas, envie um e-mail para{" "}
            <a
              href="mailto:privacidade@avaliup.com"
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
