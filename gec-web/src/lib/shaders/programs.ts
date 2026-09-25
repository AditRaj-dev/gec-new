import type { ShaderFamily } from './renderer';

export const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// highp where the GPU has it: on Android (Mali/Adreno) mediump is a true 16-bit float, which breaks the
// sin-hash noise and the CSS-px pattern coordinates (flat colour or garbage). Desktop GPUs run mediump at 32 bits.
const HEAD = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uC0, uC1, uC2, uC3;
// Phones: patterns are composed for wide sections; on tall phone sections they run rotated 90°.
// FC()/RES() are the fragment coord and resolution in that rotated frame (identity on desktop, uPhone = 0).
uniform float uPhone;
vec2 FC() { return uPhone > 0.5 ? vec2(gl_FragCoord.y, uRes.x - gl_FragCoord.x) : gl_FragCoord.xy; }
vec2 RES() { return uPhone > 0.5 ? uRes.yx : uRes; }
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

/** Watercolor on paper. `falloff` = pigment focus point + fade radii. */
const watercolor = (focus: string, inner: string, outer: string, pool = '', extraWeight = '') => `${HEAD}
void main() {
  vec2 uv = FC() / RES();
  vec2 p = uv * vec2(RES().x / RES().y, 1.0) * 1.6;
  float t = uTime * 0.02;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  float f = fbm(p + 2.0 * q);
  ${pool}
  vec3 col = mix(uC0, uC1, smoothstep(0.35, 0.85, f));
  col = mix(col, uC2, smoothstep(0.55, 0.95, q.x) * 0.6);
  col = mix(col, uC3, smoothstep(0.7, 1.0, q.y) * 0.35);
  col -= (1.0 - smoothstep(0.0, 0.02, abs(f - 0.6))) * 0.08;
  float w = 1.0 - smoothstep(${inner}, ${outer}, distance(uv, vec2(${focus})));
  ${extraWeight}
  gl_FragColor = vec4(mix(uC0, col, w), 1.0);
}`;

/** Hero: pigment puddles across the whole section — pale wash, darker cores, dried dark rims, granulation.
 *  uC0 paper, uC1 deep pigment (cores + rims), uC2 wash pigment. */
const WATERCOLOR = `${HEAD}
void main() {
  vec2 uv = FC() / RES();
  vec2 p = uv * vec2(RES().x / RES().y, 1.0) * 1.35;
  float t = uTime * 0.02;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  float f = fbm(p + 2.2 * q);
  float pool = smoothstep(0.40, 0.58, f);
  float core = smoothstep(0.54, 0.78, f);
  float rim = (1.0 - smoothstep(0.0, 0.035, abs(f - 0.47))) * 0.8;
  vec3 col = mix(uC0, uC2, pool * 0.7);
  col = mix(col, uC1, core * 0.85);
  col = mix(col, uC1 * 0.8, rim * 0.45);
  col -= (hash(floor(FC() * 0.5)) - 0.5) * 0.05 * pool;
  gl_FragColor = vec4(col, 1.0);
}`;
/** Stage Manager: same wash spread across the whole panel (full colour out to every corner; fades only past them). */
const WASH = watercolor('0.5, 0.6', '0.8', '1.6',
  // Pigment pool over the rail/canvas gap and the canvas's top-left, where the noise alone runs pale.
  'f += 0.22 * (1.0 - smoothstep(0.0, 0.38, distance(uv, vec2(0.27, 0.82))));');

/** Subtle liquid — red on red. Gold stays under 3% of the frame. */
const LIQUID = `${HEAD}
void main() {
  vec2 p = (FC() - 0.5 * RES()) / RES().y;
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
  vec2 uv = FC() / RES();
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

/**
 * Print-derived backgrounds for plain cream/sand/crimson sections (route layouts plan §8).
 * Opaque: they paint the surface colour (uC0) and mix ink in, so the canvas runs at full opacity.
 * `uScale` = internal px per CSS px, so patterns are sized in CSS px whatever the render scale.
 * `mask` keeps ink off the copy: RIGHT = empty right side (heroes), EDGES = corners only.
 */
// `gutter` = both side margins outside the 1320px content column (plus the 48px section padding),
// so wide screens get pattern down the empty left and right sides without it running under the copy.
// Phones (`phone` = uPhone, set by the renderer at ≤768px) have no gutters and one full-width column of copy: heroes keep ink in the
// top-right corner; other sections only in `bands`, their top and bottom padding (CSS px, so tall phone
// sections don't get ink behind the text); the footer all over at half strength, full along the bottom (watermark).
const RIGHT = 'mix(max(smoothstep(0.5, 1.0, uv.x) * (0.4 + 0.6 * uv.y), gutter), smoothstep(0.25, 1.0, uv.x) * smoothstep(0.35, 1.0, uv.y), phone)';
const EDGES = 'mix(max(smoothstep(0.28, 0.9, length((uv - 0.5) * vec2(1.5, 1.15))), gutter), bands, phone)';
const FOOT = 'mix(max(smoothstep(0.28, 0.9, length((uv - 0.5) * vec2(1.5, 1.15))), gutter), max(0.5, 1.0 - smoothstep(40.0, 220.0, sp.y)), phone)';
const print = (mask: string, body: string) => `${HEAD}
uniform float uScale;
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
void main() {
  // masks: screen space (uv, sp in CSS px) so ink stays off the copy; pattern: p, rotated on phones
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 sp = gl_FragCoord.xy / max(uScale, 0.01);
  vec2 p = FC() / max(uScale, 0.01);
  float t = uTime;
  float w = uRes.x / max(uScale, 0.01);
  float gw = max((w - 1320.0) * 0.5, 0.0) + 48.0;
  float gutter = max(1.0 - smoothstep(gw * 0.45, gw + 24.0, sp.x), smoothstep(w - gw - 24.0, w - gw * 0.45, sp.x));
  float phone = uPhone;
  float hgt = uRes.y / max(uScale, 0.01);
  float bands = max(1.0 - smoothstep(20.0, 84.0, sp.y), smoothstep(hgt - 84.0, hgt - 20.0, sp.y));
  float m = ${mask};
  ${body}
}`;

/** Topographic contour lines, every 5th an "index contour" in gold. */
const CONTOUR_BODY = `
  float k = fbm(p / 300.0 + vec2(t * 0.012, -t * 0.008)) * 11.0;
  float d = min(fract(k), 1.0 - fract(k));
  float major = step(mod(floor(k + 0.5), 5.0), 0.5);
  float line = 1.0 - smoothstep(0.012 + 0.02 * major, 0.045 + 0.03 * major, d);
  float a = line * m * 0.26 * (1.0 + 0.6 * major);
  gl_FragColor = vec4(mix(uC0, mix(uC1, uC2, major), a), 1.0);`;
const CONTOUR = print(RIGHT, CONTOUR_BODY);
/** Same lines on the charcoal footer, around the edges and gutters; kept low so copy on top stays readable. */
const NIGHT = print(FOOT, CONTOUR_BODY.replace('0.26 * (1.0', '0.24 * (1.0'));

/** Newspaper halftone screen at 15°, dot size from slow noise. */
const HALFTONE = print(EDGES, `
  vec2 g = rot(0.26) * p / 9.0, c = floor(g) + 0.5;
  float v = smoothstep(0.3, 0.75, fbm(c * 9.0 / 360.0 + vec2(t * 0.02, t * 0.01)));
  float rad = 0.48 * v * m;
  float dotv = 1.0 - smoothstep(rad - 0.1, rad + 0.02, length(fract(g) - 0.5));
  gl_FragColor = vec4(mix(uC0, uC1, dotv * 0.22 * step(0.04, rad)), 1.0);`);

/** Copper-plate engraving: 45° hatch weighted by noise, cross-hatch in the darks. */
const HATCH = print(EDGES, `
  float sh = smoothstep(0.42, 0.78, fbm(p / 320.0 + vec2(t * 0.01, 0.0))) * m;
  float d1 = abs(fract((p.x + p.y) / 7.0) - 0.5) * 2.0;
  float d2 = abs(fract((p.x - p.y) / 7.0) - 0.5) * 2.0;
  float w2 = max(sh - 0.5, 0.0) * 0.9;
  float l1 = (1.0 - smoothstep(sh * 0.55, sh * 0.55 + 0.18, d1)) * step(0.02, sh);
  float l2 = (1.0 - smoothstep(w2, w2 + 0.18, d2)) * step(0.5, sh);
  gl_FragColor = vec4(mix(uC0, uC1, max(l1, l2) * 0.2), 1.0);`);

/** Two-drum risograph on crimson: gold + oxblood screens, misregistered, with grain. */
const RISO = print(EDGES, `
  vec2 g1 = rot(1.31) * p / 7.0, g2 = rot(0.26) * (p + vec2(2.0, 1.5)) / 7.0;
  float v1 = smoothstep(0.5, 0.8, fbm(p / 420.0 + vec2(t * 0.015, 0.0))) * m;
  float v2 = smoothstep(0.45, 0.8, fbm(p / 300.0 + vec2(-t * 0.012, 5.0)));
  float d1 = 1.0 - smoothstep(v1 * 0.46 - 0.1, v1 * 0.46 + 0.02, length(fract(g1) - 0.5));
  float d2 = 1.0 - smoothstep(v2 * 0.5 - 0.1, v2 * 0.5 + 0.02, length(fract(g2) - 0.5));
  vec3 col = mix(uC0, uC2, d2 * step(0.03, v2) * 0.45);
  col = mix(col, uC1, d1 * step(0.03, v1) * 0.38);
  col += (hash(p + fract(t)) - 0.5) * 0.02;
  gl_FragColor = vec4(col, 1.0);`);

export const PROGRAMS: Record<ShaderFamily, { frag: string; palette: [string, string, string, string] }> = {
  // Hero blend (owner-supplied watercolors config): Rose Rice paper, Deep Plum, Wild Plum. No gold.
  watercolor: { frag: WATERCOLOR, palette: ['#FBF8EE', '#951E1A', '#B63D31', '#B63D31'] },
  wash: { frag: WASH, palette: ['#FCF8ED', '#A3040F', '#C62F29', '#FBCA05'] },
  liquid: { frag: LIQUID, palette: ['#72030A', '#A3040F', '#C62F29', '#FBCA05'] },
  specular: { frag: SPECULAR, palette: ['#18191C', '#222222', '#A3040F', '#FBCA05'] },
  contour: { frag: CONTOUR, palette: ['#FCF8ED', '#A3040F', '#FBCA05', '#FBCA05'] },
  halftone: { frag: HALFTONE, palette: ['#F4E2CA', '#A3040F', '#A3040F', '#A3040F'] },
  hatch: { frag: HATCH, palette: ['#FCF8ED', '#222222', '#222222', '#222222'] },
  night: { frag: NIGHT, palette: ['#141518', '#C62F29', '#FBCA05', '#FBCA05'] },
  riso: { frag: RISO, palette: ['#A3040F', '#FBCA05', '#72030A', '#72030A'] },
};
