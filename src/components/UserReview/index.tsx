"use client";

import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { useState } from "react";

interface UserReview {
  id: string;
  title: string;
  text: string;
  userName: string;
  userAvatar?: string;
  timeOfUse: string;
  pricePaid: string;
  rating: number;
  likes: number;
  dislikes: number;
  comments: number;
  badges: string[];
}

export default function UserReviews() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const defaultReview: UserReview = {
    id: "1",
    title: "Excelente mouse para gaming",
    text: "Estou usando há 6 meses e posso dizer que é um dos melhores mouses que já tive. A precisão é incrível, o design é ergonômico e a bateria dura bastante. Recomendo para quem busca qualidade e custo-benefício. O sensor é muito responsivo e não tive problemas de conectividade.",
    userName: "João Silva",
    userAvatar: "/placeholder.svg?height=40&width=40",
    timeOfUse: "6 meses de uso",
    pricePaid: "R$320,00",
    rating: 4,
    likes: 12,
    dislikes: 1,
    comments: 3,
    badges: ["Top Reviewer", "Compra Verificada", "Frequent Buyer"],
  };

  const secondReview: UserReview = {
    id: "2",
    title: "Bom custo-benefício",
    text: "O mouse é leve e preciso, mas achei o cabo um pouco rígido. No geral, vale a pena pelo preço.",
    userName: "Maria Souza",
    userAvatar: "/placeholder.svg?height=40&width=40",
    timeOfUse: "3 meses de uso",
    pricePaid: "R$280,00",
    rating: 5,
    likes: 8,
    dislikes: 0,
    comments: 1,
    badges: ["Compra Verificada"],
  };

  const reviewsToShow = [defaultReview, secondReview];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "fill-[#FFB24B] text-[#FFB24B]"
            : "text-[#FFB24B] fill-none"
        }`}
      />
    ));
  };

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-bold text-[#010b62] dark:text-white mt-6">
          Avaliações dos usuários
        </h2>
        <div className="flex gap-6">
          {/* Ordenar */}
          <div className="flex flex-col">
            <label className="text-[#010b62] flex items-center gap-1 dark:text-white">
              Ordenar
              <span className="inline-flex">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7 15V5M7 5L4 8M7 5L10 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 5V15M13 15L16 12M13 15L10 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </label>
            <div className="relative">
              <select className="w-48 px-4 py-2 border border-[#010b62]/50 dark:border-[#FFFFFF]/50 rounded-[4px] text-[#64748b] bg-white dark:bg-[#030712] focus:outline-none hover:border-[#010b62] transition-colors appearance-none">
                <option>Mais recentes</option>
                <option>Mais úteis</option>
                <option>Maior nota</option>
                <option>Menor nota</option>
              </select>
            </div>
          </div>

          {/* Filtrar por */}
          <div className="flex flex-col">
            <label className="text-[#010b62] dark:text-white ">
              Filtrar por
            </label>
            <div className="relative">
              <select className="w-48 px-4 py-2 border border-[#010b62]/50 rounded-[4px] dark:border-[#FFFFFF]/50 text-[#64748b] bg-white dark:bg-[#030712] focus:outline-none hover:border-[#010b62] transition-colors appearance-none">
                <option>Todos</option>
                <option>5 estrelas</option>
                <option>4 estrelas</option>
                <option>3 estrelas</option>
                <option>2 estrelas</option>
                <option>1 estrela</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="#64748b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {reviewsToShow.length > 0 ? (
          reviewsToShow.map((review) => {
            const isExpanded = expandedIds.includes(review.id);
            return (
              <Card
                key={review.id}
                className="shadow-lg hover:shadow-2xl transition-transform hover:scale-102 dark:bg-[#030712] border border-[#010b62] dark:border-[#ffffff]/20 rounded-sm text-white"
              >
                <CardContent className="p-4">
                  {/* Header: Avatar + Info + Rating */}
                  <div className="flex justify-between items-start mb-2 ">
                    <div className="flex items-center gap-3 ">
                      <Avatar className="w-10 h-10 border-[#010b62]  text-[#010b62] dark:text-[#01BAEF]/70 border dark:border-[#01BAEF]/70">
                        <AvatarImage
                          src={review.userAvatar || "/placeholder.svg"}
                          alt={review.userName}
                        />
                        <AvatarFallback className="dark:bg-[#030712] bg-[#D9D9D9] border border-[#010b62] dark:border-none">
                          {review.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-[#010b62] dark:text-white">
                            {review.userName}
                          </span>
                          <span className="text-xs text-[#010b62]/50 dark:text-gray-400">
                            Avaliado em 28/08/2024
                          </span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {review.badges.slice(0, 3).map((badge, i) => (
                            <span
                              key={i}
                              className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#010b62] text-sm font-bold border border-[#010b62]/50"
                            >
                              🏅
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[#FFB24B] -mt-2">
                          {review.rating}
                        </span>
                        <div className="flex gap-1 text-[FFB24B] -mt-2">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="-mt-2 dark:bg-[#01BAEF] bg-[#010b62] hover:bg-[#010b62]/70 text-white text-sm rounded-se-lg px-2 dark:over:bg-[#0096c7] transition"
                      >
                        Ver Detalhes
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 16 16"
                          className="inline ml-1"
                        >
                          <path
                            d="M5 8h6M9 6l2 2-2 2"
                            stroke="#fff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  {/* Extra info */}
                  <div className="dark:text-[#00b6f3] text-gray-500 text-sm mb-2">
                    Tempo de uso: {review.timeOfUse} | Valor pago:{" "}
                    {review.pricePaid} | Loja: Aliexpress
                  </div>

                  {/* Título */}
                  <div className="font-bold text-lg mb-1 text-[#010b62] dark:text-white">
                    {review.title}
                  </div>

                  {/* Texto e imagens lado a lado */}
                  <div className="flex justify-between gap-4 mb-2">
                    {/* Texto cortado com fade */}
                    <div className="flex-1 relative">
                      <p
                        className={`dark:text-white text-[#010b62] text-base text-justify leading-snug whitespace-pre-line pr-4 ${
                          isExpanded ? "" : "line-clamp-[4]"
                        }`}
                      >
                        {review.text}
                      </p>

                      {/* Efeito de fade */}
                      {!isExpanded && (
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#ffffff] dark:from-[#030712] to-transparent pointer-events-none" />
                      )}
                    </div>

                    {/* Bloco de imagens sempre visível */}
                    <div className="w-20 shrink-0 flex items-center justify-center">
                      <div className="bg-gray-500 dark:bg-[#64748b] bg-opacity-30 rounded-lg w-20 h-20 flex items-center justify-center text-2xl text-white font-semibold">
                        +3
                      </div>
                    </div>
                  </div>

                  {/* Botão Ver mais / Ver menos */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="dark:text-[#00b6f3] text-[#010b62] hover:text-[#010b62]/70 dark:hover:text-white p-0 h-auto"
                    onClick={() => handleToggleExpand(review.id)}
                  >
                    {isExpanded ? "Ver menos" : "Ver mais"}
                  </Button>

                  {/* Ações */}
                  <div className="flex items-center gap-6 mt-2">
                    <span className="flex items-center gap-1 text-[#010b62]/50 dark:text-[#b6c2cd] text-base">
                      <ThumbsUp className="w-5 h-5" />
                      {review.likes}
                    </span>
                    <span className="flex items-center gap-1 text-[#010b62]/50 dark:text-[#b6c2cd] text-base">
                      <ThumbsDown className="w-5 h-5" />
                      {review.dislikes}
                    </span>
                    <span className="flex items-center gap-1 text-[#010b62]/50 dark:text-[#b6c2cd] text-base">
                      <MessageCircle className="w-5 h-5" />
                      {review.comments}
                    </span>
                    <span className="ml-auto text-[#010b62]/50 dark:text-[#b6c2cd]">
                      <MoreVertical className="w-5 h-5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-6 col-span-2">
            <p className="text-gray-500">
              Nenhuma avaliação encontrada. Seja o primeiro a avaliar!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
