import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import avocadoIcon from "@/assets/portfolio/thought/avocado.svg";
import handleIcon from "@/assets/portfolio/thought/handle.svg";
import moreIcon from "@/assets/portfolio/thought/more.svg";
import { cn } from "@/lib/utils";

const FONT = "Helvetica, Arial, sans-serif";
const SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 28,
  mass: 0.72,
};

const SPRING_LAYOUT = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.85,
};

const THOUGHT =
  "Design is an invitation to experiment: to try, to play, to wonder “what if?” Beyond what it does, it can surprise us, spark a smile, or gently nudge us to see things differently. Function matters, but it is not the whole story. Even the most practical thing has room for curiosity, delight, and a little mischief. Play is not a detour from meaning; it is one way we find it.";

type ThoughtState = "collapsed" | "preview" | "expanded";

const LEAVE_COLLAPSE_MS = 280;

function AvocadoBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const pad = size === "sm" ? "p-1.5" : "p-2";
  const icon = size === "sm" ? 12 : 16;
  return (
    <span className={cn("thought-badge flex shrink-0 items-center rounded-[12px]", pad)} aria-hidden>
      <img alt="" src={avocadoIcon} width={icon} height={icon} className="block" />
    </span>
  );
}

/**
 * Figma 2305:66701 — Default (expanded), Variant2 (preview), Variant3 (collapsed badge).
 * Expands on hover/click; collapses on pointer leave or outside click.
 */
export function FoodForThought({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<ThoughtState>("collapsed");

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const collapse = useCallback(() => {
    clearLeaveTimer();
    setState("collapsed");
  }, [clearLeaveTimer]);

  const scheduleCollapse = useCallback(() => {
    clearLeaveTimer();
    leaveTimer.current = setTimeout(() => setState("collapsed"), LEAVE_COLLAPSE_MS);
  }, [clearLeaveTimer]);

  const onPointerEnter = useCallback(() => {
    clearLeaveTimer();
    setState((cur) => (cur === "collapsed" ? "preview" : cur));
  }, [clearLeaveTimer]);

  const onPointerLeave = useCallback(() => {
    scheduleCollapse();
  }, [scheduleCollapse]);

  const openExpanded = useCallback(() => {
    clearLeaveTimer();
    setState("expanded");
  }, [clearLeaveTimer]);

  useEffect(() => {
    const onDocPointer = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root || root.contains(event.target as Node)) return;
      collapse();
    };
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, [collapse]);

  useEffect(() => () => clearLeaveTimer(), [clearLeaveTimer]);

  /** Preview → expanded after a brief hover dwell (Figma “open on hover”). */
  useEffect(() => {
    if (state !== "preview" || reduceMotion) return;
    const t = window.setTimeout(() => setState("expanded"), 400);
    return () => window.clearTimeout(t);
  }, [state, reduceMotion]);

  const isCollapsed = state === "collapsed";
  const isPreview = state === "preview";
  const isExpanded = state === "expanded";

  const nodeId = isCollapsed ? "2313:66747" : isPreview ? "2305:66702" : "2305:66699";

  const transition = reduceMotion ? { duration: 0.15 } : SPRING_LAYOUT;

  return (
    <div
      ref={rootRef}
      data-thought-state={state}
      className={cn("thought-glass-host relative shrink-0", className)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={() => {
        if (isCollapsed) openExpanded();
      }}
      role="group"
      aria-label="Food For Thought"
    >
      {/* Static frost plate — blur cannot live on the motion.div (production). */}
      {!isCollapsed ? <span className="thought-glass-frost" aria-hidden /> : null}
      <motion.div
        layout
        data-node-id={nodeId}
        data-thought-state={state}
        transition={transition}
        className={cn(
          "spatial-glass spatial-layer spatial-spring thought-glass relative z-[1] shrink-0",
          isCollapsed
            ? "thought-glass--collapsed pointer-events-auto flex aspect-square size-11 cursor-pointer items-center justify-center overflow-hidden rounded-full p-0 sm:size-[3.575rem]"
            : "flex w-[236px] flex-col items-center overflow-visible rounded-[16px] bg-transparent",
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {isCollapsed ? (
            <motion.button
              key="badge"
              type="button"
              layout
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={transition}
              className="spatial-spring-interactive flex size-full items-center justify-center rounded-full border-0 bg-transparent p-0"
              aria-label="Open Food For Thought"
              onClick={(e) => {
                e.stopPropagation();
                openExpanded();
              }}
            >
              <AvocadoBadge size="sm" />
            </motion.button>
          ) : (
            <motion.div
              key="panel"
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={transition}
              className="relative z-[1] flex w-full flex-col items-center"
            >
              <div
                className={cn(
                  "flex w-full flex-col items-end pt-2",
                  isExpanded ? "gap-2.5 px-2.5 pb-1" : "px-2 pb-1 pr-1",
                )}
              >
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent pr-1 text-left"
                  onClick={openExpanded}
                  aria-expanded={isExpanded}
                >
                  <p
                    className="thought-accent thought-title min-w-0 flex-1 leading-[1.2]"
                    style={{ fontFamily: FONT }}
                  >
                    Food For Thought
                  </p>
                  <AvocadoBadge size="sm" />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded ? (
                    <motion.p
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={reduceMotion ? { duration: 0.12 } : SPRING}
                      className="thought-body-gradient w-full min-w-full overflow-hidden break-words"
                    >
                      {THOUGHT}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>

              <motion.button
                type="button"
                layout
                transition={transition}
                className="flex w-full cursor-pointer flex-col items-center gap-2 border-0 bg-transparent px-3 py-1"
                onClick={() => setState((s) => (s === "expanded" ? "preview" : "expanded"))}
                aria-label={isExpanded ? "Show preview" : "Expand Food For Thought"}
              >
                <div className="flex w-full items-start justify-between gap-5">
                  <p
                    className="thought-accent thought-meta min-w-0 flex-1 font-light leading-[1.2]"
                    style={{ fontFamily: FONT }}
                  >
                    FRI, 27 AUG 25
                  </p>
                  <img alt="" src={moreIcon} width={13} height={13} className="block shrink-0 rounded-[12px]" />
                </div>
                <img alt="" src={handleIcon} width={22} height={2} className="block opacity-70" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
