import { InspectHotspotOverlay } from "./InspectHotspotOverlay";
import { INSPECTOR_FRAMES, type InspectorFrameId } from "./inspectorTypes";
import { ProductiveAnchorTodayScreen2476 } from "./ProductiveAnchorTodayScreen2476";
import { ProductiveArticlesScreen2460 } from "./ProductiveArticlesScreen2460";
import { ProductiveChallengesScreen2522 } from "./ProductiveChallengesScreen2522";
import { ProductiveComingSoonWireframe2317 } from "./ProductiveComingSoonWireframe2317";
import { ProductiveEnergyEvolutionScreen2522 } from "./ProductiveEnergyEvolutionScreen2522";
import { ProductiveOnboardingScreen } from "./ProductiveOnboardingScreen";

export { ProductiveOnboardingScreen } from "./ProductiveOnboardingScreen";

/** Placeholder slots use the same Figma wireframe until those frames ship. */
export function ProductiveComingSoonScreen({
  standalone = false,
}: {
  compact?: boolean;
  standalone?: boolean;
}) {
  return <ProductiveComingSoonWireframe2317 standalone={standalone} />;
}

export function ProductiveSessionSetupScreen({ standalone = false }: { standalone?: boolean }) {
  return <ProductiveComingSoonWireframe2317 standalone={standalone} />;
}

function ProductiveSessionActiveScreen({
  standalone = false,
}: {
  compact?: boolean;
  standalone?: boolean;
}) {
  return <ProductiveArticlesScreen2460 standalone={standalone} />;
}

export function ProductiveFrameScreen({
  frameId,
  compact,
  devMode,
  highlightHotspotId,
  standalone,
  onHotspotHover,
}: {
  frameId: InspectorFrameId;
  compact?: boolean;
  devMode?: boolean;
  highlightHotspotId?: string | null;
  standalone?: boolean;
  onHotspotHover?: (id: string | null) => void;
}) {
  const screen =
    frameId === "onboarding" ? (
      <ProductiveOnboardingScreen compact={compact} standalone={standalone} />
    ) : frameId === "session-setup" ? (
      <ProductiveComingSoonWireframe2317 standalone={standalone} />
    ) : frameId === "session-active" ? (
      <ProductiveSessionActiveScreen standalone={standalone} />
    ) : frameId === "coming-2" ? (
      <ProductiveAnchorTodayScreen2476 standalone={standalone} />
    ) : frameId === "challenges" ? (
      <ProductiveChallengesScreen2522 standalone={standalone} />
    ) : frameId === "energy" ? (
      <ProductiveEnergyEvolutionScreen2522 standalone={standalone} />
    ) : (
      <ProductiveComingSoonWireframe2317 standalone={standalone} />
    );

  const annotations = INSPECTOR_FRAMES.find((f) => f.id === frameId)?.annotations ?? [];
  const inspectable = (
    <div className="relative isolate h-full w-full min-h-0">
      {screen}
      {devMode ? (
        <InspectHotspotOverlay
          annotations={annotations}
          highlightHotspotId={highlightHotspotId}
          onHotspotHover={onHotspotHover}
        />
      ) : null}
    </div>
  );

  return inspectable;
}
