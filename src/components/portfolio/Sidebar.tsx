import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

/**
 * Studio pinboard for the resume. Four paper cards sit on a felt board.
 * A hardware dock switches between pointing, drawing, and erasing.
 */

const EMAIL = "A.rafaela.aguiar@outlook.com";
const PHONE_LABEL = "07931256050";
const PHONE_HREF = "tel:+447931256050";
const LINKEDIN = "https://www.linkedin.com/";
const RESUME_HREF = "/Ana-Rafaela%20Aguiar%20-%20Product%20Designer%20Resume.pdf";

export const SIDEBAR_PANEL_ID = "profile-sidebar-panel";

const EASE = [0.22, 1, 0.36, 1] as const;
const INK = "#1d3b51";
const CORAL = "#ff5126";
const SKY = "#7ec8e3";
const MINT = "#4eab95";

const PENCIL_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g transform="rotate(-32 16 16)"><rect x="13" y="2" width="6" height="18" rx="1" fill="#f2c14e" stroke="#1d3b51" stroke-width="1"/><rect x="13" y="2" width="6" height="4" fill="#ff5126"/><polygon points="13,20 19,20 16,29" fill="#f7f4ee" stroke="#1d3b51" stroke-width="1"/></g></svg>`,
)}") 6 28, crosshair`;

const ERASER_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g transform="rotate(-18 16 16)"><rect x="6" y="11" width="20" height="12" rx="2" fill="#f4b8c4" stroke="#1d3b51" stroke-width="1"/><rect x="6" y="11" width="7" height="12" rx="2" fill="#7ec8e3"/></g></svg>`,
)}") 8 22, cell`;

type Tool = "pointer" | "pencil" | "eraser";

type Role = {
  id: string;
  index: string;
  name: string;
  meta: string;
  summary: ReactNode;
  bullets: ReactNode[];
};

function strong(text: string) {
  return <strong className="font-bold text-[#1d3b51]">{text}</strong>;
}

const ROLES: Role[] = [
  {
    id: "odicci",
    index: "01",
    name: "Odicci",
    meta: "Product Designer · Aug 2025 – Aug 2026 · Hybrid (Promoted from UX/UI Intern)",
    summary: (
      <>
        Sole product designer across the entire B2B SaaS platform, keeping design delivery{" "}
        {strong("3 months ahead")} of a 2-person engineering team from discovery through developer
        handoff.
      </>
    ),
    bullets: [
      "Redesigned core infrastructure and gamification engines (onboarding, live interactive template libraries, analytics dashboards, API integrations, and conditional prize logic).",
      <>
        Rebuilt SSO flows and added strategic loading cues,{" "}
        {strong("dropping loading-related user complaints to zero")}.
      </>,
      "Engineered a tokenised handoff framework (covering UI primitives, spacing, destinations, and ARIA logic) and pre-publishing validation gates to eliminate deployment and engineering errors.",
    ],
  },
  {
    id: "crcle",
    index: "02",
    name: "CRCLE",
    meta: "Product Designer · Dec 2025 – Present · Remote (Part-Time)",
    summary: (
      <>
        Architected the complete 0-to-1 V1 mobile product from onboarding to engineering handoff in{" "}
        {strong("3 months")}.
      </>
    ),
    bullets: [
      'Designed core social discovery and privacy mechanics, including customizable Bento profile grids, the "Locus" calendar-integrated invitation system, and a real-time Incognito Mode.',
      'Built the "In the Area" live proximity alert framework and the Signal Intercept compatibility vetting drawer.',
      "Delivered high-fidelity interactive prototypes backed by WCAG-compliant design tokens for seamless developer execution.",
    ],
  },
  {
    id: "bending-spoons",
    index: "03",
    name: "Bending Spoons",
    meta: "Product Designer · June 2026 · Milan HQ",
    summary: (
      <>
        Selected as {strong("1 of 20")} rising European product designers out of a multi-stage logic
        and execution screening to build an end-to-end digital product under tight time constraints.
      </>
    ),
    bullets: [
      "Executed rapid JTBD/use-case mapping and high-fidelity UI/UX prototyping on a complex Bending Spoons product brief with 1:1 mentorship from senior design leads.",
      "Pitched fully functional interactive prototypes and product strategy directly to senior product executives and engineering stakeholders.",
    ],
  },
  {
    id: "hybytes",
    index: "04",
    name: "Hybytes",
    meta: "Product Designer · Oct 2024 – Apr 2025 · Remote",
    summary:
      "Embedded within an Agile product team to design and test user-centred features across desktop and mobile applications.",
    bullets: [
      "Produced wireframes, high-fidelity prototypes, and usability testing syntheses to validate user flows.",
      "Collaborated directly with engineers in sprint planning and technical reviews to align UI solutions with performance and scalability constraints.",
    ],
  },
];

const SKILLS = [
  "0→1 product design",
  "Design systems",
  "Interactive prototyping",
  "Accessibility",
  "Developer handoff",
  "JTBD mapping",
];

const TOOLS = ["Figma", "Prototypes", "Design tokens", "WCAG"];

function Pin({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -top-2.5 left-7 z-20 size-[18px] rounded-full"
      style={{
        background: `radial-gradient(circle at 35% 30%, #ffffff 0 18%, ${color} 46%, rgba(0,0,0,0.28) 100%)`,
        boxShadow: "0 1px 0 rgba(255,255,255,0.7) inset, 0 5px 6px rgba(40,30,20,0.32)",
      }}
    />
  );
}

function Paper({
  tilt,
  pin,
  className = "",
  children,
}: {
  tilt: number;
  pin: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={`group relative [rotate:var(--pin-tilt)] select-text rounded-[16px] bg-[#fbfaf6] px-5 py-5 text-[#1d3b51] shadow-[0_12px_20px_rgba(48,36,24,0.12),0_1px_0_rgba(255,255,255,0.9)] transition duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:[rotate:0deg] hover:shadow-[0_18px_28px_rgba(48,36,24,0.16)] ${className}`}
      style={{ ["--pin-tilt" as string]: `${tilt}deg` }}
    >
      <Pin color={pin} />
      {children}
    </article>
  );
}

export function Sidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [tool, setTool] = useState<Tool>("pointer");
  const [copied, setCopied] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    const board = boardRef.current;
    const canvas = canvasRef.current;
    if (!open || !board || !canvas) return;
    const fit = () => {
      const rect = board.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const nextW = Math.max(1, Math.round(rect.width * dpr));
      const nextH = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
      }
      const ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(board);
    return () => observer.disconnect();
  }, [open]);

  const point = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const stroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    const from = last.current;
    if (!ctx || !from) return;
    const to = point(event);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = tool === "eraser" ? 26 : 2.2;
    ctx.strokeStyle = "rgba(29, 59, 81, 0.82)";
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    last.current = to;
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const clearDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            key="sidebar-backdrop"
            aria-label="Dismiss profile menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[100] cursor-default border-0 bg-white/40 backdrop-blur-[16px]"
          />

          <div className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5">
            <motion.aside
              key="sidebar-panel"
              id={SIDEBAR_PANEL_ID}
              role="dialog"
              aria-modal="true"
              aria-label="Resume"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="pointer-events-auto relative flex h-[min(860px,calc(100dvh-1.5rem))] w-[min(1080px,96vw)] flex-col overflow-hidden rounded-[28px] border border-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-14px_28px_rgba(90,70,48,0.08),0_28px_70px_rgba(29,59,81,0.16)]"
              style={{
                backgroundColor: "#efe8dc",
                backgroundImage:
                  "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.55), transparent 42%), radial-gradient(rgba(90,70,48,0.08) 0.6px, transparent 0.7px)",
                backgroundSize: "auto, 7px 7px",
              }}
            >
              <div ref={boardRef} className="relative min-h-0 flex-1">
                <div className="h-full overflow-y-auto overscroll-contain px-4 pt-6 pb-6 sm:px-8 sm:pt-8">
                  <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-7">
                    <Paper tilt={-1.2} pin={CORAL} className="md:col-span-2">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] tracking-[0.16em] text-[#1d3b51]/60 uppercase">
                            Resume
                          </p>
                          <h2 className="mt-1 text-[28px] leading-none font-semibold text-[#1d3b51]">
                            Ana Rafaela Aguiar
                          </h2>
                          <p className="mt-2 max-w-[46ch] text-[15px] leading-[1.5] text-[#1d3b51]">
                            Multidisciplinary, self-sufficient designer. I build complex B2B
                            platforms, design systems, and code-backed prototypes from zero to one.
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#cfe8d4] bg-[#f4fff7] px-3 py-1.5 text-[12px] text-[#1d3b51]">
                          <span
                            className="size-2 rounded-full bg-[#0fc972]"
                            style={{ boxShadow: "0 0 8px #0fc972" }}
                            aria-hidden
                          />
                          Available
                        </span>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <a
                          href={RESUME_HREF}
                          download="Ana-Rafaela Aguiar - Product Designer Resume.pdf"
                          className="inline-flex h-9 items-center rounded-full border border-[#d9d1c4] bg-[#f7f3ea] px-4 text-[12px] font-medium text-[#1d3b51] shadow-[inset_0_1px_0_#fff,0_2px_0_#c9c0b2]"
                        >
                          Download PDF
                        </a>
                        <button
                          type="button"
                          onClick={copyEmail}
                          className="inline-flex h-9 cursor-pointer items-center rounded-full border border-[#d9d1c4] bg-[#f7f3ea] px-4 text-[12px] font-medium text-[#1d3b51] shadow-[inset_0_1px_0_#fff,0_2px_0_#c9c0b2]"
                        >
                          {copied ? "Copied" : "Copy Email"}
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenChange(false)}
                          aria-label="Close resume"
                          className="ml-auto grid size-9 cursor-pointer place-items-center rounded-full border border-[#d9d1c4] bg-[#f7f3ea] text-[16px] text-[#1d3b51] shadow-[inset_0_1px_0_#fff,0_2px_0_#c9c0b2]"
                        >
                          ×
                        </button>
                      </div>
                    </Paper>

                    <Paper tilt={1.1} pin={SKY} className="md:col-span-2">
                      <p className="text-[11px] tracking-[0.16em] text-[#1d3b51]/55 uppercase">
                        Experience
                      </p>
                      <div className="mt-3 flex flex-col gap-3">
                        {ROLES.map((role, index) => (
                          <div
                            key={role.id}
                            className="rounded-[12px] border border-[#ece6db] bg-white px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.8)]"
                            style={{ marginLeft: index % 2 === 0 ? 0 : 10 }}
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <h3 className="text-[16px] font-semibold text-[#1d3b51]">
                                {role.index} {role.name}
                              </h3>
                            </div>
                            <p className="mt-1 text-[12px] leading-[1.4] text-[#1d3b51]/65">
                              {role.meta}
                            </p>
                            <p className="mt-2 text-[14px] leading-[1.5] text-[#1d3b51]">
                              {role.summary}
                            </p>
                            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[13px] leading-[1.5] text-[#24384a]">
                              {role.bullets.map((bullet, bulletIndex) => (
                                <li key={`${role.id}-${bulletIndex}`}>{bullet}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </Paper>

                    <Paper tilt={-0.8} pin={MINT}>
                      <p className="text-[11px] tracking-[0.16em] text-[#1d3b51]/55 uppercase">
                        Core skills
                      </p>
                      <div
                        className="mt-3 grid grid-cols-2 gap-2 rounded-[10px] p-3"
                        style={{
                          backgroundImage:
                            "linear-gradient(#efe8dc 1px, transparent 1px), radial-gradient(circle, #c9bfb0 1.1px, transparent 1.2px)",
                          backgroundSize: "100% 28px, 14px 14px",
                          backgroundPosition: "0 10px, 4px 0",
                        }}
                      >
                        {SKILLS.map((skill) => (
                          <span key={skill} className="text-[13px] leading-7 text-[#1d3b51]">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-[11px] tracking-[0.14em] text-[#1d3b51]/55 uppercase">
                        Tools
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {TOOLS.map((toolName) => (
                          <span
                            key={toolName}
                            className="rounded-full border border-[#e4dccf] bg-[#f7f3ea] px-2.5 py-1 text-[12px] text-[#1d3b51]"
                          >
                            {toolName}
                          </span>
                        ))}
                      </div>
                    </Paper>

                    <Paper tilt={1.4} pin={CORAL}>
                      <p className="text-[11px] tracking-[0.16em] text-[#1d3b51]/55 uppercase">
                        Education
                      </p>
                      <div className="relative mt-3 rounded-[12px] border border-dashed border-[#d5cbbd] bg-[#fffdf8] px-4 py-4">
                        <span
                          aria-hidden
                          className="absolute top-3 right-3 size-3 rounded-full border border-[#d5cbbd] bg-[#efe8dc]"
                        />
                        <p className="pr-6 text-[15px] leading-[1.45] font-semibold text-[#1d3b51]">
                          BA (Hons) Industrial Design & Technology
                        </p>
                        <p className="mt-1 text-[13px] text-[#1d3b51]/70">Loughborough University</p>
                        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px]" aria-label="Contact">
                          <a className="underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
                            Email
                          </a>
                          <a className="underline-offset-2 hover:underline" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                          </a>
                          <a className="underline-offset-2 hover:underline" href={PHONE_HREF}>
                            {PHONE_LABEL}
                          </a>
                        </nav>
                      </div>
                    </Paper>
                  </div>
                </div>

                <canvas
                  ref={canvasRef}
                  aria-hidden={tool === "pointer"}
                  className="absolute inset-0 z-30 h-full w-full touch-none"
                  style={{
                    pointerEvents: tool === "pointer" ? "none" : "auto",
                    cursor: tool === "pencil" ? PENCIL_CURSOR : tool === "eraser" ? ERASER_CURSOR : "auto",
                  }}
                  onPointerDown={(event) => {
                    if (tool === "pointer") return;
                    drawing.current = true;
                    last.current = point(event);
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }}
                  onPointerMove={(event) => {
                    if (!drawing.current || tool === "pointer") return;
                    stroke(event);
                  }}
                  onPointerUp={() => {
                    drawing.current = false;
                    last.current = null;
                  }}
                  onPointerCancel={() => {
                    drawing.current = false;
                    last.current = null;
                  }}
                />
              </div>

              <div className="flex justify-center px-4 pt-1 pb-4">
                <div
                  className="flex items-center gap-1 rounded-full border border-white/80 bg-[#f7f3ea]/95 px-2 py-2 shadow-[0_12px_24px_rgba(29,59,81,0.16),inset_0_1px_0_#fff]"
                  role="toolbar"
                  aria-label="Drawing tools"
                >
                  {(
                    [
                      ["pointer", "Pointer"],
                      ["pencil", "Pencil"],
                      ["eraser", "Eraser"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={tool === id}
                      onClick={() => setTool(id)}
                      className={
                        tool === id
                          ? "h-8 cursor-pointer rounded-full bg-[#1d3b51] px-3 text-[12px] text-white"
                          : "h-8 cursor-pointer rounded-full px-3 text-[12px] text-[#1d3b51]"
                      }
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearDrawing}
                    className="h-8 cursor-pointer rounded-full px-3 text-[12px] text-[#ff5126]"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
