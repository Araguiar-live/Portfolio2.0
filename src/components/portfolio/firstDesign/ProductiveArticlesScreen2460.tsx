import { cn } from "@/lib/utils";
import chat from "@/assets/firstDesign/articles-2460/chat.svg";
import article1 from "@/assets/firstDesign/articles-2460/article-1.png";
import article2 from "@/assets/firstDesign/articles-2460/article-2.png";
import article3 from "@/assets/firstDesign/articles-2460/article-3.png";
import ellipse1 from "@/assets/firstDesign/articles-2460/ellipse-1.svg";
import ellipse2 from "@/assets/firstDesign/articles-2460/ellipse-2.svg";
import ellipse3 from "@/assets/firstDesign/articles-2460/ellipse-3.svg";
import ellipse4 from "@/assets/firstDesign/articles-2460/ellipse-4.svg";
import ellipse5 from "@/assets/firstDesign/articles-2460/ellipse-5.svg";
import vector2 from "@/assets/firstDesign/articles-2460/vector-2.svg";
import statusBar from "@/assets/firstDesign/articles-2460/status-bar.svg";
import cloud1 from "@/assets/firstDesign/articles-2460/cloud-1.svg";
import cloud2 from "@/assets/firstDesign/articles-2460/cloud-2.svg";
import cloud3 from "@/assets/firstDesign/articles-2460/cloud-3.svg";
import cloud4 from "@/assets/firstDesign/articles-2460/cloud-4.svg";
import readArrow from "@/assets/firstDesign/articles-2460/read-arrow.svg";
import calendar from "@/assets/firstDesign/articles-2460/calendar.svg";
import searchNav from "@/assets/firstDesign/articles-2460/search-nav.svg";
import analytics from "@/assets/firstDesign/articles-2460/analytics.svg";
import add from "@/assets/firstDesign/articles-2460/add.svg";
import search from "@/assets/firstDesign/articles-2460/search.svg";
import clear from "@/assets/firstDesign/articles-2460/clear.svg";
import glasses from "@/assets/firstDesign/articles-2460/glasses.svg";
import { ProductiveArtboardStage } from "./productiveArtboardStage";

/** Figma 2460:49639 — iPhone 16 & 17 Pro - 11 (Articles search). */
const INTER = "Inter, ui-sans-serif, system-ui, sans-serif";
const SF = '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, Inter, sans-serif';
const GRID_LINE_COUNT = 28;
const TOPICS = ["Procrastination", "Sleep Deprivation", "Unhealthy Eating", "Binge Eating", "Doomscrolling"] as const;

export function ProductiveArticlesScreen2460({ standalone = false }: { standalone?: boolean }) {
  return (
    <ProductiveArtboardStage bg="#ffffff" standalone={standalone} figmaNode="2460:49639">
      <BlurOrb src={ellipse1} className="left-[-244px] top-[482px] size-[471px]" inset="-76.43%" />
      <BlurOrb src={ellipse4} className="left-[28px] top-[448px] size-[276px]" inset="-130.43%" />
      <BlurOrb src={ellipse5} className="left-[-118px] top-[179px] size-[276px]" inset="-130.43%" />
      <BlurOrb src={ellipse2} className="left-[-9px] top-[-23px] size-[471px]" inset="-76.43%" />
      <BlurOrb src={ellipse3} className="left-[calc(33.33%+51px)] top-[366px] size-[237px]" inset="-151.9%" />

      <div
        className="absolute left-[calc(50%-0.5px)] top-[calc(50%+0.5px)] h-[1031px] w-[511px] -translate-x-1/2 -translate-y-1/2 overflow-clip bg-[rgba(255,255,255,0.3)] backdrop-blur-[2px]"
        data-node-id="2460:49645"
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

      <div
        className="absolute left-[-30px] top-[82px] flex w-[461px] flex-col items-center gap-[16px]"
        style={{ fontFamily: INTER }}
      >
        <div
          data-inspect-id="articles-search"
          className="flex h-[34px] w-[385px] shrink-0 items-center justify-between overflow-clip rounded-[24px] bg-[rgba(255,255,255,0.4)] px-[12px] backdrop-blur-[2px]"
        >
          <img alt="" src={search} className="size-[13px] shrink-0" />
          <div className="flex items-center gap-px overflow-clip">
            <p className="text-[11px] font-normal leading-normal text-[#666]">Productive</p>
            <span className="h-[13px] w-px bg-[#666]" />
          </div>
          <img alt="" src={clear} className="size-[16px] shrink-0" />
        </div>

        <div className="flex w-full flex-col items-center gap-[15px]">
          <div className="flex h-[27px] items-center gap-[7px] overflow-clip">
            <div className="flex h-[27px] w-[87px] shrink-0 items-center justify-center rounded-[24px] bg-[#1b0b17]">
              <p className="text-[10px] font-normal text-white">Articles</p>
            </div>
            <div className="flex h-[27px] w-[87px] shrink-0 items-center justify-center rounded-[24px]">
              <div className="flex items-center gap-[5px] overflow-clip">
                <img alt="" src={glasses} className="h-[12px] w-[13px] shrink-0" />
                <p className="text-[10px] font-normal text-black">Secret Chats</p>
              </div>
            </div>
          </div>
          <div className="flex w-full items-start gap-[7px] overflow-clip">
            {TOPICS.map((topic) => (
              <div
                key={topic}
                className="flex h-[25px] shrink-0 items-center overflow-clip rounded-[24px] bg-[rgba(255,255,255,0.5)] px-[10px] backdrop-blur-[2px]"
              >
                <p className="whitespace-nowrap text-[9px] font-medium text-[#303030]">{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute left-[calc(50%-0.5px)] top-[217px] flex h-[567.21px] w-[385px] -translate-x-1/2 flex-col items-start gap-[8px] overflow-hidden">
        <div
          data-inspect-id="articles-card"
          className="relative flex w-full shrink-0 flex-col items-start overflow-clip rounded-[21.522px] bg-[#eaeaeb]"
        >
          <div className="relative flex h-[279.783px] w-[385px] shrink-0 flex-col items-start rounded-[24px] p-[8px]">
            <img
              alt=""
              src={article1}
              className="pointer-events-none absolute inset-0 size-full rounded-[24px] object-cover"
            />
            <div className="relative flex w-full flex-col items-center gap-[88px]">
              <div className="flex shrink-0 items-start overflow-clip rounded-[4.783px] bg-[#17b67b] px-[7.174px] py-[3.587px]">
                <p className="whitespace-nowrap text-[9.565px] font-normal leading-normal text-[#303030]" style={{ fontFamily: INTER }}>
                  Productivity
                </p>
              </div>
              <div className="relative flex w-full shrink-0 flex-col items-start gap-[5.978px] overflow-clip rounded-[20px] bg-[#1b0b17] p-[10.761px]">
                <div className="absolute left-[139.04px] top-[-39px] flex h-[329.359px] w-[250.743px] items-center justify-center">
                  <div className="rotate-[31.13deg]">
                    <div
                      className="h-[327.212px] w-[95.299px] rounded-[111.718px] backdrop-blur-[55.859px]"
                      style={{
                        backgroundImage:
                          "linear-gradient(199.425deg, rgba(34, 149, 255, 0.3) 10.908%, rgba(255, 255, 255, 0.03) 73.848%)",
                      }}
                    />
                  </div>
                </div>
                <div className="absolute left-[281.32px] top-[-13.9px] flex size-[87.574px] items-center justify-center">
                  <div className="-rotate-[103.34deg]">
                    <div className="flex items-center rounded-[146.278px] border border-solid border-[rgba(252,113,0,0.15)] bg-[rgba(245,167,0,0.5)] p-[12.19px] backdrop-blur-[18.55px]">
                      <div className="size-[46.375px] shrink-0 rounded-[51.055px] border border-solid border-[rgba(251,44,54,0.3)] bg-[#f5a700]" />
                    </div>
                  </div>
                </div>
                <img alt="" src={cloud1} className="absolute left-[260.04px] top-[-15px] size-[58px]" />
                <img alt="" src={cloud2} className="absolute left-[278.04px] top-[112px] size-[66px]" />
                <p className="relative w-full text-[15.543px] font-bold leading-[1.25] text-white" style={{ fontFamily: INTER }}>
                  How to Be Productive – 15 Days
                </p>
                <p className="relative w-full overflow-hidden text-ellipsis text-[13.152px] font-normal leading-[1.45] text-white" style={{ fontFamily: INTER }}>
                  A microdosed daily methodology using body doubling and cognitive psychology to dismantle procrastination loops.
                </p>
                <Discussion peers="36 peers are currently debating this methodology." />
              </div>
            </div>
          </div>
        </div>

        <ArticlePhotoCard
          photo={article2}
          badge="Psychology"
          badgeClass="bg-[#f5a700]"
          title="Breaking the Doomscroll Reflex"
          body="Neuroscience-backed pattern interruption that retrains your phone-checking muscle memory within 72 hours."
          peers="14.4K peers are currently debating this methodology."
          clouds
        />
        <ArticlePhotoCard
          photo={article3}
          badge="Binge Eating"
          badgeClass="bg-[#9c46cd]"
          title="Breaking the Doomscroll Reflex"
          body="Neuroscience-backed pattern interruption that retrains your phone-checking muscle memory within 72 hours."
          peers="14.4K peers are currently debating this methodology."
        />
      </div>

      <div className="absolute left-[calc(50%-0.5px)] top-[802px] flex w-[331px] -translate-x-1/2 items-center justify-between">
        <div className="flex shrink-0 items-center gap-[12px] rounded-[24px] bg-[rgba(255,255,255,0.3)] px-[16px] py-[8px] backdrop-blur-[8px]">
          <img alt="" src={calendar} className="size-[24px] shrink-0" />
          <img alt="" src={searchNav} className="size-[24px] shrink-0" />
          <img alt="" src={analytics} className="size-[24px] shrink-0" />
        </div>
        <div
          data-inspect-id="articles-fab"
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

function ArticlePhotoCard({
  photo,
  badge,
  badgeClass,
  title,
  body,
  peers,
  clouds = false,
}: {
  photo: string;
  badge: string;
  badgeClass: string;
  title: string;
  body: string;
  peers: string;
  clouds?: boolean;
}) {
  return (
    <div className="relative flex h-[279.427px] w-[385px] shrink-0 flex-col items-start p-[8px]">
      <div className="absolute left-0 top-0 flex h-[279.427px] w-[385px] flex-col items-start overflow-clip rounded-[21.495px]">
        <img
          alt=""
          src={photo}
          className="pointer-events-none absolute inset-0 size-full rounded-tl-[21.495px] rounded-tr-[21.495px] object-cover"
        />
      </div>
      <div className="relative flex min-h-px w-full flex-1 flex-col items-center justify-between">
        <div className={cn("flex shrink-0 items-start overflow-clip rounded-[4.777px] px-[7.165px] py-[3.582px]", badgeClass)}>
          <p className="whitespace-nowrap text-[9.553px] leading-normal text-[#303030]" style={{ fontFamily: SF }}>
            {badge}
          </p>
        </div>
        <div className="relative flex w-full shrink-0 flex-col items-start gap-[5.971px] overflow-clip rounded-[20px] bg-[#1b0b17] p-[10.747px]">
          {clouds ? (
            <>
              <img alt="" src={cloud3} className="absolute left-[-9px] top-[60.5px] size-[102px]" />
              <img alt="" src={cloud4} className="absolute left-[13px] top-[82.5px] size-[80px]" />
            </>
          ) : null}
          <p className="relative w-full text-[15.524px] font-bold leading-[1.25] text-white" style={{ fontFamily: INTER }}>
            {title}
          </p>
          <p className="relative w-full overflow-hidden text-ellipsis text-[13.136px] font-normal leading-[1.45] text-white" style={{ fontFamily: INTER }}>
            {body}
          </p>
          <Discussion peers={peers} />
        </div>
      </div>
    </div>
  );
}

function Discussion({ peers }: { peers: string }) {
  return (
    <div className="relative flex w-full shrink-0 flex-col items-center gap-[3.587px] overflow-clip rounded-[16px] bg-[rgba(255,255,255,0.05)] p-[4.783px] backdrop-blur-[6px]">
      <div className="flex w-full items-center justify-center gap-[4.783px] overflow-clip">
        <img alt="" src={chat} className="size-[12px] shrink-0" />
        <p className="whitespace-nowrap text-[9.565px] font-normal leading-[1.2] text-white" style={{ fontFamily: INTER }}>
          {peers}
        </p>
      </div>
      <div className="flex items-center gap-[4.777px] overflow-clip rounded-[28.659px] px-[8px] py-[4px]">
        <p className="whitespace-nowrap text-[10.747px] font-semibold leading-normal text-white" style={{ fontFamily: INTER }}>
          Read full discussion
        </p>
        <img alt="" src={readArrow} className="size-[11.941px] shrink-0" />
      </div>
    </div>
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
