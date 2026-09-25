// Behaviour port of design-explorations/newsletter-dispatch.html (commit 4f70a96): draggable
// floating bin, windowed/full-screen broadsheet dialog, page turns, read state. Logic is the
// reference's; the only changes are scoping to the given elements, real data, the subscribe
// hook, docked bins, and teardown (every listener/timer is released by the returned destroy()).
import { binSVG, rollIcon, sceneFor, scopeIds } from './assets';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const BANDS = ['var(--crimson)', 'var(--gold)', 'var(--blue)'];
const READ_KEY = 'gec-nl-read';

/** One live controller at a time (the bin mounts once in the root layout). */
let current = null;
const pendingDocks = new Set();

/** Docked bins (e.g. /stories #dispatch) register here; returns an unregister fn. */
export function registerDock(el) {
  pendingDocks.add(el);
  const off = current?.addDock(el);
  return () => { pendingDocks.delete(el); off?.(); };
}

/**
 * @param {{ bin: HTMLButtonElement, dlg: HTMLDialogElement, issues: any[],
 *   onSubscribe: (email: string) => Promise<{ success: boolean, message: string }> }} opts
 */
export function mountDispatchBin({ bin, dlg, issues: ISSUES, onSubscribe }) {
  const $ = (s, r = document) => r.querySelector(s);
  const ac = new AbortController();
  const on = (el, type, fn, opts) => el.addEventListener(type, fn, { ...opts, signal: ac.signal });
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => (RM ? 0 : ms);
  const docks = new Set();
  const dockOffs = new Map();

  let read = new Set();
  try { read = new Set(JSON.parse(localStorage.getItem(READ_KEY) || '[]')); } catch {}
  const saveRead = () => { try { localStorage.setItem(READ_KEY, JSON.stringify([...read])); } catch {} };
  const unread = () => ISSUES.filter((x) => !read.has(x.key)).length;

  function syncCounts() {
    const n = unread();
    for (const b of [bin, ...docks]) {
      $('.badge', b).hidden = !n;
      $('.badge', b).textContent = n;
      $('.peek', b).textContent = n ? `${n} fresh issue${n > 1 ? 's' : ''}` : 'All caught up';
      b.setAttribute('aria-label', `Open The GEC Dispatch, ${n} unread`);
    }
    $('[data-count]', dlg).textContent = n ? `${n} unread` : 'all read';
  }

  // draggable, snaps to the nearest side; only a drag can change sides
  function floaty(el, onOpen) {
    const pos = { x: 0, y: 1e6 };
    let sx, sy, ox, oy, moved = false, left = false;
    const place = () => (el.style.transform = `translate(${pos.x}px,${pos.y}px)`);
    const snap = (dragged) => {
      const w = el.offsetWidth, h = el.offsetHeight;
      if (!innerHeight || !w) return; // not laid out yet; the load/resize snap will place it
      if (dragged === true) left = pos.x + w / 2 < innerWidth / 2;
      pos.x = left ? 20 : innerWidth - w - 24;
      pos.y = Math.min(Math.max(pos.y, 20), innerHeight - h - 24);
      el.classList.toggle('on-left', left);
      el.classList.add('is-snap'); place();
      el.style.visibility = 'visible'; // hidden until the first real snap: no flash at 0,0
      later(() => el.classList.remove('is-snap'), 560);
    };
    on(el, 'pointerdown', (e) => { el.setPointerCapture(e.pointerId); sx = e.clientX; sy = e.clientY; ox = pos.x; oy = pos.y; moved = false; });
    on(el, 'pointermove', (e) => {
      if (!el.hasPointerCapture(e.pointerId)) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) > 6) { moved = true; el.classList.add('is-drag'); }
      if (moved) { pos.x = ox + dx; pos.y = oy + dy; place(); }
    });
    on(el, 'pointerup', () => { if (moved) { el.classList.remove('is-drag'); snap(true); } });
    on(el, 'click', () => { if (moved) { moved = false; return; } onOpen(); });
    on(window, 'resize', () => snap());
    on(window, 'load', () => snap());
    snap();
    requestAnimationFrame(() => snap());
  }

  const body = $('.body', dlg);
  // gec-web: on phones the issue list lives in a drawer that slides in from the left over the reader.
  const drawer = $('.nl-drawer', dlg);
  const PHONE = matchMedia('(max-width: 768px)');
  function setDrawer(open) {
    dlg.classList.toggle('is-drawer', open);
    $('[data-act="issues"]', dlg).setAttribute('aria-expanded', String(open));
    if (open) $('.roll-item.is-on', drawer)?.focus({ preventScroll: true });
  }
  let cur = 0;
  function setFull(on) {
    dlg.classList.toggle('is-full', on);
    $('[data-act="full"]', dlg).textContent = on ? '⤡ Windowed' : '⤢ Full screen';
  }
  function openDlg(from) {
    const r = from.getBoundingClientRect();
    dlg.style.setProperty('--dx', `${r.left + r.width / 2 - innerWidth / 2}px`);
    dlg.style.setProperty('--dy', `${r.top + r.height / 2 - innerHeight / 2}px`);
    setFull(false); // always opens windowed
    setDrawer(false);
    render();
    dlg.showModal();
  }
  function closeDlg() {
    if (RM) return dlg.close();
    dlg.classList.add('is-closing');
    on(dlg, 'animationend', () => { dlg.classList.remove('is-closing'); dlg.close(); }, { once: true });
  }
  on(dlg, 'click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'close' || e.target === dlg) closeDlg();
    if (act === 'full') setFull(!dlg.classList.contains('is-full'));
    if (act === 'issues') setDrawer(!dlg.classList.contains('is-drawer'));
    if (act === 'issues-close') setDrawer(false);
  });
  // Esc closes the drawer first, the reader second. The keydown catch covers browsers that only honour a
  // cancelled `cancel` event after a fresh user gesture; `cancel` covers the Android back gesture.
  const drawerOpen = () => dlg.classList.contains('is-drawer');
  on(dlg, 'keydown', (e) => { if (e.key === 'Escape' && drawerOpen()) { e.preventDefault(); e.stopPropagation(); setDrawer(false); } }, { capture: true });
  on(dlg, 'cancel', (e) => { if (drawerOpen()) { e.preventDefault(); setDrawer(false); } });
  on(PHONE, 'change', () => { setDrawer(false); if (dlg.open) render(); });

  function render(dir) {
    const it = ISSUES[cur];
    read.add(it.key); saveRead(); syncCounts();
    body.innerHTML = `<div class="paper">
    <div class="mast-top"><span>Vol. VII · No. ${esc(it.no)}</span><span>${esc(it.date)}</span><span>Free for founders</span></div>
    <div class="mast">
      <div class="ear"><b>Forecast</b><em>Ideas, 100%</em>Scattered pitches by noon</div>
      <h1 class="mast-title">The GEC Dispatch</h1>
      <div class="ear"><b>Price</b><em>One idea</em>Delivered to the bin</div>
    </div>
    <p class="mast-sub">All the news that fits in a bin</p>
    <div class="mast-rule"></div>
    <div class="nl-grid">
      <article class="lead ${dir ? 'turn-' + dir : ''}">
        <span class="kicker">${esc(it.tag)}</span>
        <h2>${esc(it.title)}</h2>
        <p class="dek">${esc(it.dek)}</p>
        <div class="byline">By ${esc(it.by)} · ${it.mins} min read</div>
        <figure class="plate"><div class="ht"><div class="ht-src">${scopeIds(sceneFor(it.scene))}</div></div>
          <figcaption><b>Plate ${esc(it.no)}</b>${esc(it.cap)}</figcaption></figure>
        <div class="cols">${it.body.map((p) => (p[0] === '>' ? `<blockquote>${esc(p.slice(1))}”</blockquote>` : `<p>${esc(p)}</p>`)).join('')}</div>
        <nav class="turns">
          <button data-go="-1" ${cur === 0 ? 'disabled' : ''}>← Newer issue</button>
          <button data-go="1" ${cur === ISSUES.length - 1 ? 'disabled' : ''}>Older issue →</button>
        </nav>
      </article>
      <aside class="rail">
        <h3>In the bin <span>${ISSUES.length}</span></h3>
        <ol class="rolls">${ISSUES.map((x, j) => `<li><button class="roll-item ${j === cur ? 'is-on' : ''} ${read.has(x.key) ? '' : 'is-new'}" data-i="${j}">
          ${scopeIds(rollIcon(x.band || BANDS[j % 3]))}<span class="roll-no">No. ${esc(x.no)} · ${esc(x.date.slice(0, 6))}</span><span class="roll-t">${esc(x.title)}</span></button></li>`).join('')}</ol>
        <form class="sub">
          <h4>Get it on your doorstep.</h4>
          <p>One issue every other Monday. No spam, only ink.</p>
          <div class="row"><input type="email" required placeholder="you@startup.com" aria-label="Email"><button>Subscribe</button></div>
        </form>
      </aside>
    </div></div>`;
    // phones: the rail becomes the drawer's content; desktop keeps it inline
    drawer.replaceChildren(...(PHONE.matches ? [$('.rail', body)] : []));
  }
  function turnTo(i) {
    if (i < 0 || i >= ISSUES.length || i === cur) return;
    const dir = i > cur ? 'next' : 'prev'; cur = i;
    render(dir); body.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
  }
  on(dlg, 'click', (e) => {
    const roll = e.target.closest('.roll-item'); if (roll) { setDrawer(false); turnTo(+roll.dataset.i); }
    const go = e.target.closest('[data-go]'); if (go) turnTo(cur + +go.dataset.go);
  });
  on(dlg, 'submit', async (e) => {
    e.preventDefault();
    const form = e.target, btn = form.querySelector('button'), email = form.querySelector('input').value;
    btn.disabled = true;
    const res = await onSubscribe(email).catch(() => ({ success: false, message: 'Could not reach the mailing list. Try again shortly.' }));
    if (res.success) form.innerHTML = '<p class="done">You’re on the list ✓</p>';
    else { btn.disabled = false; let p = form.querySelector('.err'); if (!p) { p = document.createElement('p'); p.className = 'err'; form.append(p); } p.textContent = res.message; }
  });
  on(dlg, 'keydown', (e) => {
    if (e.target.matches('input')) return;
    if (e.key === 'ArrowRight') turnTo(cur + 1);
    if (e.key === 'ArrowLeft') turnTo(cur - 1);
  });

  const launch = (el) => {
    el.classList.add('is-launch');
    later(() => { openDlg(el); el.classList.remove('is-launch'); }, wait(460));
  };

  $('.bin-art', bin).innerHTML = scopeIds(binSVG());
  floaty(bin, () => launch(bin));

  // Docked twins: same art, badge and launch; no drag. The floater steps aside while one is on screen.
  const addDock = (el) => {
    el.innerHTML = `<span class="bob"><span class="bin-art">${scopeIds(binSVG())}</span><span class="ground"></span></span><span class="badge"></span><span class="peek"></span>`;
    docks.add(el);
    const onClick = () => launch(el);
    el.addEventListener('click', onClick);
    const io = new IntersectionObserver(([e]) => bin.classList.toggle('is-docked', e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    syncCounts();
    const off = () => { dockOffs.delete(el); docks.delete(el); el.removeEventListener('click', onClick); io.disconnect(); bin.classList.remove('is-docked'); el.innerHTML = ''; };
    dockOffs.set(el, off);
    return off;
  };
  pendingDocks.forEach(addDock);

  syncCounts();
  later(() => { bin.classList.add('show-peek'); later(() => bin.classList.remove('show-peek'), 3200); }, 1400);

  current = { addDock };
  return () => {
    ac.abort();
    timers.forEach(clearTimeout);
    [...dockOffs.values()].forEach((off) => off());
    if (dlg.open) dlg.close();
    current = null;
  };
}
