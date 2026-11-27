import type { CrcleCaseStudyAppearanceContextValue } from "@/components/portfolio/CrcleCaseStudyChrome";

/** Mobile case study — open in-phone Settings (Figma 3169:14397) and exit dev inspect. */
export function openCaseStudyAppearance(
  chrome: CrcleCaseStudyAppearanceContextValue | null | undefined,
  mobileDev: { setCodeOn: (value: boolean) => void; setDevPinned: (pinned: boolean) => void } | null | undefined,
) {
  if (!chrome || chrome.appearanceOpen) return;
  mobileDev?.setDevPinned(false);
  mobileDev?.setCodeOn(false);
  chrome.openAppearance();
}

export function shouldOpenCaseStudyAppearanceFromTarget(target: HTMLElement) {
  if (target.closest("[data-crcle-settings-ui]")) return false;
  if (target.closest(".crcle-case-study-toolbar")) return false;
  if (target.closest("[data-inspect-ui]")) return false;
  if (target.closest("button, a, input, textarea, [role='button'], [role='switch']")) return false;
  if (target.closest("[data-crcle-demo-interactive]")) return false;
  return Boolean(
    target.closest(
      "[data-crcle-case-study-settings-trigger], [data-crcle-case-study-settings-surface]",
    ),
  );
}