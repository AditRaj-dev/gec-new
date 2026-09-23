/**
 * Minimal, dependency-free class-name joiner (clsx-style). Accepts strings,
 * numbers, arrays, and boolean-keyed objects; skips falsy values.
 *
 * This is a local implementation — unlike `tailwind-merge`, it does NOT
 * dedupe or resolve conflicting Tailwind utilities. All inputs are simply
 * concatenated in argument order, and if two land in the output targeting
 * the same CSS property (e.g. two `shadow-*` classes), Tailwind's generated
 * stylesheet order decides the winner — not "last argument wins" the way
 * callers of a merging `cn` would expect. Any `className` passthrough prop
 * built on this helper should only ever be given classes that don't overlap
 * with the component's own; branch with a ternary (or combine into one
 * class, e.g. a single `shadow-[a,b]`) instead of passing two conditional
 * classes that touch the same property.
 */
export type ClassValue =
  | string
  | number
  | null
  | boolean
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

function pushClasses(value: ClassValue, out: string[]): void {
  if (!value) return;

  if (typeof value === 'string' || typeof value === 'number') {
    out.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) pushClasses(item, out);
    return;
  }

  if (typeof value === 'object') {
    for (const [key, condition] of Object.entries(value)) {
      if (condition) out.push(key);
    }
  }
}

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) pushClasses(input, out);
  return out.join(' ');
}
