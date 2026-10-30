import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState, type RefObject } from "react";
import { ProductiveWireframePhone } from "./ProductiveWireframePhone";
import { InspectorModalHeader } from "./InspectorModalHeader";
import { INSPECTOR_FRAMES } from "./inspectorTypes";
import { ProductiveFrameScreen } from "./ProductiveScreens";

type DesignSystemInspectorModalProps = {
  open: boolean;
  initialFrameIndex?: number;
  onClose: () => void;
  isDevModeActive: boolean;
  onToggleDevMode: () => void;
  onFrameIndexChange: (index: number) => void;
  /** Phone shell the dev-mode spec tethers attach to. */
  phoneRef?: RefObject<HTMLDivElement | null>;
  highlightHotspotId?: string | null;
  onHotspotHover?: (id: string | null) => void;
};

const PHONE_W = 402;
const PHONE_H = 874;
/** Matches `h-[874px]` on ProductiveDesignFileFrame's viewport. */
const FRAME_H = 874;
const HEADER_H = 40;
const STACK_GAP = 8;
/** 384px (20% up from 320) pulled back ~8% so the device sits inside the file frame. */
const TARGET_PREVIEW_W = 353;

export const INSPECTOR_PREVIEW_INSET = 16;

const MAX_PREVIEW_H = FRAME_H - INSPECTOR_PREVIEW_INSET * 2 - HEADER_H - STACK_GAP;
const TARGET_PREVIEW_H = TARGET_PREVIEW_W * (PHONE_H / PHONE_W);
export const INSPECTOR_PREVIEW_H = Math.min(TARGET_PREVIEW_H, MAX_PREVIEW_H);
export const INSPECTOR_PREVIEW_W = INSPECTOR_PREVIEW_H * (PHONE_W / PHONE_H);
const PREVIEW_SCALE = INSPECTOR_PREVIEW_W / PHONE_W;

/**
 * Left-pinned iPhone preview. Fitted to the 874px design-file viewport
 * so header, bezel, and home indicator stay inside the canvas.
 */
export function DesignSystemInspectorModal({
  open,
  initialFrameIndex = 0,
  onClose,
  isDevModeActive,
  onToggleDevMode,
  onFrameIndexChange,
  phoneRef,
  highlightHotspotId,
  onHotspotHover,
}: DesignSystemInspectorModalProps) {
  const [frameIndex, setFrameIndex] = useState(initialFrameIndex);

  const frame = INSPECTOR_FRAMES[frameIndex];

  useEffect(() => {
    if (open) setFrameIndex(initialFrameIndex);
  }, [open, initialFrameIndex]);

  const setFrame = useCallback(
    (index: number) => {
      setFrameIndex(index);
      onFrameIndexChange(index);
    },
    [onFrameIndexChange],
  );

  const goPrev = useCallback(() => {
    setFrame((frameIndex - 1 + INSPECTOR_FRAMES.length) % INSPECTOR_FRAMES.length);
  }, [frameIndex, setFrame]);

  const goNext = useCallback(() => {
    setFrame((frameIndex + 1) % INSPECTOR_FRAMES.length);
  }, [frameIndex, setFrame]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          key="device-drawer"
          role="dialog"
          aria-label="Device preview"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.85 }}
          className="spatial-layer pointer-events-auto absolute z-20 flex flex-col overflow-visible"
          style={{
            top: INSPECTOR_PREVIEW_INSET,
            left: INSPECTOR_PREVIEW_INSET,
            width: INSPECTOR_PREVIEW_W,
            maxHeight: FRAME_H - INSPECTOR_PREVIEW_INSET * 2,
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className="flex min-h-0 w-full flex-col items-stretch overflow-visible"
            style={{ gap: STACK_GAP }}
          >
            <InspectorModalHeader
              className="w-full shrink-0"
              frameIndex={frameIndex}
              frameCount={INSPECTOR_FRAMES.length}
              frameLabel={frame.label}
              isDevModeActive={isDevModeActive}
              onToggleDevMode={onToggleDevMode}
              onPrev={goPrev}
              onNext={goNext}
              onClose={onClose}
            />

            <div
              className="relative mx-auto shrink-0 overflow-visible drop-shadow-[32px_32px_32px_rgba(16,24,40,0.2),16px_16px_16px_rgba(16,24,40,0.08)]"
              style={{ width: INSPECTOR_PREVIEW_W, height: INSPECTOR_PREVIEW_H }}
            >
              <div
                ref={phoneRef}
                className="absolute left-0 top-0 origin-top-left"
                style={{
                  width: PHONE_W,
                  height: PHONE_H,
                  transform: `scale(${PREVIEW_SCALE})`,
                }}
              >
                <ProductiveWireframePhone>
                  <ProductiveFrameScreen
                    frameId={frame.id}
                    standalone={false}
                    devMode={isDevModeActive}
                    highlightHotspotId={isDevModeActive ? highlightHotspotId : null}
                    onHotspotHover={onHotspotHover}
                  />
                </ProductiveWireframePhone>
              </div>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
