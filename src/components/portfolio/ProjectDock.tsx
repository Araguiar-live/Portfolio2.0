import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState, type MouseEvent } from "react";
import { GraduateWorkOverlay } from "@/components/portfolio/GraduateWorkOverlay";
import { isPhoneViewport } from "@/lib/viewport";
import { GRADUATE_PROJECTS, type GraduateProject } from "@/components/portfolio/graduateProjects";

/** Base icon cell at --deco-scale: 1 (scales with dock via CSS). */
const ICON_BASE = 24;

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  /** Optional — plus control opens the profile inspector. */
  onPlus?: () => void;
}

/** Top-left floating folder launcher (Figma 615:1406) — opens the graduate work overlay. */
export function ProjectDock({ onPlus }: Props) {
  const [folderOpen, setFolderOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const closeFolder = useCallback(() => setFolderOpen(false), []);
  const openFolder = () => setFolderOpen(true);

  return (
    <>
      <div
        className="relative z-50"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence>
          {hovered && !folderOpen && !isPhoneViewport() ? (
            <motion.div
              key="dock-tooltip"
              role="tooltip"
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-[60] w-max -translate-x-1/2 rounded-full border border-white/40 bg-zinc-900/90 px-3.5 py-1.5 text-[12px] font-medium tracking-tight text-white shadow-[0_10px_28px_rgba(11,14,20,0.22)] backdrop-blur-md"
            >
              Industrial Design Graduate Work
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.nav
          aria-label="Industrial Design Graduate Work"
          title="Industrial Design Graduate Work"
          data-name="app-icon"
          initial={{ y: 0, rotate: 0 }}
          animate={
            folderOpen
              ? { y: 0, rotate: 0 }
              : {
                  y: [0, -7, 0, -3, 0],
                  rotate: [0, -1.4, 0.8, -0.6, 0],
                }
          }
          whileHover={{
            y: -4,
            rotate: 0,
            transition: { type: "spring", stiffness: 420, damping: 16 },
          }}
          whileTap={{ y: 0, rotate: -2 }}
          transition={
            folderOpen
              ? { duration: 0.2 }
              : {
                  y: { duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.35 },
                  rotate: { duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.35 },
                }
          }
          className="project-dock-app-icon pointer-events-auto relative flex flex-col items-center justify-center overflow-hidden border border-zinc-400/45 bg-white/30 shadow-[0px_16px_24px_rgba(11,14,20,0.12),inset_0px_1px_0_rgba(255,255,255,0.55)] supports-[backdrop-filter]:bg-white/25 motion-reduce:animate-none"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('[data-dock-action="profile"]')) return;
            openFolder();
          }}
        >
          <button
            type="button"
            aria-expanded={folderOpen}
            aria-haspopup="dialog"
            aria-label="Open Industrial Design Graduate Work"
            onClick={openFolder}
            className="project-dock-app-icon__hit absolute inset-0 z-0"
          />

          <div className="project-dock-app-icon__grid pointer-events-none relative z-[1] grid w-full grid-cols-3">
            <PlusButton
              onClick={(e) => {
                e.stopPropagation();
                onPlus?.();
              }}
            />
            <span className="project-dock-icon-cell pointer-events-none" aria-hidden />
            <span className="project-dock-icon-cell pointer-events-none" aria-hidden />

            {GRADUATE_PROJECTS.slice(0, 2).map((project, i) => (
              <DockSphere
                key={project.id}
                project={project}
                bounceDelay={0.08 + i * 0.07}
                onOpen={openFolder}
              />
            ))}
            <span className="project-dock-icon-cell pointer-events-none" aria-hidden />

            {GRADUATE_PROJECTS.slice(2).map((project, i) => (
              <DockSphere
                key={project.id}
                project={project}
                bounceDelay={0.22 + i * 0.07}
                onOpen={openFolder}
              />
            ))}
          </div>
        </motion.nav>
      </div>

      <GraduateWorkOverlay open={folderOpen} onClose={closeFolder} />
    </>
  );
}

function PlusButton({
  onClick,
}: {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open profile"
      data-dock-action="profile"
      className="project-dock-icon-cell pointer-events-auto relative z-[2] flex shrink-0 items-center justify-center rounded-md transition-transform hover:scale-110 active:scale-95"
    >
      <span className="project-dock-plus relative inline-grid place-items-start leading-none">
        <span className="project-dock-plus__bar-h col-start-1 row-start-1 rounded-[2px] bg-[#2c313a] shadow-[0px_2px_3px_rgba(0,0,0,0.25)]" />
        <span className="project-dock-plus__bar-v col-start-1 row-start-1 rounded-[2px] border border-white/40 bg-[#2c313a] shadow-[0px_2px_4px_rgba(0,0,0,0.3)]" />
      </span>
    </button>
  );
}

function DockSphere({
  project,
  onOpen,
  bounceDelay = 0,
}: {
  project: GraduateProject;
  onOpen: () => void;
  bounceDelay?: number;
}) {
  return (
    <motion.button
      type="button"
      title={project.title}
      aria-label={`Open ${project.title}`}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      animate={{ y: [0, -2.5, 0] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: bounceDelay,
        repeatDelay: 0.4,
      }}
      whileHover={{ scale: 1.18, y: -1 }}
      whileTap={{ scale: 0.9 }}
      className="project-dock-icon-cell pointer-events-auto group relative z-[2] flex shrink-0 items-center justify-center overflow-visible rounded-full motion-reduce:animate-none"
      style={{ ["--glow" as string]: project.glow }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-4px] rounded-full opacity-0 blur-[6px] transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: project.glow }}
      />
      <img
        src={project.dot}
        alt=""
        width={ICON_BASE}
        height={ICON_BASE}
        className="project-dock-sphere relative size-full object-contain transition-[filter] duration-200 group-hover:drop-shadow-[0_0_10px_var(--glow)]"
        draggable={false}
        decoding="async"
      />
    </motion.button>
  );
}
