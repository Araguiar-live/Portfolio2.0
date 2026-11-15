import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { SpecAnnotation } from "./inspectorTypes";

const INSPECT_RING =
  "bg-[rgba(255,255,255,0.15)] shadow-[0_0_0_2px_#fff,0_0_12px_rgba(255,255,255,0.35)]";

type Box = {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: string;
};

type InspectHotspotOverlayProps = {
  annotations: SpecAnnotation[];
  highlightHotspotId?: string | null;
  onHotspotHover?: (id: string | null) => void;
};

function roundPx(n: number) {
  return Math.round(n * 2) / 2;
}

function scaleRadius(value: string, axis: number) {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return value;
  const unit = value.replace(/[0-9.+-eE]/g, "") || "px";
  return `${roundPx(n * axis)}${unit}`;
}

function readRadius(node: HTMLElement, scaleX: number, scaleY: number) {
  const cs = getComputedStyle(node);
  return [
    scaleRadius(cs.borderTopLeftRadius, scaleX),
    scaleRadius(cs.borderTopRightRadius, scaleX),
    scaleRadius(cs.borderBottomRightRadius, scaleY),
    scaleRadius(cs.borderBottomLeftRadius, scaleY),
  ].join(" ");
}

/**
 * Map a `[data-inspect-id]` node into the overlay's CSS pixel grid.
 * Uses the target's offsetWidth/offsetHeight for layout size and converts
 * its live box (offsetLeft/offsetTop + CSS transforms) through the overlay
 * scale so the highlight hugs the painted control.
 */
function measureTarget(node: HTMLElement, overlay: HTMLElement): Box | null {
  const ow = overlay.offsetWidth;
  const oh = overlay.offsetHeight;
  const or = overlay.getBoundingClientRect();
  if (ow < 1 || oh < 1 || or.width < 1 || or.height < 1) return null;

  const width = node.offsetWidth;
  const height = node.offsetHeight;
  if (width < 1 || height < 1) return null;

  const nr = node.getBoundingClientRect();
  const sx = or.width / ow;
  const sy = or.height / oh;
  const boxW = nr.width / sx;
  const boxH = nr.height / sy;

  return {
    left: roundPx((nr.left - or.left) / sx),
    top: roundPx((nr.top - or.top) / sy),
    width: roundPx(boxW),
    height: roundPx(boxH),
    radius: readRadius(node, boxW / width, boxH / height),
  };
}

/**
 * Highlight boxes hug live `[data-inspect-id]` nodes — exact offset size,
 * position, and border-radius. No authored % bounds, no padding inset.
 */
export function InspectHotspotOverlay({
  annotations,
  highlightHotspotId,
  onHotspotHover,
}: InspectHotspotOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});

  useLayoutEffect(() => {
    if (!annotations.length) return;
    let frame = 0;
    let last = "";

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const overlay = rootRef.current;
      const scope = overlay?.parentElement;
      if (!overlay || !scope) return;
      if (overlay.offsetWidth < 2 || overlay.offsetHeight < 2) return;

      const next: Record<string, Box> = {};
      for (const a of annotations) {
        const node = scope.querySelector<HTMLElement>(`[data-inspect-id="${a.id}"]`);
        if (!node) continue;
        const box = measureTarget(node, overlay);
        if (box) next[a.id] = box;
      }

      const key = Object.entries(next)
        .map(([id, box]) => `${id}:${box.left}:${box.top}:${box.width}:${box.height}:${box.radius}`)
        .join("|");
      if (key === last) return;
      last = key;
      setBoxes(next);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [annotations]);

  if (!annotations.length) return null;

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-30 overflow-visible">
      {annotations.map((a) => {
        const box = boxes[a.id];
        if (!box) return null;
        const active = highlightHotspotId === a.id;

        return (
          <button
            key={a.id}
            type="button"
            data-inspect-hotspot={a.id}
            aria-label={a.accessibleName}
            className={cn(
              "pointer-events-auto absolute border-0 bg-transparent transition-[box-shadow,background-color] duration-200",
              "cursor-pointer hover:bg-[rgba(255,255,255,0.1)] hover:shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_0_10px_rgba(255,255,255,0.28)]",
              active && INSPECT_RING,
            )}
            style={{
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
              borderRadius: box.radius,
            }}
            onMouseEnter={() => onHotspotHover?.(a.id)}
            onMouseLeave={() => onHotspotHover?.(null)}
            onFocus={() => onHotspotHover?.(a.id)}
            onBlur={() => onHotspotHover?.(null)}
          />
        );
      })}
    </div>
  );
}
