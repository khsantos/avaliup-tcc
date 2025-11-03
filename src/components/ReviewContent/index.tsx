import { Button } from "@/src/components/ui/button";

type ReviewContentProps = {
  title: string;
  text: string;
  isExpanded?: boolean;
  onToggleExpand: () => void;
};

export function ReviewContent({
  title,
  text,
  isExpanded = false,
  onToggleExpand,
}: ReviewContentProps) {
  return (
    <div className="space-y-2">
      {/* Título */}
      <div className="font-bold text-lg text-[#010b62] dark:text-white">
        {title}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col sm:flex-row sm:gap-4">
        {/* Texto */}
        <div className="flex-1 relative">
          <p
            className={`dark:text-white text-[#010b62] text-base text-justify leading-snug whitespace-pre-line pr-0 sm:pr-4 ${
              isExpanded ? "" : "line-clamp-4 overflow-hidden"
            }`}
          >
            {text}
          </p>

          {!isExpanded && (
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#ffffff] dark:from-[#030712] to-transparent pointer-events-none" />
          )}
        </div>

        {/* Espaço reservado para imagens (pode ser usado futuramente) */}
        <div className="w-full sm:w-20 mt-2 sm:mt-0 flex items-center justify-center shrink-0">
          {/* Placeholder para imagens */}
        </div>
      </div>

      {/* Botão */}
      <Button
        variant="ghost"
        size="sm"
        className="dark:text-[#00b6f3] text-[#010b62] hover:text-[#010b62]/70 dark:hover:text-white p-0 h-auto"
        onClick={onToggleExpand}
      >
        {isExpanded ? "Ver menos" : "Ver mais"}
      </Button>
    </div>
  );
}
