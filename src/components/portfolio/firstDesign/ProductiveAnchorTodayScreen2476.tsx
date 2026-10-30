import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import calendar from "@/assets/firstDesign/today-2447/calendar.svg";
import tree68 from "@/assets/firstDesign/today-2447/tree-68.svg";
import settings from "@/assets/firstDesign/today-2447/settings.svg";
import menu from "@/assets/firstDesign/today-2447/menu.svg";
import ellipse1 from "@/assets/firstDesign/today-2447/ellipse-1.svg";
import ellipse2 from "@/assets/firstDesign/today-2447/ellipse-2.svg";
import ellipse3 from "@/assets/firstDesign/today-2447/ellipse-3.svg";
import ellipse4 from "@/assets/firstDesign/today-2447/ellipse-4.svg";
import ellipse5 from "@/assets/firstDesign/today-2447/ellipse-5.svg";
import vector2 from "@/assets/firstDesign/today-2447/vector-2.svg";
import statusBar from "@/assets/firstDesign/today-2447/status-bar.svg";
import cloud1 from "@/assets/firstDesign/today-2447/cloud-1.svg";
import cloud2 from "@/assets/firstDesign/today-2447/cloud-2.svg";
import tree30 from "@/assets/firstDesign/today-2447/tree-30.svg";
import cloud3 from "@/assets/firstDesign/today-2447/cloud-3.svg";
import cloud4 from "@/assets/firstDesign/today-2447/cloud-4.svg";
import search from "@/assets/firstDesign/today-2447/search.svg";
import analytics from "@/assets/firstDesign/today-2447/analytics.svg";
import add from "@/assets/firstDesign/today-2447/add.svg";
import bolt from "@/assets/firstDesign/today-2447/bolt.svg";
import mood from "@/assets/firstDesign/today-2447/mood.svg";
import block from "@/assets/firstDesign/today-2447/block.svg";
import partner from "@/assets/firstDesign/anchor-2476/partner.png";
import ellipse159 from "@/assets/firstDesign/anchor-2476/ellipse-159.svg";
import ellipse160 from "@/assets/firstDesign/anchor-2476/ellipse-160.svg";
import ellipse161 from "@/assets/firstDesign/anchor-2476/ellipse-161.svg";
import mountain from "@/assets/firstDesign/anchor-2476/mountain.svg";
import gaugeTrack from "@/assets/firstDesign/anchor-2476/gauge-track.svg";
import gaugeProgress from "@/assets/firstDesign/anchor-2476/gauge-progress.svg";
import handshake from "@/assets/firstDesign/anchor-2476/handshake.svg";
import chevronDown from "@/assets/firstDesign/anchor-2476/chevron-down.svg";
import chevronDownWhite from "@/assets/firstDesign/anchor-2476/chevron-down-white.svg";
import arrowRight from "@/assets/firstDesign/anchor-2476/arrow-right.svg";
import challengesMark from "@/assets/firstDesign/anchor-2476/challenges-mark.svg";
import { ProductiveArtboardStage } from "./productiveArtboardStage";
import { ProductiveTodayLandscapeHills } from "./ProductiveComingSoonWireframe2317";

/** Figma 2476:50380 — iPhone 16 & 17 Pro (Today + Primary Anchor). */
const SF = '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, Inter, sans-serif';
const ARIMO = "Arimo, Arial, sans-serif";
const POPPINS = "Poppins, ui-sans-serif, system-ui, sans-serif";
const INTER = "Inter, ui-sans-serif, system-ui, sans-serif";
const GRID_LINE_COUNT = 28;

const WEEKDAYS = [
  { label: "Mon", w: "w-[44.51px]", pl: "pl-[4px]", align: "items-start" },
  { label: "Tue", w: "w-[44.513px]", pl: "", align: "items-center" },
  { label: "Wed", w: "w-[44.513px]", pl: "", align: "items-center" },
  { label: "Thu", w: "w-[45.785px]", pl: "", align: "items-center" },
  { label: "Fri", w: "w-[44.513px]", pl: "", align: "items-center" },
  { label: "Sat", w: "w-[48.328px]", pl: "pl-[3.815px]", align: "items-center" },
  { label: "Sun", w: "w-[54.687px]", pl: "", align: "items-center" },
  { label: "Mon", w: "w-[37.518px]", pl: "pl-[6.359px]", align: "items-center" },
] as const;

const DATES = [
  { label: "23", w: "w-[44.51px]", pl: "pl-[4px]", align: "items-start", selected: false },
  { label: "24", w: "w-[44.513px]", pl: "", align: "items-center", selected: false },
  { label: "25", w: "w-[44.513px]", pl: "", align: "items-center", selected: false },
  { label: "26", w: "w-[45.785px]", pl: "", align: "items-center", selected: false },
  { label: "27", w: "w-[44.513px]", pl: "", align: "items-center", selected: false },
  { label: "28", w: "w-[48.328px]", pl: "pl-[3.815px]", align: "items-center", selected: false },
  { label: "29", w: "w-[54.687px]", pl: "", align: "items-center", selected: true },
  { label: "30", w: "w-[37.518px]", pl: "pl-[6.359px]", align: "items-center", selected: false },
] as const;

export function ProductiveAnchorTodayScreen2476({
  standalone = false,
  overlay,
  figmaNode = "2476:50380",
}: {
  standalone?: boolean;
  overlay?: ReactNode;
  figmaNode?: string;
}) {
  return (
    <ProductiveArtboardStage bg="#ffffff" standalone={standalone} figmaNode={figmaNode}>
      <BlurOrb src={ellipse1} className="left-[-244px] top-[482px] size-[471px]" inset="-76.43%" />
      <BlurOrb src={ellipse4} className="left-[28px] top-[448px] size-[276px]" inset="-130.43%" />
      <BlurOrb src={ellipse5} className="left-[-118px] top-[179px] size-[276px]" inset="-130.43%" />
      <BlurOrb src={ellipse2} className="left-[-9px] top-[-23px] size-[471px]" inset="-76.43%" />
      <BlurOrb src={ellipse3} className="left-[calc(33.33%+51px)] top-[366px] size-[237px]" inset="-151.9%" />

      <div
        className="absolute left-[calc(50%-0.5px)] top-[calc(50%+0.5px)] h-[1031px] w-[511px] -translate-x-1/2 -translate-y-1/2 overflow-clip bg-[rgba(255,255,255,0.3)] backdrop-blur-[2px]"
        data-node-id="2476:50386"
      >
        <div className="absolute left-[119px] top-[70px] flex w-[429px] items-center justify-between">
          <div className="flex h-[884.5px] w-[598px] shrink-0 flex-col items-start justify-between">
            {Array.from({ length: GRID_LINE_COUNT }).map((_, i) => (
              <div key={i} className="relative h-0 w-full shrink-0">
                <div className="absolute inset-[-1px_0]">
                  <img alt="" src={vector2} className="block size-full max-w-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute left-[calc(50%-0.42px)] top-[30px] h-[11.408px] w-[331.158px] -translate-x-1/2">
        <img alt="" src={statusBar} className="absolute inset-0 block size-full max-w-none" />
      </div>

      <div className="absolute left-[8px] top-[66px] flex w-[386px] items-center justify-between">
        <div className="flex shrink-0 items-center rounded-[64px] bg-[#f5a700] p-[10px]">
          <img alt="" src={menu} className="size-[24px] shrink-0" />
        </div>
        <p
          className="h-[32px] min-w-0 flex-1 text-center text-[24px] font-medium leading-[48.936px] text-black"
          style={{ fontFamily: SF }}
        >
          Today
        </p>
        <div className="flex w-[44px] shrink-0 flex-col items-end justify-center px-[4px] py-[7px]">
          <div className="relative h-[10px] w-[16px] shrink-0">
            <div className="absolute inset-[-10%_-6.25%]">
              <img alt="" src={settings} className="block size-full max-w-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-[calc(33.33%+18px)] top-[119px] flex h-[283.377px] w-[341.589px] items-center justify-center">
        <div className="-rotate-[54.73deg]">
          <div
            className="relative h-[346px] w-[102.364px] rounded-[120px] backdrop-blur-[60px]"
            style={{
              backgroundImage:
                "linear-gradient(199.145deg, rgba(0, 0, 0, 0.1) 10.908%, rgba(34, 149, 255, 0.1) 73.848%)",
            }}
          />
        </div>
      </div>
      <div className="absolute left-[calc(33.33%+52.45px)] top-[151.82px] flex items-center rounded-[157.122px] bg-[rgba(245,167,0,0.5)] p-[13.093px] backdrop-blur-[19.925px]">
        <div className="size-[49.813px] shrink-0 rounded-[54.84px] bg-[#f5a700]" />
      </div>
      <img alt="" src={cloud1} className="absolute left-[calc(33.33%-2px)] top-[179px] size-[92px]" />
      <div className="absolute left-[-21px] top-[116px] flex size-[126px] items-center justify-center">
        <div className="-scale-y-100 rotate-180">
          <img alt="" src={cloud2} className="size-[126px]" />
        </div>
      </div>
      <img alt="" src={tree68} className="absolute left-0 top-[282px] size-[68px]" />
      <img alt="" src={tree30} className="absolute left-[calc(33.33%-2px)] top-[301px] size-[30px]" />
      <img alt="" src={cloud3} className="absolute left-[calc(66.67%-6px)] top-[282px] size-[102px]" />
      <img alt="" src={cloud4} className="absolute left-[calc(66.67%+16px)] top-[304px] size-[80px]" />
      <ProductiveTodayLandscapeHills />

      <div
        className="absolute left-1/2 top-[100px] flex w-[386px] -translate-x-1/2 flex-col items-start overflow-clip"
        style={{ fontFamily: ARIMO }}
      >
        <div className="flex h-[25.436px] w-full items-end justify-between overflow-clip">
          {WEEKDAYS.map((day, i) => (
            <div
              key={`dot-${day.label}-${i}`}
              className={cn("flex h-full shrink-0 flex-col overflow-clip", day.w, day.pl, day.align)}
            >
              {day.label === "Sun" ? (
                <div className="size-[5.087px] shrink-0 rounded-[1.272px] bg-[#e29929]" />
              ) : (
                <p className="shrink-0 text-[7.631px] font-bold uppercase leading-[10.174px] text-transparent">
                  {day.label}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex h-[25.436px] w-full items-end justify-between overflow-clip">
          {WEEKDAYS.map((day, i) => (
            <div
              key={`wd-${day.label}-${i}`}
              className={cn(
                "flex h-full shrink-0 flex-col justify-center overflow-clip",
                day.w,
                day.pl,
                day.align,
              )}
            >
              <p className="shrink-0 text-[7.631px] font-bold uppercase leading-[10.174px] text-[#595959]">
                {day.label}
              </p>
            </div>
          ))}
        </div>
        <div className="flex h-[40.062px] w-full items-start justify-between overflow-clip">
          {DATES.map((day, i) => (
            <div
              key={`dt-${day.label}-${i}`}
              className={cn("flex h-full shrink-0 flex-col overflow-clip", day.w, day.pl, day.align)}
            >
              <p
                className={cn(
                  "shrink-0 whitespace-nowrap text-[20.349px] leading-[20.349px]",
                  day.selected ? "font-bold text-black" : "font-normal text-[#2e3038]",
                )}
              >
                {day.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute left-1/2 top-[335px] flex w-[386px] -translate-x-1/2 flex-col items-start gap-[8px]">
        <div className="flex w-full flex-col items-center gap-[8px]">
          <div
            className="flex w-[189px] shrink-0 items-center justify-between rounded-[120px] bg-[rgba(255,255,255,0.1)] px-[24px] py-[8px]"
            style={{ fontFamily: SF }}
          >
            <Chip icon={bolt} iconClass="h-[20px] w-[12px]" label="Sprint" />
            <Chip icon={mood} iconClass="size-[24px] p-[3px]" label="Mood" />
            <Chip icon={block} iconClass="size-[24px]" label="Blockers" />
          </div>

          <div className="relative flex h-[260px] w-full shrink-0 flex-col items-center justify-center gap-[16px] overflow-clip rounded-[20px] bg-black p-[16px]">
            <img alt="" src={ellipse159} className="absolute left-[321px] top-[86px] size-[7px]" />
            <div className="absolute left-[301.47px] top-[136.35px] flex h-[11.619px] w-[21.183px] items-center justify-center">
              <div className="-rotate-[21.38deg]">
                <div className="h-[4.219px] w-[21.096px] rounded-[16.069px] bg-[#11c883]" />
              </div>
            </div>
            <img alt="" src={ellipse161} className="absolute left-[230px] top-[142px] size-[7px]" />
            <img alt="" src={ellipse160} className="absolute left-[360px] top-[183px] size-[7px]" />
            <div className="absolute left-[266.3px] top-[187.39px] flex h-[18.541px] w-[17.205px] items-center justify-center">
              <div className="-rotate-[131.79deg]">
                <div className="h-[4.219px] w-[21.096px] rounded-[16.069px] bg-[#e29929]" />
              </div>
            </div>
            <div className="absolute left-[188px] top-[235.23px] flex h-[10.52px] w-[21.369px] items-center justify-center">
              <div className="rotate-[162.04deg]">
                <div className="h-[4.219px] w-[21.096px] rounded-[16.069px] bg-[#2295ff]" />
              </div>
            </div>
            <img alt="" src={mountain} className="pointer-events-none absolute left-[-28px] top-[-29px] h-[110px] w-[105px] -rotate-[31deg] opacity-90" />

            <div
              data-inspect-id="anchor-day"
              className="relative flex h-[80px] w-full shrink-0 items-center justify-between"
            >
              <div className="flex h-full shrink-0 flex-col items-start justify-between" style={{ fontFamily: POPPINS }}>
                <p className="whitespace-nowrap text-[16px] font-normal text-[rgba(255,255,255,0.4)]">PRIMARY ANCHOR</p>
                <p className="text-[36px] font-bold text-white">Day 27</p>
              </div>
              <div className="relative h-[69.503px] w-[91.989px] shrink-0">
                <div className="absolute left-[3.55px] top-0 h-[42.928px] w-[83.812px]">
                  <div className="absolute inset-[-3.57%_-1.83%_0]">
                    <img alt="" src={gaugeTrack} className="block size-full max-w-none" />
                  </div>
                </div>
                <div className="absolute left-[45.99px] top-0 h-[42.928px] w-[41.906px]">
                  <div className="absolute inset-[-4.76%_-4.88%]">
                    <img alt="" src={gaugeProgress} className="block size-full max-w-none" />
                  </div>
                </div>
                <p
                  className="absolute left-[calc(50%-25.01px)] top-[20.44px] whitespace-nowrap text-[24px] font-normal leading-[1.3] text-white"
                  style={{ fontFamily: INTER }}
                >
                  50%
                </p>
                <div
                  className="absolute left-[45.99px] top-[49.06px] w-[91.989px] -translate-x-1/2 text-center text-[12px] font-normal text-[rgba(255,255,255,0.4)]"
                  style={{ fontFamily: INTER }}
                >
                  <p className="mb-0 leading-[1.2]">Current</p>
                  <p className="leading-[1.2]">Productivity</p>
                </div>
              </div>
            </div>

            <div className="relative flex shrink-0 items-center gap-[6px] rounded-[8px] bg-[rgba(255,255,255,0.4)] py-[4px] pl-[8px] pr-[6px]">
              <div className="relative size-[16px] shrink-0">
                <div className="absolute inset-[5.84%_9.36%_8.33%]">
                  <img alt="" src={handshake} className="absolute inset-[-2.55%_0_-5.46%] block size-full max-w-none" />
                </div>
              </div>
              <p className="whitespace-nowrap text-[10px] font-semibold text-[rgba(255,255,255,0.4)]" style={{ fontFamily: POPPINS }}>
                Awakening Core • Day 3
              </p>
              <img alt="" src={chevronDown} className="size-[16px] shrink-0" />
            </div>

            <div
              data-inspect-id="anchor-partner"
              className="relative flex w-full shrink-0 items-center gap-[12px]"
            >
              <div className="relative size-[42px] shrink-0 overflow-hidden rounded-[46px] border border-solid border-white">
                <img alt="" src={partner} className="absolute inset-0 size-full object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-[2px] whitespace-nowrap" style={{ fontFamily: SF }}>
                <p className="text-[8px] font-normal text-[#777]">PARTNER STATUS</p>
                <p className="text-[16px] font-bold text-white">Rhythmous Penguin</p>
                <p className="text-[10px] font-normal text-[#777]">In The Trenches Together</p>
              </div>
            </div>

            <button
              type="button"
              data-inspect-id="anchor-cta"
              className="relative flex w-full shrink-0 items-center justify-between rounded-[38.232px] border-[1.529px] border-solid border-[#e29929] bg-[#e29929] px-[26px] py-[8px]"
            >
              <span className="min-w-0 flex-1 text-[24px] font-normal leading-[1.1] text-black" style={{ fontFamily: POPPINS }}>
                Begin Session
              </span>
              <img alt="" src={arrowRight} className="size-[24px] shrink-0" />
            </button>
          </div>
        </div>

        <div
          data-inspect-id="anchor-challenges"
          className="relative flex w-full shrink-0 flex-col items-start gap-[12px] overflow-clip rounded-[20px] border border-solid border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.2)] p-[16px]"
        >
          <img alt="" src={challengesMark} className="absolute left-[315px] top-[-7px] size-[70px]" />
          <div className="relative flex w-full items-center justify-between">
            <p className="whitespace-nowrap text-[14px] font-bold text-white" style={{ fontFamily: POPPINS }}>
              Active Challenges & Habits
            </p>
            <img alt="" src={chevronDownWhite} className="size-[20px] shrink-0" />
          </div>
        </div>
      </div>

      <div className="absolute left-[calc(50%-0.5px)] top-[801px] flex w-[331px] -translate-x-1/2 items-center justify-between">
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
      {overlay}
    </ProductiveArtboardStage>
  );
}

function BlurOrb({ src, className, inset }: { src: string; className: string; inset: string }) {
  return (
    <div className={cn("absolute", className)}>
      <div className="absolute" style={{ inset }}>
        <img alt="" src={src} className="block size-full max-w-none" />
      </div>
    </div>
  );
}

function Chip({ icon, iconClass, label }: { icon: string; iconClass: string; label: string }) {
  return (
    <div className="flex h-[37px] min-w-px flex-1 flex-col items-center justify-between">
      <img alt="" src={icon} className={cn("shrink-0", iconClass)} />
      <p className="w-full text-center text-[12px] font-light leading-[1.1] text-[rgba(255,255,255,0.4)]">{label}</p>
    </div>
  );
}
