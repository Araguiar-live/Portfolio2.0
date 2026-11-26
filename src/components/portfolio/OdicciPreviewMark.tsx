/** The brand mark shown in every Brand Personality preview. The drawing stays fixed. */
export function OdicciPreviewMark({ className = "size-9 text-zinc-900" }: { className?: string }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 22.5H18M13.5 22.5C11.0147 22.5 9 24.5147 9 27C9 29.4853 11.0147 31.5 13.5 31.5C15.9853 31.5 18 29.4853 18 27V22.5M13.5 22.5C11.0147 22.5 9 20.4853 9 18C9 15.5147 11.0147 13.5 13.5 13.5M18 22.5V18M13.5 13.5H18M13.5 13.5C11.0147 13.5 9 11.4853 9 9C9 6.51472 11.0147 4.5 13.5 4.5H18M18 13.5V18M18 13.5V4.5M18 4.5H22.5C24.9853 4.5 27 6.51472 27 9C27 11.4853 24.9853 13.5 22.5 13.5M18 18C18 20.4853 20.0147 22.5 22.5 22.5C24.9853 22.5 27 20.4853 27 18C27 15.5147 24.9853 13.5 22.5 13.5M18 18C18 15.5147 20.0147 13.5 22.5 13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
