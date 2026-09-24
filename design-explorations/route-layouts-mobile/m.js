// GEC mobile route layouts — shared shell + interactions. Pages declare <body data-page="…" data-pill="dispatch|apply">.
// ponytail: chrome injected from one place so six mock pages stay in sync; the real app gets this from layout.tsx.
(() => {
  const page = document.body.dataset.page;
  const ROUTES = [['home', 'Home'], ['about', 'About'], ['teams', 'Teams'], ['initiatives', 'Initiatives'], ['stories', 'Stories']];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- top bar + menu sheet ----------
  document.body.insertAdjacentHTML('afterbegin', `
    <header class="bar">
      <a class="bar-logo" href="home.html" aria-label="GEC home"><img src="assets/gec-full-logo.svg" alt="Galgotias Entrepreneurship Cell" width="75" height="34"></a>
      <button class="menu-btn" aria-label="Open menu" aria-haspopup="dialog"></button>
    </header>
    <dialog class="sheet" id="menu" aria-label="Site menu">
      <div class="grab"></div>
      <button class="sheet-close" aria-label="Close menu">×</button>
      <nav class="nav-list">${ROUTES.map(([id, label], i) =>
        `<a href="${id}.html"${id === page ? ' aria-current="page"' : ''}>${label}<small>0${i + 1}</small></a>`).join('')}</nav>
      <a class="btn" href="initiatives.html#apply" style="margin-top:20px">Join GEC</a>
    </dialog>`);

  // ---------- footer ----------
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="footer">
      <img src="assets/gec-full-logo.svg" alt="GEC" width="88" height="40">
      <p style="margin:14px 0 18px;color:rgba(255,253,248,.7);font-size:14px">A student-driven entrepreneurial community at Galgotias University.</p>
      <details><summary>Explore</summary>${ROUTES.map(([id, l]) => `<a href="${id}.html">${l}</a>`).join('')}</details>
      <details><summary>Programmes</summary><a href="initiatives.html#sdp">Startup Development Program</a><a href="initiatives.html#programmes">Shark Arena</a><a href="initiatives.html#programmes">Founder Workshops</a></details>
      <details><summary>Connect</summary><a href="#">Instagram</a><a href="#">LinkedIn</a><a href="mailto:gec@galgotiasuniversity.edu.in">Email the cell</a></details>
      <button class="btn gold" data-open-dispatch style="margin-top:22px">Subscribe to the Dispatch</button>
      <p class="fine">Galgotias Entrepreneurship Cell © 2026<br>Powered by students. Built for builders.</p>
      <p class="fine"><a href="index.html" style="text-decoration:underline">All mobile layouts</a> · <a href="404.html" style="text-decoration:underline">404</a>${page === 'home' ? ' · <button data-replay style="text-decoration:underline;font:inherit">Replay intro</button>' : ''}</p>
    </footer>
    ${document.body.dataset.pill === 'apply'
      ? '<a class="pill apply" href="#apply">Apply · Cohort 04</a>'
      : '<button class="pill" data-open-dispatch aria-haspopup="dialog">✉ Dispatch <span class="count">12</span></button>'}
    <div class="tools"><button data-tool="shaders">Shaders: on</button><button data-tool="notes">Notes: on</button></div>
    <dialog class="sheet" id="dispatch" aria-label="The GEC Dispatch">
      <div class="grab"></div>
      <button class="sheet-close" aria-label="Close">×</button>
      <div class="broadsheet">
        <h3>The GEC Dispatch</h3>
        <div class="dateline"><span>Issue 12</span><span>Sept 2026</span><span>Greater Noida</span></div>
        <h4>Cohort 04 opens with a record 140 applications</h4>
        <p>The Startup Development Program's fourth cohort drew teams from every school on campus. Shortlists go out on 2 October; the 12-week sprint starts the week after.</p>
        <p style="margin-top:10px"><b>Also inside:</b> E-Summit '26 speaker line-up · Shark Arena recap · the Handbook's new chapter on pricing.</p>
      </div>
      <label class="field"><span>Get the next issue</span><input type="email" inputmode="email" autocomplete="email" placeholder="you@galgotias.edu"></label>
      <button class="btn" style="margin-top:12px">Subscribe</button>
    </dialog>`);

  // sheets: native <dialog>; tap backdrop or swipe down on the grab bar to close
  const openSheet = d => { d.showModal(); d.scrollTop = 0; };
  $('.menu-btn').onclick = () => openSheet($('#menu'));
  $$('[data-open-dispatch]').forEach(b => (b.onclick = () => openSheet($('#dispatch'))));
  $$('dialog.sheet').forEach(d => {
    $('.sheet-close', d).onclick = () => d.close();
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
    let y0 = null;
    d.addEventListener('touchstart', e => { y0 = d.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
    d.addEventListener('touchend', e => { if (y0 !== null && e.changedTouches[0].clientY - y0 > 80) d.close(); y0 = null; });
  });

  // ---------- bar hides on scroll-down, returns on scroll-up; pill hides near footer ----------
  const bar = $('.bar'), pill = $('.pill'), footer = $('.footer');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY, down = y > lastY && y > 120;
    if (Math.abs(y - lastY) > 6) { bar.classList.toggle('hide', down); document.body.classList.toggle('bar-hidden', down); lastY = y; }
  }, { passive: true });
  // pill steps aside for the footer and for any [data-no-pill] section (e.g. the stories aisle, where it covers the → arrow)
  const blockers = new Set();
  const io = new IntersectionObserver(es => {
    es.forEach(e => (e.isIntersecting ? blockers.add(e.target) : blockers.delete(e.target)));
    pill.classList.toggle('away', blockers.size > 0);
  }, { threshold: .15 });
  [footer, ...$$('[data-no-pill]')].forEach(el => io.observe(el));

  // ---------- review tools ----------
  $('[data-tool="notes"]').onclick = e => { const off = document.body.classList.toggle('notes-off'); e.target.textContent = `Notes: ${off ? 'off' : 'on'}`; };
  $('[data-tool="shaders"]').onclick = e => { if (window.gecShaders) e.target.textContent = `Shaders: ${gecShaders.toggle() ? 'on' : 'off'}`; };

  // ---------- rails: dot indicator follows the snapped card ----------
  $$('[data-rail]').forEach(rail => {
    const dots = rail.nextElementSibling?.matches('.dots') ? rail.nextElementSibling : null;
    if (!dots) return;
    dots.innerHTML = [...rail.children].map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('');
    rail.addEventListener('scroll', () => {
      const w = rail.children[0].offsetWidth + 12;
      const i = Math.min(rail.children.length - 1, Math.round(rail.scrollLeft / w));
      [...dots.children].forEach((d, j) => d.classList.toggle('on', i === j));
    }, { passive: true });
  });

  // ---------- chip filters: [data-filter] group toggles [data-cat] items ----------
  $$('[data-filter]').forEach(group => {
    const items = $$(`[data-cat]`, $(group.dataset.filter));
    group.addEventListener('click', e => {
      const chip = e.target.closest('.chip'); if (!chip) return;
      $$('.chip', group).forEach(c => c.setAttribute('aria-pressed', c === chip));
      const f = chip.dataset.f;
      items.forEach(it => (it.hidden = f !== 'all' && !it.dataset.cat.split(' ').includes(f)));
    });
  });

  // ---------- initiatives bookshelf ----------
  $$('[data-shelf]').forEach(shelf => {
    const cap = shelf.parentElement.querySelector('.shelf-cap');
    const pick = book => {
      $$('.book', shelf).forEach(b => b.setAttribute('aria-pressed', b === book));
      const d = book.dataset;
      cap.innerHTML = `<div class="mono muted">Volume ${d.vol} · ${d.kick}</div>
        <h3 class="h3" style="margin:6px 0 4px">${d.title}</h3><p class="p">${d.sub}</p>
        <a class="btn" href="${d.href}" style="margin-top:16px;background:${d.btn}">Open volume →</a>`;
    };
    shelf.addEventListener('click', e => { const b = e.target.closest('.book'); if (b) pick(b); });
    pick($('.book[aria-pressed="true"]', shelf) || $('.book', shelf));
  });

  // ---------- teams: chips ↔ swipe track stay in sync ----------
  $$('[data-teams]').forEach(root => {
    const track = $('.team-track', root), chips = $$('.chip', root);
    const row = chips[0].parentElement;
    // horizontal only — scrollIntoView would also drag the page to the chips
    const set = i => chips.forEach((c, j) => { c.setAttribute('aria-selected', i === j); if (i === j) row.scrollTo({ left: c.offsetLeft - row.offsetLeft - (row.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' }); });
    chips.forEach((c, i) => (c.onclick = () => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' })));
    let cur = -1;
    track.addEventListener('scroll', () => { const i = Math.round(track.scrollLeft / track.clientWidth); if (i !== cur) set(cur = i); }, { passive: true });
    const start = Math.min(chips.length - 1, +(new URLSearchParams(location.search).get('team') || 0));
    track.scrollLeft = start * track.clientWidth;
    set(cur = start);
  });

  // ---------- home entrance: once per session, skippable, lands on the bar logo ----------
  const intro = $('.intro');
  if (intro) {
    let seen = false;
    try { seen = sessionStorage.getItem('gec_m_intro') === '1'; } catch {}
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const logo = $('.bar-logo img'), lock = $('.lockup', intro);
    let timers = [];
    const finish = () => { intro.remove(); logo.style.opacity = ''; try { sessionStorage.setItem('gec_m_intro', '1'); } catch {} };
    const dock = () => {
      // FLIP: fly the lockup onto the bar logo, then split the curtain
      const a = lock.getBoundingClientRect(), b = logo.getBoundingClientRect();
      lock.style.transform = 'translate(-50%,-50%) translate(0px,0px) scale(1)';
      lock.getBoundingClientRect(); // commit the start state so the lists interpolate
      lock.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1)';
      lock.style.transform = `translate(-50%,-50%) translate(${b.left - a.left}px,${b.top - a.top}px) scale(${b.width / a.width})`;
      timers.push(setTimeout(() => { logo.style.opacity = ''; lock.style.opacity = '0'; intro.classList.add('split'); }, 800));
      timers.push(setTimeout(finish, 1600));
    };
    const play = () => {
      if (reduce) return finish();
      logo.style.opacity = '0';
      timers.push(setTimeout(dock, 4000)); // ponytail: 4s hold on mobile (desktop 5.6s) — the open question in the restructure doc
    };
    $('.skip', intro).onclick = () => { timers.forEach(clearTimeout); finish(); };
    seen ? intro.remove() : play();
    const replay = $('[data-replay]');
    if (replay) replay.onclick = () => { try { sessionStorage.removeItem('gec_m_intro'); } catch {} location.reload(); };
  }
})();
