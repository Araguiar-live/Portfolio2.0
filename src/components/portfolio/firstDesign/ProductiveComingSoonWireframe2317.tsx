import { cn } from "@/lib/utils";
import bedtime from "@/assets/firstDesign/today-2447/bedtime.svg";
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
import desktop from "@/assets/firstDesign/today-2447/desktop.svg";
import time from "@/assets/firstDesign/today-2447/time.svg";
import bolt from "@/assets/firstDesign/today-2447/bolt.svg";
import mood from "@/assets/firstDesign/today-2447/mood.svg";
import block from "@/assets/firstDesign/today-2447/block.svg";
import { ProductiveArtboardStage } from "./productiveArtboardStage";

/** Figma 2447:49208 — iPhone 16 & 17 Pro - 10 (Today home). */
const SF = '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, Inter, sans-serif';
const ARIMO = "Arimo, Arial, sans-serif";
const GRID_LINE_COUNT = 28;

/** Rectangle 9 — 2454:49491. Path peaks at y≈-59 — pad so the dome isn’t clipped. */
const HILL9_PATH =
  "M0 11.4743C41.9362 225.376 48.7259 -58.7849 256.522 11.4744C464.318 81.7337 417.477 585 417.477 585H0L0 11.4743Z";
const HILL9_PAD_TOP = 59;

/** Rectangle 7 — 2447:49447. Black peak at y≈-112. */
const HILL7_PATH =
  "M0 37.9507C51.5 282.451 185 -111.885 543 32.9508L467 558.45H24L0 37.9507Z";
const HILL7_PAD_TOP = 112;

/**
 * Rectangle 8 — 2447:49454 after Figma `-scale-y-100 rotate-180` (scaleX -1).
 * Path peaks at y≈-56. Valley on the right reveals hill-7.
 */
const HILL8_PATH =
  "M443 11.0238C398.5 216.524 220.5 -56.4761 0 11.0237V562.024H443L443 11.0238Z";
const HILL8_PAD_TOP = 57;

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

export function ProductiveComingSoonWireframe2317({ standalone = false }: { standalone?: boolean }) {
  return (
    <ProductiveArtboardStage bg="#ffffff" standalone={standalone} figmaNode="2447:49208">
      <BlurOrb src={ellipse1} className="left-[-244px] top-[482px] size-[471px]" inset="-76.43%" />
      <BlurOrb src={ellipse4} className="left-[28px] top-[448px] size-[276px]" inset="-130.43%" />
      <BlurOrb src={ellipse5} className="left-[-118px] top-[179px] size-[276px]" inset="-130.43%" />
      <BlurOrb src={ellipse2} className="left-[-9px] top-[-23px] size-[471px]" inset="-76.43%" />
      <BlurOrb src={ellipse3} className="left-[calc(33.33%+51px)] top-[366px] size-[237px]" inset="-151.9%" />

      <div
        className="absolute left-[calc(50%-0.5px)] top-[calc(50%+0.5px)] h-[1031px] w-[511px] -translate-x-1/2 -translate-y-1/2 overflow-clip bg-[rgba(255,255,255,0.3)] backdrop-blur-[2px]"
        data-node-id="2447:49214"
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

      <div
        className="absolute left-[calc(50%-0.42px)] top-[30px] h-[11.408px] w-[331.158px] -translate-x-1/2"
        data-node-id="2447:49260"
      >
        <img alt="" src={statusBar} className="absolute inset-0 block size-full max-w-none" />
      </div>

      <div
        className="absolute left-[8px] top-[66px] flex w-[386px] items-center justify-between"
        data-node-id="2454:49484"
      >
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

      <div
        className="absolute left-[calc(33.33%+18px)] top-[119px] flex h-[283.377px] w-[341.589px] items-center justify-center"
        data-node-id="2454:49496"
      >
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

      <div
        className="absolute left-[calc(33.33%+52.45px)] top-[151.82px] flex items-center rounded-[157.122px] bg-[rgba(245,167,0,0.5)] p-[13.093px] backdrop-blur-[19.925px]"
        data-node-id="2454:49493"
      >
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
        data-inspect-id="today-week"
        data-node-id="2457:698"
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
                  "shrink-0 text-[20.349px] leading-[20.349px] whitespace-nowrap",
                  day.selected ? "font-bold text-black" : "font-normal text-[#2e3038]",
                )}
              >
                {day.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute left-1/2 top-[438px] flex -translate-x-1/2 items-center gap-[39px]"
        data-node-id="2454:49539"
        style={{ fontFamily: SF }}
      >
        <p className="shrink-0 text-center text-[16px] font-light leading-[1.1] text-white">Morning</p>
        <div className="flex shrink-0 items-center justify-center rounded-[64px] bg-[rgba(255,255,255,0.3)] px-[16px] py-[6px]">
          <p className="text-center text-[16px] font-light leading-[1.1] text-white">Afternoon</p>
        </div>
        <p className="shrink-0 text-center text-[16px] font-light leading-[1.1] text-white">Evening</p>
      </div>

      <div
        className="absolute left-[8px] top-[516px] flex w-[386px] flex-col items-center gap-[16px]"
        data-node-id="2459:49636"
        style={{ fontFamily: SF }}
      >
        <p className="w-full text-center text-[16px] font-light leading-[1.1] text-white">Anytime</p>
        <div className="flex w-full flex-col items-start gap-[8px]">
          <div className="flex w-full shrink-0 items-center gap-[16px] rounded-[16px] border border-solid border-[rgba(255,255,255,0.4)] py-[4px] pl-[24px] pr-[4px]">
            <img alt="" src={desktop} className="size-[32px] shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
              <p className="w-full text-[24px] font-light leading-[1.1] text-white">Study online</p>
              <div className="flex w-full items-center gap-[8px]">
                <span className="size-[8px] shrink-0 rounded-[2px] bg-[#11c883]" />
                <p className="min-w-0 flex-1 text-[16px] font-light leading-[1.1] text-white">Anytime</p>
              </div>
            </div>
            <div className="flex h-[55px] shrink-0 flex-col items-center justify-between rounded-[12px] bg-[rgba(255,255,255,0.2)] px-[6px] py-[8px]">
              <img alt="" src={time} className="size-[24px] shrink-0" />
              <p className="text-center text-[12px] font-light leading-[1.1] text-white">25m</p>
            </div>
          </div>
          <div className="flex w-full shrink-0 items-center gap-[16px] rounded-[16px] border border-solid border-[rgba(255,255,255,0.4)] py-[4px] pl-[24px] pr-[4px]">
            <img alt="" src={bedtime} className="size-[32px] shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
              <p className="w-full text-[24px] font-light leading-[1.1] text-white">Sleep for 8 hours</p>
              <div className="flex w-full items-center gap-[8px]">
                <span className="size-[8px] shrink-0 rounded-[2px] bg-[#e29929]" />
                <p className="min-w-0 flex-1 text-[16px] font-light leading-[1.1] text-white">New</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute left-[calc(50%-0.5px)] top-[727px] flex w-[189px] -translate-x-1/2 items-center justify-between rounded-[120px] bg-[rgba(255,255,255,0.1)] px-[24px] py-[8px]"
        data-inspect-id="today-mood"
        data-node-id="2454:49630"
        style={{ fontFamily: SF }}
      >
        <Chip icon={bolt} iconClass="h-[20px] w-[12px]" label="Sprint" />
        <Chip icon={mood} iconClass="size-[24px] p-[3px]" label="Mood" />
        <Chip icon={block} iconClass="size-[24px]" label="Blockers" />
      </div>

      <div
        className="absolute left-[calc(50%-0.5px)] top-[801px] flex w-[331px] -translate-x-1/2 items-center justify-between"
        data-node-id="2447:49446"
      >
        <div className="flex shrink-0 items-center gap-[12px]">
          <img alt="" src={calendar} className="size-[24px] shrink-0" />
          <img alt="" src={search} className="size-[24px] shrink-0" />
          <img alt="" src={analytics} className="size-[24px] shrink-0" />
        </div>
        <div
          data-inspect-id="today-fab"
          className="flex size-[42px] shrink-0 items-center justify-center overflow-clip rounded-[24px] bg-[#5b8def]"
        >
          <div className="relative size-[24px] shrink-0">
            <div className="absolute inset-[12.5%_12.5%_0.78%_12.5%]">
              <img alt="" src={add} className="absolute inset-0 block size-full max-w-none brightness-0 invert" />
            </div>
          </div>
        </div>
      </div>
    </ProductiveArtboardStage>
  );
}

/**
 * Hill vectors overflow their Figma layer boxes (negative-y peaks).
 * `<img>` and CSS clip-path clip that overflow — pad the viewBox instead so
 * the silhouette matches Figma 2447:49208 / 2476:50380.
 */
function LandscapeHill({
  left,
  top,
  width,
  height,
  padTop,
  path,
  fill,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
  padTop: number;
  path: string;
  fill: string;
}) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute max-w-none overflow-visible"
      style={{ left, top: top - padTop, width, height: height + padTop }}
      width={width}
      height={height + padTop}
      viewBox={`0 ${-padTop} ${width} ${height + padTop}`}
      overflow="visible"
      preserveAspectRatio="none"
      fill="none"
    >
      <path d={path} fill={fill} />
    </svg>
  );
}

/** Shared Today landscape — grey mound, black right peak, wine overlay. */
export function ProductiveTodayLandscapeHills() {
  return (
    <>
      <LandscapeHill
        left={-54}
        top={326}
        width={422}
        height={585}
        padTop={HILL9_PAD_TOP}
        path={HILL9_PATH}
        fill="rgba(34, 13, 29, 0.4)"
      />
      <LandscapeHill
        left={-35}
        top={343.55}
        width={543}
        height={558.45}
        padTop={HILL7_PAD_TOP}
        path={HILL7_PATH}
        fill="#000000"
      />
      <LandscapeHill
        left={-35}
        top={337}
        width={443}
        height={562.024}
        padTop={HILL8_PAD_TOP}
        path={HILL8_PATH}
        fill="rgba(34, 13, 29, 0.8)"
      />
    </>
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
      <p className="w-full text-center text-[12px] font-light leading-[1.1] text-[rgba(255,255,255,0.4)]">
        {label}
      </p>
    </div>
  );
}
