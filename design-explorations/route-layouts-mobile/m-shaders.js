// Phone build of ../route-layouts/shaders.js — same four families (contour, halftone, hatch, riso), tuned for mobile GPUs.
// Host: any element with data-shader="contour|halftone|hatch|riso" (+ optional data-mask="edges|corner", data-ink, data-strength).
// Mobile rules (vs desktop):
//   · render scale 0.35×DPR, capped at 480px wide (desktop: 0.5×, 1280px) — the texture is soft anyway
//   · 24fps cap (desktop 30) · only hosts actually on screen draw (desktop pre-draws 300px ahead)
//   · at most MAX_LIVE contexts alive; off-screen hosts past that are released and re-created when they return
//   · frame-time guard: avg of first 30 frames > 42ms → freeze to a single still frame
//   · still frame (no animation) when: reduced motion, Save-Data, deviceMemory < 4, or battery-saver-ish low fps
//   · any GL failure → canvas removed, the flat CSS surface shows (same as desktop)
// ponytail: one context per host with a live cap; move to one shared offscreen context if pages grow past ~10 hosts.
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    || navigator.connection?.saveData
    || (navigator.deviceMemory && navigator.deviceMemory < 4);
  const MAX_LIVE = 4, FPS_MS = 1000 / 24;

  const HEAD = `precision mediump float;
uniform vec2 r; uniform float t, s, a, side; uniform vec3 ink, ink2;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,m=.5;for(int i=0;i<3;i++){v+=m*n(p);p=p*2.03+17.;m*=.5;}return v;}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
// side=0 → edges only (keeps the text column clean), side=1 → top-right corner (portrait heroes: headline sits left/below)
float mask(vec2 uv){
  float edges=smoothstep(.34,.92,length((uv-.5)*vec2(1.9,1.)));
  float corner=smoothstep(.25,1.,uv.x)*smoothstep(.35,1.,uv.y);
  return mix(edges,corner,side);}
`;
  // Same programs as desktop; fbm drops to 3 octaves and cell sizes grow a touch so lines survive the low render scale.
  const FAMILIES = {
    contour: `void main(){
  vec2 uv=gl_FragCoord.xy/r, p=gl_FragCoord.xy/s;
  float k=fbm(p/220.+vec2(t*.012,-t*.008))*10.;
  float d=min(fract(k),1.-fract(k));
  float major=step(mod(floor(k+.5),5.),.5);
  float line=1.-smoothstep(.02+.02*major,.06+.03*major,d);
  vec3 c=mix(ink,ink2,major);
  float al=line*a*mask(uv)*(1.+.6*major);
  gl_FragColor=vec4(c*al,al);}`,
    halftone: `void main(){
  vec2 uv=gl_FragCoord.xy/r, p=rot(.26)*(gl_FragCoord.xy/s);
  float cell=8.; vec2 g=p/cell, c=floor(g)+.5;
  float v=smoothstep(.3,.75,fbm(c*cell/260.+vec2(t*.02,t*.01)));
  float rad=.48*v*mask(uv);
  float dot=1.-smoothstep(rad-.12,rad+.02,length(fract(g)-.5));
  float al=dot*a*step(.04,rad);
  gl_FragColor=vec4(ink*al,al);}`,
    hatch: `void main(){
  vec2 uv=gl_FragCoord.xy/r, p=gl_FragCoord.xy/s;
  float sh=smoothstep(.42,.78,fbm(p/240.+vec2(t*.01,0.)))*mask(uv);
  float d1=abs(fract((p.x+p.y)/6.)-.5)*2.;
  float d2=abs(fract((p.x-p.y)/6.)-.5)*2.;
  float l1=1.-smoothstep(sh*.55,sh*.55+.2,d1);
  float l2=(1.-smoothstep(max(sh-.5,0.)*.9,max(sh-.5,0.)*.9+.2,d2))*step(.5,sh);
  float al=max(l1*step(.02,sh),l2)*a;
  gl_FragColor=vec4(ink*al,al);}`,
    riso: `void main(){
  vec2 uv=gl_FragCoord.xy/r, p=gl_FragCoord.xy/s;
  vec2 g1=rot(1.31)*p/6., g2=rot(.26)*(p+vec2(2.,1.5))/6.;
  float v1=smoothstep(.5,.8,fbm(p/300.+vec2(t*.015,0.)))*mask(uv);
  float v2=smoothstep(.45,.8,fbm(p/220.+vec2(-t*.012,5.)));
  float d1=1.-smoothstep(v1*.46-.1,v1*.46+.02,length(fract(g1)-.5));
  float d2=1.-smoothstep(v2*.5-.1,v2*.5+.02,length(fract(g2)-.5));
  float a1=d1*step(.03,v1)*a*.8, a2=d2*step(.03,v2)*a;
  float grain=(h(p+fract(t))-.5)*.05;
  float al=a1+a2*(1.-a1);
  gl_FragColor=vec4(ink*a1+ink2*a2*(1.-a1)+grain*al,al);}`,
  };

  const COLORS = { crimson: [.639, .016, .059], gold: [.984, .792, .02], ink: [.133, .133, .133], oxblood: [.447, .012, .039] };
  // Slightly stronger than desktop: phone screens are smaller and viewed in brighter light.
  const PRESET = {
    contour: { ink: 'crimson', ink2: 'gold', a: .2 },
    halftone: { ink: 'crimson', ink2: 'crimson', a: .15 },
    hatch: { ink: 'ink', ink2: 'ink', a: .13 },
    riso: { ink: 'gold', ink2: 'oxblood', a: .34 },
  };
  const VERT = 'attribute vec2 v;void main(){gl_Position=vec4(v,0.,1.);}';

  const layers = [];
  let off = false;

  function create(L) {
    const { host } = L, fam = host.dataset.shader, pre = PRESET[fam];
    const cv = document.createElement('canvas');
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0;transition:opacity .6s';
    host.prepend(cv);
    const gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
    const fail = () => { cv.remove(); L.broken = true; };
    if (!gl) return fail();
    const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : (console.warn(fam, gl.getShaderInfoLog(o)), null); };
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, HEAD + FAMILIES[fam]);
    if (!vs || !fs) return fail();
    const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return fail();
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const U = k => gl.getUniformLocation(pr, k);
    const inks = (host.dataset.ink || '').split(',');
    gl.uniform3fv(U('ink'), COLORS[inks[0]] || COLORS[pre.ink]);
    gl.uniform3fv(U('ink2'), COLORS[inks[1] || inks[0]] || COLORS[pre.ink2]);
    gl.uniform1f(U('a'), +(host.dataset.strength || pre.a));
    gl.uniform1f(U('side'), host.dataset.mask === 'corner' ? 1 : 0);
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); release(L); });
    Object.assign(L, { cv, gl, uR: U('r'), uT: U('t'), uS: U('s'), drawn: false });
    size(L);
  }

  function size(L) {
    if (!L.gl) return;
    const w = L.host.clientWidth, hgt = L.host.clientHeight;
    const sc = Math.min(.35 * devicePixelRatio, 480 / Math.max(w, 1));
    L.cv.width = Math.max(1, Math.round(w * sc)); L.cv.height = Math.max(1, Math.round(hgt * sc));
    L.gl.viewport(0, 0, L.cv.width, L.cv.height);
    L.gl.uniform2f(L.uR, L.cv.width, L.cv.height); L.gl.uniform1f(L.uS, sc);
    L.drawn = false;
  }

  function release(L) {
    L.gl?.getExtension('WEBGL_lose_context')?.loseContext();
    L.cv?.remove();
    L.gl = L.cv = null;
  }

  // Keep at most MAX_LIVE contexts: drop the ones furthest off screen.
  function budget() {
    const live = layers.filter(L => L.gl);
    if (live.length <= MAX_LIVE) return;
    const mid = innerHeight / 2;
    live.filter(L => !L.near)
      .sort((a, b) => Math.abs(b.host.getBoundingClientRect().top - mid) - Math.abs(a.host.getBoundingClientRect().top - mid))
      .slice(0, live.length - MAX_LIVE).forEach(release);
  }

  for (const host of document.querySelectorAll('[data-shader]')) {
    if (!PRESET[host.dataset.shader]) continue;
    const L = { host, near: false };
    new ResizeObserver(() => size(L)).observe(host);
    new IntersectionObserver(([e]) => {
      L.near = e.isIntersecting;
      if (L.near && !L.gl && !L.broken) { create(L); budget(); }
    }).observe(host);
    layers.push(L);
  }
  if (!layers.length) return;

  const t0 = performance.now();
  let last = 0, frames = 0, sum = 0, prev = t0, frozen = !!still;
  const draw = (L, t) => {
    L.gl.uniform1f(L.uT, t); L.gl.drawArrays(L.gl.TRIANGLES, 0, 3);
    if (!L.drawn) { L.drawn = true; L.cv.style.opacity = off ? 0 : 1; }
  };
  const tick = now => {
    requestAnimationFrame(tick);
    const dt = now - prev; prev = now;
    if (document.hidden || off) return;
    const on = layers.filter(L => L.near && L.gl);
    if (!frozen && on.length && frames < 30) { frames++; sum += dt; if (frames === 30 && sum / 30 > 42) frozen = true; }
    if (now - last < FPS_MS) return;
    last = now;
    const t = (now - t0) / 1000;
    for (const L of on) if (!frozen || !L.drawn) draw(L, frozen ? 12 : t);
  };
  requestAnimationFrame(tick);

  // Mock-only A/B toggle — the Shaders button in .tools.
  window.gecShaders = {
    toggle() {
      off = !off;
      for (const L of layers) if (L.cv) L.cv.style.opacity = off ? 0 : 1;
      return !off;
    },
    get frozen() { return frozen; },
  };
})();
