import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useCrcleCaseStudyChrome } from "@/components/portfolio/CrcleCaseStudyChrome";

type MobileWorkDevInspectContextValue = {
  codeOn: boolean;
  setCodeOn: Dispatch<SetStateAction<boolean>>;
  /** Dev toggled via toolbar — hover leave must not dismiss inspect. */
  devPinnedRef: MutableRefObject<boolean>;
  setDevPinned: (pinned: boolean) => void;
};

const MobileWorkDevInspectContext = createContext<MobileWorkDevInspectContextValue | null>(null);

const BACKDROP_CLASS =
  "mobile-work-dev-backdrop pointer-events-auto touch-none md:hidden";

export function MobileWorkDevInspectProvider({ children }: { children: ReactNode }) {
  const [codeOn, setCodeOn] = useState(false);
  const devPinnedRef = useRef(false);
  const setDevPinned = useCallback((pinned: boolean) => {
    devPinnedRef.current = pinned;
  }, []);
  const value = useMemo(
    () => ({ codeOn, setCodeOn, devPinnedRef, setDevPinned }),
    [codeOn, setDevPinned],
  );

  return (
    <MobileWorkDevInspectContext.Provider value={value}>
      <MobileWorkDevBackdrop active={codeOn} />
      {children}
    </MobileWorkDevInspectContext.Provider>
  );
}

export function useMobileWorkDevInspect() {
  return useContext(MobileWorkDevInspectContext);
}

/** Sync CRCLE screen dev toggles to the mobile work-page frost (case study provider only). */
/** @deprecated Prefer `useCaseStudyDevInspect` (provider is the source of truth on case study). */
export function useSyncMobileWorkDevInspect(codeOn: boolean) {
  const caseStudy = useCrcleCaseStudyChrome();
  const dev = useMobileWorkDevInspect();
  const setCodeOn = dev?.setCodeOn;

  useEffect(() => {
    if (!caseStudy || !setCodeOn) return;
    setCodeOn(codeOn);
  }, [caseStudy, codeOn, setCodeOn]);

  useEffect(() => {
    if (!caseStudy || !setCodeOn) return;
    return () => setCodeOn(false);
  }, [caseStudy, setCodeOn]);
}

function MobileWorkDevBackdrop({ active }: { active: boolean }) {
  useEffect(() => {
    const page = document.querySelector(".work-project-page");
    if (!page) return;

    if (active) page.setAttribute("data-mobile-work-dev-inspect", "true");
    else page.removeAttribute("data-mobile-work-dev-inspect");

    return () => page.removeAttribute("data-mobile-work-dev-inspect");
  }, [active]);

  useEffect(() => {
    const page = document.querySelector(".work-project-page");
    if (!page || !active) return;

    const backdrop = document.createElement("div");
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.className = `${BACKDROP_CLASS} fixed inset-0 z-[90] bg-[rgba(243,244,246,0.62)] backdrop-blur-[14px] backdrop-saturate-150 motion-reduce:backdrop-blur-[8px]`;
    page.insertBefore(backdrop, page.firstChild);

    return () => {
      backdrop.remove();
    };
  }, [active]);

  return null;
}

// Back-compat aliases (ODICCI mobile case study)
export const OdicciMobileDevInspectProvider = MobileWorkDevInspectProvider;
export const useOdicciMobileDevInspect = useMobileWorkDevInspect;