import type { CaseStudyKnowledgeBase } from "../types";

/** Grounded notes for the Crcle case study — swap this object per project. */
export const crcleCaseStudyKnowledge: CaseStudyKnowledgeBase = {
  projectId: "crcle",
  projectName: "crcle",
  idleLabel: "Ask about crcle",
  noMatchReply:
    "That wasn't in my documented crcle notes — I don't want to guess. If it's about friendship, work, love signals, or how we shipped under tight scope, try one of the prompts above.",
  qa: [
    {
      id: "start",
      chipLabel: "What changed first?",
      question: "What was Crcle at the start, and what did you change first?",
      answer:
        "When I joined Crcle as their first and only designer, it was basically a generic LinkedIn-style profile and an open search bar for connections.\n\nI started by filtering search around what people actually wanted — friendship, work, and love — giving each result its own card. That became the core daily recommendation experience, capped at three a day to avoid doomscrolling.",
      keywords: [
        "start",
        "joined",
        "first",
        "only designer",
        "designer",
        "linkedin",
        "search",
        "friendship",
        "work",
        "love",
        "recommendation",
        "three",
        "doomscroll",
        "profile",
        "connections",
      ],
    },
    {
      id: "card",
      chipLabel: "The recommendation card",
      question: "Why did the recommendation card take so long—and how did you finally crack it?",
      answer:
        "The founder wanted something graphic and customisable — almost Yu-Gi-Oh! card energy — and pushed back whenever it felt like a Post-it.\n\nWe tried guitar-string signals and pink/blue bars for love, social, and work; usability suffered and it was awkward to build reliably.\n\nStripping it back to a simple swipeable card was what landed. From there we shaped the daily profile around interests and visuals so people control how they're perceived.",
      keywords: [
        "recommendation",
        "card",
        "yu-gi-oh",
        "yugioh",
        "post-it",
        "postit",
        "guitar",
        "signal",
        "pink",
        "blue",
        "swipeable",
        "scrollable",
        "founder",
        "graphic",
        "customisable",
        "customizable",
        "daily profile",
      ],
    },
    {
      id: "beyond-card",
      chipLabel: "Beyond the card",
      question: "What else did you design beyond the recommendation card?",
      answer:
        "While the card ate a lot of iteration, I kept moving across Crcle — profiles, settings, messaging, and core flows. I also explored a customisable iOS-inspired widget profile for V1, with room to grow later.",
      keywords: [
        "else",
        "beyond",
        "profile",
        "settings",
        "messaging",
        "flows",
        "widget",
        "ios",
        "v1",
      ],
    },
    {
      id: "engineering",
      chipLabel: "Working with engineering",
      question: "How did you work with engineering under tight time and scope?",
      answer:
        "It was part-time for me with a huge solo workload, so we skipped heavy formal handoffs. We'd jump on mid-day calls and work through things together. I really valued our engineer — he'd flag missing and error states I hadn't had bandwidth to catch.",
      keywords: [
        "engineering",
        "engineer",
        "handoff",
        "scope",
        "time",
        "part-time",
        "calls",
        "error",
        "states",
        "workflow",
      ],
    },
  ],
};