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
      <div className="font-bold text-lg text-[#010b62] dark:text-white">
        {title}
      </div>

      <div className="relative flex flex-col">
        <p
          className={`dark:text-white text-[#010b62] text-base text-justify leading-snug whitespace-pre-line transition-all ${
            isExpanded ? "" : "line-clamp-4 overflow-hidden"
          }`}
        >
          {text}
        </p>

        {!isExpanded && (
          <div
            className="absolute bottom-0 left-0 w-full h-12 pointer-events-none 
                          bg-gradient-to-t from-white dark:from-[#030712] to-transparent"
          />
        )}
      </div>

      {text.split("\n").length > 4 || text.length > 200 ? (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="dark:text-[#00b6f3] text-[#010b62] hover:text-[#010b62]/70 dark:hover:text-white p-0 h-auto"
            onClick={onToggleExpand}
          >
            {isExpanded ? "Ver menos" : "Ver mais"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
