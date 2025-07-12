import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";

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
  const defaultReview: UserReview = {
    id: "1",
    title: "Excelente mouse para gaming",
    text: "Estou usando há 6 meses e posso dizer que é um dos melhores mouses que já tive. A precisão é incrível, o design é ergonômico e a bateria dura bastante. Recomendo para quem busca qualidade e custo-benefício. O sensor é muito responsivo e não tive problemas de conectividade.",
    userName: "João Silva",
    userAvatar: "/placeholder.svg?height=40&width=40",
    timeOfUse: "6 meses de uso",
    pricePaid: "R$320,00",
    rating: 5,
    likes: 12,
    dislikes: 1,
    comments: 3,
    badges: ["Top Reviewer", "Compra Verificada"],
  };

  const reviewsToShow = [defaultReview];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#010b62]">
          Avaliações dos usuários
        </h2>
        <div className="flex gap-3">
          <select className="px-3 py-2 border rounded-md text-sm">
            <option>Ordenar: Mais recentes</option>
            <option>Mais úteis</option>
            <option>Maior nota</option>
            <option>Menor nota</option>
          </select>
          <select className="px-3 py-2 border rounded-md text-sm">
            <option>Filtrar por</option>
            <option>5 estrelas</option>
            <option>4 estrelas</option>
            <option>3 estrelas</option>
            <option>2 estrelas</option>
            <option>1 estrela</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {(reviewsToShow ?? []).length > 0 ? (
          reviewsToShow.map((review) => (
            <Card
              key={review.id}
              className="border hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={review.userAvatar || "/placeholder.svg"}
                        alt={review.userName}
                      />
                      <AvatarFallback>
                        {review.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {review.userName}
                        </h4>
                        <div className="flex gap-1">
                          {review.badges.map((badge, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-blue-100 text-blue-800"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{review.timeOfUse}</span>
                        <span>•</span>
                        <span>Pagou {review.pricePaid}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm font-medium">
                      {review.rating}.0
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {review.title}
                  </h3>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {review.text}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.likes}</span>
                    </button>

                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                      <ThumbsDown className="w-4 h-4" />
                      <span>{review.dislikes}</span>
                    </button>

                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                      <MessageCircle className="w-4 h-4" />
                      <span>{review.comments} comentários</span>
                    </button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#010b62] border-[#010b62] hover:bg-[#010b62] hover:text-white bg-transparent"
                  >
                    Ver detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">
              Nenhuma avaliação encontrada. Seja o primeiro a avaliar!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
