<!-- Auto-generated guidance for AI coding agents working on this repo -->
# Copilot / AI Agent Instructions — mobileStoreWebApp

This repository is a small monorepo with two main workspaces: `client` (React + Vite) and `server` (Node + Express + SQLite).
Keep instructions focused and actionable — refer to the files below for examples and exact behavior.

Architecture highlights
- Monorepo layout: root `package.json` uses npm workspaces for `client` and `server`.
- Frontend: `client/` (Vite + React + TypeScript). Key files: `client/src/services/api.ts`, `client/src/context/*`, `client/src/pages/*`, `client/src/components/*`.
- Backend: `server/` (Express + TypeScript). Key files: `server/src/server.ts`, `server/src/routes/*.ts`, `server/middleware/auth.ts`, `server/src/db/*` (ensureDatabase, setup, seed).
- API surface: all backend endpoints are under `/api/*` (see `server/src/server.ts`). Frontend `api.ts` targets `VITE_API_URL` or defaults to `http://localhost:5000/api` in development.

What to know about flows & integrations
- Auth: JWT-based. Server expects `JWT_SECRET` in env; middleware for protected routes is `server/middleware/auth.ts`.
- DB: Uses SQLite via `better-sqlite3`. Database initialization is performed by `server/src/db/ensureDatabase.ts` (invoked during server startup). Use `npm run db:setup` / `db:init` / `db:seed` in the `server` workspace when touching DB schema or seed data.
- Client <> Server: `client/src/services/api.ts` adds `Authorization` header using `localStorage.token`. If 401 is returned the client clears auth and redirects to `/login`.
- Production serving: `server` will serve the frontend `client/dist` when `NODE_ENV=production` (see `server/src/server.ts`).

Developer workflows (commands you should use)
- Install everything: `npm run install:all` (root).
- Dev (both): `npm run dev` (root) — runs `server` and `client` concurrently.
- Dev server only: `npm run dev --workspace=server` or `npm run dev:server` (root).
- Dev client only: `npm run dev --workspace=client` or `npm run dev:client` (root).
- Build both: `npm run build` (root) or individually with `--workspace`.
- Server DB tasks (inside `server`): `npm run db:init`, `npm run db:seed`, `npm run db:setup`.
- Start production server (inside `server`): `npm run start` after building (`npm run build --workspace=server`).

Environment and deployment notes
- Server env: `server/ENV_SETUP.txt` documents required env vars. Minimal: `PORT`, `JWT_SECRET`, `DATABASE_PATH`, `NODE_ENV`.
- Dockerfile (repo root) builds only the `server` and expects server builds to be present in `server/dist`. The image only contains the server.
- Procfile: `web: cd server && npm start` — common for Heroku-like platforms.

Project-specific conventions and patterns
- Workspaces: prefer root scripts (use `--workspace` or the root convenience scripts) rather than changing directories.
- DB lifecycle: the server attempts to `ensureDatabaseInitialized()` on startup; prefer using `npm run db:setup` to prepare a production `dist/db` copy (see `package.json` `copy:assets`).
- Frontend environment: Vite uses `VITE_API_URL`. In production the app assumes relative `/api` unless `VITE_API_URL` is set.
- Auth storage: tokens stored in `localStorage` (see `client/src/services/api.ts`) — any changes to auth flow must update the interceptor logic.

Files to inspect first when changing behavior
- Root: `package.json` (workspace scripts), `Dockerfile`, `Procfile`, `README.md`.
- Server: `server/src/server.ts`, `server/src/routes/*`, `server/middleware/auth.ts`, `server/src/db/*`, `server/package.json`, `server/ENV_SETUP.txt`.
- Client: `client/src/services/api.ts`, `client/src/context/AuthContext.tsx`, `client/src/components/Navbar.tsx`, `client/package.json`, `client/vite.config.ts`.

Testing and verification tips
- After schema or seed changes, run `npm run db:setup` in `server` then start the server and hit `/api/health`.
- Frontend dev: `npm run dev --workspace=client` starts Vite at `http://localhost:5173` by default.
- When running the full stack locally, ensure `VITE_API_URL` is unset (client will target `http://localhost:5000/api`) or set to match the server port.

When editing code — do this first
1. Locate the side to change (client vs server). Check corresponding `package.json` and `README.md` notes.
2. For server changes affecting runtime config, update `server/ENV_SETUP.txt` and `server/package.json` scripts if needed.
3. For API changes, update `server/src/routes/*` and then `client/src/services/api.ts` or relevant client calls.

If something is ambiguous, ask the human: provide exact filenames and a short diff suggestion. After making changes, run the minimal verification steps above before proposing a PR.

— End of instructions —
