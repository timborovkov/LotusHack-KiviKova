import { z } from "zod/v4";

// ---------------------------------------------------------------------------
// Integration catalog schema
// ---------------------------------------------------------------------------

const categoryEnum = z.enum([
  "communication",
  "project-management",
  "dev-tools",
  "crm",
  "productivity",
  "other",
]);

const authModeEnum = z.enum(["api_key", "token", "oauth", "none"]);

const integrationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  category: categoryEnum,
  tags: z.array(z.string()),
  featured: z.boolean(),
  status: z.enum(["available", "coming-soon"]),

  // Connection
  serverUrl: z.string().nullable(),
  authMode: authModeEnum,
  docsUrl: z.string(),
  setupInstructions: z.string(),

  // Marketing
  examplePrompts: z.array(z.string()),
  sampleResponses: z.array(z.string()),
});

export type Integration = z.infer<typeof integrationSchema>;
export type IntegrationCategory = z.infer<typeof categoryEnum>;

// ---------------------------------------------------------------------------
// Catalog data
// ---------------------------------------------------------------------------

const CATALOG: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    description:
      "Search messages, channels, and users. Send follow-ups after meetings.",
    logo: "/integrations/slack.svg",
    category: "communication",
    tags: ["messaging", "notifications", "team-chat"],
    featured: true,
    status: "available",
    serverUrl: null,
    authMode: "token",
    docsUrl: "https://api.slack.com/authentication/token-types",
    setupInstructions:
      "Create a Slack app, add the required scopes, and paste the Bot User OAuth Token.",
    examplePrompts: [
      "What did the team discuss in #engineering today?",
      "Send a follow-up to #product-updates about what we decided",
    ],
    sampleResponses: [
      "The team discussed the Q3 roadmap and agreed to prioritize the API redesign.",
    ],
  },
  {
    id: "linear",
    name: "Linear",
    description:
      "Check sprint status, look up issues, and create tasks from meetings.",
    logo: "/integrations/linear.svg",
    category: "project-management",
    tags: ["issues", "sprints", "project-tracking"],
    featured: true,
    status: "available",
    serverUrl: null,
    authMode: "api_key",
    docsUrl: "https://linear.app/settings/api",
    setupInstructions:
      "Go to Linear Settings > API > Create a personal API key and paste it here.",
    examplePrompts: [
      "What's left in the current sprint?",
      "Create a ticket for the bug we just discussed",
    ],
    sampleResponses: [
      "There are 5 open issues in Sprint 24: 2 high priority, 3 medium.",
    ],
  },
  {
    id: "github",
    name: "GitHub",
    description: "Check PRs, review commits, and look up repository activity.",
    logo: "/integrations/github.svg",
    category: "dev-tools",
    tags: ["code", "pull-requests", "repositories"],
    featured: true,
    status: "available",
    serverUrl: null,
    authMode: "token",
    docsUrl:
      "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens",
    setupInstructions:
      "Create a Personal Access Token (classic or fine-grained) with repo access.",
    examplePrompts: [
      "What changed in the last deploy?",
      "Show me open PRs on the main repo",
    ],
    sampleResponses: [
      "The last deploy included 3 PRs: auth fix, billing update, and UI polish.",
    ],
  },
  {
    id: "notion",
    name: "Notion",
    description:
      "Search pages, databases, and wiki content for context during calls.",
    logo: "/integrations/notion.svg",
    category: "productivity",
    tags: ["wiki", "docs", "databases"],
    featured: true,
    status: "available",
    serverUrl: null,
    authMode: "token",
    docsUrl: "https://www.notion.so/my-integrations",
    setupInstructions:
      "Create a Notion integration, share the relevant pages with it, and paste the Internal Integration Secret.",
    examplePrompts: [
      "What does our product roadmap say about Q4?",
      "Find the onboarding checklist in Notion",
    ],
    sampleResponses: [
      "The Q4 roadmap lists 3 priorities: integrations, mobile app, and enterprise features.",
    ],
  },
  {
    id: "jira",
    name: "Jira",
    description:
      "Look up tickets, check sprint boards, and track project progress.",
    logo: "/integrations/jira.svg",
    category: "project-management",
    tags: ["issues", "sprints", "agile"],
    featured: false,
    status: "available",
    serverUrl: null,
    authMode: "api_key",
    docsUrl:
      "https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/",
    setupInstructions:
      "Create an API token from your Atlassian account settings. Use your email as username and the token as password.",
    examplePrompts: [
      "What's the status of PROJ-123?",
      "How many tickets are in the current sprint?",
    ],
    sampleResponses: [
      "PROJ-123 is in progress, assigned to Alice, due Friday.",
    ],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description:
      "Check schedules, find meeting conflicts, and look up upcoming events.",
    logo: "/integrations/google-calendar.svg",
    category: "productivity",
    tags: ["calendar", "scheduling", "events"],
    featured: false,
    status: "coming-soon",
    serverUrl: null,
    authMode: "oauth",
    docsUrl: "https://developers.google.com/calendar",
    setupInstructions: "Connect via Google OAuth (coming soon).",
    examplePrompts: [
      "When is the next meeting with the design team?",
      "Do I have any conflicts on Thursday?",
    ],
    sampleResponses: [
      "Your next meeting with the design team is Wednesday at 2pm.",
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description:
      "Look up contacts, deals, and company data during client calls.",
    logo: "/integrations/hubspot.svg",
    category: "crm",
    tags: ["contacts", "deals", "sales"],
    featured: false,
    status: "coming-soon",
    serverUrl: null,
    authMode: "api_key",
    docsUrl: "https://developers.hubspot.com/docs/api/private-apps",
    setupInstructions:
      "Create a private app in HubSpot and paste the access token (coming soon).",
    examplePrompts: [
      "What's the deal size for Acme Corp?",
      "When was our last interaction with this contact?",
    ],
    sampleResponses: [
      "Acme Corp has an open deal worth $45,000 in the negotiation stage.",
    ],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description:
      "Access accounts, opportunities, and customer records in real-time.",
    logo: "/integrations/salesforce.svg",
    category: "crm",
    tags: ["accounts", "opportunities", "sales"],
    featured: false,
    status: "coming-soon",
    serverUrl: null,
    authMode: "oauth",
    docsUrl: "https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta",
    setupInstructions: "Connect via Salesforce OAuth (coming soon).",
    examplePrompts: [
      "Pull up the account details for this client",
      "What opportunities are closing this quarter?",
    ],
    sampleResponses: [
      "There are 12 opportunities closing this quarter, total pipeline $380K.",
    ],
  },
];

// Validate all entries at import time
for (const entry of CATALOG) {
  integrationSchema.parse(entry);
}

// ---------------------------------------------------------------------------
// Loader functions (stable interface for future DB migration)
// ---------------------------------------------------------------------------

export function getIntegrations(): Integration[] {
  return CATALOG;
}

export function getIntegration(id: string): Integration | undefined {
  return CATALOG.find((i) => i.id === id);
}

export function getFeaturedIntegrations(): Integration[] {
  return CATALOG.filter((i) => i.featured);
}

export function getIntegrationsByCategory(
  category: IntegrationCategory
): Integration[] {
  return CATALOG.filter((i) => i.category === category);
}

export function getAvailableIntegrations(): Integration[] {
  return CATALOG.filter((i) => i.status === "available");
}

export const CATEGORIES: { value: IntegrationCategory; label: string }[] = [
  { value: "communication", label: "Communication" },
  { value: "project-management", label: "Project Management" },
  { value: "dev-tools", label: "Dev Tools" },
  { value: "crm", label: "CRM" },
  { value: "productivity", label: "Productivity" },
  { value: "other", label: "Other" },
];
