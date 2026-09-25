export interface Metric { value: number; prefix: string; suffix: string; grouped: boolean; raw: string }

/** Splits "12,000+" into its number and decoration so it can count up and land on the exact string. */
export function parseMetric(s: string): Metric {
  const m = s.match(/^(\D*?)(\d[\d,]*)(\D*)$/);
  if (!m) return { value: 0, prefix: '', suffix: '', grouped: false, raw: s };
  return { value: Number(m[2].replaceAll(',', '')), prefix: m[1], suffix: m[3], grouped: m[2].includes(','), raw: s };
}

export function formatMetric(n: number, m: Metric): string {
  if (!/\d/.test(m.raw)) return m.raw;
  const v = Math.round(n);
  return m.prefix + (m.grouped ? v.toLocaleString('en-US') : String(v)) + m.suffix;
}
