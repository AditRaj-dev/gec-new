// Verbatim port of the SVG generators in design-explorations/newsletter-dispatch.html (commit 4f70a96).
// Design is locked (NEWSLETTER_BIN_HANDOFF.md §4): change geometry there first, then re-port.
// Every generated SVG goes through scopeIds() so several instances can share one document.

let uid = 0;
/** Prefix every id / url(#id) / href="#id" in an SVG string so instances never collide. */
export function scopeIds(svg) {
  const px = `db${++uid}-`;
  return svg.replace(/id="([^"]+)"/g, `id="${px}$1"`).replace(/(url\(#|href="#)([^)"]+)/g, `$1${px}$2`);
}

// Wire wastebasket, built from real 3D geometry so the diamond mesh wraps correctly.
// Back wires → papers → front wires, so the papers sit *inside* the basket.
export function binSVG(){
  const T = {cx:100, cy:92, rx:80, ry:20}, B = {cx:100, cy:228, rx:56, ry:12};
  const f = n => n.toFixed(1);
  const pt = (E, a) => [E.cx + E.rx*Math.cos(a), E.cy + E.ry*Math.sin(a)];
  const lerp = t => ({cx:100, cy:T.cy+(B.cy-T.cy)*t, rx:T.rx+(B.rx-T.rx)*t, ry:T.ry+(B.ry-T.ry)*t});
  const arc = (E, a0, a1, n = 48) => { let d = ''; for (let k = 0; k <= n; k++) { const [x,y] = pt(E, a0+(a1-a0)*k/n); d += (k?'L':'M')+f(x)+','+f(y); } return d; };
  // diamond lattice: each wire runs top→bottom with a twist, both handednesses
  const N = 26, twist = 0.42; let back = '', front = '';
  for (let i = 0; i < N; i++) for (const s of [1,-1]) {
    const a = i/N*2*Math.PI, b = a + s*twist;
    const [x1,y1] = pt(T,a), [x2,y2] = pt(B,b), d = `M${f(x1)},${f(y1)}L${f(x2)},${f(y2)}`;
    Math.sin((a+b)/2) > 0 ? front += d : back += d;
  }
  let backR = '', frontR = '';
  for (const t of [.5, .82]) { backR += arc(lerp(t), Math.PI, 2*Math.PI); frontR += arc(lerp(t), 0, Math.PI); }
  const band = lerp(.9);
  const papers = [
    {use:'roll', x:52, y:34, w:32, h:156, r:-17, paper:'#F3C7B1', band:'var(--blue)'},
    {use:'fold', x:70, y:4,  w:74, h:106, r:7},
    {use:'roll', x:124,y:26, w:32, h:156, r:19, paper:'#F4EEDC', band:'var(--crimson)'},
    {use:'roll', x:88, y:50, w:30, h:146, r:-4, paper:'#EFE4C6', band:'var(--gold)'},
  ];
  return `<svg viewBox="0 0 200 250" aria-hidden="true">
  <defs>
    <linearGradient id="wireF" gradientUnits="userSpaceOnUse" x1="20" x2="180">
      <stop offset="0" stop-color="#4d0106"/><stop offset=".3" stop-color="#E4574D"/><stop offset=".42" stop-color="#FFB3A8"/>
      <stop offset=".55" stop-color="#C62F29"/><stop offset=".85" stop-color="#7d0209"/><stop offset="1" stop-color="#3d0104"/></linearGradient>
    <linearGradient id="rimG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ff8a7e"/><stop offset=".35" stop-color="#C62F29"/><stop offset="1" stop-color="#5a0107"/></linearGradient>
    <radialGradient id="well" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#1a0203" stop-opacity=".55"/><stop offset="1" stop-color="#1a0203" stop-opacity=".15"/></radialGradient>
    <linearGradient id="cyl" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset=".2" stop-color="#000" stop-opacity=".06"/>
      <stop offset=".42" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset=".86" stop-color="#000" stop-opacity=".14"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
    <linearGradient id="crease" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset=".47" stop-color="#000" stop-opacity=".02"/>
      <stop offset=".5" stop-color="#000" stop-opacity=".22"/><stop offset=".52" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient>
    <pattern id="type" width="16" height="4.2" patternUnits="userSpaceOnUse">
      <rect x="0" y="1" width="7" height="1.3" fill="#3a332c" opacity=".55"/><rect x="8" y="1" width="6.5" height="1.3" fill="#3a332c" opacity=".45"/></pattern>
    <pattern id="dots" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#2b2520"/></pattern>
    <symbol id="roll" viewBox="0 0 34 160" overflow="visible">
      <rect y="8" width="34" height="152" style="fill:var(--paper)"/>
      <rect x="3" y="30" width="28" height="4" fill="#2b2520" opacity=".7"/>
      <rect x="3" y="38" width="28" height="118" fill="url(#type)"/>
      <rect x="4" y="112" width="13" height="16" fill="url(#dots)" opacity=".7"/>
      <rect y="84" width="34" height="10" style="fill:var(--band)"/>
      <rect y="84" width="34" height="2" fill="#fff" opacity=".35"/>
      <rect y="8" width="34" height="152" fill="url(#cyl)"/>
      <ellipse cx="17" cy="8" rx="17" ry="6.2" style="fill:var(--paper)"/>
      <ellipse cx="17" cy="8" rx="17" ry="6.2" fill="none" stroke="#6e5f45" stroke-opacity=".35" stroke-width=".7"/>
      <g fill="none" stroke="#6e5f45" stroke-opacity=".5" stroke-width=".6">
        <ellipse cx="16.4" cy="8.2" rx="13.2" ry="4.8"/><ellipse cx="17.2" cy="7.9" rx="9.6" ry="3.5"/>
        <ellipse cx="16.6" cy="8.1" rx="6.2" ry="2.3"/><ellipse cx="17" cy="8" rx="2.8" ry="1"/></g>
      <path d="M31 6.5 q4 1 3.4 5" fill="none" stroke="#6e5f45" stroke-opacity=".45" stroke-width=".7"/>
    </symbol>
    <symbol id="fold" viewBox="0 0 90 130" overflow="visible">
      <path d="M3 9 Q24 2 45 6 Q68 1 87 7 L88 130 L2 130 Z" fill="#F6F0DF"/>
      <text x="45" y="21" text-anchor="middle" style="font-family:var(--font-blackletter),serif" font-size="11" textLength="74" fill="#1d1a17">The GEC Dispatch</text>
      <rect x="7" y="25" width="76" height=".7" fill="#1d1a17"/><rect x="7" y="27" width="76" height="1.6" fill="#1d1a17"/>
      <rect x="7" y="32" width="76" height="5.5" fill="#1d1a17"/><rect x="7" y="40" width="52" height="5.5" fill="#1d1a17"/>
      <rect x="7" y="50" width="38" height="30" fill="url(#dots)"/><rect x="7" y="50" width="38" height="30" fill="#A3040F" opacity=".18"/>
      <rect x="48" y="50" width="35" height="76" fill="url(#type)"/><rect x="7" y="84" width="38" height="42" fill="url(#type)"/>
      <path d="M3 9 Q24 2 45 6 Q68 1 87 7 L88 130 L2 130 Z" fill="url(#crease)"/>
    </symbol>
  </defs>
  <ellipse cx="${B.cx}" cy="${B.cy}" rx="${B.rx}" ry="${B.ry}" fill="#2a0104"/>
  <ellipse cx="${T.cx}" cy="${T.cy}" rx="${T.rx}" ry="${T.ry}" fill="url(#well)"/>
  <g fill="none" stroke="#5a0107" stroke-opacity=".75" stroke-width="1.5" stroke-linecap="round"><path d="${back}"/><path d="${backR}" stroke-width="2.4"/></g>
  <path d="${arc(T, Math.PI, 2*Math.PI)}" fill="none" stroke="#7d0209" stroke-width="7" stroke-linecap="round"/>
  ${papers.map(p => `<g class="pp" style="--r:${p.r}deg${p.paper ? `;--paper:${p.paper};--band:${p.band}` : ''}"><use href="#${p.use}" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}"/></g>`).join('')}
  <g fill="none" stroke="url(#wireF)" stroke-linecap="round">
    <path d="${front}" stroke-width="2"/><path d="${frontR}" stroke-width="3"/>
    <path d="${arc(band, 0, Math.PI)}" stroke-width="9"/>
    <path d="${arc(B, 0, Math.PI)}" stroke-width="6"/></g>
  <path d="${arc(band, .15*Math.PI, .85*Math.PI)}" transform="translate(0 -2.6)" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>
  <path d="${arc(T, 0, Math.PI)}" fill="none" stroke="url(#rimG)" stroke-width="9" stroke-linecap="round"/>
  <path d="${arc({...T, cy:T.cy-2.4}, .12*Math.PI, .6*Math.PI)}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>
  <path d="M${f(T.cx-T.rx)},${T.cy}A${T.rx},${T.ry} 0 0 1 ${f(T.cx+T.rx)},${T.cy}" fill="none" stroke="url(#rimG)" stroke-width="5" opacity=".9"/>
</svg>`;
}

// tiny rolled-paper icon for the issue list
export const rollIcon = band => `<svg viewBox="0 0 22 46" aria-hidden="true"><defs><linearGradient id="ri" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".45" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient></defs>
  <rect x="2" y="5" width="18" height="40" fill="#EFE6CD"/><rect x="2" y="18" width="18" height="5" fill="${band}"/><rect x="2" y="5" width="18" height="40" fill="url(#ri)"/>
  <ellipse cx="11" cy="5" rx="9" ry="3.2" fill="#F4EEDC" stroke="#6e5f45" stroke-opacity=".4" stroke-width=".6"/><ellipse cx="11" cy="5" rx="5" ry="1.7" fill="none" stroke="#6e5f45" stroke-opacity=".5" stroke-width=".6"/></svg>`;

// grayscale scenes that get screened into halftone plates
const SCENES = {
  stage: () => `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice"><defs>
    <linearGradient id="cone" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".15"/></linearGradient>
    <radialGradient id="pool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#eee"/><stop offset="1" stop-color="#eee" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="240" fill="#1c1c1c"/>
    <polygon points="110,0 136,0 240,210 60,210" fill="url(#cone)" opacity=".75"/><polygon points="264,0 290,0 340,210 160,210" fill="url(#cone)" opacity=".6"/>
    <ellipse cx="200" cy="200" rx="150" ry="26" fill="url(#pool)"/>
    <rect x="178" y="128" width="44" height="72" rx="3" fill="#3a3a3a"/><rect x="170" y="122" width="60" height="10" rx="2" fill="#555"/>
    <circle cx="200" cy="88" r="14" fill="#111"/><path d="M176 128 Q178 104 200 104 Q222 104 224 128 Z" fill="#111"/>
    ${[...Array(10)].map((_, i) => `<circle cx="${18+i*42}" cy="${214+(i%2)*6}" r="15" fill="#050505"/><ellipse cx="${18+i*42}" cy="${248+(i%2)*6}" rx="28" ry="22" fill="#050505"/>`).join('')}</svg>`,
  people: net => `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice"><defs>
    <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f4f4f4"/><stop offset="1" stop-color="#8a8a8a"/></linearGradient></defs>
    <rect width="400" height="240" fill="url(#sky)"/><circle cx="310" cy="70" r="46" fill="#fff"/>
    ${net ? `<path d="M60 96 L140 70 L200 104 L262 64 L340 92 M140 70 L262 64 M60 96 L200 104 L340 92" stroke="#444" stroke-width="3" fill="none"/>` : ''}
    ${[[60,96,1],[140,70,1.15],[200,104,.95],[262,64,1.2],[340,92,1]].map(([x,y,s]) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="17" fill="#1a1a1a"/><path d="M-30 150 L-30 50 Q-30 24 0 24 Q30 24 30 50 L30 150Z" fill="#1a1a1a"/></g>`).join('')}
    <rect y="214" width="400" height="26" fill="#333"/></svg>`,
  skyline: () => `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice"><defs>
    <linearGradient id="dusk" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#333"/><stop offset=".75" stop-color="#e8e8e8"/></linearGradient></defs>
    <rect width="400" height="240" fill="url(#dusk)"/>
    ${[[10,150,38],[52,120,30],[86,160,44],[134,90,34],[172,140,40],[216,70,38],[258,130,30],[292,100,46],[342,150,50]].map(([x,y,w]) =>
      `<rect x="${x}" y="${y}" width="${w}" height="${240-y}" fill="#1e1e1e"/>` + [...Array(Math.floor((230-y)/14))].map((_, r) => `<rect x="${x+6}" y="${y+8+r*14}" width="${w-12}" height="4" fill="#9a9a9a" opacity="${(r*7+x)%3 ? .7 : .15}"/>`).join('')).join('')}
    <polyline points="20,200 110,160 170,176 250,104 300,120 372,40" fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>
    <polygon points="384,26 352,34 374,58" fill="#fff"/></svg>`,
  bulb: () => `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice"><defs>
    <radialGradient id="glow" cx=".5" cy=".42" r=".55"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#bbb"/><stop offset="1" stop-color="#151515"/></radialGradient>
    <radialGradient id="glass" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#cfcfcf"/></radialGradient></defs>
    <rect width="400" height="240" fill="url(#glow)"/>
    ${[...Array(12)].map((_, i) => { const a = i/12*2*Math.PI; return `<line x1="${200+Math.cos(a)*74}" y1="${96+Math.sin(a)*74}" x2="${200+Math.cos(a)*104}" y2="${96+Math.sin(a)*104}" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`; }).join('')}
    <path d="M200 42 A54 54 0 0 1 234 138 L230 160 L170 160 L166 138 A54 54 0 0 1 200 42Z" fill="url(#glass)"/>
    <path d="M186 150 L190 110 L200 124 L210 110 L214 150" fill="none" stroke="#555" stroke-width="3"/>
    <rect x="172" y="162" width="56" height="10" rx="3" fill="#444"/><rect x="176" y="174" width="48" height="10" rx="3" fill="#333"/><rect x="186" y="186" width="28" height="10" rx="5" fill="#222"/></svg>`,
};


export const sceneFor = s => s === 'network' ? SCENES.people(true) : s === 'people' ? SCENES.people(false) : SCENES[s]();
