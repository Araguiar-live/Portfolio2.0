import type { CaseStudyKnowledgeBase } from "@/lib/caseStudyAgent/types";
import { CaseStudyAgentCard } from "./CaseStudyAgentCard";

/**
 * Desktop/laptop sticky “Ask Agent” control — sits under the work-page top chrome on the right
 * (below the contact cluster), not in the hero grid.
 */
type CaseStudyAgentStickyProps = {
  knowledge: CaseStudyKnowledgeBase;
  /** Stacked under the contact cluster in the work-page top-right column. */
  stacked?: boolean;
};

export function CaseStudyAgentSticky({ knowledge, stacked = false }: CaseStudyAgentStickyProps) {
  const hostClass = stacked
    ? "case-study-agent-sticky-host pointer-events-none"
    : "case-study-agent-sticky-host pointer-events-none fixed top-[5.25rem] right-8 z-[200] hidden max-md:!hidden md:block";

  return (
    <div className={hostClass}>
      <CaseStudyAgentCard knowledge={knowledge} placement="sticky" className="pointer-events-auto" />
    </div>
  );
}