import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { InspectorFrameId } from "./inspectorTypes";
import {
  PRODUCTIVE_WIREFRAME_PHONE_H,
  PRODUCTIVE_WIREFRAME_PHONE_W,
  ProductiveWireframePhone,
} from "./ProductiveWireframePhone";
import { cn } from "@/lib/utils";
import {
  DesignSystemInspectorModal,
  INSPECTOR_PREVIEW_INSET,
  INSPECTOR_PREVIEW_W,
} from "./DesignSystemInspectorModal";
import { InspectorTetheredSpecs } from "./InspectorTetheredSpecs";
import {
  DEFAULT_ZOOM,
  DESIGN_FILE_MAX_W,
  ProductiveDesignFileFrame,
} from "./ProductiveDesignFileFrame";
import { INSPECTOR_FRAMES } from "./inspectorTypes";
import { ProductiveFrameScreen } from "./ProductiveScreens";
import { ProductiveUnframedArtboard, UNFRAMED_ARTBOARD_W } from "./ProductiveUnframedArtboard";

const HORIZONTAL_ORDER = [0, 1, 2, 3, 4, 5] as const;
const DRAWER_TO_ARTBOARD_GAP = 40;
/** Matches the `gap-12` on the canvas strip in ProductiveDesignFileFrame. */
const CANVAS_STRIP_GAP = 48;
/** Left drawer: inset + fitted inspect phone, capped to the 874px file frame. */
const INSPECTOR_DRAWER_RIGHT_PX = INSPECTOR_PREVIEW_INSET + INSPECTOR_PREVIEW_W;
const INSPECTOR_ARTBOARD_ZOOM = 0.85;

/**
 * Bending Spoons / Productive — Figma 2238:175039 file mockup:
 * dotted canvas, left pinned phone preview, center unframed artboards, right spec column.
 */
export function FirstDesignInspector() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFrameIndex, setModalFrameIndex] = useState(0);
  const [isDevModeActive, setIsDevModeActive] = useState(false);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);

  const [inspectorCamX, setInspectorCamX] = useState(0);
  const [browseCamera, setBrowseCamera] = useState({ x: 0, y: 0, z: DEFAULT_ZOOM });

  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (modalOpen) return;
    const root = wrapperRef.current;
    if (!root) return;

    const measure = () => {
      const el = root.querySelector<HTMLElement>("[data-productive-design-viewport]");
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 32 || h < 32) return;
      const stripW =
        HORIZONTAL_ORDER.length * PRODUCTIVE_WIREFRAME_PHONE_W +
        (HORIZONTAL_ORDER.length - 1) * CANVAS_STRIP_GAP;
      const stripH = PRODUCTIVE_WIREFRAME_PHONE_H;
      const insetX = 28;
      const insetY = 24;
      const z = Math.min(
        DEFAULT_ZOOM,
        (w - insetX * 2) / stripW,
        (h - insetY * 2) / stripH,
      );
      // Pin the strip to the top of the canvas so all six phones are on screen.
      const y = insetY - h / 2 + (stripH * z) / 2;
      setBrowseCamera((prev) =>
        Math.abs(prev.z - z) < 0.004 && Math.abs(prev.y - y) < 1 ? prev : { x: 0, y, z },
      );
    };

    measure();
    const el = root.querySelector("[data-productive-design-viewport]");
    const ro = new ResizeObserver(measure);
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [modalOpen]);
  const previewPhoneRef = useRef<HTMLDivElement>(null);

  const frame = INSPECTOR_FRAMES[modalFrameIndex];
  const annotations = frame.annotations ?? [];

  const inspectorModal = (
    <DesignSystemInspectorModal
      open={modalOpen}
      initialFrameIndex={modalFrameIndex}
      phoneRef={previewPhoneRef}
      highlightHotspotId={activeAnnotationId}
      onHotspotHover={setActiveAnnotationId}
      isDevModeActive={isDevModeActive}
      onToggleDevMode={() => setIsDevModeActive((v) => !v)}
      onClose={() => {
        setModalOpen(false);
        setActiveAnnotationId(null);
      }}
      onFrameIndexChange={(index) => {
        setActiveAnnotationId(null);
        setModalFrameIndex(index);
      }}
    />
  );

  const openModal = (frameIndex: number) => {
    const viewportW = Math.min(wrapperRef.current?.clientWidth ?? 1200, DESIGN_FILE_MAX_W);
    const z = INSPECTOR_ARTBOARD_ZOOM;
    const stripW =
      HORIZONTAL_ORDER.length * UNFRAMED_ARTBOARD_W + (HORIZONTAL_ORDER.length - 1) * CANVAS_STRIP_GAP;
    // The strip is centred on the camera; shift it so the opened frame sits just right of the drawer.
    const selectedLeftInStrip = frameIndex * (UNFRAMED_ARTBOARD_W + CANVAS_STRIP_GAP);
    const targetLeft = INSPECTOR_DRAWER_RIGHT_PX + DRAWER_TO_ARTBOARD_GAP;
    setInspectorCamX(Math.round(targetLeft - viewportW / 2 + (stripW / 2 - selectedLeftInStrip) * z));
    setModalFrameIndex(frameIndex);
    setModalOpen(true);
  };

  const selectFrame = (frameIndex: number) => {
    setActiveAnnotationId(null);
    setModalFrameIndex(frameIndex);
  };

  return (
    <div ref={wrapperRef} className="flex w-full justify-center">
      {modalOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              aria-hidden
              className={cn(
                "spatial-layer spatial-spring pointer-events-none fixed inset-0 z-40 h-screen w-screen",
                isDevModeActive ? "spatial-glass bg-zinc-900/20" : "bg-transparent",
              )}
            />,
            document.body,
          )
        : null}
      <ProductiveDesignFileFrame
        key={
          modalOpen
            ? `inspector-open-${inspectorCamX}`
            : `inspector-closed-${browseCamera.z.toFixed(3)}-${Math.round(browseCamera.y)}`
        }
        initialCamera={
          modalOpen
            ? { x: inspectorCamX, y: 0, z: INSPECTOR_ARTBOARD_ZOOM }
            : browseCamera
        }
        overlayAboveDocument={modalOpen}
        overlayUnclipped={modalOpen}
        overlay={
          <>
            {inspectorModal}
            {modalOpen && isDevModeActive ? (
              <InspectorTetheredSpecs
                annotations={annotations}
                frameRole={frame.role}
                artboardRef={previewPhoneRef}
                activeId={activeAnnotationId}
                onActiveChange={setActiveAnnotationId}
              />
            ) : null}
          </>
        }
      >
        {modalOpen ? (
          HORIZONTAL_ORDER.map((frameIndex) => {
            const f = INSPECTOR_FRAMES[frameIndex];
            const selected = frameIndex === modalFrameIndex;
            return (
              <ProductiveUnframedArtboard
                key={f.id}
                frameId={f.id}
                onSelect={selected ? undefined : () => selectFrame(frameIndex)}
                ariaLabel={selected ? undefined : `Inspect ${f.label}`}
                className={cn(!selected && frameIndex > 1 && "opacity-70")}
              />
            );
          })
        ) : (
          HORIZONTAL_ORDER.map((frameIndex) => {
            const f = INSPECTOR_FRAMES[frameIndex];
            return (
              <WireframePhone
                key={f.id}
                frameId={f.id}
                interactive
                onClick={() => openModal(frameIndex)}
                ariaLabel={`Open ${f.label} in design system inspector`}
              >
                <ProductiveFrameScreen frameId={f.id} />
              </WireframePhone>
            );
          })
        )}
      </ProductiveDesignFileFrame>
    </div>
  );
}

function WireframePhone({
  children,
  interactive,
  onClick,
  ariaLabel,
  dimmed,
}: {
  frameId: InspectorFrameId;
  children: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  ariaLabel: string;
  dimmed?: boolean;
}) {
  const phone = (
    <div className={cn("shrink-0", dimmed && "opacity-70")}>
      <ProductiveWireframePhone>{children}</ProductiveWireframePhone>
    </div>
  );

  if (interactive && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="shrink-0 cursor-pointer rounded-[58px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]"
        aria-label={ariaLabel}
      >
        {phone}
      </button>
    );
  }

  return (
    <div className="shrink-0" aria-label={ariaLabel}>
      {phone}
    </div>
  );
}
