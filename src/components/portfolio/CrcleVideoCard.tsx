'use client';

import { useEffect, useRef } from 'react';

export function CrcleVideoCard({ videoSrc, liveUrl }: { videoSrc: string; liveUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
      videoRef.current.play().catch((err) => console.log("Autoplay prevented:", err));
    }
  }, []);

  return (
    <a
      href={liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-all hover:scale-[1.01] hover:border-white/25"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="pointer-events-none h-full w-full object-cover"
      />
    </a>
  );
}
