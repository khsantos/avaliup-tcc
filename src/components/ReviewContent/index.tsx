import { Button } from "@/src/components/ui/button";
import { useRef, useLayoutEffect, useState } from "react";

type ReviewContentProps = {
  title: string;
  text: string;
  isExpanded?: boolean;
  onToggleExpand: () => void;
  previewChars?: number;
};

export function ReviewContent({
  title,
  text,
  isExpanded = false,
  onToggleExpand,
}: ReviewContentProps) {
  const previewLines = 3;
  const lineHeightPx = 32;
  const previewMaxHeight = previewLines * lineHeightPx;

  const pRef = useRef<HTMLParagraphElement | null>(null);
  const [height, setHeight] = useState<string>(`${previewMaxHeight}px`);
  const [hasOverflow, setHasOverflow] = useState<boolean>(false);

  useLayoutEffect(() => {
    const el = pRef.current;
    if (!el) return;
    const contentHeight = el.scrollHeight;
    setHasOverflow(contentHeight > previewMaxHeight + 1);
    if (isExpanded) {
      setHeight(`${contentHeight}px`);
    } else {
      setHeight(`${previewMaxHeight}px`);
    }
  }, [isExpanded, text, previewMaxHeight]);

  return (
    <div className="space-y-2">
      <div className="font-bold text-lg text-[#010b62] dark:text-white">
        {title}
      </div>

      <div className="relative flex flex-col">
        <p
          ref={pRef}
          style={{
            maxHeight: height,
            overflow: "hidden",
            transition: "max-height 220ms ease",
          }}
          className="dark:text-white text-[#010b62] text-base text-justify leading-snug whitespace-pre-line"
        >
          {text}
        </p>

        {!isExpanded && hasOverflow && (
          <div
            className="absolute bottom-0 left-0 w-full h-12 pointer-events-none 
                       bg-gradient-to-t from-white dark:from-[#030712] to-transparent"
          />
        )}
      </div>

      {hasOverflow ? (
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
