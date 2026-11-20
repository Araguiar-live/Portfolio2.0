import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { isPhoneViewport } from "@/lib/viewport";

const PREVIEW_MAX = 644;
const RADIUS_FROM = 120 / 4096;
const SPRING = { damping: 15, stiffness: 150, mass: 0.2 };

export interface HoverPreviewMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Looping cursor-follow clip. `src` is the video; `poster` is the still. */
  type?: "image" | "video";
  poster?: string;
  /** HTMLMediaElement.playbackRate. Defaults to 1. */
  playbackRate?: number;
}

function previewSize(media: HoverPreviewMedia) {
  const width = Math.min(PREVIEW_MAX, window.innerWidth - 32);
  return { width, height: width * (media.height / media.width) };
}

/** Cursor-following case-study preview (live araguiar.design). Hidden while the row is open. */
export function useRowHoverPreview(media: HoverPreviewMedia | undefined, enabled: boolean) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = reduceMotion ? { duration: 0 } : SPRING;
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);
  const rotate = useSpring(useTransform(rawX, [-800, 800], [-3, 3]), spring);

  const onMouseEnter = (event: MouseEvent) => {
    if (isPhoneViewport()) return;
    rawX.set(event.clientX);
    rawY.set(event.clientY);
    x.jump(event.clientX);
    y.jump(event.clientY);
    if (media && enabled) setOpen(true);
  };
  const onMouseMove = (event: MouseEvent) => {
    if (isPhoneViewport()) return;
    rawX.set(event.clientX);
    rawY.set(event.clientY);
    if (media && enabled) setOpen(true);
  };
  const onMouseLeave = () => setOpen(false);

  useEffect(() => {
    if (!enabled) setOpen(false);
  }, [enabled]);

  return {
    open: open && enabled && !!media,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    x,
    y,
    rotate,
    reduceMotion: !!reduceMotion,
  };
}

export function RowHoverPreview({
  open,
  media,
  x,
  y,
  rotate,
  reduceMotion,
  keepAlive = false,
}: {
  open: boolean;
  media: HoverPreviewMedia;
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
  rotate: ReturnType<typeof useSpring>;
  reduceMotion: boolean;
  /** Keep a video mounted and looping while the parent control is available. */
  keepAlive?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const { width, height } = previewSize(media);
  const radius = RADIUS_FROM * width + 20;
  const isVideo = media.type === "video";
  const hold = isVideo && (keepAlive || open);
  const visible = open;

  const frame = (
    <div style={{ filter: "drop-shadow(0 16px 32px rgba(0, 0, 0, 0.14))" }}>
      <div
        className="relative overflow-hidden bg-white"
        style={{
          width,
          height,
          borderRadius: radius,
          clipPath: `polygon(0 0, calc(100% - ${radius}px) 0, 100% ${radius}px, 100% 100%, 0 100%)`,
        }}
      >
        <PreviewFrame media={media} playing={hold} />
      </div>
    </div>
  );

  return createPortal(
    isVideo ? (
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-40 will-change-transform"
        style={{
          x,
          y,
          rotate: reduceMotion ? 0 : rotate,
          opacity: visible ? 1 : 0,
          visibility: visible ? "visible" : "hidden",
        }}
        aria-hidden
      >
        <div className="pointer-events-none -translate-x-1/2 -translate-y-1/2">{hold ? frame : null}</div>
      </motion.div>
    ) : (
      <AnimatePresence>
        {open ? (
          <motion.div
            key={media.src}
            className="pointer-events-none fixed top-0 left-0 z-40 will-change-transform"
            style={{ x, y, rotate: reduceMotion ? 0 : rotate }}
            aria-hidden
          >
            <motion.div
              className="pointer-events-none -translate-x-1/2 -translate-y-1/2"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
              transition={reduceMotion ? { duration: 0.15 } : { type: "spring", ...SPRING }}
            >
              {frame}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    ),
    document.body,
  );
}

function PreviewFrame({
  media,
  playing = true,
}: {
  media: HoverPreviewMedia;
  playing?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = media.type === "video";
  const rate = media.playbackRate ?? 1;
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isVideo) return;

    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.loop = true;
    el.playbackRate = rate;
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");
    el.setAttribute("muted", "");

    const apply = () => {
      el.muted = true;
      el.loop = true;
      el.playbackRate = rate;
    };
    const play = () => {
      apply();
      return el.play().then(() => {
        apply();
        setStarted(true);
      });
    };
    const onEnded = () => {
      try {
        el.currentTime = 0;
      } catch {
        /* ignore seek before ready */
      }
      void play().catch(() => {});
    };

    if (!playing) {
      el.pause();
      try {
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
      setStarted(false);
      return;
    }

    el.addEventListener("play", apply);
    el.addEventListener("playing", apply);
    el.addEventListener("canplay", play);
    el.addEventListener("loadeddata", play);
    el.addEventListener("ended", onEnded);
    void play().catch(() => {});

    return () => {
      el.removeEventListener("play", apply);
      el.removeEventListener("playing", apply);
      el.removeEventListener("canplay", play);
      el.removeEventListener("loadeddata", play);
      el.removeEventListener("ended", onEnded);
    };
  }, [isVideo, media.src, playing, rate]);

  if (isVideo) {
    return (
      <>
        <video
          ref={videoRef}
          src={media.src}
          width={media.width}
          height={media.height}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          controls={false}
          draggable={false}
          className="pointer-events-none size-full max-w-none object-cover"
        />
        {!started && media.poster ? (
          <img
            src={media.poster}
            alt=""
            width={media.width}
            height={media.height}
            draggable={false}
            className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          />
        ) : null}
      </>
    );
  }

  return (
    <img
      src={media.poster ?? media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      draggable={false}
      className="pointer-events-none size-full max-w-none object-cover"
    />
  );
}

