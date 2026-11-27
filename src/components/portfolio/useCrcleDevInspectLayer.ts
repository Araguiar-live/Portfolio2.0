import { useEffect } from "react";
import { useCaseStudyDevInspect } from "./useCaseStudyDevInspect";

/** Pause autoplay and dismiss blocking chrome when mobile case-study dev inspect turns on. */
export function useCrcleDevInspectLayer(onActivate: () => void) {
  const { codeOn } = useCaseStudyDevInspect();

  useEffect(() => {
    if (!codeOn) return;
    onActivate();
  }, [codeOn, onActivate]);
}