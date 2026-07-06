// src/utils/initials.ts
// D365 model-driven grids build a record's avatar initials from the first letter
// of its first (up to) two words, preserving the source casing — e.g.
// "Site check" -> "Sc", "Water Framework Directive" -> "WF". This differs from
// Fluent's default (first + last word, upper-cased), so we compute it ourselves.
export function d365Initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0][0] ?? '';
  const second = words.length > 1 ? words[1][0] ?? '' : '';
  return first + second;
}
