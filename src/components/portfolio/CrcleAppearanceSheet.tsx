import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CRCLE_IOS_SHEET_SPRING, CRCLE_MOTION_INSTANT } from "@/lib/crcle-ios-sheet-spring";
import { setCrclePhoneLight } from "@/lib/crcle-phone-theme";

const EXPANDED = {
  y: 0,
  scale: 1,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
} as const;

const COLLAPSED = {
  y: "78%",
  scale: 0.72,
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
} as const;

type Props = {
  open: boolean;
  light: boolean;
  onClosed: () => void;
};

/**
 * In-phone Appearance sheet — Light / Dark (mobile case study, ≤md only).
 * Dismiss uses the same spring as MobileProjectFolderOverlay (transform-only).
 */
export function CrcleAppearanceSheet({ open, light, onClosed }: Props) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"collapsed" | "expanded">("collapsed");
  const [interactive, setInteractive] = useState(false);
  const expandedOnce = useRef(false);
  const closing = useRef(false);
  const transition = reduceMotion ? CRCLE_MOTION_INSTANT : CRCLE_IOS_SHEET_SPRING;

  useEffect(() => {
    if (!open) {
      setPhase("collapsed");
      setInteractive(false);
      expandedOnce.current = false;
      closing.current = false;
      return;
    }
    setInteractive(false);
    setPhase("collapsed");
    const id = requestAnimationFrame(() => {
      if (reduceMotion) {
        setPhase("expanded");
        setInteractive(true);
        expandedOnce.current = true;
        return;
      }
      setPhase("expanded");
    });
    return () => cancelAnimationFrame(id);
  }, [open, reduceMotion]);

  const finishClose = useCallback(() => {
    closing.current = false;
    onClosed();
  }, [onClosed]);

  const requestClose = useCallback(() => {
    if (!open || closing.current) return;
    closing.current = true;
    setInteractive(false);
    if (reduceMotion) {
      finishClose();
      return;
    }
    setPhase("collapsed");
  }, [finishClose, open, reduceMotion]);

  const onAnimationComplete = useCallback(() => {
    if (phase === "expanded") {
      expandedOnce.current = true;
      setInteractive(true);
      return;
    }
    if (phase === "collapsed" && expandedOnce.current) {
      finishClose();
    }
  }, [finishClose, phase]);

  const pickLight = useCallback(() => {
    if (!interactive) return;
    setCrclePhoneLight(true);
    requestClose();
  }, [interactive, requestClose]);

  const pickDark = useCallback(() => {
    if (!interactive) return;
    setCrclePhoneLight(false);
    requestClose();
  }, [interactive, requestClose]);

  if (!open) return null;

  const layout = phase === "expanded" ? EXPANDED : COLLAPSED;

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-[75] touch-none"
      data-appearance-ui
      role="dialog"
      aria-modal="true"
      aria-label="Appearance"
    >
      <button
        type="button"
        aria-label="Close appearance settings"
        className="absolute inset-0 z-0 border-0 bg-[rgba(1,2,17,0.45)] p-0 [.crcle-phone--light_&]:bg-[rgba(2,3,29,0.28)]"
        onClick={requestClose}
        tabIndex={-1}
      />

      <motion.div
        className="absolute inset-x-0 bottom-0 z-[1] flex max-h-[min(72%,560px)] min-h-[220px] flex-col overflow-hidden border border-[rgba(247,246,242,0.14)] border-b-0 bg-[rgba(1,2,17,0.92)] shadow-[0_-16px_48px_rgba(0,0,0,0.5)] will-change-transform [transform-origin:50%_100%] [.crcle-phone--light_&]:border-[rgba(2,3,29,0.12)] [.crcle-phone--light_&]:bg-[rgba(247,246,242,0.96)] [.crcle-phone--light_&]:shadow-[0_-12px_40px_rgba(2,3,29,0.12)]"
        initial={false}
        animate={layout}
        transition={transition}
        onAnimationComplete={onAnimationComplete}
        style={{
          opacity: 1,
          translateZ: 0,
        }}
      >
        <div className="flex shrink-0 flex-col items-center gap-1.5 pb-2 pt-3" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-white/25 [.crcle-phone--light_&]:bg-black/15" />
          <span className="text-[11px] font-medium tracking-[0.04em] text-white/45 [.crcle-phone--light_&]:text-black/40">
            Slide down
          </span>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-1"
          style={{ pointerEvents: interactive ? "auto" : "none" }}
        >
          <h2
            className="text-[17px] font-semibold tracking-[-0.02em] text-[#f7f6f2] [.crcle-phone--light_&]:text-[#02031d]"
            style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
          >
            Appearance
          </h2>
          <p className="mt-1 text-[12px] leading-[1.4] text-white/50 [.crcle-phone--light_&]:text-black/45">
            Choose how CRCLE looks across this demo.
          </p>

          <motion.ul
            className="mt-5 flex flex-col gap-2"
            role="listbox"
            aria-label="Theme"
            initial={false}
          >
            <li>
              <button
                type="button"
                role="option"
                aria-selected={light}
                disabled={!interactive}
                onClick={pickLight}
                className="flex w-full items-center gap-3 rounded-[16px] border px-4 py-3 text-left transition-colors disabled:pointer-events-none enabled:active:opacity-90 border-[rgba(247,246,242,0.12)] bg-[rgba(255,255,255,0.06)] data-[selected=true]:border-[rgba(255,129,56,0.35)] data-[selected=true]:bg-[rgba(255,81,38,0.18)] [.crcle-phone--light_&]:border-[rgba(2,3,29,0.08)] [.crcle-phone--light_&]:bg-white/70 [.crcle-phone--light_&]:data-[selected=true]:border-[rgba(255,129,56,0.45)] [.crcle-phone--light_&]:data-[selected=true]:bg-[rgba(255,81,38,0.12)]"
                data-selected={light ? "true" : "false"}
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-white/10 [.crcle-phone--light_&]:bg-black/[0.06]">
                  <Sun className="size-4 text-[#f7f6f2] [.crcle-phone--light_&]:text-[#02031d]" strokeWidth={2} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[14px] font-medium text-[#f7f6f2] [.crcle-phone--light_&]:text-[#02031d]">
                    Light
                  </span>
                  <span className="text-[11px] text-white/45 [.crcle-phone--light_&]:text-black/45">
                    Cream surfaces &amp; soft ink
                  </span>
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                role="option"
                aria-selected={!light}
                disabled={!interactive}
                onClick={pickDark}
                className="flex w-full items-center gap-3 rounded-[16px] border px-4 py-3 text-left transition-colors disabled:pointer-events-none enabled:active:opacity-90 border-[rgba(247,246,242,0.12)] bg-[rgba(255,255,255,0.06)] data-[selected=true]:border-[rgba(255,129,56,0.35)] data-[selected=true]:bg-[rgba(255,81,38,0.18)] [.crcle-phone--light_&]:border-[rgba(2,3,29,0.08)] [.crcle-phone--light_&]:bg-white/70 [.crcle-phone--light_&]:data-[selected=true]:border-[rgba(255,129,56,0.45)] [.crcle-phone--light_&]:data-[selected=true]:bg-[rgba(255,81,38,0.12)]"
                data-selected={!light ? "true" : "false"}
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-white/10 [.crcle-phone--light_&]:bg-black/[0.06]">
                  <Moon className="size-4 text-[#f7f6f2] [.crcle-phone--light_&]:text-[#02031d]" fill="currentColor" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[14px] font-medium text-[#f7f6f2] [.crcle-phone--light_&]:text-[#02031d]">
                    Dark
                  </span>
                  <span className="text-[11px] text-white/45 [.crcle-phone--light_&]:text-black/45">
                    Midnight glass &amp; glow
                  </span>
                </span>
              </button>
            </li>
          </motion.ul>
        </div>
      </motion.div>
    </div>
  );
}