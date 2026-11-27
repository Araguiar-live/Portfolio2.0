import { useCallback, useEffect, useRef, useState } from "react";
import { groundedReply, matchCaseStudyQuestion } from "@/lib/caseStudyAgent/matchCaseStudyQuestion";
import type { CaseStudyChatMessage, CaseStudyKnowledgeBase } from "@/lib/caseStudyAgent/types";

const TYPING_MS_MIN = 520;
const TYPING_MS_MAX = 980;
const CHAR_MS = 14;

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useCaseStudyAgentChat(kb: CaseStudyKnowledgeBase) {
  const [messages, setMessages] = useState<CaseStudyChatMessage[]>([]);
  const [askedQaIds, setAskedQaIds] = useState<Set<string>>(() => new Set());
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (streamRef.current) {
      clearInterval(streamRef.current);
      streamRef.current = null;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const streamAssistantReply = useCallback(
    (fullText: string) => {
      clearTimers();
      const id = newId();
      const delay =
        TYPING_MS_MIN + Math.random() * (TYPING_MS_MAX - TYPING_MS_MIN);

      setTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id, role: "assistant", content: "", streaming: true },
        ]);

        let i = 0;
        streamRef.current = setInterval(() => {
          i += 1;
          const slice = fullText.slice(0, i);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === id ? { ...m, content: slice, streaming: i < fullText.length } : m,
            ),
          );
          if (i >= fullText.length) {
            clearTimers();
          }
        }, CHAR_MS);
      }, delay);
    },
    [clearTimers],
  );

  const ask = useCallback(
    (raw: string, qaId?: string) => {
      const text = raw.trim();
      const streaming = messages.some((m) => m.role === "assistant" && m.streaming);
      if (!text || typing || streaming) return;

      setMessages((prev) => [...prev, { id: newId(), role: "user", content: text }]);
      setDraft("");

      const matched = qaId
        ? kb.qa.find((q) => q.id === qaId) ?? matchCaseStudyQuestion(text, kb, qaId)
        : matchCaseStudyQuestion(text, kb);
      if (matched) {
        setAskedQaIds((prev) => {
          if (prev.has(matched.id)) return prev;
          const next = new Set(prev);
          next.add(matched.id);
          return next;
        });
      }

      const reply = groundedReply(text, kb, qaId);
      streamAssistantReply(reply);
    },
    [kb, messages, streamAssistantReply, typing],
  );

  const reset = useCallback(() => {
    clearTimers();
    setTyping(false);
    setMessages([]);
    setAskedQaIds(new Set());
    setDraft("");
  }, [clearTimers]);

  const replyInProgress =
    typing || messages.some((m) => m.role === "assistant" && m.streaming);

  return {
    messages,
    askedQaIds,
    typing,
    draft,
    setDraft,
    ask,
    reset,
    replyInProgress,
    busy: replyInProgress,
  };
}