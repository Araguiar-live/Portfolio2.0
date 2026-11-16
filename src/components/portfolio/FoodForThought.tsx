import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import avocadoIcon from "@/assets/portfolio/thought/avocado.svg";
import handleIcon from "@/assets/portfolio/thought/handle.svg";
import moreIcon from "@/assets/portfolio/thought/more.svg";
import { cn } from "@/lib/utils";

const FONT = "Helvetica, Arial, sans-serif";
const SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};

/** Hover opens in one motion. A short grace period keeps it from flickering as the card grows. */
const OPEN_DELAY_MS = 70;
const LEAVE_COLLAPSE_MS = 420;

const THOUGHT =
  "Design is an invitation to experiment: to try, to play, to wonder “what if?” Beyond what it does, it can surprise us, spark a smile, or gently nudge us to see things differently. Function matters, but it is not the whole story. Even the most practical thing has room for curiosity, delight, and a little mischief. Play is not a detour from meaning; it is one way we find it.";

type ThoughtState = "collapsed" | "expanded";

function AvocadoBadge() {
  return (
    <span className="thought-badge flex shrink-0 items-center rounded-[12px] p-1.5" aria-hidden>
      <img alt="" src={avocadoIcon} width={12} height={12} className="block size-3" />
    </span>
  );
}

/**
 * Figma 2305:66701 — collapsed badge morphs straight into the note.
 * Hover opens it. A click pins it open so it can be read. The handle, Escape,
 * or a click outside closes it.
 */
export function FoodForThought({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinnedRef = useRef(false);
  const [state, setState] = useState<ThoughtState>("collapsed");
  const [pinned, setPinned] = useState(false);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const setPin = useCallback((next: boolean) => {
    pinnedRef.current = next;
    setPinned(next);
  }, []);

  const collapse = useCallback(() => {
    clearTimer();
    setPin(false);
    setState("collapsed");
  }, [clearTimer, setPin]);

  const expand = useCallback(
    (pin: boolean) => {
      clearTimer();
      if (pin) setPin(true);
      setState("expanded");
    },
    [clearTimer, setPin],
  );

  const scheduleExpand = useCallback(() => {
    clearTimer();
    timer.current = setTimeout(() => expand(false), reduceMotion ? 0 : OPEN_DELAY_MS);
  }, [clearTimer, expand, reduceMotion]);

  const scheduleCollapse = useCallback(() => {
    if (pinnedRef.current) return;
    clearTimer();
    timer.current = setTimeout(collapse, reduceMotion ? 0 : LEAVE_COLLAPSE_MS);
  }, [clearTimer, collapse, reduceMotion]);

  useEffect(() => {
    const onDocPointer = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root || root.contains(event.target as Node)) return;
      collapse();
    };
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, [collapse]);

  useEffect(() => {
    if (state !== "expanded") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") collapse();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [collapse, state]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const isCollapsed = state === "collapsed";
  const transition = reduceMotion ? { duration: 0.12 } : SPRING;

  return (
    <div
      ref={rootRef}
      data-thought-state={state}
      data-thought-pinned={pinned ? "true" : "false"}
      className={cn("thought-glass-host relative w-max shrink-0", className)}
      onPointerEnter={() => {
        if (isCollapsed) scheduleExpand();
        else clearTimer();
      }}
      onPointerLeave={scheduleCollapse}
      role="group"
      aria-label="Food For Thought"
    >
      <span className="thought-glass-frost" aria-hidden />
      <motion.div
        layout
        data-node-id={isCollapsed ? "2313:66747" : "2305:66699"}
        data-thought-state={state}
        transition={transition}
        style={{ borderRadius: isCollapsed ? 999 : 16, originX: 1, originY: 0 }}
        className={cn(
          "thought-glass relative z-[1] ml-auto overflow-hidden",
          isCollapsed ? "size-11 sm:size-[3.575rem]" : "w-[236px]",
        )}
      >
        <div
          className={cn(
            "flex w-full items-center",
            isCollapsed ? "h-full justify-center" : "justify-between gap-2 px-2.5 pb-1 pt-2 pr-3",
          )}
        >
          <motion.p
            initial={false}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={transition}
            className={cn(
              "thought-accent thought-title min-w-0 flex-1 leading-[1.2]",
              isCollapsed && "pointer-events-none absolute w-0 overflow-hidden opacity-0",
            )}
            style={{ fontFamily: FONT }}
            aria-hidden={isCollapsed}
          >
            Food For Thought
          </motion.p>
          {isCollapsed ? (
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center rounded-full border-0 bg-transparent p-0"
              aria-label="Open Food For Thought"
              aria-expanded={false}
              onClick={() => expand(true)}
            >
              <AvocadoBadge />
            </button>
          ) : (
            <AvocadoBadge />
          )}
        </div>

        <motion.div
          initial={false}
          animate={{ height: isCollapsed ? 0 : "auto", opacity: isCollapsed ? 0 : 1 }}
          transition={transition}
          className="overflow-hidden"
        >
          <p className="thought-body-gradient w-full break-words px-2.5">{THOUGHT}</p>
          <button
            type="button"
            className="flex w-full cursor-pointer flex-col items-center gap-2 border-0 bg-transparent px-3 py-1"
            onClick={collapse}
            aria-label="Close Food For Thought"
            aria-expanded
            tabIndex={isCollapsed ? -1 : 0}
          >
            <div className="flex w-full items-start justify-between gap-5">
              <p
                className="thought-accent thought-meta min-w-0 flex-1 text-left font-light leading-[1.2]"
                style={{ fontFamily: FONT }}
              >
                FRI, 27 AUG 25
              </p>
              <img
                alt=""
                src={moreIcon}
                width={13}
                height={13}
                className="block shrink-0 rounded-[12px]"
              />
            </div>
            <img alt="" src={handleIcon} width={22} height={2} className="block opacity-70" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
