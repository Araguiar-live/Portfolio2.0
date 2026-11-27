import { useState } from "react";
import { FirstDesignMobileInspectorOverlay } from "@/components/portfolio/firstDesign/FirstDesignMobileInspectorOverlay";
import { INSPECTOR_FRAMES } from "@/components/portfolio/firstDesign/inspectorTypes";
import { ProductiveDesignFileFrame } from "@/components/portfolio/firstDesign/ProductiveDesignFileFrame";
import { ProductiveFrameScreen } from "@/components/portfolio/firstDesign/ProductiveScreens";
import { ProductiveWireframePhone } from "@/components/portfolio/firstDesign/ProductiveWireframePhone";

const MOBILE_STRIP_ORDER = [0, 1, 2, 3, 4, 5] as const;

function MobileBrowseStrip({ onOpenFrame }: { onOpenFrame: (index: number) => void }) {
  return (
    <ProductiveDesignFileFrame strip>
      {MOBILE_STRIP_ORDER.map((index) => {
        const frame = INSPECTOR_FRAMES[index];
        return (
          <button
            key={frame.id}
            type="button"
            onClick={() => onOpenFrame(index)}
            className="productive-mobile-showcase__phone productive-mobile-showcase__phone--tap ml-0 shrink-0 cursor-pointer rounded-[58px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80"
            aria-label={`Inspect ${frame.label}`}
          >
            <ProductiveWireframePhone className="ml-0 pointer-events-none">
              <ProductiveFrameScreen frameId={frame.id} compact standalone />
            </ProductiveWireframePhone>
          </button>
        );
      })}
    </ProductiveDesignFileFrame>
  );
}

/** Mobile case study — aerial browse in-frame; inspector in a full-viewport overlay. */
export function FirstDesignMobileShowcase() {
  const [inspectOpen, setInspectOpen] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);
  const openFrame = (index: number) => {
    setFrameIndex(index);
    setActiveAnnotationId(null);
    setDevMode(true);
    setInspectOpen(true);
  };

  const handleOverlayClosed = () => {
    setInspectOpen(false);
    setActiveAnnotationId(null);
    setDevMode(false);
  };

  const toggleDev = () => {
    setDevMode((v) => {
      if (v) setActiveAnnotationId(null);
      return !v;
    });
  };

  return (
    <>
      <section
        aria-label="Productive wireframe preview"
        className="productive-mobile-showcase relative w-full min-w-0 overflow-hidden rounded-[20px] border border-white/10 bg-[#1b1b1b] shadow-[0_10px_20px_rgba(0,0,0,0.28)]"
      >
        <MobileBrowseStrip onOpenFrame={openFrame} />
      </section>

      <FirstDesignMobileInspectorOverlay
        open={inspectOpen}
        frameIndex={frameIndex}
        devMode={devMode}
        activeAnnotationId={activeAnnotationId}
        onFrameIndexChange={setFrameIndex}
        onToggleDevMode={toggleDev}
        onActiveChange={setActiveAnnotationId}
        onClosed={handleOverlayClosed}
      />
    </>
  );
}