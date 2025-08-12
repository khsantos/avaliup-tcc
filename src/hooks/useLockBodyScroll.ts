// src/components/layout/hooks/useLockBodyScroll.ts
import { useEffect } from "react";

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    const { style } = document.body;
    const prev = style.overflow;
    if (locked) style.overflow = "hidden";
    return () => { style.overflow = prev; };
  }, [locked]);
}
