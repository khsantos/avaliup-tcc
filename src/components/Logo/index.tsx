"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Image
        src="/logo-menu.svg"
        alt="Logo"
        width={78}
        height={49}
        className="w-full h-full"
      />
    );
  }

  return (
    <Image
      src={resolvedTheme === "dark" ? "/logo-menu-dark.svg" : "/logo-menu.svg"}
      alt="Logo"
      width={78}
      height={49}
      className="w-full h-full"
    />
  );
}
