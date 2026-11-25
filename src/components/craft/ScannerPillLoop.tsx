import type { CSSProperties } from "react";

type ScannerPillLoopProps = {
  /** Fill the parent hero tile. Leaves out the standalone card. */
  embedded?: boolean;
};

/** Strokes from the barcode frame, in viewBox 0 0 60.2247 15.281. */
const BARCODE_STROKES = [
  "M0.269663 0V15.2809",
  "M1.51311 0V15.2809",
  "M2.75664 8.41864e-05V15.281",
  "M4 0V15.2809",
  "M5.24344 8.41864e-05V15.281",
  "M6.48689 0V15.2809",
  "M7.73024 8.41864e-05V15.281",
  "M8.97378 0V15.2809",
  "M10.217 8.41864e-05V15.281",
  "M11.4608 8.41864e-05V15.281",
  "M12.7041 0V15.2809",
  "M13.9476 8.41864e-05V15.281",
  "M15.191 0V15.2809",
  "M16.4344 8.41864e-05V15.281",
  "M17.6779 0V15.2809",
  "M18.9212 8.41864e-05V15.281",
  "M20.1648 0V15.2809",
  "M21.408 8.41864e-05V15.281",
  "M22.6518 8.41864e-05V15.281",
  "M23.8951 0V15.2809",
  "M25.1386 8.41864e-05V15.281",
  "M26.382 0V15.2809",
  "M27.6254 8.41864e-05V15.281",
  "M28.8689 0V15.2809",
  "M30.1122 8.41864e-05V15.281",
  "M31.3561 8.41864e-05V15.281",
  "M32.5993 0V15.2809",
  "M33.8428 8.41864e-05V15.281",
  "M35.0861 0V15.2809",
  "M36.3296 8.41864e-05V15.281",
  "M37.573 0V15.2809",
  "M38.8165 8.41864e-05V15.281",
  "M40.0599 0V15.2809",
  "M41.3032 8.41864e-05V15.281",
  "M42.5471 8.41864e-05V15.281",
  "M43.79 8.41864e-05V15.281",
  "M45.0338 8.41864e-05V15.281",
  "M46.2772 0V15.2809",
  "M47.5207 8.41864e-05V15.281",
  "M48.7641 0V15.2809",
  "M50.0075 8.41864e-05V15.281",
  "M51.251 0V15.2809",
  "M52.4944 0V15.2809",
  "M53.7381 8.41864e-05V15.281",
  "M54.9813 0V15.2809",
  "M56.2249 8.41864e-05V15.281",
  "M57.4682 0V15.2809",
  "M58.7117 8.41864e-05V15.281",
  "M59.9551 0V15.2809",
] as const;

/** Barcode row is 76% of the art, flush left. */
const BARCODE_WIDTH = 0.76;
const BARCODE_VIEWBOX_WIDTH = 60.2247;

function artFraction(path: string) {
  const x = Number(path.slice(1).split(" ")[0]);
  return (x / BARCODE_VIEWBOX_WIDTH) * BARCODE_WIDTH;
}

function Barcode() {
  return (
    <span className="scanner-row scanner-row--bars">
      <svg
        className="scanner-bars"
        viewBox="0 0 60.2247 15.281"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        {BARCODE_STROKES.map((d) => (
          <path
            key={d}
            className="scanner-bar"
            d={d}
            stroke="currentColor"
            strokeWidth="0.539326"
            style={{ "--at": artFraction(d) } as CSSProperties}
          />
        ))}
      </svg>
    </span>
  );
}

function ScannerRows({ filled = false }: { filled?: boolean }) {
  return (
    <>
      <span
        className={
          filled ? "scanner-row scanner-row--pill scanner-row--on" : "scanner-row scanner-row--pill"
        }
      />
      <span
        className={
          filled
            ? "scanner-row scanner-row--pill scanner-row--shift scanner-row--on"
            : "scanner-row scanner-row--pill scanner-row--shift"
        }
      />
      {filled ? <span className="scanner-row scanner-row--bars" /> : <Barcode />}
      <span
        className={
          filled ? "scanner-row scanner-row--grey scanner-row--on" : "scanner-row scanner-row--grey"
        }
      />
    </>
  );
}

/**
 * Four stacked marks and an orange rule. The rule travels to 60% of the
 * graphic and back. The first pill fills solid; the shifted pill only
 * turns its outline orange. Each barcode stroke turns orange on its own.
 */
export function ScannerPillLoop({ embedded = false }: ScannerPillLoopProps) {
  const art = (
    <div className="scanner-art">
      <div className="scanner-rows">
        <ScannerRows />
      </div>
      <div className="scanner-fill">
        <ScannerRows filled />
      </div>
      <span className="scanner-line" />
    </div>
  );

  if (embedded) {
    return <div className="scanner-tile scanner-tile--embedded">{art}</div>;
  }

  return <div className="scanner-tile">{art}</div>;
}
