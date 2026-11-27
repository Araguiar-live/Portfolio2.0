export type CaseStudyQa = {
  id: string;
  question: string;
  answer: string;
  /** Substrings used for lightweight grounding (lowercase). */
  keywords: string[];
  /** Short label on starter chips in the chat panel. */
  chipLabel: string;
};

export type CaseStudyPromptsConfig = {
  /** After a grounded answer, list starter rows that were not asked yet. Default true. */
  showRemainingAfterAnswer?: boolean;
};

export type CaseStudyKnowledgeBase = {
  projectId: string;
  projectName: string;
  idleLabel: string;
  qa: CaseStudyQa[];
  noMatchReply: string;
  promptsConfig?: CaseStudyPromptsConfig;
};

export type CaseStudyChatRole = "user" | "assistant";

export type CaseStudyChatMessage = {
  id: string;
  role: CaseStudyChatRole;
  content: string;
  streaming?: boolean;
};