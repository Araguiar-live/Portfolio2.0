import type { CaseStudyKnowledgeBase, CaseStudyQa } from "./types";

const STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "to",
  "of",
  "in",
  "on",
  "at",
  "for",
  "was",
  "were",
  "is",
  "are",
  "did",
  "do",
  "you",
  "your",
  "what",
  "why",
  "how",
  "when",
  "about",
  "with",
  "that",
  "this",
  "it",
  "i",
  "my",
  "me",
  "we",
  "they",
  "there",
  "from",
]);

function tokens(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

function scoreQa(query: string, qa: CaseStudyQa): number {
  const qTokens = tokens(query);
  if (qTokens.length === 0) return 0;

  const qText = query.toLowerCase();
  let score = 0;

  for (const kw of qa.keywords) {
    if (qText.includes(kw)) score += 3;
  }

  const qaQuestionTokens = new Set(tokens(qa.question));
  for (const t of qTokens) {
    if (qaQuestionTokens.has(t)) score += 2;
  }

  if (qText.includes(qa.id.replace("-", " "))) score += 4;

  return score;
}

/** Pick the best-matching grounded answer, or null if nothing in the knowledge base fits. */
export function matchCaseStudyQuestion(
  query: string,
  kb: CaseStudyKnowledgeBase,
  qaId?: string,
): CaseStudyQa | null {
  if (qaId) {
    return kb.qa.find((q) => q.id === qaId) ?? null;
  }

  const trimmed = query.trim();
  if (!trimmed) return null;

  let best: CaseStudyQa | null = null;
  let bestScore = 0;

  for (const qa of kb.qa) {
    const s = scoreQa(trimmed, qa);
    if (s > bestScore) {
      bestScore = s;
      best = qa;
    }
  }

  return bestScore >= 3 ? best : null;
}

export function groundedReply(
  query: string,
  kb: CaseStudyKnowledgeBase,
  qaId?: string,
): string {
  const hit = matchCaseStudyQuestion(query, kb, qaId);
  return hit?.answer ?? kb.noMatchReply;
}