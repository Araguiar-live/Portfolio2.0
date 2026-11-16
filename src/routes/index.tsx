import { createFileRoute } from "@tanstack/react-router";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import girlPleaseLogo from "@/assets/girl-please.svg";
import designToggleKnob from "@/assets/portfolio/design-toggle-knob.svg";
import { ProjectBentoStack, type Project } from "@/components/portfolio/ProjectAccordion";
import { Dock } from "@/components/portfolio/Dock";
import { ProjectDock } from "@/components/portfolio/ProjectDock";
import { Marquee } from "@/components/portfolio/Marquee";
import { Footer } from "@/components/portfolio/Footer";
import { OdicciWorkspacePicker } from "@/components/portfolio/OdicciWorkspacePicker";
import { OdicciColourPalette } from "@/components/portfolio/OdicciColourPalette";
import { OdicciSignUp } from "@/components/portfolio/OdicciSignUp";
import { OdicciTemplateLibrary } from "@/components/portfolio/OdicciTemplateLibrary";
import { Sidebar, SIDEBAR_PANEL_ID } from "@/components/portfolio/Sidebar";
import { CrcleMessaging } from "@/components/portfolio/CrcleMessaging";
import { CrcleProfile } from "@/components/portfolio/CrcleProfile";
import { CrcleRadar } from "@/components/portfolio/CrcleRadar";
import { CrcleSignalHome } from "@/components/portfolio/CrcleSignalHome";
import { FoodForThought } from "@/components/portfolio/FoodForThought";
import { WireframeStage } from "@/components/portfolio/SiteWireframe";
import { FirstDesignInspector } from "@/components/portfolio/firstDesign/FirstDesignInspector";
import { InteractiveHero } from "@/components/portfolio/InteractiveHero";
import { SpatialDotBadge } from "@/components/portfolio/SpatialDotBadge";
import { CalculatorCard, PeekMouse } from "@/components/portfolio/WorkDecorations";
import { useWorkCommit } from "@/hooks/useWorkCommit";
import { spatialChromeVisible } from "@/lib/spatialStyles";
import { isPhoneViewport } from "@/lib/viewport";
import crcleHoverStill from "@/assets/portfolio/hover/crcle-in-the-area.jpg";
import crcleHoverVideo from "@/assets/portfolio/hover/crcle-world-hover.mp4";
import crcleHoverPoster from "@/assets/portfolio/hover/crcle-world-poster.jpg";
import crcleHoverMark from "@/assets/portfolio/hover/crcle-mark.svg";
import bendingSpoonsHoverStill from "@/assets/portfolio/hover/bending-spoons-desk.jpg";
import odicciHoverStill from "@/assets/portfolio/hover/odicci-laptop.jpg";
import odicciHoverMark from "@/assets/portfolio/hover/odicci-mark.svg";

export const Route = createFileRoute("/")({
  component: Index,
});

// Master project registry. Drop real content into `content` per tab later.
const PROJECTS: Project[] = [
  {
    id: "01",
    slug: "crcle",
    title: "CRCLE",
    url: "https://www.crcle.world",
    role: "Lead Product Designer/Owner",
    year: "2025-26",
    hoverPreview: {
      src: crcleHoverStill,
      alt: "CRCLE In The Area on iPhone",
      width: 1400,
      height: 1050,
      glassLogo: true,
      logo: { src: crcleHoverMark, width: 248, height: 255 },
    },
    linkHoverPreview: {
      type: "video",
      src: crcleHoverVideo,
      poster: crcleHoverPoster,
      alt: "CRCLE website — intent-based connection",
      width: 1280,
      height: 720,
      playbackRate: 1.5,
      chrome: false,
    },
    content: {
      "Create Workspace\u00a0": {
        tabLabel: "Signal Home",
        label: "CRCLE — Signal Home",
        subtitle: "Drop a signal and set the night’s mood",
        overview:
          "Signal Home is CRCLE’s control room at the end of the corridor — presence, photo drop, and the pulse that starts every night.",
        challenge:
          "Make the home feel alive and exclusive without burying the core action under chrome.",
        approach:
          "Lead with portrait atmosphere, quiet glass controls, and a clear path into Radar and messaging.",
        outcome:
          "A living Signal Home wireframe judges (and clients) can feel before they read a paragraph.",
        customBody: ({ goToTab }) => (
          <CrcleSignalHome
            onGoToMessages={() => goToTab("Sign Up")}
            onGoToProfile={() => goToTab("Template Library")}
            onGoToRadar={() => goToTab("Brand Personality")}
          />
        ),
      },
      "Brand Personality": {
        tabLabel: "Radar",
        label: "CRCLE — Radar",
        subtitle: "Discover with intent before you message",
        overview:
          "Radar is the discovery loop — swipe Purpose, Love, or Soul cards, then push an intent signal from the first tap.",
        challenge:
          "Cold outreach feels noisy. People need a clear reason and expectation before a thread opens.",
        approach:
          "Category swipe filters the deck; the + FAB opens an intent matrix so romantic, professional, social, or balanced signals land first.",
        outcome:
          "An interactive Radar flow: swipe categories → set intent → Signal Sent → jump toward messages.",
        customBody: ({ onNextTab, goToTab }) => (
          <CrcleRadar
            onGoToMessages={onNextTab}
            onGoToSignalHome={() => goToTab("Create Workspace\u00a0")}
            onGoToProfile={() => goToTab("Template Library")}
          />
        ),
      },
      "Sign Up": {
        tabLabel: "Messaging Hub",
        label: "CRCLE — Messaging",
        subtitle: "Conversation as the product core",
        overview:
          "The messaging hub is the daily loop — notifications, threads, and presence without noisy social chrome.",
        challenge: "Build intimacy at small scale without borrowing patterns from mass messengers.",
        approach:
          "Prioritize readable threads, soft glass controls, and a dock that feels like a private tool.",
        outcome: "An interactive hub that demonstrates the product’s rhythm end-to-end.",
        customBody: ({ goToTab }) => (
          <CrcleMessaging
            onGoToProfile={() => goToTab("Template Library")}
            onGoToSignalHome={() => goToTab("Create Workspace\u00a0")}
            onGoToRadar={() => goToTab("Brand Personality")}
          />
        ),
      },
      "Template Library": {
        tabLabel: "Profile",
        label: "CRCLE — Profile",
        subtitle: "Identity, broadcast mood, and editable life widgets",
        overview:
          "The profile is the member’s living card — stats, intent, and the details they choose to share. This is the end of the prototype journey.",
        challenge:
          "Pack education, work, dating, and location into one glance without feeling like a form dump.",
        approach:
          "Lead with portrait + strength, then a 2×2 bento. Mood Switch and edit sheets keep depth off the main surface.",
        outcome:
          "An interactive profile flow: Signal Live → Mood Switch, bento taps → edit sheets, social chips → links.",
        customBody: ({ goToTab }) => (
          <CrcleProfile
            onGoToSignalHome={() => goToTab("Create Workspace\u00a0")}
            onGoToMessages={() => goToTab("Sign Up")}
            onGoToRadar={() => goToTab("Brand Personality")}
          />
        ),
      },
    },
  },
  {
    id: "02",
    slug: "first-design",
    title: "Bending Spoons",
    role: "First Design Hackathon",
    year: "2026",
    tabs: ["Template Library"],
    hoverPreview: {
      src: bendingSpoonsHoverStill,
      alt: "Productive on iPhone, on a wooden desk in sunlight",
      width: 1400,
      height: 1050,
      glassLogo: true,
      playColor: "#e29929",
    },
    content: {
      "Template Library": {
        tabLabel: "Productive",
        label: "First Design — Design system inspector",
        subtitle: "A 24-hour sprint with Bending Spoons mentors",
        overview:
          "First Design paired me with nineteen other contestants and mentors from Bending Spoons for a single day on Productive—an existing focus app—not a blank brief. We inherited real flows, constraints, and research, then had to show how the product could feel sharper and more enjoyable without breaking what already worked.",
        challenge:
          "Productive already had users and telemetry. The sprint brief came with data on where people dropped off, which session types stuck, and where the experience felt dutiful instead of motivating. The job was to respect that evidence while pushing the loop—onboarding, session pick, active timer—toward something people would actually want to reopen.",
        approach:
          "I treated the file like a living design system: wireframe the core loop in context, spec the hero onboarding CTA and session picker, and use the in-canvas inspector so judges could read intent without leaving the canvas. Ideas skewed toward delight—clearer hierarchy, warmer onboarding, less friction into deep work—always checked against the metrics and notes we were given.",
        outcome:
          "A pannable four-frame file with one shippable onboarding path and coming-soon slots for the rest of the loop, plus an interactive preview drawer for dev-style annotations. The sprint output is a direction for a more fun, data-informed Productive—not a full rebuild in twenty-four hours.",
        customBody: <FirstDesignInspector />,
      },
    },
  },
  {
    id: "03",
    slug: "odicci",
    title: "Odicci",
    role: "Product Team / Core UX",
    year: "2025-26",
    hoverPreview: {
      src: odicciHoverStill,
      alt: "Odicci on a laptop",
      width: 1600,
      height: 1066,
      playColor: "#E9582C",
      logo: { src: odicciHoverMark, width: 248, height: 259 },
    },
    content: {
      "Create Workspace\u00a0": {
        label: "Odicci — Workspace",
        subtitle: "Enterprise needs a home before the product opens",
        overview:
          "In multi-tenant enterprise, every company is its own operating context — identity, members, and the stack it already runs. Create Workspace is where that context is named and connected before anyone lands in the product.",
        challenge:
          "Enterprise teams juggle several orgs and dozens of tools. Without a deliberate create step, people enter the wrong workspace, bring no stack with them, and waste the first session wiring APIs by hand.",
        approach:
          "A dedicated create flow captures company identity, then surfaces Add Integration so Shopify, Klaviyo, Magento, Omnisend, and the rest can attach at setup — accommodating each company’s API footprint before Brand Personality or templates.",
        outcome:
          "Workspace creation becomes the enterprise on-ramp: the right org, the right APIs, then a product that already speaks to that company’s stack.",
        customBody: ({ onNextTab }) => <OdicciWorkspacePicker onNext={onNextTab} />,
      },
      "Brand Personality": {
        label: "Odicci — Brand system",
        subtitle: "Colour and tone as a live control",
        overview:
          "Brand personality starts with usage context — industry, niche, then tone and aesthetic — so the palette and Template library open already tuned to the company.",
        challenge:
          "Colour alone doesn’t personalize the home. Without business and vibe signals, templates stay generic even when the brand looks right.",
        approach:
          "Capture business profile first (Figma 713:199885), then brand vibe (727:200380), then live colour controls so every experience and suggested template feels on-brand.",
        outcome:
          "A three-beat Brand Personality flow: describe the business, set the vibe, dial the palette — feeding a tailored Template library next.",
        customBody: ({ onPrevTab }) => <OdicciColourPalette onBackToWorkspace={onPrevTab} />,
      },
      "Sign Up": {
        label: "Odicci — Sign up",
        subtitle: "Credentials with atmosphere",
        overview:
          "Account creation should feel like entering the product world — peach light, soft glass, zero generic form fatigue.",
        challenge:
          "Sign-up is high drop-off. Visual polish has to support clarity, not distract from it.",
        approach:
          "Keep fields minimal, hierarchy loud, and the environment distinctive enough to remember.",
        outcome: "An onboarding beat that sells the brand while collecting only what’s needed.",
        customBody: <OdicciSignUp />,
      },
      "Template Library": {
        label: "Odicci — Template library",
        subtitle: "Browse, filter, and preview experiences",
        overview:
          "The template library is where brand personality meets ready-made play — sticky filters keep discovery fast while a live preview stays pinned.",
        challenge:
          "Catalogs get noisy fast. Without sticky context, people lose their place and second-guess the pick.",
        approach:
          "Pin search and industry filters; keep a sticky phone preview with QR and Use Template so selection never leaves the frame.",
        outcome:
          "A scannable library that feels like shopping a catalog and testing on device at the same time.",
        customBody: <OdicciTemplateLibrary />,
      },
    },
  },
];

// Dock buttons map 1:1 to projects above.
const DOCK_ITEMS = [
  { label: "Cr", slug: "crcle" },
  { label: "Fd", slug: "first-design" },
  { label: "Od", slug: "odicci" },
];

function Index() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [designOn, setDesignOn] = useState(false);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [nudgeSignal, setNudgeSignal] = useState(0);
  const isExpanded = openSlug !== null;
  const { workCommitted, commitToWork, chromeVisible } = useWorkCommit();
  const showChrome = workCommitted && chromeVisible;
  const chromeClass = spatialChromeVisible(workCommitted, chromeVisible);

  const toggle = useCallback((slug: string) => {
    setOpenSlug((cur) => (cur === slug ? null : slug));
  }, []);

  // Dock click: open the row (if closed) and smoothly scroll to it.
  const handleDockSelect = useCallback((slug: string) => {
    if (isPhoneViewport()) {
      rowRefs.current[slug]?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => setNudgeSignal((n) => n + 1), 600);
      return;
    }
    setOpenSlug(slug);
    // Wait a frame so the accordion begins expanding before we measure.
    requestAnimationFrame(() => {
      const el = rowRefs.current[slug];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <div className="portfolio-hero-grid relative min-h-[100dvh] w-full text-zinc-900 font-sans antialiased overflow-x-hidden max-md:m-0 max-md:p-0 max-md:isolate max-sm:font-[family-name:system-ui,sans-serif]">
      <div className="portfolio-interactive-hero-shell max-md:relative max-md:z-10 max-md:shrink-0 max-md:overflow-hidden">
        <InteractiveHero onEnterWork={() => commitToWork()} />
      </div>

      {/* App-icon project dock — pinned top-left once the hero hands off to #work */}
      <div
        className={`fixed top-6 left-6 z-50 max-sm:hidden sm:left-8 ${chromeClass}`}
        aria-hidden={!showChrome}
      >
        <ProjectDock onPlus={() => setSidebarOpen(true)} />
      </div>

      {/* Top-right pill — logo opens profile sidebar. Food For Thought scrolls with #work. */}
      <div
        className={`fixed top-6 right-8 z-[110] flex origin-top-right flex-col items-end max-md:left-1/2 max-md:right-auto max-md:top-4 max-md:w-[min(350px,calc(100%-32px))] max-md:-translate-x-1/2 max-md:items-end max-md:scale-100 ${chromeClass}`}
        aria-hidden={!showChrome}
      >
        <div className="spatial-glass spatial-glass-hairline spatial-layer flex items-center gap-[4px] rounded-[16px] bg-black/[0.08] p-[4px] shadow-lg shadow-black/5 max-md:w-[60%] max-md:min-w-[200px] max-md:gap-1 max-md:rounded-[16px] max-md:p-1">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-expanded={sidebarOpen}
            aria-controls={SIDEBAR_PANEL_ID}
            aria-label={sidebarOpen ? "Close profile menu" : "Open profile menu"}
            className="group spatial-spring-interactive flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-zinc-950 hover:bg-white/50 hover:backdrop-blur-md active:scale-[0.97] max-md:size-10 max-md:rounded-[12px]"
          >
            <img
              src={girlPleaseLogo}
              alt=""
              aria-hidden
              className="h-[70%] w-[70%] object-contain invert transition-[filter] duration-200 group-hover:invert-0"
            />
          </button>
          <a
            href="mailto:A.rafaela.aguiar@outlook.com"
            className="spatial-spring-interactive flex h-9 cursor-pointer items-center justify-center rounded-[12px] bg-[#E9582C] px-5 text-xs font-semibold tracking-tight text-zinc-950 hover:opacity-95 active:scale-[0.98] max-md:h-10 max-md:min-w-0 max-md:flex-1 max-md:rounded-[12px] max-md:px-4 max-md:text-xs"
          >
            Contact Me
          </a>
        </div>
      </div>

      {/*
        Exact Figma auto-layout (530:151045 / 552:158232):
        cells → browser plate UNDER pattern → overlay on top.
        Closed 1262×847 · Open 1262×1522 · overlay scrolls when open.
        Content column is ~45% wider than the original 1336px cap (→ 1944)
        so the closed accordion reads 15% larger on desktop at the same aspect.
      */}
      <section
        id="work"
        className="relative z-10 scroll-mt-0 overflow-x-hidden max-md:relative max-md:z-[1] max-md:w-full max-md:max-w-[100vw] max-md:isolate max-md:bg-[#f3f4f6]"
      >
        <WireframeStage
          expanded={isExpanded}
          corner={
            workCommitted ? (
              <FoodForThought className="max-md:origin-top-right max-md:scale-80" />
            ) : null
          }
        >
          <div
            className={
              isExpanded
                ? "pointer-events-auto mx-auto flex w-full max-w-[1690px] flex-col items-center gap-[78px] overflow-visible px-6 pb-0 pt-10 sm:px-10"
                : "pointer-events-auto absolute left-1/2 top-[calc(50%+18.5px)] flex h-[min(760px,86%)] w-[min(1944px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[78px] overflow-visible max-md:relative max-md:left-auto max-md:top-auto max-md:mx-auto max-md:h-auto max-md:min-h-[100dvh] max-md:w-[min(350px,calc(100%-32px))] max-md:translate-x-0 max-md:translate-y-0 max-md:gap-8 max-md:px-1 max-md:pb-28 max-md:pt-14 max-sm:gap-[37px] max-sm:pb-32 max-sm:pt-[68px]"
            }
          >
            <header className="flex w-full max-w-[720px] shrink-0 flex-col items-center gap-5 text-center max-md:mt-3 max-md:gap-4 max-sm:mt-3 max-sm:gap-4">
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#76767a] max-md:text-[9px] max-md:tracking-[1.5px] max-sm:tracking-normal">
                Selected Work • Portfolio
              </p>

              <div className="flex items-end justify-center gap-[15px] max-md:gap-2.5 max-sm:gap-2.5">
                <div className="hidden w-[87px] shrink-0 pb-2.5 sm:block" aria-hidden />

                <h1 className="text-center text-[40px] font-medium leading-[48px] tracking-[-1.5px] text-[#111] max-md:text-[34px] max-md:leading-[41px] max-sm:font-normal max-sm:tracking-normal sm:text-[48px] sm:leading-[56px]">
                  {/* Mobile centres "Hi.." on the screen, not on the headline + toggle row. */}
                  <span className="block max-md:relative max-md:left-[42px] max-sm:relative max-sm:left-[42px]">
                    Hi..
                  </span>
                  <span className="block max-md:mt-0.5 max-md:text-[32px] max-md:leading-[38px] max-sm:mt-0.5">
                    I do Design.
                  </span>
                </h1>

                <div
                  className={`w-[87px] shrink-0 origin-center pb-2.5 max-md:scale-[0.77] max-sm:pb-[3px] ${chromeClass}`}
                  aria-hidden={!showChrome}
                >
                  <DesignToggle on={designOn} onToggle={() => setDesignOn((v) => !v)} />
                </div>
              </div>

              <p className="max-w-[580px] text-[14px] leading-[22px] text-[#76767a] max-md:max-w-[277px] max-md:text-[12px] max-md:leading-[19px] max-sm:max-w-[277px]">
                <span className="sm:hidden">
                  Small screen? Big FOMO. This portfolio is best on desktop—where the interactive
                  prototypes come out to play.
                </span>
                <span className="hidden sm:inline">
                  Multidisciplinary, self-sufficient designer. I build complex B2B platforms, design
                  systems, and code-backed prototypes from zero to one.
                </span>
              </p>
            </header>

            <div className="relative w-full shrink-0 overflow-visible max-md:pt-14 max-md:pb-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[5] overflow-visible max-md:-top-14 max-md:bottom-0"
              >
                <div className="portfolio-mobile-deco-calculator absolute left-0 top-0 hidden -translate-x-1/2 -translate-y-1/2 max-md:-bottom-4 max-md:-left-3 max-md:top-auto max-md:block max-md:origin-bottom-left max-md:scale-[0.715] max-md:translate-x-0 max-md:translate-y-0 max-md:[--deco-scale:0.72] md:block">
                  <CalculatorCard />
                </div>
                <div className="absolute right-4 top-4 hidden -translate-y-[70px] max-md:-right-1 max-md:top-[6px] max-md:bottom-auto max-md:block max-md:origin-top-right max-md:scale-80 max-md:translate-y-0 max-md:[--deco-scale:0.85] md:block">
                  <PeekMouse />
                </div>
              </div>
              <ProjectBentoStack
                projects={PROJECTS}
                openSlug={openSlug}
                onToggle={toggle}
                rowRefs={rowRefs}
                nudgeSignal={nudgeSignal}
              />
              {/* Figma 2305:66727 — 24px under the accordion, painted behind it */}
              <div className="pointer-events-auto relative z-0 -mt-6 flex justify-center max-md:-mt-6">
                <div className="-translate-x-6 scale-[1.15]">
                  <SpatialDotBadge />
                </div>
              </div>
            </div>
            {/* Phones: 15% smaller than the 1.25 dock, pinned to the stage bottom. */}
            <div
              className={`project-dock-mobile pointer-events-auto absolute left-1 bottom-6 z-20 md:hidden ${chromeClass}`}
              aria-hidden={!showChrome}
            >
              <ProjectDock onPlus={() => setSidebarOpen(true)} />
            </div>
          </div>
        </WireframeStage>

        {/* Exactly 2px of #f3f4f6 between wireframe frame and marquee */}
        <div className="relative z-20 h-[2px] w-full shrink-0 bg-[#f3f4f6]" aria-hidden />

        {/* Marquee + footer — continuous black plane under the bento strip */}
        <div className="relative z-20 bg-black max-sm:bg-[var(--portfolio-bottom-surface,#0a0d11)]">
          <Marquee />
          <Footer onSelectProject={handleDockSelect} onOpenSidebar={() => setSidebarOpen(true)} />
        </div>
      </section>

      <div className="max-sm:hidden" aria-hidden={!showChrome}>
        {showChrome ? (
          <Dock
            className={chromeClass}
            items={DOCK_ITEMS}
            onSelect={handleDockSelect}
            activeSlug={openSlug}
          />
        ) : null}
      </div>
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </div>
  );
}

/**
 * Figma Design toggle — mint ↔ purple.
 * Auto-flips ~every 10s; click still works; bouncy spring + float + occasional shake.
 */
function DesignToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const reduceMotion = useReducedMotion();
  const shakeControls = useAnimationControls();
  const flipControls = useAnimationControls();
  const pauseUntilRef = useRef(0);
  const onToggleRef = useRef(onToggle);
  onToggleRef.current = onToggle;

  const border = on ? "#bb9ffa" : "#01cd7f";
  const gradient = on
    ? "linear-gradient(131.4deg, rgba(139, 92, 247, 0.4) 19.75%, rgba(139, 92, 247, 0.08) 86.39%)"
    : "linear-gradient(131.4deg, rgba(1, 228, 141, 0.4) 19.75%, rgba(1, 228, 141, 0.08) 86.39%)";

  const playFlipBounce = useCallback(() => {
    if (reduceMotion) return;
    void flipControls.start({
      scale: [1, 1.12, 0.94, 1.06, 1],
      rotate: [0, -6, 5, -2, 0],
      transition: { duration: 0.55, ease: "easeOut" },
    });
  }, [flipControls, reduceMotion]);

  const handleToggle = useCallback(() => {
    pauseUntilRef.current = Date.now() + 12_000;
    playFlipBounce();
    onToggleRef.current();
  }, [playFlipBounce]);

  // Auto-flip every ~10s (jitter 9–11s). Skips briefly after a manual click.
  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delay = 9000 + Math.random() * 2000;
      timer = setTimeout(() => {
        if (cancelled) return;
        if (Date.now() >= pauseUntilRef.current) {
          playFlipBounce();
          onToggleRef.current();
        }
        schedule();
      }, delay);
    };

    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduceMotion, playFlipBounce]);

  // Intro shake + occasional attention shake
  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    const shake = () =>
      shakeControls.start({
        x: [0, -5, 5, -4, 4, -2, 0],
        rotate: [0, -2.5, 2.5, -1.5, 1.5, 0],
        transition: { duration: 0.55, ease: "easeInOut" },
      });

    const run = async () => {
      await new Promise((r) => setTimeout(r, 300));
      if (cancelled) return;
      await shake();
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 25_000));
        if (cancelled) return;
        await shake();
      }
    };

    void run();
    return () => {
      cancelled = true;
      shakeControls.stop();
    };
  }, [reduceMotion, shakeControls]);

  return (
    <motion.div
      className="w-full"
      animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
      transition={reduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={on ? "Design mode on" : "Design mode off"}
        onClick={handleToggle}
        animate={shakeControls}
        whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: 2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.9, rotate: -4 }}
        transition={{ type: "spring", stiffness: 520, damping: 22, mass: 0.65 }}
        className="relative w-full cursor-pointer rounded-[64px] border p-1 backdrop-blur-[4px]"
        style={{ borderColor: border, backgroundImage: gradient }}
      >
        <motion.div animate={flipControls} className="relative block h-8 w-full">
          <motion.img
            src={designToggleKnob}
            alt=""
            width={32}
            height={32}
            className="absolute top-0 size-8 drop-shadow-sm"
            initial={false}
            animate={{
              left: on ? "calc(100% - 32px)" : 0,
              rotate: on ? 180 : 0,
              scale: on ? 1.05 : 1,
            }}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 480, damping: 18, mass: 0.55 }
            }
          />
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
