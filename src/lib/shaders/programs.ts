import type { ShaderFamily } from './renderer';

export const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const HEAD = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uC0, uC1, uC2, uC3;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}`;

/** Watercolor on paper — hero. Pigment pools towards the top right (texture spec §41 fallback position). */
const WATERCOLOR = `${HEAD}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv * vec2(uRes.x / uRes.y, 1.0) * 1.6;
  float t = uTime * 0.02;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  float f = fbm(p + 2.0 * q);
  vec3 col = mix(uC0, uC1, smoothstep(0.35, 0.85, f));
  col = mix(col, uC2, smoothstep(0.55, 0.95, q.x) * 0.6);
  col = mix(col, uC3, smoothstep(0.7, 1.0, q.y) * 0.35);
  col -= (1.0 - smoothstep(0.0, 0.02, abs(f - 0.6))) * 0.08;
  float w = 1.0 - smoothstep(0.2, 1.1, distance(uv, vec2(0.78, 0.78)));
  gl_FragColor = vec4(mix(uC0, col, w), 1.0);
}`;

/** Subtle liquid — red on red. Gold stays under 3% of the frame. */
const LIQUID = `${HEAD}
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.05;
  for (int i = 0; i < 3; i++) {
    p += 0.35 * vec2(sin(p.y * 2.1 + t), cos(p.x * 1.7 - t * 1.3));
  }
  float v = 0.5 + 0.5 * sin(p.x * 2.0 + p.y * 1.5);
  vec3 col = mix(uC0, uC1, smoothstep(0.1, 0.7, v));
  col = mix(col, uC2, smoothstep(0.75, 1.0, v) * 0.7);
  col = mix(col, uC3, smoothstep(0.985, 1.0, v) * 0.5);
  gl_FragColor = vec4(col, 1.0);
}`;

/** Specular lines — charcoal. Fine warped rules with a slow gold sweep. */
const SPECULAR = `${HEAD}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime * 0.03;
  float n = fbm(vec2(uv.x * 3.0, uv.y * 1.5) + t);
  float y = uv.y * 18.0 + n * 4.0;
  float line = pow(1.0 - abs(fract(y) - 0.5) * 2.0, 24.0);
  float sweep = 1.0 - smoothstep(0.0, 0.35, abs(uv.x - (fract(t * 0.5) * 1.4 - 0.2)));
  vec3 col = mix(uC0, uC1, uv.y);
  col += uC2 * line * 0.55;
  col += uC3 * line * sweep * 0.35;
  gl_FragColor = vec4(col, 1.0);
}`;

export const PROGRAMS: Record<ShaderFamily, { frag: string; palette: [string, string, string, string] }> = {
  watercolor: { frag: WATERCOLOR, palette: ['#FCF8ED', '#A3040F', '#C62F29', '#FBCA05'] },
  liquid: { frag: LIQUID, palette: ['#72030A', '#A3040F', '#C62F29', '#FBCA05'] },
  specular: { frag: SPECULAR, palette: ['#18191C', '#222222', '#A3040F', '#FBCA05'] },
};
