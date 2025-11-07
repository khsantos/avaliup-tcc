import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPassword from "@/src/app/(auth)/forgot-password/page";

jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (window as any).location;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).location = { origin: "http://localhost" };

// Ignora validação nativa do input type="email"
beforeAll(() => {
  jest
    .spyOn(HTMLFormElement.prototype, "checkValidity")
    .mockImplementation(() => true);
});

describe("Tela de Recuperação de Senha", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Caso 1: Envio de e-mail com sucesso", async () => {
    (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "usuario@teste.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() =>
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalled()
    );

    expect(toast.success).toHaveBeenCalledWith(
      "Verifique seu e-mail para redefinir a senha!"
    );
  });

  test("Caso 2: Erro ao enviar o e-mail (falha do Supabase)", async () => {
    (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValueOnce({
      error: { message: "E-mail não encontrado" },
    });

    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "naoexiste@teste.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao enviar e-mail de recuperação"
      )
    );
  });

  test("Caso 3: E-mail inválido no formulário", async () => {
    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "emailinvalido" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("E-mail inválido.")
    );

    expect(supabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
  });
});
