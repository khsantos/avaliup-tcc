# Avali.up

![Avali.up logo](/public/avaliup-logo.png)

Aplicação de reviews e rankings de produtos construída com Next.js + Supabase.

Principais pontos

- Reviews com comentários e votos, favoritar produtos, notificações de preço e conquistas.
- Página de produto: galeria, histórico de preços e comparação de marketplaces.
- Perfil: favoritos, reviews próprias e atividades.

Rápido start (Windows)

1. Copie .env.local.example → .env.local e preencha:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - (opcional) SUPABASE_SERVICE_ROLE_KEY
2. PowerShell:
   npm run dev
   ou cmd.exe:
   npm run dev

Estrutura (resumo)

- app/ — rotas (app router)
- components/ — UI e features (Product*, Review*, Achievements...)
- contexts/ — Supabase provider
- hooks/ — hooks customizados
- lib/ — utilitários
- types/ — tipos TypeScript

Links

- Next.js: <https://nextjs.org>
- Supabase: <https://supabase.com>
