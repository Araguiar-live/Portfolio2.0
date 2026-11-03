import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface DockItem {
  label: string;
  slug: string;
}

interface Props {
  items: DockItem[];
  onSelect: (slug: string) => void;
  activeSlug?: string | null;
  /** Visibility classes must live on this fixed node. A transformed parent would pin the dock to the page instead of the viewport. */
  className?: string;
}

const BASE = 44;
const GAP = 12 * 1.15;
const HOVER_GAP = 6 * 1.15;
/** Jelly spring — fast, underdamped, so width/height overshoot inside the pill. */
const SQUISH = { type: "spring" as const, stiffness: 520, damping: 11, mass: 0.38 };
const ENTER = { type: "spring" as const, stiffness: 280, damping: 16, mass: 0.7 };

/**
 * Floating macOS-style dock — clear glass capsule with symmetrical padding.
 * Layout slots grow with hover so icons stay inside the pill edge.
 */
export function Dock({ items, onSelect, activeSlug, className }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const spring = reduce ? { duration: 0.15 } : SQUISH;

  return (
    <motion.div
      initial={{ y: 56, opacity: 0, scale: 0.92 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ ...ENTER, delay: 0.15 }}
      className={`spatial-layer pointer-events-none fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 ${className ?? ""}`}
    >
      <motion.div
        layout
        transition={spring}
        onMouseLeave={() => setHovered(null)}
        className="dock-glass pointer-events-auto relative flex items-center justify-center overflow-hidden rounded-full p-3"
        style={{ gap: GAP }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-full bg-gradient-to-b from-white/12 via-transparent to-transparent"
        />
        <div className="dock-glass-lens z-0 opacity-25" aria-hidden />

        {/* Layout track — width/height spring with slots; icons never leave the glass */}
        <motion.div
          layout
          transition={spring}
          initial={false}
          animate={{ gap: hovered === null ? GAP : HOVER_GAP }}
          className="relative z-[1] flex items-center justify-center"
          style={{ gap: GAP }}
        >
          {items.map((item, index) => (
            <DockButton
              key={item.slug}
              item={item}
              index={index}
              hovered={hovered}
              active={activeSlug === item.slug}
              reduce={!!reduce}
              onHover={setHovered}
              onSelect={onSelect}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function DockButton({
  item,
  index,
  hovered,
  active,
  reduce,
  onHover,
  onSelect,
}: {
  item: DockItem;
  index: number;
  hovered: number | null;
  active: boolean;
  reduce: boolean;
  onHover: (index: number | null) => void;
  onSelect: (slug: string) => void;
}) {
  const isHovered = hovered === index;
  const dist = hovered === null ? null : Math.abs(hovered - index);
  const isNeighbour = dist === 1;
  const settled = isHovered ? BASE * 1.38 : isNeighbour ? BASE * 1.14 : BASE;
  const spring = reduce ? { duration: 0.15 } : SQUISH;

  return (
    <motion.div
      onMouseEnter={() => onHover(index)}
      initial={false}
      animate={{ width: settled, height: settled }}
      transition={spring}
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: BASE, height: BASE }}
    >
      <motion.button
        type="button"
        onClick={() => onSelect(item.slug)}
        initial={false}
        animate={
          reduce
            ? { scaleX: 1, scaleY: 1 }
            : isHovered
              ? { scaleX: [1, 1.14, 0.92, 1.05, 1], scaleY: [1, 0.86, 1.1, 0.96, 1] }
              : isNeighbour
                ? { scaleX: 0.94, scaleY: 1.06 }
                : { scaleX: 1, scaleY: 1 }
        }
        transition={
          !reduce && isHovered
            ? { duration: 0.55, times: [0, 0.24, 0.5, 0.74, 1], ease: "easeOut" }
            : spring
        }
        whileTap={reduce ? undefined : { scaleX: 0.88, scaleY: 1.08 }}
        aria-label={`Open ${item.label} project`}
        aria-current={active ? "true" : undefined}
        className={
          "group relative flex h-full w-full shrink-0 items-center justify-center overflow-hidden rounded-full text-[12px] font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent " +
          (active
            ? "bg-zinc-950/75 text-white shadow-[0_8px_24px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.3)_inset]"
            : "bg-white/35 text-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.12),0_1.5px_0_rgba(255,255,255,0.75)_inset]")
        }
      >
        <motion.span
          aria-hidden
          animate={{ opacity: isHovered ? 1 : 0.55 }}
          transition={spring}
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/75 via-white/15 to-transparent"
        />
        <motion.span
          aria-hidden
          animate={{
            opacity: isHovered ? 0.95 : 0.3,
            x: isHovered ? 3 : 0,
          }}
          transition={spring}
          className="pointer-events-none absolute -left-1/4 top-0 h-1/2 w-3/4 rounded-full bg-white/60 blur-[6px]"
        />
        <span className="relative z-[1]">{item.label}</span>

        <motion.span
          aria-hidden
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.4 }}
          transition={spring}
          className="absolute bottom-1.5 left-1/2 z-[1] h-1 w-1 -translate-x-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.75)]"
        />
      </motion.button>
    </motion.div>
  );
}
