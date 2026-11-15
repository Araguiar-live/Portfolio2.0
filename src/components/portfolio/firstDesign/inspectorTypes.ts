export type InspectorFrameId =
  | "onboarding"
  | "session-setup"
  | "session-active"
  | "coming-2"
  | "challenges"
  | "energy";

/** Figma 1992:35174 annotation key. */
export type SpecKind =
  | "image"
  | "focus"
  | "link"
  | "font"
  | "reading"
  | "spacing"
  | "button"
  | "padding"
  | "icon"
  | "colour"
  | "toast"
  | "frame";

/** Hotspot box as % of the 402 × 874 artboard. */
export type SpecBounds = { x: number; y: number; w: number; h: number };

export interface SpecAnnotation {
  id: string;
  kind: SpecKind;
  /** Center fallback when bounds / data-inspect-id are missing. */
  hotspot: { x: number; y: number };
  /** Padded target region in artboard %. */
  bounds: SpecBounds;
  /** Toast placement relative to the device stage */
  toast: { side: "left" | "right"; top: number };
  category: string;
  /** Element Name */
  element: string;
  /** Component type shown beside the name. */
  elementType: string;
  /** Target / Frame Purpose */
  target: string;
  /** Padding, gap, and radius tokens. */
  spacing: string;
  accessibleName: string;
  /** ARIA role and states. */
  aria: string;
  /** Why the component exists in the UX journey. */
  description: string;
}

export interface InspectorFrame {
  id: InspectorFrameId;
  label: string;
  /** Frame Role — why this screen exists in the loop. */
  role: string;
  kind: "hero" | "coming-soon";
  note: string;
  annotations?: SpecAnnotation[];
}

export const INSPECTOR_FRAMES: InspectorFrame[] = [
  {
    id: "onboarding",
    label: "Onboarding & Session Launch",
    role: "Low-friction entry point using emotional hooks and immediate CTA focus.",
    kind: "hero",
    note: "Tap to never look back opens the loop. Begin Session writes the draft locally and advances into the active timer.",
    annotations: [
      {
        id: "primary-cta",
        kind: "button",
        hotspot: { x: 50, y: 91.5 },
        bounds: { x: 18.4, y: 89.5, w: 63.2, h: 6.2 },
        toast: { side: "right", top: 58 },
        category: "+ Button",
        element: "Begin Session",
        elementType: "Primary Action Button",
        target: "Onboarding & Session Launch — convert the hook into a single committed tap.",
        spacing: "Width 254px · padding 26px / 8px · radius 38px · 1.5px amber stroke",
        accessibleName: "Begin Session",
        aria: 'role="button"',
        description:
          "Initialises the session, saves launch parameters locally, and transitions into the active timer so the first decision is also the last.",
      },
      {
        id: "app-mark",
        kind: "icon",
        hotspot: { x: 50, y: 16.2 },
        bounds: { x: 44, y: 13.4, w: 12, h: 5.5 },
        toast: { side: "left", top: 8 },
        category: "+ Icon",
        element: "Product Mark",
        elementType: "List Badge / Brand Anchor",
        target: "Onboarding & Session Launch — brand the emotional hook before the CTA.",
        spacing: "48×48px · radius 8px · inner gap 4px · padding 10px",
        accessibleName: "Productive list mark",
        aria: 'role="img" aria-hidden="true"',
        description:
          "Three-bar list icon encodes the green / amber / blue category tokens reused across session states, challenges, and notifications.",
      },
      {
        id: "headline",
        kind: "font",
        hotspot: { x: 50, y: 80.5 },
        bounds: { x: 12, y: 78.2, w: 76, h: 6 },
        toast: { side: "left", top: 22 },
        category: "+ Text",
        element: "Tap to never look back",
        elementType: "Screen Title",
        target: "Onboarding & Session Launch — one emotional line, then one action.",
        spacing: "Centered · 16px / 48.9px leading · 688px from artboard top",
        accessibleName: "Tap to never look back",
        aria: 'role="heading" aria-level="1"',
        description:
          "Emotional hook paired with a single supporting landscape — one decision, then the primary Begin Session action.",
      },
    ],
  },
  {
    id: "session-setup",
    label: "Today · Session Intent",
    role: "Hub-and-spoke date rail and session picker that feeds the Today Hub — week context first, then time-of-day and Sprint / Mood / Blockers so launch stays low-load.",
    kind: "hero",
    note: "Session type is captured before launch so the timer opens already tuned to deep work, sprint, or review.",
    annotations: [
      {
        id: "today-week",
        kind: "frame",
        hotspot: { x: 50, y: 14.5 },
        bounds: { x: 2, y: 11.4, w: 96, h: 10.5 },
        toast: { side: "left", top: 10 },
        category: "+ Frame",
        element: "Week Strip",
        elementType: "Calendar Rail",
        target: "Today Hub — date context before mood or blockers, so the first glance is the week not the form.",
        spacing: "Width 386px · weekday 7.6px · date 20px · selected day bold",
        accessibleName: "Week of 23–30, Sunday 29 selected",
        aria: 'role="tablist" aria-label="Week of 23 to 30"',
        description:
          "Horizontal date rail sets session context before any chips are touched — the hub-and-spoke pattern that keeps cognitive load off the launch path.",
      },
      {
        id: "today-mood",
        kind: "button",
        hotspot: { x: 50, y: 85.5 },
        bounds: { x: 26.4, y: 83.2, w: 47, h: 6.2 },
        toast: { side: "right", top: 42 },
        category: "+ Button",
        element: "Sprint / Mood / Blockers",
        elementType: "Intent Chip Group",
        target: "Today Hub — flavour the session without opening a settings sheet.",
        spacing: "Width 189px · padding 24px / 8px · radius 120px · chip gap auto",
        accessibleName: "Sprint Mood Blockers",
        aria: 'role="group" aria-label="Session intent"',
        description:
          "Intent chips write the session flavour locally so the timer opens already tuned — sprint energy, mood check, or blocker flag.",
      },
      {
        id: "today-fab",
        kind: "button",
        hotspot: { x: 86, y: 93.8 },
        bounds: { x: 80.6, y: 91.6, w: 10.5, h: 4.8 },
        toast: { side: "right", top: 78 },
        category: "+ Button",
        element: "Compose FAB",
        elementType: "Dock Action",
        target: "Today Hub — same dock language as Articles and the expanded sheets.",
        spacing: "42×42px · radius 24px · icon 24px · dock width 331px",
        accessibleName: "Add session",
        aria: 'role="button" aria-label="Add session"',
        description:
          "Primary compose control in the shared dock — capture a block without leaving the Today spoke.",
      },
    ],
  },
  {
    id: "session-active",
    label: "Article & Methodology Feed",
    role: "Behavioral psychology knowledge base providing micro-dosed focus insights and anti-procrastination frameworks.",
    kind: "hero",
    note: "Peer-backed methodology cards keep the feed scannable — photo, badge, lede, then a single read path.",
    annotations: [
      {
        id: "articles-search",
        kind: "focus",
        hotspot: { x: 50, y: 11.4 },
        bounds: { x: 2.1, y: 9.4, w: 95.8, h: 3.9 },
        toast: { side: "left", top: 8 },
        category: "+ Focus",
        element: "Search Field",
        elementType: "Filter Input",
        target: "Article & Methodology Feed — filter insights without leaving the session context.",
        spacing: "Height 34px · width 385px · padding 12px · radius 24px · 2px backdrop blur",
        accessibleName: "Search articles",
        aria: 'role="searchbox" aria-label="Search articles"',
        description:
          "Topic search filters the methodology feed in place so a mid-session insight does not eject the user from the loop.",
      },
      {
        id: "articles-card",
        kind: "reading",
        hotspot: { x: 50, y: 42 },
        bounds: { x: 2.1, y: 24.8, w: 95.8, h: 32 },
        toast: { side: "right", top: 36 },
        category: "+ Reading",
        element: "How to Be Productive — 15 Days",
        elementType: "Article Card",
        target: "Article & Methodology Feed — micro-dose a focus framework as a single scannable card.",
        spacing: "Radius 24px · inner padding 8px · body padding 10.8px · stack gap 8px",
        accessibleName: "How to Be Productive — 15 Days",
        aria: 'role="article"',
        description:
          "Peer-backed cards keep the knowledge base scannable — photo, badge, lede, then one read path. 14.4k cohort copy on later cards supplies social proof without a separate sheet.",
      },
      {
        id: "articles-fab",
        kind: "button",
        hotspot: { x: 86, y: 93.8 },
        bounds: { x: 80.6, y: 91.8, w: 10.5, h: 4.8 },
        toast: { side: "right", top: 78 },
        category: "+ Button",
        element: "Compose FAB",
        elementType: "Dock Action",
        target: "Article & Methodology Feed — capture a method without breaking the reading loop.",
        spacing: "42×42px · radius 24px · dock padding 16px / 8px · radius 24px",
        accessibleName: "Add article",
        aria: 'role="button" aria-label="Add article"',
        description:
          "Same dock FAB as Today — save a methodology in one tap so capture never competes with reading.",
      },
    ],
  },
  {
    id: "coming-2",
    label: "Today Hub (Main Dashboard)",
    role: "Hub-and-spoke primary anchor showcasing Day streak (Day 27) and current productivity ring (50%) to minimize initial cognitive load.",
    kind: "hero",
    note: "Primary Anchor is the daily home — Day 27, partner status, then one tap into a session.",
    annotations: [
      {
        id: "anchor-day",
        kind: "font",
        hotspot: { x: 28, y: 48 },
        bounds: { x: 6, y: 44, w: 88, h: 10 },
        toast: { side: "left", top: 28 },
        category: "+ Text",
        element: "Day 27 · 50% ring",
        elementType: "Primary Anchor + Gauge",
        target: "Today Hub (Main Dashboard) — streak and ring first, so the rest of the hub can stay quiet.",
        spacing: "Card padding 16px · radius 20px · inner gap 16px · gauge 92×70px",
        accessibleName: "Primary Anchor, Day 27, current productivity 50 percent",
        aria: 'role="group" aria-label="Day 27, 50 percent current productivity"',
        description:
          "The streak headline plus the 50% productivity ring are the emotional hook — one number, one ring, then one primary action. Partner & cohort sit directly underneath as the social spoke.",
      },
      {
        id: "anchor-partner",
        kind: "link",
        hotspot: { x: 50, y: 58 },
        bounds: { x: 6, y: 55.5, w: 88, h: 6.5 },
        toast: { side: "left", top: 52 },
        category: "+ Link",
        element: "Rhythmous Penguin",
        elementType: "Partner Status Row",
        target: "Partner & Cohort Momentum — social accountability layered on the hub, not a separate destination.",
        spacing: "Avatar 42px · radius 46px · 1px white stroke · row gap 12px",
        accessibleName: "Partner status, Rhythmous Penguin, in the trenches together",
        aria: 'role="button" aria-label="Open partner and cohort momentum"',
        description:
          "Pairs the user with Rhythmous Penguin on the hub itself. Expanding this row is the Partner & Cohort Momentum sheet — 14.4k peer metrics live on the methodology cards that feed the same social layer.",
      },
      {
        id: "anchor-cta",
        kind: "button",
        hotspot: { x: 50, y: 64 },
        bounds: { x: 6, y: 62, w: 88, h: 5.5 },
        toast: { side: "right", top: 58 },
        category: "+ Button",
        element: "Begin Session",
        elementType: "Primary Action Button",
        target: "Today Hub (Main Dashboard) — launch from the streak, not from a nested form.",
        spacing: "Full-bleed in 16px card · padding 26px / 8px · radius 38px · 1.5px amber stroke",
        accessibleName: "Begin Session",
        aria: 'role="button"',
        description:
          "Launches the tuned timer from Anchor Today — same amber token as onboarding so the hub and the entry point share one verb.",
      },
      {
        id: "anchor-challenges",
        kind: "link",
        hotspot: { x: 50, y: 72 },
        bounds: { x: 6, y: 69.5, w: 88, h: 7 },
        toast: { side: "right", top: 72 },
        category: "+ Link",
        element: "Active Challenges & Habits",
        elementType: "Sheet Handle",
        target: "Active Challenges & Habits Sheet — open the execution drawer without leaving Today.",
        spacing: "Padding 16px · radius 20px · 1px white/10 stroke · title 14px bold",
        accessibleName: "Active Challenges & Habits",
        aria: 'role="button" aria-expanded="false" aria-haspopup="dialog"',
        description:
          "Opens the Challenges sheet over Today. The hub stays the spoke; sprints and habit check-ins live in the drawer.",
      },
    ],
  },
  {
    id: "challenges",
    label: "Active Challenges & Habits",
    role: "Actionable execution drawer housing active sprints (“7 Days of Focus”), daily resets, and quick habit check-ins.",
    kind: "hero",
    note: "Active Challenges & Habits sheet — the daily loop sitting on top of Today.",
    annotations: [
      {
        id: "challenges-title",
        kind: "font",
        hotspot: { x: 42, y: 50 },
        bounds: { x: 8, y: 48.2, w: 72, h: 4.2 },
        toast: { side: "left", top: 36 },
        category: "+ Text",
        element: "Active Challenges & Habits",
        elementType: "Sheet Title",
        target: "Active Challenges & Habits Sheet — name the execution drawer the moment it expands.",
        spacing: "Sheet padding 16px / 12px / 20px · radius 24px 24px 0 0 · title/close gap 8px",
        accessibleName: "Active Challenges & Habits",
        aria: 'role="dialog" aria-modal="true" aria-expanded="true" aria-labelledby="challenges-title"',
        description:
          "Frosted sheet over Today — two active challenges, then today’s habits. Expanded in place so the hub never unloads.",
      },
      {
        id: "challenges-focus",
        kind: "padding",
        hotspot: { x: 50, y: 58 },
        bounds: { x: 8, y: 54.5, w: 84, h: 10 },
        toast: { side: "right", top: 50 },
        category: "+ Padding",
        element: "7 Days of Focus",
        elementType: "Challenge Card",
        target: "Active Challenges & Habits Sheet — the sprint unit (label, fraction, percent).",
        spacing: "Card padding 12px · radius 8px · inner gap 3px · bar gap 8px · stack gap 12px",
        accessibleName: "7 Days of Focus, 3 of 7 days complete, 43 percent",
        aria: 'role="button" aria-label="7 Days of Focus, 43 percent complete"',
        description:
          "Progress row is the unit of the sheet: label, fraction, compact percent, then seven tokenised bars. Evening Reset and today’s habits stack on the same 12px rhythm.",
      },
      {
        id: "challenges-close",
        kind: "icon",
        hotspot: { x: 88, y: 49.5 },
        bounds: { x: 84.5, y: 48.4, w: 7, h: 3.2 },
        toast: { side: "right", top: 28 },
        category: "+ Icon",
        element: "Dismiss",
        elementType: "Close Button",
        target: "Active Challenges & Habits Sheet — return to the Today Hub without dock chrome.",
        spacing: "28×28px · radius 14px · icon 18px",
        accessibleName: "Close challenges sheet",
        aria: 'role="button" aria-label="Close challenges sheet"',
        description:
          "Returns to Anchor Today. Overlay chrome stays out of the dock so the hub’s FAB never fights the sheet.",
      },
    ],
  },
  {
    id: "energy",
    label: "Energy Evolution",
    role: "Behavioral state indicator tracking “Inertia Sloth State” vs “Awakening Core” momentum to combat fatigue and track identity shifts.",
    kind: "hero",
    note: "Energy evolution sheet — current identity, inertia progress, and the track from Day 0 to Day 3.",
    annotations: [
      {
        id: "energy-title",
        kind: "font",
        hotspot: { x: 42, y: 38 },
        bounds: { x: 8, y: 36.5, w: 72, h: 4.2 },
        toast: { side: "left", top: 22 },
        category: "+ Text",
        element: "Energy evolution",
        elementType: "Sheet Title",
        target: "Energy Evolution Sheet — name the identity state before the track.",
        spacing: "Sheet padding 16px / 12px / 84px · radius 24px 24px 0 0 · title/close gap 8px",
        accessibleName: "Energy evolution, current identity Awakening Core, day 3",
        aria: 'role="dialog" aria-modal="true" aria-expanded="true" aria-labelledby="energy-title"',
        description:
          "Current identity on Day 3. Copy explains the next unlock without extra chrome — momentum first, then the inertia card.",
      },
      {
        id: "energy-track",
        kind: "colour",
        hotspot: { x: 50, y: 62 },
        bounds: { x: 8, y: 57, w: 84, h: 11 },
        toast: { side: "right", top: 52 },
        category: "+ Colour",
        element: "Identity Evolution Track",
        elementType: "State Ladder",
        target: "Energy Evolution Sheet — Inertia Sloth vs Awakening Core as a three-token ladder.",
        spacing: "Card padding 12px · radius 12px · bar 6×63px · gap 4px / 8px",
        accessibleName: "Identity evolution track, Day 0 Baseline Sloth to Day 3 Awakening Core",
        aria: 'role="group" aria-label="Identity evolution from Day 0 to Day 3"',
        description:
          "Three tokenised bars encode the identity ladder — green, amber, blue. The 43% inertia card above it is the fatigue signal this sheet exists to counter.",
      },
      {
        id: "energy-cta",
        kind: "button",
        hotspot: { x: 50, y: 78 },
        bounds: { x: 8, y: 75.5, w: 84, h: 5.5 },
        toast: { side: "right", top: 72 },
        category: "+ Button",
        element: "Continue Session",
        elementType: "Primary Action Button",
        target: "Energy Evolution Sheet — resume the timer from the identity state, not a back stack.",
        spacing: "Full-bleed in 16px sheet · padding 26px / 8px · radius 38px · 1.5px amber stroke",
        accessibleName: "Continue Session",
        aria: 'role="button"',
        description:
          "Resumes the live timer from the identity sheet — same amber token as Begin Session so identity check-in never feels like an exit.",
      },
    ],
  },
];
