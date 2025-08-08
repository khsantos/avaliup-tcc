"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = !mounted
    ? "/logo-teclado.svg"
    : theme === "dark"
      ? "/logo-teclado-dark.svg"
      : "/logo-teclado.svg";

  return (
    <footer className="border-t border-[#010b62] rounded-xl mt-10 bg-white text-sm text-[#0f1a54] dark:bg-[#030712] dark:text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="space-y-4">
          <div className="flex flex-col items-start space-y-1">
            <Image
              src={logoSrc}
              alt="Logo Avali.up"
              width={48}
              height={48}
              className="ml-2.5"
            />
            <span className="font-bold text-lg">Avali.up</span>
          </div>

          <div className="flex space-x-3 ">
            <a href="#" aria-label="Twitter">
              <svg
                className="w-5 h-5 text-[#0f1a54] hover:text-blue-500 dark:text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.43.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.51 2.07-4.51 4.63 0 .36.04.71.12 1.04A12.8 12.8 0 013 1.13a4.73 4.73 0 001.38 6.18 4.5 4.5 0 01-2.05-.58v.06c0 2.23 1.56 4.09 3.63 4.52a4.38 4.38 0 01-2.03.08 4.53 4.53 0 004.23 3.15A9.06 9.06 0 012 19.54a12.74 12.74 0 006.92 2.09c8.3 0 12.84-7.18 12.84-13.4 0-.2 0-.39-.01-.59A9.14 9.14 0 0023 3z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg
                className="w-5 h-5 text-[#0f1a54] hover:text-pink-500 dark:text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM12 7.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm6.4-.6a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zM12 9.1a2.9 2.9 0 100 5.8 2.9 2.9 0 000-5.8z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg
                className="w-5 h-5 text-[#0f1a54] hover:text-blue-700 dark:text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.98 3a2 2 0 100 4 2 2 0 000-4zM2 9h6v12H2zM10 9h5.4v1.68h.08a5.92 5.92 0 015.32-2.92c5.68 0 6.72 3.73 6.72 8.58V21h-6v-6.53c0-1.56-.03-3.57-2.18-3.57-2.18 0-2.52 1.7-2.52 3.45V21h-6z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Empresa</h4>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="about-us">Sobre nós</a>
            </li>
            <li>
              <a href="/security">Segurança</a>
            </li>
            <li>
              <a href="/terms-of-use">Termos de uso</a>
            </li>
            <li>
              <a href="/policy-and-privacy">Política de privacidade</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Periféricos</h4>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="/categoria/mouses">Mouses</a>
            </li>
            <li>
              <a href="/categoria/teclados">Teclados</a>
            </li>
            <li>
              <a href="/categoria/mousepads">Mousepads</a>
            </li>
            <li>
              <a href="/categoria/headsets">Headsets</a>
            </li>
            <li>
              <a href="/categoria/cadeiras">Cadeiras</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Hardware</h4>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="/categoria/placa-de-video">Placa de vídeo</a>
            </li>
            <li>
              <a href="/categoria/processador">Processador</a>
            </li>
            <li>
              <a href="/categoria/memoria ram">Memória RAM</a>
            </li>
            <li>
              <a href="/categoria/placa-mae">Placa Mãe</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Subcategorias</h4>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#">Custo-benefício</a>
            </li>
            <li>
              <a href="#">High-end</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs py-4 border-t">
        &copy; {new Date().getFullYear()} Avali.up, Inc.
      </div>
    </footer>
  );
}
