import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

type Box = { top: number; left: number; width: number; height: number };

type Reading = {
  name: string;
  size: string;
  padding: string;
  gap: string;
  radius: string;
  type: string;
  code: string;
  box: Box;
};

function roundedPx(value: string) {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return "0px";
  return `${Math.round(n)}px`;
}

function edges(style: CSSStyleDeclaration, kind: "padding" | "borderRadius") {
  const names =
    kind === "padding"
      ? (["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] as const)
      : (["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"] as const);
  const parts = names.map((name) => roundedPx(style[name]));
  if (parts.every((part) => part === parts[0])) return parts[0];
  return parts.join(" ");
}

function frameName(el: HTMLElement) {
  const labelled = el.getAttribute("aria-label")?.trim();
  if (labelled) return labelled;
  const text = (el.innerText || "").replace(/\s+/g, " ").trim();
  if (text) return text.length > 48 ? `${text.slice(0, 48)}…` : text;
  return el.tagName.toLowerCase();
}

function classCode(el: HTMLElement) {
  const value = typeof el.className === "string" ? el.className : "";
  const compact = value.replace(/\s+/g, " ").trim();
  if (!compact) return "";
  return compact.length > 180 ? `${compact.slice(0, 180)}…` : compact;
}

function isControl(el: HTMLElement) {
  const role = el.getAttribute("role");
  return el.tagName === "BUTTON" || el.tagName === "A" || role === "button" || role === "switch";
}

function paddingSum(el: HTMLElement) {
  const style = getComputedStyle(el);
  return ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"].reduce(
    (sum, name) => sum + (Number.parseFloat(style[name as keyof CSSStyleDeclaration] as string) || 0),
    0,
  );
}

function frameFrom(target: EventTarget | null, root: HTMLElement) {
  let el = target instanceof HTMLElement ? target : target instanceof Node ? target.parentElement : null;
  let marked: HTMLElement | null = null;
  let control: HTMLElement | null = null;
  while (el && el !== root) {
    if (el.closest("[data-inspect-ui]")) return null;
    if (!marked && (el.dataset.inspectId || el.dataset.demoTarget)) marked = el;
    if (!control && isControl(el)) control = el;
    el = el.parentElement;
  }
  if (marked && (paddingSum(marked) > 0 || marked.tagName === "P" || marked.tagName === "IMG")) return marked;
  return control ?? marked;
}

function readFrame(el: HTMLElement, root: HTMLElement): Reading {
  const style = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  const font = `${roundedPx(style.fontSize)} / ${roundedPx(style.lineHeight)}`;
  return {
    name: frameName(el),
    size: `${Math.round(rect.width)} × ${Math.round(rect.height)}`,
    padding: edges(style, "padding"),
    gap: style.gap && style.gap !== "normal" ? style.gap : "0px",
    radius: edges(style, "borderRadius"),
    type: font,
    code: classCode(el),
    box: {
      top: rect.top - rootRect.top,
      left: rect.left - rootRect.left,
      width: rect.width,
      height: rect.height,
    },
  };
}

/** Hover readout for the phone tab: size, padding, spacing, and the frame's classes. */
export function PhoneDevInspection({
  active,
  screenRef,
}: {
  active: boolean;
  screenRef: RefObject<HTMLElement | null>;
}) {
  const [reading, setReading] = useState<Reading | null>(null);
  const hoveredRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = screenRef.current;
    if (!active || !root) {
      hoveredRef.current = null;
      setReading(null);
      return;
    }

    const show = (frame: HTMLElement | null) => {
      hoveredRef.current = frame;
      setReading(frame ? readFrame(frame, root) : null);
    };

    const onMove = (event: PointerEvent) => show(frameFrom(event.target, root));
    const onLeave = () => show(null);
    const onScroll = () => {
      const frame = hoveredRef.current;
      if (!frame || !root.contains(frame)) {
        show(null);
        return;
      }
      setReading(readFrame(frame, root));
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("scroll", onScroll, true);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("scroll", onScroll, true);
    };
  }, [active, screenRef]);

  if (!active) return null;

  const screen = screenRef.current;

  return (
    <>
      {screen && reading
        ? createPortal(
            <div
              data-inspect-ui
              aria-hidden
              className="pointer-events-none absolute z-[70]"
              style={{
                top: reading.box.top,
                left: reading.box.left,
                width: reading.box.width,
                height: reading.box.height,
                boxShadow:
                  "0 0 0 1.5px rgba(14, 165, 233, 0.95), inset 0 0 0 999px rgba(14, 165, 233, 0.08)",
              }}
            />,
            screen,
          )
        : null}
      <div
        data-inspect-ui
        className="mt-3 w-[280px] max-w-full rounded-2xl border border-white/50 bg-white/55 p-3 text-left shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-md"
      >
        {reading ? (
          <>
            <p className="text-[11px] font-medium tracking-tight text-zinc-900">{reading.name}</p>
            <dl className="mt-2 grid grid-cols-[72px_1fr] gap-x-2 gap-y-1 text-[11px] tracking-tight text-zinc-700">
              <dt>Size</dt>
              <dd>{reading.size}</dd>
              <dt>Padding</dt>
              <dd>{reading.padding}</dd>
              <dt>Spacing</dt>
              <dd>{reading.gap}</dd>
              <dt>Radius</dt>
              <dd>{reading.radius}</dd>
              <dt>Type</dt>
              <dd>{reading.type}</dd>
            </dl>
            {reading.code ? (
              <p className="mt-2 break-all font-mono text-[10px] leading-snug text-zinc-500">{reading.code}</p>
            ) : null}
          </>
        ) : (
          <p className="text-[11px] font-medium tracking-tight text-zinc-600">
            Hover a frame for padding, spacing, and code.
          </p>
        )}
      </div>
    </>
  );
}
