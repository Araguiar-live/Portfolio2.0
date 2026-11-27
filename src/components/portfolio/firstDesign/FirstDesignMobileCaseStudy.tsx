import { FirstDesignMobileShowcase } from "@/components/portfolio/firstDesign/FirstDesignMobileShowcase";
import type { CrcleMobileCopy } from "@/components/portfolio/CrcleMobileCaseStudy";
import specPen from "@/assets/crcle/spec/pen.svg";
import specPuzzle from "@/assets/crcle/spec/puzzle.svg";
import specSun from "@/assets/crcle/spec/sun.svg";
import specTarget from "@/assets/crcle/spec/target.svg";
import bendingSpoonsMark from "@/assets/bending-spoons-mark.svg";

const mobileBlock =
  "relative overflow-hidden rounded-[20px] border border-[#F4F4F5] bg-white shadow-[0_10px_20px_rgba(11,14,20,0.12)]";

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

/** Mobile Productive case study — Figma 3169:14429. */
export function FirstDesignMobileCaseStudy({
  copy,
  tabLabel,
}: {
  copy: CrcleMobileCopy;
  tabLabel: string;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <div className="flex w-full items-center justify-center gap-1.5">
        <span className="inline-flex shrink-0 items-center justify-center rounded-full border border-black bg-black px-4 py-2 text-center text-[11px] font-medium tracking-tight text-white">
          {tabLabel}
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-zinc-200/80 bg-white shadow-[0_10px_20px_rgba(11,14,20,0.12)]">
          <img src={bendingSpoonsMark} alt="" className="h-[14px] w-auto max-w-[28px] object-contain" />
        </span>
      </div>

      <section className={`${mobileBlock} px-5 py-5`}>
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400">{copy.eyebrow}</span>
        <h3 className="mt-2 text-[22px] font-medium leading-[1.2] tracking-[-0.02em] text-[#111111]">
          {copy.headline}
        </h3>
        <p className="mt-3 text-[12px] leading-[1.55] text-zinc-600">{copy.narrative}</p>
      </section>

      <FirstDesignMobileShowcase />

      <section className="relative overflow-hidden rounded-[20px] border border-zinc-800/70 bg-[#0b0e14] px-5 py-3 shadow-[0_10px_20px_rgba(0,0,0,0.28)]">
        <MobileEditorialSpecs copy={copy} dark />
      </section>
    </div>
  );
}