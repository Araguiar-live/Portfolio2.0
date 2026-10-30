import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useRef, useState } from "react";
import ellipse2 from "@/assets/portfolio/spatial-dot-badge/ellipse-2.svg";
import ellipse728 from "@/assets/portfolio/spatial-dot-badge/ellipse-728.svg";
import { cn } from "@/lib/utils";

/** Figma 2305:66727 — four interior spheres in a circular badge. */
const DOTS = [
  { id: "tl", gx: -1, gy: -1, src: ellipse2, depth: 0.1 },
  { id: "tr", gx: 1, gy: -1, src: ellipse2, depth: 0.14 },
  { id: "bl", gx: -1, gy: 1, src: ellipse2, depth: 0.16 },
  { id: "br", gx: 1, gy: 1, src: ellipse728, depth: 0.22 },
] as const;

const SPRING_ROTATE = { stiffness: 140, damping: 20, mass: 0.65 };
const PARALLAX_MAX = 7;

type Props = {
  className?: string;
};

/**
 * Circular spatial badge — cursor parallax on dots + drag-to-spin with inertia.
 * Authored at 88×88 (Figma 2305:66727): 20px padding, 16px dots, 16px gap.
 */
export function SpatialDotBadge({ className }: Props) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const spinVelocityRef = useRef(0);
  const [hovering, setHovering] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const rotate = useMotionValue(0);
  const rotateSpring = useSpring(rotate, reduceMotion ? { stiffness: 500, damping: 50 } : SPRING_ROTATE);
  const tiltX = useTransform(rotateSpring, (r) => (reduceMotion ? 0 : Math.sin((r * Math.PI) / 180) * 4));
  const tiltY = useTransform(rotateSpring, (r) => (reduceMotion ? 0 : Math.cos((r * Math.PI) / 180) * -3));

  const updateParallax = useCallback(
    (clientX: number, clientY: number) => {
      if (reduceMotion || draggingRef.current) return;
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (clientX - cx) / (rect.width / 2);
      const ny = (clientY - cy) / (rect.height / 2);
      setParallax({
        x: Math.max(-1, Math.min(1, nx)) * PARALLAX_MAX,
        y: Math.max(-1, Math.min(1, ny)) * PARALLAX_MAX,
      });
    },
    [reduceMotion],
  );

  const onPointerMove = (event: React.PointerEvent) => {
    updateParallax(event.clientX, event.clientY);

    if (!draggingRef.current || reduceMotion) return;
    const last = lastPointerRef.current;
    if (!last) {
      lastPointerRef.current = { x: event.clientX, y: event.clientY, t: event.timeStamp };
      return;
    }
    const dx = event.clientX - last.x;
    const dt = Math.max(8, event.timeStamp - last.t);
    spinVelocityRef.current = (dx / dt) * 18;
    rotate.set(rotate.get() + dx * 0.45);
    lastPointerRef.current = { x: event.clientX, y: event.clientY, t: event.timeStamp };
  };

  const onPointerDown = (event: React.PointerEvent) => {
    if (reduceMotion) return;
    draggingRef.current = true;
    lastPointerRef.current = { x: event.clientX, y: event.clientY, t: event.timeStamp };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const endDrag = (event: React.PointerEvent) => {
    draggingRef.current = false;
    lastPointerRef.current = null;
    if (reduceMotion) return;
    const spin = spinVelocityRef.current;
    if (Math.abs(spin) > 0.05) {
      rotate.set(rotate.get() + spin * 48);
    }
    spinVelocityRef.current = 0;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
  };

  return (
    <motion.div
      ref={rootRef}
      data-node-id="2305:66727"
      data-name="spatial-dot-badge"
      className={cn(
        "spatial-layer relative flex size-[88px] cursor-grab flex-col items-start gap-4 rounded-[64px] border border-solid border-[rgba(24,116,170,0.2)] bg-gradient-to-l from-[rgba(3,104,199,0.4)] to-[rgba(19,136,129,0.24)] p-5 active:cursor-grabbing",
        className,
      )}
      style={{
        rotate: rotateSpring,
        rotateX: tiltX,
        rotateY: tiltY,
        transformStyle: "preserve-3d",
      }}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => {
        setHovering(false);
        setParallax({ x: 0, y: 0 });
        draggingRef.current = false;
      }}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={(e) => endDrag(e)}
      onPointerCancel={(e) => endDrag(e)}
      role="img"
      aria-label="Interactive spatial dot badge"
    >
      <div className="flex w-full shrink-0 flex-col gap-4" style={{ transformStyle: "preserve-3d" }}>
        {[
          DOTS.slice(0, 2),
          DOTS.slice(2, 4),
        ].map((row, rowIndex) => (
          <div key={rowIndex} className="flex w-full shrink-0 items-center gap-4">
            {row.map((dot) => {
              const px = hovering ? parallax.x * dot.depth : 0;
              const py = hovering ? parallax.y * dot.depth : 0;
              return (
                <motion.span
                  key={dot.id}
                  className="block size-4 shrink-0"
                  style={{ z: dot.depth * 40 }}
                  animate={{ x: px, y: py }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                >
                  <img
                    src={dot.src}
                    alt=""
                    width={16}
                    height={16}
                    draggable={false}
                    className="block"
                  />
                </motion.span>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
