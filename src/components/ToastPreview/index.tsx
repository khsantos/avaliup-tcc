import { toast } from "sonner";

export default function ToastPreview() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <button
        onClick={() =>
          toast.success("Conta criada com sucesso! 🎉", {
            description: "Insira seu e-mail e senha para continuar.",
            duration: 999999, // não desaparece até ser fechado
          })
        }
        className="bg-[#010B62] text-white px-4 py-2 rounded-md hover:bg-[#202766] transition"
      >
        Mostrar Toast
      </button>
    </div>
  );
}
