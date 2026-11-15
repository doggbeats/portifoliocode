# CODE_PH — Assistência Técnica & Soluções Digitais

Site institucional e portfólio da CODE_PH. Apresenta projetos reais com vídeo e link
para o site em produção, serviços, processo de trabalho e um formulário de contato com
validação — sem simular envios.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 (design system em CSS variables)
- `lucide-react` para ícones
- `next/font` (Sora, Inter, JetBrains Mono)
- Tema claro/escuro (preto e branco), persistido em `localStorage`
- Preferências de cookies versionadas, com categorias opcionais desativadas por padrão

## Rodando no Windows

Requisitos: Node.js 20+ e npm.

```powershell
cd "C:\Users\user\Desktop\Meus projetos\portifolio_code\my-app"
npm install
Copy-Item .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`.

Para conferir a versão de produção:

```powershell
npm run build
npm start
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha o que for usar. Tudo é opcional — o
site funciona sem contato configurado, apenas ocultando os canais vazios.

### Públicas (`NEXT_PUBLIC_*`)

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL canônica usada em SEO, sitemap e links absolutos |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número com DDI e DDD, somente dígitos (`5561992890326`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | E-mail exibido no contato e no rodapé |
| `NEXT_PUBLIC_CONTACT_PHONE` | Telefone exibido no contato |
| `NEXT_PUBLIC_LOCATION` | Cidade/região exibida no rodapé |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Link do Instagram (oculto se vazio) |
| `NEXT_PUBLIC_LINKEDIN_URL` | Link do LinkedIn (oculto se vazio) |
| `NEXT_PUBLIC_GITHUB_URL` | Link do GitHub (oculto se vazio) |

### Formulário (somente servidor)

O formulário envia `POST /api/contato`. Sem um canal configurado, a API responde
`503 NOT_CONFIGURED` e a interface mostra o aviso com o atalho para o WhatsApp — nenhum
envio é simulado. Configure **uma** das opções:

**Opção 1 — Resend**

```
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=contato@seudominio.com
CONTACT_FROM_EMAIL=CODE_PH <site@seudominio.com>
```

**Opção 2 — webhook genérico** (Zapier, Make, n8n etc.)

```
CONTACT_WEBHOOK_URL=https://...
CONTACT_WEBHOOK_SECRET=opcional
```

Se o Resend estiver configurado e falhar, a API devolve erro 502 e não tenta o webhook.

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Na Vercel, importe o projeto. Se o repositório tiver a pasta `my-app`, defina
   **Root Directory = `my-app`**.
3. Framework preset: **Next.js** (build `npm run build`).
4. Adicione as variáveis de ambiente de produção (as mesmas do `.env.example`).
5. Faça o deploy e teste o formulário com o canal configurado.

Autoridade de domínio e `og:image` usam `NEXT_PUBLIC_SITE_URL`; ajuste depois de
apontar o domínio final.

## Estrutura

```
app/
  api/contato/route.ts   validação, rate limit e entrega do formulário
  globals.css            design system, temas e layouts
  layout.tsx             fontes, metadata, tema inicial
  page.tsx               composição das seções
  politica-de-cookies/   inventário de cookies e preferências
  politica-de-privacidade/ tratamentos e canais de direitos
components/
  sections/              hero, sobre, projetos, soluções, diferencial, processo, contato
  cookie-consent.tsx     aviso, painel, aceite, recusa e revogação
  project-media.tsx      pôster + lightbox de vídeo (formato original, sem corte)
  logo.tsx               logo oficial
  theme-*.tsx            alternância de tema
lib/
  content.ts             projetos, mídias, links, serviços e textos
  site.ts                contato, redes e helpers de WhatsApp/e-mail
public/
  image/                 vídeos dos projetos
  image/posters/         pôsteres de cada projeto
```

## Mídia dos projetos

Cada projeto usa o pôster na proporção original do arquivo, com
`object-fit: contain` — nada é cortado nem ampliado. O vídeo abre em um `dialog`
nativo e é reproduzido por completo, com controles.

Para trocar um pôster, substitua o arquivo em `public/image/posters/` e atualize
`poster`, `width` e `height` do projeto em `lib/content.ts`.

Se o servidor de produção estiver rodando, apague `.next/cache/images` e reinicie depois
do build. O Next guarda as versões otimizadas por caminho e pode servir a imagem antiga
em alguns tamanhos quando o arquivo é substituído mantendo o mesmo nome.

## Observações

- O projeto não configura analytics, publicidade, mapas, chat ou vídeo de terceiros. O cookie `code-ph-cookie-consent` registra no navegador as categorias, o horário e a versão escolhidos, por até 180 dias. Ao alterar `COOKIE_POLICY_VERSION` em `lib/cookie-consent.ts`, o aviso volta a pedir uma escolha.
- As políticas descrevem o código disponível; antes de publicar, confirme a identidade do controlador, o canal de privacidade, o ambiente de hospedagem e o fornecedor/retensão do Resend ou webhook configurado.
- O rate limit do formulário é em memória (`Map`); em serverless ele não é global nem
  durável. Para produção crítica, use Redis/KV.
- Não há métricas, clientes ou depoimentos fictícios: os projetos exibidos são reais e
  os links apontam para as aplicações publicadas.
- A máscara orgânica WebGL começa a se abrir no primeiro gesto de scroll. Conforme a
  pessoa desce, os conteúdos entram deslizando de baixo para cima e acompanham o scroll
  nos dois sentidos. Lenis mantém a rolagem nativa e os vídeos só carregam quando
  abertos. Sem WebGL ou com `prefers-reduced-motion`, o site segue acessível sem a
  animação.
