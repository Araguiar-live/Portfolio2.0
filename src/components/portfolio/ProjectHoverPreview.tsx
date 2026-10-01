import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import playSolid from "@/assets/portfolio/hover/play-solid.svg";

/** Figma padding and badge size on the 4096×2730 frame. */
const LOGO_INSET_X = 64 / 4096;
const LOGO_INSET_Y = 64 / 2730;
const LOGO_WIDTH = 248 / 4096;

function HoverLogo({ media }: { media: HoverPreviewMedia }) {
  const logo = media.logo;
  if (!logo) return null;
  return (
    <div
      className={
        "pointer-events-none absolute overflow-hidden rounded-full " +
        (media.glassLogo
          ? "border border-white/55 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_20px_rgba(6,10,12,0.12)] backdrop-blur-xl"
          : "")
      }
      style={{
        right: `${LOGO_INSET_X * 100}%`,
        bottom: `${LOGO_INSET_Y * 100}%`,
        width: `${LOGO_WIDTH * 100}%`,
        aspectRatio: `${logo.width} / ${logo.height}`,
      }}
    >
      <img
        src={logo.src}
        alt=""
        width={logo.width}
        height={logo.height}
        draggable={false}
        className="pointer-events-none size-full max-w-none"
      />
    </div>
  );
}

/** Same basil play path as play-solid.svg, tinted per project. */
function PlayGlyph({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none inline-block size-3.5 shrink-0"
      style={{
        backgroundColor: color,
        maskImage: `url("${playSolid}")`,
        WebkitMaskImage: `url("${playSolid}")`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskMode: "alpha",
      }}
    />
  );
}

/** Figma 1883:41884 / 1883:41889 — corner radius on the 4096px source frame. */
const FRAME_RADIUS = 120;
const FRAME_WIDTH = 4096;
const CARD_MAX = 440;

const springConfig = { damping: 15, stiffness: 150, mass: 0.2 };

export interface HoverPreviewLogo {
  src: string;
  width: number;
  height: number;
}

export interface HoverPreviewMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Play glyph color. Defaults to the Figma ink. */
  playColor?: string;
  /** Corner mark from Figma 1885:41891 / 1885:41903. */
  logo?: HoverPreviewLogo;
  /** Frost the logo disc. CRCLE's frame is glass; Odicci keeps the flat badge. */
  glassLogo?: boolean;
}

const DEFAULT_PLAY_COLOR = "#060A0C";

function cardSize(media: HoverPreviewMedia) {
  const max = Math.min(CARD_MAX, window.innerWidth - 32);
  const width = max;
  const height = width * (media.height / media.width);
  return { width, height };
}

/**
 * Cursor follow runs on motion values. React state changes only when the
 * pointer enters or leaves the row, never while it is moving.
 */
export function useRowHoverPreview(media: HoverPreviewMedia | undefined, enabled: boolean) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const physics = reduceMotion ? { duration: 0 } : springConfig;
  const x = useSpring(mouseX, physics);
  const y = useSpring(mouseY, physics);
  const xVelocity = useVelocity(mouseX);
  const tilt = useTransform(xVelocity, [-800, 800], [-3, 3]);
  const rotate = useSpring(tilt, physics);

  const onMouseMove = (event: MouseEvent) => {
    mouseX.set(event.clientX);
    mouseY.set(event.clientY);
  };

  return {
    open: open && enabled && Boolean(media),
    onMouseEnter: (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      x.jump(event.clientX);
      y.jump(event.clientY);
      if (media && enabled) setOpen(true);
    },
    onMouseMove,
    onMouseLeave: () => setOpen(false),
    x,
    y,
    rotate,
    reduceMotion: Boolean(reduceMotion),
  };
}

export function ProjectHoverPreview({
  open,
  media,
  x,
  y,
  rotate,
  reduceMotion,
}: {
  open: boolean;
  media: HoverPreviewMedia;
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
  rotate: ReturnType<typeof useSpring>;
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
          className="pointer-events-none fixed top-0 left-0 z-[100] will-change-transform"
          style={{ x, y, rotate: reduceMotion ? 0 : rotate }}
          aria-hidden
        >
          <motion.div
            className="pointer-events-none -translate-x-1/2 -translate-y-1/2"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            transition={reduceMotion ? { duration: 0.15 } : { type: "spring", ...springConfig }}
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
              <div
                className={
                  "absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full py-1 pr-3 pl-2 " +
                  (media.glassLogo
                    ? "border border-white/55 bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-xl"
                    : "bg-white/20 backdrop-blur-md")
                }
              >
                <PlayGlyph color={media.playColor ?? DEFAULT_PLAY_COLOR} />
                <span className="text-[13px] leading-none tracking-[-0.5px] whitespace-nowrap text-[#292d32]">
                  Play me
                </span>
              </div>
              {media.logo ? <HoverLogo media={media} /> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
