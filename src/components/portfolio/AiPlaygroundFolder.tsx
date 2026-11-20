import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const HUES = ["#E9582C", "#3B29D8", "#0FC950", "#F2B84B"];

/** Folder cover hanging below the accordion. The overlap lives in --pocket-cover. */
const EXTENSION = 110;

/**
 * The three project sheets sit above a solid front pocket.
 * The pocket is the only playground control; the rows stay clickable above it.
 */
export function AiPlaygroundFolder({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="relative z-10">{children}</div>
      <FrontPocket onOpen={() => setOpen(true)} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(86vh,720px)] max-w-[760px] overflow-y-auto border-black/10 bg-[#f7f4ee] sm:rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="text-[22px] font-medium tracking-[-0.4px] text-[#111]">
              Project Playground
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

/** Charcoal cover. Left edge is the high tab; it steps down toward the right. */
function FrontPocket({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label="Open Project Playground"
      className="relative z-20 flex w-full cursor-pointer items-end justify-between border-0 px-6 pb-7 text-left [--pocket-cover:44px] [--pocket-step:16px] max-md:[--pocket-cover:20px] max-md:[--pocket-step:8px] md:px-10"
      style={{
        height: `calc(${EXTENSION}px + var(--pocket-cover))`,
        marginTop: "calc(var(--pocket-cover) * -1)",
        background: "#1C1D21",
        clipPath:
          "polygon(0 0, 30% 0, calc(30% + 52px) var(--pocket-step), 100% var(--pocket-step), 100% 100%, 0 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
        filter: "drop-shadow(0 16px 26px rgba(17,17,17,0.28))",
      }}
    >
      <span className="font-mono text-[13px] tracking-tight text-[#f4efe6]">
        Project Playground
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-white/55" strokeWidth={1.5} aria-hidden />
    </button>
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
