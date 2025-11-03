import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import {
  Award,
  MoreVertical,
  Trash,
  User as UserIcon,
  ThumbsUp,
  ThumbsDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import FAQAnswerList from "../FAQAnswerList";
import { Question } from "@/src/types/Question";
import { User } from "@/src/types/User";
import { Comentario } from "@/src/types/FAQComment";
import DeleteDialog from "../DeleteDialog";

interface FAQQuestionCardProps {
  q: Question;
  user: User | null;
  respostasListadas: { [key: string]: Comentario[] };
  respostas: { [key: string]: string };
  setRespostas: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  mostrarRespostas: string | null;
  setMostrarRespostas: React.Dispatch<React.SetStateAction<string | null>>;
  openDialogId: string | null;
  setOpenDialogId: React.Dispatch<React.SetStateAction<string | null>>;
  openMenuId: string | null;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  handleDeleteQuestion: (id: string) => void;
  handleQuestionVote: (id: string, type: "like" | "dislike") => void;
  animatedVote: { [key: string]: "like" | "dislike" | null };
  enviarResposta: (id: string) => void;
}

export default function FAQQuestionCard({
  q,
  user,
  respostasListadas,
  respostas,
  setRespostas,
  mostrarRespostas,
  setMostrarRespostas,
  openDialogId,
  setOpenDialogId,
  openMenuId,
  setOpenMenuId,
  handleDeleteQuestion,
  handleQuestionVote,
  animatedVote,
  enviarResposta,
}: FAQQuestionCardProps) {
  return (
    <div className="bg-white dark:bg-[#030712] shadow-md dark:shadow-none border border-[#010b62]/10 dark:border-white/10 rounded-2xl p-4 sm:p-5 mt-8 space-y-3">
      <DeleteDialog
        open={openDialogId === q.id}
        onOpenChange={(open) => {
          if (open) setOpenDialogId(q.id);
          else setOpenDialogId(null);
        }}
        onDelete={() => {
          handleDeleteQuestion(q.id);
          setOpenDialogId(null);
        }}
        onCancel={() => setOpenDialogId(null)}
      />

      {/* Cabeçalho da pergunta */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 w-full">
        <Avatar className="w-10 h-10 flex-shrink-0 border">
          <AvatarImage
            src={q.users?.profile_img || ""}
            alt={q.users?.name || "Avatar"}
          />
          <AvatarFallback>
            <UserIcon className="w-4 h-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 w-full">
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-[#010b62] dark:text-white">
                  {q.users?.name || q.user_id}
                </span>
                <span className="text-xs text-[#010b62]/70 dark:text-white/50">
                  {new Date(q.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Award className="w-4 h-4 text-blue-400" />
                <Award className="w-4 h-4 text-blue-300" />
                <Award className="w-4 h-4 text-blue-200" />
              </div>
            </div>

            {user?.id === q.user_id && (
              <DropdownMenu
                open={openMenuId === q.id}
                onOpenChange={(open) => {
                  if (open) setOpenMenuId(q.id);
                  else setOpenMenuId(null);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1 rounded-md hover:bg-[#010b62]/10 dark:hover:bg-white/10 transition"
                    aria-label="Mais opções"
                  >
                    <MoreVertical className="w-5 h-5 text-[#010b62]/70 dark:text-white/70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 animate-in fade-in zoom-in-95 duration-200"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setOpenDialogId(q.id);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-[#010b62] hover:bg-gray-200 dark:hover:bg-gray-800 w-full overflow-hidden whitespace-nowrap"
                  >
                    <Trash className="w-6 h-6" />
                    Deletar pergunta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <h4 className="text-lg font-bold mt-2 text-[#010b62] dark:text-white break-words">
            {q.title}
          </h4>
          <p className="text-md mt-1 leading-relaxed text-[#010b62]/90 dark:text-white/90 break-words whitespace-pre-wrap">
            {q.description}
          </p>
        </div>
      </div>

      {/* Área de votos e mostrar respostas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3 mt-4">
        <div className="flex gap-2 text-[#010b62]/70 dark:text-white items-center flex-wrap">
          <Button
            onClick={() => handleQuestionVote(q.id, "like")}
            variant="ghost"
            className={clsx(
              "transition-transform duration-150 ease-in-out active:scale-90 transform hover:scale-110 cursor-pointer hover:bg-gray-200 hover:text-[#01BAEF]",
              q.userVote === "like" && "text-[#01BAEF]",
              animatedVote[q.id] === "like" && "animate-press"
            )}
          >
            <ThumbsUp className="h-6 w-6" />
            <span className="text-sm">{q.likeCount}</span>
          </Button>
          <Button
            onClick={() => handleQuestionVote(q.id, "dislike")}
            variant="ghost"
            className={clsx(
              "transition-transform duration-150 ease-in-out active:scale-90 transform hover:scale-110 cursor-pointer hover:text-red-600 hover:bg-gray-200",
              q.userVote === "dislike" && "text-red-600",
              animatedVote[q.id] === "dislike" && "animate-press"
            )}
          >
            <ThumbsDown className="h-6 w-6" />
            <span className="text-sm">{q.dislikeCount}</span>
          </Button>
        </div>

        <div
          onClick={() =>
            setMostrarRespostas(mostrarRespostas === q.id ? null : q.id)
          }
          className="flex items-center gap-1 text-sm text-[#01BAEF] cursor-pointer hover:underline"
        >
          <span>{respostasListadas[q.id]?.length || 0} respostas</span>
          {mostrarRespostas === q.id ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Lista de respostas */}
      {mostrarRespostas === q.id && (
        <FAQAnswerList
          respostasListadas={respostasListadas}
          q={q}
          respostas={respostas}
          setRespostas={setRespostas}
          user={user}
          enviarResposta={enviarResposta}
        />
      )}
    </div>
  );
}
