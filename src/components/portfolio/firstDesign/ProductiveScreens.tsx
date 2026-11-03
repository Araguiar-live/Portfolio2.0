import type { InspectorFrameId } from "./inspectorTypes";
import {
  ProductiveDayWireframe,
  ProductiveHabitsWireframe,
  ProductiveReadingWireframe,
  ProductiveTodayWireframe,
} from "./ProductiveLiveWireframes";

export { ProductiveOnboardingScreen } from "./ProductiveOnboardingScreen";

/** Shipped Productive frames in the Bending Spoons file. */
export function ProductiveComingSoonScreen({
  standalone = false,
}: {
  compact?: boolean;
  standalone?: boolean;
}) {
  return <ProductiveHabitsWireframe standalone={standalone} />;
}

export function ProductiveSessionSetupScreen({ standalone = false }: { standalone?: boolean }) {
  return <ProductiveReadingWireframe standalone={standalone} />;
}

export function ProductiveFrameScreen({
  frameId,
  standalone,
}: {
  frameId: InspectorFrameId;
  compact?: boolean;
  devMode?: boolean;
  highlightHotspotId?: string | null;
  standalone?: boolean;
  onHotspotHover?: (id: string | null) => void;
}) {
  if (frameId === "onboarding") return <ProductiveTodayWireframe standalone={standalone} />;
  if (frameId === "session-setup") return <ProductiveReadingWireframe standalone={standalone} />;
  if (frameId === "session-active") return <ProductiveDayWireframe standalone={standalone} />;
  return <ProductiveHabitsWireframe standalone={standalone} />;
}
