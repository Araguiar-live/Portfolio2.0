import { useEffect, useState } from "react";
import { OdicciBrowserFrame } from "@/components/portfolio/OdicciBrowserFrame";
import { OdicciBusinessProfile } from "@/components/portfolio/OdicciBusinessProfile";
import { OdicciBrandVibe } from "@/components/portfolio/OdicciBrandVibe";
import { OdicciBrandPalette } from "@/components/portfolio/OdicciBrandPalette";
import { OdicciBrandFonts } from "@/components/portfolio/OdicciBrandFonts";
import { OdicciDemoChrome } from "@/components/portfolio/OdicciDemoChrome";
import { useOdicciDemo } from "@/components/portfolio/useOdicciDemo";

/**
 * OdicciColourPalette — Brand Personality tab orchestrator.
 * business (713:199885) → vibe (727:200380) → colour (733:200840) → fonts (735:201375).
 */

export function OdicciColourPalette({ onBackToWorkspace }: { onBackToWorkspace?: () => void }) {
  const [stage, setStage] = useState<"business" | "vibe" | "palette" | "fonts">("business");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [brandColors, setBrandColors] = useState({
    primary: "#6466F1",
    secondary: "#9294FE",
    accent: "#FF5126",
  });
  const demo = useOdicciDemo();

  useEffect(() => {
    if (demo.paused) return;
    const ctx = demo.arm();
    let cancelled = false;
    const alive = () => !cancelled && ctx.alive();

    const settle = async (selector: string) => {
      for (let i = 0; i < 24; i += 1) {
        if (!alive()) return false;
        if (ctx.find(selector)) return true;
        await ctx.wait(50);
      }
      return false;
    };

    const labelOf = (trigger: string) =>
      ctx.find(trigger)?.querySelector("span")?.textContent?.trim() ?? "";

    const choose = async (trigger: string, option: string, expected: string) => {
      if (!alive()) return;
      if (labelOf(trigger) === expected) return;
      await ctx.press(trigger);
      if (!(await settle(option))) return;
      await ctx.press(option);
      await ctx.wait(220);
      if (labelOf(trigger) !== expected && alive()) {
        ctx.find(option)?.click();
        await ctx.wait(220);
      }
    };

    const run = async () => {
      await ctx.wait(420);
      while (alive()) {
        setStage("business");
        if (!(await settle('[data-demo-target="brand-industry"]'))) continue;
        await choose(
          '[data-demo-target="brand-industry"]',
          '[data-demo-target="brand-industry-Beauty"]',
          "Beauty",
        );
        if (!alive()) return;
        await choose(
          '[data-demo-target="brand-niche"]',
          '[data-demo-target="brand-niche-Skincare"]',
          "Skincare",
        );
        if (!alive()) return;
        if (await ctx.typeInto('[data-demo-target="brand-other"]', "Kidswear")) await ctx.wait(280);
        if (!alive()) return;
        await ctx.press('[data-demo-target="brand-continue"]');
        setStage("vibe");
        if (!(await settle('[data-demo-target="vibe-tone"]'))) continue;
        await choose(
          '[data-demo-target="vibe-tone"]',
          '[data-demo-target="vibe-tone-Playful"]',
          "Playful",
        );
        if (!alive()) return;
        await choose(
          '[data-demo-target="vibe-aesthetic"]',
          '[data-demo-target="vibe-aesthetic-Organic"]',
          "Organic",
        );
        if (!alive()) return;
        if (await ctx.typeInto('[data-demo-target="vibe-other"]', "Soft and playful")) await ctx.wait(280);
        if (!alive()) return;
        await ctx.press('[data-demo-target="brand-continue"]');
        setStage("palette");
        if (!(await settle('[data-demo-target="palette-Blue"]'))) continue;
        if (await ctx.press('[data-demo-target="palette-Blue"]')) await ctx.wait(1100);
        if (!alive()) return;
        await ctx.press('[data-demo-target="brand-continue"]');
        setStage("fonts");
        if (!(await settle('[data-demo-target="font-heading"]'))) continue;
        if (await ctx.press('[data-demo-target="font-heading"]')) await ctx.wait(220);
        if (!alive()) return;
        if (await ctx.press('[data-demo-target="font-body"]')) await ctx.wait(220);
        if (!alive()) return;
        if (await ctx.typeInto('[data-demo-target="font-preview"]', "Summer drop")) await ctx.wait(1200);
      }
    };

    void run();
    return () => {
      cancelled = true;
      demo.clearTouch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo.paused, demo.run]);

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const stepLabel =
    stage === "business"
      ? "3/7"
      : stage === "vibe"
        ? "4/7"
        : stage === "palette"
          ? "5/7"
          : "6/7";

  return (
    <OdicciBrowserFrame
      tabLabel="odicci | Brand Personality"
      stepLabel={stepLabel}
      url="odicci.com/onboarding/brand"
      theme={theme}
      onToggleTheme={toggleTheme}
      canvasClassName="bg-[#ffe4e4]"
      stageRef={demo.screenRef}
      onStagePointerDown={demo.stopFromPointer}
      demo={{
        playing: demo.playing,
        codeOn: demo.codeOn,
        onPlay: demo.replay,
        onDesign: demo.design,
        onCode: demo.code,
      }}
      prototypeDevHover={demo.prototypeDevHover}
    >
      {stage === "business" ? (
        <OdicciBusinessProfile
          isDark={isDark}
          onContinue={() => setStage("vibe")}
          onBack={onBackToWorkspace}
        />
      ) : stage === "vibe" ? (
        <OdicciBrandVibe
          isDark={isDark}
          onContinue={() => setStage("palette")}
          onBack={() => setStage("business")}
        />
      ) : stage === "palette" ? (
        <OdicciBrandPalette
          isDark={isDark}
          onColors={setBrandColors}
          onContinue={() => setStage("fonts")}
          onBack={() => setStage("vibe")}
        />
      ) : (
        <OdicciBrandFonts
          isDark={isDark}
          colors={brandColors}
          onBack={() => setStage("palette")}
        />
      )}
      <OdicciDemoChrome screenRef={demo.screenRef} touch={demo.touch} codeOn={demo.codeOn} />
    </OdicciBrowserFrame>
  );
}
