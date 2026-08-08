# dev-tools

Developer utility suite featuring 17 client-side and server-assisted tools in a single unified dashboard.

[Live Demo](https://dev-tools-xi-beige.vercel.app) · [Case Study](https://luantaraschi.dev/projeto-devtools.html)

![dev-tools Dashboard](docs/dev-tools.webp)

## How it works

The dashboard serves 17 distinct developer utilities through a single dynamic catch-all route (`app/(dashboard)/[tool]/page.tsx`). Each tool definition (`lib/tools.ts`) maps its slug to dedicated client-side renderers, avoiding redundant layout boilerplate across pages.

Utilities like the Timezone Converter, JSON Formatter, Case Converter, UUID Generator, and Color Palette Extractor run entirely in the browser using Web APIs and Web Workers. The AI Background Remover integrates a dedicated API route (`app/api/remove-bg/route.ts`) for serverless image processing.

Built with Next.js 15, TypeScript, Tailwind CSS, and Lucide React, the application supports responsive sidebars and instant tool search filtering.

## Local setup

```bash
npm install
npm run dev
```

To build for production:

```bash
npm run build
npm run start
```

## State

The project builds cleanly on Next.js 15. All 17 tools listed in the tool registry are active and functional.

## License

MIT
