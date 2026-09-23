/**
 * Minimal, dependency-free class-name joiner (clsx-style). Accepts strings,
 * numbers, arrays, and boolean-keyed objects; skips falsy values.
 *
 * This is a local implementation — it does not resolve conflicting Tailwind
 * utilities the way `tailwind-merge` would, because none of this codebase's
 * call sites rely on that (each call site branches with a ternary rather
 * than passing overlapping utility classes to merge).
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
