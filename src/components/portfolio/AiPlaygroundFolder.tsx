import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const BACK = "#18181B";
const FRONT = "#1C1D21";

/**
 * The three project sheets sit inside a jacket. The front pocket is the dark
 * sleeve under the rows. It does not open a playground.
 */
export function AiPlaygroundFolder({ children }: { children: ReactNode }) {
  return (
    <div className="ai-playground-folder relative mb-7 [--pocket-h:242.55px] [--pocket-overlap:48px] [--pocket-rise:24px] max-md:mx-auto max-md:w-[min(340px,calc(100vw-32px))] max-md:[--pocket-h:168px] max-md:[--pocket-overlap:0px] max-md:[--pocket-rise:22px]">
      <div className="relative z-10 px-6 max-md:min-h-[300px] max-md:px-0 max-md:pt-0">
        <div
          aria-hidden
          className="ai-playground-back pointer-events-none absolute z-0 rounded-[28px]"
          style={{
            top: "30%",
            bottom: "calc(var(--pocket-h) - var(--pocket-overlap))",
            left: "calc(-4% + 1.62rem)",
            width: "calc(108% - 3.24rem)",
            background: BACK,
          }}
        />
        {children}
        <FrontPocket />
      </div>
    </div>
  );
}

/** Charcoal cover. The raised tab is on the right and eases down toward the left. */
function FrontPocket() {
  const ref = useRef<HTMLDivElement>(null);
  const [shape, setShape] = useState({ width: 1200, height: 201, rise: 24 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const styles = getComputedStyle(el);
      const height = el.clientHeight || parseFloat(styles.getPropertyValue("--pocket-h")) || 201;
      const rise = parseFloat(styles.getPropertyValue("--pocket-rise")) || 24;
      setShape({ width: Math.max(280, el.clientWidth), height, rise });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { width, height, rise } = shape;
  const compact = width < 420;
  const radius = 28;
  const stepStart = width * (compact ? 0.28 : 0.56);
  const stepEnd = width * (compact ? 0.46 : 0.78);
  const d = compact
    ? [
        `M ${radius} ${height}`,
        `H ${width - radius}`,
        `Q ${width} ${height} ${width} ${height - radius}`,
        `V ${rise + radius}`,
        `Q ${width} ${rise} ${width - radius} ${rise}`,
        `H ${stepEnd}`,
        `C ${stepEnd - width * 0.06} ${rise} ${stepStart + width * 0.06} 0 ${stepStart} 0`,
        `H ${radius}`,
        `Q 0 0 0 ${radius}`,
        `V ${height - radius}`,
        `Q 0 ${height} ${radius} ${height}`,
        "Z",
      ].join(" ")
    : [
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
  const lip = compact
    ? `M ${radius} 0 H ${stepStart} C ${stepStart + width * 0.06} 0 ${stepEnd - width * 0.06} ${rise} ${stepEnd} ${rise} H ${width - radius} Q ${width} ${rise} ${width} ${rise + radius}`
    : `M 0 ${rise + radius} Q 0 ${rise} ${radius} ${rise} H ${stepStart} C ${stepStart + width * 0.07} ${rise} ${stepEnd - width * 0.07} 0 ${stepEnd} 0 H ${width - radius} Q ${width} 0 ${width} ${radius}`;

  const frost = "rgba(28, 29, 33, 0.7)";

  return (
    <div
      ref={ref}
      className="playground-pocket relative z-20 -ml-[4%] flex w-[108%] items-end justify-between px-6 pb-7 max-md:ml-0 max-md:w-full md:px-10"
      style={{
        height: "calc(var(--pocket-h) + 28px)",
        marginTop: "calc(var(--pocket-overlap) * -1 - var(--pocket-h) * 0.05 - 28px)",
      }}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="pocket-shadow" x="-20%" y="-20%" width="140%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="13" result="blur" />
            <feOffset in="blur" dy="16" result="offset" />
            <feFlood floodColor="#111111" floodOpacity="0.28" result="color" />
            <feComposite in="color" in2="offset" operator="in" />
          </filter>
        </defs>
        <path className="pocket-body" d={d} fill={FRONT} filter="url(#pocket-shadow)" />
      </svg>
      <div
        aria-hidden
        className="pocket-frost pointer-events-none absolute inset-0"
        style={{
          clipPath: `path('${d}')`,
          backgroundColor: frost,
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
          backdropFilter: "blur(22px) saturate(160%)",
        }}
      />
      <div aria-hidden className="pocket-clip pointer-events-none absolute -top-[18px] right-12 z-0 max-md:hidden">
        <svg
          viewBox="0 0 24 64"
          width="25.3"
          height="64.4"
          className="block overflow-visible"
          fill="none"
        >
          <path
            d="M 6 18 L 6 10 A 6 6 0 0 1 18 10 L 18 18"
            stroke="#3B82F6"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <path
          d={lip}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div aria-hidden className="pocket-clip pointer-events-none absolute -top-[18px] right-12 z-20 max-md:hidden">
        <svg
          viewBox="0 0 24 64"
          width="25.3"
          height="64.4"
          className="block overflow-visible"
          fill="none"
        >
          <path
            d="M 18 14 L 18 48 A 5 5 0 0 1 8 48 L 8 24"
            stroke="#3B82F6"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
