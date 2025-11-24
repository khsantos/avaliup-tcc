# Avali.up

Pequeno resumo
- Aplicação de reviews e rankings de produtos construída com Next.js + Supabase.
- Objetivo: permitir avaliações, comentários, favoritar produtos, notificações de preço e conquistas.

Principais funcionalidades
- Publicação e listagem de reviews com comentários e votos (like/dislike).
- Página de produto com galeria, histórico de preços e comparação de marketplaces.
- Perfil de usuário com favoritos, reviews próprias e atividades.
- Sistema de conquistas (achievements) e notificações.
- Integração com Supabase (auth, database, storage).

Tecnologias
- Next.js (app dir, React 18+, SSR/ISR/Client components)
- Supabase (Auth, Postgres, Storage)
- Tailwind CSS, Framer Motion
- react-window (para virtualização quando necessário)
- Ferramentas para scraping (BeautifulSoup, Selenium) — usadas offline / scripts auxiliares

Pré-requisitos
- Node.js 18+ (recomendado 18.x ou 20.x)
- npm (ou yarn/pnpm)
- Conta e projeto no Supabase com tabela e chaves configuradas

Variáveis de ambiente (.env.local)
Crie um arquivo `.env.local` na raiz com as chaves do Supabase e outras necessárias:
```
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-url>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key> # só se necessário no backend
NEXTAUTH_URL=http://localhost:3000 # se usar next-auth (apenas exemplo)
# outras variáveis custom do projeto...
```

Como rodar em desenvolvimento (Windows)
- cmd.exe:
  npm run dev

Comandos úteis
- npm run dev — roda o Next.js em modo desenvolvimento
- npm run build — build de produção
- npm run start — inicia build de produção
- npm run lint / npm run test — (se configurado)

Estrutura básica do projeto (src)
- app/ — rotas e layout (app router)
- components/ — componentes reutilizáveis (ProductCard, ReviewCard, ReviewContent...)
- contexts/ — provedor do Supabase
- hooks/ — hooks customizados (useFetchProduct, useFavorite...)
- lib/ — utilitários (formatters, supabase client)
- types/ — tipos TypeScript

Links úteis
- Next.js: https://nextjs.org
- Supabase: https://supabase.com
