/** Matches Tailwind below `md` (768px) — same range as `useIsMobile`. */
export function isPhoneViewport() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}
