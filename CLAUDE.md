# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm format           # Prettier write
pnpm format:check     # Prettier check
pnpm db:push          # Push Drizzle schema to Postgres (no migration files)
pnpm db:generate      # Generate Drizzle migration files
pnpm db:migrate       # Run migrations
pnpm db:studio        # Drizzle Studio GUI
docker compose up -d  # Start Postgres + Qdrant
```

## Architecture

**KiviKova** is an AI video call agent. Next.js 16 App Router handles both the API and UI. All source lives under `src/`.

### Data Flow

1. User creates a meeting (title + join link) via the dashboard
2. POST `/api/meetings` creates a Qdrant collection and a Postgres row
3. POST `/api/agent/join` dispatches a meeting bot (Recall.ai or mock) to join the call
4. Bot streams audio → transcription → OpenAI embeddings → Qdrant upsert
5. Voice agent queries Qdrant for RAG context across current and past meetings

### Key Layers

- **`src/lib/db/`** — Drizzle ORM. Single `meetings` table with status enum (`pending → joining → active → processing → completed | failed`). Schema changes go in `schema.ts`, then run `pnpm db:push`.
- **`src/lib/meeting-bot/`** — Provider pattern. `MeetingBotProvider` interface with `RecallProvider` and `MockProvider`. Selected via `MEETING_BOT_PROVIDER` env var. Add new providers by implementing the interface and registering in the factory (`index.ts`).
- **`src/lib/vector/`** — Qdrant client singleton. Each meeting gets its own collection (1536-dim Cosine, for `text-embedding-3-small`).
- **`src/lib/openai/`** — OpenAI client singleton. Embedding helpers for single and batch text.
- **`src/hooks/use-meetings.ts`** — Client-side state hook that wraps all meeting API calls.

### API Routes

All under `src/app/api/`:

- `meetings/route.ts` — GET list, POST create (Zod-validated)
- `meetings/[id]/route.ts` — GET, PATCH, DELETE (also deletes Qdrant collection)
- `agent/join/route.ts` — POST starts bot for a meeting
- `agent/stop/route.ts` — POST stops bot, marks meeting completed

### UI

Shadcn/ui with base-ui primitives (not Radix). Use `render` prop instead of `asChild` for composition. Tailwind CSS v4 — config is in CSS (`globals.css` `@theme`), not `tailwind.config.js`.

## Conventions

- **Validation**: Zod v4 schemas on all API inputs (import from `zod/v4`)
- **IDs**: UUID v4 everywhere
- **ORM**: Drizzle enforces WHERE on UPDATE/DELETE via ESLint plugin
- **Singletons**: OpenAI, Qdrant, and DB clients use module-level lazy singletons
- **Path alias**: `@/*` maps to `src/*`

## Environment

Copy `.env.example` to `.env.local`. Requires: `DATABASE_URL`, `QDRANT_URL`, `OPENAI_API_KEY`, `MEETING_BOT_PROVIDER`.
