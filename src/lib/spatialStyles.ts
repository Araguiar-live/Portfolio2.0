import { cn } from "@/lib/utils";

/** GPU layer for spatial UI (canvas, overlays, docks). */
export const spatialLayer = "spatial-layer";

/** macOS spring for transform + fade (chrome, popovers, cards). */
export const spatialSpring = "spatial-spring";

/** Hover lift without layout shift — parent must be spatial-layer. */
export const spatialSpringInteractive = "spatial-spring-interactive";

/** Standardised frosted glass + hairline border (light/dark via .dark). */
export const spatialGlass = "spatial-glass spatial-glass-hairline";

export function spatialChrome(visible: boolean) {
  return cn("spatial-chrome", visible && "spatial-chrome--visible");
}

/** Sticky chrome only after hero hand-off and wireframe stage owns the viewport top. */
export function spatialChromeVisible(workCommitted: boolean, chromeVisible: boolean) {
  return spatialChrome(workCommitted && chromeVisible);
}
