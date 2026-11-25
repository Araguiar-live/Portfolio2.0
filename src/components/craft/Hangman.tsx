type HangmanProps = {
  /** Fill the parent hero tile. Leaves out the standalone card. */
  embedded?: boolean;
};

/**
 * A gallows that draws its figure on a loop. The frame stays charcoal; each
 * limb lights in orange, then the figure clears and starts again.
 */
export function Hangman({ embedded = false }: HangmanProps) {
  const art = (
    <svg viewBox="0 0 88 112" className="hangman__svg" aria-hidden>
      <path className="hangman__gallows" d="M16 100 H72 M30 100 V16 H64 M64 16 V28" />
      <line className="hangman__gallows" x1="64" y1="28" x2="64" y2="36" />
      <circle className="hangman__part hangman__part--head" cx="64" cy="46" r="9" />
      <line className="hangman__part hangman__part--body" x1="64" y1="55" x2="64" y2="78" />
      <line className="hangman__part hangman__part--arm-l" x1="64" y1="62" x2="50" y2="72" />
      <line className="hangman__part hangman__part--arm-r" x1="64" y1="62" x2="78" y2="72" />
      <line className="hangman__part hangman__part--leg-l" x1="64" y1="78" x2="52" y2="94" />
      <line className="hangman__part hangman__part--leg-r" x1="64" y1="78" x2="76" y2="94" />
    </svg>
  );

  if (embedded) {
    return <div className="hangman hangman--embedded">{art}</div>;
  }

  return <div className="hangman">{art}</div>;
}
