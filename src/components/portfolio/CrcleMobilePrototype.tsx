import { lazy, Suspense, type ComponentType } from "react";

const CrcleSignalHome = lazy(() =>
  import("@/components/portfolio/CrcleSignalHome").then((m) => ({ default: m.CrcleSignalHome })),
);
const CrcleRadar = lazy(() =>
  import("@/components/portfolio/CrcleRadar").then((m) => ({ default: m.CrcleRadar })),
);
const CrcleMessaging = lazy(() =>
  import("@/components/portfolio/CrcleMessaging").then((m) => ({ default: m.CrcleMessaging })),
);
const CrcleProfile = lazy(() =>
  import("@/components/portfolio/CrcleProfile").then((m) => ({ default: m.CrcleProfile })),
);

type NavProps = {
  onGoToMessages?: () => void;
  onGoToProfile?: () => void;
  onGoToRadar?: () => void;
  onGoToSignalHome?: () => void;
};

const noop = () => {};

const SCREENS: Record<string, ComponentType<NavProps>> = {
  "Create Workspace\u00a0": CrcleSignalHome,
  "Brand Personality": CrcleRadar,
  "Sign Up": CrcleMessaging,
  "Template Library": CrcleProfile,
};

/** Mobile case study — live CRCLE screen (dock nav locked; demo + dev toolbar active). */
export function CrcleMobilePrototype({ activeTab }: { activeTab: string }) {
  const Screen = SCREENS[activeTab] ?? CrcleProfile;
  const nav: NavProps = {
    onGoToMessages: noop,
    onGoToProfile: noop,
    onGoToRadar: noop,
    onGoToSignalHome: noop,
  };

  return (
    <Suspense
      fallback={
        <div
          className="crcle-mobile-prototype-scale__fallback mx-auto w-[77.48cqw] max-w-[192px] rounded-[17px] bg-[#eaeaeb]"
          style={{ aspectRatio: "402 / 874" }}
        />
      }
    >
      <div className="crcle-mobile-prototype-scale mx-auto">
        <Screen {...nav} />
      </div>
    </Suspense>
  );
}