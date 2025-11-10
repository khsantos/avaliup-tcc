import { render, screen, waitFor } from "@testing-library/react";
import RankingComponent from "@/src/components/RankingPage";
import { useSupabase } from "@/src/contexts/supabase-provider";
import { useTheme } from "next-themes";

// === MOCKS ===

// Mock do contexto Supabase
jest.mock("@/src/contexts/supabase-provider", () => ({
  useSupabase: jest.fn(),
}));

// Mock do tema (light/dark)
jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "light" })),
}));

// Mock da imagem do Next
jest.mock("next/image", () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt || "image"} />;
});

// Mock da paginação
jest.mock("@/src/components/Pagination", () => ({
  __esModule: true,
  Pagination: ({ currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(currentPage + 1)}>Próxima</button>
      <span>{`Página ${currentPage} de ${totalPages}`}</span>
    </div>
  ),
}));

// === MOCK SETUP ===
const mockFrom = jest.fn(() => ({
  select: jest.fn().mockReturnThis(),
  order: jest.fn().mockResolvedValue({ data: [], error: null }),
}));

const mockSupabase = { from: mockFrom };

describe("RankingComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSupabase as jest.Mock).mockReturnValue({ supabase: mockSupabase });
    (useTheme as jest.Mock).mockReturnValue({ theme: "light" });
  });

  // Caso de Teste 1 — Exibição do Prêmio da Semana
  test("Caso 1: Exibição do Prêmio da Semana", async () => {
    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    });

    render(<RankingComponent />);

    await waitFor(() => {
      expect(screen.getByText(/Ranking/i)).toBeInTheDocument();
    });

    // Banner do prêmio
    const banner = screen.getByRole("img", { name: /banner do prêmio/i });
    expect(banner).toBeInTheDocument();

    // Texto de reset
    expect(screen.getByText(/Próximo reset:/i)).toBeInTheDocument();
  });

  // Caso de Teste 2 — Exibição dos 3 primeiros colocados
  test("Caso 2: Exibição dos 3 Primeiros Colocados", async () => {
    const mockRanking = [
      { id: "1", name: "Usuário Top 1", profile_img: "/u1.png", points: 450 },
      { id: "2", name: "Usuário Top 2", profile_img: "/u2.png", points: 400 },
      { id: "3", name: "Usuário Top 3", profile_img: "/u3.png", points: 350 },
    ];

    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: mockRanking,
        error: null,
      }),
    });

    render(<RankingComponent />);

    await waitFor(() =>
      expect(screen.getByText("Usuário Top 1")).toBeInTheDocument()
    );

    // Confirma que os três aparecem
    expect(screen.getByText("Usuário Top 1")).toBeInTheDocument();
    expect(screen.getByText("Usuário Top 2")).toBeInTheDocument();
    expect(screen.getByText("Usuário Top 3")).toBeInTheDocument();

    // Pontuação visível
    expect(screen.getByText(/450 pontos/)).toBeInTheDocument();
    expect(screen.getByText(/400 pontos/)).toBeInTheDocument();
    expect(screen.getByText(/350 pontos/)).toBeInTheDocument();

    // Posições 1, 2, 3 visíveis
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  // Caso de Teste 3 — Exibição da tabela de ranking completa
  test("Caso 3: Exibição da Tabela de Ranking Completa", async () => {
    const mockRanking = [
      { id: "1", name: "Usuário 1", points: 500 },
      { id: "2", name: "Usuário 2", points: 450 },
      { id: "3", name: "Usuário 3", points: 400 },
      { id: "4", name: "Usuário 4", points: 350 },
      { id: "5", name: "Usuário 5", points: 300 },
    ];

    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: mockRanking,
        error: null,
      }),
    });

    render(<RankingComponent />);

    await waitFor(() => {
      expect(screen.getByText("Usuário 4")).toBeInTheDocument();
    });

    // Cabeçalhos da tabela
    expect(screen.getByText("Rank")).toBeInTheDocument();
    expect(screen.getByText("Foto")).toBeInTheDocument();
    expect(screen.getByText("Usuário")).toBeInTheDocument();
    expect(screen.getByText("Pontos")).toBeInTheDocument();

    // Linhas de usuários além do top 3
    expect(screen.getByText("Usuário 4")).toBeInTheDocument();
    expect(screen.getByText("Usuário 5")).toBeInTheDocument();

    // Paginação deve aparecer
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  // Caso de Teste 4 — Verificação da pontuação dos usuários
  test("Caso 4: Verificação da Pontuação dos Usuários", async () => {
    const mockRanking = [
      { id: "1", name: "Usuário XP", points: 999 },
      { id: "2", name: "Outro Usuário", points: 850 },
      { id: "3", name: "Mais Um", points: 600 },
      { id: "4", name: "Participante", points: 400 },
    ];

    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: mockRanking,
        error: null,
      }),
    });

    render(<RankingComponent />);

    await waitFor(() => {
      expect(screen.getByText("Usuário XP")).toBeInTheDocument();
    });

    // Confirma que a pontuação exibida é igual à do Supabase mockado
    expect(screen.getByText("999 pontos")).toBeInTheDocument();
    expect(screen.getByText("850 pontos")).toBeInTheDocument();
    expect(screen.getByText("600 pontos")).toBeInTheDocument();
  });
});
