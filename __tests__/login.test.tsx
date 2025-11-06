import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/src/app/(auth)/signIn/page";
import { supabase } from "@/__mocks__/@/src/lib/supabase";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

describe("Tela de Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Caso 1: Login com credenciais válidas", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: {
        user: { id: "1", email: "teste@email.com" },
        session: { access_token: "token123" },
      },
      error: null,
    });

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "teste@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() =>
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "teste@email.com",
        password: "123456",
      })
    );

    expect(await screen.findByText(/2fa/i)).toBeInTheDocument();
  });

  test("Caso 2: Login com senha incorreta", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: {},
      error: { message: "Invalid login credentials" },
    });

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "teste@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "senhaerrada" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("E-mail ou senha incorretos.")
    );
  });

  test("Caso 3: E-mail inválido", async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "emailinvalido" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    // Validação nativa do input tipo="email"
    const emailInput = screen.getByLabelText(/e-mail/i) as HTMLInputElement;
    expect(emailInput.validity.valid).toBe(false);
  });

  test("Caso 4: Campos vazios", async () => {
    render(<Login />);
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/preencha o e-mail e a senha para continuar/i)
      ).toBeInTheDocument()
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Preencha o e-mail e a senha para continuar."
    );
  });

  test("Caso 5: Redirecionamento 'Esqueceu sua senha?'", async () => {
    render(<Login />);
    const forgotLink = screen.getByRole("link", {
      name: /esqueceu sua senha/i,
    });
    expect(forgotLink).toHaveAttribute("href", "/forgot-password");
  });

  test("Caso 6: Link 'Crie sua conta'", async () => {
    render(<Login />);
    const signUpLink = screen.getByRole("link", { name: /crie sua conta/i });
    expect(signUpLink).toHaveAttribute("href", "/signUp");
  });

  test("Caso 7: Login com Google", async () => {
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    render(<Login />);
    fireEvent.click(screen.getByRole("button", { name: /google/i }));

    await waitFor(() =>
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: { redirectTo: expect.any(String) },
      })
    );
  });

  test("Caso 8: Dialog 2FA é aberto após login válido", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: {
        user: { id: "1", email: "teste@email.com" },
        session: { access_token: "token123" },
      },
      error: null,
    });

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "teste@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => expect(screen.getByText(/2fa/i)).toBeInTheDocument());
  });
});
