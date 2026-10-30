import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { SpecAnnotation } from "./inspectorTypes";

const INSPECT_RING = "ring-2 ring-purple-500 bg-purple-500/15";
const PAD_PX = 8;

type Box = { left: number; top: number; width: number; height: number };

type InspectHotspotOverlayProps = {
  annotations: SpecAnnotation[];
  highlightHotspotId?: string | null;
  onHotspotHover?: (id: string | null) => void;
};

/**
 * Padded bounding boxes over inspectable nodes.
 * Prefers live `[data-inspect-id]` metrics; falls back to authored artboard %.
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

      const or = overlay.getBoundingClientRect();
      if (or.width < 2 || or.height < 2) return;

      const next: Record<string, Box> = {};
      for (const a of annotations) {
        const node = scope.querySelector<HTMLElement>(`[data-inspect-id="${a.id}"]`);
        if (node) {
          const nr = node.getBoundingClientRect();
          next[a.id] = {
            left: nr.left - or.left - PAD_PX,
            top: nr.top - or.top - PAD_PX,
            width: nr.width + PAD_PX * 2,
            height: nr.height + PAD_PX * 2,
          };
        } else {
          const b = a.bounds;
          next[a.id] = {
            left: (b.x / 100) * or.width - PAD_PX,
            top: (b.y / 100) * or.height - PAD_PX,
            width: (b.w / 100) * or.width + PAD_PX * 2,
            height: (b.h / 100) * or.height + PAD_PX * 2,
          };
        }
      }

      const key = Object.entries(next)
        .map(([id, box]) => `${id}:${Math.round(box.left)}:${Math.round(box.top)}:${Math.round(box.width)}:${Math.round(box.height)}`)
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
        const active = highlightHotspotId === a.id;
        const box = boxes[a.id];
        const style = box
          ? { left: box.left, top: box.top, width: box.width, height: box.height }
          : {
              left: `${a.bounds.x}%`,
              top: `${a.bounds.y}%`,
              width: `${a.bounds.w}%`,
              height: `${a.bounds.h}%`,
            };

        return (
          <button
            key={a.id}
            type="button"
            data-inspect-hotspot={a.id}
            aria-label={a.accessibleName}
            className={cn(
              "pointer-events-auto absolute rounded-[10px] transition-all duration-200",
              "cursor-pointer hover:bg-purple-500/10 hover:ring-2 hover:ring-purple-400/90",
              active && INSPECT_RING,
            )}
            style={style}
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
