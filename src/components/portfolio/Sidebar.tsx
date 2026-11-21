import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Resume card opened from the profile control.
 * The upper half is frosted glass over a warm glow. The lower half is a
 * solid white folder whose tab swaps the impact notes and the role summary.
 */

const EMAIL = "A.rafaela.aguiar@outlook.com";
const PHONE_LABEL = "07931256050";
const PHONE_HREF = "tel:+447931256050";
const LINKEDIN = "https://www.linkedin.com/";
const RESUME_HREF = "/Ana-Rafaela%20Aguiar%20-%20Product%20Designer%20Resume.pdf";

export const SIDEBAR_PANEL_ID = "profile-sidebar-panel";

const EASE = [0.22, 1, 0.36, 1] as const;

type Role = {
  id: string;
  index: string;
  name: string;
  meta: string;
  summary: ReactNode;
  bullets: ReactNode[];
};

function strong(text: string) {
  return <strong className="font-semibold text-[#141416]">{text}</strong>;
}

const ROLES: Role[] = [
  {
    id: "odicci",
    index: "01",
    name: "Odicci",
    meta: "Aug 2025 – Aug 2026 · Hybrid (Promoted from UX/UI Intern)",
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
    meta: "Dec 2025 – Present · Remote (Part-Time)",
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
    meta: "June 2026 · Milan HQ",
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
    meta: "Oct 2024 – Apr 2025 · Remote",
    summary:
      "Embedded within an Agile product team to design and test user-centred features across desktop and mobile applications.",
    bullets: [
      "Produced wireframes, high-fidelity prototypes, and usability testing syntheses to validate user flows.",
      "Collaborated directly with engineers in sprint planning and technical reviews to align UI solutions with performance and scalability constraints.",
    ],
  },
];

export function Sidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeId, setActiveId] = useState(ROLES[0].id);
  const role = ROLES.find((item) => item.id === activeId) ?? ROLES[0];

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
            className="fixed inset-0 z-[100] cursor-default border-0 bg-zinc-950/40 backdrop-blur-[4px]"
          />

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
            className="fixed top-24 right-4 z-[120] flex max-h-[calc(100dvh-7rem)] w-[min(680px,calc(100vw-2rem))] flex-col overflow-y-auto overscroll-contain rounded-[24px] border border-black/8 bg-white shadow-[0_24px_60px_rgba(20,20,22,0.16)] sm:right-8"
          >
            <div className="relative overflow-hidden rounded-t-[24px]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_12%_0%,#ffe4c4_0%,#f6d7ea_38%,#d9e6f5_72%,#f4f1ea_100%)]"
              />
              <div className="relative bg-white/72 px-5 pt-5 pb-4 backdrop-blur-[20px] sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[36px] leading-[1.2] font-normal tracking-[-0.03em] text-[#141416]">
                    Resume
                  </h2>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[13px] text-[#141416] shadow-sm backdrop-blur-md">
                      <span className="size-[11px] rounded-full bg-[#0fc972]" aria-hidden />
                      available
                    </span>
                    <a
                      href={RESUME_HREF}
                      download="Ana-Rafaela Aguiar - Product Designer Resume.pdf"
                      className="inline-flex h-8 items-center rounded-full border border-black/8 bg-white/80 px-3 text-[12px] font-medium text-[#141416] backdrop-blur-md hover:bg-white"
                    >
                      Download PDF
                    </a>
                    <button
                      type="button"
                      onClick={() => onOpenChange(false)}
                      aria-label="Close resume"
                      className="grid size-8 cursor-pointer place-items-center rounded-full border border-black/8 bg-white/80 text-[#141416] backdrop-blur-md hover:bg-white"
                    >
                      <X className="size-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-[16px] leading-[1.2] font-light text-[#3F3F46]">
                  Key Impact & Scope:
                </p>
                <ul className="mt-3 flex list-disc flex-col gap-3 pl-5">
                  {role.bullets.map((bullet, index) => (
                    <li
                      key={`${role.id}-${index}`}
                      className="text-[16px] leading-[1.35] text-[#3F3F46]"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-end gap-px bg-[#efeae3] px-2 pt-2">
              {ROLES.map((item, index) => {
                const active = item.id === role.id;
                const first = index === 0;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    aria-pressed={active}
                    className={
                      active
                        ? `relative z-10 -mb-px flex min-w-0 flex-1 items-center justify-center gap-2 border border-black/8 border-b-white bg-white px-2 py-2 text-[#141416] ${
                            first ? "rounded-tr-[16px] rounded-tl-none" : "rounded-t-[16px]"
                          }`
                        : "mb-px flex min-w-0 flex-1 items-center justify-center gap-2 rounded-t-[12px] bg-white/45 px-2 py-2 text-[#71717A]"
                    }
                  >
                    <span className="text-[13px] tabular-nums sm:text-[16px]">{item.index}</span>
                    <span className="truncate text-[13px] sm:text-[16px]">{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-white px-5 py-4 sm:px-6">
              <p className="text-[16px] leading-[1.2] text-[#3F3F46]">{role.meta}</p>
              <p className="mt-2 text-[22px] leading-[1.25] tracking-[-0.02em] text-[#141416] sm:text-[24px]">
                {role.summary}
              </p>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-b-[24px] border-t border-black/8 bg-white px-5 py-3 text-[13px] text-[#3F3F46] sm:px-6">
              <p>BA (Hons) Industrial Design & Technology · Loughborough University</p>
              <nav className="flex items-center gap-3" aria-label="Contact">
                <a className="text-[#141416] underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
                  Email
                </a>
                <a
                  className="text-[#141416] underline-offset-2 hover:underline"
                  href={LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a className="text-[#141416] underline-offset-2 hover:underline" href={PHONE_HREF}>
                  {PHONE_LABEL}
                </a>
              </nav>
            </footer>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
