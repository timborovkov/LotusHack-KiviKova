# Vernix Demo Video v1 — Script & Production Guide

_Target length: 75–90 seconds_
_Format: 1920x1080, 30fps_
_Voiceover + background music + on-screen text_

---

## Style Guide

All visual decisions derive from `docs/design-system.md`. This section extracts the relevant tokens for video production.

### Colors (Dark Mode — video is dark-mode only)

Source: OKLCH tokens from `src/app/globals.css`

| Token              | OKLCH value              | Approx hex | Use in video                            |
| ------------------ | ------------------------ | ---------- | --------------------------------------- |
| `background`       | `oklch(0.145 0 0)`      | `#1a1a1a`  | Full-frame background, scene bg         |
| `foreground`       | `oklch(0.985 0 0)`      | `#fafafa`  | Headlines, primary text                 |
| `muted-foreground` | `oklch(0.708 0 0)`      | `#b0b0b0`  | Subtitles, secondary text               |
| `card`             | `oklch(0.205 0 0)`      | `#2e2e2e`  | Screenshot frame/border tint            |
| `ring` (accent)    | `oklch(0.65 0.18 290)`  | ~violet    | Highlight underlines, CTA glow, accents |
| `accent`           | `oklch(0.25 0.04 290)`  | ~deep violet | Subtle background tints               |
| `accent-foreground`| `oklch(0.85 0.12 290)`  | ~light violet | Accent text                          |

Status colors (hardcoded, semantic):
- Success/active: `green-600` text, `green-950` bg
- Warning/processing: `yellow-600` text
- Error/failed: `red-600` text

### Typography

| Role             | Font       | CSS variable       | Video equivalent                |
| ---------------- | ---------- | ------------------ | ------------------------------- |
| Headlines & body | Geist Sans | `--font-geist-sans` | Use Geist Sans (Google Fonts)  |
| Monospace        | Geist Mono | `--font-geist-mono` | Code snippets if any           |

Video type scale (adapted from the app's scale for screen legibility):

| Use                | Size    | Weight | Notes                                |
| ------------------ | ------- | ------ | ------------------------------------ |
| Scene headline     | 56–64px | 700    | Main text per scene, `foreground`    |
| Subtitle / tagline | 28–32px | 500    | Below headline, `muted-foreground`   |
| CTA text           | 48px    | 700    | Final scene, `foreground` with glow  |
| URL                | 32px    | 400    | `muted-foreground`                   |

### Brand Assets

All in `public/brand/`. For the video (dark background):

| Asset                                  | Use                             |
| -------------------------------------- | ------------------------------- |
| `brand/combo/horizontal-dark-nobg.png` | Logo in intro & CTA scenes     |
| `brand/icon/icon-dark-512.png`         | Standalone icon if needed       |
| `brand/wordmark/wordmark-dark.png`     | Wordmark alone (CTA scene)     |
| `brand/og/og-with-subtitle.png`        | Reference for tone/composition  |

### Border Radius

From design system: `--radius: 0.625rem` (10px). For screenshots in video, use `16px` rounded corners (slightly larger for screen presentation).

### Motion

From design system: easing is `cubic-bezier(0.25, 1, 0.5, 1)` (ease-out-quart). The brand principle: "purposeful and subtle — motion should enhance understanding, never distract."

The video should feel like things *arrive*, not *bounce in*. Everything enters with confidence — appears where it belongs, no overshoot.

In Remotion:
- Use `spring({ fps: 30, config: { damping: 200 } })` for all entrances — smooth deceleration, zero bounce
- Text: fade in over 10 frames (~300ms)
- Screenshots: slide up 20px + fade in over 12 frames (~400ms), slightly delayed after the text they illustrate
- Scene transitions: `fade()` via `<TransitionSeries>`, 10 frames (~300ms)
- No scale bounces, no elastic effects, no playful motion. This is a professional tool, not a consumer app

### Pacing

The rhythm follows the voiceover. The VO sets the pace — visuals follow, never lead.

- **Text appears on the beat** — the on-screen headline lands as the VO hits the key phrase
- **Screenshots follow, not compete** — slide in ~1s after the scene starts, so the viewer hears the context before seeing the UI
- **Hold before cutting** — every screenshot stays on screen for 2–3 seconds after the VO line finishes. Let the viewer absorb it. Rushing between screenshots feels like a slideshow, not a story
- **The hero scene (Scene 6) gets extra room** — 12 seconds instead of 6–7. This is the moment that sells the product. Don't rush it
- **CTA holds for 5 full seconds** — the logo, text, and URL sit there in silence (with music). Let the viewer decide to act

### Voiceover Direction

- **Voice:** Mid-range, natural. The voice of someone who built this and is quietly proud of it — not someone reading ad copy. Calm authority, not enthusiasm
- **Pace:** ~140 words per minute. Breathing room between sentences. The hook (Scene 1) should be slightly faster and more conversational — like telling a story. The hero moment (Scene 6) slows down. The CTA is deliberate, with a beat of silence before "Try Vernix free"
- **What to avoid:** Upward inflection at the end of sentences (sounds uncertain). Over-emphasis on product name. Exclamation-point energy
- **AI VO:** ElevenLabs with `eleven_multilingual_v2` model. Test voices: "Daniel" (warm, measured), "Adam" (clear, direct), "Rachel" (confident, approachable). Pick whichever sounds least like a text-to-speech engine. If it sounds generated, record it yourself
- **Format:** WAV or MP3, 44.1kHz. Record per-scene for easier Remotion alignment

### Music

The music is not decoration — it sets the emotional arc.

- **Scenes 1–2 (hook + intro):** Sparse. A low pad or soft pulse. Almost ambient. The VO needs to land without competition
- **Scenes 3–7 (product walkthrough):** Builds subtly. A gentle beat or rhythm enters. Still low (~15–20% volume). Adds forward momentum without rushing
- **Scenes 8–10 (post-call features):** Slight lift. The beat becomes more defined. The viewer should feel "this keeps getting better"
- **Scene 11 (CTA):** Music swells to ~30% volume as the VO ends. Holds on a resolved chord or clean loop. Confident, not triumphant
- **Genre:** Minimal electronic. Think Tycho, Kiasmos, or the quieter side of Bonobo — not EDM, not lo-fi hip-hop beats. Clean, modern, unhurried
- **Sources:** artlist.io or epidemicsound.com. Search "ambient technology", "minimal electronic", or "modern product demo". Avoid anything with vocal samples or lyrics

---

## Scene Breakdown

### Scene 1 — Hook (0:00–0:06)

**Voiceover:**
> "Halfway through a standup, someone asks for the sprint status. Nobody has the tab open. The meeting stalls. Sound familiar?"

**On-screen text:**
> The answer is in another tab.

**Visual:** `background` fill. Text in `foreground` color, Geist Sans 56px bold. Fades in line by line (staggered 400ms). Subtle radial gradient pulse behind text using `accent` color at low opacity.

_Why: Opens with a specific, recognizable moment — not an abstract statement. The rhetorical question pulls viewers into their own experience._

**No screenshot needed.**

---

### Scene 2 — Product Intro (0:06–0:12)

**Voiceover:**
> "Vernix joins your video calls, connects to your tools, and answers questions with real data — live."

**On-screen text:**
> Meet Vernix

**Visual:** `brand/combo/horizontal-dark-nobg.png` animates in (scale 0.8→1 + fade, ease-out-quart). Headline "Meet Vernix" in `foreground`, 64px bold. Subtitle fades in below in `muted-foreground`, 28px:

> Live answers from your tools, during the call.

_Why: One sentence, three concrete things. No "AI assistant" label — show what it does, not what category it belongs to._

**No screenshot needed.**

---

### Scene 3 — Zero Friction Setup (0:12–0:18)

**Voiceover:**
> "Paste a meeting link. That's the entire setup."

**On-screen text:**
> Paste a link. Done.

**Visual:** Text left-aligned, screenshot slides in from right. Screenshot of the **Create Meeting dialog** with fields filled. 16px rounded corners, subtle `card`-colored drop shadow.

_Why: Shorter = more confident. "That's the entire setup" is more emphatic than explaining what happens next._

**Screenshot needed:**
- [ ] `screenshot-create-meeting.png` — Create Meeting dialog with fields filled (title: "Q2 Planning Sync", link: a Zoom URL). Dark mode.

---

### Scene 4 — Agent Joins (0:18–0:25)

**Voiceover:**
> "Vernix joins as a participant. Zoom, Meet, Teams, Webex. No plugins. No extensions."

**On-screen text:**
> No plugins. No extensions.

**Visual:** Screenshot of **Vernix on an active Google Meet call** — showing the bot as a visible participant in the call grid. Below or beside it, the 4 platform logos animate in one by one (use `ring` accent underline on each as it appears).

_Why: Staccato rhythm mirrors the zero-friction message. "No plugins. No extensions." lands harder than "No plugins, no extensions." Showing the actual call (not just a dashboard card) makes it real._

**Screenshots needed:**
- [ ] `screenshot-active-call.png` — Vernix visible as a participant in a Google Meet call (the call grid, not the dashboard). Crop to show Vernix's tile alongside 1–2 other participants. No browser chrome.
- [ ] `screenshot-active-meeting.png` — Meeting card in the dashboard showing "Active" status. Dark mode. (optional, use if the call screenshot needs context)
- [ ] Platform logos: Zoom, Google Meet, Microsoft Teams, Webex (SVGs, animate in sequence)

---

### Scene 5 — Live Transcription (0:25–0:31)

**Voiceover:**
> "Every word is transcribed in real time — with speaker names, so you always know who said what."

**On-screen text:**
> Who said what. Always.

**Visual:** Screenshot of the **Transcript tab** — conversation between 2–3 speakers with timestamps. Optionally animate lines appearing one by one.

_Why: "So you always know who said what" is the benefit, not "with timestamps." The on-screen text captures the outcome, not the feature._

**Screenshot needed:**
- [ ] `screenshot-transcript.png` — Transcript tab with 6–8 lines between "Sarah Chen", "David Kim", and "Vernix". Dark mode. Timestamps visible.

---

### Scene 6 — The Hero Moment: Live Answers (0:31–0:43)

**Voiceover:**
> "During the call, ask Vernix anything. It pulls the answer straight from your connected tools."
>
> _(brief pause)_
>
> "Sprint status from Linear. Customer history from your CRM. Deploy logs from GitHub. Nobody leaves the call."

**On-screen text:**
> "What's the status of the auth migration?"

The question text uses `accent-foreground` color (light violet) to stand out as a quote.

**Visual:** Hero scene — give it room. Show the **Chat tab** with a user question and Vernix's data-rich response. Question appears first, then the AI response fades in. Hold on the answer for 2–3 seconds.

_Why: Removed "But here's where it gets interesting" — filler that delays the payoff. "Ask Vernix anything" is direct. "Nobody leaves the call" is the outcome, stated as a fact._

**Screenshot needed:**
- [ ] `screenshot-chat-answer.png` — Chat tab showing the question "What's the status of the auth migration?" and a specific answer referencing Linear data (e.g., "3 of 5 subtasks complete. Blocked by OAuth provider review. Assigned to David."). Dark mode.

---

### Scene 7 — Connect Your Tools (0:43–0:50)

**Voiceover:**
> "Connect Slack, Linear, GitHub, your CRM — dozens of integrations. Set it up once. It works in every call."

**On-screen text:**
> Connect once. Use everywhere.

**Visual:** Screenshot of the **Integrations page** with connected services (green badges). Crossfade to the **Integration Cloud** visual.

_Why: Removed "any tool that speaks MCP" — MCP is on the "words to avoid" list in the marketing context. "Dozens of integrations" is specific without being jargon. Shorter sentences._

**Screenshots needed:**
- [ ] `screenshot-integrations.png` — Integrations page with 3–4 connected (green badges) + available ones. Dark mode.
- [ ] `screenshot-integration-cloud.png` — Integration cloud from the landing page. Dark mode.

---

### Scene 8 — Summaries & Action Items (0:50–0:58)

**Voiceover:**
> "When the call ends, you get a summary and action items — assigned to the right people, ready to track."

**On-screen text:**
> Summaries and action items. Automatic.

**Visual:** Quick cut or split view:
1. **Overview tab** with a rendered meeting summary
2. **Tasks tab** with action items, assignee badges (using `secondary` badge variant), checkboxes

_Why: "When the call ends" is more concrete than "After the call." Removed "automatic" and "extracted" from VO — the visual proves it's automatic. Kept "Automatic" in on-screen text as a one-word punchline._

**Screenshots needed:**
- [ ] `screenshot-summary.png` — Overview tab with a 4–6 bullet summary. Dark mode.
- [ ] `screenshot-tasks.png` — Tasks tab with 4–5 items, assignee badges ("Sarah", "David"), one checked off. Dark mode.

---

### Scene 9 — Cross-Meeting Search (0:58–1:04)

**Voiceover:**
> "Search across every call you've ever had. By topic, by speaker, by meaning — not just keywords."

**On-screen text:**
> Search by meaning, not just keywords.

**Visual:** Screenshot of the **dashboard with search active** and filtered results.

_Why: "Not just keywords" differentiates from competitors. The on-screen text captures the unique selling point instead of the generic "Search every call."_

**Screenshot needed:**
- [ ] `screenshot-search.png` — Dashboard with search query "pricing decision" and 2–3 matching meetings. Dark mode.

---

### Scene 10 — Knowledge Base (1:04–1:10)

**Voiceover:**
> "Upload product specs, onboarding guides, any docs your team needs — so Vernix has the context before the call starts."

**On-screen text:**
> Give it context before the call.

**Visual:** Screenshot of the **Knowledge Base page** with uploaded documents showing green "ready" badges.

_Why: Leads with concrete examples (product specs, onboarding guides) instead of the abstract "upload documents." "Before the call starts" creates a forward-looking benefit._

**Screenshot needed:**
- [ ] `screenshot-knowledge.png` — Knowledge page with 3–4 docs (PDF, DOCX, MD), green "ready" badges. Dark mode.

---

### Scene 11 — CTA (1:10–1:18)

**Voiceover:**
> "Stop switching tabs. Start getting answers. Try Vernix free."

**On-screen text (large, centered):**
> Try Vernix free
>
> vernix.ai

**Visual:** `brand/combo/horizontal-dark-nobg.png` centered above. "Try Vernix free" in `foreground`, 48px bold, with a subtle `ring`-colored glow behind it (box-shadow or radial gradient). URL in `muted-foreground`, 32px. Background gradient drift using `accent` at ~5% opacity. Music swells. Hold 5 seconds.

_Why: Bookends the hook — scene 1 was about tab-switching, the CTA resolves it. "Stop X. Start Y." is a proven contrast pattern. Ends on the action, not a vague promise._

**No screenshot needed.**

---

## Full Voiceover Script

For recording in one take. ~190 words, ~80 seconds at conversational pace.

```
Halfway through a standup, someone asks for the sprint status. Nobody
has the tab open. The meeting stalls. Sound familiar?

Vernix joins your video calls, connects to your tools, and answers
questions with real data — live.

Paste a meeting link. That's the entire setup.

Vernix joins as a participant. Zoom, Meet, Teams, Webex. No plugins.
No extensions.

Every word is transcribed in real time — with speaker names, so you
always know who said what.

During the call, ask Vernix anything. It pulls the answer straight from
your connected tools.

Sprint status from Linear. Customer history from your CRM. Deploy logs
from GitHub. Nobody leaves the call.

Connect Slack, Linear, GitHub, your CRM — dozens of integrations. Set
it up once. It works in every call.

When the call ends, you get a summary and action items — assigned to
the right people, ready to track.

Search across every call you've ever had. By topic, by speaker, by
meaning — not just keywords.

Upload product specs, onboarding guides, any docs your team needs — so
Vernix has the context before the call starts.

Stop switching tabs. Start getting answers. Try Vernix free.
```

---

## Screenshot Checklist

Prepare in dark mode at 1920x1080 or higher. Crop to the relevant UI — no browser chrome.

| # | Filename | What to capture | Page/Route |
|---|----------|----------------|------------|
| 1 | `screenshot-create-meeting.png` | Create Meeting dialog, fields filled | `/dashboard` (open dialog) |
| 2 | `screenshot-active-call.png` | Vernix as participant in a Google Meet call | Google Meet (live call) |
| 2b | `screenshot-active-meeting.png` | Meeting card with "Active" badge (optional) | `/dashboard` |
| 3 | `screenshot-transcript.png` | Transcript tab, 6–8 lines, multiple speakers | `/dashboard/call/[id]` → Transcript tab |
| 4 | `screenshot-chat-answer.png` | Chat with question + data-rich AI response | `/dashboard/call/[id]` → Chat tab |
| 5 | `screenshot-integrations.png` | Integrations page, 3–4 connected | `/dashboard/integrations` |
| 6 | `screenshot-integration-cloud.png` | Integration cloud visual | `/` or `/features/integrations` |
| 7 | `screenshot-summary.png` | Overview tab with markdown summary | `/dashboard/call/[id]` → Overview tab |
| 8 | `screenshot-tasks.png` | Tasks tab with 4–5 items, assignees | `/dashboard/call/[id]` → Tasks tab |
| 9 | `screenshot-search.png` | Dashboard with search active + results | `/dashboard` |
| 10 | `screenshot-knowledge.png` | Knowledge page with 3–4 docs, ready status | `/dashboard/knowledge` |

### Screenshot Tips

- Use realistic-looking data — real names, real-sounding project references
- Dark mode only — matches video background
- Hide trial/verification banners for cleaner shots
- Capture at 2x (Retina) for crisp scaling
- Save as PNG in `vernix-demo-video-v1/public/screenshots/`

---

## On-Screen Text Reference

Minimal text — VO carries the story. These reinforce one key phrase per scene.

```
Scene 1:  "The answer is in another tab."
Scene 2:  "Meet Vernix" / "Live answers from your tools, during the call."
Scene 3:  "Paste a link. Done."
Scene 4:  "No plugins. No extensions."
Scene 5:  "Who said what. Always."
Scene 6:  "What's the status of the auth migration?"
Scene 7:  "Connect once. Use everywhere."
Scene 8:  "Summaries and action items. Automatic."
Scene 9:  "Search by meaning, not just keywords."
Scene 10: "Give it context before the call."
Scene 11: "Try Vernix free" / "vernix.ai"
```

---

## Remotion Implementation Notes

### Setup

```bash
# Required packages (from the remotion project root)
npx remotion add @remotion/transitions
npx remotion add @remotion/media
npx remotion add @remotion/google-fonts
```

### Composition

- **1920x1080, 30fps.** Use `calculateMetadata` to set duration dynamically from VO audio length (see Voiceover section)
- **Each scene** = its own React component for clean separation

### Critical Rules

- **All animations MUST use `useCurrentFrame()` + `interpolate()` or `spring()`.** CSS transitions, CSS animations, and Tailwind `animate-*` / `transition-*` classes are **forbidden** — they won't render correctly during export
- **Use `<Img>` from `remotion`** for all images — never native `<img>`, Next.js `<Image>`, or CSS `background-image`. `<Img>` ensures assets load before rendering
- **Use `staticFile()`** to reference everything in `public/`
- **Always premount `<Sequence>` components** with `premountFor={1 * fps}` so they're ready before they appear
- **Tailwind is fine** for layout/styling, just not for animation classes

### Scene Transitions — `<TransitionSeries>`

Use `@remotion/transitions` with `fade()` between scenes. This is the correct Remotion pattern — not CSS crossfades.

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={sceneFrames[0]}>
    <SceneHook />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 10 })}
  />
  <TransitionSeries.Sequence durationInFrames={sceneFrames[1]}>
    <SceneIntro />
  </TransitionSeries.Sequence>
  {/* ... */}
</TransitionSeries>
```

Note: transitions overlap adjacent scenes, so total duration = sum of scene durations minus sum of transition durations.

### Animations

Use `spring()` with `{ damping: 200 }` for smooth no-bounce motion (matches the design system's ease-out-quart feel):

```tsx
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Fade in
const opacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
  extrapolateRight: "clamp",
});

// Slide up (smooth, no bounce)
const slideUp = spring({ frame, fps, config: { damping: 200 } });
const translateY = interpolate(slideUp, [0, 1], [20, 0]);

// Delayed entrance (e.g., screenshot appears after text)
const screenshotEntrance = spring({
  frame,
  fps,
  config: { damping: 200 },
  delay: Math.round(0.8 * fps), // 0.8s after scene starts
});
```

### Font Loading

Load Geist Sans via `@remotion/google-fonts` (the app uses `next/font/google` but Remotion needs its own loader):

```tsx
import { loadFont } from "@remotion/google-fonts/GeistSans";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

// Use in components:
<div style={{ fontFamily, fontWeight: 700, fontSize: 56 }}>
  Your meetings are full of questions.
</div>
```

If Geist Sans isn't available in `@remotion/google-fonts`, use `@remotion/fonts` with local `.woff2` files in `public/fonts/`.

### Assets

```
vernix-demo-video-v1/public/
├── brand/                          # Copy from main project's public/brand/
│   ├── combo/horizontal-dark-nobg.png
│   ├── icon/icon-dark-512.png
│   └── wordmark/wordmark-dark.png
├── screenshots/                    # Screenshots from the checklist
│   ├── screenshot-create-meeting.png
│   ├── screenshot-active-meeting.png
│   └── ...
├── audio/
│   ├── voiceover.mp3               # VO recording (or per-scene files)
│   └── music.mp3                   # Background music
└── fonts/                          # If using local font loading
    ├── GeistSans-Regular.woff2
    ├── GeistSans-Medium.woff2
    └── GeistSans-Bold.woff2
```

### Audio

```tsx
import { Audio } from "@remotion/media";
import { staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Voiceover — full volume
<Audio src={staticFile("audio/voiceover.mp3")} />

// Background music — low volume, fade in over 1s
<Audio
  src={staticFile("audio/music.mp3")}
  volume={(f) => {
    const fadeIn = interpolate(f, [0, 30], [0, 0.15], { extrapolateRight: "clamp" });
    return fadeIn;
  }}
  loop
/>
```

### Voiceover with ElevenLabs (Optional)

Generate per-scene VO files, then use `calculateMetadata` to size the composition dynamically:

```tsx
// generate-voiceover.ts — run with: node --strip-types generate-voiceover.ts
const scenes = [
  { id: "01-hook", text: "Every meeting, someone needs a number..." },
  { id: "02-intro", text: "Vernix is an AI assistant..." },
  // ...
];

for (const scene of scenes) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: scene.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3 },
      }),
    }
  );
  const buf = Buffer.from(await response.arrayBuffer());
  writeFileSync(`public/audio/voiceover/${scene.id}.mp3`, buf);
}
```

Then use `calculateMetadata` to measure audio durations and set scene lengths automatically — no manual frame counting.

### Colors — `theme.ts`

Define a shared constants file mapping design system tokens to values for inline styles:

```tsx
// src/theme.ts
export const theme = {
  background: "#1a1a1a",       // oklch(0.145 0 0)
  foreground: "#fafafa",       // oklch(0.985 0 0)
  mutedForeground: "#b0b0b0",  // oklch(0.708 0 0)
  card: "#2e2e2e",             // oklch(0.205 0 0)
  accent: "#7c3aed",           // ring — violet (approx)
  accentForeground: "#c4b5fd", // accent-foreground — light violet (approx)
  successText: "#16a34a",      // green-600
} as const;
```

### Export

```bash
npx remotion render DemoVideo --codec h264  # MP4 output
```
