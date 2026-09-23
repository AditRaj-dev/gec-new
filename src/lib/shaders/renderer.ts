import { PROGRAMS, VERTEX } from './programs';
import { FPS_CAP, frameGuard, hexToRgb, renderScale } from './policy';

export type ShaderFamily = 'watercolor' | 'liquid' | 'specular';

export interface ShaderRenderer {
  /** Run the loop (no-op once frozen). */
  play(): void;
  /** Stop the loop, keep the last frame. */
  pause(): void;
  /** Draw a single frame and stop for good. */
  freeze(): void;
  destroy(): void;
}

/** Returns null when WebGL is unavailable or the program fails; the caller removes the canvas. */
export function createRenderer(canvas: HTMLCanvasElement, family: ShaderFamily): ShaderRenderer | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const { frag, palette } = PROGRAMS[family];
  const vs = compile(gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  // one oversized triangle covers the viewport
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  (['uC0', 'uC1', 'uC2', 'uC3'] as const).forEach((n, i) => gl.uniform3fv(gl.getUniformLocation(prog, n), hexToRgb(palette[i])));

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const s = renderScale(w, dpr);
    canvas.width = Math.max(1, Math.round(w * s));
    canvas.height = Math.max(1, Math.round(h * s));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const t0 = performance.now();
  const draw = (now: number) => {
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  let raf = 0, last = 0, frozen = false, prevDraw = 0, destroyed = false;
  const samples: number[] = [];
  const minGap = 1000 / FPS_CAP;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (now - last < minGap) return;
    last = now;
    const start = performance.now();
    draw(now);
    // frame time = draw cost plus how late this frame arrived
    if (prevDraw) samples.push(Math.max(performance.now() - start, now - prevDraw - minGap));
    prevDraw = now;
    const verdict = frameGuard(samples);
    if (verdict === 'freeze') api.freeze();
  };

  const api: ShaderRenderer = {
    play() { if (!destroyed && !frozen && !raf) { prevDraw = 0; raf = requestAnimationFrame(loop); } },
    pause() { cancelAnimationFrame(raf); raf = 0; },
    freeze() { api.pause(); frozen = true; draw(performance.now()); },
    destroy() { destroyed = true; api.pause(); ro.disconnect(); gl.getExtension('WEBGL_lose_context')?.loseContext(); },
  };
  draw(t0);
  return api;
}
