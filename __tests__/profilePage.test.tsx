import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSupabase } from "@/src/contexts/supabase-provider";
import Page from "@/src/app/(website)/profile-general/page";
import { supabase } from "@/src/lib/supabase";

jest.mock("@/src/components/ProfileOwnReviews", () => ({
  __esModule: true,
  default: () => <div data-testid="profile-reviews">Minhas avaliações</div>,
}));

jest.mock("@/src/components/ProfileUserActivity", () => ({
  __esModule: true,
  default: () => <div>avaliações com interações</div>,
}));

jest.mock("@/src/components/ProfileFavorites", () => ({
  __esModule: true,
  default: () => <div>produtos favoritados</div>,
}));

jest.mock("@/src/contexts/supabase-provider", () => ({
  useSupabase: jest.fn(),
}));

jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

describe("Tela de Perfil do Usuário", () => {
  const mockUser = {
    id: "user-123",
    name: "Julia Benjamin",
    email: "julia@example.com",
    profile_img: "/julia-avatar.png",
    upvotes: 8632,
    review_count: 247,
  };

  beforeEach(() => {
    (useSupabase as jest.Mock).mockReturnValue({
      user: { id: mockUser.id },
      loading: false,
      supabase: {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: mockUser.id } },
            error: null,
          }),
        },
      },
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockUser,
        error: null,
      }),
    });
  });

  // 🧩 Caso 1: Exibição das Informações Pessoais
  test("Caso 1: Exibição das Informações Pessoais", async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText("Julia Benjamin")).toBeInTheDocument();
    });

    const profileImage = screen.getByAltText("Foto de perfil");
    expect(profileImage).toHaveAttribute(
      "src",
      expect.stringContaining("julia-avatar.png")
    );
  });

  // 🧩 Caso 2: Exibição das Estatísticas do Usuário
  test("Caso 2: Exibição das Estatísticas do Usuário", async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText("Upvotes")).toBeInTheDocument();
    });

    expect(screen.getByText("8632")).toBeInTheDocument();
    expect(screen.getByText("247")).toBeInTheDocument();
  });

  // 🧩 Caso 3: Navegação pelas Avaliações do Usuário
  test("Caso 3: Navegação pelas Avaliações do Usuário", async () => {
    render(<Page />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Minhas avaliações" })
      ).toHaveClass("border-b-4");
    });

    const reviewSection = screen.getByTestId("profile-reviews");
    expect(reviewSection).toBeInTheDocument();
  });

  // 🧩 Caso 4: Navegação de avaliações com interações
  test("Caso 4: Navegação de avaliações com interações", async () => {
    render(<Page />);

    const interactionsTab = await screen.findByRole("button", {
      name: "Interações",
    });
    fireEvent.click(interactionsTab);

    await waitFor(() => {
      expect(
        screen.getByText(/avaliações com interações/i)
      ).toBeInTheDocument();
    });
  });

  // 🧩 Caso 5: Navegação de favoritos
  test("Caso 5: Navegação de favoritos", async () => {
    render(<Page />);

    const favoritesTab = await screen.findByRole("button", {
      name: "Favoritos",
    });
    fireEvent.click(favoritesTab);

    await waitFor(() => {
      expect(screen.getByText(/produtos favoritados/i)).toBeInTheDocument();
    });
  });

  // 🧩 Caso 6: Navegação para Editar Perfil
  test("Caso 6: Navegação para Editar Perfil", async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText("Editar Perfil")).toBeInTheDocument();
    });

    const editButton = screen.getByText("Editar Perfil");
    expect(editButton.closest("a")).toHaveAttribute("href", "/profile-edit");
  });
});
