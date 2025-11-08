import { Button } from "../ui/button";
import { Heart, Bell } from "lucide-react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";

interface ProductActionsProps {
  isWishlisted: boolean;
  loading: boolean;
  session: Session | null;
  onToggleFavorite: () => void;
  onShowForm: () => void;
  onOpenNotification: () => void;
}

export default function ProductActions({
  isWishlisted,
  loading,
  session,
  onToggleFavorite,
  onShowForm,
  onOpenNotification,
}: ProductActionsProps) {
  return (
    <div className="flex gap-2 mt-4">
      <Button
        className="bg-[#010b62] hover:bg-[#1C2CA3] text-white px-6 cursor-pointer dark:bg-[#01BAEF] dark:hover:bg-[#33C9F2]"
        onClick={onShowForm}
      >
        Avaliar Produto
        <MdOutlineKeyboardArrowRight className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        disabled={loading || !session}
        onClick={onToggleFavorite}
        className={
          isWishlisted
            ? "text-white bg-[#010b62] dark:text-[#01BAEF] dark:border-[#01BAEF] cursor-pointer hover:bg-[#1C2CA3] hover:text-white"
            : "text-[#010b62] border border-[#010b62] hover:text-white hover:bg-[#010b62] dark:bg-[#030712] cursor-pointer dark:text-white dark:border-white"
        }
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          if (!session?.user?.id) {
            toast.error("Você precisa estar logado para criar notificações.");
            return;
          }
          onOpenNotification();
        }}
        className="text-[#010b62] dark:text-white hover:bg-[#010b62] hover:text-white dark:hover:bg-gray-800 dark:bg-[#030712] dark:border-white border-[#010b62] cursor-pointer"
      >
        <Bell className="w-5 h-5" />
      </Button>
    </div>
  );
}
