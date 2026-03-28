# TODO

## Completed

- Core Pipeline (functional baseline)
- Voice Agent (differentiator)
- Post-Meeting Processing
- UX Polish
- Authentication
- Live Voice Agent
- Chat with Meeting Notes
- Knowledge Base (file uploads + RAG)
- Meeting-Scoped Knowledge
- Meeting Context & Agenda
- Action Items & Tasks
- MCP Tool Connections
- Data Export
- Production Hardening
- Rebrand to Vernix (`vernix.app`)
- UI Polish & Launch Prep
- Dark Mode & Theme Selector
- User Profiles & SSO
- Password Reset & NextAuth Email Integration
- Silent Agent Mode (Text Agent)
- Switch to TanStack Query
- MCP Server Connection Testing
- Analytics & Monitoring
- Contact Forms & Email
- Welcome Email
- Pricing strategy calculation
- Pricing page (`/pricing`)
- Self-kick agent tool (leave_meeting)
- Switch to silent mode tool (switch_to_silent)
- User mute control (UI kill switch)
- Mute state enforcement
- Hide completed tasks from dashboard action points
- Show meeting-scoped files on knowledge page
- Voice Mode Rewrite (On-Demand Realtime)
- Internal Agent System Documentation (`docs/agent-architecture.md`)
- Fast Wake-Word Detection (Client-Side VAD + gpt-4o-mini-transcribe)
- Billing with Polar (constants, Polar integration, hard caps, usage tracking, billing UI, webhook handler, limit enforcement, paywalls)

## Integrations

- **Define codebase-managed Integration Catalog + schema validation** — Add `src/lib/integrations/catalog.json` (or `catalog.ts`) as the source of truth for predefined integrations (still MCP underneath), validate entries with Zod on load, and include fields like `id`, `name`, `description`, `logo`, `docsUrl`, `serverUrl/template`, `authMode` (`oauth` | `token` | `api_key`), `category` (e.g. CRM, ERP, Project Management, Communication), `tags`, `featured`, `status`, plus marketing fields for `examplePrompts` and `sampleResponses`.
- **Keep catalog interface migration-ready** — Keep the catalog loader/repository interface stable so the source can move from codebase to DB/admin tooling later without rewriting the integrations UI.
- **MCP Client OAuth for external MCP clients** — Implement OAuth auth flow for the MCP endpoint per the [MCP auth spec](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization) (`authorize`, `token`, `register`, PKCE, dynamic client registration) for clients like Cursor and Claude Desktop.
- **Implement integration connect flows by auth mode** — Support OAuth-based connects where available, plus token/API key flows, while storing all connections as MCP server configs.
- **Seed first predefined integrations** — Add an initial curated set (GitHub, Slack, Notion, Linear, Jira, Google Calendar) with accurate metadata and connection requirements.
- **Build `/dashboard/integrations` as the main integration hub** — New page with Featured integrations, searchable library, category + tag filters, and per-integration setup cards. When a user selects an integration, show example prompts + sample responses from catalog metadata. Page is visible to Free and Pro users.
- **Move MCP management from Settings to Integrations** — Migrate MCP UI entry points, keep Settings as a lightweight redirect/deep-link to the new page, and avoid duplicate management surfaces.
- **Gate integration actions to Pro with clear upgrade UX** — Keep integrations page/library visible to Free users, but gate connect/use actions behind Pro with contextual paywall messaging, upgrade CTAs, and trial-to-Pro conversion copy.
- **Add persistent upgrade CTA on `/dashboard/integrations` for Free users** — Add a prominent upgrade surface (header banner + inline integration card CTA states) so Free users always have a clear path to unlock connections.
- **Build reusable "Integration Cloud" section from catalog data** — Create a shared section component for both the main landing page and integrations feature page: featured logos, "questions you can answer", "things the agent can do", example prompts, and sample responses. Render from catalog metadata to avoid duplicate content maintenance.
- **Add "thousands more through MCP" messaging + CTA** — Include a clear extensibility message in the Integration Cloud section with CTA to browse/connect more MCP integrations.
- **Landing page rework for integrations-first conversion** — Rework hero and core sections to position Vernix as an in-call assistant that can answer live business questions using connected tools; add Pro-focused CTAs and upgrade banners.

## Task Management

- **Build `/dashboard/tasks` (cross-call task list)** — Add a dedicated page that lists tasks across all calls (similar information density to the Knowledge page).
- **Enable task completion from list view** — Add checkbox/toggle controls so users can mark tasks complete/incomplete directly from the task list.
- **Improve dashboard tasks widget navigation** — Show only top 3 pending tasks on the dashboard and link the widget to `/dashboard/tasks`.
- **Add "open related call" actions** — Include a direct link from each task to its source call detail page.
- **Add task source context** — Store and display the transcript snippet/timestamp that created each task, linking to the relevant transcript anchor.

## Empty States & Onboarding UX

- **Dashboard calls empty state** — Add a primary "Start your first call" card when the user has no calls.
- **Knowledge page empty state** — Add a primary "Upload your first document" card when there are no knowledge files.
- **Integrations page empty state** — Add a primary "Connect your first integration" card when no integrations are configured.
- **Dashboard knowledge nudge** — Add a dashboard notice when no documents exist, with CTA copy focused on giving the agent business context.
- **Dashboard integrations nudge** — Add a dashboard notice when no integrations exist, with tool-use examples (CRM lookup, calendar checks, Slack follow-up actions).

## Call Detail Page UX

- **Restructure call detail into tabs/routes** — Split the long call page into focused sections (transcript, knowledge, tasks, summary, recording, participants).
- **Define deep-link strategy for call pages** — Use route segments for major sections (e.g. `/call/:id/transcript`) and anchors for intra-section jumps (e.g. `#recording`).
- **Improve transcript readability** — Add a bounded transcript panel with internal scroll to reduce full-page scroll fatigue.
- **Promote agent chat on call page** — Make chat a more prominent panel/sidebar and provide contextual deep links for non-renderable assets (e.g. recordings).
- **Improve call link UX** — Add a dedicated call link action on call detail, styled as a button with icon and opening in a new tab.

## Call Reliability, Export & Recovery

- **Expand call export completeness** — Include transcript, knowledge, tasks, and recording references in exports; ship media as separate files where applicable.
- **Add missing-summary recovery flow** — Detect missing post-call artifacts and allow re-running summary/task/knowledge post-processing from the call view.

## Product Terminology & Time Display

- **Rename "meetings" to "calls" in product UI copy** — Update user-facing labels for consistency while keeping internal API/schema naming unchanged unless explicitly migrated.
- **Add timezone preference + global formatting** — Introduce a user timezone setting (UTC/local/custom) and ensure all call timestamps honor it consistently.

## SEO & Discoverability

- **robots.txt** — Add `public/robots.txt` allowing all crawlers, pointing to sitemap
- **sitemap.xml** — Generate `src/app/sitemap.ts` listing all public pages (landing, pricing, faq, about, contact, terms, privacy)
- **llms.txt** — Add `public/llms.txt` describing Vernix for AI search engines (ChatGPT, Perplexity, Gemini, Claude)
- **Google Search Console** — Verify domain, submit sitemap, monitor indexing
- **Schema markup** — Add JSON-LD structured data: Organization, SoftwareApplication, FAQ schema on the FAQ page
- **Meta tags audit** — Verify all pages have unique title, description, and OG images
- **Canonical URLs** — Ensure all pages have proper canonical tags via metadataBase

## Meeting Recordings & Recall Data Sync

- **Audit Recall data** — Investigate what data Recall provides after a meeting: video recording (MP4), participant events, meeting metadata, speaker timeline. Map what's available via their API.
- **Webhook fallback fetch** — Implement a reliability fallback that actively fetches meeting/recording/transcript status from Recall when expected webhooks are delayed or missing (scheduled retries + reconciliation job).
- **Copy recordings to our storage** — After `recording_done`, download the video MP4 from Recall's S3 URL (expires after 6h) and upload to our S3/Minio bucket. Store the S3 key in meeting metadata.
- **Participant data** — Fetch participant events and speaker timeline from Recall, store in meeting metadata (currently only populated from transcript speaker names).
- **Video playback UI** — Add a video player to the meeting detail page. Sync transcript timeline with video position (click a transcript line → seek to that timestamp).
- **Recording retention** — Decide on storage policy: keep forever, expire after N days, or let user choose. Estimate storage costs per meeting minute.
- **Privacy controls** — Let users disable recording storage per meeting. Delete recording when meeting is deleted. Clear deletion from S3 bucket.

## Public REST API & Documentation

- **API design** — Design a clean, versioned REST API (`/api/v1/`) exposing meetings, transcripts, tasks, search, knowledge base, and agent control (join/stop). Mirrors the existing internal routes but with stable contracts and proper error responses.
- **OpenAPI spec** — Write an OpenAPI 3.1 spec (`openapi.yaml`) documenting all endpoints, request/response schemas, auth (Bearer API key), pagination, and error codes.
- **API docs page** — Host interactive docs at `/docs` or `/api-docs` (Scalar, Swagger UI, or similar). Auto-generated from the OpenAPI spec.
- **Agent control endpoints** — `POST /api/v1/meetings` (create + auto-join), `POST /api/v1/meetings/:id/join` (join existing), `POST /api/v1/meetings/:id/stop` — lets external tools and agents invite Vernix to calls on the fly with just a meeting link.
- **MCP server tools** — Add `join_meeting` and `stop_meeting` tools to the MCP server so Claude Desktop / Cursor users can say "join this call" and paste a link.
- **Rate limiting & versioning** — Per-key rate limits, API version in URL path, deprecation headers.
- **SDKs** — Consider auto-generating TypeScript/Python SDKs from the OpenAPI spec.

## Claude Code Skill for Vernix

- **Vernix skill** — Create a Claude Code skill (`vernix`) that lets AI agents interact with Vernix via the REST API. Agents could list meetings, search transcripts, get summaries, create tasks, and ask questions about meeting content.
- **Skill packaging** — Publish as an installable skill with proper SKILL.md, tool definitions, and auth flow (API key from Vernix settings)
- **MCP + REST** — Skill uses the REST API under the hood; MCP server remains as an alternative for direct MCP clients (Claude Desktop, Cursor)
- **Use cases** — "What did we discuss in yesterday's standup?", "Find all action items assigned to me", "Search meetings for mentions of the Q4 roadmap"

## Security Hardening & Infra Go-Live Check

- **Set provider usage caps** — Add usage caps in OpenAI, Recall, and other third-party services.
- **Set Railway usage caps** — Add spend/usage caps and guardrails in Railway.
- **Configure alerting** — Configure alerts for cost, error rate, downtime, and abuse signals.
- **Configure Railway autoscaling** — Tune autoscaling limits and policies for safe production traffic handling.
- **Configure edge/network protection** — Set up firewalls and abuse blocking rules.
- **Run security scan & audit** — Run a security scan/audit with a tool like [Snyk](https://snyk.io/), then track/fix findings.
- **Block malicious bots** — Add bot blocking at app/edge level.
- **Internal blocklist controls** — Add internal admin tooling to quickly blocklist abusive IPs, emails, and user accounts.
- **Collect and attribute usage telemetry** — Track token usage, Recall usage, and related costs; attribute to users and flag abnormalities.
- **Block brute-force attempts** — Add brute-force protection on auth and other sensitive endpoints.
- **Enforce hard product usage caps** — Enforce hard caps for storage, embeddings, and meetings.
- **Restrict knowledge base uploads** — Enforce strict file type allowlist and size limits for uploaded knowledge base documents.
- **Validate and sanitize all user input** — Enforce max length limits and strict schema validation on all user-provided fields, and sanitize inputs before storage/use.
- **Admin account data purge** — Add an admin operation to fully remove all data for a user account across DB records, object storage bucket data, and Recall resources.

## Blog & Content

- **Blog infrastructure** — Add a `/blog` section to the website. MDX or markdown-based posts with frontmatter (title, date, author, slug, description). Static generation via Next.js.
- **Blog list page** — `/blog` showing all posts sorted by date with title, excerpt, and read time
- **Blog post page** — `/blog/[slug]` rendering full post with proper typography, OG images, and author info
- **Initial posts** — Write 3-5 launch posts:
  - "Introducing Vernix — an AI agent for your video calls"
  - "How Vernix transcribes and searches across all your meetings"
  - "Voice agent vs. silent mode: when to use each"
  - "Building Vernix: from hackathon idea to production"
  - "Why we built MCP integration into a meeting tool"

## Google Analytics Sales Funnel

- **Funnel events** — Define and instrument key conversion events: landing page → signup → first meeting → upgrade
- **Goal configuration** — Set up GA4 conversions for signup, first meeting created, plan upgrade
- **Attribution** — UTM parameter tracking across signup flow for campaign attribution
- **Feature usage event tracking** — Track key in-product feature usage events (chat queries, voice agent usage, silent mode, knowledge uploads, exports, task completion, API key usage) for product analytics beyond funnel conversion.
- **Event taxonomy & dashboards** — Define a consistent event naming schema/properties and build dashboards for activation, retention, and feature adoption trends.

## A/B Testing for Landing Pages

- **Experiment setup** — Add A/B testing framework for landing page variants (headline, hero CTA, social proof blocks, pricing teaser).
- **Variant assignment** — Implement deterministic user/session bucketing and persist variant assignment.
- **Experiment analytics** — Track impressions, CTA clicks, signup starts, and completed signups per variant.
- **Decision workflow** — Define experiment guardrails (minimum sample size, runtime, significance target) and rollout/rollback process.

## Marketing Visual Assets & Product Demo Content

- **Animated demo video** — Create a polished animated product demo (Clueso-style and/or Remotion-based) for landing page hero and social snippets.
- **Narrated product demo** — Record a full product walkthrough with voice narration (Loom-style) covering setup, joining a meeting, transcript/RAG, and action items.
- **Tutorial video series** — Produce short task-focused tutorial videos (1-3 min each) for key workflows and FAQs.
- **Screenshot library** — Capture and curate high-quality screenshots for landing, pricing, docs/help, social previews, and press kit usage.
- **Visual asset pack** — Create supporting branded assets (feature illustrations, icons, UI callout graphics, thumbnails, GIF loops).
- **Site integration pass** — Integrate videos and assets across landing/pricing/content sections with optimized formats, lazy loading, and mobile-safe fallbacks.

## Vision-Based Document Parsing

- **OpenAI Vision for PDFs** — Current PDF parsing (pdfjs-dist) extracts raw text only — images, charts, tables, and scanned pages are invisible. Use GPT-4o vision to process PDF pages as images for richer extraction
- **Image/diagram uploads** — Accept PNG, JPG, SVG uploads in knowledge base, extract descriptions via vision API
- **Hybrid parsing** — Try text extraction first; if a page has low text density, fall back to vision-based extraction
- **Cost management** — Vision API is expensive per page; add per-user limits or make it a premium feature

## Changelog & Status Page

- **CHANGELOG.md** — Create and maintain a changelog file in the repo tracking all releases and notable changes
- **Public changelog page** — `/changelog` page on the website rendering the changelog with dates, version tags, and descriptions
- **Service uptime monitoring** — Monitor all critical dependencies: Vernix app, Recall.ai, OpenAI API, Polar, Railway, Qdrant, S3/Minio. Alert on downtime.
- **Public status page** — Host a public status page (e.g. Openstatus, Instatus, or BetterStack) showing real-time uptime for all services. Link from footer.
