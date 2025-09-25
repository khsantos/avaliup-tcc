"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/src/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/src/lib/supabase";
import { X } from "lucide-react";

interface TwoFactorAuthDialogProps {
  userId: string;
  email: string;
  accessToken?: string;
  open: boolean;
  initialStep?: "choose" | "verify";
  onClose: () => void;
  onVerified: (accessToken: string) => void;
}

export default function TwoFactorAuthDialog({
  userId,
  accessToken,
  email,
  open,
  initialStep = "choose",
  onClose,
  onVerified,
}: TwoFactorAuthDialogProps) {
  const [step, setStep] = useState<"choose" | "verify">(initialStep);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    const fetchTwoFactorStatus = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("two_factor_enabled")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setTwoFactorEnabled(data.two_factor_enabled);
      }
    };

    if (userId) fetchTwoFactorStatus();
  }, [userId]);

  const handleActivate2FA = useCallback(async () => {
    setLoading(true);
    try {
      if (!accessToken) throw new Error("Usuário não autenticado");

      await fetch(
        "https://qjpnvzrmiibksdvxmzop.supabase.co/functions/v1/send-f2a-code",
        {
          method: "POST",
          body: JSON.stringify({ userId, email }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setStep("verify");
      toast.success("Código enviado para seu e-mail!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar código 2FA.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, userId, email]);

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://qjpnvzrmiibksdvxmzop.supabase.co/functions/v1/verify-2fa-code",
        {
          method: "POST",
          body: JSON.stringify({ userId, code }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (data.ok && data.access_token) {
        toast.success("Autenticação de dois fatores concluída!");
        onVerified(data.access_token);
      } else {
        toast.error(data.error || "Código inválido ou expirado.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Erro ao verificar código.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip2FA = () => {
    if (twoFactorEnabled) {
      toast.error("Sua conta possui 2FA ativado. Você deve inserir o código.");

      supabase.auth.signOut();
      onClose();

      return;
    }

    if (accessToken) onVerified(accessToken);
  };

  useEffect(() => {
    if (initialStep === "verify" && !codeSent && !loading) {
      handleActivate2FA();
      setCodeSent(true);
    }
  }, [initialStep, codeSent, loading, handleActivate2FA]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#010b62] dark:text-[#33C9F2]">
            Autenticação de Dois Fatores
          </DialogTitle>

          {!twoFactorEnabled && (
            <DialogClose asChild className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>
          )}

          {step === "choose" ? (
            <DialogDescription>
              Deseja ativar a autenticação de dois fatores para maior segurança
              da sua conta?
            </DialogDescription>
          ) : (
            <DialogDescription>
              Insira o código que enviamos para seu e-mail.
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter>
          {step === "choose" ? (
            <>
              <button
                onClick={handleActivate2FA}
                disabled={loading}
                className="px-4 py-2 bg-[#010b62] dark:bg-[#01BAEF] hover:bg-[#1C2CA3] hover:dark:bg-[#00AFD3] cursor-pointer text-white rounded mr-2"
              >
                {loading ? "Enviando..." : "Ativar"}
              </button>
              <button
                onClick={handleSkip2FA}
                disabled={loading}
                className="px-4 py-2 border rounded dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
              >
                Ignorar
              </button>
            </>
          ) : (
            <>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Digite o código"
                className="px-3 py-2 border rounded mr-2"
              />
              <button
                onClick={handleVerifyCode}
                disabled={loading}
                className="px-4 py-2 bg-[#010b62] hover:bg-[#1C2CA3] text-white rounded cursor-pointer"
              >
                {loading ? "Verificando..." : "Verificar"}
              </button>
              <button
                onClick={() => setStep("choose")}
                disabled={loading}
                className="px-4 py-2 border rounded hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer ml-2"
              >
                Voltar
              </button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
