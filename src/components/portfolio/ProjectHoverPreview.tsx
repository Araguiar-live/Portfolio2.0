import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import playSolid from "@/assets/portfolio/hover/play-solid.svg";

/** Figma 1883:41884 / 1883:41889 — corner radius on the 4096px source frame. */
const FRAME_RADIUS = 120;
const FRAME_WIDTH = 4096;
const CARD_MAX = 440;

const FOLLOW_SPRING = { stiffness: 220, damping: 26, mass: 0.45 };
const ENTER_SPRING = { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.5 };

export interface HoverPreviewMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
}

function cardSize(media: HoverPreviewMedia) {
  const max = Math.min(CARD_MAX, window.innerWidth - 32);
  const width = max;
  const height = width * (media.height / media.width);
  return { width, height };
}

function placeCard(clientX: number, clientY: number, width: number, height: number) {
  const pad = 16;
  const x = Math.min(window.innerWidth - pad - width / 2, Math.max(pad + width / 2, clientX));
  // Keep the cursor near the lower third so the card tracks the row without covering the pointer.
  const y = Math.min(
    window.innerHeight - pad - height / 2,
    Math.max(pad + height / 2, clientY - height * 0.18),
  );
  return { x, y };
}

/** Cursor-following media card for a closed project row. */
export function useRowHoverPreview(media: HoverPreviewMedia | undefined, enabled: boolean) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, reduceMotion ? { duration: 0 } : FOLLOW_SPRING);
  const y = useSpring(pointerY, reduceMotion ? { duration: 0 } : FOLLOW_SPRING);

  const track = (event: MouseEvent, jump: boolean) => {
    if (!media || !enabled) return;
    const { width, height } = cardSize(media);
    const next = placeCard(event.clientX, event.clientY, width, height);
    pointerX.set(next.x);
    pointerY.set(next.y);
    if (jump || reduceMotion) {
      x.jump(next.x);
      y.jump(next.y);
    }
  };

  return {
    open: open && enabled && Boolean(media),
    onMouseEnter: (event: MouseEvent) => {
      track(event, true);
      if (media && enabled) setOpen(true);
    },
    onMouseMove: (event: MouseEvent) => track(event, false),
    onMouseLeave: () => setOpen(false),
    x,
    y,
    reduceMotion: Boolean(reduceMotion),
  };
}

export function ProjectHoverPreview({
  open,
  media,
  x,
  y,
  reduceMotion,
}: {
  open: boolean;
  media: HoverPreviewMedia;
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
  reduceMotion: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const { width, height } = cardSize(media);
  const radius = (FRAME_RADIUS / FRAME_WIDTH) * width;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key={media.src}
          className="pointer-events-none fixed top-0 left-0 z-[100]"
          style={{ x, y }}
          aria-hidden
        >
          <motion.div
            className="pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            transition={reduceMotion ? { duration: 0.15 } : ENTER_SPRING}
          >
            <div
              className="relative overflow-hidden shadow-[0_24px_60px_rgba(6,10,12,0.22)]"
              style={{ width, height, borderRadius: radius }}
            >
              <img
                src={media.src}
                alt={media.alt}
                width={media.width}
                height={media.height}
                draggable={false}
                className="pointer-events-none size-full max-w-none object-cover"
              />
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 py-1 pr-3 pl-2 backdrop-blur-md">
                <img
                  src={playSolid}
                  alt=""
                  width={64}
                  height={64}
                  className="pointer-events-none size-3.5 shrink-0"
                />
                <span className="text-[13px] leading-none tracking-[-0.5px] whitespace-nowrap text-[#292d32]">
                  Play me
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
