import { crcleCaseStudyKnowledge } from "./knowledge/crcle";
import { odicciCaseStudyKnowledge } from "./knowledge/odicci";
import type { CaseStudyKnowledgeBase } from "./types";

const WORK_CASE_STUDY_AGENTS: Record<string, CaseStudyKnowledgeBase> = {
  crcle: crcleCaseStudyKnowledge,
  odicci: odicciCaseStudyKnowledge,
};

export function getWorkCaseStudyAgentKnowledge(
  slug: string,
): CaseStudyKnowledgeBase | undefined {
  return WORK_CASE_STUDY_AGENTS[slug];
}