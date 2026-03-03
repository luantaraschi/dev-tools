# Dev Tools

Painel web com utilitarios para tarefas comuns de desenvolvimento, centralizando conversao de arquivos, geracao de dados, formatacao e produtividade em uma unica interface.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## Visao geral

O projeto **Dev Tools** foi construido em **Next.js 15 + React 19 + TypeScript** e oferece uma experiencia unica para acessar multiplas ferramentas em um dashboard moderno, com tema claro/escuro e navegacao lateral.

Repositorio: <https://github.com/luantaraschi/dev-tools>

## Destaques

- Dashboard unico com navegacao por cards e sidebar.
- 15 ferramentas integradas na mesma experiencia visual.
- Processamento no navegador para varios fluxos (OCR, PDF, conversao e compressao de imagens).
- Suporte a upload por clique e drag-and-drop em varias ferramentas.
- Tema `system`, `light` e `dark`.
- Rota server-side dedicada para integracao com remove.bg.

## Ferramentas disponiveis

| Ferramenta | Rota | Descricao |
| --- | --- | --- |
| Time Converter | `/time-converter` | Conversao de horarios entre fusos, relogio mundial e compartilhamento de horarios. |
| Password Generator | `/password-generator` | Geracao de senhas aleatorias, pronunciaveis e passphrases com medidor de forca. |
| Color Harmony | `/color-harmony` | Geracao de harmonias de cor a partir de uma cor base. |
| Color Palette Extractor | `/color-palette-extractor` | Extracao de paleta dominante de imagens com copia em HEX/RGB/HSL. |
| QR Generator | `/qr-generator` | Geracao de QR Code para texto ou URL com exportacao em PNG. |
| Image Converter | `/image-converter` | Conversao de imagens (incluindo entrada HEIC/HEIF) para PNG/JPG/WEBP. |
| BG Remover | `/bg-remover` | Remocao de fundo via API remove.bg. |
| Image Compressor | `/image-compressor` | Compressao de imagens com controle de qualidade, formato e dimensoes. |
| Text to PDF | `/text-to-pdf` | Conversao de texto/markdown para PDF com configuracoes de layout e preview. |
| JSON Formatter | `/json-formatter` | Formatacao, minificacao e validacao basica de JSON. |
| Case Converter | `/case-converter` | Conversao para camelCase, snake_case, PascalCase e kebab-case. |
| UUID Generator | `/uuid-generator` | Geracao de UUID v4 em lote com copia rapida. |
| Box Shadow / Glassmorphism | `/box-shadow-glassmorphism` | Playground visual para sombras e glassmorphism com CSS copiavel. |
| Mesh Gradient Generator | `/mesh-gradient-generator` | Gerador de gradientes com controles de angulo e cores. |
| Image OCR | `/image-ocr` | Extracao de texto de imagens (OCR) com suporte a ingles e portugues. |

## Stack tecnica

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS 4, Radix UI, shadcn-style components
- **Linguagem:** TypeScript
- **Bibliotecas principais:** `jspdf`, `qrcode`, `tesseract.js`, `heic2any`, `lucide-react`, `motion`
- **Lint:** ESLint (config Next.js)

## Requisitos

- Node.js 20+ (recomendado)
- npm 10+

## Instalacao

```bash
npm install
```

## Executando localmente

```bash
npm run dev
```

Aplicacao disponivel em `http://localhost:3000`.

## Variaveis de ambiente

Crie um arquivo `.env.local` na raiz com:

```env
REMOVE_BG_API_KEY=seu_token_remove_bg
```

Essa variavel e obrigatoria apenas para a ferramenta **BG Remover** (`/bg-remover`), utilizada pela rota `app/api/remove-bg/route.ts`.

## Scripts

- `npm run dev`: inicia ambiente de desenvolvimento.
- `npm run build`: gera build de producao.
- `npm run start`: inicia app em modo producao.
- `npm run lint`: executa validacao de lint em `.js/.jsx/.ts/.tsx`.

## Estrutura do projeto

```text
app/
  (dashboard)/
    page.tsx
    [tool]/page.tsx
    about/page.tsx
  api/remove-bg/route.ts
components/
  tools/
  ui/
lib/
  tools.ts
_projetos_originais/
```

## Deploy

O projeto pode ser publicado em plataformas como Vercel, Netlify (com adaptacao) ou infraestrutura propria Node.js. Em producao, configure `REMOVE_BG_API_KEY` no ambiente para habilitar o BG Remover.

## Autor

**Luan Taraschi**  
GitHub: <https://github.com/luantaraschi>

## Licenca

No momento, o repositorio nao possui arquivo de licenca definido.
