import bolt from "@/assets/firstDesign/today-2447/bolt.svg";
import mood from "@/assets/firstDesign/today-2447/mood.svg";
import block from "@/assets/firstDesign/today-2447/block.svg";
import calendar from "@/assets/firstDesign/today-2447/calendar.svg";
import search from "@/assets/firstDesign/today-2447/search.svg";
import analytics from "@/assets/firstDesign/today-2447/analytics.svg";
import add from "@/assets/firstDesign/today-2447/add.svg";
import close from "@/assets/firstDesign/challenges-2522/close.svg";
import openChallenge from "@/assets/firstDesign/challenges-2522/open-challenge.svg";
import habitPending from "@/assets/firstDesign/challenges-2522/habit-pending.svg";
import openHabit from "@/assets/firstDesign/challenges-2522/open-habit.svg";
import habitDone from "@/assets/firstDesign/challenges-2522/habit-done.svg";
import hill from "@/assets/firstDesign/challenges-2522/hill.svg";
import cloudA from "@/assets/firstDesign/challenges-2522/cloud-a.svg";
import cloudB from "@/assets/firstDesign/challenges-2522/cloud-b.svg";
import cloudC from "@/assets/firstDesign/challenges-2522/cloud-c.svg";
import cloudD from "@/assets/firstDesign/challenges-2522/cloud-d.svg";
import tree from "@/assets/firstDesign/challenges-2522/tree.svg";
import { ProductiveAnchorTodayScreen2476 } from "./ProductiveAnchorTodayScreen2476";

/** Figma 2522:85817 — Active Challenges & Habits sheet over Today. */
const POPPINS = "Poppins, ui-sans-serif, system-ui, sans-serif";
const SF = '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, Inter, sans-serif';

export function ProductiveChallengesScreen2522({ standalone = false }: { standalone?: boolean }) {
  return (
    <ProductiveAnchorTodayScreen2476
      standalone={standalone}
      figmaNode="2522:85817"
      overlay={<ChallengesOverlay />}
    />
  );
}

function ChallengesOverlay() {
  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 z-[2] h-[922px] w-[434px] -translate-x-1/2 -translate-y-1/2 overflow-clip bg-[rgba(27,11,23,0.4)] backdrop-blur-[6px]"
        data-node-id="2522:85816"
      >
        <div
          className="absolute left-[calc(50%-0.5px)] top-[350px] flex w-[189px] -translate-x-1/2 items-center justify-between rounded-[120px] bg-[rgba(255,255,255,0.1)] px-[24px] py-[8px]"
          style={{ fontFamily: SF }}
        >
          <Chip icon={bolt} iconClass="h-[20px] w-[12px]" label="Sprint" />
          <Chip icon={mood} iconClass="size-[24px] p-[3px]" label="Mood" />
          <Chip icon={block} iconClass="size-[24px]" label="Blockers" />
        </div>

        <div className="absolute left-[16px] top-[420px] flex h-[496px] w-[401px] flex-col items-start gap-[16px] overflow-clip rounded-tl-[24px] rounded-tr-[24px] bg-black px-[16px] pb-[20px] pt-[12px] shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.08)]">
          <img alt="" src={cloudA} className="absolute left-[294px] top-[400px] size-[108px]" />
          <img alt="" src={cloudB} className="absolute left-[321px] top-[421px] size-[87px]" />
          <img alt="" src={cloudC} className="absolute left-[302px] top-[10px] size-[92px]" />
          <img alt="" src={cloudD} className="absolute left-[346px] top-[31px] size-[66px]" />

          <div className="relative flex w-full shrink-0 items-start justify-center overflow-clip">
            <div className="h-[4px] w-[32px] shrink-0 rounded-[2px] bg-[rgba(222,222,222,0.5)]" />
          </div>

          <div className="relative flex w-full shrink-0 items-center gap-[8px] overflow-clip">
            <p
              data-inspect-id="challenges-title"
              className="min-w-0 flex-1 text-[20px] font-bold leading-[1.5] text-white"
              style={{ fontFamily: POPPINS }}
            >
              Active Challenges & Habits
            </p>
            <div
              data-inspect-id="challenges-close"
              className="flex size-[28px] shrink-0 items-center justify-center overflow-clip rounded-[14px] bg-black"
            >
              <img alt="" src={close} className="size-[18px]" />
            </div>
          </div>

          <div className="relative flex w-full shrink-0 flex-col items-start gap-[12px]">
            <div className="flex w-full flex-col items-start gap-[6px] overflow-clip">
              <p className="w-full text-[12px] font-normal leading-[1.5] text-white" style={{ fontFamily: POPPINS }}>
                2 ACTIVE CHALLENGES
              </p>
              <ChallengeCard
                inspectId="challenges-focus"
                title="7 Days of Focus"
                meta="3 of 7 days complete"
                percent="43%"
                bars={["#11c883", "#e29929", "#2295ff", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.2)"]}
              />
              <ChallengeCard
                title="Evening Reset"
                meta="2 of 5 days complete"
                percent="40%"
                bars={["#11c883", "#e29929", "#464646", "#464646", "#464646"]}
                padded
              />
            </div>

            <div className="flex w-full flex-col items-start gap-[4px] overflow-clip">
              <div className="flex w-full items-start justify-between whitespace-nowrap">
                <p className="text-[16px] font-semibold text-white" style={{ fontFamily: POPPINS }}>
                  Today’s habits
                </p>
                <p className="text-[9px] font-normal text-[#777]" style={{ fontFamily: POPPINS }}>
                  1 of 2 done
                </p>
              </div>
              <HabitRow pending label="25-minute focus block" tally="0/1" />
              <HabitRow label="Plan tomorrow" tally="1/1" />
            </div>
          </div>
        </div>

        <div className="absolute left-[-7px] top-[778px] flex h-[491px] w-[394.76px] items-center justify-center">
          <div className="-scale-y-100 rotate-180">
            <img alt="" src={hill} className="h-[491px] w-[394.76px]" />
          </div>
        </div>
      </div>

      <div className="absolute left-[calc(50%-0.5px)] top-[805px] z-[3] flex w-[331px] -translate-x-1/2 items-center justify-between">
        <div className="flex shrink-0 items-center gap-[12px]">
          <img alt="" src={calendar} className="size-[24px] shrink-0" />
          <img alt="" src={search} className="size-[24px] shrink-0" />
          <img alt="" src={analytics} className="size-[24px] shrink-0" />
        </div>
        <div className="flex size-[42px] shrink-0 items-center justify-center overflow-clip rounded-[24px] bg-[#5b8def]">
          <div className="relative size-[24px] shrink-0">
            <div className="absolute inset-[12.5%_12.5%_0.78%_12.5%]">
              <img alt="" src={add} className="absolute inset-0 block size-full max-w-none brightness-0 invert" />
            </div>
          </div>
        </div>
      </div>
      <img alt="" src={tree} className="absolute left-[calc(33.33%+12px)] top-[783px] z-[3] size-[66px]" />
    </>
  );
}

function Chip({ icon, iconClass, label }: { icon: string; iconClass: string; label: string }) {
  return (
    <div className="flex h-[37px] min-w-px flex-1 flex-col items-center justify-between">
      <img alt="" src={icon} className={`shrink-0 ${iconClass}`} />
      <p className="w-full text-center text-[12px] font-light leading-[1.1] text-[rgba(255,255,255,0.4)]">{label}</p>
    </div>
  );
}

function ChallengeCard({
  title,
  meta,
  percent,
  bars,
  padded = false,
  inspectId,
}: {
  title: string;
  meta: string;
  percent: string;
  bars: string[];
  padded?: boolean;
  inspectId?: string;
}) {
  return (
    <div
      data-inspect-id={inspectId}
      className={`flex w-full shrink-0 flex-col items-start gap-[3px] overflow-clip rounded-[8px] bg-[rgba(244,244,244,0.1)] ${padded ? "px-[10px] py-[12px]" : "p-[12px]"}`}
    >
      <div className="flex w-full items-center gap-[8px] overflow-clip">
        <p className="min-w-0 flex-1 text-[16px] font-semibold leading-[1.5] text-white" style={{ fontFamily: POPPINS }}>
          {title}
        </p>
        <img alt="" src={openChallenge} className="size-[16px] shrink-0" />
      </div>
      <div className="flex w-full items-start justify-between whitespace-nowrap text-[12px]">
        <p className="font-normal text-[#777]" style={{ fontFamily: POPPINS }}>
          {meta}
        </p>
        <p className="font-semibold text-[#11c883]" style={{ fontFamily: POPPINS }}>
          {percent}
        </p>
      </div>
      <div className="flex w-full items-center gap-[8px]">
        {bars.map((color, i) => (
          <div key={i} className="h-[6px] min-w-px flex-1 rounded-[16.069px]" style={{ background: color }} />
        ))}
      </div>
    </div>
  );
}

function HabitRow({ label, tally, pending = false }: { label: string; tally: string; pending?: boolean }) {
  return (
    <div className="flex h-[27px] w-full shrink-0 items-center gap-[8px] overflow-clip">
      {pending ? (
        <img alt="" src={habitPending} className="size-[16px] shrink-0" />
      ) : (
        <div className="relative size-[16px] shrink-0">
          <div className="absolute inset-[8.33%]">
            <div className="absolute inset-[-5.63%]">
              <img alt="" src={habitDone} className="block size-full max-w-none" />
            </div>
          </div>
        </div>
      )}
      <p className="min-w-0 flex-1 text-[12px] font-normal leading-[1.5] text-white" style={{ fontFamily: POPPINS }}>
        {label}
      </p>
      <p className="shrink-0 whitespace-nowrap text-[9px] font-normal text-[#777]" style={{ fontFamily: POPPINS }}>
        {tally}
      </p>
      <img alt="" src={openHabit} className="size-[16px] shrink-0" />
    </div>
  );
}
