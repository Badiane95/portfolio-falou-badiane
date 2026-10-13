# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio for Falou Badiane (BUT MMI student, web developer / automation). All user-facing text, validation messages and code comments are in **French**; keep new UI copy in French.

The repo was scaffolded from a **Manus full-stack web template** (React + Vite client, Express + tRPC server, Drizzle/MySQL). Much of `server/_core/` is template infrastructure (Manus OAuth, LLM chat, image generation, S3 storage, maps, voice transcription) that the portfolio does not use. The only feature-specific backend code is the `contact` router in `server/routers.ts`.

## Commands

Package manager is **pnpm**. `pnpm-lock.yaml` is out of sync with `package.json`, so a frozen install fails. Use `pnpm install --no-frozen-lockfile`, which is also what `vercel.json` runs.

```bash
pnpm dev        # tsx watch server/_core/index.ts — Express + Vite middleware (HMR), port 3000 or next free port
pnpm build      # vite build → dist/public, then esbuild server/_core/index.ts → dist/index.js
pnpm start      # NODE_ENV=production node dist/index.js (serves dist/public + API)
pnpm check      # tsc --noEmit (client, server and shared in one project)
pnpm test       # vitest run — only server/**/*.test.ts / *.spec.ts, node environment
pnpm format     # prettier --write . (no ESLint in this repo)
pnpm db:push    # drizzle-kit generate && migrate — requires DATABASE_URL

# Single test file / single test by name
pnpm exec vitest run server/contact.test.ts
pnpm exec vitest run server/contact.test.ts -t "invalid email"
```

The README mentions `pnpm preview`, but no such script exists.

`dist/` is committed to git, so running `pnpm build` produces tracked changes.

## Architecture

### Server entry points (keep in sync)
There are three Express entry points. When you add an API route, register it in both of the first two:
- `server/_core/index.ts` is used by `pnpm dev`/`pnpm start`. It mounts OAuth (`/api/oauth/callback`), chat (`/api/chat`) and tRPC (`/api/trpc`), then either Vite middleware (dev) or static `dist/public` with an SPA fallback (prod).
- `api/index.ts` is the **Vercel serverless function**. It holds the same API wiring with no static serving and exports the app. `vercel.json` rewrites `/api/*` to it and every other non-asset path to `/index.html`.
- `server/index.ts` is a legacy static-only server. No script references it.

### tRPC (end-to-end types)
- Procedures are defined in `server/routers.ts` (`appRouter`), using `publicProcedure` / `protectedProcedure` / `adminProcedure` from `server/_core/trpc.ts`. The superjson transformer is used on both sides.
- `server/_core/context.ts` tries Manus SDK auth on every request; `ctx.user` is `null` when unauthenticated.
- The client imports the `AppRouter` **type** directly from `server/routers.ts` (`client/src/lib/trpc.ts`). `client/src/main.tsx` sets up `httpBatchLink` to `/api/trpc` and redirects to the Manus login when a query or mutation fails with `UNAUTHED_ERR_MSG`.
- Tests call procedures with `appRouter.createCaller(ctx)` and a hand-built context, mocking `./_core/notification` (see `server/contact.test.ts`).

### Contact form flow
The form in `client/src/pages/Home.tsx` validates on the client, then calls `trpc.contact.send`. That procedure runs zod validation (French messages) and then:
1. `notifyOwner()` sends a Manus notification.
2. `sendEmail()` (`server/_core/emailService.ts`) sends a confirmation to the visitor.
3. `sendEmail()` sends a message to `OWNER_EMAIL`.

Both send helpers POST to the Manus Forge API (`BUILT_IN_FORGE_API_URL` / `BUILT_IN_FORGE_API_KEY`). A delivery failure is only logged as a warning, and the mutation still returns success. Without the Forge env vars, `sendEmail` returns `false`, which is why tests pass without network access.

### Environment
`server/_core/env.ts` reads: `VITE_APP_ID`, `JWT_SECRET`, `DATABASE_URL`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `OWNER_EMAIL`. The client reads `VITE_*` vars (e.g. `VITE_OAUTH_PORTAL_URL`), and Vite's `envDir` is the repo root. The database is optional: `getDb()` in `server/db.ts` returns `null` without `DATABASE_URL`. The Drizzle schema (`drizzle/schema.ts`) contains only the template `users` table.

### Client
- Vite root is `client/`. Path aliases are `@/` → `client/src/` and `@shared/` → `shared/`; they are defined in `vite.config.ts`, `vitest.config.ts` and `tsconfig.json`.
- Routing uses **wouter 3.7.1 with a pnpm patch** (`patches/wouter@3.7.1.patch`, which records route paths on `window.__WOUTER_ROUTES__`). Routes are declared in `client/src/App.tsx`. `App.tsx` calls `useHashLocation()` but never passes it to a `<Router>`, so routing is actually path-based (`/projects`, `/about`, …). Deep links work only because of the server and Vercel SPA fallbacks. `Navbar.tsx` uses plain `<a href>` (full page loads), not wouter `<Link>`.
- Each page renders its own `<Navbar />`; there is no shared layout component. `ComponentShowcase.tsx` is an unrouted template demo page.
- Styling uses Tailwind CSS v4 through `@tailwindcss/vite`. Theme tokens live in `client/src/index.css`. shadcn/ui components ("new-york" style, `components.json`) are generated into `client/src/components/ui/`. Pages also use hard-coded brand hex colors: primary `#0052CC` and accent cyan `#06B6D4`. The font is Rubik. Design rationale is in `ideas.md` (approach 1, "Minimalisme Moderne Technologique").
- Scroll animations use AOS: `data-aos` attributes, with `AOS.init` in `Home.tsx` and `AOS.refresh` in `Footer.tsx`.
- Static files (CV PDFs, project images) live in `client/public/`.
- `vite.config.ts` includes Manus-specific plugins: a runtime plugin, jsx-loc, and a debug collector that writes browser logs to `.manus-logs/` in dev. They are template plumbing.

### Deployment
Vercel is the active target (`vercel.json`; output directory `dist/public`, API in `api/index.ts`). The GitHub Pages workflow sits at `github/workflows/deploy.yml`, **not** `.github/`, so GitHub Actions never runs it. A static GitHub Pages deploy could not serve the tRPC API in any case.

`todo.md` holds the feature checklist (in French).
