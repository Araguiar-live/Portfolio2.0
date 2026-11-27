import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { DesignFileDotGrid } from "@/components/portfolio/firstDesign/DesignFileDotGrid";
import { InspectorModalHeader } from "@/components/portfolio/firstDesign/InspectorModalHeader";
import {
  SPEC_KEY,
  KeyPill,
  SpecDetailCard,
} from "@/components/portfolio/firstDesign/InspectorTetheredSpecs";
import { INSPECTOR_FRAMES } from "@/components/portfolio/firstDesign/inspectorTypes";
import { ProductiveFrameScreen } from "@/components/portfolio/firstDesign/ProductiveScreens";
import { ProductiveWireframePhone } from "@/components/portfolio/firstDesign/ProductiveWireframePhone";
import { CRCLE_IOS_SHEET_SPRING, CRCLE_MOTION_INSTANT } from "@/lib/crcle-ios-sheet-spring";

const PHONE_W = 402;
const PHONE_H = 874;
/** Dev on — leave room for spec rails. */
const MOBILE_INSPECT_SCALE_DEV = 0.48;
/** Preview — fit width on 390px (≈ min((100vw − 32px) / 402, 0.82)). */
const MOBILE_INSPECT_SCALE_PREVIEW = 0.78;

const EXPANDED = {
  y: 0,
  scale: 1,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
} as const;

const COLLAPSED = {
  y: "106%",
  scale: 0.94,
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
} as const;

function InspectorSheetBody({
  frameIndex,
  devMode,
  activeAnnotationId,
  phoneRef,
  interactive,
  onFrameIndexChange,
  onToggleDevMode,
  onClose,
  onActiveChange,
}: {
  frameIndex: number;
  devMode: boolean;
  activeAnnotationId: string | null;
  phoneRef: React.RefObject<HTMLDivElement | null>;
  interactive: boolean;
  onFrameIndexChange: (index: number) => void;
  onToggleDevMode: () => void;
  onClose: () => void;
  onActiveChange: (id: string | null) => void;
}) {
  const frame = INSPECTOR_FRAMES[frameIndex];
  const annotations = frame.annotations ?? [];
  const activeKind = annotations.find((a) => a.id === activeAnnotationId)?.kind ?? null;
  const activeKinds = new Set(annotations.map((a) => a.kind));

  const goPrev = useCallback(() => {
    onActiveChange(null);
    onFrameIndexChange((frameIndex - 1 + INSPECTOR_FRAMES.length) % INSPECTOR_FRAMES.length);
  }, [frameIndex, onActiveChange, onFrameIndexChange]);

  const goNext = useCallback(() => {
    onActiveChange(null);
    onFrameIndexChange((frameIndex + 1) % INSPECTOR_FRAMES.length);
  }, [frameIndex, onActiveChange, onFrameIndexChange]);

  const previewScale = devMode ? MOBILE_INSPECT_SCALE_DEV : MOBILE_INSPECT_SCALE_PREVIEW;
  const previewW = PHONE_W * previewScale;
  const previewH = PHONE_H * previewScale;

  return (
    <div
      className="productive-mobile-inspector-overlay__panel relative flex h-full min-h-0 w-full flex-col bg-[#1b1b1b]"
      data-dev-mode={devMode ? "true" : undefined}
    >
      <DesignFileDotGrid className="productive-mobile-inspector-overlay__dots pointer-events-none absolute inset-0 z-0" />
      {devMode ? (
        <div
          aria-hidden
          className="productive-mobile-inspector-overlay__dev-wash pointer-events-none absolute inset-0 z-[1]"
        />
      ) : null}

      <div
        className="productive-mobile-inspector-overlay__chrome relative z-10 shrink-0 px-3 pt-[max(8px,env(safe-area-inset-top))]"
        style={{ pointerEvents: interactive ? "auto" : "none" }}
      >
        <InspectorModalHeader
          frameIndex={frameIndex}
          frameCount={INSPECTOR_FRAMES.length}
          frameLabel={frame.label}
          isDevModeActive={devMode}
          onToggleDevMode={onToggleDevMode}
          onPrev={goPrev}
          onNext={goNext}
          onClose={onClose}
        />
      </div>

      <div
        className={cn(
          "productive-mobile-inspector-overlay__body relative z-10 min-h-0 flex-1 px-3 pb-[max(16px,env(safe-area-inset-bottom))]",
          devMode
            ? "overflow-y-auto overflow-x-hidden overscroll-contain"
            : "flex flex-col overflow-hidden",
        )}
        style={{ pointerEvents: interactive ? "auto" : "none" }}
      >
        <div
          className={cn(
            "flex w-full flex-col items-center",
            devMode ? "gap-3 pt-1" : "min-h-0 flex-1 justify-center gap-2 py-2",
          )}
        >
          <div
            className="productive-mobile-inspector-overlay__phone relative mx-auto shrink-0 overflow-visible transition-[width,height] duration-300 ease-out motion-reduce:transition-none"
            style={{ width: previewW, height: previewH }}
          >
            <div
              ref={phoneRef}
              className="absolute left-0 top-0 origin-top-left will-change-transform transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{
                width: PHONE_W,
                height: PHONE_H,
                transform: `scale(${previewScale}) translate3d(0,0,0)`,
              }}
            >
              <ProductiveWireframePhone>
                <ProductiveFrameScreen
                  frameId={frame.id}
                  standalone={false}
                  devMode={devMode}
                  highlightHotspotId={devMode ? activeAnnotationId : null}
                  onHotspotHover={onActiveChange}
                />
              </ProductiveWireframePhone>
            </div>
          </div>

          {devMode && annotations.length > 0 ? (
            <div className="productive-mobile-inspector-overlay__specs flex w-full flex-col gap-4">
              <div
                className="productive-mobile-inspector-overlay__keys flex w-full max-w-full gap-1.5 overflow-x-auto overflow-y-visible px-0.5 pb-2 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                role="tablist"
                aria-label="Annotation types"
              >
                {SPEC_KEY.filter((entry) => activeKinds.has(entry.kind)).map((entry) => {
                  const match = annotations.find((a) => a.kind === entry.kind);
                  const active = activeKind === entry.kind;
                  return (
                    <div key={entry.kind} className="shrink-0 py-1">
                      <button
                        type="button"
                        onClick={() => match && onActiveChange(match.id)}
                        className={cn(
                          "rounded-xl border-0 bg-transparent p-0",
                          activeKind && !active && "opacity-50",
                        )}
                      >
                        <KeyPill entry={entry} active={active} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div
                className="productive-mobile-inspector-overlay__cards flex w-full snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-visible overscroll-x-contain px-1 pb-2 pt-2 [scrollbar-width:thin]"
                role="list"
                aria-label="Specification cards"
              >
                {annotations.map((annotation) => (
                  <SpecDetailCard
                    key={annotation.id}
                    annotation={annotation}
                    frameRole={frame.role}
                    active={activeAnnotationId === annotation.id}
                    onHover={onActiveChange}
                    onSelect={onActiveChange}
                    condensed
                    className="productive-mobile-inspector-overlay__spec-card my-0.5"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type OverlayProps = {
  open: boolean;
  frameIndex: number;
  devMode: boolean;
  activeAnnotationId: string | null;
  onFrameIndexChange: (index: number) => void;
  onToggleDevMode: () => void;
  onActiveChange: (id: string | null) => void;
  onClosed: () => void;
};

/** Full-viewport mobile dev inspector — portal, iOS spring, frosted backdrop. */
export function FirstDesignMobileInspectorOverlay({
  open,
  frameIndex,
  devMode,
  activeAnnotationId,
  onFrameIndexChange,
  onToggleDevMode,
  onActiveChange,
  onClosed,
}: OverlayProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"collapsed" | "expanded">("collapsed");
  const [interactive, setInteractive] = useState(false);
  const expandedOnce = useRef(false);
  const closing = useRef(false);
  const phoneRef = useRef<HTMLDivElement>(null);
  const transition = reduceMotion ? CRCLE_MOTION_INSTANT : CRCLE_IOS_SHEET_SPRING;

  useEffect(() => setMounted(true), []);

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

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, requestClose]);

  if (!mounted || !open) return null;

  const layout = phase === "expanded" ? EXPANDED : COLLAPSED;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Productive design inspector"
      className="productive-mobile-inspector-overlay fixed inset-0 z-[145] touch-none md:hidden"
      data-phase={phase}
      data-productive-mobile-inspector
    >
      <DesignFileDotGrid className="productive-mobile-inspector-overlay__dots pointer-events-none absolute inset-0 z-0" />
      <button
        type="button"
        aria-label="Close inspector"
        tabIndex={-1}
        onClick={requestClose}
        className="productive-mobile-inspector-overlay__scrim absolute inset-0 z-[1] border-0 bg-[rgba(11,14,20,0.42)] p-0 backdrop-blur-[6px]"
      />

      <motion.div
        className="productive-mobile-inspector-overlay__sheet fixed inset-x-0 bottom-0 z-[1] flex h-[min(96dvh,780px)] max-h-[96dvh] flex-col overflow-hidden border border-white/10 border-b-0 bg-[#1b1b1b] shadow-[0_-20px_60px_rgba(0,0,0,0.45)] will-change-transform [transform-origin:50%_100%]"
        initial={false}
        animate={layout}
        transition={transition}
        onAnimationComplete={onAnimationComplete}
        style={{ opacity: 1, translateZ: 0 }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <InspectorSheetBody
          frameIndex={frameIndex}
          devMode={devMode}
          activeAnnotationId={activeAnnotationId}
          phoneRef={phoneRef}
          interactive={interactive}
          onFrameIndexChange={onFrameIndexChange}
          onToggleDevMode={onToggleDevMode}
          onClose={requestClose}
          onActiveChange={onActiveChange}
        />
      </motion.div>
    </div>,
    document.body,
  );
}