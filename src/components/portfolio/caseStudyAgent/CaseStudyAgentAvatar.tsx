/** Pixel-ish agent mark for the idle pill (Vercel Agent–inspired). */
export function CaseStudyAgentAvatar({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden
      fill="none"
    >
      <rect x="4" y="3" width="12" height="10" rx="1" fill="#111" />
      <rect x="7" y="6" width="2" height="4" fill="#fff" />
      <rect x="11" y="6" width="2" height="4" fill="#fff" />
      <rect x="2" y="8" width="2" height="3" fill="#111" />
      <rect x="16" y="8" width="2" height="3" fill="#111" />
      <rect x="6" y="14" width="2" height="3" fill="#111" />
      <rect x="12" y="14" width="2" height="3" fill="#111" />
    </svg>
  );
}