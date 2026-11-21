import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const BACK = "#18181B";
const FRONT = "#1C1D21";

/**
 * The three project sheets sit inside a jacket. The front pocket is the dark
 * sleeve under the rows. It does not open a playground.
 */
export function AiPlaygroundFolder({ children }: { children: ReactNode }) {
  return (
    <div className="ai-playground-folder relative mb-7 [--pocket-h:231px] [--pocket-overlap:48px] [--pocket-rise:24px] max-md:[--pocket-h:222px] max-md:[--pocket-overlap:32px] max-md:[--pocket-rise:14px]">
      <div className="relative z-10 px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-0 rounded-[28px]"
          style={{
            top: "30%",
            bottom: 0,
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
    <div
      ref={ref}
      className="playground-pocket relative z-20 ml-[calc(-10%-1.8rem)] flex w-[calc(120%+3.6rem)] items-end justify-between px-6 pb-7 md:px-10"
      style={{
        height: "var(--pocket-h)",
        marginTop: "calc(var(--pocket-overlap) * -1)",
        filter: "drop-shadow(0 16px 26px rgba(17,17,17,0.28))",
      }}
    >
      <div aria-hidden className="pointer-events-none absolute -top-[18px] right-12 z-0">
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
      <div aria-hidden className="pointer-events-none absolute -top-[18px] right-12 z-20">
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
