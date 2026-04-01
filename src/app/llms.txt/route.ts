import { DISPLAY, FREE_TRIAL, LIMITS, PLANS } from "@/lib/billing/constants";
import { getIntegrations, CATEGORIES } from "@/lib/integrations/catalog";
import { RATE_LIMIT_STANDARD, RATE_LIMIT_EXPENSIVE } from "@/lib/api/constants";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vernix.app";

function buildContent(): string {
  const integrations = getIntegrations();
  const available = integrations.filter((i) => i.status === "available");
  const comingSoon = integrations.filter((i) => i.status === "coming-soon");

  const availableByCategory = CATEGORIES.map((cat) => {
    const items = available.filter((i) => i.category === cat.value);
    if (items.length === 0) return "";
    return `### ${cat.label}\n${items.map((i) => `- ${i.name}: ${i.description}`).join("\n")}`;
  })
    .filter(Boolean)
    .join("\n\n");

  const comingSoonList =
    comingSoon.length > 0
      ? `\n\n## Coming Soon\n\n${comingSoon.map((i) => `- ${i.name}: ${i.description}`).join("\n")}`
      : "";

  return `# Vernix

> An AI assistant that joins your video calls, connects to your tools, and answers questions with real business data during meetings.

## What Vernix Does

Vernix is an AI meeting assistant that joins Zoom, Google Meet, Microsoft Teams, and Webex calls. It connects to tools like Slack, Linear, GitHub, and CRM systems, then answers questions and takes action during the call using live data. It also transcribes conversations, generates summaries, extracts action items, and provides searchable meeting history.

## Key Features

- Tool Integrations: Connect Slack, Linear, GitHub, or your CRM. Ask Vernix during a call and get answers from your connected tools.
- Voice Agent: A live voice agent that listens and responds during calls. Say "Vernix" followed by your question.
- Silent Mode: Text-only agent that responds via meeting chat. No audio, no disruption.
- Meeting Transcription: Real-time, speaker-identified transcription. Searchable immediately.
- AI Summaries: Automatic summaries with key decisions after every call.
- Action Items: Tasks extracted from conversations and tracked per meeting.
- Cross-Meeting Search: Semantic search across all your meetings and documents.
- Knowledge Base: Upload PDFs, DOCX, TXT, or Markdown. The agent uses them during calls.

## Pricing

### Free Plan
- ${LIMITS[PLANS.FREE].meetingsPerMonth} silent meetings per month, ${LIMITS[PLANS.FREE].meetingMinutesPerMonth} minutes total
- ${LIMITS[PLANS.FREE].ragQueriesPerDay} AI queries per day
- ${LIMITS[PLANS.FREE].documentsCount} documents, ${LIMITS[PLANS.FREE].totalStorageMB}MB storage
- No credit card required

### Pro Plan
- ${DISPLAY.proMonthly}/month (or ${DISPLAY.proAnnual}/month billed annually)
- ${FREE_TRIAL.days}-day free trial with ${FREE_TRIAL.totalMinutes} minutes of call time
- Voice agent, silent mode, and tool integrations
- ${LIMITS[PLANS.PRO].documentsCount} documents, ${LIMITS[PLANS.PRO].totalStorageMB}MB storage
- ${LIMITS[PLANS.PRO].ragQueriesPerDay} AI queries per day
- ${DISPLAY.monthlyCredit} monthly usage credit included
- Voice calls: ${DISPLAY.voiceRate}, silent calls: ${DISPLAY.silentRate}
- Credit covers ~${DISPLAY.voiceHoursPerCredit}h voice or ~${DISPLAY.silentHoursPerCredit}h silent per month
- API access (${LIMITS[PLANS.PRO].apiRequestsPerDay} requests/day) and MCP server/client connections

## Available Integrations

${availableByCategory}${comingSoonList}

## API

Vernix provides a REST API and MCP server for programmatic access to meetings, transcripts, tasks, search, and more.

- API Documentation: ${BASE_URL}/docs
- OpenAPI Spec: ${BASE_URL}/api/v1/openapi.json
- Authentication: Bearer token with API key (create at ${BASE_URL}/dashboard/settings)
- Rate Limits: ${RATE_LIMIT_STANDARD} requests/minute standard, ${RATE_LIMIT_EXPENSIVE} requests/minute for search/agent operations
- Daily Quota: ${LIMITS[PLANS.PRO].apiRequestsPerDay} requests/day (Pro plan)

### REST API Endpoints

- GET /api/v1/meetings — List meetings (paginated, filterable by status)
- POST /api/v1/meetings — Create a meeting (with optional autoJoin)
- GET /api/v1/meetings/:id — Get meeting details
- POST /api/v1/meetings/:id/join — Join the Vernix agent to a call
- POST /api/v1/meetings/:id/stop — Stop the agent and trigger processing
- GET /api/v1/meetings/:id/transcript — Get full meeting transcript
- GET /api/v1/meetings/:id/tasks — List tasks for a meeting
- GET /api/v1/tasks — List all tasks across meetings
- GET /api/v1/search?q=query — Semantic search across transcripts and documents
- GET /api/v1/knowledge — List uploaded documents
- POST /api/v1/knowledge — Upload a document (PDF, DOCX, TXT, MD)

### MCP Server

Vernix exposes an MCP (Model Context Protocol) server for AI assistants like Claude Desktop, Cursor, and others.

- MCP Endpoint: ${BASE_URL}/api/mcp
- Transport: Streamable HTTP (with SSE fallback)
- Auth: Same API key as REST API (Bearer token)

Available MCP tools:
- search_meetings: Search transcripts and knowledge base via vector similarity
- list_meetings: List meetings with optional status filter
- get_meeting: Get meeting details including summary and agenda
- get_transcript: Get full transcript with speaker labels
- list_tasks: List action items across meetings
- create_task: Create a task for a specific meeting
- vernix_join_call: Create a meeting and join the agent
- vernix_stop_call: Stop the agent and trigger processing
- vernix_search_meetings: Semantic search with structured results
- vernix_search_tasks: Search and filter tasks

## Links

- Homepage: ${BASE_URL}
- Tool Integrations: ${BASE_URL}/features/integrations
- Meeting Memory: ${BASE_URL}/features/meeting-memory
- Knowledge Base: ${BASE_URL}/features/context
- Pricing: ${BASE_URL}/pricing
- FAQ: ${BASE_URL}/faq
- Contact: ${BASE_URL}/contact
- API Docs: ${BASE_URL}/docs
`;
}

export function GET() {
  return new Response(buildContent(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
