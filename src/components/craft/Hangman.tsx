type HangmanProps = {
  /** Fill the parent hero tile. Leaves out the standalone card. */
  embedded?: boolean;
};

/**
 * Gallows with the figure hung from the beam. The rope and body swing as one
 * pendulum around the beam tip.
 */
export function Hangman({ embedded = false }: HangmanProps) {
  const art = (
    <svg viewBox="0 0 120 150" className="hangman__svg" aria-hidden>
      <path className="hangman__gallows" d="M14 140 H58 M34 140 V18 H78" />
      <g className="hangman__swing">
        <line className="hangman__rope" x1="78" y1="18" x2="78" y2="46" />
        <circle className="hangman__part" cx="78" cy="58" r="12" />
        <line className="hangman__part" x1="78" y1="70" x2="78" y2="98" />
        <line className="hangman__part" x1="78" y1="78" x2="62" y2="90" />
        <line className="hangman__part" x1="78" y1="78" x2="94" y2="90" />
        <line className="hangman__part" x1="78" y1="98" x2="66" y2="118" />
        <line className="hangman__part" x1="78" y1="98" x2="90" y2="118" />
      </g>
    </svg>
  );

  if (embedded) {
    return <div className="hangman hangman--embedded">{art}</div>;
  }

  return <div className="hangman">{art}</div>;
}
