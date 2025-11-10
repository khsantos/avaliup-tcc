/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReviewCard } from "@/src/components/ReviewCard";

// Mock ReviewComments para não depender de hooks e supabase
jest.mock("@/src/components/ReviewComments", () => ({
  ReviewComments: ({ reviewId, onCommentAdded }: any) => (
    <div data-testid="review-comments">Comments for {reviewId}</div>
  ),
}));

// Mock ReviewOptions para não depender de useSupabase
jest.mock("@/src/components/ReviewOptions", () => ({
  ReviewOptions: () => <div data-testid="review-options">Options</div>,
}));

// Mock RatingAndButton / AchievementBadges / Avatar subcomponents if needed
jest.mock("@/src/components/RatingAndButton", () => (props: any) => (
  <div data-testid="rating-button">RatingBtn</div>
));
jest.mock("@/src/components/AchievementsBadges", () => ({
  AchievementBadges: () => <span />,
}));

const baseReview = {
  id: "r-1",
  title: "Título Legal",
  text: "Texto do review que é suficientemente longo para testar o ver mais/menos.",
  time_of_use: "3 meses",
  price_paid: "R$100,00",
  rating: 4,
  rating_performance: 4,
  rating_cost_benefit: 4,
  rating_comfort: 4,
  rating_weight: 1,
  rating_durability: 4,
  likes: 1,
  dislikes: 0,
  comments: 2,
  user_profile_img: "/img.png",
  user_name: "Usuário Teste",
  users_id: "user-1",
  created_at: new Date().toISOString(),
};

describe("ReviewCard component", () => {
  test("renderiza título, texto e ações; clicar em curtir chama onVote", () => {
    const onVote = jest.fn();
    const onOpenDetails = jest.fn();
    const setReviews = jest.fn();

    render(
      <ReviewCard
        review={baseReview as any}
        onOpenDetails={onOpenDetails}
        onVote={onVote}
        setReviews={setReviews}
      />
    );

    // verifica título e texto
    expect(screen.getByText("Título Legal")).toBeInTheDocument();
    expect(screen.getByText("Usuário Teste")).toBeInTheDocument();

    // clicar em curtir -> acha o botão ThumbsUp dentro do ReviewActions (a interface textual pode não existir; vamos obter por role/button text)
    const likeButton = screen.getByText(baseReview.likes.toString());
    fireEvent.click(likeButton);
    expect(onVote).toHaveBeenCalledWith(baseReview.id, "like");

    // clicar em comentar -> deve abrir ReviewComments via toggle (o ReviewCard renderiza ReviewComments somente se showComments true)
    const commentsButton = screen.getByText(baseReview.comments.toString());
    fireEvent.click(commentsButton);
    // Após clicar, o componente passa a renderizar ReviewComments mockada (com data-testid)
    expect(screen.queryByTestId("review-comments")).toBeInTheDocument();
  });
});
