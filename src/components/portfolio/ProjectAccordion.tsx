import { AnimatePresence, motion, type MotionValue } from "framer-motion";
import { ArrowUpRight, Briefcase, ChevronLeft, ChevronRight, Layers, Target, TrendingUp } from "lucide-react";
import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import { createPortal } from "react-dom";
import bendingSpoonsMark from "@/assets/bending-spoons-mark.svg";
import crcleMark from "@/assets/crcle-mark.svg";
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

/** Tab rise, 18% taller than the 18px step so the slope reads clearly. */
const TAB_H = 22;
const TAB_FLAT = 160;
const TAB_SLOPE = 20;
const TAB_SHIFT = [24, 160, 296] as const;
const CORNER = 8;
const FOLDER_MARKS: Record<string, { src: string; width: number; height: number }> = {
  crcle: { src: crcleMark, width: 46, height: 49 },
  "first-design": { src: bendingSpoonsMark, width: 58.843, height: 31.7802 },
  odicci: { src: odicciMark, width: 45, height: 49.0909 },
};
/** 60% smaller than the Figma mark, sitting 4px higher than the original 6px gap. */
const FOLDER_MARK_SCALE = 0.4;
const FOLDER_MARK_TOP = TAB_H + 2;

/** Horizontal center of the sloped tab, matching the outline's clamp on narrow rows. */
function tabCenterX(width: number, shift: number) {
  const margin = CORNER;
  let slope = TAB_SLOPE;
  let flat = TAB_FLAT;
  let left = Math.max(margin, shift);
  const room = width - margin - left - slope * 2;
  if (flat > room) {
    left = margin;
    flat = Math.max(48, width - margin * 2 - slope * 2);
  }
  return left + slope + flat / 2;
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

/** Same fillet, without the bottom edge, so a covered seam is not drawn twice. */
function quadraticOpenStroke(points: Pt[], radii: number[]): string {
  const cuts = cornerCuts(points, radii);
  const n = cuts.length;
  let d = `M ${cuts[1].start[0]} ${cuts[1].start[1]}`;
  for (let i = 1; i < n; i++) {
    const cut = cuts[i];
    const next = cuts[(i + 1) % n];
    d += ` Q ${cut.corner[0]} ${cut.corner[1]} ${cut.end[0]} ${cut.end[1]}`;
    d += ` L ${next.start[0]} ${next.start[1]}`;
  }
  const last = cuts[0];
  d += ` Q ${last.corner[0]} ${last.corner[1]} ${last.end[0]} ${last.end[1]}`;
  return d;
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
  const tr = index === 0 ? STACK_CORNER : CORNER;
  const edge = index === count - 1 ? STACK_CORNER : CORNER;
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
    if (i === 2) return tr;
    return CORNER;
  });
  return { points, radii };
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
      className="portfolio-mobile-shake-root relative z-10 flex w-full max-w-full shrink-0 flex-col"
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
      const closeBottom = index === count - 1;
      setOutline({
        d: quadraticOutline(shape.points, shape.radii),
        stroke: closeBottom
          ? quadraticOutline(strokePoints, strokeRadii)
          : quadraticOpenStroke(strokePoints, strokeRadii),
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
      className="folder-shell pointer-events-none relative border-0 outline-none"
      style={{
        zIndex: raised ? 40 : index + 1,
        marginTop: index === 0 ? 0 : -TAB_H,
        top: raised ? -4 : 0,
        border: 0,
        outline: "none",
        boxShadow: "none",
      }}
    >
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
      {outline && FOLDER_MARKS[project.slug] ? (
        <img
          src={FOLDER_MARKS[project.slug].src}
          alt=""
          width={FOLDER_MARKS[project.slug].width * FOLDER_MARK_SCALE}
          height={FOLDER_MARKS[project.slug].height * FOLDER_MARK_SCALE}
          className="pointer-events-none absolute z-20 max-w-none"
          style={{
            width: FOLDER_MARKS[project.slug].width * FOLDER_MARK_SCALE,
            height: FOLDER_MARKS[project.slug].height * FOLDER_MARK_SCALE,
            left:
              tabCenterX(outline.w, tabShift) -
              (FOLDER_MARKS[project.slug].width * FOLDER_MARK_SCALE) / 2,
            top: FOLDER_MARK_TOP,
          }}
        />
      ) : null}
      {/* Row header — Figma 530:151817 */}
      <div
        className="group relative flex w-full items-center justify-between gap-7 border-0 px-[37px] py-[41px] text-left outline-none transition-[background] duration-300 max-md:flex-col max-md:items-stretch max-md:gap-[15px] max-md:px-5 max-md:py-[23px] max-sm:gap-[15px] max-sm:px-5 max-sm:py-[23px]"
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
          <span className="folder-muted shrink-0 text-[16px] font-medium tracking-[1px] tabular-nums max-md:text-[10px] max-md:font-normal max-md:tracking-normal max-sm:text-[10px]">
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
        <div className="folder-muted relative z-10 flex shrink-0 items-center justify-end gap-[18px] text-[16px] pointer-events-none max-md:gap-2 max-md:text-[10px] max-sm:gap-2 max-sm:text-[10px]">
          <span className="text-right max-md:flex-1 max-md:text-left max-md:leading-4 max-sm:flex-1 max-sm:text-left max-sm:leading-4">
            {project.role}
          </span>
          <span className="font-light max-sm:font-normal">|</span>
          <span className="tabular-nums">{project.year}</span>
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
            animate={{ height: EXPANDED_BODY_H }}
            exit={{ height: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="relative flex h-full flex-col px-6 py-6"
              style={{ height: EXPANDED_BODY_H }}
            >
              {showTabChrome ? (
                <div className="mb-6 flex shrink-0 justify-center">
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
                <div className="mb-6 flex shrink-0 justify-center">
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

              {/* CRCLE uses a three-cell bento. Other projects keep the 1:2 write-up. */}
              <div className={`mx-auto flex min-h-0 w-full flex-1 overflow-visible px-4 pt-2 sm:px-8 lg:px-6 ${project.slug === "crcle" ? "items-stretch" : "items-start"}`}>
                  <div className={project.slug === "crcle"
                    ? "grid h-full min-h-0 w-full min-w-0 grid-cols-1 items-stretch gap-3 overflow-x-clip lg:grid-cols-[1.1fr_0.9fr_1.1fr]"
                    : "grid w-full min-w-0 grid-cols-1 items-start gap-8 overflow-x-clip lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-8"}>
                    {project.slug === "crcle" ? (
                      <CrcleNarrative tab={activeTab} />
                    ) : (
                    <div className="flex max-h-[874px] min-h-0 min-w-0 flex-col overflow-x-hidden overflow-y-auto overscroll-contain">
                      <CaseStudyCopy project={project} tab={activeTab} content={tabContent} />
                    </div>
                    )}
                    {project.slug === "crcle" ? <CrcleMicroCards tab={activeTab} /> : null}

                    <div className={project.slug === "crcle"
                      ? "relative flex h-full min-h-0 min-w-0 items-start justify-center overflow-auto rounded-[16px] border border-[rgba(0,0,0,0.06)] bg-[#F5F5F5] p-3"
                      : "relative flex w-full min-w-0 items-start justify-end overflow-visible"}>
                      <div className={project.slug === "crcle"
                        ? "mx-auto flex w-full min-w-0 max-w-full items-start justify-center"
                        : "ml-auto flex w-full min-w-0 max-w-full items-start justify-end overflow-visible"}>
                        {tabContent.customBody ? (
                          typeof tabContent.customBody === "function"
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
                            : tabContent.customBody
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
            d={outline.stroke}
            fill="none"
            stroke="#D1D5DB"
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

const BENTO_CARD = "border border-[rgba(0,0,0,0.06)] bg-[#F5F5F5]";

function crcleCopy(tab: Tab): CrcleBentoCopy {
  return CRCLE_BENTO[tab] ?? CRCLE_BENTO["Template Library"]!;
}

function CrcleNarrative({ tab }: { tab: Tab }) {
  const copy = crcleCopy(tab);
  return (
    <article className={`${BENTO_CARD} flex min-h-0 flex-col gap-4 rounded-[16px] p-6`}>
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">{copy.eyebrow}</span>
      <h3 className="text-[28px] font-medium leading-[1.15] tracking-tight text-zinc-900">{copy.headline}</h3>
      <p className="text-[15px] leading-7 text-zinc-600">{copy.narrative}</p>
    </article>
  );
}

function CrcleMicroCards({ tab }: { tab: Tab }) {
  const copy = crcleCopy(tab);
  const cards: Array<{ icon: typeof Briefcase; label: string; lines: string[] }> = [
    { icon: Briefcase, label: "Role & Scope", lines: [copy.role] },
    { icon: Target, label: "Problems Solved", lines: copy.problems },
    { icon: Layers, label: "What I Shipped", lines: copy.shipped },
    { icon: TrendingUp, label: "Impact & Outcome", lines: [copy.impact] },
  ];
  return (
    <div className="flex min-h-0 flex-col gap-2.5">
      {cards.map((card) => (
        <article key={card.label} className={`${BENTO_CARD} flex min-h-0 flex-1 flex-col gap-2 rounded-[12px] p-4`}>
          <div className="flex items-center gap-2">
            <card.icon className="size-4 shrink-0 text-zinc-900" strokeWidth={1.75} aria-hidden />
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">{card.label}</span>
          </div>
          <div className="flex flex-col gap-1">
            {card.lines.map((line) => (
              <p key={line} className="text-[13px] leading-5 text-zinc-700">
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