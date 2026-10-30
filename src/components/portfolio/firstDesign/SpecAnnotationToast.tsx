import { cn } from "@/lib/utils";
import type { SpecAnnotation } from "./inspectorTypes";

type SpecAnnotationToastProps = {
  annotation: SpecAnnotation;
  frameRole?: string;
  active?: boolean;
  className?: string;
  onHover?: (id: string | null) => void;
};

export function SpecAnnotationToast({
  annotation,
  frameRole,
  active = false,
  className,
  onHover,
}: SpecAnnotationToastProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Element", value: `${annotation.element} · ${annotation.elementType}` },
    { label: "Target / Frame Purpose", value: annotation.target },
    ...(frameRole ? [{ label: "Frame Role", value: frameRole }] : []),
    { label: "Padding & Spacing", value: annotation.spacing },
    { label: "Accessible Name & ARIA", value: `${annotation.accessibleName} · ${annotation.aria}` },
    { label: "Behavioral Description", value: annotation.description },
  ];

  return (
    <article
      className={cn(
        "spatial-glass spatial-glass-hairline spatial-spring-interactive w-[min(100%,320px)] rounded-2xl bg-neutral-900/80 p-4 text-left shadow-[0_24px_64px_rgba(0,0,0,0.45)]",
        active && "scale-[1.02] border-sky-400/40 shadow-[0_28px_72px_rgba(56,189,248,0.15)]",
        className,
      )}
      onMouseEnter={() => onHover?.(annotation.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/90">
        {annotation.category}
      </span>

      <dl className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[11px] leading-snug">
            <dt className="font-medium text-white/45">{row.label}</dt>
            <dd className="text-white/85">{row.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
