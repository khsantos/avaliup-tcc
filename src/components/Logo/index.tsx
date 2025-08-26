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
          width={78}
          height={49}
          className="w-full h-full"
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
        width={78}
        height={49}
        className="w-full h-full"
      />
    </Link>
  );
}
