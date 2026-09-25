// Pure helpers that turn a /v1/public/content/:entityType response into site data.
// The response is ContentItem[]; anything else (null fallback, error envelope) means "use the fallback".
type Item = { data?: unknown };

const items = (res: unknown): Item[] => (Array.isArray(res) ? res.filter((i) => i && typeof i === 'object') : []);
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** First published doc, shallow-merged over the fallback so missing fields never blank the page. */
export function pickSingleton<T extends object>(res: unknown, fallback: T): T {
  const data = items(res)[0]?.data;
  return isObj(data) ? ({ ...fallback, ...data } as T) : fallback;
}

/** Every published doc's data, ordered by `order` (docs without one keep their position). */
export function pickList<T>(res: unknown, fallback: T[]): T[] {
  const rows = items(res)
    .map((it, i) => ({ d: it.data, i }))
    .filter((r): r is { d: Record<string, unknown>; i: number } => isObj(r.d));
  if (!rows.length) return fallback;
  const key = (r: { d: Record<string, unknown>; i: number }) => (typeof r.d.order === 'number' ? r.d.order : r.i);
  return rows.sort((a, b) => key(a) - key(b)).map((r) => r.d as T);
}
