import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { PhoneDevInspection } from "@/components/portfolio/inspect/PhoneDevInspection";
import type { OdicciTouch } from "@/components/portfolio/useOdicciDemo";
import type { RefObject } from "react";

export function OdicciDemoChrome({
  screenRef,
  touch,
  codeOn,
}: {
  screenRef: RefObject<HTMLDivElement | null>;
  touch: OdicciTouch | null;
  codeOn: boolean;
}) {
  const screen = screenRef.current;

  return (
    <>
      <PhoneDevInspection active={codeOn} screenRef={screenRef} />
      {touch && screen
        ? createPortal(
            <>
              <span
                aria-hidden
                className="pointer-events-none absolute z-[79] size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(120,120,120,0.35)] animate-ping"
                style={{ left: touch.x, top: touch.y }}
              />
              <motion.div
                aria-hidden
                className="crcle-touch-glass pointer-events-none absolute z-[80] rounded-full"
                initial={false}
                animate={{
                  left: touch.x - (touch.pressing ? 11 : 14),
                  top: touch.y - (touch.pressing ? 11 : 14),
                  width: touch.pressing ? 22 : 28,
                  height: touch.pressing ? 22 : 28,
                }}
                transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.6 }}
              />
            </>,
            screen,
          )
        : null}
    </>
  );
}
