import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import folderIcon from "@/assets/portfolio/mobile-folder/folder-fill-round.svg";
import bendingSpoonsPreview from "@/assets/portfolio/mobile-folder/previews/bending-spoons.png";
import crclePreview from "@/assets/portfolio/mobile-folder/previews/crcle.png";
import odicciPreview from "@/assets/portfolio/mobile-folder/previews/odicci.png";
import personalMark from "@/assets/portfolio/mobile-folder/personal-mark.svg";
import slideHandle from "@/assets/portfolio/mobile-folder/slide-handle.svg";
import type { Project } from "@/components/portfolio/ProjectAccordion";

/** Mini folder frame rect in viewport px — morph origin / dismiss target. */
export type MobileFolderOrigin = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const FOLDER_FRAME_SELECTOR = ".mini-playground-folder .project-folder-mini-frame";

const SHEET_SPRING = {
  type: "spring",
  stiffness: 560,
  damping: 36,
  mass: 0.86,
  restDelta: 0.35,
  restSpeed: 0.35,
} as const;

type MorphPose = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  borderRadius: number;
};

function expandedPose(): MorphPose {
  return { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 0 };
}

function collapsedPose(origin: MobileFolderOrigin, viewport: { w: number; h: number }): MorphPose {
  const scaleX = viewport.w > 0 ? origin.width / viewport.w : 1;
  const scaleY = viewport.h > 0 ? origin.height / viewport.h : 1;
  return {
    x: origin.left,
    y: origin.top,
    scaleX,
    scaleY,
    borderRadius: 26,
  };
}

const INSTANT = { duration: 0.01 } as const;

const DOCK_FLY = { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const };

function FolderDockWidget({
  origin,
  viewport,
  reduceMotion,
  onLanded,
}: {
  origin: MobileFolderOrigin;
  viewport: { w: number; h: number };
  reduceMotion: boolean | null;
  onLanded: () => void;
}) {
  const startW = Math.min(172, viewport.w - 48);
  const startH = 122;
  const startX = (viewport.w - startW) / 2;
  const startY = 12;

  const endW = Math.max(72, origin.width * 0.82);
  const endH = endW * 0.62;
  const endX = origin.left + (origin.width - endW) / 2;
  const endY = origin.top + origin.height * 0.18;

  return (
    <motion.div
      aria-hidden
      className="mobile-folder-dock-widget pointer-events-none fixed z-[145] overflow-hidden rounded-[22px] border border-white/10 bg-[rgba(0,51,98,0.3)] shadow-[0_14px_36px_rgba(0,32,72,0.38)] backdrop-blur-[22px] backdrop-saturate-[1.35]"
      initial={
        reduceMotion
          ? { left: endX, top: endY, width: endW, height: endH, opacity: 0 }
          : { left: startX, top: startY, width: startW, height: startH, opacity: 1, scale: 1 }
      }
      animate={{
        left: endX,
        top: endY,
        width: endW,
        height: endH,
        opacity: reduceMotion ? 0 : 0.96,
        scale: reduceMotion ? 1 : 0.94,
      }}
      transition={reduceMotion ? INSTANT : DOCK_FLY}
      onAnimationComplete={onLanded}
      style={{ transformOrigin: "50% 100%" }}
    >
      <motion.div
        aria-hidden
        className="absolute left-3 right-3 top-3 h-[34%] rounded-t-[14px] border border-white/40 bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
        initial={reduceMotion ? false : { y: 0, rotate: 0 }}
        animate={reduceMotion ? undefined : { y: 6, rotate: -2.5 }}
        transition={DOCK_FLY}
      />
      <motion.div
        aria-hidden
        className="absolute left-4 right-4 top-6 h-[32%] rounded-t-[12px] border border-white/25 bg-white/55 shadow-[0_1px_6px_rgba(0,0,0,0.06)]"
        initial={reduceMotion ? false : { y: 0, rotate: 0 }}
        animate={reduceMotion ? undefined : { y: 10, rotate: 3 }}
        transition={DOCK_FLY}
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 pb-2.5 pt-10">
        <img src={folderIcon} alt="" width={32} height={32} className="size-8 opacity-95" />
        <p className="text-[10px] font-medium tracking-[0.06em] text-white/45">Project Folder</p>
      </div>
      <div className="absolute inset-x-0 top-0 flex justify-center pt-2">
        <img src={slideHandle} alt="" width={111} height={4} className="h-1 w-[72px] opacity-70" />
      </div>
    </motion.div>
  );
}

/** Figma 3137:12510 — mobile folder menu copy (shorter than desktop row meta). */
const FOLDER_MENU_ROLE: Record<string, string> = {
  crcle: "Founding Designer",
  "first-design": "Hackathon",
  odicci: "Sole Designer",
};

/** Figma 3137:12516 — 57px mini previews baked into each row pill. */
const MOBILE_FOLDER_PREVIEWS: Record<string, string> = {
  crcle: crclePreview,
  "first-design": bendingSpoonsPreview,
  odicci: odicciPreview,
};

type Props = {
  open: boolean;
  origin: MobileFolderOrigin | null;
  projects: readonly Project[];
  onClose: () => void;
  onSelectProject: (slug: string) => void;
};

function fallbackOrigin(viewport: { w: number; h: number }): MobileFolderOrigin {
  const width = Math.min(292, viewport.w - 32);
  return {
    top: viewport.h - width * 0.55 - 24,
    left: 16,
    width,
    height: width * 0.62,
  };
}

function measureFolderOrigin(): MobileFolderOrigin | null {
  const node = document.querySelector(FOLDER_FRAME_SELECTOR);
  if (!(node instanceof HTMLElement)) return null;
  const rect = node.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

/** Full-viewport project picker opened from the mobile mini folder (Figma 3137:11927). */
export function MobileProjectFolderOverlay({ open, origin, projects, onClose, onSelectProject }: Props) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [viewport, setViewport] = useState({ w: 390, h: 844 });
  const [sheetPhase, setSheetPhase] = useState<"collapsed" | "expanded">("collapsed");
  const [interactive, setInteractive] = useState(false);
  const expandedOnce = useRef(false);
  const pendingSlug = useRef<string | null>(null);
  const closingFromUser = useRef(false);
  const dockFinished = useRef(false);
  const [dockFly, setDockFly] = useState(false);
  const [layoutOrigin, setLayoutOrigin] = useState<MobileFolderOrigin>(
    () => origin ?? fallbackOrigin({ w: 390, h: 844 }),
  );

  useEffect(() => {
    if (origin) setLayoutOrigin(origin);
  }, [origin]);

  const sheetPose = sheetPhase === "expanded" ? expandedPose() : collapsedPose(layoutOrigin, viewport);
  const transition = reduceMotion ? INSTANT : SHEET_SPRING;
  const animating = open && !interactive;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const sync = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (!open) {
      setSheetPhase("collapsed");
      setInteractive(false);
      expandedOnce.current = false;
      pendingSlug.current = null;
      closingFromUser.current = false;
      dockFinished.current = false;
      setDockFly(false);
      return;
    }

    document.documentElement.classList.add("mobile-folder-sheet-open");
    setInteractive(false);
    setSheetPhase("collapsed");
    if (origin) setLayoutOrigin(origin);

    const id = requestAnimationFrame(() => {
      if (reduceMotion) {
        setSheetPhase("expanded");
        setInteractive(true);
        expandedOnce.current = true;
        return;
      }
      setSheetPhase("expanded");
    });
    return () => cancelAnimationFrame(id);
  }, [open, origin, reduceMotion]);

  const finishClose = useCallback(() => {
    const slug = pendingSlug.current;
    pendingSlug.current = null;
    onClose();
    window.requestAnimationFrame(() => {
      document.documentElement.classList.remove("mobile-folder-sheet-open");
      document.documentElement.removeAttribute("data-mobile-folder-docking");
      if (slug) onSelectProject(slug);
    });
    closingFromUser.current = false;
    dockFinished.current = false;
    setDockFly(false);
  }, [onClose, onSelectProject]);

  const tryCompleteDock = useCallback(() => {
    if (!closingFromUser.current || dockFinished.current) return;
    if (sheetPhase !== "collapsed") return;
    dockFinished.current = true;
    setDockFly(false);
    finishClose();
  }, [finishClose, sheetPhase]);

  const requestClose = useCallback(() => {
    if (!open || closingFromUser.current) return;
    closingFromUser.current = true;
    dockFinished.current = false;
    setInteractive(false);
    const measured = measureFolderOrigin();
    if (measured) setLayoutOrigin(measured);
    if (reduceMotion) {
      finishClose();
      return;
    }
    setDockFly(true);
    document.documentElement.setAttribute("data-mobile-folder-docking", "true");
    setSheetPhase("collapsed");
  }, [finishClose, open, reduceMotion]);

  /** Mobile — skip morph-back to mini folder; route immediately (no home flash). */
  const handleSelect = useCallback(
    (slug: string) => {
      if (!interactive || closingFromUser.current) return;
      closingFromUser.current = true;
      setInteractive(false);
      pendingSlug.current = null;
      onClose();
      document.documentElement.classList.remove("mobile-folder-sheet-open");
      onSelectProject(slug);
      closingFromUser.current = false;
    },
    [interactive, onClose, onSelectProject],
  );

  const onSheetAnimationComplete = useCallback(() => {
    if (sheetPhase === "expanded") {
      expandedOnce.current = true;
      setInteractive(true);
      return;
    }
    if (sheetPhase === "collapsed" && expandedOnce.current && !dockFly) {
      tryCompleteDock();
    }
  }, [dockFly, sheetPhase, tryCompleteDock]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && interactive) requestClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [interactive, open, requestClose]);

  if (!mounted) return null;

  return createPortal(
    open ? (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Project folder"
        className="mobile-project-folder-overlay fixed inset-0 z-[140] touch-none md:hidden"
        data-phase={sheetPhase}
        data-dock-fly={dockFly ? "true" : "false"}
        data-animating={animating ? "true" : "false"}
        style={{ pointerEvents: "auto" }}
      >
        <button
          type="button"
          aria-label="Close project folder"
          onClick={interactive ? requestClose : undefined}
          tabIndex={interactive ? 0 : -1}
          className={`absolute inset-0 z-0 border-0 p-0 ${
            interactive ? "bg-[rgba(0,51,98,0.22)]" : "bg-transparent"
          }`}
          style={{ pointerEvents: "auto" }}
        />

        <motion.div
          className={`mobile-project-folder-sheet fixed left-0 top-0 z-[1] flex flex-col overflow-hidden border border-white/10 bg-[rgba(0,51,98,0.3)] backdrop-blur-[22px] backdrop-saturate-[1.35] will-change-transform [transform-origin:0_0] touch-pan-y ${
            sheetPhase === "collapsed" && expandedOnce.current ? "mobile-project-folder-sheet--docking" : ""
          }`}
          initial={false}
          drag={interactive ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.45 }}
          onDragEnd={(_, info) => {
            if (!interactive || closingFromUser.current) return;
            if (info.offset.y > 72 || info.velocity.y > 520) requestClose();
          }}
          style={{
            width: viewport.w,
            height: viewport.h,
            opacity: 1,
            translateZ: 0,
          }}
          animate={{
            x: sheetPose.x,
            y: sheetPose.y,
            scaleX: sheetPose.scaleX,
            scaleY: sheetPose.scaleY,
            borderRadius: sheetPose.borderRadius,
            opacity: dockFly && sheetPhase === "collapsed" ? 0 : 1,
          }}
          transition={transition}
          onAnimationComplete={onSheetAnimationComplete}
        >
          <div
            className={`relative z-10 flex min-h-0 flex-1 flex-col ${
              interactive ? "visible" : "invisible"
            }`}
            style={{ pointerEvents: interactive ? "auto" : "none" }}
            aria-hidden={!interactive}
          >
            <div
              className="flex shrink-0 cursor-grab flex-col items-center gap-2 pb-2 pt-[max(14px,env(safe-area-inset-top))] active:cursor-grabbing"
              aria-hidden
            >
              <img
                src={slideHandle}
                alt=""
                width={111}
                height={4}
                className="h-1 w-[111px] max-w-[min(111px,32vw)] opacity-90"
              />
              <p className="text-[12px] font-medium tracking-[0.04em] text-white/45">Slide down</p>
              <motion.div
                aria-hidden
                animate={reduceMotion ? { y: 0 } : { y: [0, 4, 0] }}
                transition={
                  reduceMotion
                    ? INSTANT
                    : { duration: 1.55, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }
                }
              >
                <ChevronDown className="size-5 text-white/40" strokeWidth={2} />
              </motion.div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch]">
              {/* Figma 3137:12511 — 312×639 column: header top, project list below (justify-between). */}
              <div className="mobile-project-folder-menu mx-auto flex w-full max-w-[312px] flex-1 flex-col items-center px-6 pb-4 pt-4">
                <header className="flex w-full shrink-0 flex-col items-center gap-3">
                  <img src={folderIcon} alt="" width={64} height={64} className="size-16 shrink-0" aria-hidden />
                  <p className="text-center text-[20px] font-normal leading-[1.2] text-white/50">
                    Project Folder
                  </p>
                </header>

                <div className="mobile-project-folder-list-region flex w-full min-h-0 flex-1 flex-col items-center justify-center">
                <ul className="flex w-full shrink-0 flex-col gap-16" role="list">
                  {projects.map((project) => {
                    const subtitle = FOLDER_MENU_ROLE[project.slug] ?? project.role;
                    const previewSrc =
                      MOBILE_FOLDER_PREVIEWS[project.slug] ?? project.hoverPreview?.src;
                    return (
                      <li key={project.slug}>
                        <button
                          type="button"
                          onClick={() => handleSelect(project.slug)}
                          disabled={!interactive}
                          className="mobile-folder-project-row group flex w-full items-center gap-9 rounded-[30px] border border-transparent p-1 text-left disabled:pointer-events-none"
                        >
                          <span className="relative flex size-[57px] shrink-0 items-center justify-center overflow-hidden rounded-[64px] border border-transparent p-3 transition-[border-color] duration-200 group-enabled:group-hover:border-white group-enabled:group-active:border-white">
                            {previewSrc ? (
                              <img
                                src={previewSrc}
                                alt=""
                                className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[64px] object-cover"
                                draggable={false}
                              />
                            ) : (
                              <span
                                className="absolute inset-0 rounded-[64px] bg-white/20"
                                aria-hidden
                              />
                            )}
                            <span className="relative z-[1] w-full text-center text-[16px] font-normal leading-[1.2] tabular-nums text-white">
                              {project.id}
                            </span>
                          </span>
                          <span className="flex min-w-0 flex-col items-start justify-center gap-1 text-[16px] font-normal leading-[1.2]">
                            <span className="mobile-folder-project-row__title text-white">
                              {project.title}
                            </span>
                            <span className="mobile-folder-project-row__role text-white/50">
                              {subtitle}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                </div>
              </div>
            </div>
          </div>

          <p
            className={`relative z-10 flex shrink-0 justify-center pb-[calc(24px+env(safe-area-inset-bottom,0px))] ${
              interactive ? "visible" : "invisible"
            }`}
            style={{ pointerEvents: "none" }}
            aria-hidden={!interactive}
          >
            <img
              src={personalMark}
              alt=""
              width={33}
              height={30}
              className="h-[30px] w-[33px] opacity-90"
              aria-hidden
            />
          </p>
        </motion.div>

        {dockFly && sheetPhase === "collapsed" ? (
          <FolderDockWidget
            origin={layoutOrigin}
            viewport={viewport}
            reduceMotion={reduceMotion}
            onLanded={tryCompleteDock}
          />
        ) : null}
      </div>
    ) : null,
    document.body,
  );
}