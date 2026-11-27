import { useCallback } from "react";
import type { PointerEvent } from "react";
import {
  useCrcleCaseStudyAppearanceContext,
  useCrcleCaseStudyChrome,
} from "@/components/portfolio/CrcleCaseStudyChrome";
import { useMobileWorkDevInspect } from "@/components/portfolio/MobileWorkDevInspect";
import { useOdicciMobileLayout } from "@/components/portfolio/OdicciMobileLayout";

/** Mobile work case study — dev inspect on hover (Odicci browser shell + CRCLE preview card). */
export function useCaseStudyPrototypeDevHover(setCodeOn: (value: boolean) => void) {
  const dev = useMobileWorkDevInspect();
  const caseStudy = useCrcleCaseStudyChrome();
  const appearance = useCrcleCaseStudyAppearanceContext();
  const odicciEmbed = useOdicciMobileLayout()?.embed ?? false;
  const active = Boolean(dev) && (caseStudy || odicciEmbed);

  const onPointerEnter = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!active || appearance?.appearanceOpen) return;
      if (event.pointerType === "touch") return;
      setCodeOn(true);
    },
    [active, appearance?.appearanceOpen, setCodeOn],
  );

  const onPointerLeave = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!active) return;
      if (dev?.devPinnedRef.current) return;
      const next = event.relatedTarget;
      if (next instanceof Node && event.currentTarget.contains(next)) return;
      if (next instanceof Element && next.closest("[data-inspect-ui]")) return;
      setCodeOn(false);
    },
    [active, dev?.devPinnedRef, setCodeOn],
  );

  /** Mobile — tap preview chrome (not the live demo) to arm inspect like desktop hover on Odicci shell. */
  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!active || appearance?.appearanceOpen) return;
      if (event.pointerType !== "touch") return;
      const target = event.target as HTMLElement;
      if (target.closest('[data-device="iphone-crcle-402x874"]')) return;
      if (target.closest(".crcle-case-study-toolbar, [data-inspect-ui], [data-crcle-settings-ui]")) return;
      if (target.closest("button, a, input, textarea, [role='button'], [role='switch']")) return;
      setCodeOn(true);
    },
    [active, appearance?.appearanceOpen, setCodeOn],
  );

  return active ? { onPointerEnter, onPointerLeave, onPointerUp } : {};
}