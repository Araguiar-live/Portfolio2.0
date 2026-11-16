import { AnimatePresence, motion, type MotionValue } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import { createPortal } from "react-dom";
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
}

/** Trapezoid file-tab that stays a fixed size while the row body grows. */
function folderPoints(width: number, height: number, index: number): Array<[number, number]> {
  const narrow = width < 768;
  // Slope is long enough for an 8px fillet at both ends of the tab.
  const tabH = narrow ? 26 : 30;
  const tabW = narrow ? 96 : 176;
  const slope = narrow ? 16 : 36;
  const stagger = narrow ? 22 : 64;
  const minX = narrow ? 14 : 36;
  const x = Math.min(minX + index * stagger, Math.max(minX, width - tabW - slope * 2 - 16));
  const top = 0.5;
  const lip = tabH;
  return [
    [0, lip],
    [x, lip],
    [x + slope, top],
    [x + slope + tabW, top],
    [x + slope + tabW + slope, lip],
    [width, lip],
    [width, height],
    [0, height],
  ];
}

/** Pick the arc that cuts the sharp corner off, rather than bowing out past it. */
function filletSweep(
  from: [number, number],
  to: [number, number],
  corner: [number, number],
  radius: number,
): 0 | 1 {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const chord = Math.hypot(dx, dy) || 1;
  const height = Math.sqrt(Math.max(0, radius * radius - (chord / 2) ** 2));
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2;
  const px = -dy / chord;
  const py = dx / chord;
  const closer = (sweep: 0 | 1) => {
    const cx = midX + (sweep ? 1 : -1) * height * px;
    const cy = midY + (sweep ? 1 : -1) * height * py;
    const vx = midX - cx;
    const vy = midY - cy;
    const vl = Math.hypot(vx, vy) || 1;
    const ax = cx + (vx / vl) * radius;
    const ay = cy + (vy / vl) * radius;
    return (ax - corner[0]) ** 2 + (ay - corner[1]) ** 2;
  };
  return closer(1) < closer(0) ? 1 : 0;
}

/** 8px circular fillet on every corner of the folder outline. */
function roundedFolderPath(points: Array<[number, number]>, radius = 8): string {
  const n = points.length;
  const corners: Array<{
    v1x: number;
    v1y: number;
    v2x: number;
    v2y: number;
    len1: number;
    tangent: number;
    offset: number;
    curr: [number, number];
  }> = [];
  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];
    let v1x = curr[0] - prev[0];
    let v1y = curr[1] - prev[1];
    let v2x = next[0] - curr[0];
    let v2y = next[1] - curr[1];
    const len1 = Math.hypot(v1x, v1y) || 1;
    const len2 = Math.hypot(v2x, v2y) || 1;
    v1x /= len1;
    v1y /= len1;
    v2x /= len2;
    v2y /= len2;
    const cross = v1x * v2y - v1y * v2x;
    const dot = Math.min(1, Math.max(-1, v1x * v2x + v1y * v2y));
    const turn = Math.abs(Math.atan2(cross, dot));
    const tangent = Math.tan(turn / 2);
    const offset = tangent > 0.001 ? radius / tangent : 0;
    corners.push({ v1x, v1y, v2x, v2y, len1, tangent, offset, curr });
  }
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < n; i++) {
      const edge = corners[(i + 1) % n].len1;
      const used = corners[i].offset + corners[(i + 1) % n].offset;
      if (used > edge - 0.5) {
        const scale = (edge - 0.5) / used;
        corners[i].offset *= scale;
        corners[(i + 1) % n].offset *= scale;
      }
    }
  }
  for (let i = 0; i < n; i++) {
    const { v1x, v1y, v2x, v2y, tangent, offset, curr } = corners[i];
    const arc = tangent > 0.001 ? offset * tangent : 0;
    const x1 = curr[0] - v1x * offset;
    const y1 = curr[1] - v1y * offset;
    const x2 = curr[0] + v2x * offset;
    const y2 = curr[1] + v2y * offset;
    d += i === 0 ? `M ${x1} ${y1}` : ` L ${x1} ${y1}`;
    if (arc > 0.2) {
      const sweep = filletSweep([x1, y1], [x2, y2], curr, arc);
      d += ` A ${arc} ${arc} 0 0 ${sweep} ${x2} ${y2}`;
    } else d += ` L ${x2} ${y2}`;
  }
  return `${d} Z`;
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
  { project, isOpen, onToggle, index },
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

  const shapeRef = useRef<HTMLDivElement>(null);
  const [clipPath, setClipPath] = useState("none");
  const [outline, setOutline] = useState("");

  useLayoutEffect(() => {
    const el = shapeRef.current;
    if (!el) return;
    const measure = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (width < 1 || height < 1) return;
      const points = folderPoints(width, height, index);
      const path = roundedFolderPath(points);
      el.parentElement?.style.setProperty("--folder-tab", `${points[0][1]}px`);
      setClipPath(`url(#folder-clip-${project.slug})`);
      setOutline(path);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, isOpen, project.slug]);

  return (
    <div
      ref={ref}
      className="pointer-events-none relative"
      style={{
        zIndex: index + 1,
        marginTop: index === 0 ? 0 : "calc(-1 * var(--folder-tab, 22px))",
      }}
    >
      <div
        ref={shapeRef}
        className="portfolio-mobile-shake-root spatial-glass pointer-events-auto relative py-[9px] max-md:py-[7px]"
        style={{
          clipPath,
          backgroundColor: "rgba(255,255,255,0.805)",
          WebkitBackdropFilter: "blur(23px) saturate(180%)",
          backdropFilter: "blur(23px) saturate(180%)",
        }}
      >
      {/* Row header — Figma 530:151817 */}
      <div
        className="group relative flex w-full items-center justify-between gap-7 px-[37px] py-8 text-left transition-[background] duration-300 max-md:flex-col max-md:items-stretch max-md:gap-[15px] max-md:px-5 max-md:py-5 max-sm:gap-[15px] max-sm:p-5"
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
          <span className="shrink-0 text-[16px] font-medium tracking-[1px] text-[#111]/70 tabular-nums max-md:text-[10px] max-md:font-normal max-md:tracking-normal max-md:text-[#a3a3a6] max-sm:text-[10px]">
            {project.id}
          </span>
          <span className="flex min-w-0 items-center gap-2 max-md:gap-1.5">
            <span className="truncate text-[24px] font-normal tracking-[-0.5px] text-[#111] max-md:text-[24px] max-md:leading-[29px] max-md:tracking-normal max-sm:text-[24px] max-sm:leading-[29px] sm:text-[37px]">
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
        <div className="relative z-10 flex shrink-0 items-center justify-end gap-[18px] text-[16px] text-[#111]/70 pointer-events-none max-md:gap-2 max-md:text-[10px] max-md:text-[#76767a] max-sm:gap-2 max-sm:text-[10px]">
          <span className="text-right max-md:flex-1 max-md:text-left max-md:leading-4 max-sm:flex-1 max-sm:text-left max-sm:leading-4">
            {project.role}
          </span>
          <span className="font-light text-[#111]/70 max-sm:font-normal max-sm:text-[#999]">|</span>
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

              {/* Copy and prototype sit side by side at 1:2 */}
              <div className="mx-auto flex min-h-0 w-full flex-1 items-start overflow-visible px-4 pt-2 sm:px-8 lg:px-12 xl:px-[68px]">
                  <div className="grid w-full min-w-0 grid-cols-1 items-start gap-8 overflow-x-clip lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-8">
                    <div className="flex max-h-[874px] min-h-0 min-w-0 flex-col overflow-x-hidden overflow-y-auto overscroll-contain">
                      <CaseStudyCopy project={project} tab={activeTab} content={tabContent} />
                    </div>

                    <div className="relative flex w-full min-w-0 items-start justify-end overflow-visible">
                      <div className="ml-auto flex w-full min-w-0 max-w-full items-start justify-end overflow-visible">
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
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible"
        >
          <clipPath id={`folder-clip-${project.slug}`} clipPathUnits="userSpaceOnUse">
            <path d={outline} />
          </clipPath>
          <path
            d={outline}
            fill="none"
            stroke="#d1d5db"
            strokeWidth="1"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : null}
    </div>
  );
});

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