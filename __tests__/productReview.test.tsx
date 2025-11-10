import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReviewForm from "@/src/components/CreateReviewForm";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
import ProductReviewView from "@/src/components/ProductReview";
import { Product } from "@/src/types/Product";

let originalConsoleError: typeof console.error;

beforeAll(() => {
  originalConsoleError = console.error;
  jest.spyOn(console, "error").mockImplementation((...args: any[]) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (msg.includes("Received `true` for a non-boolean attribute `jsx`")) {
      return;
    }

    originalConsoleError.apply(console, args);
  });
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
  console.error = originalConsoleError;
});

// Mock do context de Supabase (useSupabase)
jest.mock("@/src/contexts/supabase-provider", () => ({
  useSupabase: () => ({
    supabase: {
      from: jest.fn(() => ({
        insert: jest.fn().mockResolvedValue({ data: {}, error: null }),
      })),
    },
    session: { user: { id: "user-123" } },
    user: { id: "user-123" },
    loading: false,
  }),
}));

// Mock do Supabase (lib)
jest.mock("@/src/lib/supabase", () => {
  return {
    supabase: {
      from: jest.fn((table: string) => {
        // objeto base com métodos usados por select/eq/single
        const baseQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          // single usado em fetchUpdatedProduct ou quando encadeado
          single: jest.fn().mockResolvedValue({
            data: table === "reviews" ? { id: 1 } : {},
            error: null,
          }),
        };

        return {
          // insert deve se comportar diferente por tabela:
          insert: jest.fn().mockImplementation((/*_data*/) => {
            if (table === "reviews") {
              // para reviews o código faz: .insert(...).select("id").single()
              // então retornamos um objeto encadeável com select().single() resolvendo o id
              return {
                select: jest.fn().mockReturnThis(),
                single: jest
                  .fn()
                  .mockResolvedValue({ data: { id: 1 }, error: null }),
              };
            }

            if (table === "review_criteria_rating") {
              // para critérios o código faz apenas .insert(...) e espera { error: ... }
              return Promise.resolve({ data: {}, error: null });
            }

            if (table === "products") {
              // caso raro de insert em products (não usado), apenas devolve sucesso
              return Promise.resolve({ data: {}, error: null });
            }

            // fallback
            return Promise.resolve({ data: {}, error: null });
          }),
          // manter select/eq/single para chamadas que usam esse encadeamento
          select: baseQuery.select,
          eq: baseQuery.eq,
          single: baseQuery.single,
        };
      }),
      auth: { getUser: jest.fn() },
    },
  };
});

// Mock do toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockProduct = {
  id: 1,
  name: "Mouse Gamer XYZ",
  slug: "mouse-gamer-xyz",
  image_url: "/mouse.jpg",
  image: "/mouse.jpg",
};

const mockSetShowForm = jest.fn();
const mockSetSelectedThumb = jest.fn();

const mockProductForReviewView = {
  id: 1,
  name: "Mouse Gamer XYZ",
  slug: "mouse-gamer-xyz",
  image_url: "/mouse.jpg",
  image: "/mouse.jpg",
  images: [],
  rating: 4.5,
  review_count: 10,
  rank: 1,
  category: "mouse",
} as unknown as Product;

describe("Tela de Avaliação de Produto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Caso 1: Avaliação com todos os campos preenchidos corretamente", async () => {
    render(<ReviewForm product={mockProduct} />);

    fireEvent.change(screen.getByLabelText(/título da avaliação/i), {
      target: { value: "Teclado ótimo para digitar" },
    });
    fireEvent.change(screen.getByLabelText(/descrição da avaliação/i), {
      target: { value: "O produto é excelente, teclas macias e silenciosas." },
    });
    fireEvent.change(screen.getByLabelText(/loja \/ site da compra/i), {
      target: { value: "Amazon" },
    });
    fireEvent.change(screen.getByLabelText(/valor pago/i), {
      target: { value: 300 },
    });
    fireEvent.change(screen.getByLabelText(/tempo de uso/i), {
      target: { value: "3 meses" },
    });

    // agora que cada estrela tem data-testid="star-icon", pegamos todas:
    const stars = screen.getAllByTestId("star-icon");
    // clica na 5ª estrela de cada categoria (assumindo que as 25 estrelas estejam em ordem)
    [4, 9, 14, 19, 24].forEach((i) => fireEvent.click(stars[i]));

    fireEvent.click(screen.getByRole("button", { name: /enviar avaliação/i }));

    // aguarda o sucesso exibido via toast (seu componente chama toast.success)
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Avaliação enviada com sucesso!"
      );
    });

    // e checar se o supabase foi chamado para inserir review (opcional)
    expect(supabase.from).toHaveBeenCalled();
  });

  test("Caso 2: Avaliação sem preencher o título", async () => {
    render(<ReviewForm product={mockProduct} />);

    fireEvent.change(screen.getByLabelText(/descrição da avaliação/i), {
      target: { value: "Produto bom e resistente" },
    });
    fireEvent.change(screen.getByLabelText(/loja \/ site da compra/i), {
      target: { value: "Kabum" },
    });
    fireEvent.change(screen.getByLabelText(/valor pago/i), {
      target: { value: 300 },
    });
    fireEvent.change(screen.getByLabelText(/tempo de uso/i), {
      target: { value: "3 meses" },
    });

    // clica numa estrela (não necessário, mas ok):
    const stars = screen.getAllByTestId("star-icon");
    fireEvent.click(stars[3]);

    fireEvent.click(screen.getByRole("button", { name: /enviar avaliação/i }));

    // verifique a mensagem de erro renderizada no DOM (não toast)
    await waitFor(() => {
      expect(screen.getByText("O título é obrigatório.")).toBeInTheDocument();
    });

    expect(supabase.from).not.toHaveBeenCalled();
  });

  test("Caso 3: Avaliação sem descrição", async () => {
    render(<ReviewForm product={mockProduct} />);

    fireEvent.change(screen.getByLabelText(/título da avaliação/i), {
      target: { value: "Mouse leve e ergonômico" },
    });
    fireEvent.change(screen.getByLabelText(/loja \/ site da compra/i), {
      target: { value: "Pichau" },
    });
    const stars = screen.getAllByTestId("star-icon");
    fireEvent.click(stars[2]);
    fireEvent.click(screen.getByRole("button", { name: /enviar avaliação/i }));

    await waitFor(() => {
      expect(
        screen.getByText("A descrição é obrigatória.")
      ).toBeInTheDocument();
    });

    expect(supabase.from).not.toHaveBeenCalled();
  });

  test("Caso 4: Avaliação sem nota do produto", async () => {
    render(<ReviewForm product={mockProduct} />);

    fireEvent.change(screen.getByLabelText(/título da avaliação/i), {
      target: { value: "Headset confortável" },
    });
    fireEvent.change(screen.getByLabelText(/descrição da avaliação/i), {
      target: { value: "Som limpo, microfone de boa qualidade." },
    });
    fireEvent.change(screen.getByLabelText(/loja \/ site da compra/i), {
      target: { value: "TerabyteShop" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar avaliação/i }));

    await waitFor(() => {
      // mensagem que seu código define para ratings:
      expect(
        screen.getByText("Avalie todos os critérios para enviar.")
      ).toBeInTheDocument();
    });

    expect(supabase.from).not.toHaveBeenCalled();
  });

  test("Caso 5: Avaliação com caracteres inválidos", async () => {
    render(<ReviewForm product={mockProduct} />);

    fireEvent.change(screen.getByLabelText(/título da avaliação/i), {
      target: { value: "😍🔥💥" },
    });
    fireEvent.change(screen.getByLabelText(/descrição da avaliação/i), {
      target: { value: "Produto 💩 muito ruim!!!" },
    });
    fireEvent.change(screen.getByLabelText(/loja \/ site da compra/i), {
      target: { value: "Amazon" },
    });
    const stars = screen.getAllByTestId("star-icon");
    fireEvent.click(stars[1]);
    fireEvent.click(screen.getByRole("button", { name: /enviar avaliação/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Título inválido ou muito longo (máx. 100 caracteres)."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Descrição inválida ou muito longa (máx. 5000 caracteres)."
        )
      ).toBeInTheDocument();
    });

    expect(supabase.from).not.toHaveBeenCalled();
  });

  test("Caso 6: Acessar a página do produto (botão Voltar)", async () => {
    render(
      <ProductReviewView
        product={mockProductForReviewView}
        selectedThumb={0}
        setSelectedThumb={mockSetSelectedThumb}
        setShowForm={mockSetShowForm}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));

    expect(mockSetShowForm).toHaveBeenCalledWith(false);
  });
});
