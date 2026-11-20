import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const HUES = ["#E9582C", "#3B29D8", "#0FC950", "#F2B84B"];

/** Manila back of the sleeve. A touch warmer than the white project sheets. */
const JACKET = "#f3e9d6";
/** Front lip, slightly deeper so it reads in front of the sheets. */
const LIP = "#e7dcc6";

/**
 * Full-width folder sleeve around the project accordion.
 * The jacket and lip are visual only; the tab is the one click target.
 */
export function AiPlaygroundFolder({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-x-3 top-3 bottom-0 z-0">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="Open Built with AI and Playground"
          className="pointer-events-auto absolute -top-7 right-3 z-20 flex h-7 cursor-pointer items-center rounded-t-[12px] border border-b-0 border-black/10 bg-[#f3e9d6] px-3 text-[11px] font-medium tracking-[-0.1px] text-[#3a3428] md:right-[168px]"
        >
          Built with AI & Playground
          <span className="absolute inset-x-0 -bottom-px h-px bg-[#f3e9d6]" />
        </button>
        <div
          className="h-full w-full rounded-[22px] border border-black/10"
          style={{ background: JACKET }}
        />
      </div>

      <div className="relative z-10">{children}</div>

      <FrontLip />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(86vh,720px)] max-w-[760px] overflow-y-auto border-black/10 bg-[#f7f4ee] sm:rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="text-[22px] font-medium tracking-[-0.4px] text-[#111]">
              Built with AI & Playground
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#76767a]">
              Three small experiments. Nothing here calls a server — they play in the browser.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-3">
            <WordSpark />
            <HueGlass />
            <ChaseDot />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Front pocket along the bottom of the last sheet. Clicks pass through to Odicci. */
function FrontLip() {
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-x-3 bottom-0 z-20 h-8">
      <div className="absolute inset-x-0 -top-3 h-3 bg-gradient-to-b from-transparent to-black/[0.06]" />
      <div className="absolute inset-x-0 bottom-0 flex h-8 items-stretch overflow-hidden rounded-b-[20px] shadow-[0_-8px_16px_rgba(17,17,17,0.06)]">
        <LipNotch side="left" />
        <div className="h-full flex-1" style={{ background: LIP }} />
        <LipNotch side="right" />
      </div>
    </div>
  );
}

function LipNotch({ side }: { side: "left" | "right" }) {
  const d =
    side === "left"
      ? "M0 32 V14 Q0 8 8 8 Q16 8 16 0 H40 V32 Z"
      : "M40 32 V14 Q40 8 32 8 Q24 8 24 0 H0 V32 Z";

  return (
    <svg width="40" height="32" viewBox="0 0 40 32" className="block h-8 w-10 shrink-0">
      <path d={d} fill={LIP} />
    </svg>
  );
}

function WordSpark() {
  const [value, setValue] = useState("play");
  const [popped, setPopped] = useState<number | null>(null);
  const letters = (value.trim() || "play").slice(0, 16).split("");

  return (
    <section className="flex min-h-[210px] flex-col gap-3 rounded-[16px] border border-black/8 bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#76767a]">
        Letter pop
      </p>
      <input
        value={value}
        onChange={(event) => {
          setPopped(null);
          setValue(event.target.value);
        }}
        aria-label="Word to scatter"
        className="h-8 rounded-[8px] border border-black/10 px-2 text-[13px] text-[#111] outline-none focus:border-[#3B29D8]"
      />
      <div className="flex flex-1 flex-wrap content-center gap-1">
        {letters.map((letter, index) => (
          <button
            key={`${letter}-${index}`}
            type="button"
            onClick={() => setPopped(index)}
            className="grid h-7 min-w-7 cursor-pointer place-items-center rounded-[8px] border border-black/5 bg-[#f7f4ee] text-[14px] text-[#111] transition-transform duration-200"
            style={{
              transform:
                popped === index
                  ? "translateY(-10px) rotate(-8deg) scale(1.15)"
                  : `translateY(${Math.sin(index) * 4}px)`,
            }}
          >
            {letter}
          </button>
        ))}
      </div>
    </section>
  );
}

function HueGlass() {
  const [hue, setHue] = useState(HUES[0]);

  return (
    <section className="flex min-h-[210px] flex-col gap-3 rounded-[16px] border border-black/8 bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#76767a]">
        Glass tint
      </p>
      <div
        className="grid flex-1 place-items-center rounded-[14px] border border-white/70 text-[13px] font-medium text-white shadow-inner"
        style={{ background: `linear-gradient(160deg, ${hue}cc, #111111)` }}
      >
        {hue}
      </div>
      <div className="flex gap-1.5">
        {HUES.map((swatch) => (
          <button
            key={swatch}
            type="button"
            aria-label={`Tint ${swatch}`}
            onClick={() => setHue(swatch)}
            className="h-6 flex-1 cursor-pointer rounded-full border border-black/10"
            style={{
              background: swatch,
              outline: hue === swatch ? "2px solid #111" : "none",
              outlineOffset: 1,
            }}
          />
        ))}
      </div>
    </section>
  );
}

function ChaseDot() {
  const field = useRef<HTMLDivElement>(null);
  const [point, setPoint] = useState({ x: 50, y: 50 });

  const follow = (event: PointerEvent<HTMLDivElement>) => {
    const rect = field.current?.getBoundingClientRect();
    if (!rect) return;
    setPoint({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section className="flex min-h-[210px] flex-col gap-3 rounded-[16px] border border-black/8 bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#76767a]">Chase</p>
      <div
        ref={field}
        onPointerMove={follow}
        className="relative flex-1 cursor-crosshair overflow-hidden rounded-[14px] bg-[#f3f4f6]"
      >
        <span
          className="absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3B29D8] shadow-[0_8px_16px_rgba(59,41,216,0.35)] transition-all duration-200 ease-out"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        />
      </div>
    </section>
  );
}
