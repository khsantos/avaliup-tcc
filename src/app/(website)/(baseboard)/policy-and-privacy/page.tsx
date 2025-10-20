"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712] px-4 py-12">
      <Card className="max-w-xl w-full bg-transparent border dark:border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] border-[#010b62] backdrop-blur-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#010B62] dark:text-white">
            Política de Privacidade
          </CardTitle>
          <p className="text-sm text-center text-muted-foreground">
            Última atualização: 26 de junho de 2025
          </p>
        </CardHeader>

        <CardContent className="space-y-4 text-sm leading-relaxed text-[#010B62] dark:text-white">
          <p>
            Esta Política explica como coletamos, usamos e protegemos suas
            informações ao usar o <strong>Avali.up</strong>.
          </p>

          <p>
            Coletamos dados como e-mail e IP para melhorar sua experiência e
            manter a segurança da plataforma.
          </p>

          <p>
            Não compartilhamos seus dados com terceiros, exceto se exigido por
            lei.
          </p>

          <p>
            Você pode solicitar a exclusão ou alteração de seus dados a qualquer
            momento.
          </p>

          <p>
            Em caso de dúvidas, envie um e-mail para{" "}
            <a
              href="mailto:privacidade@avaliup.com"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              privacidade@avaliup.com
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
