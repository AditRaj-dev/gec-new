// Pure helpers that turn a /v1/public/content/:entityType response into site data.
// The response is ContentItem[]; anything else (null fallback, error envelope) means "use the fallback".
// A malformed or partial CMS doc must never crash a page (see gec-web/AGENTS.md / CMS Phase 0 constraints):
// every value is kind-checked against the fallback's shape before it is allowed to replace it.
type Item = { data?: unknown };

const items = (res: unknown): Item[] => (Array.isArray(res) ? res.filter((i) => i && typeof i === 'object') : []);
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** 'array' | 'object' | 'null' | typeof for primitives — used to compare a CMS value's shape to the fallback's. */
const kind = (v: unknown): string => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);

/** Shallow, kind-checked merge of a nested plain object one level deep (no further recursion). */
function mergeNested(fallback: Record<string, unknown>, data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...fallback };
  for (const key of Object.keys(fallback)) {
    if (!(key in data)) continue;
    if (kind(fallback[key]) === kind(data[key])) out[key] = data[key];
  }
  return out;
}

/**
 * First published doc, merged over the fallback per top-level key: a key is taken from the CMS
 * doc only when its kind (typeof, array vs plain object) matches the fallback's; a plain-object
 * value is merged one level deeper the same way. Keys the CMS doc has but the fallback doesn't
 * are dropped. Missing/wrong-typed fields always fall back, so a partial or malformed doc never
 * blanks or crashes the page.
 */
export function pickSingleton<T extends object>(res: unknown, fallback: T): T {
  const data = items(res)[0]?.data;
  if (!isObj(data)) return fallback;
  const out: Record<string, unknown> = { ...(fallback as object) };
  for (const key of Object.keys(fallback as object)) {
    if (!(key in data)) continue;
    const fv = (fallback as Record<string, unknown>)[key];
    const dv = data[key];
    if (kind(fv) !== kind(dv)) continue;
    out[key] = kind(fv) === 'object' ? mergeNested(fv as Record<string, unknown>, dv as Record<string, unknown>) : dv;
  }
  return out as T;
}

/** True when every top-level key the fallback item has exists on the candidate with a matching kind. */
function matchesShape(fallbackItem: Record<string, unknown>, candidate: Record<string, unknown>): boolean {
  return Object.keys(fallbackItem).every((k) => k in candidate && kind(fallbackItem[k]) === kind(candidate[k]));
}

/**
 * Every published doc's data, ordered by `order` (docs without one keep their relative position,
 * but sort AFTER every doc that does have one). Items are validated against the fallback's first
 * element first: an item missing a key the fallback item has, or with a wrong-kind value for one,
 * is dropped rather than risk shipping a malformed shape to a component. If the fallback list is
 * empty there is no shape to validate against, so every item with object data is kept (unchanged
 * behaviour).
 */
export function pickList<T>(res: unknown, fallback: T[]): T[] {
  const rows = items(res)
    .map((it, i) => ({ d: it.data, i }))
    .filter((r): r is { d: Record<string, unknown>; i: number } => isObj(r.d));
  if (!rows.length) return fallback;

  const fallbackItem = fallback[0];
  const validated = isObj(fallbackItem) ? rows.filter((r) => matchesShape(fallbackItem, r.d)) : rows;
  if (!validated.length) return fallback;

  const ordered = validated.filter((r) => typeof r.d.order === 'number');
  const unordered = validated.filter((r) => typeof r.d.order !== 'number');
  ordered.sort((a, b) => (a.d.order as number) - (b.d.order as number));
  unordered.sort((a, b) => a.i - b.i);
  return [...ordered, ...unordered].map((r) => r.d as T);
}
