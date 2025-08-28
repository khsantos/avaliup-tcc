"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Link href="/">
        <Image
          src="/logo-menu.svg"
          alt="Logo"
          width={32}
          height={32}
          className="w-32 h-auto mx-auto"
        />
      </Link>
    );
  }

  return (
    <Link href="/">
      <Image
        src={
          resolvedTheme === "dark" ? "/logo-menu-dark.svg" : "/logo-menu.svg"
        }
        alt="Logo"
        width={16}
        height={16}
        className="w-32 h-auto mx-auto"
      />
    </Link>
  );
}
