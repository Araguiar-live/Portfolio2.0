import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** Commit to the work section once its top crosses this fraction of the viewport. */
const COMMIT_VIEWPORT_RATIO = 0.52;
/** Sticky chrome fades in once the Figma wireframe stage owns the top of the viewport. */
const CHROME_REVEAL_TOP_PX = 88;
const WORK_SECTION_ID = "work";

const getWorkSection = () => document.getElementById(WORK_SECTION_ID);

/**
 * One-way hand-off from the full-screen hero to `#work`.
 * Once committed, the page can't scroll (or wheel / swipe) back up into the hero.
 */
export function useWorkCommit() {
  const reduceMotion = useReducedMotion();
  const [workCommitted, setWorkCommitted] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(false);
  const committedRef = useRef(false);
  const scrollingRef = useRef(false);

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
      window.scrollTo({ top: work.offsetTop, behavior: resolved });
      window.setTimeout(
        () => {
          scrollingRef.current = false;
        },
        resolved === "smooth" ? 900 : 0,
      );
    },
    [reduceMotion],
  );

  /** Always land on the dark hero. Hash / scroll restoration must not skip it. */
  useLayoutEffect(() => {
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

    const clampAboveWork = () => {
      if (!committedRef.current || scrollingRef.current) return;
      const top = workTop();
      if (window.scrollY < top - 1) window.scrollTo({ top, behavior: "auto" });
    };

    const onScroll = () => {
      const work = getWorkSection();
      if (!work) return;
      if (!committedRef.current) {
        if (!armed) return;
        if (work.getBoundingClientRect().top < window.innerHeight * COMMIT_VIEWPORT_RATIO) {
          commitToWork();
        }
        return;
      }
      clampAboveWork();
    };

    const atWorkTop = () =>
      committedRef.current && !scrollingRef.current && window.scrollY <= workTop() + 2;

    const onWheel = (event: WheelEvent) => {
      if (atWorkTop() && event.deltaY < 0) event.preventDefault();
    };

    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (atWorkTop() && (event.touches[0]?.clientY ?? 0) - touchStartY > 0) event.preventDefault();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", clampAboveWork);
    return () => {
      window.clearTimeout(arm);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", clampAboveWork);
    };
  }, [commitToWork, workTop]);

  return { workCommitted, commitToWork, chromeVisible };
}
