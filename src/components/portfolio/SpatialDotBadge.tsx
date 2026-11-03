import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Figma 2305:66727 — frosted spatial badge that sits on the wireframe URL.
 * Resting pose is rotateY(-3deg). Drag spins it; a click, and a slow idle
 * turn, complete one full revolution and settle back on that tilt.
 */
const DOTS = [
  { top: "24%", left: "16%", size: 18, color: "rgba(120, 176, 224, 0.88)" },
  { top: "30%", left: "58%", size: 11, color: "rgba(198, 220, 238, 0.92)" },
  { top: "58%", left: "20%", size: 14, color: "rgba(150, 192, 224, 0.82)" },
  { top: "60%", left: "54%", size: 17, color: "#1a4fd0" },
] as const;

const SPIN = { type: "spring" as const, stiffness: 160, damping: 22, mass: 0.7 };

export function SpatialDotBadge() {
  const reduceMotion = useReducedMotion();
  const rotateY = useMotionValue(-3);
  const drag = useRef<{ x: number; moved: number; active: boolean } | null>(null);
  const spinning = useRef(false);

  useEffect(() => {
    if (reduceMotion) return;
    const spinOnce = () => {
      if (drag.current?.active || spinning.current) return;
      spinning.current = true;
      animate(rotateY, rotateY.get() + 360, SPIN).then(() => {
        spinning.current = false;
      });
    };
    const first = window.setTimeout(spinOnce, 1200);
    const id = window.setInterval(spinOnce, 5200);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [reduceMotion, rotateY]);

  const settle = () => {
    const current = rotateY.get();
    animate(rotateY, -3 + Math.round((current + 3) / 360) * 360, SPIN);
  };

  return (
    <motion.div
      role="img"
      aria-label="Interactive spatial dot badge"
      data-node-id="2305:66727"
      data-name="spatial-dot-badge"
      className="spatial-layer relative flex size-[88px] cursor-grab flex-col items-start gap-4 rounded-[64px] border border-solid border-[rgba(24,116,170,0.2)] bg-gradient-to-l from-[rgba(3,104,199,0.4)] to-[rgba(19,136,129,0.24)] p-5 active:cursor-grabbing"
      style={{
        transformStyle: "preserve-3d",
        rotateY,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        touchAction: "none",
      }}
      onPointerDown={(event) => {
        drag.current = { x: event.clientX, moved: 0, active: true };
        spinning.current = true;
        rotateY.stop();
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const current = drag.current;
        if (!current?.active) return;
        const dx = event.clientX - current.x;
        current.moved += Math.abs(dx);
        current.x = event.clientX;
        rotateY.set(rotateY.get() + dx * 0.9);
      }}
      onPointerUp={() => {
        const moved = drag.current?.moved ?? 0;
        drag.current = null;
        if (reduceMotion) {
          rotateY.set(-3);
          spinning.current = false;
          return;
        }
        if (moved >= 8) {
          settle();
          spinning.current = false;
          return;
        }
        const controls = animate(rotateY, rotateY.get() + 360, SPIN);
        controls.then(() => {
          spinning.current = false;
        });
      }}
      onPointerCancel={() => {
        drag.current = null;
        spinning.current = false;
        settle();
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-2 top-1.5 h-7 rounded-full bg-white/55 blur-[2px]"
      />
      {DOTS.map((dot) => (
        <span
          key={`${dot.top}-${dot.left}`}
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            background: dot.color,
            transform: "translateZ(14px)",
          }}
        />
      ))}
    </motion.div>
  );
}
