import type {
  CaseStudyChatMessage,
  CaseStudyKnowledgeBase,
  CaseStudyPromptsConfig,
  CaseStudyQa,
} from "./types";

export const DEFAULT_CASE_STUDY_PROMPTS_CONFIG: Required<CaseStudyPromptsConfig> = {
  showRemainingAfterAnswer: true,
};

export function resolveCaseStudyPromptsConfig(
  kb: CaseStudyKnowledgeBase,
): Required<CaseStudyPromptsConfig> {
  return {
    showRemainingAfterAnswer:
      kb.promptsConfig?.showRemainingAfterAnswer ??
      DEFAULT_CASE_STUDY_PROMPTS_CONFIG.showRemainingAfterAnswer,
  };
}

/** Starter rows shown in the thread (initial list, or unanswered rows after replies). */
export function caseStudyReplyInProgress(
  typing: boolean,
  messages: readonly CaseStudyChatMessage[],
): boolean {
  return typing || messages.some((m) => m.streaming);
}

export function caseStudyHasCompleteAnswer(messages: readonly CaseStudyChatMessage[]): boolean {
  return messages.some(
    (m) => m.role === "assistant" && !m.streaming && m.content.length > 0,
  );
}

export function shouldShowCaseStudyFollowUpPrompts(
  kb: CaseStudyKnowledgeBase,
  askedQaIds: ReadonlySet<string>,
  typing: boolean,
  messages: readonly CaseStudyChatMessage[],
): boolean {
  if (!caseStudyHasCompleteAnswer(messages)) return false;
  if (caseStudyReplyInProgress(typing, messages)) return false;
  return visibleCaseStudyPrompts(kb, askedQaIds, messages.length).length > 0;
}

export function visibleCaseStudyPrompts(
  kb: CaseStudyKnowledgeBase,
  askedQaIds: ReadonlySet<string>,
  messageCount: number,
): CaseStudyQa[] {
  const config = resolveCaseStudyPromptsConfig(kb);
  if (messageCount === 0) return kb.qa;
  if (!config.showRemainingAfterAnswer) return [];
  return kb.qa.filter((item) => !askedQaIds.has(item.id));
}