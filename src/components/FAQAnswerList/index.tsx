import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";
import { User as UserIcon, Award } from "lucide-react";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Comentario } from "@/src/types/FAQComment";
import { Question } from "@/src/types/Question";
import { User } from "@/src/types/User";

interface FAQAnswerListProps {
  respostasListadas: { [key: string]: Comentario[] };
  q: Question;
  respostas: { [key: string]: string };
  setRespostas: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  user: User | null;
  enviarResposta: (id: string) => void;
}

export default function FAQAnswerList({
  respostasListadas,
  q,
  respostas,
  setRespostas,
  user,
  enviarResposta,
}: FAQAnswerListProps) {
  return (
    <div className="relative mt-3 pl-4 sm:pl-6 border-l border-[#010b62]/20 space-y-3">
      {/* Linha vertical de conexão (opcional) */}
      <div className="absolute top-0 left-2 sm:left-3 h-full border-l border-[#010b62]/20" />

      {/* Renderiza cada resposta */}
      {respostasListadas[q.id]?.length ? (
        respostasListadas[q.id].map((r) => (
          <div
            key={r.id}
            className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 w-full"
          >
            <Avatar className="w-8 h-8 flex-shrink-0 border">
              <AvatarImage
                src={r.users?.profile_img || ""}
                alt={r.users?.name || "Avatar"}
              />
              <AvatarFallback>
                <UserIcon className="w-4 h-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 w-full flex-wrap">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-semibold text-sm text-[#010b62] dark:text-white break-words">
                    {r.users?.name || r.user_id}
                  </span>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-blue-400" />
                    <Award className="w-4 h-4 text-blue-300" />
                    <Award className="w-4 h-4 text-blue-200" />
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

      {/* Formulário para responder */}
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
