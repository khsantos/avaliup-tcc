import { render, screen, waitFor } from "@testing-library/react";
import CategoryPage from "@/src/components/CategoryPage";
import { supabase } from "@/src/lib/supabase";

// Mock do supabase e dos componentes filhos
jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

jest.mock("@/src/components/ProductCarousel", () => ({
  __esModule: true,
  default: ({ products }: any) => (
    <div data-testid="product-carousel">
      {products.map((p: any) => (
        <div key={p.id} data-testid="top-product">
          <span>{p.name}</span>
          <img src={p.image} alt={p.name} />
          <span>★{p.rating}</span>
          <span>Nota Avali.up {p.rating}</span>
          <button>Ver avaliações</button>
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/src/components/ProductCard", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="other-product">
      <span>{props.name}</span>
      <img src={props.image} alt={props.name} />
      <span>★{props.rating}</span>
      <span>Nota Avali.up {props.rating}</span>
      <button>Ver avaliações</button>
    </div>
  ),
}));

jest.mock("@/src/components/Pagination", () => ({
  __esModule: true,
  Pagination: ({ currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(currentPage + 1)}>Próxima</button>
      <span>{`Página ${currentPage} de ${totalPages}`}</span>
    </div>
  ),
}));

// Mock do useRouter para navegação simulada
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("CategoryPage - Mouses Gamers Custo-Benefício", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Caso 1: Exibição dos Top 3 Mouses Gamers", async () => {
    const mockProducts = [
      {
        id: 1,
        name: "Mouse Zaopin-ZZ 4K Hotswappable Wireless",
        image: "/mouse1.png",
        rating: 4.9,
        category: "mouse",
      },
      {
        id: 2,
        name: "Mouse Redragon Cobra",
        image: "/mouse2.png",
        rating: 4.8,
      },
      {
        id: 3,
        name: "Mouse Logitech G Pro",
        image: "/mouse3.png",
        rating: 4.7,
      },
    ];

    (supabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockProducts, error: null }),
    });

    render(<CategoryPage slug="mouses" />);

    await waitFor(() => {
      expect(screen.getByText("Top 10")).toBeInTheDocument();
    });

    const topProducts = screen.getAllByTestId("top-product");
    expect(topProducts).toHaveLength(3);

    expect(
      screen.getByText("Mouse Zaopin-ZZ 4K Hotswappable Wireless")
    ).toBeInTheDocument();

    expect(screen.getByText("★4.9")).toBeInTheDocument();
    expect(screen.getByText("Nota Avali.up 4.9")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /ver avaliações/i })
    ).toHaveLength(3);
  });

  test("Caso 2: Exibição dos Outros Mouses Gamers", async () => {
    const mockProducts = [
      ...Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        name: `Mouse Gamer ${i + 1}`,
        image: `/mouse${i + 1}.png`,
        rating: 4.5,
        category: "mouse",
      })),
    ];

    (supabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockProducts, error: null }),
    });

    render(<CategoryPage slug="mouses" />);

    await waitFor(() =>
      expect(screen.getAllByTestId("top-product")).toHaveLength(10)
    );

    const otherProducts = screen.getAllByTestId("other-product");
    expect(otherProducts.length).toBeGreaterThan(0);
    expect(
      screen.getByText("Outros mouses gamers custo-benefício")
    ).toBeInTheDocument();
  });

  test("Caso 3: Navegação para a página de Avaliações de um Mouse", async () => {
    const mockProducts = [
      { id: 1, name: "Mouse HyperX", image: "/mouse.png", rating: 4.9 },
    ];

    (supabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockProducts, error: null }),
    });

    const { getByText } = render(<CategoryPage slug="mouses" />);

    await waitFor(() => expect(getByText("Mouse HyperX")).toBeInTheDocument());

    const button = screen.getByRole("button", { name: /ver avaliações/i });
    expect(button).toBeInTheDocument();
    // Aqui você pode futuramente mockar o router.push e verificar o redirecionamento
  });

  test("Caso 4: Verificação da Classificação por Estrelas", async () => {
    const mockProducts = [
      {
        id: 1,
        name: "Mouse Redragon Griffin",
        image: "/mouse.png",
        rating: 4.3,
      },
    ];

    (supabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockProducts, error: null }),
    });

    render(<CategoryPage slug="mouses" />);

    await waitFor(() =>
      expect(screen.getByText("Mouse Redragon Griffin")).toBeInTheDocument()
    );

    expect(screen.getByText("★4.3")).toBeInTheDocument();
    expect(screen.getByText("Nota Avali.up 4.3")).toBeInTheDocument();
  });
});
