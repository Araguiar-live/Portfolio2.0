import { useState, type ReactNode } from "react";
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
}: {
  playing: boolean;
  codeOn: boolean;
  onPlay: () => void;
  onDesign: () => void;
  onCode: () => void;
}) {
  const designOn = !playing && !codeOn;

  return (
    <div className="mt-3 flex items-center justify-center">
      <div className="flex w-[224px] items-center gap-1 rounded-full bg-white p-1">
        <DemoToolbarButton
          active={playing}
          label={playing ? "Demo playing" : "Replay demo"}
          onClick={onPlay}
          activeClassName="border border-[rgba(250,131,46,0.2)] bg-[rgba(255,81,38,0.4)]"
        >
          <img src={playing ? playActiveIcon : playIdleIcon} alt="" className="h-[26px] w-6" />
        </DemoToolbarButton>
        <DemoToolbarButton
          active={designOn}
          label="Design mode"
          onClick={onDesign}
          activeClassName="border border-[rgba(250,131,46,0.2)] bg-[linear-gradient(126deg,rgba(139,92,247,0.4)_19.75%,rgba(3,86,229,0.284)_86.39%)]"
        >
          <img src={designOn ? penActiveIcon : penIdleIcon} alt="" className="size-6 object-contain" />
        </DemoToolbarButton>
        <DemoToolbarButton
          active={codeOn}
          label="Dev inspection"
          onClick={onCode}
          activeClassName="border border-[rgba(1,208,180,0.13)] bg-[linear-gradient(126deg,rgba(1,208,129,0.104)_19.75%,rgba(1,208,129,0.48)_86.39%)]"
        >
          <img src={codeOn ? codeActiveIcon : codeIdleIcon} alt="" className="h-6 w-6" />
        </DemoToolbarButton>
      </div>
    </div>
  );
}

/** Same toolbar on screens whose play / design / code routes are still to come. */
export function CrcleScreenToolbar() {
  const [tab, setTab] = useState<CrcleToolbarTab>("play");

  return (
    <DemoToolbar
      playing={tab === "play"}
      codeOn={tab === "code"}
      onPlay={() => setTab("play")}
      onDesign={() => setTab("design")}
      onCode={() => setTab("code")}
    />
  );
}
