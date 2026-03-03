# Copilot Instructions for `dev-tools`

## Big picture (read this first)
- This repo is in a **migration phase**: the root app is a Next.js 15 dashboard shell, while most tool implementations still live in standalone Vite folders.
- The active web app is the App Router project under `app/` + shared UI in `components/`.
- Tool metadata is centralized in `lib/tools.ts`; both the dashboard grid and sidebar navigation are generated from that list.
- Current tool routes (`app/(dashboard)/[tool]/page.tsx`) are placeholders that resolve slug + metadata and render a migration notice.

## Architecture and key flows
- Root layout: `app/layout.tsx` imports `app/globals.css` and applies Inter font.
- Dashboard shell: `app/(dashboard)/layout.tsx` wraps pages with `SidebarProvider`, `AppSidebar`, and top bar.
- Tool listing flow:
  1. `lib/tools.ts` exports `tools` + `getToolBySlug`.
  2. `app/(dashboard)/page.tsx` maps `tools` to `ToolCard`.
  3. `components/app-sidebar.tsx` maps the same `tools` for nav entries.
  4. `app/(dashboard)/[tool]/page.tsx` uses `generateStaticParams()` from `tools`.

## Developer workflows
- Root app (from repo root):
  - `npm run dev` → Next.js dashboard
  - `npm run build`
  - `npm run lint` (strict: `--max-warnings=0`)
- Legacy tools run independently in their own folders (mostly Vite): `npm install`, then `npm run dev` inside that folder.
- No root test suite is currently configured; lint/build are primary validation steps.

## Project conventions (important)
- Use TypeScript + strict mode in root app (`tsconfig.json`); keep shared types in `lib/` when reused.
- Use `@/*` imports (configured in `tsconfig.json`) instead of deep relative paths.
- Keep utility class composition with `cn()` from `lib/utils.ts`.
- Reuse existing shadcn-style primitives in `components/ui/*`; avoid introducing parallel UI patterns.
- Keep tool slugs/hrefs consistent across route and registry (`slug: "time-converter"` ↔ `href: "/time-converter"`).

## When adding or migrating a tool
- Update `lib/tools.ts` first (single source of truth).
- Add icon mapping in:
  - `app/(dashboard)/page.tsx` (`toolIcons`)
  - `components/app-sidebar.tsx` (`toolIcons`)
- If creating a real tool page, replace placeholder content in `app/(dashboard)/[tool]/page.tsx` with a slug-based render path (or migrate to dedicated route segment).
- Prefer migrating logic from legacy `*/src/utils/*` modules into typed `lib/` helpers when shared.

## Styling and Tailwind notes
- Tailwind v4 is configured via PostCSS plugin (`postcss.config.mjs`) and CSS imports in `app/globals.css`.
- Theme tokens are CSS variables in `app/globals.css`; use semantic classes (`bg-background`, `text-foreground`, etc.) instead of hard-coded colors.
- `@apply` is used in globals; if editor shows `Unknown at rule @apply`, set workspace linting to ignore unknown at-rules (editor-only issue).

## External integrations and boundaries
- `bg-remover/api/remove-bg.js` calls remove.bg API with `REMOVE_BG_API_KEY` (legacy app integration pattern).
- Most other tools are browser-only utilities in their standalone folders and are not yet wired into Next.js runtime.
- Avoid refactoring legacy folders unless task explicitly targets migration; root Next app is the primary surface for new work.
