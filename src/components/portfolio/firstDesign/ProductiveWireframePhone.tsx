import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Figma iPhone 16 / 17 Pro artboard — 402×874 (portfolio strip). */
export const PRODUCTIVE_WIREFRAME_PHONE_W = 402;
export const PRODUCTIVE_WIREFRAME_PHONE_H = 874;

const RIM: CSSProperties = {
  background:
    "linear-gradient(160deg, #d8d8de 0%, #8a8a90 18%, #3a3a40 42%, #1a1a1e 58%, #9a9aa0 82%, #5a5a60 100%)",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
};

const INNER_BEZEL: CSSProperties = {
  background: "#0a0a0c",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
};

/**
 * Hardware iPhone shell. The Productive wireframe fills the display —
 * rim, island, buttons, and home indicator sit on the device, not in the artboard.
 */
export function ProductiveWireframePhone({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("relative ml-auto h-[874px] w-[402px] shrink-0 overflow-visible", className)}
      data-device="iphone-16-pro-402x874"
    >
      {/* Hardware buttons — sit just outside the titanium rim */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-[3px] top-[126px] z-20 h-[32px] w-[3px] rounded-l-[1.5px] bg-gradient-to-b from-[#c8c8ce] via-[#6a6a70] to-[#2a2a2e]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-[3px] top-[176px] z-20 h-[62px] w-[3px] rounded-l-[1.5px] bg-gradient-to-b from-[#c8c8ce] via-[#6a6a70] to-[#2a2a2e]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-[3px] top-[246px] z-20 h-[62px] w-[3px] rounded-l-[1.5px] bg-gradient-to-b from-[#c8c8ce] via-[#6a6a70] to-[#2a2a2e]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[3px] top-[210px] z-20 h-[100px] w-[3px] rounded-r-[1.5px] bg-gradient-to-b from-[#c8c8ce] via-[#6a6a70] to-[#2a2a2e]"
      />

      <div
        className="relative h-full w-full overflow-hidden rounded-[58px] bg-black shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
        style={{ clipPath: "inset(0 round 58px)" }}
      >
        {/* Display — wireframe fills the iPhone screen */}
        <div className="absolute inset-0 overflow-hidden rounded-[55px] bg-black">{children}</div>

        {/* Titanium outer rim */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-[58px] p-[3px]" style={RIM} />
        {/* Slim black bezel between rim and glass */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[3px] z-20 rounded-[55px] p-[2.5px]"
          style={INNER_BEZEL}
        />

        {/* Dynamic Island */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[12px] z-30 flex h-[33px] w-[113px] -translate-x-1/2 items-center justify-end rounded-full bg-black px-2.5"
        >
          <span className="relative size-[10px] rounded-full bg-[#0c0c14] ring-1 ring-white/10">
            <span className="absolute left-1/2 top-1/2 size-[3.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a2744]" />
          </span>
        </div>

        {/* Home indicator */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[8px] left-1/2 z-30 h-[4px] w-[128px] -translate-x-1/2 rounded-full bg-white/40"
        />
      </div>
    </div>
  );
}
