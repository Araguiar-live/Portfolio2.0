type ScannerPillLoopProps = {
  /** Fill the parent hero tile. Leaves out the standalone card. */
  embedded?: boolean;
};

const ROWS = 4;
const TICKS = 11;

function PillGraphic({ tone }: { tone: string }) {
  return (
    <svg viewBox="0 0 120 148" className="scanner-pill__svg" aria-hidden>
      {Array.from({ length: ROWS }, (_, row) => {
        const y = 8 + row * 36;
        return (
          <g key={row}>
            <rect
              x="10"
              y={y}
              width="100"
              height="26"
              rx="13"
              fill="none"
              stroke={tone}
              strokeWidth="2.4"
            />
            {Array.from({ length: TICKS }, (_, tick) => (
              <line
                key={tick}
                x1={20 + tick * 8}
                x2={20 + tick * 8}
                y1={y + 7}
                y2={y + 19}
                stroke={tone}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Four stadium pills with vertical ticks. At rest the strokes match the dark
 * hero tile; an orange sweep lights them in a loop.
 */
export function ScannerPillLoop({ embedded = false }: ScannerPillLoopProps) {
  const art = (
    <div className="scanner-pill__art">
      <PillGraphic tone="#8b95a3" />
      <div className="scanner-pill__lit">
        <PillGraphic tone="#FF5500" />
      </div>
    </div>
  );

  if (embedded) {
    return <div className="scanner-pill scanner-pill--embedded">{art}</div>;
  }

  return <div className="scanner-pill">{art}</div>;
}
