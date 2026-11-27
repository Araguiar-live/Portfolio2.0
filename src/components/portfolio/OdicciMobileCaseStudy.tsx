import { Suspense, type ReactNode } from "react";
import {
  CrcleCaseStudyChromeProvider,
} from "@/components/portfolio/CrcleCaseStudyChrome";
import { MobileWorkDevInspectProvider } from "@/components/portfolio/MobileWorkDevInspect";
import { OdicciMobileLayoutProvider } from "@/components/portfolio/OdicciMobileLayout";
import specPen from "@/assets/crcle/spec/pen.svg";
import specPuzzle from "@/assets/crcle/spec/puzzle.svg";
import specSun from "@/assets/crcle/spec/sun.svg";
import specTarget from "@/assets/crcle/spec/target.svg";

export type OdicciMobileCopy = {
  eyebrow: string;
  headline: string;
  narrative: string;
  role: string;
  problems: string[];
  shipped: string[];
  impact: string;
};

const mobileBlock =
  "relative overflow-hidden rounded-[20px] border border-[#F4F4F5] bg-white shadow-[0_10px_20px_rgba(11,14,20,0.12)]";

function MobileEditorialSpecs({ copy }: { copy: OdicciMobileCopy }) {
  const rows: Array<{ label: string; icon: string; lines: string[] }> = [
    { label: "Role & Scope", icon: specPen, lines: [copy.role] },
    { label: "Problems Solved", icon: specTarget, lines: copy.problems },
    { label: "What I Shipped", icon: specPuzzle, lines: copy.shipped },
    { label: "Impact & Outcome", icon: specSun, lines: [copy.impact] },
  ];
  return (
    <div className="flex min-h-0 flex-col gap-3">
      {rows.map((row) => (
        <article key={row.label} className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-3.5 shrink-0">
              <img
                src={row.icon}
                alt=""
                width={14}
                height={14}
                className="size-3.5 max-w-none opacity-80 brightness-0 invert"
              />
            </span>
            <span className="text-[11px] font-normal text-zinc-400">{row.label}</span>
          </div>
          <div className="flex flex-col gap-0.5 pl-5">
            {row.lines.map((line) => (
              <p key={line} className="text-[12px] leading-[1.4] text-zinc-100">
                {line}
              </p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

/** Mobile ODICCI — title card, landscape preview, demo rail, specs (Figma 3149:13181). */
type TabHelpers = {
  onNextTab: () => void;
  onPrevTab: () => void;
  goToTab: (tab: string) => void;
};

function OdicciMobileCaseStudyBody({
  copy,
  body,
}: {
  copy: OdicciMobileCopy;
  body: ReactNode;
}) {
  return (
    <OdicciMobileLayoutProvider>
      <CrcleCaseStudyChromeProvider>
        <div className="odicci-mobile-case-study flex w-full min-w-0 max-w-full flex-col gap-2 overflow-x-hidden">
          <section className={`${mobileBlock} odicci-mobile-intro-card px-5 py-5`}>
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400">
              {copy.eyebrow}
            </span>
            <h3 className="mt-2 text-[22px] font-medium leading-[1.2] tracking-[-0.02em] text-[#111111]">
              {copy.headline}
            </h3>
            {copy.narrative ? (
              <p className="mt-3 text-[12px] leading-[1.5] text-zinc-600">{copy.narrative}</p>
            ) : null}
          </section>

          <div className="odicci-mobile-prototype-host w-full min-w-0 max-w-full">
            <Suspense fallback={<div className="h-[min(220px,42vw)] w-full rounded-[14px] bg-zinc-100" />}>
              {body ?? <div className="h-48 w-full rounded-[14px] bg-zinc-100" />}
            </Suspense>
          </div>

          <section className="odicci-mobile-specs-card relative overflow-hidden rounded-[20px] border border-zinc-800/70 bg-[#0b0e14] px-5 py-3 shadow-[0_10px_20px_rgba(0,0,0,0.28)]">
            <MobileEditorialSpecs copy={copy} />
          </section>
        </div>
      </CrcleCaseStudyChromeProvider>
    </OdicciMobileLayoutProvider>
  );
}

export function OdicciMobileCaseStudy({
  copy,
  tabContent,
  tabHelpers,
}: {
  copy: OdicciMobileCopy;
  tabContent: {
    customBody?: ReactNode | ((helpers: TabHelpers) => ReactNode);
  };
  tabHelpers: TabHelpers;
}) {
  const body =
    typeof tabContent.customBody === "function"
      ? tabContent.customBody(tabHelpers)
      : tabContent.customBody;

  return (
    <MobileWorkDevInspectProvider>
      <OdicciMobileCaseStudyBody copy={copy} body={body} />
    </MobileWorkDevInspectProvider>
  );
}