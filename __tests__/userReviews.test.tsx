/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { supabase } from "@/src/lib/supabase";
import UserReviews from "@/src/components/UserReview"; // mantenha seu path real

// Mock global do módulo supabase
jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest
        .fn()
        .mockResolvedValue({ data: { user: { id: "user-1" } } }),
    },
  },
}));

// Mock do toast
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

// Mock do ReviewCard (recebe o review já mapeado => review.user_name)
jest.mock("@/src/components/ReviewCard", () => ({
  ReviewCard: ({ review, onVote, onOpenDetails }: any) => (
    <div data-testid="review-card">
      <span data-testid="review-card-name">{review.user_name}</span>
      <span data-testid="review-card-text">{review.text}</span>
      <button
        data-testid="review-like"
        onClick={() => onVote(review.id, "like")}
      >
        Curtir
      </button>
      <button
        data-testid="review-dislike"
        onClick={() => onVote(review.id, "dislike")}
      >
        Dislike
      </button>
      <button
        data-testid="review-comments"
        onClick={() => onOpenDetails(review)}
      >
        Comentários
      </button>
      <button data-testid="review-share">Compartilhar</button>
    </div>
  ),
}));

// Mock do modal de detalhes (com displayName para suprimir aviso do ESLint)
jest.mock("@/src/components/UserReviewDetails", () => {
  const MockUserReviewDetails = (props: any) =>
    props.open ? (
      <div data-testid="review-details-modal">Modal: {props.review?.title}</div>
    ) : null;
  MockUserReviewDetails.displayName = "MockUserReviewDetails";
  return MockUserReviewDetails;
});

// Estado global simulado
let mockReviewsForCall: any[] = [];
let mockTotalCount = 0;
const fromCalls: string[] = [];

/**
 * createQuery agora:
 * - mantém uma cópia de mockReviewsForCall (filteredData)
 * - permite encadear gte/lt e depois ser awaited quando select(..., { head: true }) é usado
 * - range() retorna os dados filtrados
 */
function createQuery() {
  // Começamos com cópia dos dados brutos
  let filteredData = [...mockReviewsForCall];

  // flags para select head e se houve filtro
  let isHeadSelect = false;
  let hadFilter = false;

  const api: any = {
    select(arg1?: any, arg2?: any) {
      if (arg2 && arg2.head) {
        isHeadSelect = true;
        return api;
      }
      return api;
    },
    eq() {
      // eq aqui não altera filteredData (produto já simulado nos testes)
      return api;
    },
    gte(field: string, value: number) {
      hadFilter = true;
      filteredData = filteredData.filter((r) => {
        const v = r[field];
        return typeof v === "number" ? v >= value : false;
      });
      return api;
    },
    lt(field: string, value: number) {
      hadFilter = true;
      filteredData = filteredData.filter((r) => {
        const v = r[field];
        return typeof v === "number" ? v < value : false;
      });
      return api;
    },
    order() {
      // ordenação não implementada no mock (os testes trocam mockReviewsForCall quando necessário)
      return api;
    },
    range() {
      // retorna os dados filtrados (página já simulada via mockReviewsForCall no teste)
      return Promise.resolve({ data: filteredData, error: null });
    },
    insert() {
      return Promise.resolve({ data: [], error: null });
    },
    update() {
      return Promise.resolve({ data: [], error: null });
    },
    delete() {
      return Promise.resolve({ data: [], error: null });
    },
    // permitir await/then quando select(..., { head: true }) for usado
    then(onFulfilled: any, onRejected: any) {
      if (!isHeadSelect) {
        return Promise.resolve({ count: mockTotalCount }).then(
          onFulfilled,
          onRejected
        );
      }
      // se houve filtro, devolve a contagem dos dados filtrados; caso contrário devolve mockTotalCount
      const countToReturn = hadFilter ? filteredData.length : mockTotalCount;
      return Promise.resolve({ count: countToReturn }).then(
        onFulfilled,
        onRejected
      );
    },
  };

  return api;
}

// Implementação mock do supabase.from
(supabase.from as jest.Mock).mockImplementation((table: string) => {
  fromCalls.push(table);
  return createQuery();
});

describe("UserReviews - Tela de avaliações", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fromCalls.length = 0;
    mockReviewsForCall = [];
    mockTotalCount = 0;
    // garante que auth.getUser continua resolvendo
    ((supabase as any).auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
  });

  test("Caso 1: Visualizar avaliações (lista aparece com nome, nota e comentário)", async () => {
    mockTotalCount = 2;
    mockReviewsForCall = [
      {
        id: "r1",
        users: { name: "João", profile_img: "/img1.png" },
        text: "Ótimo!",
        rating: 5,
      },
      {
        id: "r2",
        users: { name: "Maria", profile_img: "/img2.png" },
        text: "Bom",
        rating: 4,
      },
    ];

    render(<UserReviews productId={1} />);

    expect(await screen.findByText("João")).toBeInTheDocument();
    expect(screen.getByText("Ótimo!")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
  });

  test("Caso 2: Ordenar avaliações (trocar select de ordenação e refazer a busca)", async () => {
    mockTotalCount = 2;
    mockReviewsForCall = [
      { id: "r1", users: { name: "A" }, text: "first", rating: 5 },
      { id: "r2", users: { name: "B" }, text: "second", rating: 4 },
    ];

    render(<UserReviews productId={1} />);

    const namesBefore = await screen.findAllByTestId("review-card-name");
    expect(namesBefore.map((n) => n.textContent)).toEqual(["A", "B"]);

    // Simula nova resposta do backend ordenada de forma diferente
    mockReviewsForCall = [
      { id: "r2", users: { name: "B" }, text: "second", rating: 5 },
      { id: "r1", users: { name: "A" }, text: "first", rating: 1 },
    ];

    const orderSelect = screen.getByLabelText(/ordenar/i);
    fireEvent.change(orderSelect, { target: { value: "high" } });

    await waitFor(async () => {
      const namesAfter = (await screen.findAllByTestId("review-card-name")).map(
        (n) => n.textContent
      );
      expect(namesAfter).toEqual(["B", "A"]);
    });
  });

  test("Caso 3: Filtrar avaliações (aplicar filtro de 5 estrelas)", async () => {
    mockTotalCount = 3;
    mockReviewsForCall = [
      { id: "r1", users: { name: "X" }, text: "1", rating: 5 },
      { id: "r2", users: { name: "Y" }, text: "2", rating: 4 },
      { id: "r3", users: { name: "Z" }, text: "3", rating: 5 },
    ];

    render(<UserReviews productId={1} />);

    expect(await screen.findByText("X")).toBeInTheDocument();
    expect(screen.getByText("Y")).toBeInTheDocument();

    // Ao mudar o select, o componente fará novas queries que passarão por gte/lt
    const filterSelect = screen.getByLabelText(/filtrar por/i);
    fireEvent.change(filterSelect, { target: { value: "5" } });

    await waitFor(async () => {
      const names = (await screen.findAllByTestId("review-card-name")).map(
        (n) => n.textContent
      );
      expect(names).toEqual(["X", "Z"]);
    });
  });

  test("Caso 4: Paginação das avaliações (mudar para página 2)", async () => {
    mockTotalCount = 16; // 8 por página -> 2 páginas
    mockReviewsForCall = Array.from({ length: 8 }).map((_, i) => ({
      id: `p1-${i}`,
      users: { name: `User P1 ${i}` },
      text: `text ${i}`,
    }));

    render(<UserReviews productId={1} />);

    const page2button = await screen.findByRole("button", { name: "2" });
    expect(page2button).toBeInTheDocument();

    // prepara dados da página 2
    mockReviewsForCall = [
      { id: "p2-0", users: { name: "User P2 0" }, text: "p2" },
      { id: "p2-1", users: { name: "User P2 1" }, text: "p2-1" },
    ];

    fireEvent.click(page2button);

    await waitFor(async () => {
      const names = (await screen.findAllByTestId("review-card-name")).map(
        (n) => n.textContent
      );
      expect(names[0]).toBe("User P2 0");
    });
  });

  test("Caso 5: Interação com avaliações (curtir / comentar / compartilhar)", async () => {
    mockTotalCount = 1;
    mockReviewsForCall = [
      {
        id: "vote-1",
        users: { name: "Voter" },
        text: "Vote me",
        rating: 4,
        likes: 0,
        dislikes: 0,
        created_at: new Date().toISOString(),
      },
    ];

    render(<UserReviews productId={1} />);

    await screen.findByText("Voter");

    const likeBtn = screen.getByTestId("review-like");
    fireEvent.click(likeBtn);

    await waitFor(() => {
      expect(fromCalls).toContain("review_votes");
    });

    const commentsBtn = screen.getByTestId("review-comments");
    fireEvent.click(commentsBtn);

    expect(
      await screen.findByTestId("review-details-modal")
    ).toBeInTheDocument();
  });
});
