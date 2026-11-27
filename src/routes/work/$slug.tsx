import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { resetCrclePhoneDarkForWorkEntry } from "@/lib/crcle-phone-theme";
import girlPleaseLogo from "@/assets/girl-please.svg";
import { Dock } from "@/components/portfolio/Dock";
import { Footer } from "@/components/portfolio/Footer";
import { Marquee } from "@/components/portfolio/Marquee";
import { Sidebar } from "@/components/portfolio/Sidebar";
import { ProjectBentoStack } from "@/components/portfolio/ProjectAccordion";
import { WireframeStage } from "@/components/portfolio/SiteWireframe";
import { DOCK_ITEMS, PROJECTS } from "@/routes/index";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    if (params.slug === "crcle") {
      resetCrclePhoneDarkForWorkEntry();
    }
    return null;
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const project = PROJECTS.find((item) => item.slug === slug);

  useLayoutEffect(() => {
    if (slug === "crcle") resetCrclePhoneDarkForWorkEntry();
  }, [slug]);

  if (!project) return <Navigate to="/" />;

  const openProject = (next: string) => {
    if (next === slug) {
      void navigate({ to: "/", hash: "work" });
      return;
    }
    if (next === "crcle") resetCrclePhoneDarkForWorkEntry();
    void navigate({ to: "/work/$slug", params: { slug: next } });
  };

  const contactCluster = (
    <div className="flex min-w-0 items-center gap-1 rounded-[16px] bg-black/[0.08] p-1 shadow-lg shadow-black/5">
      <Link
        to="/"
        aria-label="Ana.R Design"
        className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-zinc-950 max-md:size-10"
      >
        <img src={girlPleaseLogo} alt="" className="h-[70%] w-[70%] object-contain invert" />
      </Link>
      <a
        href="mailto:A.rafaela.aguiar@outlook.com"
        className="flex h-9 min-w-0 items-center justify-center rounded-[12px] bg-[#E9582C] px-5 text-xs font-semibold tracking-tight text-zinc-950 hover:opacity-95 max-md:h-10 max-md:px-3"
      >
        Contact Me
      </a>
    </div>
  );

  return (
    <div
      className="work-project-page portfolio-hero-grid relative min-h-[100dvh] w-full max-w-[100vw] bg-[#f3f4f6] font-sans text-zinc-900 antialiased md:overflow-x-hidden"
      data-crcle-work-default={slug === "crcle" ? "dark" : undefined}
    >
      <div className="fixed top-6 left-6 z-[80] hidden md:block">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => void navigate({ to: "/", hash: "work" })}
          className="flex h-11 items-center justify-center text-black"
        >
          <Home className="size-11" fill="currentColor" strokeWidth={2} aria-hidden />
        </button>
      </div>
      <div className="fixed top-6 right-8 z-[80] hidden md:block">{contactCluster}</div>

      <header className="work-project-mobile-top work-project-header-tile work-mobile-chrome sticky top-0 z-[120] flex w-[calc(100%-4px)] items-center justify-between gap-3 px-4 pb-3 pt-[max(10px,env(safe-area-inset-top))] md:hidden">
        <button
          type="button"
          aria-label="Home"
          onClick={() => void navigate({ to: "/", hash: "work" })}
          className="flex size-10 shrink-0 items-center justify-center text-black"
        >
          <Home className="size-10" fill="currentColor" strokeWidth={2} aria-hidden />
        </button>
        {contactCluster}
      </header>

      <WireframeStage expanded fillTiles className="work-project-wireframe max-md:pt-0">
        <div className="work-project-stage-inner pointer-events-auto relative mx-auto flex w-[min(2400px,calc(100%-32px))] min-w-0 flex-col items-center overflow-visible px-0 pb-16 pt-4 max-md:w-full max-md:max-w-none max-md:pb-6">
          <div className="relative mx-auto w-[92%] min-w-0 max-w-[92%] overflow-visible max-md:w-full max-md:max-w-none">
            <ProjectBentoStack
              projects={[project]}
              openSlug={project.slug}
              onToggle={() => openProject(project.slug)}
              rowRefs={rowRefs}
              floating
            />
          </div>
        </div>
      </WireframeStage>

      <div className="work-project-bottom-strip relative z-20 bg-black [content-visibility:auto] [contain-intrinsic-size:auto_720px] max-sm:bg-[var(--portfolio-bottom-surface,#0a0d11)]">
        <Marquee />
        <Footer onSelectProject={openProject} onOpenSidebar={() => setSidebarOpen(true)} />
      </div>

      <Dock items={DOCK_ITEMS} onSelect={openProject} activeSlug={slug} stickyBar />
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </div>
  );
}
