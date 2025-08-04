"use client";
import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function FAQ() {
  const [mostrarRespostas, setMostrarRespostas] = useState(false);

  return (
    <div className="text-[#010b62] p-4 rounded-lg border border-gray-300/20 space-y-3 mt-8 bg-white/5">
      {/* Cabeçalho com avatar, usuário e data na mesma linha */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full border border-[#010b62]/70 flex items-center justify-center text-[#010b62] text-sm font-bold bg-gray-200">
          👤
        </div>
        <div className="flex flex-col">
          {/* Nome + Data */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Usuário 1</span>
            <span className="text-xs text-[#010b62]/70">há 28/08/2024</span>
          </div>
        </div>
      </div>

      {/* Comentário */}
      <p className="text-sm leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mauris
        nibh, tempus at blandit pretium, luctus non metus. Quisque varius non
        nisi quis pellentesque. Nunc egestas ex odio, non mollis eros eleifend
        sit amet. Donec as Lorem ipsum dolor sit amet, consectetur adipiscing
        elit.
      </p>

      {/* Ações */}
      <div className="flex items-center gap-6 text-xs text-[#010b62]/70">
        <div className="flex items-center gap-1 cursor-pointer hover:text-[#01BAEF]">
          <ThumbsUp className="w-5 h-5" />
          <span>210</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-[#01BAEF]">
          <ThumbsDown className="w-5 h-5" />
          <span>16</span>
        </div>
      </div>
      {/* Respostas abaixo */}
      <div
        className="mt-1 text-sm text-[#01BAEF] cursor-pointer hover:underline"
        onClick={() => setMostrarRespostas(!mostrarRespostas)}
      >
        {mostrarRespostas ? "7 respostas" : "7 respostas"}
      </div>

      {/* Respostas */}
      {mostrarRespostas && (
        <div className="ml-4 mt-3 border-l border-[#010b62]/50 pl-4 space-y-3">
          {/* Resposta individual */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full border border-[#010b62]/70 bg-white/20 flex items-center justify-center text-[#010b62] text-sm font-bold">
              👤
            </div>
            <div className="flex flex-col">
              {/* Nome + Data da resposta */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#010b62]">
                  Usuário 2
                </span>
                <span className="text-xs text-[#010b62]/70">há 28/08/2024</span>
              </div>
              <p className="text-sm text-[#010b62]/90 mt-1 leading-relaxed">
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
