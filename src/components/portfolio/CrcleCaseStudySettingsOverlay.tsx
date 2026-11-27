import personalMark from "@/assets/portfolio/mobile-folder/personal-mark.svg";
import settingsGear from "@/assets/crcle/case-study/settings-gear.svg";
import themeMoon from "@/assets/crcle/case-study/theme-moon.svg";
import themeSun from "@/assets/crcle/case-study/theme-sun.svg";
import { setCrclePhoneLight } from "@/lib/crcle-phone-theme";

type Props = {
  open: boolean;
  light: boolean;
  onClosed: () => void;
};

/** In-phone Settings overlay — Figma 3169:14397 (mobile CRCLE case study). */
export function CrcleCaseStudySettingsOverlay({ open, light, onClosed }: Props) {
  if (!open) return null;

  const pickDark = () => {
    setCrclePhoneLight(false);
    onClosed();
  };

  const pickLight = () => {
    setCrclePhoneLight(true);
    onClosed();
  };

  return (
    <div
      data-crcle-settings-ui
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      className="crcle-case-study-settings-overlay pointer-events-auto absolute inset-0 z-[75] isolate flex h-full w-full max-h-full max-w-full touch-none flex-col overflow-hidden"
    >
      <span aria-hidden className="crcle-case-study-settings-overlay__frost pointer-events-none absolute inset-0 z-0 size-full" />
      <button
        type="button"
        aria-label="Close settings"
        className="absolute inset-0 z-0 border-0 bg-transparent p-0"
        onClick={onClosed}
      />

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col items-center justify-center px-6">
        <div className="flex w-full max-w-[312px] flex-col items-center gap-[min(157px,22vh)]">
          <div className="flex flex-col items-center gap-3">
            <img src={settingsGear} alt="" width={36} height={36} className="size-9 shrink-0" aria-hidden />
            <p className="text-center text-[20px] font-normal leading-[1.2] text-white/50">Settings</p>
          </div>

          <div className="flex w-[270px] max-w-full items-center justify-between">
            <button
              type="button"
              onClick={pickDark}
              aria-pressed={!light}
              className="flex w-16 flex-col items-center gap-3 rounded-2xl border-0 bg-transparent p-0 text-left transition-transform active:scale-[0.97]"
            >
              <img src={themeMoon} alt="" width={64} height={64} className="size-16 shrink-0" aria-hidden />
              <span className="w-full text-center text-[20px] font-normal leading-[1.2] text-white/50">Dark</span>
            </button>
            <button
              type="button"
              onClick={pickLight}
              aria-pressed={light}
              className="flex w-16 flex-col items-end gap-3 rounded-2xl border-0 bg-transparent p-0 text-left transition-transform active:scale-[0.97]"
            >
              <img src={themeSun} alt="" width={64} height={64} className="size-16 shrink-0" aria-hidden />
              <span className="w-full text-center text-[20px] font-normal leading-[1.2] text-white/50">Light</span>
            </button>
          </div>
        </div>
      </div>

      <p className="relative z-[1] flex shrink-0 justify-center pb-6 pt-2" style={{ pointerEvents: "none" }} aria-hidden>
        <img src={personalMark} alt="" width={33} height={30} className="h-[30px] w-[33px] opacity-90" />
      </p>
    </div>
  );
}