import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { resetCrclePhoneDarkForWorkEntry } from "@/lib/crcle-phone-theme";

export type CrcleCaseStudyAppearanceContextValue = {
  caseStudy: boolean;
  appearanceOpen: boolean;
  openAppearance: () => void;
  closeAppearance: () => void;
};

const CrcleCaseStudyChromeContext = createContext(false);
const CrcleCaseStudyAppearanceContext = createContext<CrcleCaseStudyAppearanceContextValue | null>(
  null,
);

export function CrcleCaseStudyChromeProvider({ children }: { children: ReactNode }) {
  const [appearanceOpen, setAppearanceOpen] = useState(false);

  useLayoutEffect(() => {
    resetCrclePhoneDarkForWorkEntry();
  }, []);

  const openAppearance = useCallback(() => setAppearanceOpen(true), []);
  const closeAppearance = useCallback(() => setAppearanceOpen(false), []);

  const appearanceValue = useMemo<CrcleCaseStudyAppearanceContextValue>(
    () => ({
      caseStudy: true,
      appearanceOpen,
      openAppearance,
      closeAppearance,
    }),
    [appearanceOpen, closeAppearance, openAppearance],
  );

  return (
    <CrcleCaseStudyChromeContext.Provider value={true}>
      <CrcleCaseStudyAppearanceContext.Provider value={appearanceValue}>
        {children}
      </CrcleCaseStudyAppearanceContext.Provider>
    </CrcleCaseStudyChromeContext.Provider>
  );
}

export function useCrcleCaseStudyChrome() {
  return useContext(CrcleCaseStudyChromeContext);
}

export function useCrcleCaseStudyAppearanceContext() {
  return useContext(CrcleCaseStudyAppearanceContext);
}