"use client";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";
import { User as UserIcon, MoreVertical, Trash } from "lucide-react";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Comentario } from "@/src/types/FAQComment";
import { Question } from "@/src/types/Question";
import { User } from "@/src/types/User";
import { AchievementBadges } from "../AchievementsBadges";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { useState } from "react";

interface FAQAnswerListProps {
  respostasListadas: { [key: string]: Comentario[] };
  q: Question;
  respostas: { [key: string]: string };
  setRespostas: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  user: User | null;
  enviarResposta: (id: string) => void;
  handleDeleteAnswer?: (id: string) => void;
}

export default function FAQAnswerList({
  respostasListadas,
  q,
  respostas,
  setRespostas,
  user,
  enviarResposta,
  handleDeleteAnswer,
}: FAQAnswerListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="relative mt-3 pl-4 sm:pl-6 border-l border-[#010b62]/20 space-y-3">
      {/* Linha lateral */}
      <div className="absolute top-0 left-2 sm:left-3 h-full border-l border-[#010b62]/20" />

      {/* Respostas listadas */}
      {respostasListadas[q.id]?.length ? (
        respostasListadas[q.id].map((r) => (
          <div
            key={r.id}
            className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 w-full"
          >
            {/* Avatar */}
            <Avatar className="w-8 h-8 flex-shrink-0 border">
              <AvatarImage
                src={r.users?.profile_img || ""}
                alt={r.users?.name || "Avatar"}
              />
              <AvatarFallback>
                <UserIcon className="w-4 h-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            {/* Conteúdo */}
            <div className="flex flex-col min-w-0 w-full">
              <div className="flex items-start justify-between w-full gap-2">
                {/* Nome + data */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="font-semibold text-sm text-[#010b62] dark:text-white break-words">
                      {r.users?.name || r.user_id}
                    </span>
                    <div className="flex items-center gap-1">
                      <AchievementBadges userId={r.user_id} size="sm" />
                    </div>
                  </div>
                  <span className="text-xs text-[#010b62]/70 dark:text-white/70">
                    {new Date(r.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Dropdown do dono da resposta */}
                {user?.id === r.user_id && (
                  <DropdownMenu
                    open={openMenuId === r.id}
                    onOpenChange={(open) => setOpenMenuId(open ? r.id : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1 rounded-md hover:bg-[#010b62]/10 dark:hover:bg-white/10 transition"
                        aria-label="Mais opções"
                      >
                        <MoreVertical className="w-4 h-4 text-[#010b62]/70 dark:text-white/70" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="right"
                      align="end"
                      sideOffset={4}
                      className="w-40 animate-in fade-in zoom-in-95 duration-200"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          if (handleDeleteAnswer) handleDeleteAnswer(r.id);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-[#010b62] hover:bg-gray-200 dark:hover:bg-gray-800"
                      >
                        <Trash className="w-5 h-5" />
                        Deletar resposta
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Texto da resposta */}
              <p className="text-sm mt-1 text-[#010b62]/90 dark:text-white/90 break-words whitespace-pre-wrap">
                {r.content}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nenhuma resposta ainda.
        </p>
      )}

      {/* Campo de nova resposta */}
      {user && (
        <div className="mt-3 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 w-full">
          <Textarea
            placeholder="Responder..."
            value={respostas[q.id] || ""}
            onChange={(e) =>
              setRespostas((prev) => ({
                ...prev,
                [q.id]: e.target.value,
              }))
            }
            className="flex-1 w-full dark:text-white text-[#010b62]"
          />
          <Button
            onClick={() => enviarResposta(q.id)}
            className="w-full sm:w-auto bg-[#010b62] hover:bg-[#019ACF] dark:bg-[#01BAEF] dark:hover:bg-[#019ACF] dark:text-white"
          >
            Enviar resposta
          </Button>
        </div>
      )}
    </div>
  );
}
