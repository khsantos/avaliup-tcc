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
    <div className="ml-4 mt-3 border-l border-[#010b62]/20 pl-4 space-y-3 ">
      {/* Renderiza cada resposta (review) da pergunta */}
      {respostasListadas[q.id]?.length ? (
        respostasListadas[q.id].map((r) => (
          <div key={r.id} className="flex items-start gap-3">
            <Avatar className="w-8 h-8 border">
              <AvatarImage
                src={r.users?.profile_img || ""}
                alt={r.users?.name || "Avatar"}
              />
              <AvatarFallback>
                <UserIcon className="w-4 h-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#010b62] dark:text-white">
                  <div className="flex items-center gap-1">
                    <span>{r.users?.name || r.user_id}</span>
                    <Award className="w-4 h-4 text-blue-400" />
                    <Award className="w-4 h-4 text-blue-300" />
                    <Award className="w-4 h-4 text-blue-200" />
                  </div>
                </span>
                <span className="text-xs text-[#010b62]/70 dark:text-white/70">
                  {new Date(r.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm mt-2 text-[#010b62]/90 dark:text-white/90 break-words whitespace-pre-wrap">
                {r.content}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">Nenhuma resposta ainda.</p>
      )}
      {/* Formulário para responder */}
      {user && (
        <div className="mt-4">
          <Textarea
            placeholder="Responder..."
            value={respostas[q.id] || ""}
            onChange={(e) =>
              setRespostas((prev) => ({
                ...prev,
                [q.id]: e.target.value,
              }))
            }
            className="mb-2 dark:text-white text-[#010b62]"
          />
          <Button
            onClick={() => enviarResposta(q.id)}
            className="bg-[#010b62] hover:bg-[#019ACF] dark:bg-[#01BAEF] dark:hover:bg-[#019ACF] dark:text-white"
          >
            Enviar resposta
          </Button>
        </div>
      )}
    </div>
  );
}
