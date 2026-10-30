import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type Ref,
  type RefObject,
} from "react";
import { Eye, Image as ImageIcon, Link, Maximize, Sun, Type, Wrench } from "lucide-react";
import buttonIcon from "@/assets/firstDesign/annotations/button.svg";
import colourIcon from "@/assets/firstDesign/annotations/colour.svg";
import frameIcon from "@/assets/firstDesign/annotations/frame.svg";
import spacingIcon from "@/assets/firstDesign/annotations/spacing.svg";
import toastIcon from "@/assets/firstDesign/annotations/toast.svg";
import { cn } from "@/lib/utils";
import type { SpecAnnotation, SpecKind } from "./inspectorTypes";

type KeyEntry = {
  kind: SpecKind;
  label: string;
  bg: string;
  border: string;
  text: string;
  icon: string | ComponentType<{ className?: string; color?: string; strokeWidth?: number }>;
};

/** Figma 1992:35174 — Annotation Button variants. */
const SPEC_KEY: KeyEntry[] = [
  { kind: "image", label: "Image", bg: "#0091ff", border: "#b0ddff", text: "#ffffff", icon: ImageIcon },
  { kind: "focus", label: "Focus", bg: "#ff9500", border: "#ffdeb0", text: "#ffffff", icon: Sun },
  { kind: "link", label: "Link", bg: "#2b00ff", border: "#bdb0ff", text: "#ffffff", icon: Link },
  { kind: "font", label: "Font", bg: "#00d1c3", border: "#b0f1ec", text: "#004944", icon: Type },
  { kind: "reading", label: "Reading", bg: "#111111", border: "#8d8d8d", text: "#ffffff", icon: Eye },
  { kind: "spacing", label: "Spacing", bg: "#ff5126", border: "#ffc9bc", text: "#ffffff", icon: spacingIcon },
  { kind: "button", label: "Button", bg: "#c701d5", border: "#eeb0f2", text: "#ffffff", icon: buttonIcon },
  { kind: "padding", label: "Padding", bg: "#ff0088", border: "#ffb0da", text: "#ffffff", icon: Maximize },
  { kind: "icon", label: "Icon", bg: "#99e000", border: "#dff5b0", text: "#364e00", icon: Wrench },
  { kind: "colour", label: "Colour", bg: "#838383", border: "#f0f0f0", text: "#ffffff", icon: colourIcon },
  { kind: "toast", label: "Toast", bg: "#d57d00", border: "#ffdeb0", text: "#ffffff", icon: toastIcon },
  { kind: "frame", label: "Frame", bg: "#0356e5", border: "#b0ddff", text: "#ffffff", icon: frameIcon },
];

const KEY_BY_KIND = Object.fromEntries(SPEC_KEY.map((k) => [k.kind, k])) as Record<SpecKind, KeyEntry>;

const ELBOW_OFFSET = 36;
const ELBOW_STAGGER = 10;
const CARD_W = 260;
const PANEL_GAP = 20;
const PANEL_INSET = 12;

type InspectorTetheredSpecsProps = {
  annotations: SpecAnnotation[];
  /** Frame Role shown on every spec card. */
  frameRole?: string;
  artboardRef: RefObject<HTMLDivElement | null>;
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
};

type Tether = { id: string; kind: SpecKind; d: string; dot: { x: number; y: number } };
type PanelSide = "left" | "right";
type ClusterLayout = {
  side: PanelSide;
  showKey: boolean;
  annotationIds: string[];
  left: number;
  top: number;
  maxHeight: number;
};

function clustersFromAnnotations(annotations: SpecAnnotation[]): ClusterLayout[] {
  const leftIds = annotations.filter((a) => a.toast.side === "left").map((a) => a.id);
  const rightIds = annotations.filter((a) => a.toast.side === "right").map((a) => a.id);
  return [
    { side: "left", showKey: false, annotationIds: leftIds, left: 0, top: 0, maxHeight: 640 },
    { side: "right", showKey: true, annotationIds: rightIds, left: 0, top: 0, maxHeight: 640 },
  ];
}

/**
 * Floating spec cards on the design-file canvas, tethered to the phone artboard.
 * Absolutely positioned — never reflows the phone strip.
 */
export function InspectorTetheredSpecs({
  annotations,
  frameRole,
  artboardRef,
  activeId,
  onActiveChange,
}: InspectorTetheredSpecsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const keyColumnRef = useRef<HTMLDivElement>(null);
  const clusterRefs = useRef<Partial<Record<PanelSide, HTMLDivElement | null>>>({});
  const pillRefs = useRef<Partial<Record<SpecKind, HTMLDivElement | null>>>({});
  const [tethers, setTethers] = useState<Tether[]>([]);
  const [clusters, setClusters] = useState<ClusterLayout[]>(() => clustersFromAnnotations(annotations));
  const baseClusters = useMemo(() => clustersFromAnnotations(annotations), [annotations]);

  useEffect(() => {
    let frame = 0;
    let lastKey = "";
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const root = rootRef.current;
      const artboard = artboardRef.current;
      if (!root || !artboard) return;

      const stage = root.getBoundingClientRect();
      const board = artboard.getBoundingClientRect();
      const keyW = keyColumnRef.current?.offsetWidth ?? 110;

      const placed = baseClusters.map((cluster) => {
        const top = Math.max(PANEL_INSET, board.top - stage.top);
        const maxHeight = Math.max(280, Math.round(stage.height - top - PANEL_INSET));
        const measuredW = clusterRefs.current[cluster.side]?.offsetWidth;
        const n = cluster.annotationIds.length;
        const clusterW = measuredW || CARD_W + (cluster.showKey ? keyW + PANEL_GAP : 0) + Math.max(0, n - 1) * (CARD_W + 16);
        const left =
          cluster.side === "right"
            ? board.right - stage.left + PANEL_GAP
            : board.left - stage.left - PANEL_GAP - clusterW;
        return { ...cluster, left: Math.round(left), top: Math.round(top), maxHeight };
      });

      const keySide: PanelSide = "right";
      const boardEdge = board.right - stage.left;
      const r = (v: number) => Math.round(v * 2) / 2;
      const next: Tether[] = annotations.flatMap((a, i) => {
        const pill = pillRefs.current[a.kind];
        const p = pill?.getBoundingClientRect();
        const node = artboard.querySelector<HTMLElement>(`[data-inspect-id="${a.id}"]`)?.getBoundingClientRect();
        const hx = node
          ? (a.toast.side === "right" ? node.right : node.left) - stage.left
          : board.left - stage.left + (board.width * a.hotspot.x) / 100;
        const hy = node
          ? node.top - stage.top + node.height / 2
          : board.top - stage.top + (board.height * a.hotspot.y) / 100;
        if (!p) {
          return [{ id: a.id, kind: a.kind, d: `M ${r(hx)} ${r(hy)}`, dot: { x: r(hx), y: r(hy) } }];
        }
        const x1 = (keySide === "right" ? p.left : p.right) - stage.left;
        const y1 = p.top - stage.top + p.height / 2;
        const offset = ELBOW_OFFSET + i * ELBOW_STAGGER;
        const elbowX = Math.min(x1 - 8, boardEdge + offset);
        return [
          {
            id: a.id,
            kind: a.kind,
            d: `M ${r(x1)} ${r(y1)} H ${r(elbowX)} V ${r(hy)} H ${r(hx)}`,
            dot: { x: r(hx), y: r(hy) },
          },
        ];
      });

      const key = `${placed.map((c) => `${c.left}|${c.top}|${c.maxHeight}|${c.annotationIds.join(",")}`).join("/")}|${next.map((t) => t.d).join(";")}`;
      if (key === lastKey) return;
      lastKey = key;
      setClusters(placed);
      setTethers(next);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [annotations, artboardRef, baseClusters]);

  const activeKinds = new Set(annotations.map((a) => a.kind));
  const activeKind = annotations.find((a) => a.id === activeId)?.kind ?? null;

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-30 overflow-visible">
      <svg className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden>
        {tethers.map((t) => {
          const on = activeId === t.id;
          return (
            <g
              key={t.id}
              className="transition-colors duration-200"
              color={on ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"}
            >
              <path
                d={t.d}
                fill="none"
                stroke="currentColor"
                strokeWidth={on ? 1.75 : 1.25}
                strokeDasharray="6 4"
                strokeLinejoin="round"
              />
              <circle cx={t.dot.x} cy={t.dot.y} r={on ? 3.5 : 3} fill="currentColor" />
            </g>
          );
        })}
      </svg>

      {clusters.map((cluster) =>
        cluster.annotationIds.length === 0 && !cluster.showKey ? null : (
          <SpecCluster
            key={cluster.side}
            cluster={cluster}
            clusterRef={(el) => {
              clusterRefs.current[cluster.side] = el;
            }}
            annotations={annotations}
            frameRole={frameRole}
            activeId={activeId}
            activeKind={activeKind}
            activeKinds={activeKinds}
            keyColumnRef={cluster.showKey ? keyColumnRef : undefined}
            pillRefs={pillRefs}
            onActiveChange={onActiveChange}
          />
        ),
      )}
    </div>
  );
}

function SpecCluster({
  cluster,
  clusterRef,
  annotations,
  frameRole,
  activeId,
  activeKind,
  activeKinds,
  keyColumnRef,
  pillRefs,
  onActiveChange,
}: {
  cluster: ClusterLayout;
  clusterRef?: (el: HTMLDivElement | null) => void;
  annotations: SpecAnnotation[];
  frameRole?: string;
  activeId: string | null;
  activeKind: SpecKind | null;
  activeKinds: Set<SpecKind>;
  keyColumnRef?: RefObject<HTMLDivElement | null>;
  pillRefs: RefObject<Partial<Record<SpecKind, HTMLDivElement | null>>>;
  onActiveChange: (id: string | null) => void;
}) {
  const items = cluster.annotationIds
    .map((id) => annotations.find((a) => a.id === id))
    .filter((a): a is SpecAnnotation => Boolean(a));

  return (
    <div
      ref={clusterRef}
      className="pointer-events-auto absolute z-30 h-auto w-max origin-top-left"
      style={{ left: cluster.left, top: cluster.top }}
    >
      <div
        className={cn(
          "flex w-max flex-col content-start items-start gap-3 overflow-visible font-['Inter',sans-serif]",
          cluster.side === "left" ? "flex-wrap-reverse" : "flex-wrap",
        )}
        style={{ maxHeight: cluster.maxHeight }}
      >
        {cluster.showKey ? (
          <div
            ref={keyColumnRef}
            className={cn(
              "relative flex h-auto shrink-0 flex-col gap-1.5 overflow-visible rounded-2xl border border-white/40 bg-white/30 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent dark:border-white/10 dark:bg-black/40",
              cluster.side === "left" ? "items-end" : "items-start",
            )}
            data-node-id="1992:35174"
          >
            {SPEC_KEY.map((entry) => {
              const match = annotations.find((a) => a.kind === entry.kind);
              const active = activeKind === entry.kind;
              return (
                <div
                  key={entry.kind}
                  ref={(el) => {
                    pillRefs.current[entry.kind] = el;
                  }}
                  onMouseEnter={() => match && onActiveChange(match.id)}
                  onMouseLeave={() => match && onActiveChange(null)}
                  className={cn(
                    "transition-opacity duration-200",
                    !activeKinds.has(entry.kind) && "opacity-45",
                    activeKind && !active && "opacity-35",
                  )}
                >
                  <KeyPill entry={entry} active={active} />
                </div>
              );
            })}
          </div>
        ) : null}

        {items.map((annotation) => (
          <SpecDetailCard
            key={annotation.id}
            annotation={annotation}
            frameRole={frameRole}
            active={activeId === annotation.id}
            onHover={onActiveChange}
          />
        ))}
      </div>
    </div>
  );
}

function KindIcon({ entry, className }: { entry: KeyEntry; className?: string }) {
  if (typeof entry.icon === "string") {
    return <img alt="" src={entry.icon} className={cn("block size-3.5 shrink-0", className)} />;
  }
  const Icon = entry.icon;
  return <Icon className={cn("size-3.5 shrink-0", className)} color={entry.text} strokeWidth={2} />;
}

function KeyPill({ entry, active = false }: { entry: KeyEntry; active?: boolean }) {
  return (
    <div
      className={cn(
        "spatial-spring-interactive flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-solid px-2 py-1 text-[11px] font-normal leading-tight",
        active && "bg-white/70 shadow-inner backdrop-blur-md dark:bg-white/20",
      )}
      style={
        active
          ? { borderColor: entry.border, color: entry.bg, boxShadow: `inset 0 0 0 1px ${entry.border}, 0 0 18px ${entry.border}` }
          : { backgroundColor: entry.bg, borderColor: entry.border, color: entry.text }
      }
    >
      <KindIcon entry={entry} />
      <span>{entry.label}</span>
    </div>
  );
}

/** Compact floating spec card — fixed width, natural height, no inner scroll. */
function SpecDetailCard({
  ref,
  annotation,
  frameRole,
  active,
  onHover,
}: {
  ref?: Ref<HTMLElement>;
  annotation: SpecAnnotation;
  frameRole?: string;
  active?: boolean;
  onHover?: (id: string | null) => void;
}) {
  const entry = KEY_BY_KIND[annotation.kind];
  const rows: { label: string; value: string }[] = [
    { label: "Type", value: annotation.elementType },
    { label: "Target / Frame Purpose", value: annotation.target },
    ...(frameRole ? [{ label: "Frame Role", value: frameRole }] : []),
    { label: "Padding & Spacing", value: annotation.spacing },
    { label: "Accessible Name & ARIA", value: `${annotation.accessibleName} · ${annotation.aria}` },
    { label: "Behavioral Description", value: annotation.description },
  ];

  return (
    <article
      ref={ref}
      className="spatial-glass spatial-glass-hairline relative flex h-auto w-[min(260px,100%)] shrink-0 flex-col items-start gap-1.5 overflow-visible rounded-2xl bg-white/30 p-3 text-[11px] text-[#1e1e1e] shadow-[0_20px_50px_rgba(0,0,0,0.1)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent dark:bg-black/40 dark:text-white"
      style={
        active
          ? { boxShadow: `0 0 0 2px ${entry.border}, 0 28px 60px rgba(0,0,0,0.16)` }
          : undefined
      }
      onMouseEnter={() => onHover?.(annotation.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/45 via-white/10 to-transparent"
      />
      <header className="relative z-[1] flex w-full items-center gap-2">
        <div className="flex items-center gap-2 self-stretch">
          <div
            className="flex items-start rounded-[20px] border border-solid p-1.5"
            style={{ backgroundColor: entry.bg, borderColor: entry.border }}
          >
            <KindIcon entry={entry} />
          </div>
          <span aria-hidden className="w-px self-stretch bg-white/50" />
        </div>
        <h4 className="flex-1 text-[12px] font-semibold leading-tight">{entry.label} Details</h4>
      </header>

      <dl className="relative z-[1] flex h-auto w-full flex-col gap-1.5 overflow-visible">
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-start">
            <dt className="flex-1 self-stretch text-[11px] font-medium leading-tight">Element</dt>
            <dd className="flex flex-1 items-center justify-center rounded-xl bg-white/70 px-2 py-1 shadow-inner backdrop-blur-md dark:bg-white/20">
              <span className="w-full text-[11px] font-medium leading-tight">{annotation.element}</span>
            </dd>
          </div>
          <span aria-hidden className="h-px w-full bg-white/40" />
        </div>

        {rows.map((row) => (
          <div key={row.label} className="flex w-full flex-col gap-1">
            <div className="flex w-full items-start justify-between gap-2 text-[11px] leading-snug">
              <dt className="w-[42%] shrink-0 font-medium">{row.label}</dt>
              <dd className="min-w-0 flex-1 whitespace-normal break-words font-normal">{row.value}</dd>
            </div>
            <span aria-hidden className="h-px w-full bg-white/40" />
          </div>
        ))}
      </dl>
    </article>
  );
}
