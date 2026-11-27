import { ChevronDown, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode, type RefObject } from "react";
import { CrcleScreenToolbar, DemoToolbar } from "@/components/portfolio/CrcleDemoToolbar";
import { useOdicciMobileLayout } from "@/components/portfolio/OdicciMobileLayout";
import { cn } from "@/lib/utils";

/** Figma Odicci onboarding viewport (65:94009 and siblings). */
export const ODICCI_FRAME_W = 1512;
export const ODICCI_FRAME_H = 982;

const FONT = "Poppins, ui-sans-serif, system-ui, sans-serif";
const ACCENT = "#FF5126";

type Theme = "dark" | "light";

interface OdicciBrowserFrameProps {
  tabLabel: string;
  stepLabel?: string;
  url: string;
  canvasClassName?: string;
  theme?: Theme;
  onToggleTheme?: () => void;
  showThemeToggle?: boolean;
  toolbarExtra?: ReactNode;
  stageRef?: RefObject<HTMLDivElement | null>;
  onStagePointerDown?: () => void;
  demo?: {
    playing: boolean;
    codeOn: boolean;
    onPlay: () => void;
    onDesign: () => void;
    onCode: () => void;
  };
  /** Mobile embed — hover the browser shell to arm PhoneDevInspection (same as CRCLE preview card). */
  prototypeDevHover?: {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => void;
    onPointerLeave: (event: PointerEvent<HTMLElement>) => void;
  };
  children: ReactNode;
}

/**
 * Shared carousel shell for every Odicci tab:
 * browser chrome + fixed 1512×982 artboard scaled uniformly (object-fit: contain).
 */
export function OdicciBrowserFrame({
  tabLabel,
  stepLabel = "V2",
  url,
  canvasClassName = "bg-[#ffe4e4]",
  theme = "dark",
  onToggleTheme,
  showThemeToggle = true,
  toolbarExtra,
  stageRef: stageRefProp,
  onStagePointerDown,
  demo,
  prototypeDevHover,
  children,
}: OdicciBrowserFrameProps) {
  const mobileLayout = useOdicciMobileLayout();
  const embed = mobileLayout?.embed ?? false;
  const toolbarBelow = mobileLayout?.toolbarBelow ?? false;
  const fallbackStageRef = useRef<HTMLDivElement>(null);
  const stageRef = stageRefProp ?? fallbackStageRef;
  const [scale, setScale] = useState(1);
  const isDark = theme === "dark";

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width < 2 || height < 2) return;
      setScale(Math.min(width / ODICCI_FRAME_W, height / ODICCI_FRAME_H));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [embed]);

  const toolbar = demo ? (
    <DemoToolbar
      playing={demo.playing}
      codeOn={demo.codeOn}
      onPlay={demo.onPlay}
      onDesign={demo.onDesign}
      onCode={demo.onCode}
      className={embed ? "mb-0 mt-0" : "mb-3"}
    />
  ) : (
    <CrcleScreenToolbar className={embed ? "mb-0 mt-0" : "mb-3"} />
  );

  const browserShell = (
    <div
      {...(embed ? prototypeDevHover : {})}
      className={cn(
        "odicci-browser-frame-shell relative w-full min-w-0 overflow-hidden bg-white",
        embed
          ? "rounded-[14px] border border-zinc-200/80 shadow-[0_8px_24px_rgba(11,14,20,0.12)]"
          : "rounded-2xl border border-white/10 shadow-2xl shadow-black/40",
      )}
      style={{ fontFamily: FONT }}
    >
      {/* Title bar */}
      <div
        className={cn(
          "flex min-w-0 items-center border-b border-zinc-200 bg-white",
          embed ? "h-7 gap-1 px-2" : "h-10 px-4",
        )}
      >
        <div className="flex shrink-0 items-center gap-[5px]">
          <span className={embed ? "size-2 rounded-full bg-[#FF5F57] shadow-inner" : "size-3 rounded-full bg-[#FF5F57] shadow-inner"} />
          <span className={embed ? "size-2 rounded-full bg-[#FEBC2E] shadow-inner" : "size-3 rounded-full bg-[#FEBC2E] shadow-inner"} />
          <span className={embed ? "size-2 rounded-full bg-[#28C840] shadow-inner" : "size-3 rounded-full bg-[#28C840] shadow-inner"} />
        </div>
        <div className={cn("flex h-full min-w-0 flex-1 items-end", embed ? "pl-1.5" : "pl-5")}>
          <div
            className={cn(
              "flex min-w-0 items-center gap-1 rounded-t-lg border-x border-t border-zinc-200 bg-zinc-100",
              embed ? "h-5 max-w-[min(100%,148px)] px-1.5" : "h-8 gap-2 px-3.5",
            )}
          >
            <span className={embed ? "size-2 shrink-0 rounded-full" : "size-3.5 rounded-full"} style={{ background: ACCENT }} />
            <span
              className={cn(
                "min-w-0 truncate font-medium tracking-tight text-zinc-900",
                embed ? "text-[8px] leading-none" : "text-[12px]",
              )}
            >
              {tabLabel}
            </span>
            <span className={cn("shrink-0 text-zinc-500", embed ? "text-[7px]" : "ml-1 text-[10px]")}>✕</span>
          </div>
          <span
            className={cn(
              "flex shrink-0 items-center justify-center leading-none text-zinc-800",
              embed ? "size-4 text-[11px]" : "size-7 text-base",
            )}
          >
            +
          </span>
        </div>
        <div className={cn("shrink-0 tabular-nums text-zinc-500", embed ? "text-[8px]" : "text-[11px]")}>
          {stepLabel}
        </div>
      </div>

      {/* Toolbar */}
      <div
        className={cn(
          "odicci-browser-frame-nav flex min-w-0 items-center border-b border-zinc-200 bg-white",
          embed ? "h-6 gap-0.5 px-1.5" : "h-11 gap-2 px-3",
        )}
      >
        <ChevronDown className={cn("shrink-0 rotate-90 text-zinc-400", embed ? "size-2.5" : "size-4")} />
        <ChevronDown className={cn("shrink-0 -rotate-90 text-zinc-900", embed ? "size-2.5" : "size-4")} />
        {toolbarExtra}
        <div
          className={cn(
            "flex min-w-0 flex-1 basis-0 items-center rounded-md border border-zinc-200 bg-zinc-100",
            embed ? "h-[18px] px-1.5" : "h-[30px] gap-2 px-3",
          )}
        >
          <span
            className={cn(
              "min-w-0 truncate tracking-tight text-zinc-500",
              embed ? "text-[9px] leading-none" : "text-[13px]",
            )}
          >
            {url}
          </span>
        </div>
        {/* Flex 0.25 : 1 → address bar uses 80% of free toolbar width */}
        <span aria-hidden className="min-w-0 shrink flex-[0.25] basis-0" />
        <span className={cn("shrink-0 leading-none tracking-widest text-zinc-500", embed ? "text-[10px]" : "text-base")}>
          ···
        </span>
        {showThemeToggle && onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex size-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        )}
      </div>

      {/* Viewport — aspect locked to Figma; children designed at 1512×982 */}
      <div
        ref={stageRef}
        onPointerDownCapture={onStagePointerDown}
        className={`relative aspect-[1512/982] w-full overflow-hidden ${canvasClassName}`}
      >
        <div
          className="absolute left-1/2 top-1/2 origin-center"
          style={{
            width: ODICCI_FRAME_W,
            height: ODICCI_FRAME_H,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "odicci-browser-frame-root flex w-full min-w-0 flex-col",
        embed ? "max-w-full items-stretch gap-2" : "max-w-[980px] items-center",
      )}
    >
      {!toolbarBelow ? toolbar : null}
      {browserShell}
      {toolbarBelow ? toolbar : null}
    </div>
  );
}
