import { useState, type ReactNode } from "react";
import { useCrcleCaseStudyAppearanceContext, useCrcleCaseStudyChrome } from "@/components/portfolio/CrcleCaseStudyChrome";
import { useMobileWorkDevInspect } from "@/components/portfolio/MobileWorkDevInspect";
import { openCaseStudyAppearance } from "@/components/portfolio/openCaseStudyAppearance";
import settingsGear from "@/assets/crcle/case-study/settings-gear.svg";
import codeActiveIcon from "@/assets/crcle/demo-toolbar/code-active.svg";
import codeIdleIcon from "@/assets/crcle/demo-toolbar/code-idle.svg";
import penActiveIcon from "@/assets/crcle/demo-toolbar/pen-active.svg";
import penIdleIcon from "@/assets/crcle/demo-toolbar/pen-idle.svg";
import playActiveIcon from "@/assets/crcle/demo-toolbar/play-active.svg";
import playIdleIcon from "@/assets/crcle/demo-toolbar/play-idle.svg";

export type CrcleToolbarTab = "play" | "design" | "code";

function DemoToolbarButton({
  active,
  label,
  onClick,
  children,
  activeClassName,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
  activeClassName: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex min-w-0 flex-1 items-center justify-center rounded-full px-4 py-2 backdrop-blur-[4px] ${
        active ? activeClassName : ""
      }`}
    >
      {children}
    </button>
  );
}

/** Figma Rfaea toolbar — 2774:208563. One tab at a time: Play, Design, or Dev inspection. */
export function DemoToolbar({
  playing,
  codeOn,
  onPlay,
  onDesign,
  onCode,
  className = "mt-3",
  compact = false,
}: {
  playing: boolean;
  codeOn: boolean;
  onPlay: () => void;
  onDesign: () => void;
  onCode: () => void;
  className?: string;
  compact?: boolean;
}) {
  const designOn = !playing && !codeOn;
  const caseStudyChrome = useCrcleCaseStudyChrome();
  const caseStudyAppearance = useCrcleCaseStudyAppearanceContext();
  const mobileDev = useMobileWorkDevInspect();

  const playButton = (
    <DemoToolbarButton
      active={playing}
      label={playing ? "Demo playing" : "Replay demo"}
      onClick={onPlay}
      activeClassName="border border-[rgba(250,131,46,0.2)] bg-[rgba(255,81,38,0.4)]"
    >
      <img src={playing ? playActiveIcon : playIdleIcon} alt="" className="h-[26px] w-6" />
    </DemoToolbarButton>
  );

  const codeButton = (
    <DemoToolbarButton
      active={codeOn}
      label="Dev inspection"
      onClick={onCode}
      activeClassName="border border-[rgba(1,208,180,0.13)] bg-[linear-gradient(124deg,rgba(1,208,129,0.104)_19.75%,rgba(1,208,129,0.48)_86.39%)]"
    >
      <img src={codeOn ? codeActiveIcon : codeIdleIcon} alt="" className="size-6 object-contain" />
    </DemoToolbarButton>
  );

  if (caseStudyChrome) {
    const openAppearance = () => openCaseStudyAppearance(caseStudyAppearance, mobileDev);

    return (
      <div className="crcle-case-study-toolbar flex w-full shrink-0 items-center justify-center">
        {/* Figma 3161:13763 — Play + Dev; appearance opens in-phone settings (not default frame tap). */}
        <div className="crcle-case-study-toolbar__rail flex w-[min(100%,202px)] items-center gap-0.5 rounded-[64px] bg-white p-0.5">
          {playButton}
          <DemoToolbarButton
            active={Boolean(caseStudyAppearance?.appearanceOpen)}
            label="Appearance settings"
            onClick={openAppearance}
            activeClassName="border border-zinc-800/60 bg-black [&_img]:brightness-0 [&_img]:invert"
          >
            <img src={settingsGear} alt="" className="size-6 object-contain opacity-90" />
          </DemoToolbarButton>
          {codeButton}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="flex w-[224px] items-center gap-1 rounded-full bg-white p-1"
        style={
          compact
            ? { transform: "scale(0.95)", transformOrigin: "center top", marginBottom: -2.5 }
            : undefined
        }
      >
        {playButton}
        <DemoToolbarButton
          active={designOn}
          label="Design mode"
          onClick={onDesign}
          activeClassName="border border-[rgba(250,131,46,0.2)] bg-[linear-gradient(126deg,rgba(139,92,247,0.4)_19.75%,rgba(3,86,229,0.284)_86.39%)]"
        >
          <img src={designOn ? penActiveIcon : penIdleIcon} alt="" className="size-6 object-contain" />
        </DemoToolbarButton>
        {codeButton}
      </div>
    </div>
  );
}

/** Same toolbar on screens whose play / design / code routes are still to come. */
export function CrcleScreenToolbar({ className = "mt-3" }: { className?: string }) {
  const [tab, setTab] = useState<CrcleToolbarTab>("play");

  return (
    <DemoToolbar
      playing={tab === "play"}
      codeOn={tab === "code"}
      onPlay={() => setTab("play")}
      onDesign={() => setTab("design")}
      onCode={() => setTab("code")}
      className={className}
    />
  );
}
