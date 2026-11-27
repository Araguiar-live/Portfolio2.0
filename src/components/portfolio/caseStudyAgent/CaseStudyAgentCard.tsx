import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { formatCaseStudyReplyForDisplay } from "@/lib/caseStudyAgent/formatReplyDisplay";
import {
  shouldShowCaseStudyFollowUpPrompts,
  visibleCaseStudyPrompts,
} from "@/lib/caseStudyAgent/promptsConfig";
import type { CaseStudyKnowledgeBase } from "@/lib/caseStudyAgent/types";
import { CaseStudyAgentAvatar } from "./CaseStudyAgentAvatar";
import { useCaseStudyAgentChat } from "./useCaseStudyAgentChat";

type CaseStudyAgentPlacement = "sticky" | "anchored";

type CaseStudyAgentCardProps = {
  knowledge: CaseStudyKnowledgeBase;
  placement?: CaseStudyAgentPlacement;
  /** Required when placement is `anchored` (e.g. hero grid tile). */
  tileRef?: RefObject<HTMLDivElement | null>;
  /** Fits a single hero grid cell (hides shortcut chips, tighter pill). */
  compact?: boolean;
  className?: string;
};

const PANEL_W = 368;
const PANEL_H = 412;

function useStickyPanelPosition(rootRef: RefObject<HTMLDivElement | null>, open: boolean) {
  const [style, setStyle] = useState<{ top: number; left: number; width: number } | null>(null);

  const update = useCallback(() => {
    const el = rootRef.current;
    if (!el || !open) return;
    const rect = el.getBoundingClientRect();
    const margin = 12;
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    let left = rect.right - PANEL_W;
    left = Math.min(Math.max(margin, left), vw - PANEL_W - margin);

    let top = rect.bottom + 10;
    const maxTop = vh - PANEL_H - margin;
    if (top > maxTop) top = Math.max(margin, maxTop);

    setStyle({ top, left, width: PANEL_W });
  }, [open, rootRef]);

  useLayoutEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, update]);

  return style;
}

/** Chat-formatted agent copy — short paragraphs from `\\n\\n` in grounded answers. */
function CaseStudyAgentReplyText({ text }: { text: string }) {
  const display = formatCaseStudyReplyForDisplay(text);
  const blocks = display.split(/\n\n+/).filter(Boolean);
  if (blocks.length <= 1) {
    return <span className="case-study-agent__reply-text">{display}</span>;
  }
  return (
    <span className="case-study-agent__reply-text">
      {blocks.map((block, i) => (
        <span key={i} className="case-study-agent__reply-para">
          {block}
        </span>
      ))}
    </span>
  );
}

function useAnchoredPanelPosition(tileRef: RefObject<HTMLDivElement | null>, open: boolean) {
  const [style, setStyle] = useState<{ top: number; left: number } | null>(null);

  const update = useCallback(() => {
    const el = tileRef.current;
    if (!el || !open) return;
    const rect = el.getBoundingClientRect();
    const margin = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = rect.right + margin;
    if (left + PANEL_W > vw - margin) {
      left = rect.left - PANEL_W - margin;
    }
    if (left < margin) {
      left = Math.min(margin, vw - PANEL_W - margin);
    }

    let top = rect.top;
    if (top + PANEL_H > vh - margin) {
      top = Math.max(margin, vh - PANEL_H - margin);
    }

    setStyle({ top, left });
  }, [open, tileRef]);

  useLayoutEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, update]);

  return style;
}

function CaseStudyAgentPanel({
  labelId,
  knowledge,
  messages,
  askedQaIds,
  typing,
  draft,
  setDraft,
  ask,
  busy,
  closeChat,
  listRef,
  inputRef,
  panelRef,
  panelClassName,
  style,
  onSubmit,
}: {
  labelId: string;
  knowledge: CaseStudyKnowledgeBase;
  messages: ReturnType<typeof useCaseStudyAgentChat>["messages"];
  askedQaIds: ReturnType<typeof useCaseStudyAgentChat>["askedQaIds"];
  typing: boolean;
  draft: string;
  setDraft: (v: string) => void;
  ask: ReturnType<typeof useCaseStudyAgentChat>["ask"];
  busy: boolean;
  closeChat: () => void;
  listRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  panelClassName: string;
  style?: React.CSSProperties;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const visiblePrompts = visibleCaseStudyPrompts(knowledge, askedQaIds, messages.length);
  const showHint = messages.length === 0 && !typing;
  const showFollowUpPrompts = shouldShowCaseStudyFollowUpPrompts(
    knowledge,
    askedQaIds,
    typing,
    messages,
  );
  const followUpPromptList = showFollowUpPrompts
    ? visibleCaseStudyPrompts(knowledge, askedQaIds, messages.length)
    : [];

  return (
    <div
      ref={panelRef}
      className={panelClassName}
      style={style}
      role="dialog"
      aria-labelledby={labelId}
      data-case-study-agent={knowledge.projectId}
    >
      <header className="case-study-agent__panel-head">
        <p id={labelId} className="case-study-agent__panel-title">
          {knowledge.projectName} notes
        </p>
        <button
          type="button"
          className="case-study-agent__close"
          aria-label="Close chat"
          onClick={closeChat}
        >
          ×
        </button>
      </header>

      <div ref={listRef} className="case-study-agent__thread" aria-live="polite">
        {showHint && visiblePrompts.length > 0 ? (
          <div
            className="case-study-agent__prompts"
            aria-label="Starter questions"
          >
            {visiblePrompts.map((item) => (
              <button
                key={item.id}
                type="button"
                className="case-study-agent__prompt"
                disabled={busy}
                onClick={() => ask(item.question, item.id)}
              >
                {item.chipLabel}
              </button>
            ))}
          </div>
        ) : null}
        {showHint ? (
          <p className="case-study-agent__hint">
            Ask anything about my {knowledge.projectName} work — answers come only from my documented
            case-study notes.
          </p>
        ) : null}
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "case-study-agent__bubble case-study-agent__bubble--user"
                : "case-study-agent__bubble case-study-agent__bubble--agent"
            }
          >
            {m.role === "assistant" ? (
              <CaseStudyAgentReplyText text={m.content} />
            ) : (
              m.content
            )}
          </div>
        ))}
        {typing && (
          <div
            className="case-study-agent__bubble case-study-agent__bubble--agent case-study-agent__bubble--typing"
            aria-label="Agent is typing"
          >
            <span className="case-study-agent__dot" />
            <span className="case-study-agent__dot" />
            <span className="case-study-agent__dot" />
          </div>
        )}
        {followUpPromptList.length > 0 ? (
          <div
            className="case-study-agent__prompts case-study-agent__prompts--follow-up"
            aria-label="More questions"
          >
            {followUpPromptList.map((item) => (
              <button
                key={item.id}
                type="button"
                className="case-study-agent__prompt"
                disabled={busy}
                onClick={() => ask(item.question, item.id)}
              >
                {item.chipLabel}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <form className="case-study-agent__composer" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="case-study-agent__input"
          placeholder="Type a question…"
          value={draft}
          disabled={busy}
          onChange={(e) => setDraft(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="case-study-agent__send" disabled={busy || !draft.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export function CaseStudyAgentCard({
  knowledge,
  placement = "sticky",
  tileRef,
  compact = false,
  className = "",
}: CaseStudyAgentCardProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const { messages, askedQaIds, typing, draft, setDraft, ask, reset, busy } =
    useCaseStudyAgentChat(knowledge);
  const emptyTileRef = useRef<HTMLDivElement>(null);
  const anchorTileRef = tileRef ?? emptyTileRef;
  const stickyPos = useStickyPanelPosition(rootRef, open && placement === "sticky");
  const anchoredPos = useAnchoredPanelPosition(
    anchorTileRef,
    open && placement === "anchored",
  );

  const openChat = useCallback(() => {
    setOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  useEffect(() => {
    if (placement !== "anchored" || !tileRef) return;
    const tile = tileRef.current;
    if (!tile) return;
    tile.classList.toggle("hero-craft-tile--agent-open", open);
    return () => tile.classList.remove("hero-craft-tile--agent-open");
  }, [open, placement, tileRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeChat();
      }
    };
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (tileRef?.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      closeChat();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [closeChat, open, tileRef]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const scope =
      placement === "sticky"
        ? document.querySelector(".work-project-page")
        : document.querySelector(".interactive-hero");
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
        if (!scope) return;
        e.preventDefault();
        if (open) closeChat();
        else openChat();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeChat, open, openChat, placement]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(draft);
  };

  const panelProps = {
    labelId,
    knowledge,
    messages,
    askedQaIds,
    typing,
    draft,
    setDraft,
    ask,
    busy,
    closeChat,
    listRef,
    inputRef,
    panelRef,
    onSubmit,
  };

  const stickyPanel =
    placement === "sticky" && open && stickyPos && typeof document !== "undefined" ? (
      createPortal(
        <CaseStudyAgentPanel
          {...panelProps}
          panelClassName="case-study-agent__panel case-study-agent__panel--portaled"
          style={stickyPos}
        />,
        document.body,
      )
    ) : null;

  const anchoredPanel =
    placement === "anchored" && open && anchoredPos && typeof document !== "undefined" ? (
      createPortal(
        <CaseStudyAgentPanel
          {...panelProps}
          panelClassName="case-study-agent__panel"
          style={{ top: anchoredPos.top, left: anchoredPos.left, width: PANEL_W }}
        />,
        document.body,
      )
    ) : null;

  return (
    <div
      ref={rootRef}
      className={`case-study-agent${compact ? " case-study-agent--compact" : ""}${
        placement === "sticky" ? " case-study-agent--sticky" : ""
      } ${className}`.trim()}
    >
      <button
        type="button"
        className="case-study-agent__idle"
        aria-expanded={open}
        aria-haspopup="dialog"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          if (open) closeChat();
          else openChat();
        }}
      >
        <span className="case-study-agent__pill">
          <CaseStudyAgentAvatar className="case-study-agent__avatar" />
          <span className="case-study-agent__label">{knowledge.idleLabel}</span>
          <span className="case-study-agent__keys" aria-hidden>
            <span className="case-study-agent__key">⌘</span>
            <span className="case-study-agent__key">I</span>
          </span>
        </span>
      </button>
      {placement === "sticky" ? stickyPanel : anchoredPanel}
    </div>
  );
}