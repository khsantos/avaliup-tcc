"use client";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, ChevronUp, ChevronDown } from "lucide-react";

export default function FAQ() {
  const [mostrarRespostas, setMostrarRespostas] = useState(false);

  return (
    <div className="text-[#010b62] p-4 rounded-lg  space-y-3 mt-8">
      {/* Cabeçalho com avatar, usuário e data na mesma linha */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full border dark:border-[#01BAEF]/70 border-[#010b62]/70 flex items-center justify-center text-[#010b62] text-sm font-bold bg-gray-200">
          👤
        </div>
        <div className="flex flex-col">
          {/* Nome + Data */}
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

      {/* Comentário */}
      <p className=" leading-relaxed dark:text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mauris
        nibh, tempus at blandit pretium, luctus non metus. Quisque varius non
        nisi quis pellentesque. Nunc egestas ex odio, non mollis eros eleifend
        sit amet. Donec as Lorem ipsum dolor sit amet, consectetur adipiscing
        elit.
      </p>

      {/* Ações */}
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
      {/* Respostas abaixo */}
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

      {/* Respostas */}
      {mostrarRespostas && (
        <div className="ml-4 mt-3 border-l border-[#010b62]/50 pl-4 space-y-3 dark:border-[#01BAEF]/70">
          {/* Resposta individual */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full border border-[#010b62]/70 bg-white/20 flex items-center justify-center text-[#010b62] text-sm font-bold">
              👤
            </div>
            <div className="flex flex-col">
              {/* Nome + Data da resposta */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#010b62] dark:text-white">
                  Usuário 2
                </span>
                <span className="text-xs text-[#010b62]/70 dark:text-white/70">
                  há 28/08/2024
                </span>
              </div>
              <p className="text-sm text-[#010b62]/90 mt-1 leading-relaxed dark:text-white">
                Concordo! Tive a mesma experiência com esse modelo. Muito útil!
              </p>
            </div>
          </div>
          {/* Outras respostas podem seguir o mesmo padrão */}
        </div>
      )}
    </div>
  );
}
