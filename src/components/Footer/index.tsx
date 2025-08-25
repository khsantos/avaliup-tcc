"use client";

import Link from "next/link";
import { NAV } from "@/src/components/Header/nav/nav.config";
import { Logo } from "@/src/components/Header/logo";
import { SiInstagram, SiYoutube, SiLinkedin } from "react-icons/si";

function SocialLinks() {
  const link =
    "rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#010b62]/40 dark:focus-visible:ring-[#00afd3]/40";
  const icon = "w-5 h-5";

  return (
    <div className="flex items-center gap-5">
      <a
        href="#"
        aria-label="Instagram"
        title="Instagram"
        className={`${link} text-[#23307a] hover:text-[#0f1a54] dark:text-gray-300 dark:hover:text-white`}
      >
        <SiInstagram className={icon} />
      </a>

      <a
        href="#"
        aria-label="YouTube"
        title="YouTube"
        className={`${link} text-[#23307a] hover:text-[#0f1a54] dark:text-gray-300 dark:hover:text-white`}
      >
        <SiYoutube className={icon} />
      </a>

      <a
        href="#"
        aria-label="LinkedIn"
        title="LinkedIn"
        className={`${link} text-[#23307a] hover:text-[#0f1a54] dark:text-gray-300 dark:hover:text-white`}
      >
        <SiLinkedin className={icon} />
      </a>
    </div>
  );
}

export default function Footer() {
  const menuGroups = NAV.filter((g) => Array.isArray(g.items) && g.items.length > 0);
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-12 bg-white text-sm text-[#0f1a54] dark:bg-[#030712] dark:text-white">
      {/* linha decorativa no topo */}
      <div
        className="absolute inset-x-0 top-0 h-[4px] pointer-events-none
        dark:bg-[radial-gradient(ellipse_at_center,_#01baef_0%,_#01baef_40%,_#030712_72%,_#030712_100%)]
        bg-[radial-gradient(ellipse_at_center,_#010b62_0%,_#010b62_40%,_#ffffff_72%,_#ffffff_100%)]"
      />

      <div className="px-4 sm:px-6 md:px-8 pt-10 pb-8">
        {/* centralizado, com wrap, sem sobras */}
        <div className="flex flex-wrap items-start justify-center gap-x-16 gap-y-10">
          {/* Logo + redes (centralizados) */}
          <section aria-labelledby="footer-brand" className="flex flex-col items-center gap-4 basis-64 shrink-0">
            <div id="footer-brand" className="relative w-[60px] h-[38px] sm:w-[78px] sm:h-[49px]">
              <Logo />
            </div>
            <SocialLinks />
          </section>

          {/* Empresa */}
          <nav aria-labelledby="footer-company" className="basis-40 shrink-0 flex flex-col items-center md:items-start">
            <h4 id="footer-company" className="mb-3 text-sm font-semibold tracking-tight text-center md:text-left">
              Empresa
            </h4>
            <ul role="list" className="space-y-2 text-gray-600 dark:text-gray-300 text-center md:text-left">
              <li><Link href="/about-us" className="hover:underline">Sobre nós</Link></li>
              <li><Link href="/security" className="hover:underline">Segurança</Link></li>
              <li><Link href="/terms-of-use" className="hover:underline">Termos de uso</Link></li>
              <li><Link href="/policy-and-privacy" className="hover:underline">Política de privacidade</Link></li>
            </ul>
          </nav>

          {/* Seções do menu (centralizadas no mobile) */}
          {menuGroups.map((group) => (
            <nav
              key={group.key}
              aria-labelledby={`footer-${group.key}`}
              className="basis-40 shrink-0 flex flex-col items-center md:items-start"
            >
              <h4 id={`footer-${group.key}`} className="mb-3 text-sm font-semibold tracking-tight text-center md:text-left">
                {group.label}
              </h4>
              <ul role="list" className="space-y-2 text-gray-600 dark:text-gray-300 text-center md:text-left">
                {group.items!.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} className="hover:underline">{it.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Ranking */}
          <nav aria-labelledby="footer-ranking" className="basis-40 shrink-0 flex flex-col items-center md:items-start">
            <h4 id="footer-ranking" className="mb-3 text-sm font-semibold tracking-tight text-center md:text-left">
              Ranking
            </h4>
            <ul role="list" className="space-y-2 text-gray-600 dark:text-gray-300 text-center md:text-left">
              <li><Link href="/ranking" className="hover:underline">Ver ranking</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* faixa inferior */}
      <div className="px-4 sm:px-6 md:px-8 py-4 text-xs text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {year} Avali.up. Todos os direitos reservados.</p>
      </div>

    </footer>
  );
}
