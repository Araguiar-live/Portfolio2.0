import { useEffect, useRef } from "react";

const FRAME = 178;
const SVG_W = 104.205;
const SVG_H = 113.213;

/** Figma frame 3077:1686 — art sits inside the 178 card, including the stroke overflow. */
const ART_LEFT = 36.792;
const ART_TOP = 32.395;

/** Top of the tether, where the stem meets the gantry. */
const PIVOT_X = 51.1811;
const PIVOT_Y = 5.11811;
const STRING_END_Y = 26.4094;
const BOB_CX = 51.229;
const BOB_CY = 31.6626;
const STRING_LEN = 26.5445;
const HIT_R = 9;

const GANTRY_D =
  "M51.1811 5.11811C51.1811 2.40452 48.9813 0.204724 46.2677 0.204724H5.11811C2.40452 0.204724 0.204724 2.40452 0.204724 5.1181V111.37C0.204724 112.275 0.93799 113.008 1.84252 113.008H104.205";

const LOGO_D =
  "M27.5938 54.0748C30.2024 50.4707 34.4616 48.7877 38.5095 49.3465C41.2882 49.7302 44.4829 49.2832 46.1578 46.9692L47.6631 44.8894C49.3789 42.5188 52.6473 41.9558 54.9635 43.6322L67.7546 52.8903C71.2287 55.4049 71.9588 60.3263 69.3851 63.8821C68.1146 65.6379 68.3646 68.0353 68.7428 70.1694C69.0822 72.0844 68.6649 74.1478 67.4195 75.8684C65.0173 79.1871 60.4413 79.9748 57.1987 77.6279C55.4754 76.3805 54.476 74.4986 54.278 72.5109C54.0288 70.0094 53.5998 67.174 51.5634 65.7C49.7843 64.4122 47.1551 65.4581 45.8371 67.2791C42.1051 72.4349 34.9955 73.6585 29.958 70.0124C24.9207 66.3662 23.8622 59.2308 27.5938 54.0748Z";

const BOB_D =
  "M54.75 26.7978C57.4367 28.7424 58.0383 32.4968 56.0937 35.1836C54.1491 37.8703 50.3946 38.4719 47.7079 36.5273C45.0212 34.5827 44.4196 30.8282 46.3642 28.1415C48.3088 25.4548 52.0633 24.8532 54.75 26.7978Z";

const GRAVITY = 22;
const DAMPING = 1.15;
const DRIVE = 1.05;
const SWIPE_GAIN = 8;
const MAX_OMEGA = 9.2;
const NATURAL = Math.sqrt(GRAVITY);

type HangmanProps = {
  /** Fill the parent hero tile. Leaves out the standalone card size. */
  embedded?: boolean;
};

type Pendulum = {
  angle: number;
  omega: number;
  dragging: boolean;
  lastTs: number;
  hoverX: number | null;
  hoverY: number | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function wrapPi(delta: number) {
  if (delta > Math.PI) return delta - Math.PI * 2;
  if (delta < -Math.PI) return delta + Math.PI * 2;
  return delta;
}

function clientToView(svg: SVGSVGElement, clientX: number, clientY: number) {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: BOB_CX, y: BOB_CY };
  const local = point.matrixTransform(matrix.inverse());
  return { x: local.x, y: local.y };
}

function freshPendulum(): Pendulum {
  return {
    angle: 0,
    omega: 0,
    dragging: false,
    lastTs: 0,
    hoverX: null,
    hoverY: null,
  };
}

/**
 * The Figma logo hangman. The orange sphere, its tether, and the black mark
 * share one pendulum pivoted where the string meets the gantry.
 * The rAF loop writes the rotation on a ref — no React re-render per frame.
 */
export function Hangman({ embedded = false }: HangmanProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pendulumRef = useRef<SVGGElement>(null);
  const bobRef = useRef<SVGCircleElement>(null);
  const logoHitRef = useRef<SVGPathElement>(null);
  const simRef = useRef({ bob: freshPendulum(), time: 0, reduced: false });

  useEffect(() => {
    const svg = svgRef.current;
    const pendulum = pendulumRef.current;
    const bob = bobRef.current;
    const logoHit = logoHitRef.current;
    if (!svg || !pendulum || !bob || !logoHit) return;

    const sim = simRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      sim.reduced = motion.matches;
      if (sim.reduced) {
        sim.bob.angle = 0;
        sim.bob.omega = 0;
      }
    };
    syncMotion();
    motion.addEventListener("change", syncMotion);

    const bindPendulum = (el: SVGElement) => {
      const state = sim.bob;

      const onPointerDown = (event: PointerEvent) => {
        if (sim.reduced) return;
        event.preventDefault();
        try {
          el.setPointerCapture(event.pointerId);
        } catch {
          // Capture can fail if the pointer is already released.
        }
        const point = clientToView(svg, event.clientX, event.clientY);
        state.dragging = true;
        state.angle = Math.atan2(point.x - PIVOT_X, point.y - PIVOT_Y);
        state.omega = 0;
        state.lastTs = performance.now();
        el.style.cursor = "grabbing";
      };

      const onPointerMove = (event: PointerEvent) => {
        if (sim.reduced) return;
        const point = clientToView(svg, event.clientX, event.clientY);

        if (state.dragging) {
          const next = Math.atan2(point.x - PIVOT_X, point.y - PIVOT_Y);
          const now = performance.now();
          const dt = Math.max(0.016, (now - state.lastTs) / 1000);
          state.omega = clamp(wrapPi(next - state.angle) / dt, -MAX_OMEGA, MAX_OMEGA);
          state.angle = next;
          state.lastTs = now;
          return;
        }

        if (state.hoverX == null || state.hoverY == null) {
          state.hoverX = point.x;
          state.hoverY = point.y;
          return;
        }

        const dx = point.x - state.hoverX;
        const dy = point.y - state.hoverY;
        state.hoverX = point.x;
        state.hoverY = point.y;
        const tangentX = Math.cos(state.angle);
        const tangentY = -Math.sin(state.angle);
        const tangential = dx * tangentX + dy * tangentY;
        state.omega = clamp(
          state.omega + (tangential / STRING_LEN) * SWIPE_GAIN,
          -MAX_OMEGA,
          MAX_OMEGA,
        );
      };

      const endDrag = () => {
        state.dragging = false;
        state.omega = clamp(state.omega, -MAX_OMEGA, MAX_OMEGA);
        state.hoverX = null;
        state.hoverY = null;
        el.style.cursor = "grab";
      };

      const onPointerEnter = (event: PointerEvent) => {
        const point = clientToView(svg, event.clientX, event.clientY);
        state.hoverX = point.x;
        state.hoverY = point.y;
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (sim.reduced) return;
        if (event.key === "ArrowLeft") state.omega = clamp(state.omega - 3.4, -MAX_OMEGA, MAX_OMEGA);
        if (event.key === "ArrowRight") state.omega = clamp(state.omega + 3.4, -MAX_OMEGA, MAX_OMEGA);
      };

      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerup", endDrag);
      el.addEventListener("pointercancel", endDrag);
      el.addEventListener("pointerenter", onPointerEnter);
      el.addEventListener("keydown", onKeyDown);

      return () => {
        el.removeEventListener("pointerdown", onPointerDown);
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerup", endDrag);
        el.removeEventListener("pointercancel", endDrag);
        el.removeEventListener("pointerenter", onPointerEnter);
        el.removeEventListener("keydown", onKeyDown);
      };
    };

    const unbindBob = bindPendulum(bob);
    const unbindLogo = bindPendulum(logoHit);

    let rafId = 0;
    let running = true;
    let last = performance.now();

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      if (!sim.reduced) {
        const drive = DRIVE * Math.sin(NATURAL * sim.time);
        if (!sim.bob.dragging) {
          const acc = -GRAVITY * Math.sin(sim.bob.angle) - DAMPING * sim.bob.omega + drive;
          sim.bob.omega = clamp(sim.bob.omega + acc * dt, -MAX_OMEGA, MAX_OMEGA);
          sim.bob.angle += sim.bob.omega * dt;
        }
        sim.time += dt;
      }

      // CSS rotation is clockwise, so the sign is flipped: positive theta swings right.
      const thetaDeg = -(sim.bob.angle * 180) / Math.PI;
      pendulum.style.transform = `rotate(${thetaDeg}deg)`;
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      motion.removeEventListener("change", syncMotion);
      unbindBob();
      unbindLogo();
    };
  }, []);

  const pivotOrigin = `${(PIVOT_X / SVG_W) * 100}% ${(PIVOT_Y / SVG_H) * 100}%`;

  return (
    <div
      role="group"
      aria-label="Logo pendulum. Drag the orange sphere or the black mark to swing them."
      className={
        embedded
          ? "relative h-full w-full overflow-visible bg-white"
          : "relative h-[178px] w-[178px] max-w-full touch-none select-none overflow-visible rounded-[12px] bg-white"
      }
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="absolute overflow-visible"
        style={{
          left: `${(ART_LEFT / FRAME) * 100}%`,
          top: `${(ART_TOP / FRAME) * 100}%`,
          width: `${(SVG_W / FRAME) * 100}%`,
          height: `${(SVG_H / FRAME) * 100}%`,
        }}
        fill="none"
      >
        <path d={GANTRY_D} stroke="black" strokeWidth="0.409449" />
        <g
          ref={pendulumRef}
          style={{
            transformBox: "view-box",
            transformOrigin: pivotOrigin,
            willChange: "transform",
          }}
        >
          <line
            x1={PIVOT_X}
            y1={PIVOT_Y}
            x2={PIVOT_X}
            y2={STRING_END_Y}
            stroke="black"
            strokeWidth="0.409449"
          />
          <path d={BOB_D} fill="#FF5126" />
          <circle
            ref={bobRef}
            role="button"
            tabIndex={0}
            aria-label="Drag or swipe the orange sphere"
            cx={BOB_CX}
            cy={BOB_CY}
            r={HIT_R}
            fill="transparent"
            className="cursor-grab outline-none focus-visible:stroke-[#FF5126]"
            strokeWidth="0.6"
          />
          <path
            ref={logoHitRef}
            d={LOGO_D}
            fill="black"
            role="button"
            tabIndex={0}
            aria-label="Drag or swipe the logo mark"
            className="cursor-grab outline-none"
          />
        </g>
      </svg>
    </div>
  );
}
