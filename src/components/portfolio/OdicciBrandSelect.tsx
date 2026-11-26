import { ChevronDown } from "lucide-react";
import { useState } from "react";

/** Expandable field used by the Brand Personality steps. */
export function OdicciBrandSelect({
  value,
  options,
  onChange,
  triggerAttr,
  menuClassName = "text-[#0d2847]",
  open: openProp,
  onOpenChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  triggerAttr: string;
  menuClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (openProp == null) setUncontrolledOpen(next);
  };

  return (
    <div className={`relative ${open ? "z-30" : ""}`}>
      <button
        type="button"
        data-demo-target={triggerAttr}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen(!open)}
        className={`flex h-12 w-full items-center justify-between rounded-lg border border-[#d0d8e2] bg-white px-3 text-left ${menuClassName}`}
      >
        <span className="min-w-0 flex-1 truncate text-[16px] leading-[1.2]">{value}</span>
        <ChevronDown className={`size-4 shrink-0 opacity-60 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 max-h-[168px] overflow-y-auto rounded-lg border border-[#d0d8e2] bg-white py-1 shadow-[0_8px_24px_rgba(13,40,71,0.16)]"
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  data-demo-target={`${triggerAttr}-${option}`}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center px-3 py-2 text-left text-[14px] leading-[1.2] text-[#0d2847] hover:bg-[#f4f7fb] ${
                    selected ? "bg-[#f4f7fb] font-medium" : ""
                  }`}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
