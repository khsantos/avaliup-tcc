"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";

type DeleteAccountDialogProps = {
  userId: string;
};

export function DeleteAccountDialog({ userId }: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteAccount() {
    if (!userId) return;
    setDeleting(true);

    try {
      const response = await fetch(
        "https://qjpnvzrmiibksdvxmzop.supabase.co/functions/v1/delete-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              (
                await supabase.auth.getSession()
              ).data.session?.access_token
            }`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro ao excluir conta");

      await supabase.auth.signOut();
      toast.success("Conta excluída com sucesso!");
      window.location.href = "/";
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao excluir conta. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="bg-[#f50909] hover:bg-red-700 text-white"
        >
          Excluir conta
        </Button>
      </DialogTrigger>

      <DialogContent className="dark:bg-[#030712]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Excluir conta</DialogTitle>
          <DialogDescription className="dark:text-gray-300 text-gray-800">
            Tem certeza de que deseja excluir sua conta? Esta ação é{" "}
            <strong>irreversível</strong> e todos os seus dados serão removidos
            permanentemente.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="dark:border-white border-[#010b62] text-[#010b62] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-[#010b62]"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="bg-[#f50909] hover:bg-red-700 text-white"
          >
            {deleting ? "Excluindo..." : "Confirmar exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
