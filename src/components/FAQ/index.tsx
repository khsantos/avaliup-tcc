"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { useSupabase } from "@/src/contexts/supabase-provider";
import { Comentario } from "@/src/types/FAQComment";
import { Question } from "@/src/types/Question";
import { toast } from "sonner";
import FAQQuestionCard from "../FAQQuestionCard";
import { Pagination } from "../Pagination";

interface FAQProps {
  productId: number;
}

export default function FAQ({ productId }: FAQProps) {
  const [mostrarRespostas, setMostrarRespostas] = useState<string | null>(null);
  const { user, supabase } = useSupabase();

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [respostas, setRespostas] = useState<{ [key: string]: string }>({});
  const [respostasListadas, setRespostasListadas] = useState<{
    [key: string]: Comentario[];
  }>({});
  const [animatedVote, setAnimatedVote] = useState<{
    [questionId: string]: "like" | "dislike" | null;
  }>({});
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const fetchQuestions = useCallback(async () => {
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from("faq_questions")
      .select(
        `
        *,
        users (
          name,
          profile_img
        ),
        faq_questions_votes (
          vote_type,
          user_id
        )
      `,
        { count: "exact" }
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error && data) {
      const questionsWithVotes = data.map((q) => ({
        ...q,
        likeCount: (q.faq_questions_votes as { vote_type: string }[]).filter(
          (v) => v.vote_type === "like"
        ).length,
        dislikeCount: (q.faq_questions_votes as { vote_type: string }[]).filter(
          (v) => v.vote_type === "dislike"
        ).length,
        userVote: (
          q.faq_questions_votes as { vote_type: string; user_id: string }[]
        ).find((v) => v.user_id === user?.id)?.vote_type,
      }));

      setQuestions(questionsWithVotes);
      if (count) setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
    }
  }, [supabase, user?.id, productId, currentPage]);

  const fetchAllAnswers = useCallback(async () => {
    const { data, error } = await supabase
      .from("faq_answers")
      .select(
        `
      *,
      users (
        name,
        profile_img
      )
    `
      )
      .order("created_at");

    if (!error && data) {
      const agrupadas: { [key: string]: Comentario[] } = {};

      data.forEach((resposta) => {
        const perguntaId = resposta.faq_questions_id;
        if (!agrupadas[perguntaId]) {
          agrupadas[perguntaId] = [];
        }
        agrupadas[perguntaId].push(resposta);
      });

      setRespostasListadas(agrupadas);
    }
  }, [supabase]);

  async function enviarResposta(questionId: string) {
    const resposta = respostas[questionId];
    if (!resposta?.trim()) return;

    const { error } = await supabase.from("faq_answers").insert({
      faq_questions_id: questionId,
      user_id: user?.id,
      content: resposta,
    });

    if (!error) {
      setRespostas((prev) => ({ ...prev, [questionId]: "" }));
      fetchAllAnswers();
      toast.success("Resposta enviada com sucesso!");
    } else {
      toast.error("Erro ao enviar resposta.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!description.trim()) {
      setErrorMsg("Preencha todos os campos");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("faq_questions").insert({
        description,
        user_id: user!.id,
        product_id: productId,
      });

      if (error) {
        const detalhe = error.details || error.message || JSON.stringify(error);
        setErrorMsg(`Erro ao enviar pergunta: ${detalhe}`);
      } else {
        setDescription("");
        fetchQuestions();
        toast("Pergunta enviada com sucesso!");
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      setErrorMsg("Erro inesperado ao enviar pergunta. Tente novamente.");
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchQuestions().then(() => {
      fetchAllAnswers();
    });
  }, [fetchQuestions, fetchAllAnswers, currentPage]);

  async function handleQuestionVote(
    questionId: string,
    voteType: "like" | "dislike"
  ) {
    if (!user) return;

    const question = questions.find((q) => q.id === questionId);
    const existingVote = question?.userVote;

    if (existingVote === voteType) {
      await supabase
        .from("faq_questions_votes")
        .delete()
        .eq("question_id", questionId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("faq_questions_votes").upsert(
        {
          question_id: questionId,
          user_id: user.id,
          vote_type: voteType,
        },
        { onConflict: "question_id,user_id" }
      );
    }

    setAnimatedVote((prev) => ({ ...prev, [questionId]: voteType }));
    setTimeout(() => {
      setAnimatedVote((prev) => ({ ...prev, [questionId]: null }));
    }, 400);

    fetchQuestions();
  }

  async function handleDeleteQuestion(questionId: string) {
    const { error } = await supabase
      .from("faq_questions")
      .delete()
      .eq("id", questionId)
      .eq("user_id", user?.id);

    if (!error) {
      toast.success("Pergunta deletada com sucesso!");
      fetchQuestions();
    } else {
      toast.error("Erro ao deletar pergunta.");
    }
  }

  const userAdapted = user
    ? {
        id: user.id,
        name: user.user_metadata?.name || user.email || "Usuário",
        profile_img: user.user_metadata?.profile_img || "",
        email: user.email || "",
        badges: user.user_metadata?.badges || [],
        created_at: user.created_at || "",
        points: user.user_metadata?.points || 0,
        review_count: user.user_metadata?.review_count || 0,
      }
    : null;

  async function handleDeleteAnswer(answerId: string) {
    const { error } = await supabase
      .from("faq_answers")
      .delete()
      .eq("id", answerId)
      .eq("user_id", user?.id);

    if (error) {
      toast.error("Erro ao deletar resposta.");
      console.error(error);
    } else {
      toast.success("Resposta deletada com sucesso!");
      fetchAllAnswers();
    }
  }

  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold mb-1 text-[#010b62] dark:text-white">
            Dúvidas
          </h3>
          <span className="text-[#010b62]/50 dark:text-white/50 text-sm sm:text-base">
            Observe e interaja com as dúvidas de nossa comunidade
          </span>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#010b62] text-white hover:bg-[#019ACF] dark:text-white dark:bg-[#01BAEF] w-full sm:w-auto">
              Fazer uma pergunta
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg">
            {!user ? (
              <>
                <DialogHeader>
                  <DialogTitle className="sr-only">
                    Login necessário
                  </DialogTitle>
                </DialogHeader>
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
                    className="bg-[#010b62] hover:bg-[#019ACF] dark:bg-[#01BAEF] dark:hover:bg-[#019ACF] dark:text-white w-full sm:w-auto"
                  >
                    Ir para login
                  </Button>
                </div>
              </>
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#010b62] dark:text-white">
                      Descrição
                    </label>
                    <Textarea
                      placeholder="Explique melhor sua dúvida para ajudar outros a responderem."
                      className="mt-1 w-full"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-red-500 text-sm">{errorMsg}</p>
                  )}

                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#010b62] hover:bg-[#019ACF] dark:bg-[#01BAEF] dark:hover:bg-[#019ACF] dark:text-white w-full sm:w-auto"
                    >
                      {loading ? "Enviando..." : "Publicar pergunta"}
                    </Button>
                  </DialogFooter>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {questions.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          Nenhuma pergunta ainda. Seja o primeiro a perguntar!
        </p>
      )}

      <div className="flex flex-col gap-4">
        {questions.map((q) => (
          <FAQQuestionCard
            key={q.id}
            q={q}
            user={userAdapted}
            respostasListadas={respostasListadas}
            respostas={respostas}
            setRespostas={setRespostas}
            mostrarRespostas={mostrarRespostas}
            setMostrarRespostas={setMostrarRespostas}
            openDialogId={openDialogId}
            setOpenDialogId={setOpenDialogId}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            handleDeleteQuestion={handleDeleteQuestion}
            handleQuestionVote={handleQuestionVote}
            animatedVote={animatedVote}
            enviarResposta={enviarResposta}
            handleDeleteAnswer={handleDeleteAnswer}
          />
        ))}
      </div>

      {totalPages > 0 && (
        <div className="flex justify-center mt-4 sm:justify-start">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
