import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** Commit to the work section once its top crosses this fraction of the viewport. */
const COMMIT_VIEWPORT_RATIO = 0.52;
/** Sticky chrome fades in once the Figma wireframe stage owns the top of the viewport. */
const CHROME_REVEAL_TOP_PX = 88;
const WORK_SECTION_ID = "work";
const WORK_LOCK_ATTR = "data-work-locked";

const getWorkSection = () => document.getElementById(WORK_SECTION_ID);

const isWorkLocked = () => document.documentElement.hasAttribute(WORK_LOCK_ATTR);

/**
 * Drop the hero out of the document and keep the wireframe visually where it is,
 * so the page now starts at `#work`.
 */
function collapseHero() {
  if (isWorkLocked()) return;
  const shell = document.querySelector<HTMLElement>(".portfolio-interactive-hero-shell");
  const heroH = shell?.offsetHeight ?? 0;
  document.documentElement.setAttribute(WORK_LOCK_ATTR, "");
  window.scrollTo(0, Math.max(0, window.scrollY - heroH));
}

/**
 * Hands off from the full-screen dark hero into `#work`.
 * Once that handoff finishes, the hero is gone and scrolling up cannot bring it back.
 */
export function useWorkCommit() {
  const reduceMotion = useReducedMotion();
  const [workCommitted, setWorkCommitted] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(false);
  const committedRef = useRef(false);
  const scrollingRef = useRef(false);
  const detachGuardRef = useRef<(() => void) | null>(null);

  const workTop = useCallback(() => getWorkSection()?.offsetTop ?? 0, []);

  const commitToWork = useCallback(
    (behavior?: ScrollBehavior) => {
      const work = getWorkSection();
      if (!work || scrollingRef.current || committedRef.current) return;
      const resolved = behavior ?? (reduceMotion ? "auto" : "smooth");
      committedRef.current = true;
      setWorkCommitted(true);
      scrollingRef.current = true;
      if (window.location.hash !== "#work") {
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}#work`);
      }
      const destination = work.offsetTop;
      // Ratchet: from this moment the page can only move downward, until the hero is removed.
      let floor = window.scrollY;

      const clamp = () => {
        if (isWorkLocked()) return;
        if (window.scrollY + 0.5 < floor) {
          window.scrollTo(0, floor);
          return;
        }
        floor = window.scrollY;
      };
      const onWheel = (event: WheelEvent) => {
        if (isWorkLocked()) return;
        if (event.deltaY < 0 && window.scrollY <= floor + 1) event.preventDefault();
      };
      let touchStartY = 0;
      const onTouchStart = (event: TouchEvent) => {
        touchStartY = event.touches[0]?.clientY ?? 0;
      };
      const onTouchMove = (event: TouchEvent) => {
        if (isWorkLocked()) return;
        const y = event.touches[0]?.clientY ?? 0;
        if (y > touchStartY + 2 && window.scrollY <= floor + 1) event.preventDefault();
      };

      window.addEventListener("scroll", clamp, { passive: true });
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });

      const detach = () => {
        window.removeEventListener("scroll", clamp);
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("scrollend", onScrollEnd);
        detachGuardRef.current = null;
      };
      detachGuardRef.current = detach;

      let collapsed = false;
      const finish = () => {
        if (collapsed) return;
        collapsed = true;
        detach();
        collapseHero();
        scrollingRef.current = false;
      };
      function onScrollEnd() {
        if (window.scrollY >= destination - 2) finish();
      }
      window.scrollTo({ top: destination, behavior: resolved });
      if (resolved === "smooth") {
        window.addEventListener("scrollend", onScrollEnd);
        window.setTimeout(finish, 900);
      } else {
        finish();
      }
    },
    [reduceMotion],
  );

  useEffect(() => () => detachGuardRef.current?.(), []);

  /** Always land on the dark hero. A leftover `#work` must not skip it. */
  useLayoutEffect(() => {
    document.documentElement.removeAttribute(WORK_LOCK_ATTR);
    if (window.location.hash === "#work") {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    committedRef.current = workCommitted;
  }, [workCommitted]);

  useEffect(() => {
    if (!workCommitted) {
      setChromeVisible(false);
      return;
    }

    const syncChrome = () => {
      const work = getWorkSection();
      if (!work) return;
      setChromeVisible(work.getBoundingClientRect().top <= CHROME_REVEAL_TOP_PX);
    };

    syncChrome();
    window.addEventListener("scroll", syncChrome, { passive: true });
    window.addEventListener("resize", syncChrome);
    const afterHandoff = window.setTimeout(syncChrome, reduceMotion ? 0 : 920);

    return () => {
      window.removeEventListener("scroll", syncChrome);
      window.removeEventListener("resize", syncChrome);
      window.clearTimeout(afterHandoff);
    };
  }, [workCommitted, reduceMotion]);

  useEffect(() => {
    let armed = false;
    const arm = window.setTimeout(() => {
      armed = true;
    }, 80);

    const onScroll = () => {
      if (committedRef.current) return;
      const work = getWorkSection();
      if (!work || !armed) return;
      if (window.scrollY < workTop() - 1) return;
      if (work.getBoundingClientRect().top < window.innerHeight * COMMIT_VIEWPORT_RATIO) {
        commitToWork();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(arm);
      window.removeEventListener("scroll", onScroll);
    };
  }, [commitToWork, workTop]);

  return { workCommitted, commitToWork, chromeVisible };
}
