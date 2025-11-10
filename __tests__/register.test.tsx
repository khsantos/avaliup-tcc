jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "@/src/app/(auth)/signUp/page";
import { supabase } from "@/__mocks__/@/src/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

jest.mock("@/src/lib/supabase");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe("Tela de Cadastro", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // Mock padrão da função supabase.from
    const mockSelect = jest.fn(() => ({
      eq: jest.fn(() => ({
        maybeSingle: jest.fn().mockResolvedValue({ data: null }),
        single: jest.fn().mockResolvedValue({ data: null }),
      })),
    }));

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
      update: jest.fn(() => ({
        eq: jest.fn(() => ({ data: [], error: null })),
      })),
      insert: jest.fn(() => ({ data: [{ id: "123" }], error: null })),
    });
  });

  test("Caso 1: Cadastro com dados válidos", async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: "123", email: "teste@email.com" } },
      error: null,
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    render(<Register />);

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: "usuario123" },
    });
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "teste@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "goldendog972" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "goldendog972" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Conta criada com sucesso! Verifique seu e-mail para ativar a conta."
      )
    );

    expect(pushMock).toHaveBeenCalledWith("/confirmation");
  });

  test("Caso 2: Cadastro com e-mail inválido", async () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: "usuario" },
    });
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "usuario@email" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "senhaSegura123" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "senhaSegura123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Email inválido.")
    );
  });

  test("Caso 3: Cadastro com senhas que não coincidem", async () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: "usuario" },
    });
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "teste@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "senha123" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "senha456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Senhas não coincidem.")
    );
  });

  test("Caso 4: Cadastro com senha fraca", async () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: "usuario" },
    });
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "teste@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "1234" }, // senha curta e com sequência
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Senha muito fraca ou contém sequências comuns."
      )
    );
  });

  test("Caso 5: Cadastro com campos vazios", async () => {
    render(<Register />);
    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Preencha todos os campos.")
    );
  });

  test("Caso 6: Cadastro com nome de usuário já existente", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          maybeSingle: jest.fn().mockResolvedValueOnce({
            data: { id: "456" }, // simula usuário existente
            error: null,
          }),
        })),
      })),
    });

    render(<Register />);

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: "usuarioexistente" },
    });
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "teste@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "goldendog972" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "goldendog972" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Nome de usuário já está em uso."
      )
    );
  });

  test("Caso 7: Cadastro com e-mail já existente", async () => {
    const mockSelect = jest.fn(() => ({
      eq: jest.fn((field) => {
        // Se estiver verificando o nome de usuário = não existe
        if (field === "name") {
          return {
            maybeSingle: jest
              .fn()
              .mockResolvedValueOnce({ data: null, error: null }),
          };
        }
        // Se estiver verificando o e-mail = já existe
        if (field === "email") {
          return {
            maybeSingle: jest.fn().mockResolvedValueOnce({
              data: { id: "999", email: "teste@email.com" },
              error: null,
            }),
          };
        }
      }),
    }));

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    render(<Register />);

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: "novoUsuario" },
    });
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "teste@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "goldendog972" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "goldendog972" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("E-mail já está em uso.")
    );
  });

  test("Caso 8: Link 'Entrar' redireciona para login", async () => {
    render(<Register />);
    const link = screen.getByRole("link", { name: /entrar/i });
    expect(link).toHaveAttribute("href", "/signIn");
  });

  test("Caso 9: Cadastro com Google (placeholder)", async () => {
    // Caso queira adicionar suporte depois, aqui ficará o teste
    expect(true).toBe(true);
  });
});
