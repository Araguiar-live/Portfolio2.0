import { useMemo, type ReactNode } from "react";
import { CrcleAppearanceSheet } from "@/components/portfolio/CrcleAppearanceSheet";
import { useCrcleCaseStudyAppearanceContext } from "@/components/portfolio/CrcleCaseStudyChrome";

/** Wire theme toggle + phone overlay for mobile case study only. */
export function useCrcleCaseStudyAppearance(isLight: boolean) {
  const chrome = useCrcleCaseStudyAppearanceContext();

  return useMemo(() => {
    if (!chrome) {
      return {
        caseStudy: false as const,
        showThemeToggle: true,
        themeToggleClassName: "absolute top-0 left-[calc(100%+12px)]",
        openAppearance: undefined as (() => void) | undefined,
        appearanceTrigger: false,
        phoneOverlay: undefined as ReactNode,
      };
    }

    return {
      caseStudy: true as const,
      showThemeToggle: false,
      themeToggleClassName: "crcle-case-study-theme-trigger",
      openAppearance: chrome.openAppearance,
      appearanceTrigger: true,
      phoneOverlay: chrome.appearanceOpen ? (
        <CrcleAppearanceSheet
          open={chrome.appearanceOpen}
          light={isLight}
          onClosed={chrome.closeAppearance}
        />
      ) : undefined,
    };
  }, [chrome, isLight]);
}