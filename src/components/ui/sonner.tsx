"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      toastOptions={{
        classNames: {
          // Claro por padrão, escuro com `dark:`
          toast:
            "group bg-white text-[#010B62] border border-[#01BAEF] px-4 py-3 rounded-xl shadow-lg " +
            "dark:bg-[#010B62] dark:text-white dark:border-[#01BAEF]",
          title: "text-base font-semibold",
          description: "text-sm text-[#010B62]/80 mt-1 dark:text-white/80",
          actionButton:
            "bg-[#01BAEF] text-[#010B62] hover:bg-[#0D91AC] rounded-md px-3 py-1 text-sm font-medium",
          cancelButton:
            "text-[#010B62]/70 hover:text-[#010B62] text-sm dark:text-white/70 dark:hover:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
