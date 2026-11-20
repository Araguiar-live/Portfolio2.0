import { useRef, useState, type PointerEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const HUES = ["#E9582C", "#3B29D8", "#0FC950", "#F2B84B"];

/**
 * Pocket that sits on the CRCLE row. The accordion itself is untouched;
 * this is a sibling overlay on desktop and a row above the stack on phones.
 */
export function AiPlaygroundFolder() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-4 flex justify-end md:hidden">
        <Pocket onOpen={() => setOpen(true)} />
      </div>
      <div className="pointer-events-auto absolute right-[172px] top-[-74px] z-20 hidden origin-bottom-right rotate-2 md:block">
        <Pocket onOpen={() => setOpen(true)} />
      </div>
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
    </>
  );
}

function Pocket({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="group relative h-[96px] w-[176px]">
      <div className="pointer-events-none absolute inset-x-3 top-1 flex items-end justify-between">
        <span className="block h-12 w-[68px] -rotate-6 rounded-[8px] border border-black/5 bg-white shadow-[0_6px_14px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out group-hover:-translate-y-2.5 group-hover:-rotate-12" />
        <span className="block h-12 w-[68px] rotate-3 rounded-[8px] border border-black/5 bg-white shadow-[0_6px_14px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out group-hover:-translate-y-2.5 group-hover:rotate-12" />
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label="Open Built with AI and Playground"
        className="absolute inset-x-0 bottom-0 h-[78px] cursor-pointer border-0 bg-transparent p-0 text-left"
      >
        <span className="absolute left-0 top-0 h-5 w-16 rounded-t-[10px] border border-b-0 border-black/10 bg-[#efe4cf]" />
        <span className="absolute inset-x-0 bottom-0 flex h-[64px] items-end rounded-[16px] rounded-tl-none border border-black/10 bg-[#f6efe2] px-3 pb-2.5 shadow-[0_10px_22px_rgba(17,17,17,0.08)]">
          <span className="text-[11px] font-medium leading-[14px] tracking-[-0.1px] text-[#3a3428]">
            Built with AI & Playground
          </span>
        </span>
      </button>
    </div>
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
