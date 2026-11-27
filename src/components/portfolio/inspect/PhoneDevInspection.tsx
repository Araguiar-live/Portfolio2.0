import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

type Box = {
  top: number;
  left: number;
  width: number;
  height: number;
  radius: string;
};

type Reading = {
  mark: string;
  name: string;
  size: string;
  pad: string;
  fill: string;
  ink: string;
  inkSwatch: string;
  type: string;
  card: { left: number; top: number };
};

const CARD_W = 196;
const CARD_H = 156;
const CARD_W_COMPACT = 168;
const CARD_H_COMPACT = 132;

function roundedPx(value: string) {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return "0px";
  return `${Math.round(n)}px`;
}

function paddingLabel(style: CSSStyleDeclaration) {
  const parts = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"].map((name) =>
    roundedPx(style[name as keyof CSSStyleDeclaration] as string),
  );
  if (parts.every((part) => part === parts[0])) return parts[0];
  return parts.join(" ");
}

function isClear(color: string) {
  if (!color || color === "transparent") return true;
  const match = color.match(/rgba?\(([^)]+)\)/);
  if (!match) return false;
  const parts = match[1].split(",").map((part) => part.trim());
  return parts.length === 4 && Number(parts[3]) === 0;
}

function toHex(color: string) {
  const match = color.match(/rgba?\(([^)]+)\)/);
  if (!match) return color;
  const parts = match[1].split(",").map((part) => part.trim());
  const [r, g, b, a] = parts;
  const hex = [r, g, b]
    .map((channel) => Number(channel).toString(16).padStart(2, "0"))
    .join("");
  if (a !== undefined && Number(a) < 1) return color.replace(/\s/g, "");
  return `#${hex}`;
}

function frameName(el: HTMLElement) {
  const labelled = el.getAttribute("aria-label")?.trim();
  if (labelled) return labelled;
  const text = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
  if (text) return text.length > 32 ? `${text.slice(0, 32)}…` : text;
  if (el.tagName === "IMG") return "Image";
  return el.tagName.toLowerCase();
}

function tagMark(el: HTMLElement) {
  const tag = el.tagName;
  if (tag === "BUTTON") return "B";
  if (tag === "IMG") return "I";
  return tag.slice(0, 1);
}

function typeLabel(style: CSSStyleDeclaration) {
  const family = style.fontFamily.split(",")[0]?.replace(/["']/g, "").trim() ?? "";
  const short = family.length > 10 ? `${family.slice(0, 1)}…` : family;
  const line = style.lineHeight === "normal" ? "normal" : roundedPx(style.lineHeight);
  return `${roundedPx(style.fontSize)} / ${line}  ·  ${style.fontWeight}  ·  ${short}`;
}

function hasPaint(style: CSSStyleDeclaration) {
  if ((Number.parseFloat(style.borderTopLeftRadius) || 0) >= 6) return true;
  if (!isClear(style.backgroundColor)) return true;
  if (style.backgroundImage && style.backgroundImage !== "none") return true;
  return (Number.parseFloat(style.borderTopWidth) || 0) > 0 && style.borderTopStyle !== "none";
}

function isFrame(el: HTMLElement, root: HTMLElement, rootRect: DOMRect) {
  if (el === root || el.closest("[data-inspect-ui]")) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width < 16 || rect.height < 12) return false;
  if (rect.bottom < rootRect.top || rect.top > rootRect.bottom) return false;
  if (rect.right < rootRect.left || rect.left > rootRect.right) return false;
  if (rect.width > rootRect.width * 0.96 && rect.height > rootRect.height * 0.42) return false;
  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) < 0.2) return false;
  const tag = el.tagName;
  if ((tag === "SPAN" || tag === "SVG" || tag === "IMG") && el.closest("button, a")) return false;
  if (tag === "BUTTON" || tag === "A" || tag === "INPUT" || tag === "TEXTAREA") return true;
  if ((tag === "IMG" || tag === "SVG") && Math.max(rect.width, rect.height) >= 28) return true;
  const role = el.getAttribute("role");
  if (role === "button" || role === "switch") return true;
  if ((tag === "P" || /^H[1-6]$/.test(tag)) && !el.closest("button, a")) return true;
  if (tag === "SPAN" && style.display !== "inline" && rect.height <= 48 && (el.innerText || "").trim()) return true;
  if (hasPaint(style) && rect.height <= 220 && tag !== "SPAN") return true;
  return false;
}

/** Keep the control, not every label and icon nested inside it. */
function keepFrame(el: HTMLElement, frames: HTMLElement[]) {
  const ancestor = frames.find((other) => other !== el && other.contains(el) && hasPaint(getComputedStyle(other)));
  if (!ancestor) return true;
  const tag = el.tagName;
  if (tag === "SPAN" || tag === "IMG" || tag === "SVG") return false;
  const outer = ancestor.getBoundingClientRect();
  const inner = el.getBoundingClientRect();
  if (tag === "INPUT" || tag === "TEXTAREA") {
    return outer.height >= inner.height * 2.4 || outer.width >= inner.width * 1.25;
  }
  if ((tag === "BUTTON" || tag === "A") && inner.width < 36 && inner.height < 36) return false;
  if (tag !== "BUTTON" && tag !== "A" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "P" && !/^H[1-6]$/.test(tag)) {
    return false;
  }
  if (tag === "P" || /^H[1-6]$/.test(tag)) {
    return Math.abs(outer.width - inner.width) > 12 || Math.abs(outer.height - inner.height) > 12;
  }
  return true;
}

/** The part of a frame that is not clipped by a scrolling or overflow-hidden ancestor. */
function visibleBounds(el: HTMLElement, root: HTMLElement, rect: DOMRect) {
  let left = rect.left;
  let top = rect.top;
  let right = rect.right;
  let bottom = rect.bottom;
  let node = el.parentElement;
  while (node) {
    const style = getComputedStyle(node);
    if (Number(style.opacity) < 0.2 || style.visibility === "hidden" || style.display === "none") return null;
    if (style.overflowX !== "visible" || style.overflowY !== "visible") {
      const clip = node.getBoundingClientRect();
      left = Math.max(left, clip.left);
      top = Math.max(top, clip.top);
      right = Math.min(right, clip.right);
      bottom = Math.min(bottom, clip.bottom);
      if (right - left < 12 || bottom - top < 10) return null;
    }
    if (node === root) break;
    node = node.parentElement;
  }
  const width = right - left;
  const height = bottom - top;
  if (width * height < rect.width * rect.height * 0.62) return null;
  return { left, top, width, height };
}

/** Covered frames stay quiet. A frame counts only when its center is the thing under the pointer. */
function isOnTop(el: HTMLElement, box: { left: number; top: number; width: number; height: number }) {
  const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
  if (!(hit instanceof Element)) return false;
  if (hit.closest("[data-inspect-ui]")) return false;
  return hit === el || el.contains(hit);
}

function readFrame(el: HTMLElement): Omit<Reading, "card"> {
  const style = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const fillClear = isClear(style.backgroundColor);
  const fill =
    style.backgroundImage && style.backgroundImage !== "none" && fillClear
      ? "gradient"
      : fillClear
        ? "transparent"
        : toHex(style.backgroundColor);
  return {
    mark: tagMark(el),
    name: frameName(el),
    size: `${Math.round(rect.width)} × ${Math.round(rect.height)}px`,
    pad: paddingLabel(style),
    fill,
    ink: toHex(style.color),
    inkSwatch: style.color,
    type: typeLabel(style),
  };
}

function placeCard(el: HTMLElement, root: HTMLElement, cardW: number, cardH: number) {
  const rect = el.getBoundingClientRect();
  const phone = root.getBoundingClientRect();
  let left = rect.left - cardW + 20;
  let top = rect.bottom + 6;
  left = Math.min(Math.max(left, phone.left + 8), phone.right - cardW - 8);
  top = Math.min(Math.max(top, phone.top + 8), phone.bottom - cardH - 8);
  return { left, top };
}

/** Blueprint inspection for the phone tab: visible frames only, frosted readout on hover. */
export function PhoneDevInspection({
  active,
  screenRef,
}: {
  active: boolean;
  screenRef: RefObject<HTMLElement | null>;
}) {
  const framesRef = useRef<HTMLElement[]>([]);
  const hoverRef = useRef<number | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const root = screenRef.current;
    if (!active || !root) {
      setCompact(false);
      framesRef.current = [];
      setBoxes([]);
      setHover(null);
      setReading(null);
      return;
    }

    const isCompact =
      Boolean(root.closest(".crcle-mobile-prototype-preview, .odicci-mobile-prototype-host")) &&
      window.matchMedia("(max-width: 767px)").matches;
    setCompact(isCompact);
    const cardW = isCompact ? CARD_W_COMPACT : CARD_W;
    const cardH = isCompact ? CARD_H_COMPACT : CARD_H;

    let frame = 0;
    const measure = () => {
      const rootRect = root.getBoundingClientRect();
      const next: HTMLElement[] = [];
      const nextBoxes: Box[] = [];
      for (const node of root.querySelectorAll<HTMLElement>("*")) {
        if (!isFrame(node, root, rootRect)) continue;
        const rect = node.getBoundingClientRect();
        const shown = visibleBounds(node, root, rect);
        if (!shown || !isOnTop(node, shown)) continue;
        const style = getComputedStyle(node);
        next.push(node);
        nextBoxes.push({
          top: shown.top - rootRect.top,
          left: shown.left - rootRect.left,
          width: shown.width,
          height: shown.height,
          radius: style.borderRadius || "0px",
        });
      }
      const kept = next.filter((node) => keepFrame(node, next));
      const keptBoxes = nextBoxes.filter((_, index) => kept.includes(next[index]));
      framesRef.current = kept;
      setBoxes(keptBoxes);
      const hovered = hoverRef.current;
      const el = hovered == null ? null : next[hovered];
      if (el) setReading({ ...readFrame(el), card: placeCard(el, root, cardW, cardH) });
    };

    const show = (index: number | null) => {
      hoverRef.current = index;
      setHover(index);
      const el = index == null ? null : framesRef.current[index];
      if (!el || !root.contains(el)) {
        setReading(null);
        return;
      }
      setReading({ ...readFrame(el), card: placeCard(el, root, cardW, cardH) });
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    const onMove = (event: PointerEvent) => {
      let node = event.target instanceof Node ? event.target : null;
      let found: number | null = null;
      while (node && node !== root) {
        if (node instanceof HTMLElement) {
          const index = framesRef.current.indexOf(node);
          if (index >= 0) {
            found = index;
            break;
          }
        }
        node = node.parentNode;
      }
      show(found);
    };
    const onLeave = () => show(null);

    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    const mutations = new MutationObserver(schedule);
    mutations.observe(root, { subtree: true, childList: true });
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      mutations.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, [active, screenRef]);

  if (!active) return null;
  const screen = screenRef.current;
  if (!screen) return null;

  return (
    <>
      {createPortal(
        <div data-inspect-ui className="pointer-events-none absolute inset-0 z-[60]" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148, 176, 204, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 176, 204, 0.12) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {boxes.map((box, index) => (
            <div
              key={`${box.top}-${box.left}-${box.width}-${box.height}-${index}`}
              className="absolute"
              style={{
                top: box.top,
                left: box.left,
                width: box.width,
                height: box.height,
                borderRadius: box.radius,
                boxShadow:
                  hover === index
                    ? "0 0 0 1px rgba(37, 99, 235, 0.72)"
                    : "0 0 0 1px rgba(125, 168, 206, 0.34)",
              }}
            />
          ))}
        </div>,
        screen,
      )}
      {reading
        ? createPortal(
            <div
              data-inspect-ui
              className={`phone-dev-inspect-card pointer-events-none fixed z-[80] rounded-[16px] border border-white/80 bg-white/65 px-3 py-2.5 text-left shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur-[18px] ${compact ? "phone-dev-inspect-card--compact" : ""}`}
              style={{
                left: reading.card.left,
                top: reading.card.top,
                width: compact ? CARD_W_COMPACT : CARD_W,
                transform: "none",
              }}
            >
              <span className="inline-flex size-[18px] items-center justify-center rounded-[5px] border border-[#7eb6e8] bg-white/50 text-[10px] font-semibold leading-none text-[#2f7eb8]">
                {reading.mark}
              </span>
              <p className="mt-1.5 truncate text-[13px] font-semibold leading-tight text-[#1c1c1e]">
                {reading.name}
              </p>
              <dl className="mt-2 grid grid-cols-[36px_1fr] items-center gap-x-2 gap-y-[3px] text-[10px] leading-[14px]">
                <dt className="font-medium tracking-[0.04em] text-[#8e8e93]">SIZE</dt>
                <dd className="text-right text-[#3a3a3c]">{reading.size}</dd>
                <dt className="font-medium tracking-[0.04em] text-[#8e8e93]">PAD</dt>
                <dd className="text-right text-[#3a3a3c]">{reading.pad}</dd>
                <dt className="font-medium tracking-[0.04em] text-[#8e8e93]">FILL</dt>
                <dd className="text-right text-[#3a3a3c]">{reading.fill}</dd>
                <dt className="font-medium tracking-[0.04em] text-[#8e8e93]">INK</dt>
                <dd className="flex items-center justify-end gap-1 text-[#3a3a3c]">
                  <span
                    className="size-2 shrink-0 rounded-[2px] border border-black/10"
                    style={{ backgroundColor: reading.inkSwatch }}
                  />
                  {reading.ink}
                </dd>
                <dt className="font-medium tracking-[0.04em] text-[#8e8e93]">TYPE</dt>
                <dd className="truncate text-right text-[#3a3a3c]">{reading.type}</dd>
              </dl>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
