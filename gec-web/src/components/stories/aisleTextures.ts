/**
 * Procedural SVG textures for the Stories aisle. Generated once at module load
 * (seeded, so SSR and client agree) and used as CSS background images — one
 * raster per texture instead of thousands of DOM spines.
 */

const svg = (w: number, h: number, body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`
  )}")`;

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), seed | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CLOTH = ['#4a2c20', '#6b3a2a', '#2f3b36', '#7b2d24', '#8a6b4a', '#3a2f45', '#5c4a36', '#23303d', '#9b7b52', '#3b2a20', '#b9a67e', '#1f2a24', '#5a1a14'];

/** Shelf geometry shared with the component: 4 rows, 180px pitch, 160px cavity, 20px plank. */
export const SHELF = { top: 20, pitch: 180, cavity: 160, rows: 4, wallH: 760, tileW: 1400 } as const;

function shelfWall() {
  const r = rng(26);
  const { top, pitch, cavity, rows, wallH, tileW } = SHELF;
  let b = `<defs>
    <linearGradient id='cav' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#050201'/><stop offset='.35' stop-color='#140905'/><stop offset='1' stop-color='#1d0e07'/></linearGradient>
    <linearGradient id='plk' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#8a5a33'/><stop offset='.25' stop-color='#6b3f22'/><stop offset='1' stop-color='#2e170b'/></linearGradient>
    <linearGradient id='top' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#000' stop-opacity='.75'/><stop offset='1' stop-color='#000' stop-opacity='0'/></linearGradient>
    <filter id='cloth'><feTurbulence type='fractalNoise' baseFrequency='1.6 .025' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.9 .55'/></filter>
    <filter id='grain'><feTurbulence type='fractalNoise' baseFrequency='.006 .5' numOctaves='3' seed='9'/><feColorMatrix values='0 0 0 0 .1  0 0 0 0 .05  0 0 0 0 0  0 0 0 -1.2 .7'/></filter>
  </defs><rect width='${tileW}' height='${wallH}' fill='#2a170d'/>`;
  for (let row = 0; row < rows; row++) {
    const y0 = top + row * pitch;
    const yb = y0 + cavity;
    b += `<rect x='0' y='${y0}' width='${tileW}' height='${cavity}' fill='url(#cav)'/>`;
    let x = 4;
    while (x < tileW - 8) {
      const roll = r();
      if (roll < 0.045 && x < tileW - 150) {
        const n = 2 + Math.floor(r() * 3);
        for (let k = 0; k < n; k++) {
          const w = 92 + r() * 40, h = 17, y = yb - (k + 1) * (h + 1);
          b += `<rect x='${x + r() * 8}' y='${y}' width='${w}' height='${h}' rx='2' fill='${CLOTH[Math.floor(r() * CLOTH.length)]}'/>`;
          b += `<rect x='${x + 8}' y='${y + 3}' width='2' height='${h - 6}' fill='#c9a24a' opacity='.5'/>`;
        }
        x += 142;
        continue;
      }
      if (roll < 0.07) { x += 24 + r() * 50; continue; }
      const w = 13 + r() * 22, h = 94 + r() * 58, y = yb - h, c = CLOTH[Math.floor(r() * CLOTH.length)];
      b += `<rect x='${x}' y='${y}' width='${w}' height='${h}' rx='1.5' fill='${c}'/>`;
      b += `<rect x='${x}' y='${y}' width='2' height='${h}' fill='#fff' opacity='.09'/><rect x='${x + w - 3}' y='${y}' width='3' height='${h}' fill='#000' opacity='.32'/>`;
      if (r() < 0.5) b += `<rect x='${x}' y='${y + 9}' width='${w}' height='2.5' fill='#c9a24a' opacity='.7'/><rect x='${x}' y='${yb - 16}' width='${w}' height='2.5' fill='#c9a24a' opacity='.7'/>`;
      if (r() < 0.22) b += `<rect x='${x + 3}' y='${y + h * 0.35}' width='${w - 6}' height='${Math.min(26, h * 0.2)}' fill='#e9dcc0' opacity='.75'/>`;
      x += w + 1;
    }
    b += `<rect x='0' y='${y0}' width='${tileW}' height='26' fill='url(#top)'/>`;
    b += `<rect x='0' y='${yb}' width='${tileW}' height='${pitch - cavity}' fill='url(#plk)'/><rect x='0' y='${yb}' width='${tileW}' height='1.5' fill='#d9a56a' opacity='.45'/>`;
  }
  b += `<rect width='${tileW}' height='${wallH}' filter='url(#cloth)' opacity='.35'/>`;
  b += `<rect y='0' width='${tileW}' height='${top}' fill='#1a0d06'/>`;
  return svg(tileW, wallH, b);
}

function floor() {
  let b = `<defs><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='.09 .004' numOctaves='3' seed='3'/><feColorMatrix values='0 0 0 0 .08  0 0 0 0 .04  0 0 0 0 .01  0 0 0 -1.4 .9'/></filter>
    <filter id='weave'><feTurbulence type='turbulence' baseFrequency='.7' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.8 .5'/></filter></defs>
    <rect width='840' height='900' fill='#4a2a16'/><rect width='840' height='900' filter='url(#g)'/>`;
  for (let x = 0; x < 840; x += 70) b += `<rect x='${x}' width='1.5' height='900' fill='#140904' opacity='.8'/>`;
  b += `<rect x='262' width='316' height='900' fill='#c9a24a'/><rect x='270' width='300' height='900' fill='#7a0a12'/>
    <rect x='284' width='272' height='900' fill='none' stroke='#c9a24a' stroke-width='1.5' stroke-dasharray='10 6' opacity='.55'/>
    <rect x='262' width='316' height='900' filter='url(#weave)' opacity='.55'/>`;
  return svg(840, 900, b);
}

function ceiling() {
  let b = `<defs><radialGradient id='l'><stop offset='0' stop-color='#fff4cf'/><stop offset='.25' stop-color='#ffd98a' stop-opacity='.6'/><stop offset='1' stop-color='#ffd98a' stop-opacity='0'/></radialGradient>
    <filter id='g'><feTurbulence type='fractalNoise' baseFrequency='.004 .08' numOctaves='3' seed='5'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 .6'/></filter></defs>
    <rect width='840' height='900' fill='#241309'/>`;
  for (let y = 0; y < 900; y += 300)
    for (let x = 0; x < 840; x += 280)
      b += `<rect x='${x + 14}' y='${y + 14}' width='252' height='272' fill='#1a0d06' stroke='#4a2a16' stroke-width='6'/>`;
  b += `<rect width='840' height='900' filter='url(#g)'/><circle cx='420' cy='450' r='240' fill='url(#l)'/>`;
  return svg(840, 900, b);
}

function damask() {
  const b = `<rect width='120' height='140' fill='#4b050a'/>
    <path d='M60 12c14 18 30 24 30 44s-16 30-30 44c-14-14-30-24-30-44s16-26 30-44Z' fill='none' stroke='#6d0d14' stroke-width='3'/>
    <path d='M60 40c6 8 12 12 12 20s-6 14-12 20c-6-6-12-12-12-20s6-12 12-20Z' fill='#63090f'/>
    <circle cx='0' cy='0' r='6' fill='#63090f'/><circle cx='120' cy='0' r='6' fill='#63090f'/><circle cx='0' cy='140' r='6' fill='#63090f'/><circle cx='120' cy='140' r='6' fill='#63090f'/>`;
  return svg(120, 140, b);
}

/** Fine all-purpose grain for brass, paper, and cloth spines. */
export const NOISE = svg(
  160,
  160,
  `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1 .6'/></filter><rect width='160' height='160' filter='url(#n)'/>`
);

export const TEXTURES = { shelf: shelfWall(), floor: floor(), ceiling: ceiling(), damask: damask(), noise: NOISE };
