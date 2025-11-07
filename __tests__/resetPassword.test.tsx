// __tests__/resetPassword.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPassword from "@/src/app/(auth)/reset-password/page";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Mocks
jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    auth: {
      updateUser: jest.fn(),
      setSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  },
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

beforeAll(() => {
  // apenas define o hash (não redefine window.location)
  window.location.hash = "#access_token=token123&refresh_token=refresh123";
});

describe("Tela de Redefinição de Senha", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // mock do router
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // garantir que setSession resolva com sessão válida
    (supabase.auth.setSession as jest.Mock).mockResolvedValue({
      data: { session: true },
      error: null,
    });

    // mock de onAuthStateChange que chama o callback para sinalizar sessão ativa
    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation(
      (cb: (event: string, session: unknown) => void) => {
        // simulamos que já existe sessão -> chama callback com session truthy
        cb("SIGNED_IN", { user: { id: "u1" } });
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      }
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Caso 1: Inserir senha e confirmar senha corretamente", async () => {
    (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    render(<ResetPassword />);

    fireEvent.change(
      screen.getByLabelText("Nova senha", { selector: "#newPassword" }),
      {
        target: { value: "hdoqwiudhqwoiud872" },
      }
    );
    fireEvent.change(
      screen.getByLabelText("Confirmação da nova senha", {
        selector: "#confirmNewPassword",
      }),
      { target: { value: "hdoqwiudhqwoiud872" } }
    );

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() =>
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: "hdoqwiudhqwoiud872",
      })
    );

    // após sucesso, chamamos signOut, toast e rota
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(
      "Senha redefinida com sucesso! Faça login novamente."
    );
    expect(pushMock).toHaveBeenCalledWith("/signIn");
  });

  test("Caso 2: Senhas não coincidem", async () => {
    render(<ResetPassword />);

    fireEvent.change(
      screen.getByLabelText("Nova senha", { selector: "#newPassword" }),
      {
        target: { value: "hdoqwiudhqwoiud872" },
      }
    );
    fireEvent.change(
      screen.getByLabelText("Confirmação da nova senha", {
        selector: "#confirmNewPassword",
      }),
      {
        target: { value: "hdoqwiudhqwoiud873" },
      }
    );

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("As senhas não coincidem.")
    );
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  test("Caso 3: Inserir nenhuma senha em ambos os campos", async () => {
    render(<ResetPassword />);

    const submitBtn = screen.getByRole("button", { name: /enviar/i });
    const form = submitBtn.closest("form");
    expect(form).toBeTruthy();

    if (form) fireEvent.submit(form);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Preencha ambos os campos de senha."
      )
    );

    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  test("Caso 4: Senha fraca", async () => {
    render(<ResetPassword />);

    fireEvent.change(
      screen.getByLabelText("Nova senha", { selector: "#newPassword" }),
      {
        target: { value: "123456" }, // fraca
      }
    );
    fireEvent.change(
      screen.getByLabelText("Confirmação da nova senha", {
        selector: "#confirmNewPassword",
      }),
      {
        target: { value: "123456" },
      }
    );

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "A senha deve ter pelo menos 8 caracteres e não conter sequências numéricas comuns."
      )
    );

    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  test("Caso 5: Senha já sendo utilizada atualmente", async () => {
    (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({
      error: { message: "different from the old password" }, // exemplo de mensagem supabase
    });

    render(<ResetPassword />);

    fireEvent.change(
      screen.getByLabelText("Nova senha", { selector: "#newPassword" }),
      {
        target: { value: "goldendog972" },
      }
    );
    fireEvent.change(
      screen.getByLabelText("Confirmação da nova senha", {
        selector: "#confirmNewPassword",
      }),
      {
        target: { value: "goldendog972" },
      }
    );

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "A nova senha deve ser diferente da atual."
      )
    );
  });

  test("Caso 6: Logout automático do Supabase após alteração", async () => {
    (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    render(<ResetPassword />);

    fireEvent.change(
      screen.getByLabelText("Nova senha", { selector: "#newPassword" }),
      {
        target: { value: "hdoqwiudhqwoiud872" },
      }
    );
    fireEvent.change(
      screen.getByLabelText("Confirmação da nova senha", {
        selector: "#confirmNewPassword",
      }),
      {
        target: { value: "hdoqwiudhqwoiud872" },
      }
    );

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Senha redefinida com sucesso! Faça login novamente."
      )
    );

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/signIn");
  });
});
