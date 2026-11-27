import { CrcleCaseStudyChromeProvider } from "@/components/portfolio/CrcleCaseStudyChrome";
import { MobileWorkDevInspectProvider } from "@/components/portfolio/MobileWorkDevInspect";
import { useCaseStudyDevInspect } from "@/components/portfolio/useCaseStudyDevInspect";
import { CrcleMobilePrototype } from "@/components/portfolio/CrcleMobilePrototype";
import specPen from "@/assets/crcle/spec/pen.svg";
import specPuzzle from "@/assets/crcle/spec/puzzle.svg";
import specSun from "@/assets/crcle/spec/sun.svg";
import specTarget from "@/assets/crcle/spec/target.svg";

export type CrcleMobileCopy = {
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

/** Side narrative — ~20% white fill so the grid reads through (~80% frost). */
const mobileNarrativeSide =
  "relative overflow-hidden rounded-[20px] border border-white/60 bg-white/20 shadow-[0_10px_20px_rgba(11,14,20,0.08)] backdrop-blur-xl backdrop-saturate-[1.35] supports-[backdrop-filter]:bg-white/[0.12]";

function MobileEditorialSpecs({ copy, dark = false }: { copy: CrcleMobileCopy; dark?: boolean }) {
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
                className={`size-3.5 max-w-none ${dark ? "opacity-80 brightness-0 invert" : ""}`}
              />
            </span>
            <span
              className={`text-[11px] font-normal ${dark ? "text-zinc-400" : "text-[#737373]"}`}
            >
              {row.label}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 pl-5">
            {row.lines.map((line) => (
              <p
                key={line}
                className={`text-[12px] leading-[1.4] ${dark ? "text-zinc-100" : "text-[#111111]"}`}
              >
                {line}
              </p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function MobilePrototypeFrame({ activeTab }: { activeTab: string }) {
  const { prototypeDevHover } = useCaseStudyDevInspect();

  return (
    <section
      {...prototypeDevHover}
      className={`${mobileBlock} crcle-mobile-prototype-preview crcle-phone-stage flex w-full max-w-full shrink-0 cursor-default flex-col items-stretch justify-start overflow-x-hidden overflow-y-hidden`}
    >
      <CrcleMobilePrototype activeTab={activeTab} />
    </section>
  );
}

/** Mobile CRCLE case study — title, static demo, side copy, overview (Figma 3127:10211). */
export function CrcleMobileCaseStudy({
  copy,
  activeTab,
}: {
  copy: CrcleMobileCopy;
  activeTab: string;
}) {
  return (
    <MobileWorkDevInspectProvider>
      <div className="crcle-mobile-case-study flex w-full min-w-0 flex-col gap-2">
        <section className={`${mobileBlock} crcle-mobile-intro-card px-5 py-5`}>
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400">{copy.eyebrow}</span>
          <h3 className="mt-2 text-[22px] font-medium leading-[1.2] tracking-[-0.02em] text-[#111111]">{copy.headline}</h3>
        </section>

        <div className="flex min-w-0 items-start gap-2">
          <div className="crcle-mobile-prototype-host min-w-0 w-[60%] max-w-[60%] shrink-0 basis-[60%]">
            <CrcleCaseStudyChromeProvider>
              <MobilePrototypeFrame activeTab={activeTab} />
            </CrcleCaseStudyChromeProvider>
          </div>
          <section
            className={`${mobileNarrativeSide} crcle-mobile-narrative-side min-w-0 flex-1 self-start px-3.5 py-3`}
          >
            <p className="text-[12px] leading-[1.5] text-zinc-700">{copy.narrative}</p>
          </section>
        </div>

        <section className="crcle-mobile-specs-card relative overflow-hidden rounded-[20px] border border-zinc-800/70 bg-[#0b0e14] px-5 py-3 shadow-[0_10px_20px_rgba(0,0,0,0.28)]">
          <MobileEditorialSpecs copy={copy} dark />
        </section>
      </div>
    </MobileWorkDevInspectProvider>
  );
}