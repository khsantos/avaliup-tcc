import { Dispatch, SetStateAction, useCallback } from "react";
import { toast } from "sonner";
import { Comentario } from "@/src/types/Comentario";
import { Question } from "@/src/types/Question";
import { User } from "../types/User";
import { SupabaseClient } from "@supabase/supabase-js";

interface UseFAQActionsProps {
  supabase: SupabaseClient;
  user: User;
  setQuestions: Dispatch<SetStateAction<Question[]>>;
  setRespostasListadas: Dispatch<
    SetStateAction<{ [key: string]: Comentario[] }>
  >;
  setRespostas: Dispatch<SetStateAction<{ [key: string]: string }>>;
  setErrorMsg: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setAnimatedVote: Dispatch<
    SetStateAction<{ [key: string]: "like" | "dislike" | null }>
  >;
  respostas: { [key: string]: string };
  questions: Question[];
}

export function useFAQActions({
  supabase,
  user,
  setQuestions,
  setRespostasListadas,
  setRespostas,
  setErrorMsg,
  setLoading,
  setDescription,
  setAnimatedVote,
  respostas,
  questions,
}: UseFAQActionsProps) {
  const fetchQuestions = useCallback(async () => {
    const { data, error } = await supabase
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
      `
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      const questionsWithVotes = data.map((q: Question) => ({
        ...q,
        likeCount: (q.faq_questions_votes as { vote_type: string }[]).filter(
          (v) => v.vote_type === "like"
        ).length,
        dislikeCount: (q.faq_questions_votes as { vote_type: string }[]).filter(
          (v) => v.vote_type === "dislike"
        ).length,
        userVote: (
          q.faq_questions_votes as {
            vote_type: "like" | "dislike";
            user_id: string;
          }[]
        ).find((v) => v.user_id === user?.id)?.vote_type,
      }));

      setQuestions(questionsWithVotes);
    }
  }, [supabase, user?.id, setQuestions]);

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

      data.forEach((resposta: Comentario) => {
        const perguntaId = resposta.faq_questions_id;
        if (!agrupadas[perguntaId]) {
          agrupadas[perguntaId] = [];
        }
        agrupadas[perguntaId].push(resposta);
      });

      setRespostasListadas(agrupadas);
    }
  }, [supabase, setRespostasListadas]);

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

    if (!respostas.description?.trim()) {
      setErrorMsg("Preencha todos os campos");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("faq_questions").insert({
        description: respostas.description,
        user_id: user!.id,
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

  async function handleQuestionVote(
    questionId: string,
    voteType: "like" | "dislike"
  ) {
    if (!user) return;

    const question = questions.find((q: Question) => q.id === questionId);
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
    const confirmed = confirm("Tem certeza que deseja deletar esta pergunta?");
    if (!confirmed) return;

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

  return {
    fetchQuestions,
    fetchAllAnswers,
    enviarResposta,
    handleSubmit,
    handleQuestionVote,
    handleDeleteQuestion,
  };
}
