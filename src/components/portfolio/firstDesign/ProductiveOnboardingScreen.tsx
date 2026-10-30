import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import treeDeciduous from "@/assets/firstDesign/onboarding-2476/tree-deciduous.svg";
import ellipse1 from "@/assets/firstDesign/onboarding-2476/ellipse-1.svg";
import ellipse2 from "@/assets/firstDesign/onboarding-2476/ellipse-2.svg";
import ellipse3 from "@/assets/firstDesign/onboarding-2476/ellipse-3.svg";
import ellipse4 from "@/assets/firstDesign/onboarding-2476/ellipse-4.svg";
import ellipse5 from "@/assets/firstDesign/onboarding-2476/ellipse-5.svg";
import vector2 from "@/assets/firstDesign/onboarding-2476/vector-2.svg";
import cloud1 from "@/assets/firstDesign/onboarding-2476/cloud-1.svg";
import cloud2 from "@/assets/firstDesign/onboarding-2476/cloud-2.svg";
import cloud3 from "@/assets/firstDesign/onboarding-2476/cloud-3.svg";
import cloud4 from "@/assets/firstDesign/onboarding-2476/cloud-4.svg";
import cloud5 from "@/assets/firstDesign/onboarding-2476/cloud-5.svg";
import cloud6 from "@/assets/firstDesign/onboarding-2476/cloud-6.svg";
import ellipse158 from "@/assets/firstDesign/onboarding-2476/ellipse-158.svg";
import ellipse159 from "@/assets/firstDesign/onboarding-2476/ellipse-159.svg";
import ellipse160 from "@/assets/firstDesign/onboarding-2476/ellipse-160.svg";
import statusBar from "@/assets/firstDesign/onboarding-2476/status-bar.svg";
import ellipse1700 from "@/assets/firstDesign/onboarding-2476/ellipse-1700.svg";
import ellipse1701 from "@/assets/firstDesign/onboarding-2476/ellipse-1701.svg";
import ellipse1702 from "@/assets/firstDesign/onboarding-2476/ellipse-1702.svg";
import rectangle8 from "@/assets/firstDesign/onboarding-2476/rectangle-8.svg";
import elements from "@/assets/firstDesign/onboarding-2476/elements.svg";
import ellipse161 from "@/assets/firstDesign/onboarding-2476/ellipse-161.svg";
import ellipse162 from "@/assets/firstDesign/onboarding-2476/ellipse-162.svg";
import ellipse163 from "@/assets/firstDesign/onboarding-2476/ellipse-163.svg";
import arrowRight from "@/assets/firstDesign/onboarding-2476/arrow-right.svg";

/** Figma 2476:50120 — iPhone 16 & 17 Pro - 12 (Begin Session) */
export const PRODUCTIVE_ONBOARDING_FIGMA_W = 402;
export const PRODUCTIVE_ONBOARDING_FIGMA_H = 874;
export const PRODUCTIVE_ONBOARDING_ASPECT =
  PRODUCTIVE_ONBOARDING_FIGMA_W / PRODUCTIVE_ONBOARDING_FIGMA_H;
export const PRODUCTIVE_ONBOARDING_RADIUS = 53;

const FONT = "Poppins, ui-sans-serif, system-ui, sans-serif";

type ProductiveOnboardingScreenProps = {
  compact?: boolean;
  standalone?: boolean;
};

const GRID_LINE_COUNT = 28;

export function ProductiveOnboardingScreen({
  standalone = false,
}: ProductiveOnboardingScreenProps) {

  const stageRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ scale: 1, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (width === 0 || height === 0) return;
      const scale = Math.max(
        width / PRODUCTIVE_ONBOARDING_FIGMA_W,
        height / PRODUCTIVE_ONBOARDING_FIGMA_H,
      );
      setLayout({
        scale,
        offsetX: (width - PRODUCTIVE_ONBOARDING_FIGMA_W * scale) / 2,
        offsetY: (height - PRODUCTIVE_ONBOARDING_FIGMA_H * scale) / 2,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scale, offsetX, offsetY } = layout;

  return (
    <div
      ref={stageRef}
      className="absolute inset-0 overflow-hidden bg-white"
      style={standalone ? { borderRadius: PRODUCTIVE_ONBOARDING_RADIUS * scale } : undefined}
      data-figma-node="2476:50120"
    >
      <div
        className="absolute left-0 top-0 origin-top-left overflow-hidden bg-white"
        style={{
          width: PRODUCTIVE_ONBOARDING_FIGMA_W,
          height: PRODUCTIVE_ONBOARDING_FIGMA_H,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          fontFamily: FONT,
          borderRadius: standalone ? PRODUCTIVE_ONBOARDING_RADIUS : undefined,
        }}
        data-productive-onboarding-artboard
      >
        <BlurOrb src={ellipse1} className="left-[-244px] top-[482px] size-[471px]" inset="-76.43%" nodeId="2476:50121" />
        <BlurOrb src={ellipse4} className="left-[calc(33.33%+1px)] top-[324px] size-[276px]" inset="-130.43%" nodeId="2476:50122" />
        <BlurOrb src={ellipse5} className="left-[-118px] top-[179px] size-[276px]" inset="-130.43%" nodeId="2476:50123" />
        <BlurOrb src={ellipse2} className="left-[-9px] top-[-23px] size-[471px]" inset="-76.43%" nodeId="2476:50124" />
        <BlurOrb src={ellipse3} className="left-[calc(33.33%+51px)] top-[366px] size-[237px]" inset="-151.9%" nodeId="2476:50125" />

        <div
          className="absolute left-[calc(50%-0.5px)] top-[calc(50%+0.5px)] h-[1031px] w-[511px] -translate-x-1/2 -translate-y-1/2 overflow-clip bg-[rgba(255,255,255,0.3)] backdrop-blur-[2px]"
          data-node-id="2476:50126"
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
          className="absolute left-[calc(33.33%+18px)] top-[119px] flex h-[283.377px] w-[341.589px] items-center justify-center"
          data-node-id="2476:50198"
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
          data-node-id="2476:50199"
        >
          <div className="size-[49.813px] shrink-0 rounded-[54.84px] bg-[#f5a700]" data-node-id="2476:50200" />
        </div>

        <img alt="" src={cloud1} className="absolute left-[calc(33.33%-2px)] top-[179px] size-[92px]" data-node-id="2476:50201" />
        <div className="absolute left-[-21px] top-[116px] flex size-[126px] items-center justify-center" data-node-id="2476:50202">
          <div className="-scale-y-100 rotate-180">
            <img alt="" src={cloud2} className="size-[126px]" />
          </div>
        </div>
        <img alt="" src={cloud3} className="absolute left-[calc(66.67%+8px)] top-[362px] size-[102px]" data-node-id="2476:50205" />
        <img alt="" src={cloud4} className="absolute left-[calc(66.67%+36px)] top-[390px] size-[74px]" data-node-id="2515:85356" />

        <div
          className="absolute left-1/2 top-[116.88px] flex size-[48px] -translate-x-1/2 flex-col items-center justify-center rounded-[8.17px] bg-[#140811] p-[10.213px]"
          data-inspect-id="app-mark"
          data-node-id="2476:50331"
        >
          <div className="flex w-full flex-col items-start gap-[4.085px]">
            <MarkRow src={ellipse158} bar="bg-[#11c883]" />
            <MarkRow src={ellipse159} bar="bg-[#e29929]" />
            <MarkRow src={ellipse160} bar="bg-[#2295ff]" />
          </div>
        </div>

        <div className="absolute left-[calc(50%-0.42px)] top-[30px] h-[11.35px] w-[331.158px] -translate-x-1/2" data-node-id="2476:50172">
          <img alt="" src={statusBar} className="absolute inset-0 block size-full max-w-none" />
        </div>

        {standalone ? (
          <div
            className="absolute left-1/2 top-[11px] h-[26.239px] w-[87.465px] -translate-x-1/2 rounded-[26.239px] bg-black"
            aria-hidden
          />
        ) : null}

        <img
          alt=""
          src={treeDeciduous}
          className="absolute left-[calc(16.67%+17px)] top-[355px] size-[68px]"
          data-node-id="2476:50207"
        />
        <img alt="" src={cloud5} className="absolute left-[calc(50%+19px)] top-[405px] size-[55px]" data-node-id="2476:50206" />

        <img alt="" src={ellipse1700} className="absolute left-[calc(33.33%-5px)] top-[413px] h-[356.664px] w-[370px]" data-node-id="2515:85352" />
        <img alt="" src={ellipse1702} className="absolute left-[-81px] top-[394px] h-[449px] w-[402px]" data-node-id="2518:85366" />
        <img alt="" src={ellipse1701} className="absolute left-[-3px] top-[411px] h-[448.649px] w-[383px]" data-node-id="2515:85354" />

        <div className="absolute left-[-5px] top-[423px] flex h-[563px] w-[463px] items-center justify-center" data-node-id="2476:50119">
          <div className="-scale-y-100 rotate-180">
            <img alt="" src={rectangle8} className="h-[563px] w-[463px]" />
          </div>
        </div>

        <div className="absolute inset-[52.4%_41.29%_32.84%_34.08%] flex items-center justify-center" data-node-id="2476:50114">
          <div className="-scale-x-100 size-full">
            <div className="relative size-full">
              <div className="absolute inset-[-2.45%_-4.8%_-3.68%_-4.8%]">
                <img alt="" src={elements} className="block size-full max-w-none" />
              </div>
            </div>
          </div>
        </div>

        <img alt="" src={ellipse161} className="absolute left-[calc(33.33%-5px)] top-[591px] size-[10px]" data-node-id="2476:50360" />
        <div className="absolute left-[calc(50%+31px)] top-[583px] flex h-[16.846px] w-[30.71px] items-center justify-center" data-node-id="2476:50359">
          <div className="-rotate-[21.38deg]">
            <div className="h-[6.117px] w-[30.585px] rounded-[55.053px] bg-[#11c883]" />
          </div>
        </div>
        <img alt="" src={ellipse162} className="absolute left-[calc(66.67%+49px)] top-[651px] size-[10px]" data-node-id="2476:50357" />
        <img alt="" src={ellipse163} className="absolute left-[calc(66.67%-8px)] top-[510px] size-[10px]" data-node-id="2476:50356" />
        <div className="absolute left-[calc(16.67%+0.49px)] top-[726.35px] flex h-[15.251px] w-[30.981px] items-center justify-center" data-node-id="2476:50355">
          <div className="rotate-[162.04deg]">
            <div className="h-[6.117px] w-[30.585px] rounded-[55.053px] bg-[#2295ff]" />
          </div>
        </div>
        <div className="absolute left-[calc(33.33%+47px)] top-[657px] flex h-[26.88px] w-[24.943px] items-center justify-center" data-node-id="2476:50354">
          <div className="-rotate-[131.79deg]">
            <div className="h-[6.117px] w-[30.585px] rounded-[55.053px] bg-[#e29929]" />
          </div>
        </div>

        <p
          className="absolute left-1/2 top-[688px] -translate-x-1/2 whitespace-nowrap text-center text-[16px] font-normal leading-[48.936px] text-white"
          data-inspect-id="headline"
          data-node-id="2476:50361"
        >
          Tap to never look back
        </p>

        <img
          alt=""
          src={treeDeciduous}
          className="absolute left-[calc(66.67%-6px)] top-[405px] size-[59px]"
          data-node-id="2476:50208"
        />
        <img alt="" src={cloud6} className="absolute left-[calc(66.67%+12px)] top-[449px] size-[29px]" data-node-id="2515:85359" />

        <button
          type="button"
          className="absolute left-1/2 top-[782px] flex w-[254px] -translate-x-1/2 items-center justify-between rounded-[38.232px] border-[1.529px] border-solid border-[#e29929] bg-[#e29929] px-[26px] py-[8px]"
          data-inspect-id="primary-cta"
          data-node-id="2476:50371"
        >
          <span className="min-w-0 flex-1 text-[24px] font-normal leading-[1.1] text-black">Begin Session</span>
          <img alt="" src={arrowRight} className="size-[24px] shrink-0" />
        </button>

        {standalone ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[53px] p-px"
            style={{
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.9), rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.7))",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function BlurOrb({
  src,
  className,
  inset,
  nodeId,
}: {
  src: string;
  className: string;
  inset: string;
  nodeId: string;
}) {
  return (
    <div className={cn("absolute", className)} data-node-id={nodeId}>
      <div className="absolute" style={{ inset }}>
        <img alt="" src={src} className="block size-full max-w-none" />
      </div>
    </div>
  );
}

function MarkRow({ src, bar }: { src: string; bar: string }) {
  return (
    <div className="flex w-full items-center gap-[3.064px]">
      <img alt="" src={src} className="size-[4.085px] shrink-0" />
      <span className={cn("h-[4.085px] w-[20.426px] rounded-[36.766px]", bar)} />
    </div>
  );
}
