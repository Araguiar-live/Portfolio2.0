import { useEffect, useRef, useState, type RefObject } from "react";
import { useMobileWorkDevInspect } from "@/components/portfolio/MobileWorkDevInspect";

export type OdicciTouch = { x: number; y: number; pressing: boolean };

type DemoRefs = {
  screenRef: RefObject<HTMLDivElement | null>;
  gen: { current: number };
  pausedRef: { current: boolean };
  setTouch: (touch: OdicciTouch | null | ((current: OdicciTouch | null) => OdicciTouch | null)) => void;
};

export type OdicciDemoContext = {
  alive: () => boolean;
  wait: (ms: number) => Promise<void>;
  find: (selector: string) => HTMLElement | null;
  press: (selector: string) => Promise<boolean>;
  typeInto: (selector: string, text: string) => Promise<boolean>;
  scrub: (selector: string) => Promise<void>;
};

function reveal(el: HTMLElement, screen: HTMLElement) {
  let parent = el.parentElement;
  while (parent && parent !== screen) {
    const style = getComputedStyle(parent);
    const er = el.getBoundingClientRect();
    const pr = parent.getBoundingClientRect();
    if (/(auto|scroll)/.test(style.overflowY) && (er.top < pr.top + 12 || er.bottom > pr.bottom - 12)) {
      parent.scrollTop += er.top - pr.top - pr.height / 2 + er.height / 2;
    }
    if (/(auto|scroll)/.test(style.overflowX) && (er.left < pr.left + 12 || er.right > pr.right - 12)) {
      parent.scrollLeft += er.left - pr.left - pr.width / 2 + er.width / 2;
    }
    parent = parent.parentElement;
  }
}

async function pointAt(refs: DemoRefs, el: HTMLElement, alive: () => boolean, wait: (ms: number) => Promise<void>) {
  const screen = refs.screenRef.current;
  if (!screen) return false;
  el.scrollIntoView({ block: "nearest", inline: "nearest" });
  reveal(el, screen);
  await wait(320);
  if (!alive() || !refs.screenRef.current) return false;
  const er = el.getBoundingClientRect();
  const rr = refs.screenRef.current.getBoundingClientRect();
  refs.setTouch({
    x: er.left - rr.left + er.width / 2,
    y: er.top - rr.top + er.height / 2,
    pressing: false,
  });
  await wait(480);
  if (!alive()) return false;
  refs.setTouch((current) => (current ? { ...current, pressing: true } : current));
  await wait(150);
  if (!alive()) return false;
  refs.setTouch((current) => (current ? { ...current, pressing: false } : current));
  return true;
}

function setNativeValue(el: HTMLInputElement, value: string) {
  const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  proto?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

export function useOdicciDemo() {
  const screenRef = useRef<HTMLDivElement>(null);
  const mobileDevInspect = useMobileWorkDevInspect();
  const [paused, setPaused] = useState(false);
  const [codeOn, setCodeOn] = useState(false);
  const [run, setRun] = useState(0);
  const [touch, setTouch] = useState<OdicciTouch | null>(null);
  const gen = useRef(0);
  const pausedRef = useRef(false);
  pausedRef.current = paused;
  const refs: DemoRefs = { screenRef, gen, pausedRef, setTouch };

  useEffect(() => {
    if (!mobileDevInspect) return;
    mobileDevInspect.setCodeOn(codeOn);
    return () => mobileDevInspect.setCodeOn(false);
  }, [codeOn, mobileDevInspect]);

  const arm = (): OdicciDemoContext => {
    const token = ++gen.current;
    const alive = () => gen.current === token && !pausedRef.current;
    const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
    const find = (selector: string) => screenRef.current?.querySelector<HTMLElement>(selector) ?? null;
    const press = async (selector: string) => {
      const el = find(selector);
      if (!el || !(await pointAt(refs, el, alive, wait)) || !alive()) return false;
      const target = find(selector) ?? el;
      const reactKey = Object.keys(target).find((key) => key.startsWith("__reactProps"));
      const onClick = reactKey
        ? (target as unknown as Record<string, { onClick?: (event: unknown) => void } | undefined>)[
            reactKey
          ]?.onClick
        : undefined;
      if (onClick) {
        onClick({
          preventDefault() {},
          stopPropagation() {},
          target,
          currentTarget: target,
        });
      } else {
        target.click();
      }
      return true;
    };
    const typeInto = async (selector: string, text: string) => {
      const el = find(selector);
      if (!(el instanceof HTMLInputElement)) return false;
      if (!(await pointAt(refs, el, alive, wait))) return false;
      let value = "";
      for (const char of text) {
        if (!alive()) return false;
        value += char;
        setNativeValue(el, value);
        await wait(55);
      }
      return alive();
    };
    const scrub = async (selector: string) => {
      const el = find(selector);
      const screen = screenRef.current;
      if (!el || !screen) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 12) return;
      const bounds = () => el.getBoundingClientRect();
      const place = (ratio: number) => {
        const box = bounds();
        const rr = screen.getBoundingClientRect();
        refs.setTouch({
          x: box.left - rr.left + Math.min(box.width - 24, 28 + ratio * (box.width - 56)),
          y: box.top - rr.top + box.height / 2,
          pressing: false,
        });
      };
      const steps = 7;
      for (let i = 0; i <= steps; i += 1) {
        if (!alive()) return;
        const ratio = i / steps;
        el.scrollLeft = max * ratio;
        place(ratio);
        await wait(130);
      }
      for (let i = steps; i >= 0; i -= 1) {
        if (!alive()) return;
        const ratio = i / steps;
        el.scrollLeft = max * ratio;
        place(ratio);
        await wait(90);
      }
    };

    return { alive, wait, find, press, typeInto, scrub };
  };

  return {
    screenRef,
    paused,
    codeOn,
    run,
    touch,
    playing: !paused && !codeOn,
    replay() {
      gen.current += 1;
      setCodeOn(false);
      setTouch(null);
      setPaused(false);
      setRun((n) => n + 1);
    },
    design() {
      gen.current += 1;
      setCodeOn(false);
      setPaused(true);
      setTouch(null);
    },
    code() {
      gen.current += 1;
      setCodeOn(true);
      setPaused(true);
      setTouch(null);
    },
    stopFromPointer(event?: { target?: EventTarget | null }) {
      const target = event?.target;
      if (target instanceof Element && target.closest("[data-demo-target]")) return;
      if (pausedRef.current) return;
      gen.current += 1;
      setCodeOn(false);
      setPaused(true);
      setTouch(null);
    },
    arm,
    clearTouch() {
      setTouch(null);
    },
  };
}
