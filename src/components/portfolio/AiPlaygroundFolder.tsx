import { ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const HUES = ["#E9582C", "#3B29D8", "#0FC950", "#F2B84B"];

const BACK = "#343740";
const FRONT = "#1C1D21";

/**
 * The three project sheets sit inside a jacket. The front pocket is the only
 * playground control; the rows stay clickable above it.
 */
export function AiPlaygroundFolder({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="ai-playground-folder relative [--pocket-h:201px] [--pocket-overlap:48px] [--pocket-rise:24px] max-md:[--pocket-h:193px] max-md:[--pocket-overlap:32px] max-md:[--pocket-rise:14px]">
      <div className="relative z-10 px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-0 rounded-[28px]"
          style={{
            top: "30%",
            bottom: "calc((var(--pocket-h) - var(--pocket-overlap)) * -1)",
            background: BACK,
          }}
        />
        {children}
        <FrontPocket onOpen={() => setOpen(true)} />
      </div>

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

/** Charcoal cover. The raised tab is on the right and eases down toward the left. */
function FrontPocket({ onOpen }: { onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [shape, setShape] = useState({ width: 1200, height: 201, rise: 24 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const styles = getComputedStyle(el);
      const height = parseFloat(styles.getPropertyValue("--pocket-h")) || 201;
      const rise = parseFloat(styles.getPropertyValue("--pocket-rise")) || 24;
      setShape({ width: Math.max(280, el.clientWidth), height, rise });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { width, height, rise } = shape;
  const radius = 28;
  const stepStart = width * 0.56;
  const stepEnd = width * 0.78;
  const d = [
    `M ${radius} ${height}`,
    `H ${width - radius}`,
    `Q ${width} ${height} ${width} ${height - radius}`,
    `V ${radius}`,
    `Q ${width} 0 ${width - radius} 0`,
    `H ${stepEnd}`,
    `C ${stepEnd - width * 0.07} 0 ${stepStart + width * 0.07} ${rise} ${stepStart} ${rise}`,
    `H ${radius}`,
    `Q 0 ${rise} 0 ${rise + radius}`,
    `V ${height - radius}`,
    `Q 0 ${height} ${radius} ${height}`,
    "Z",
  ].join(" ");

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label="Open Project Playground"
      className="playground-pocket relative z-20 -mx-6 flex w-[calc(100%+3rem)] cursor-pointer items-end justify-between border-0 bg-transparent px-6 pb-7 text-left md:px-10"
      style={{
        height: "var(--pocket-h)",
        marginTop: "calc(var(--pocket-overlap) * -1)",
        filter: "drop-shadow(0 16px 26px rgba(17,17,17,0.28))",
      }}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <path d={d} fill={FRONT} />
        <path
          d={`M 0 ${rise + radius} Q 0 ${rise} ${radius} ${rise} H ${stepStart} C ${stepStart + width * 0.07} ${rise} ${stepEnd - width * 0.07} 0 ${stepEnd} 0 H ${width - radius} Q ${width} 0 ${width} ${radius}`}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="relative font-mono text-base tracking-tight text-[#f4efe6]">
        Project Playground
      </span>
      <ArrowUpRight
        className="relative size-4 shrink-0 text-white/55"
        strokeWidth={1.5}
        aria-hidden
      />
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
