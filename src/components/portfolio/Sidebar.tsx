import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import cvHeader from "@/assets/resume/cv-header.png";

/**
 * Centered resume modal. A white sheet, a pill switcher for the four roles,
 * and the impact notes for the role that is selected.
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
  return <strong className="font-bold text-[#111113]">{text}</strong>;
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
            className="fixed inset-0 z-[100] cursor-default border-0 bg-white/75 backdrop-blur-[16px]"
          />

          <div className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center p-4">
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
              className="pointer-events-auto max-h-[calc(100dvh-2rem)] w-[92vw] max-w-[720px] overflow-y-auto overscroll-contain rounded-[24px] border border-black/8 bg-white px-9 py-8 shadow-[0_24px_80px_rgba(17,17,19,0.08)]"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[24px] font-semibold text-[#111113]">Resume</h2>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F4F5] px-3 py-1.5 text-[12px] text-[#111113]">
                    <span className="size-1.5 rounded-full bg-[#0fc972]" aria-hidden />
                    Available
                  </span>
                  <a
                    href={RESUME_HREF}
                    download="Ana-Rafaela Aguiar - Product Designer Resume.pdf"
                    className="inline-flex h-8 items-center rounded-full border border-black/8 bg-white px-3 text-[12px] font-medium text-[#111113] hover:bg-[#F4F4F5]"
                  >
                    Download PDF
                  </a>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    aria-label="Close resume"
                    className="grid size-8 cursor-pointer place-items-center rounded-full text-[#111113] hover:bg-[#F4F4F5]"
                  >
                    <X className="size-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-1 overflow-x-auto rounded-[12px] bg-[#F4F4F5] p-1">
                {ROLES.map((item) => {
                  const active = item.id === role.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      aria-pressed={active}
                      className={
                        active
                          ? "relative min-w-max flex-1 cursor-pointer overflow-hidden rounded-[8px] px-3 py-2 text-center text-[13px] whitespace-nowrap text-white"
                          : "min-w-max flex-1 cursor-pointer rounded-[8px] px-3 py-2 text-center text-[13px] whitespace-nowrap text-[#71717A]"
                      }
                    >
                      {active ? (
                        <img
                          src={cvHeader}
                          alt=""
                          className="pointer-events-none absolute inset-0 size-full object-cover"
                        />
                      ) : null}
                      <span className="relative">{item.index} {item.name}</span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-6 text-[13px] leading-[1.4] text-[#71717A]">{role.meta}</p>
              <p className="mt-2 text-[16px] leading-[1.5] text-[#111113]">{role.summary}</p>

              <ul className="mt-6 flex list-disc flex-col gap-3 border-t border-[#F0F0F2] pt-6 pl-5 text-[14px] leading-[1.6] text-[#3F3F46]">
                {role.bullets.map((bullet, index) => (
                  <li key={`${role.id}-${index}`}>{bullet}</li>
                ))}
              </ul>

              <footer className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#F0F0F2] pt-4">
                <p className="text-[12px] text-[#71717A]">
                  BA (Hons) Industrial Design & Technology · Loughborough University
                </p>
                <nav className="flex items-center gap-4" aria-label="Contact">
                  <a className="text-[12px] text-[#111113] underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
                    Email
                  </a>
                  <a
                    className="text-[12px] text-[#111113] underline-offset-2 hover:underline"
                    href={LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                  <a className="text-[12px] text-[#111113] underline-offset-2 hover:underline" href={PHONE_HREF}>
                    {PHONE_LABEL}
                  </a>
                </nav>
              </footer>
            </motion.aside>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
