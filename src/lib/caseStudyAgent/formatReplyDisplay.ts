/** UK display spellings for grounded chat replies (source notes may use either). */
const US_TO_UK: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bcustomizable\b/gi, "customisable"],
  [/\bcustomized\b/gi, "customised"],
  [/\borganize\b/gi, "organise"],
  [/\borganized\b/gi, "organised"],
  [/\borganizing\b/gi, "organising"],
  [/\blabeled\b/gi, "labelled"],
  [/\blabeling\b/gi, "labelling"],
  [/\btokenized\b/gi, "tokenised"],
  [/\btokenize\b/gi, "tokenise"],
  [/\boptimize\b/gi, "optimise"],
  [/\boptimized\b/gi, "optimised"],
  [/\bbehavior\b/gi, "behaviour"],
  [/\bcolors\b/gi, "colours"],
  [/\bcolor\b/gi, "colour"],
];

export function formatCaseStudyReplyForDisplay(text: string): string {
  return US_TO_UK.reduce((out, [pattern, uk]) => out.replace(pattern, uk), text);
}