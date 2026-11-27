/** Embeds / mobile previews sometimes report absurd visualViewport heights (e.g. 2^24). */
const MAX_VIEWPORT_PX = 4096;

export function clampViewportHeight(raw: number): number {
  const screenCap = Math.max(480, Math.min(MAX_VIEWPORT_PX, Math.round((window.screen?.height || 900) * 1.5)));
  if (!Number.isFinite(raw) || raw <= 0) {
    const fallback = window.innerHeight;
    if (Number.isFinite(fallback) && fallback > 0) return Math.min(Math.round(fallback), screenCap);
    return Math.min(844, screenCap);
  }
  return Math.min(Math.round(raw), screenCap);
}

export function readVisualViewportHeight(): number {
  return clampViewportHeight(window.visualViewport?.height ?? window.innerHeight);
}

/** One full mobile screen for the tiled hero (VV + layout height — iOS can under-report VV at load). */
export function readMobileHeroBlockHeight(): number {
  const visual = clampViewportHeight(window.visualViewport?.height ?? 0);
  const inner = clampViewportHeight(window.innerHeight);
  return Math.max(visual, inner);
}

/** Pins a clamped px height on `<html>` so mobile layouts never trust a broken `dvh`. */
export function syncSafeViewportCssVar(): number {
  const h = readVisualViewportHeight();
  document.documentElement.style.setProperty("--safe-viewport-h", `${h}px`);
  return h;
}

export function syncMobileHeroViewportCssVars(): number {
  const h = readMobileHeroBlockHeight();
  const root = document.documentElement;
  root.style.setProperty("--safe-viewport-h", `${h}px`);
  root.style.setProperty("--hero-mobile-vh", `${h}px`);
  return h;
}