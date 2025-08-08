"use client";
import { useState } from "react";

export default function FAQ() {
  const [mostrarRespostas, setMostrarRespostas] = useState(false);

  return (
    <div className=" text-white p-4 rounded-lg border border-gray-700/40 space-y-2 mt-8">
      {/* Cabeçalho com avatar, usuário e data na mesma linha */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full border border-[#01BAEF]/70 flex items-center justify-center text-white text-sm font-bold">
          👤
        </div>
        <div className="flex flex-col">
          {/* Nome + Data */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm dark:text-white text-[#010b62]">
              Usuário 1
            </span>
            <span className="text-xs dark:text-gray-400 text-[#010b62]/50">
              28/08/2024
            </span>
          </div>

          {/* Badges */}
          <div className="flex gap-1 mt-1">
            <span className="text-xs bg-slate-800 text-gray-200 px-2 py-0.5 rounded-full">
              🏆
            </span>
            <span className="text-xs bg-slate-800 text-gray-200 px-2 py-0.5 rounded-full">
              💬
            </span>
            <span className="text-xs bg-slate-800 text-gray-200 px-2 py-0.5 rounded-full">
              ⭐
            </span>
          </div>
        </div>
      </div>

      {/* Comentário */}
      <p className="text-md text-gray-300 leading-relaxed ml-12">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mauris
        nibh, tempus at blandit pretium, luctus non metus. Quisque varius non
        nisi quis pellentesque. Nunc egestas ex odio, non mollis eros eleifend
        sit amet.
      </p>

      {/* Ações */}
      <div className="flex items-center gap-4 text-xs text-gray-400 ml-12">
        <div className="flex items-center gap-1">
          <button className="hover:text-white">👍</button>
          <span>210</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="hover:text-white">👎</button>
          <span>16</span>
        </div>
        <button
          onClick={() => setMostrarRespostas(!mostrarRespostas)}
          className="text-[#01BAEF] hover:underline ml-auto text-sm"
        >
          {mostrarRespostas ? "Ocultar respostas" : "1 resposta"}
        </button>
      </div>

      {/* Respostas */}
      {mostrarRespostas && (
        <div className="ml-12 mt-3 border-l border-none pl-4">
          {/* Resposta individual */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-600 dark:bg-[030712] flex items-center justify-center text-white text-sm font-bold">
              👤
            </div>
            <div className="flex flex-col">
              {/* Nome + Data da resposta */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Usuário 2</span>
                <span className="text-xs text-gray-400">28/08/2024</span>
              </div>
              <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                Concordo! Tive a mesma experiência com esse modelo. Muito útil!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
