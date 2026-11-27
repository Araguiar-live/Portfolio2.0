import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { useCrcleCaseStudyChrome } from "@/components/portfolio/CrcleCaseStudyChrome";
import { useMobileWorkDevInspect } from "@/components/portfolio/MobileWorkDevInspect";
import { useCaseStudyPrototypeDevHover } from "@/components/portfolio/useCaseStudyPrototypeDevHover";

/** Dev inspection state — shared provider on mobile work case study, local elsewhere. */
export function useCaseStudyDevInspect(): {
  codeOn: boolean;
  setCodeOn: Dispatch<SetStateAction<boolean>>;
  prototypeDevHover: ReturnType<typeof useCaseStudyPrototypeDevHover>;
} {
  const dev = useMobileWorkDevInspect();
  const caseStudy = useCrcleCaseStudyChrome();
  const [local, setLocal] = useState(false);
  const shared = Boolean(dev && caseStudy);

  const codeOn = shared ? dev!.codeOn : local;

  const setCodeOn = useCallback<Dispatch<SetStateAction<boolean>>>(
    (value) => {
      if (shared && dev) {
        const next =
          typeof value === "function" ? value(dev.codeOn) : value;
        dev.setDevPinned(next);
        dev.setCodeOn(next);
        return;
      }
      setLocal(value);
    },
    [shared, dev],
  );

  /** Hover over prototype chrome — arm dev inspect without pinning (Odicci browser-shell parity). */
  const setCodeOnFromHover = useCallback(
    (value: boolean) => {
      if (shared && dev) {
        dev.setCodeOn(value);
        return;
      }
      setLocal(value);
    },
    [shared, dev],
  );

  const prototypeDevHover = useCaseStudyPrototypeDevHover(setCodeOnFromHover);

  const armDevInspect = useCallback(() => {
    if (shared && dev) {
      dev.setDevPinned(true);
      dev.setCodeOn(true);
      return;
    }
    setLocal(true);
  }, [shared, dev]);

  const disarmDevInspect = useCallback(() => {
    if (shared && dev) {
      dev.setDevPinned(false);
      dev.setCodeOn(false);
      return;
    }
    setLocal(false);
  }, [shared, dev]);

  return { codeOn, setCodeOn, prototypeDevHover, armDevInspect, disarmDevInspect };
}