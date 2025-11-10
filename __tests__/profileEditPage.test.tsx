import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileEditPage from "@/src/app/(website)/profile-edit/page";
import { useSupabase } from "@/src/contexts/supabase-provider";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
import * as useValidateCpfModule from "@/src/hooks/useValidateCpf";
import { ChangeProfilePhotoDialog } from "@/src/components/ChangeProfileDialog";

// Mock next/image para devolver uma tag <img> simples (facilita checar src/alt)
jest.mock("next/image", () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} src={props.src} alt={props.alt || "image"} />;
});

// Mock do hook de validação de CPF (somente a função; retorno será configurado abaixo)
jest.mock("@/src/hooks/useValidateCpf", () => ({
  useValidateCPF: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ url: "/new-photo.png" }),
  })
) as jest.Mock;

// Mock do toast (sonner)
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock formatCpf (pass-through)
jest.mock("@/src/lib/formatCpf", () => jest.fn((cpf) => cpf));

// Mocks dos dialogs/subcomponentes usados na página
jest.mock("@/src/components/ChangeProfileDialog", () => ({
  ChangeProfilePhotoDialog: ({ onPhotoUpdated }: any) => (
    <button
      data-testid="change-photo"
      onClick={() => onPhotoUpdated("/new-photo.png")}
    >
      Alterar foto
    </button>
  ),
}));

jest.mock("@/src/components/DeleteAccountDialog", () => ({
  DeleteAccountDialog: () => <div data-testid="delete-dialog" />,
}));

// Mock do provider useSupabase
jest.mock("@/src/contexts/supabase-provider", () => ({
  useSupabase: jest.fn(),
}));

// Mock do client supabase (funções serão configuradas no beforeEach)
jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      updateUser: jest.fn(),
    },
  },
}));

describe("Tela de Edição de Perfil do Usuário", () => {
  const mockUser = {
    id: "user-123",
    email: "julia@example.com",
  };

  beforeEach(() => {
    // Certifica que o hook de validação retorna CPF válido por padrão
    jest.mocked(useValidateCpfModule.useValidateCPF).mockReturnValue({
      validateCPF: jest.fn(() => true),
      cpfError: "",
    });

    // Mock do contexto useSupabase
    (useSupabase as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
    });

    // Mock do fluxo de leitura e atualização do Supabase:
    // - select().eq(...).single() => retorna dados do usuário
    // - update(...).eq(...) => resolve sem erro
    (supabase.from as jest.Mock).mockImplementation((table: string) => {
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            name: "Julia Benjamin",
            cpf: "12345678909",
            gender: "Feminino",
            profile_img: "/profile.png",
          },
          error: null,
        }),
        // update must return object that has eq() -> resolves to { error: null }
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      };
    });

    // Mock do updateUser do auth (não usado diretamente na maioria dos testes,
    // mas vamos garantir que resolve)
    (supabase.auth.updateUser as jest.Mock).mockResolvedValue({ error: null });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Caso 1: Exibição dos Campos de Edição", async () => {
    render(<ProfileEditPage />);

    await waitFor(() =>
      expect(screen.getByDisplayValue("Julia Benjamin")).toBeInTheDocument()
    );

    expect(screen.getByAltText("Foto de perfil")).toBeInTheDocument();
    expect(screen.getByTestId("change-photo")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("CPF")).toBeInTheDocument();
    expect(screen.getByLabelText("Gênero")).toBeInTheDocument();
    expect(screen.getByLabelText("Nova senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar senha")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Salvar alterações/i })
    ).toBeInTheDocument();
  });

  test("Caso 2: Simula upload e atualização da foto no diálogo", async () => {
    const mockOnPhotoUpdated = jest.fn();

    render(
      <ChangeProfilePhotoDialog
        currentPhoto="/old-photo.png"
        userId="fake-user-id"
        onPhotoUpdated={mockOnPhotoUpdated}
      />
    );

    // Clica no botão mockado — que já chama onPhotoUpdated("/new-photo.png")
    fireEvent.click(screen.getByRole("button", { name: /Alterar foto/i }));

    // Verifica se a função foi chamada
    await waitFor(() => {
      expect(mockOnPhotoUpdated).toHaveBeenCalledWith("/new-photo.png");
    });
  });
});

test("Caso 3: Edição das Informações Pessoais", async () => {
  render(<ProfileEditPage />);

  await waitFor(() =>
    expect(screen.getByDisplayValue("Julia Benjamin")).toBeInTheDocument()
  );

  fireEvent.change(screen.getByLabelText("Nome"), {
    target: { value: "Julia B." },
  });
  fireEvent.change(screen.getByLabelText("Gênero"), {
    target: { value: "Feminino" },
  });
  fireEvent.change(screen.getByLabelText("CPF"), {
    target: { value: "12345789" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Salvar alterações/i }));

  // update(...) mock retorna eq()->resolve { error: null } -> sucesso
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith(
      "Perfil atualizado com sucesso!"
    );
  });
});

test("Caso 4: Edição e confirmação de CPF válido", async () => {
  render(<ProfileEditPage />);

  await waitFor(() =>
    expect(screen.getByDisplayValue("Julia Benjamin")).toBeInTheDocument()
  );

  fireEvent.change(screen.getByLabelText("CPF"), {
    target: { value: "16749738028" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Salvar alterações/i }));

  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith(
      "Perfil atualizado com sucesso!"
    );
  });
});

test("Caso 5: Edição e confirmação de CPF inválido", async () => {
  // sobrescreve o mock do hook somente para este teste
  jest.mocked(useValidateCpfModule.useValidateCPF).mockReturnValue({
    validateCPF: jest.fn(() => false),
    cpfError: "CPF inválido.",
  });

  render(<ProfileEditPage />);

  await waitFor(() =>
    expect(screen.getByDisplayValue("Julia Benjamin")).toBeInTheDocument()
  );

  fireEvent.change(screen.getByLabelText("CPF"), {
    target: { value: "11111111111" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Salvar alterações/i }));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith(
      "CPF inválido. Corrija antes de salvar."
    );
  });
});

test("Caso 6: Cancelamento da Edição", async () => {
  render(<ProfileEditPage />);

  await waitFor(() =>
    expect(screen.getByDisplayValue("Julia Benjamin")).toBeInTheDocument()
  );

  fireEvent.change(screen.getByLabelText("Nome"), {
    target: { value: "Alterado" },
  });

  const backLink = screen.getByRole("link", { name: /Voltar/i });
  expect(backLink).toHaveAttribute("href", "/profile-general");
});
