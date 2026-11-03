import bolt from "@/assets/firstDesign/today-2447/bolt.svg";
import mood from "@/assets/firstDesign/today-2447/mood.svg";
import block from "@/assets/firstDesign/today-2447/block.svg";
import calendar from "@/assets/firstDesign/today-2447/calendar.svg";
import search from "@/assets/firstDesign/today-2447/search.svg";
import analytics from "@/assets/firstDesign/today-2447/analytics.svg";
import add from "@/assets/firstDesign/today-2447/add.svg";
import close from "@/assets/firstDesign/challenges-2522/close.svg";
import hill from "@/assets/firstDesign/challenges-2522/hill.svg";
import arrowRight from "@/assets/firstDesign/anchor-2476/arrow-right.svg";
import cloud92 from "@/assets/firstDesign/energy-2522/cloud-92.svg";
import cloud66Left from "@/assets/firstDesign/energy-2522/cloud-66-left.svg";
import cloud66Right from "@/assets/firstDesign/energy-2522/cloud-66-right.svg";
import cloud47 from "@/assets/firstDesign/energy-2522/cloud-47.svg";
import sleep from "@/assets/firstDesign/energy-2522/sleep.svg";
import { ProductiveAnchorTodayScreen2476 } from "./ProductiveAnchorTodayScreen2476";

/** Figma 2522:86443 — Energy evolution sheet over Today. */
const POPPINS = "Poppins, ui-sans-serif, system-ui, sans-serif";
const SF = '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, Inter, sans-serif';

export function ProductiveEnergyEvolutionScreen2522({ standalone = false }: { standalone?: boolean }) {
  return (
    <ProductiveAnchorTodayScreen2476
      standalone={standalone}
      figmaNode="2522:86443"
      overlay={<EnergyOverlay />}
    />
  );
}

function EnergyOverlay() {
  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 z-[2] h-[922px] w-[434px] -translate-x-1/2 -translate-y-1/2 overflow-clip bg-[rgba(27,11,23,0.4)] backdrop-blur-[6px]"
        data-node-id="2522:86628"
      >
        <div className="absolute left-[-7px] top-[778px] flex h-[491px] w-[394.76px] items-center justify-center">
          <div className="-scale-y-100 rotate-180">
            <img alt="" src={hill} className="h-[491px] w-[394.76px]" />
          </div>
        </div>

        <div className="absolute left-[16px] top-[297px] flex w-[401px] flex-col items-center gap-[9px]">
          <div
            className="relative flex w-[189px] shrink-0 items-center justify-between rounded-[120px] bg-[rgba(255,255,255,0.1)] px-[24px] py-[8px]"
            style={{ fontFamily: SF }}
          >
            <Chip icon={bolt} iconClass="h-[20px] w-[12px]" label="Sprint" padded />
            <Chip icon={mood} iconClass="size-[24px] p-[3px]" label="Mood" />
            <Chip icon={block} iconClass="size-[24px]" label="Blockers" />
          </div>

          <div className="relative flex w-full shrink-0 flex-col items-start gap-[16px] overflow-clip rounded-tl-[24px] rounded-tr-[24px] bg-black px-[16px] pb-[84px] pt-[12px] shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.08)]">
            <div className="absolute left-[-46.3px] top-[22px] flex h-[564.755px] w-[424.33px] items-center justify-center">
              <div
                className="relative h-[614.995px] w-[97.643px] overflow-hidden rounded-[120px] backdrop-blur-[60px]"
                style={{
                  rotate: "33.93deg",
                  backgroundImage:
                    "linear-gradient(212.9deg, rgba(91, 141, 239, 0.1) 10.91%, rgba(34, 149, 255, 0.1) 73.85%)",
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[120px] p-px"
                  style={{
                    background: "linear-gradient(270deg, rgba(34, 149, 255, 0.3), rgba(20, 89, 153, 0.3))",
                    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
              </div>
            </div>

            <div className="absolute left-[271.45px] top-[51.82px] flex items-center rounded-[157.122px] bg-[rgba(245,167,0,0.5)] p-[13.093px] backdrop-blur-[19.925px]">
              <div className="size-[49.813px] shrink-0 rounded-[54.84px] border border-solid border-[#fb2c36] bg-[#f5a700]" />
            </div>
            <FrostedClouds />

            <div className="relative flex w-full shrink-0 items-start justify-center overflow-clip">
              <div className="h-[4px] w-[32px] shrink-0 rounded-[2px] bg-[rgba(222,222,222,0.5)]" />
            </div>

            <div className="relative flex w-full shrink-0 items-center gap-[8px] overflow-clip">
              <p
                data-inspect-id="energy-title"
                className="min-w-0 flex-1 text-[20px] font-bold leading-[1.5] text-white"
                style={{ fontFamily: POPPINS }}
              >
                Energy evolution
              </p>
              <div className="flex size-[28px] shrink-0 items-center justify-center overflow-clip rounded-[14px] bg-black">
                <img alt="" src={close} className="size-[18px]" />
              </div>
            </div>

            <div className="relative flex w-full shrink-0 flex-col items-start gap-[4px] overflow-clip leading-[1.5]" style={{ fontFamily: POPPINS }}>
              <p className="w-full text-[12px] font-normal text-[#777]">CURRENT IDENTITY · DAY 3</p>
              <p className="w-full text-[20px] font-bold text-white">Awakening Core</p>
              <p className="w-full text-[12px] font-normal text-[#777]">
                You are building momentum. Keep your daily focus blocks consistent to unlock the next state.
              </p>
            </div>

            <div className="relative flex w-full shrink-0 flex-col items-start gap-[10px] overflow-clip rounded-[12px] bg-[#181818] p-[12px]">
              <img alt="" src={sleep} className="absolute left-[303px] top-[10px] size-[66px]" />
              <div className="relative flex w-full items-baseline justify-between overflow-clip whitespace-nowrap" style={{ fontFamily: POPPINS }}>
                <p className="text-[14px] font-bold text-white">Inertia Sloth State</p>
                <p className="text-[12px] font-semibold text-[#2295ff]">43%</p>
              </div>
              <div className="relative flex h-[5px] w-full items-start overflow-clip rounded-[3px] bg-[#2c2c2c]">
                <div className="h-[5px] w-[114.857px] shrink-0 rounded-[3px] bg-[#2295ff]" />
              </div>
            </div>

            <div
              data-inspect-id="energy-track"
              className="relative flex w-full shrink-0 flex-col items-start gap-[6px] overflow-clip rounded-[12px] bg-[#1a1a1a] p-[12px]"
            >
              <div className="relative flex w-full items-start gap-[8px] overflow-clip whitespace-nowrap text-[9px]" style={{ fontFamily: POPPINS }}>
                <p className="shrink-0 font-normal text-white">IDENTITY EVOLUTION TRACK</p>
                <p className="shrink-0 font-normal text-[#777]">Day 0 → Day 3</p>
              </div>
              <div className="relative flex w-full items-center gap-[4px] overflow-clip">
                <div className="flex w-[57px] shrink-0 flex-col items-start gap-[2px] overflow-clip text-[12px]" style={{ fontFamily: POPPINS }}>
                  <p className="w-full font-normal text-[#777]">DAY 0</p>
                  <p className="w-full font-semibold text-[#252525]">Baseline Sloth</p>
                </div>
                <div className="flex shrink-0 items-center gap-[8px]">
                  <div className="h-[6px] w-[63.4px] shrink-0 rounded-[16.069px] bg-[#11c883]" />
                  <div className="h-[6px] w-[63.4px] shrink-0 rounded-[16.069px] bg-[#e29929]" />
                  <div className="h-[6px] w-[63.4px] shrink-0 rounded-[16.069px] bg-[#2295ff]" />
                </div>
                <div className="flex w-[72px] shrink-0 flex-col items-start gap-[2px] overflow-clip text-[12px]" style={{ fontFamily: POPPINS }}>
                  <p className="whitespace-nowrap font-normal text-[#777]">DAY 3</p>
                  <p className="w-full font-semibold text-[#252525]">Awakening Core</p>
                </div>
              </div>
              <p className="w-full text-[9px] font-normal leading-[1.5] text-[#777]" style={{ fontFamily: POPPINS }}>
                Consistency unlocks the next identity state. Keep your daily focus blocks on track.
              </p>
            </div>

            <button
              type="button"
              data-inspect-id="energy-cta"
              className="relative flex w-full shrink-0 items-center justify-between rounded-[38.232px] border-[1.529px] border-solid border-[#e29929] bg-[#e29929] px-[26px] py-[8px]"
            >
              <span className="min-w-0 flex-1 text-[24px] font-normal leading-[1.1] text-black" style={{ fontFamily: POPPINS }}>
                Continue Session
              </span>
              <img alt="" src={arrowRight} className="size-[24px] shrink-0" />
            </button>
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
    </>
  );
}

/** Solid cloud silhouette so the frost covers the whole shape, not the 40% white fill. */
const CLOUD_MASK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 92" preserveAspectRatio="none"><path fill="white" d="M49.5727 18.0473C42.2433 18.0473 35.811 21.85 32.1233 27.577C29.0284 26.7613 25.7952 26.6147 22.6392 27.1469C19.4831 27.679 16.4768 28.8778 13.8205 30.6633C11.1642 32.4487 8.91898 34.7798 7.23449 37.5013C5.54999 40.2227 4.46491 43.272 4.05157 46.4457C3.63824 49.6195 3.90613 52.845 4.8374 55.9071C5.76868 58.9692 7.34194 61.7976 9.45232 64.2039C11.5627 66.6101 14.1617 68.5389 17.0762 69.8617C19.9907 71.1844 23.1536 71.8708 26.3542 71.875H71.0048C73.2963 71.8855 75.5667 71.4371 77.6822 70.5563C79.7976 69.6754 81.7153 68.3799 83.3221 66.7461C84.9289 65.1123 86.1924 63.1734 87.0379 61.0436C87.8835 58.9138 88.2941 56.6362 88.2454 54.3452C88.1968 52.0542 87.69 49.7962 86.7548 47.7041C85.8196 45.6121 84.475 43.7285 82.8003 42.1644C81.1256 40.6003 79.1547 39.3874 77.0038 38.597C74.8529 37.8067 72.5655 37.4551 70.2765 37.5628C69.9637 32.284 67.6462 27.324 63.7977 23.6972C59.9493 20.0704 54.8608 18.0469 49.5727 18.0473Z"/></svg>`,
)}`;

const CLOUD_MASK_STYLE = {
  maskImage: `url("${CLOUD_MASK}")`,
  WebkitMaskImage: `url("${CLOUD_MASK}")`,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
} as const;

function FrostedClouds() {
  return (
    <>
      <FrostedCloud src={cloud92} blurClass="backdrop-blur-[4px]" className="left-[302px] top-[10px] size-[92px]" />
      <FrostedCloud src={cloud66Left} blurClass="backdrop-blur-[2.87px]" className="left-[211.09px] top-[74px] size-[66px]" />
      <FrostedCloud src={cloud66Right} blurClass="backdrop-blur-[4px]" className="left-[346px] top-[31px] size-[66px]" />
      <FrostedCloud src={cloud47} blurClass="backdrop-blur-[2.87px]" className="left-[242.65px] top-[89.07px] size-[47.348px]" />
    </>
  );
}

function FrostedCloud({
  src,
  className,
  blurClass,
}: {
  src: string;
  className: string;
  blurClass: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      <div aria-hidden className={`absolute inset-0 ${blurClass}`} style={CLOUD_MASK_STYLE} />
      <img alt="" src={src} className="pointer-events-none absolute inset-0 size-full" />
    </div>
  );
}

function Chip({
  icon,
  iconClass,
  label,
  padded = false,
}: {
  icon: string;
  iconClass: string;
  label: string;
  padded?: boolean;
}) {
  return (
    <div className={`flex h-[37px] min-w-px flex-1 flex-col items-center justify-between ${padded ? "pt-[2px]" : ""}`}>
      <img alt="" src={icon} className={`shrink-0 ${iconClass}`} />
      <p className="w-full text-center text-[12px] font-light leading-[1.1] text-[rgba(255,255,255,0.4)]">{label}</p>
    </div>
  );
}
