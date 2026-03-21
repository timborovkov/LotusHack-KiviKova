# TODO

## P0 — Core Pipeline (makes the app functional)

- **Recall.ai transcript webhook** — Create `src/app/api/webhooks/recall/transcript/route.ts` to receive real-time transcript chunks from Recall.ai bot
- **Embedding pipeline** — Wire transcript reception → `createEmbedding()` → Qdrant upsert with payload `{ text, speaker, timestamp_ms, type }` into the meeting's collection
- **Vector search endpoint** — Create `src/app/api/search/route.ts` accepting a query string + optional meetingId, returns relevant transcript segments via cosine similarity

## P1 — Voice Agent (the differentiator)

- **OpenAI Realtime API integration** — Add `src/lib/openai/voice.ts` for bidirectional audio streaming (listen + speak)
- **RAG-powered responses** — When agent is asked a question during a call, search Qdrant for context (current meeting + past meetings), feed into LLM, generate spoken response
- **Cross-meeting search** — Either maintain a global Qdrant collection with `meeting_id` in payload, or fan-out search across per-meeting collections

## P2 — Post-Meeting Processing

- **Meeting summary generation** — After meeting ends (status → `processing`), generate a summary from all embedded segments using an LLM, store in `metadata.summary`
- **Meeting notes UI** — Add `/dashboard/[id]` page showing transcript timeline, summary, and search within a single meeting
- **Participants tracking** — Populate `participants` JSONB from bot transcript speaker data

## P3 — UX Polish

- **Real-time status updates** — Poll or SSE so dashboard reflects meeting status changes without manual refresh
- **Error toasts** — Surface API errors to the user (e.g. shadcn sonner/toast component)
- **Meeting filters/search** — Filter dashboard by status, search by title
- **Confirmation dialogs** — Confirm before delete and before stopping an active agent

## P4 — Production Readiness

- **Authentication** — Add auth (e.g. NextAuth / Clerk) to protect dashboard and API routes
- **Rate limiting** — Protect webhook and public API endpoints
- **Structured logging** — Replace `console.log` with a proper logger
- **Env validation** — Validate required env vars at startup with Zod
