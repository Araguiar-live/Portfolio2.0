import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";

const JACKET = "#2A2A2E";
const POCKET = "#0C0C0F";
const RISE = 26;

const SHEET_SPRING = { type: "spring", stiffness: 520, damping: 28, mass: 0.82 } as const;
const FOLDER_SPRING = { type: "spring", stiffness: 480, damping: 26, mass: 0.9 } as const;

/** Asymmetric front pocket — high left tab, lower lip toward the right (reference). */
function pocketPath(width: number, height: number) {
  const radius = 28;
  const stepStart = width * 0.3;
  const stepEnd = width * 0.48;
  return [
    `M ${radius} ${height}`,
    `H ${width - radius}`,
    `Q ${width} ${height} ${width} ${height - radius}`,
    `V ${RISE + radius}`,
    `Q ${width} ${RISE} ${width - radius} ${RISE}`,
    `H ${stepEnd}`,
    `C ${stepEnd - width * 0.06} ${RISE} ${stepStart + width * 0.06} 0 ${stepStart} 0`,
    `H ${radius}`,
    `Q 0 0 0 ${radius}`,
    `V ${height - radius}`,
    `Q 0 ${height} ${radius} ${height}`,
    "Z",
  ].join(" ");
}

function pocketLip(width: number) {
  const radius = 28;
  const stepStart = width * 0.3;
  const stepEnd = width * 0.48;
  return `M ${radius} 0 H ${stepStart} C ${stepStart + width * 0.06} 0 ${stepEnd - width * 0.06} ${RISE} ${stepEnd} ${RISE} H ${width - radius} Q ${width} ${RISE} ${width} ${RISE + radius}`;
}

function DiagonalArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden className="shrink-0 text-white">
      <path
        d="M7 17 17 7M17 7V15M17 7H9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const POCKET_W = 320;
const POCKET_H = 162;

const SHEET_ORIGIN = "50% 100%";

type Props = {
  onOpen?: () => void;
};

/**
 * Mobile “Project folder” — black mini card with jacket, asymmetric pocket, and sheets.
 */
export function MiniPlaygroundFolder({ onOpen }: Props) {
  const body = pocketPath(POCKET_W, POCKET_H);
  const lip = pocketLip(POCKET_W);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);

  const engage = useCallback(() => setActive(true), []);
  const release = useCallback(() => setActive(false), []);

  const fanned = active && !reduceMotion;

  return (
    <motion.div
      className="mini-playground-folder project-folder-mini relative isolate mr-auto w-full max-w-[292px]"
      aria-label="Project folder"
      data-folder-active={active ? "true" : "false"}
      animate={
        fanned
          ? { scale: 0.978, y: 1.5 }
          : { scale: 1, y: 0 }
      }
      transition={FOLDER_SPRING}
      onHoverStart={engage}
      onHoverEnd={release}
      onPointerDown={engage}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
    >
      <div className="project-folder-mini-frame relative flex min-h-[calc(min(100vw-48px,292px)*162/320+8.5rem)] w-full flex-col justify-end pb-3">
        <div
          className="project-folder-mini-jacket pointer-events-none absolute inset-x-0 bottom-0 top-8 -z-[1] rounded-[26px]"
          style={{ backgroundColor: JACKET, boxShadow: "0 18px 44px rgba(0,0,0,0.2)" }}
        />

        <div className="project-folder-mini-sheets relative z-[1] mx-auto mb-[calc(62px*1.44*0.35)] h-[calc(62px*1.44*1.45+4.75rem)] w-full max-w-full px-2">
          <motion.div
            className="project-folder-mini-sheet-rear absolute bottom-[calc(3.15rem+62px*1.44*0.38)] left-[calc(0.375rem+6px)] right-[calc(0.75rem-2px)] z-0 rounded-t-[20px] bg-white px-4 pb-10 pt-3.5 text-[13px] font-medium leading-[1.15] tracking-[-0.25px] text-[#141414] shadow-[0_1px_10px_rgba(0,0,0,0.07)]"
            style={{ minHeight: "calc(62px * 1.44 * 1.28)", transformOrigin: SHEET_ORIGIN }}
            animate={
              fanned
                ? { rotate: -3.5, x: -10, y: -8 }
                : { rotate: 0, x: 0, y: 0 }
            }
            transition={SHEET_SPRING}
          >
            Playground for Designers
          </motion.div>
          <motion.div
            className="project-folder-mini-sheet-back absolute bottom-[calc(2.15rem+16px)] left-[calc(0.75rem-1px)] right-[calc(0.375rem+5px)] z-[1] rounded-t-[20px] bg-white px-4 pb-6 pt-3.5 text-[13px] font-medium leading-[1.15] tracking-[-0.25px] text-[#141414] shadow-[0_2px_14px_rgba(0,0,0,0.09)]"
            style={{ minHeight: "calc(62px * 1.44)", transformOrigin: SHEET_ORIGIN }}
            animate={
              fanned
                ? { rotate: 4, x: 11, y: -6 }
                : { rotate: 0, x: 0, y: 0 }
            }
            transition={SHEET_SPRING}
          >
            Selected Works
          </motion.div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[2] w-full">
          {onOpen ? (
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label="Open project folder menu"
              onClick={onOpen}
              className="absolute inset-0 z-[3] cursor-pointer rounded-b-[28px] border-0 bg-transparent p-0"
            />
          ) : null}
          <svg
            viewBox={`0 0 ${POCKET_W} ${POCKET_H}`}
            className="block h-auto w-full overflow-visible drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path d={body} fill={POCKET} />
            <path
              d={lip}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <p className="pointer-events-none absolute left-1/2 top-[calc(18%+6px)] z-10 -translate-x-1/2 whitespace-nowrap text-center text-[11px] font-medium tracking-[0.02em] text-white/35">
            Click for more
          </p>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 pb-5 pt-2 font-mono text-white">
            <p className="pb-0.5 text-[18px] font-medium leading-6 tracking-[-0.3px] text-white">
              Project folder
            </p>
            <DiagonalArrowIcon />
          </div>
        </div>
      </div>
    </motion.div>
  );
}