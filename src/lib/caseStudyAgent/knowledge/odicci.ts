import type { CaseStudyKnowledgeBase } from "../types";

/** Grounded notes for the Odicci (ODG) case study — swap this object per project. */
export const odicciCaseStudyKnowledge: CaseStudyKnowledgeBase = {
  projectId: "odicci",
  projectName: "Odicci",
  idleLabel: "Ask about Odicci",
  noMatchReply:
    "That wasn't in my documented Odicci notes — I don't want to guess. If it's about the template library, Studio publishing, handoffs, or brand vs usability, try one of the prompts above.",
  qa: [
    {
      id: "scope",
      chipLabel: "Scope and early projects",
      question: "What was your scope at Odicci, and what were your early projects?",
      answer:
        "I started as an intern and was the only full-time designer on the team, with a contractor on graphics — product, branding, and event assets. My first project was the template library: after talking to the graphic designer about poor findability and glitches, I added a playable mock preview. From there it was back-to-back work about every three weeks — conditional logic, API integrations, game config, analytics, Studio loading, and onboarding.",
      keywords: [
        "scope",
        "intern",
        "early",
        "first",
        "template",
        "library",
        "preview",
        "findability",
        "onboarding",
        "analytics",
        "studio",
        "branding",
        "projects",
      ],
    },
    {
      id: "seasonal",
      chipLabel: "Seasonal campaigns in Studio",
      question: "How did you streamline seasonal campaign building and publishing in the Studio?",
      answer:
        "Day-by-day Halloween and Christmas calendars were exhausting to build manually, so I shipped bulk asset editing, mass copy-and-paste toolbars, and smart uploads that read labelled file names to sort assets by day. Missing-asset checks moved from a post-build publishing wall into live indicators inside each day frame, and I brought publishing — with the publish CTA — into the Studio as its own in-context tab.",
      keywords: [
        "seasonal",
        "campaign",
        "studio",
        "halloween",
        "christmas",
        "calendar",
        "bulk",
        "upload",
        "publishing",
        "publish",
        "assets",
        "missing",
      ],
    },
    {
      id: "handoff",
      chipLabel: "Handoffs and collaboration",
      question: "How did you level up developer handoffs and cross-functional collaboration?",
      answer:
        "Early on it was wireframes and a call with the full-stack dev, and Studio cycles could run about two months. When our PM wanted consistency across a small team, I built tokenized handoff components for frames, fonts, and keys — engineering matched the design on the first project using it, and that became my standard before prototyping. Working closely with dev also taught me trade-offs, web inspection, and using AI to prototype and ship faster.",
      keywords: [
        "handoff",
        "developer",
        "engineering",
        "collaboration",
        "wireframes",
        "tokens",
        "tokenized",
        "pm",
        "prototyping",
        "inspection",
      ],
    },
    {
      id: "tension",
      chipLabel: "Hardest design tension",
      question: "What was the hardest design tension you navigated there?",
      answer:
        "The founder had a strong branding vision — especially blue and orange as opposites on the wheel — which clashed when I needed diluted tones for button states and secondary actions. Over time, seeing the gap between brand expression and product usability helped bridge that friction and shaped a lot of my growth as a designer.",
      keywords: [
        "tension",
        "hardest",
        "founder",
        "branding",
        "blue",
        "orange",
        "colours",
        "colors",
        "usability",
        "buttons",
      ],
    },
  ],
};