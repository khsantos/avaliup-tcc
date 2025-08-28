"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { useSupabase } from "@/src/contexts/supabase-provider";
import { UserReview } from "@/src/types/UserReview";

type ReviewOptionsProps = {
  review: UserReview;
  setReviews?: React.Dispatch<React.SetStateAction<UserReview[]>>;
};

export function ReviewOptions({ review, setReviews }: ReviewOptionsProps) {
  const { session, supabase } = useSupabase();

  const handleDelete = async () => {
    if (!session?.user) return;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", review.id);

    if (!error) {
      setReviews?.((prev) => prev.filter((r) => r.id !== review.id));
    } else {
      console.error("Erro ao deletar review:", error.message);
    }

    if (session?.user?.id !== review.users_id) return null;
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#010b62] dark:text-[#00AFD3]"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-[#010b62] hover:text-red-500"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Deletar review
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
