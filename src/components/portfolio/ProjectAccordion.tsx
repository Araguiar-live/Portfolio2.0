import { AnimatePresence, motion, type MotionValue } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  forwardRef,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
} from "react";
import { createPortal } from "react-dom";
import bendingSpoonsMark from "@/assets/bending-spoons-mark.svg";
import crcleMark from "@/assets/crcle-mark.svg";
import specPen from "@/assets/crcle/spec/pen.svg";
import specPuzzle from "@/assets/crcle/spec/puzzle.svg";
import specSun from "@/assets/crcle/spec/sun.svg";
import specTarget from "@/assets/crcle/spec/target.svg";
import odicciMark from "@/assets/odicci-mark.svg";
import { CrcleVideoCard } from "@/components/portfolio/CrcleVideoCard";
import { DesktopOnlyPill, useDesktopOnlyNudge } from "@/components/portfolio/DesktopOnlyNudge";
import { MockupGradientRing } from "@/components/portfolio/MockupGradientRing";
import {
  RowHoverPreview,
  useRowHoverPreview,
  type HoverPreviewMedia,
} from "@/components/portfolio/RowHoverPreview";
import { useIsMobile } from "@/hooks/use-mobile";
import { isPhoneViewport } from "@/lib/viewport";

// Tabs shown inside every expanded project row.
// Add/remove entries here to change the case-study steps globally.
const TABS = ["Create Workspace\u00a0", "Brand Personality", "Sign Up", "Template Library"] as const;
export type ProjectTab = (typeof TABS)[number];
type Tab = ProjectTab;

/** Shared open-panel body height — tabs + Figma 402×874 phone + padding */
const EXPANDED_BODY_H = 1120;

export interface Project {
  id: string; // e.g. "01"
  slug: string; // e.g. "crcle" — used by the dock to target this row
  title: string;
  role: string;
  year: string;
  /** Live project URL — shown as a diagonal arrow beside the title. */
  url?: string;
  /** Override the default four case-study steps. */
  tabs?: readonly ProjectTab[];
  /** Cursor-following still that appears on closed desktop rows (live araguiar.design). */
  hoverPreview?: HoverPreviewMedia;
  /** Cursor-following clip that appears only while hovering the live-site arrow. */
  linkHoverPreview?: HoverPreviewMedia;
  // Per-tab content slots. Each returns whatever prototype/text you want to drop in later.
  content?: Partial<Record<Tab, ProjectTabContent>>;
}

export interface ProjectTabContent {
  /** Optional pill label in the accordion tab switcher (defaults to the tab key). */
  tabLabel?: string;
  label?: string;
  subtitle?: string;
  /** Short lede under the title — edit per case study */
  overview?: string;
  challenge?: string;
  approach?: string;
  outcome?: string;
  hypothesis?: string;
  notes?: string;
  // Slot for your live interactive prototype / mockup asset.
  mockup?: React.ReactNode;
  // Optional: fully replace the default two-column body with a custom render.
  // When a function is provided, it receives tab helpers so nested CTAs can advance.
  customBody?:
    | React.ReactNode
    | ((helpers: {
        onNextTab: () => void;
        onPrevTab: () => void;
        goToTab: (tab: ProjectTab) => void;
      }) => React.ReactNode);
}

interface Props {
  project: Project;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  count: number;
}

/** Tab rise above the folder body. */
const TAB_H = 24;
/**
 * Pull the next folder up by the tab plus 24px, so its body — not only its tab —
 * covers 24px of the folder behind it. A 6px hover lift then leaves 18px tucked.
 */
const FOLDER_OVERLAP = TAB_H + 24;
const TAB_FLAT = 160;
const TAB_SLOPE = 20;
const TAB_SHIFT = [24, 160, 296] as const;
const CORNER = 8;
const FOLDER_MARKS: Record<string, { src: string; width: number; height: number }> = {
  crcle: { src: crcleMark, width: 47.4902, height: 49.0909 },
  "first-design": { src: bendingSpoonsMark, width: 58.843, height: 31.7802 },
  odicci: { src: odicciMark, width: 45, height: 49.0909 },
};
/** 60% smaller than the Figma mark. */
const FOLDER_MARK_SCALE = 0.4;

function FolderMark({ slug }: { slug: string }) {
  const mark = FOLDER_MARKS[slug];
  if (!mark) return null;
  const width = mark.width * FOLDER_MARK_SCALE;
  const height = mark.height * FOLDER_MARK_SCALE;
  return (
    <img
      src={mark.src}
      alt=""
      width={width}
      height={height}
      className="pointer-events-none relative z-20 max-w-none opacity-[0.448]"
      decoding="async"
      style={{ width, height }}
    />
  );
}
/** Outer corners of the whole stack, not each file. */
const STACK_CORNER = 24;

type Pt = [number, number];

function cornerCuts(points: Pt[], radii: number[]) {
  const n = points.length;
  return points.map((curr, i) => {
    const prev = points[(i - 1 + n) % n];
    const next = points[(i + 1) % n];
    const inLen = Math.hypot(curr[0] - prev[0], curr[1] - prev[1]) || 1;
    const outLen = Math.hypot(next[0] - curr[0], next[1] - curr[1]) || 1;
    const radius = Math.min(radii[i], inLen / 2, outLen / 2);
    const ix = (curr[0] - prev[0]) / inLen;
    const iy = (curr[1] - prev[1]) / inLen;
    const ox = (next[0] - curr[0]) / outLen;
    const oy = (next[1] - curr[1]) / outLen;
    return {
      start: [curr[0] - ix * radius, curr[1] - iy * radius] as Pt,
      end: [curr[0] + ox * radius, curr[1] + oy * radius] as Pt,
      corner: curr,
    };
  });
}

/**
 * Quadratic fillet. The control point is the sharp vertex, and the curve
 * starts and ends `radius` px along the two edges, so it cannot bulge outside them.
 */
function quadraticOutline(points: Pt[], radii: number[]): string {
  const cuts = cornerCuts(points, radii);
  let d = `M ${cuts[0].start[0]} ${cuts[0].start[1]}`;
  for (let i = 0; i < cuts.length; i++) {
    const cut = cuts[i];
    const next = cuts[(i + 1) % cuts.length];
    d += ` Q ${cut.corner[0]} ${cut.corner[1]} ${cut.end[0]} ${cut.end[1]}`;
    d += ` L ${next.start[0]} ${next.start[1]}`;
  }
  return `${d} Z`;
}

/** Move each edge inward so a 1px stroke sits fully inside the card. */
function insetPoints(points: Pt[], amount: number): Pt[] {
  const n = points.length;
  const edges = points.map((p, i) => {
    const q = points[(i + 1) % n];
    const dx = q[0] - p[0];
    const dy = q[1] - p[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = dy / len;
    const ny = -dx / len;
    return { p: [p[0] + nx * amount, p[1] + ny * amount] as Pt, d: [dx, dy] as Pt };
  });
  return edges.map((edge, i) => {
    const prev = edges[(i - 1 + n) % n];
    const det = prev.d[0] * edge.d[1] - prev.d[1] * edge.d[0];
    if (Math.abs(det) < 1e-6) return edge.p;
    const t = ((edge.p[0] - prev.p[0]) * edge.d[1] - (edge.p[1] - prev.p[1]) * edge.d[0]) / det;
    return [prev.p[0] + prev.d[0] * t, prev.p[1] + prev.d[1] * t];
  });
}

/** One outline: tab and body share a perimeter, with no stroke across the tab base. */
function folderOutline(
  width: number,
  height: number,
  shift: number,
  index: number,
  count: number,
): { points: Array<[number, number]>; radii: number[] } {
  const lip = Math.min(TAB_H, height * 0.45);
  const margin = CORNER;
  let slope = TAB_SLOPE;
  let flat = TAB_FLAT;
  let left = Math.max(margin, shift);
  const room = width - margin - left - slope * 2;
  if (flat > room) {
    left = margin;
    flat = Math.max(48, width - margin * 2 - slope * 2);
  }
  const leftTop = left + slope;
  const rightTop = leftTop + flat;
  const rightFoot = rightTop + slope;
  const tr = (index === 0 ? STACK_CORNER : CORNER) + 8;
  const edge = (index === count - 1 ? STACK_CORNER : CORNER) + 8;
  const points: Array<[number, number]> = [
    [0, height],
    [width, height],
    [width, lip],
    [rightFoot, lip],
    [rightTop, 0],
    [leftTop, 0],
    [left, lip],
    [0, lip],
  ];
  const radii = points.map((_, i) => {
    if (i === 0 || i === 1) return edge;
    // Softer top of each sheet: body top-right and the tab's top corners.
    if (i === 2) return Math.max(tr, 24);
    if (i === 4 || i === 5) return 24;
    if (i === 3 || i === 6 || i === 7) return 16;
    return CORNER;
  });
  return { points, radii };
}

/** Top arch only. y=18 is the paper edge. */
const CLIP_BACK = "M 6 18 L 6 10 A 6 6 0 0 1 18 10 L 18 18";
/** Front loop: long right leg, bottom U, short left leg. */
const CLIP_FRONT = "M 18 14 L 18 48 A 5 5 0 0 1 8 48 L 8 24";

function ClipWire({ d, stroke }: { d: string; stroke: string }) {
  return (
    <svg
      viewBox="0 0 24 64"
      width="25.3"
      height="64.4"
      className="block overflow-visible"
      fill="none"
      aria-hidden
    >
      <path d={d} stroke={stroke} strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

/** Straight vertical wire slid over the top edge of 02 Bending Spoons. */
function BendingSpoonsPaperclip() {
  const place =
    "pointer-events-none absolute left-[44%] -top-[18px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.14)]";
  return (
    <>
      <div aria-hidden className={`${place} z-0`} style={{ marginTop: TAB_H }}>
        <ClipWire d={CLIP_BACK} stroke="#EAB308" />
      </div>
      <div aria-hidden className={`${place} z-20`} style={{ marginTop: TAB_H }}>
        <ClipWire d={CLIP_FRONT} stroke="#EAB308" />
      </div>
    </>
  );
}

/** White project accordion card — mockup / bento treatment TBD. */
export function ProjectBentoStack({
  projects,
  openSlug,
  onToggle,
  rowRefs,
  nudgeSignal = 0,
}: {
  projects: Project[];
  openSlug: string | null;
  onToggle: (slug: string) => void;
  rowRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
  /** Bump to play the phone "desktop-only" nudge from outside (e.g. footer links). */
  nudgeSignal?: number;
}) {
  const isMobile = useIsMobile();
  const { controls: shake, pillVisible, nudge } = useDesktopOnlyNudge();

  useEffect(() => {
    if (nudgeSignal > 0) nudge();
  }, [nudgeSignal, nudge]);

  const handleToggle = (slug: string) => {
    if (isPhoneViewport()) nudge();
    else onToggle(slug);
  };

  return (
    <motion.div
      animate={shake}
      className="portfolio-mobile-shake-root relative flex w-full max-w-full shrink-0 flex-col"
    >
      {projects.map((p, index) => (
        <ProjectAccordion
          key={p.slug}
          ref={(el) => {
            rowRefs.current[p.slug] = el;
          }}
          index={index}
          count={projects.length}
          project={p}
          isOpen={!isMobile && openSlug === p.slug}
          onToggle={() => handleToggle(p.slug)}
        />
      ))}

      <DesktopOnlyPill
        visible={pillVisible}
        className="bottom-3 left-1/2 -translate-x-1/2 md:hidden"
      />
    </motion.div>
  );
}

export const ProjectAccordion = forwardRef<HTMLDivElement, Props>(function ProjectAccordion(
  { project, isOpen, onToggle, index, count },
  ref,
) {
  const tabs = project.tabs?.length ? project.tabs : TABS;
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (project.slug === "crcle") return "Template Library";
    return (project.tabs?.[0] as Tab | undefined) ?? "Template Library";
  });
  const tabContent = project.content?.[activeTab] ?? {};
  const showTabChrome = tabs.length > 1;
  const rowHover = useRowHoverPreview(project.hoverPreview, !isOpen);
  const linkHover = useRowHoverPreview(project.linkHoverPreview, Boolean(project.url) && isOpen);

  const [hovered, setHovered] = useState(false);
  const raised = hovered || isOpen;
  const tabShift = TAB_SHIFT[index] ?? TAB_SHIFT[TAB_SHIFT.length - 1];
  const faceRef = useRef<HTMLDivElement>(null);
  const [outline, setOutline] = useState<{ d: string; stroke: string; w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = faceRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width < 2 || height < 2) return;
      const shape = folderOutline(width, height, tabShift, index, count);
      const strokeRadii = shape.radii.map((radius) => Math.max(0, radius - 0.5));
      const strokePoints = insetPoints(shape.points, 0.5);
      setOutline({
        d: quadraticOutline(shape.points, shape.radii),
        stroke: quadraticOutline(strokePoints, strokeRadii),
        w: width,
        h: height,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [count, index, isOpen, tabShift]);

  return (
    <div
      ref={ref}
      data-raised={raised ? "true" : "false"}
      data-open={isOpen ? "true" : "false"}
      data-hovered={!isOpen && hovered ? "true" : "false"}
      className="folder-shell pointer-events-none relative border-0 outline-none"
      style={
        {
          "--sheet-tilt": (index + 1) % 2 === 1 ? "-0.8deg" : "0.8deg",
          zIndex: index + 1,
          marginTop: index === 0 ? 0 : -FOLDER_OVERLAP,
          border: 0,
          outline: "none",
          boxShadow: "none",
        } as CSSProperties
      }
    >
      {project.slug === "first-design" ? <BendingSpoonsPaperclip /> : null}
      <div
        ref={faceRef}
        className="folder-face pointer-events-auto relative border-0 outline-none"
        style={{
          clipPath: outline ? `url(#folder-clip-${project.slug})` : "none",
          paddingTop: TAB_H,
          border: 0,
          outline: "none",
          boxShadow: "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
      {/* Row header — Figma 530:151817. Closed sheet is 20% taller than the 162px desktop / 130px phone rows; overlap stays 48px. */}
      <div
        className="group relative flex w-full items-center justify-between gap-7 border-0 px-[37px] py-[78.6px] text-left outline-none transition-[background] duration-300 max-md:flex-col max-md:items-stretch max-md:gap-[15px] max-md:px-5 max-md:py-[41.4px] max-sm:gap-[15px] max-sm:px-5 max-sm:py-[41.4px]"
        onMouseEnter={rowHover.onMouseEnter}
        onMouseMove={rowHover.onMouseMove}
        onMouseLeave={rowHover.onMouseLeave}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Collapse" : "Open"} ${project.title}`}
          className="absolute inset-0 z-0 cursor-pointer"
        />
        <div className="relative z-10 flex min-w-0 flex-1 items-center gap-[37px] pointer-events-none max-md:gap-3 max-sm:gap-3">
          <span className="folder-muted relative inline-flex shrink-0 items-center gap-2.5 text-[16px] font-medium tracking-[1px] tabular-nums max-md:gap-1.5 max-md:text-[10px] max-md:font-normal max-md:tracking-normal max-sm:text-[10px]">
            {project.id}
          </span>
          <span className="flex min-w-0 items-center gap-2 max-md:gap-1.5">
            <span className="folder-title truncate text-[24px] font-normal tracking-[-0.5px] max-md:text-[24px] max-md:leading-[29px] max-md:tracking-normal max-sm:text-[24px] max-sm:leading-[29px] sm:text-[37px]">
              {project.title}
            </span>
            {project.url && isOpen ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} site`}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  linkHover.onMouseEnter(e);
                }}
                onMouseMove={(e) => {
                  e.stopPropagation();
                  linkHover.onMouseMove(e);
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  linkHover.onMouseLeave();
                }}
                className="pointer-events-auto relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-[#111]/50 transition-colors hover:bg-black/[0.06] hover:text-[#111] max-md:size-7 sm:size-9 before:absolute before:-inset-3 before:content-['']"
              >
                <ArrowUpRight className="size-5 max-md:size-4 sm:size-[22px]" strokeWidth={2.2} />
              </a>
            ) : null}
          </span>
        </div>
        <div className="relative z-10 flex shrink-0 flex-col items-end gap-2 pointer-events-none max-md:items-start max-sm:items-start">
          <FolderMark slug={project.slug} />
          <div className="folder-muted flex items-center justify-end gap-[18px] text-[16px] max-md:gap-2 max-md:text-[10px] max-sm:gap-2 max-sm:text-[10px]">
            <span className="text-right max-md:flex-1 max-md:text-left max-md:leading-4 max-sm:flex-1 max-sm:text-left max-sm:leading-4">
              {project.role}
            </span>
            <span className="font-light max-sm:font-normal">|</span>
            <span className="tabular-nums">{project.year}</span>
          </div>
        </div>
      </div>

      {project.hoverPreview ? (
        <RowHoverPreview
          open={rowHover.open}
          media={project.hoverPreview}
          x={rowHover.x}
          y={rowHover.y}
          rotate={rowHover.rotate}
          reduceMotion={rowHover.reduceMotion}
        />
      ) : null}
      {project.linkHoverPreview && project.url ? (
        <CrcleArrowVideoHover
          open={linkHover.open}
          keepAlive={isOpen}
          videoSrc={project.linkHoverPreview.src}
          liveUrl={project.url}
          x={linkHover.x}
          y={linkHover.y}
        />
      ) : null}

      {/* Expanded body — fixed length for consistency across projects */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0 }}
            animate={{ height: project.slug === "odicci" ? "auto" : EXPANDED_BODY_H }}
            exit={{ height: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className={`relative flex flex-col px-6 py-6 ${project.slug === "odicci" ? "h-auto" : "h-full"}`}
              style={project.slug === "odicci" ? undefined : { height: EXPANDED_BODY_H }}
            >
              {showTabChrome ? (
                <div className={isEditorial(project.slug) ? "mb-6 flex shrink-0 justify-start px-4 sm:px-8 lg:px-6" : "mb-6 flex shrink-0 justify-center"}>
                  <div className="inline-flex items-center gap-1 rounded-full border border-white bg-white/70 p-1 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
                    {tabs.map((tab) => {
                      const active = tab === activeTab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={
                            "rounded-full border px-4 py-1.5 text-xs font-medium tracking-tight transition-all duration-300 " +
                            (active
                              ? "border-black bg-black text-white hover:bg-black hover:text-white"
                              : "border-transparent bg-transparent text-zinc-500 hover:border-black hover:bg-transparent hover:text-zinc-900")
                          }
                        >
                          {project.content?.[tab]?.tabLabel ?? tab}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className={isEditorial(project.slug) ? "mb-6 flex shrink-0 justify-start px-4 sm:px-8 lg:px-6" : "mb-6 flex shrink-0 justify-center"}>
                  <div className="inline-flex items-center rounded-full border border-white bg-white/70 p-1 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
                    <span className="rounded-full border border-black bg-black px-4 py-1.5 text-xs font-medium tracking-tight text-white">
                      {project.content?.[activeTab]?.tabLabel ?? activeTab}
                    </span>
                  </div>
                </div>
              )}

              {showTabChrome ? (
                <>
                  <NavArrow
                    direction="prev"
                    onClick={() => {
                      const i = tabs.indexOf(activeTab);
                      setActiveTab(tabs[(i - 1 + tabs.length) % tabs.length]);
                    }}
                  />
                  <NavArrow
                    direction="next"
                    onClick={() => {
                      const i = tabs.indexOf(activeTab);
                      setActiveTab(tabs[(i + 1) % tabs.length]);
                    }}
                  />
                </>
              ) : null}

              {/* Editorial rows: story, spec list, prototype stage. */}
              <div className={`mx-auto flex min-h-0 w-full flex-1 items-start overflow-visible px-4 sm:px-8 lg:px-6 ${isEditorial(project.slug) ? "" : "pt-2"}`}>
                  <div className={project.slug === "odicci"
                    ? "grid w-full min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-2"
                    : project.slug === "first-design"
                    ? "grid h-full min-h-0 w-full min-w-0 grid-cols-1 items-start gap-3 overflow-x-clip lg:grid-cols-[0.98fr_0.8fr_1.32fr]"
                    : isEditorial(project.slug)
                    ? "grid h-full min-h-0 w-full min-w-0 grid-cols-1 items-start gap-3 overflow-x-clip lg:grid-cols-[1.1fr_0.9fr_1.1fr]"
                    : "grid w-full min-w-0 grid-cols-1 items-start gap-8 overflow-x-clip lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-8"}>
                    {isEditorial(project.slug) ? (
                      <EditorialNarrative copy={editorialCopy(project, activeTab, tabContent)} dense={project.slug === "first-design"} />
                    ) : (
                    <div className="flex max-h-[874px] min-h-0 min-w-0 flex-col overflow-x-hidden overflow-y-auto overscroll-contain">
                      <CaseStudyCopy project={project} tab={activeTab} content={tabContent} />
                    </div>
                    )}
                    {isEditorial(project.slug) ? <EditorialSpecs copy={editorialCopy(project, activeTab, tabContent)} dense={project.slug === "first-design"} /> : null}

                    <div className={project.slug === "odicci"
                      ? "flex w-full justify-center lg:col-span-2"
                      : project.slug === "first-design"
                      ? "relative flex min-h-0 min-w-0 w-full items-start justify-center overflow-visible"
                      : isEditorial(project.slug)
                      ? "relative ml-0 flex min-h-0 min-w-0 items-start justify-center overflow-auto rounded-[32px] border border-[rgba(0,0,0,0.06)] bg-[#F4F4F5]/80 p-3 lg:ml-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      : "relative flex w-full min-w-0 items-start justify-end overflow-visible"}>
                      <div className={project.slug === "odicci"
                        ? "flex w-full max-w-[980px] justify-center"
                        : project.slug === "first-design"
                        ? "flex w-full min-w-0 max-w-full items-start justify-center"
                        : isEditorial(project.slug)
                        ? "mx-auto flex w-full min-w-0 max-w-full items-start justify-center"
                        : "ml-auto flex w-full min-w-0 max-w-full items-start justify-end overflow-visible"}>
                        {tabContent.customBody ? (
                          <Suspense fallback={<div className="min-h-[420px] w-full" />}>
                            {typeof tabContent.customBody === "function"
                              ? tabContent.customBody({
                                  onNextTab: () => {
                                    const i = tabs.indexOf(activeTab);
                                    setActiveTab(tabs[(i + 1) % tabs.length]);
                                  },
                                  onPrevTab: () => {
                                    const i = tabs.indexOf(activeTab);
                                    setActiveTab(tabs[(i - 1 + tabs.length) % tabs.length]);
                                  },
                                  goToTab: (tab) => setActiveTab(tab),
                                })
                              : tabContent.customBody}
                          </Suspense>
                        ) : (
                          <MockupGradientRing className="aspect-[4/5] h-[874px] max-h-[874px] w-auto max-w-full overflow-hidden rounded-3xl">
                            <div className="absolute inset-[1px] z-[1] flex items-center justify-center overflow-hidden rounded-[23px]">
                              {tabContent.mockup ?? (
                                <div className="px-6 text-center text-xs uppercase tracking-widest text-zinc-500">
                                  {project.slug} · {activeTab}
                                  <span className="mt-2 block font-normal normal-case tracking-normal text-zinc-400">
                                    Prototype slot — swap in your screen later
                                  </span>
                                </div>
                              )}
                            </div>
                          </MockupGradientRing>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      {outline ? (
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
          width={outline.w}
          height={outline.h}
          viewBox={`0 0 ${outline.w} ${outline.h}`}
          style={{ overflow: "visible" }}
        >
          <clipPath id={`folder-clip-${project.slug}`} clipPathUnits="userSpaceOnUse">
            <path d={outline.d} />
          </clipPath>
          <path
            className="folder-stroke"
            d={outline.stroke}
            fill="none"
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap="butt"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : null}
    </div>
  );
});

type CrcleBentoCopy = {
  eyebrow: string;
  headline: string;
  narrative: string;
  role: string;
  problems: string[];
  shipped: string[];
  impact: string;
};

const CRCLE_BENTO: Partial<Record<Tab, CrcleBentoCopy>> = {
  "Create Workspace\u00a0": {
    eyebrow: "CRCLE · SIGNAL HOME",
    headline: "Real-time presence and social broadcasting",
    narrative:
      "Designed from 0→1 to let members broadcast what they are open to right now across work, social, and dating.",
    role: "Founding Designer — 0→1 product & design system",
    problems: ["Fragmented multi-context networking", "Outdated, static profile statuses"],
    shipped: ["Live Signal status broadcast controls", "Core navigation & cross-app design system"],
    impact: "Shipped a cohesive 0→1 system for high-intent social discovery.",
  },
  "Brand Personality": {
    eyebrow: "CRCLE · RADAR",
    headline: "From filtered search to intent-led discovery",
    narrative:
      "Evolved Radar from a manual Work/Social/Love search bar into a daily recommendation engine where tapping + signals clear intent to match.",
    role: "Founding Designer — Discovery & matching UX",
    problems: ["Search friction & empty-state fatigue", "Ambiguous, low-intent connection requests"],
    shipped: ["Curated daily recommendation feed", "One-tap + intent-based matching"],
    impact: "Built a daily discovery habit anchored in clear mutual intent.",
  },
  "Sign Up": {
    eyebrow: "CRCLE · MESSAGING HUB",
    headline: "Unified inbox and context-rich icebreakers",
    narrative:
      "Combined notifications and messages into one stream with an intercepted match drawer and Locus prompts so users never get cold feet.",
    role: "Founding Designer — Inbox & conversation UX",
    problems: ["Split match alerts and chat threads", "First-message drop-off ('cold feet')"],
    shipped: [
      "Unified notification & messaging stream",
      "Intercepted profile & match-context drawer",
      "Locus conversation prompts",
    ],
    impact: "Lowered first-message friction by keeping shared intent visible.",
  },
  "Template Library": {
    eyebrow: "CRCLE · PROFILE",
    headline: "Identity, live mood, and editable widgets",
    narrative:
      "Replaced static, form-heavy profiles with an iOS-inspired widget grid so members can broadcast live intent and edit tiles directly in place.",
    role: "Founding Designer — End-to-end UX/UI & prototype",
    problems: ["Static, form-like profile templates", "Cluttered work, social & dating metadata"],
    shipped: ["Modular 2×2 iOS-style bento widgets", "Inline edit drawers & live Mood toggle"],
    impact: "Turned passive bios into scannable, customizable identity cards.",
  },
};

function crcleCopy(tab: Tab): CrcleBentoCopy {
  return CRCLE_BENTO[tab] ?? CRCLE_BENTO["Template Library"]!;
}

function isEditorial(slug: string) {
  return slug === "crcle" || slug === "first-design" || slug === "odicci";
}

const EDITORIAL_META: Record<string, Partial<Record<Tab, { eyebrow: string; role: string }>>> = {
  "first-design": {
    "Template Library": {
      eyebrow: "FIRST DESIGN · PRODUCTIVE",
      role: "Product Designer — 24-hour First Design Hackathon sprint",
    },
  },
  odicci: {
    "Create Workspace\u00a0": {
      eyebrow: "ODICCI · WORKSPACE",
      role: "Product Team — Workspace & integrations",
    },
    "Brand Personality": {
      eyebrow: "ODICCI · BRAND",
      role: "Product Team — Brand system",
    },
    "Sign Up": {
      eyebrow: "ODICCI · SIGN UP",
      role: "Product Team — Sign-up",
    },
    "Template Library": {
      eyebrow: "ODICCI · TEMPLATES",
      role: "Product Team — Template library",
    },
  },
};

function editorialCopy(project: Project, tab: Tab, content: ProjectTabContent): CrcleBentoCopy {
  if (project.slug === "crcle") return crcleCopy(tab);
  const meta = EDITORIAL_META[project.slug]?.[tab];
  const lines = (value?: string) => (value?.trim() ? [value.trim()] : []);
  return {
    eyebrow: meta?.eyebrow ?? `${project.title.toUpperCase()} · ${tab.toUpperCase()}`,
    headline: content.subtitle?.trim() || "Case study",
    narrative: content.overview?.trim() || "",
    role: meta?.role ?? project.role,
    problems: lines(content.challenge),
    shipped: lines(content.approach ?? content.hypothesis),
    impact: (content.outcome ?? content.notes)?.trim() || "",
  };
}

function EditorialNarrative({ copy, dense = false }: { copy: CrcleBentoCopy; dense?: boolean }) {
  return (
    <article className="flex min-h-0 flex-col gap-4">
      <span className={`${dense ? "text-[11px]" : "text-[12.65px]"} font-medium uppercase tracking-[0.18em] text-zinc-400`}>{copy.eyebrow}</span>
      <h3 className={`${dense ? "text-[32px]" : "text-[39.1px]"} font-medium leading-[1.15] tracking-[-0.03em] text-[#111111]`}>{copy.headline}</h3>
      <p className={`max-w-[34ch] text-zinc-600 ${dense ? "text-[15px] leading-7" : "text-[17.25px] leading-[32.2px]"}`}>{copy.narrative}</p>
    </article>
  );
}

function EditorialSpecs({ copy, dense = false }: { copy: CrcleBentoCopy; dense?: boolean }) {
  const rows: Array<{ label: string; icon: string; lines: string[] }> = [
    { label: "Role & Scope", icon: specPen, lines: [copy.role] },
    { label: "Problems Solved", icon: specTarget, lines: copy.problems },
    { label: "What I Shipped", icon: specPuzzle, lines: copy.shipped },
    { label: "Impact & Outcome", icon: specSun, lines: [copy.impact] },
  ];
  return (
    <div className="flex min-h-0 flex-col gap-[22px]">
      {rows.map((row) => (
        <article key={row.label} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="spec-icon inline-flex size-[14px] shrink-0 opacity-[0.55]">
              <img src={row.icon} alt="" width={14} height={14} className="size-[14px] max-w-none" />
            </span>
            <span className={`${dense ? "text-[13px]" : "text-[14.95px]"} font-normal tracking-normal text-[#737373]`}>{row.label}</span>
          </div>
          <div className="flex flex-col gap-1 pl-[22px]">
            {row.lines.map((line) => (
              <p key={line} className={`${dense ? "text-[13px] leading-5" : "text-[14.95px] leading-[23px]"} text-[#111111]`}>
                {line}
              </p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

/**
 * Editable case-study copy mockup.
 * Override any string via `project.content[tab].overview|challenge|approach|outcome|…`
 */
function CaseStudyCopy({
  project,
  tab,
  content,
}: {
  project: Project;
  tab: Tab;
  content: ProjectTabContent;
}) {
  const overview =
    content.overview ??
    `Replace this overview for ${project.title}. One or two sentences on what this step in the case study is about and why it matters.`;
  const challenge =
    content.challenge ??
    "Replace this challenge — the user problem, business constraint, or friction that framed the work.";
  const approach =
    content.approach ??
    content.hypothesis ??
    "Replace this approach — principles, flows, and decisions that shaped the solution.";
  const outcome =
    content.outcome ??
    content.notes ??
    "Replace this outcome — what shipped, what you learned, and what you’d iterate next.";

  return (
    <div className="flex w-full min-w-0 flex-col gap-[36px] py-0">
      <div className="flex flex-col gap-5">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
          {content.label ?? `${project.title} — ${tab}`}
        </span>
        <h3 className="text-3xl font-medium leading-[1.15] tracking-tight text-zinc-900 md:text-[40px]">
          {content.subtitle ?? "Case study headline — edit me"}
        </h3>
        <p className="text-[15px] leading-7 text-zinc-500">{overview}</p>
      </div>

      {challenge.trim() ? <TextBlock heading="Challenge">{challenge}</TextBlock> : null}
      {approach.trim() ? <TextBlock heading="Approach">{approach}</TextBlock> : null}
      {outcome.trim() ? <TextBlock heading="Outcome">{outcome}</TextBlock> : null}
    </div>
  );
}

function CrcleArrowVideoHover({
  open,
  keepAlive,
  videoSrc,
  liveUrl,
  x,
  y,
}: {
  open: boolean;
  keepAlive: boolean;
  videoSrc: string;
  liveUrl: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || (!keepAlive && !open)) return null;

  const width = Math.min(560, window.innerWidth - 32);
  const height = width * (720 / 1280);

  return createPortal(
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[200] will-change-transform"
      style={{
        x,
        y,
        opacity: open ? 1 : 0,
        visibility: open ? "visible" : "hidden",
      }}
      aria-hidden
    >
      <div
        className="pointer-events-none -translate-x-1/2 -translate-y-1/2 [&>a]:block [&>a]:h-full [&>a]:w-full"
        style={{ width, height }}
      >
        <CrcleVideoCard videoSrc={videoSrc} liveUrl={liveUrl} />
      </div>
    </motion.div>,
    document.body,
  );
}

function TextBlock({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-900">
        {heading}
      </div>
      <p className="text-sm leading-7 text-zinc-500">{children}</p>
    </div>
  );
}

function NavArrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Previous step" : "Next step"}
      className={
        "hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full border border-zinc-200 bg-white/80 backdrop-blur hover:bg-white text-black transition-colors " +
        (isPrev ? "left-6" : "right-6")
      }
    >
      {isPrev ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
    </button>
  );
}