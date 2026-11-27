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
        "When I joined, Crcle was basically a generic LinkedIn-style profile and an open search bar for connections. I started by filtering search around what people actually wanted — friendship, work, and love — giving each result its own card. That became the core daily recommendation experience, capped at three a day to avoid doomscrolling.",
      keywords: [
        "start",
        "joined",
        "first",
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
        "The founder wanted something graphic and customizable — almost like a Yu-Gi-Oh! card — and pushed back when it felt like a Post-it. We tried guitar-string signals and pink/blue bars for love, social, and work, which hurt usability and was awkward to build. I stripped it back to a simple scrollable format, and that's the one the founder loved. From there we shaped the daily profile so people choose interests and visuals to control how they're perceived.",
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
        "scrollable",
        "founder",
        "graphic",
        "customizable",
        "daily profile",
      ],
    },
    {
      id: "beyond-card",
      chipLabel: "Beyond the card",
      question: "What else did you design beyond the recommendation card?",
      answer:
        "While the card ate a lot of iteration, I kept moving across Crcle — profiles, settings, messaging, and core flows. I also explored a customizable iOS-inspired widget profile for V1, with room to grow later.",
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