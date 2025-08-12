// src/components/layout/nav/nav.config.ts
export type NavItem = { label: string; href: string };
export type NavGroup = { label: string; items?: NavItem[]; href?: string; key: "perifericos" | "hardware" | "subcategorias" | "ranking" };

export const NAV: NavGroup[] = [
  {
    key: "perifericos",
    label: "Periféricos",
    items: [
      { href: "/categoria/mouses", label: "Mouses" },
      { href: "/categoria/teclados", label: "Teclados" },
      { href: "/categoria/headsets", label: "Headsets" },
      { href: "/categoria/mousepads", label: "Mousepads" },
      { href: "/categoria/monitores", label: "Monitores" },
      { href: "/categoria/controles", label: "Controles" },
    ],
  },
  {
    key: "hardware",
    label: "Hardware",
    items: [
      { href: "/categoria/processadores", label: "Processadores" },
      { href: "/categoria/placas-de-video", label: "Placas de Vídeo" },
      { href: "/categoria/ssds", label: "SSDs" },
      { href: "/categoria/memorias-ram", label: "Memórias RAM" },
    ],
  },
  {
    key: "subcategorias",
    label: "Subcategorias",
    items: [
      { href: "/subcategoria/low-end", label: "Low-end" },
      { href: "/subcategoria/mid-end", label: "Mid-end" },
      { href: "/subcategoria/high-end", label: "High-end" },
    ],
  },
  { key: "ranking", label: "Ranking", href: "/ranking" },
] as const;
