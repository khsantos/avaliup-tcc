"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, ChevronUp, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { useSupabase } from "@/src/contexts/supabase-provider";

export default function FAQ() {
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const { user } = useSupabase();

  return (
    <div>
      {/* Cabeçalho com botão */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold mb-1 text-[#010b62] dark:text-white">
            Dúvidas
          </h3>
          <span className="text-[#010b62]/50 dark:text-white/50">
            Observe e interaja com as dúvidas de nossa comunidade
          </span>
        </div>

        {/* Dialog sempre abre, mas conteúdo muda */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#010b62] text-white hover:bg-[#019ACF] dark:text-white dark:bg-[#01BAEF]">
              Fazer uma pergunta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            {!user ? (
              // Exibe mensagem se não logado
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <h2 className="text-xl font-semibold text-[#010b62] dark:text-white mb-2">
                  Você precisa estar logado
                </h2>
                <p className="text-sm text-[#010b62]/70 dark:text-white/70 mb-6">
                  Faça login para enviar uma pergunta e interagir com a
                  comunidade.
                </p>
                <Button
                  onClick={() => (window.location.href = "/signIn")}
                  className="bg-[#010b62] hover:bg-[#019ACF] dark:bg-[#01BAEF] dark:hover:bg-[#019ACF] dark:text-white"
                >
                  Ir para login
                </Button>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-[#010b62] dark:text-white">
                    Fazer uma pergunta
                  </DialogTitle>
                  <DialogDescription className="text-[#010b62]/70 dark:text-white/70">
                    Escreva sua dúvida para que a comunidade possa ajudar.
                  </DialogDescription>
                </DialogHeader>

                {/* Formulário */}
                <form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#010b62] dark:text-white">
                      Título
                    </label>
                    <Input
                      placeholder="Ex: Como configurar este produto?"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#010b62] dark:text-white">
                      Descrição
                    </label>
                    <Textarea
                      placeholder="Explique melhor sua dúvida para ajudar outros a responderem."
                      className="mt-1"
                    />
                  </div>
                </form>

                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-[#010b62] hover:bg-[#019ACF] dark:bg-[#01BAEF] dark:hover:bg-[#019ACF] dark:text-white"
                  >
                    Publicar pergunta
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Exemplo de dúvida */}
      <div className="text-[#010b62] p-4 rounded-lg space-y-3 mt-8">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full border dark:border-[#01BAEF]/70 border-[#010b62]/70 flex items-center justify-center text-[#010b62] text-sm font-bold bg-gray-200">
            👤
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm dark:text-white">
                Usuário 1
              </span>
              <span className="text-xs text-[#010b62]/70 dark:text-white/70">
                há 28/08/2024
              </span>
            </div>
          </div>
        </div>

        <p className="leading-relaxed dark:text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        <div className="flex items-center gap-6 text-xs text-[#010b62]/70">
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#01BAEF] dark:text-white/70">
            <ThumbsUp className="w-5 h-5 dark:text-white/70" />
            <span>210</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#01BAEF] dark:text-white/70">
            <ThumbsDown className="w-5 h-5 dark:text-white/70" />
            <span>16</span>
          </div>
        </div>

        <div
          onClick={() => setMostrarRespostas(!mostrarRespostas)}
          className="flex items-center gap-1 mt-2 text-sm text-[#01BAEF] cursor-pointer hover:underline"
        >
          <span>7 respostas</span>
          {mostrarRespostas ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>

        {mostrarRespostas && (
          <div className="ml-4 mt-3 border-l border-[#010b62]/50 pl-4 space-y-3 dark:border-[#01BAEF]/70">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border border-[#010b62]/70 bg-white/20 flex items-center justify-center text-[#010b62] text-sm font-bold">
                👤
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#010b62] dark:text-white">
                    Usuário 2
                  </span>
                  <span className="text-xs text-[#010b62]/70 dark:text-white/70">
                    há 28/08/2024
                  </span>
                </div>
                <p className="text-sm text-[#010b62]/90 mt-1 leading-relaxed dark:text-white">
                  Concordo! Tive a mesma experiência com esse modelo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
