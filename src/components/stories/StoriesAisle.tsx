'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValueEvent, useReducedMotion, type MotionValue } from 'motion/react';
import { DeskFolio } from '@/components/deskfolio/DeskFolio';
import { BOOK_SPECS, EditorialPage, GecMark, type PageData, type Tone } from '@/components/deskfolio/gecBooksData';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import { EXPAND_END } from '@/lib/act';
import type { Story } from '@/lib/types';
import { planAisle, yearOf, type Book } from './aislePlan';
import { SHELF, TEXTURES } from './aisleTextures';
import '@/components/deskfolio/gec-editorial.css';
import './stories-aisle.css';

/* World units. The stage is authored at 810px tall and scaled to the viewport. */
const SEG = 900; // aisle length per bay
const Z0 = 700; // near edge of the first bay (in front of the screen plane)
const HALF = 420; // aisle half-width
const PAGE_W = 350;
const PAGE_H = 483;
const TONES: Tone[] = ['incubation', 'summit', 'handbook', 'founders'];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function coverVars(tone: Tone): CSSProperties {
  const { base, ink } = BOOK_SPECS[tone].coverTheme;
  return {
    '--df-cover-1': `color-mix(in srgb, ${base}, white 14%)`,
    '--df-cover-2': base,
    '--df-cover-3': `color-mix(in srgb, ${base}, black 16%)`,
    '--df-cover-ink': ink === 'light' ? '#eef3f1' : '#5b4a52',
  } as CSSProperties;
}

function coverStyle(tone: Tone): CSSProperties {
  const { base, ink, foil } = BOOK_SPECS[tone].coverTheme;
  return { backgroundColor: base, color: ink === 'light' ? '#FCF8ED' : '#222222', '--cover-foil': foil } as CSSProperties;
}

const published = (s: Story) =>
  new Date(s.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function storyBook(story: Story, index: number) {
  const tone = TONES[index % TONES.length];
  const byline = [story.authorOrFounder, story.startupName].filter(Boolean).join(' · ');
  const pages: PageData[] = [
    {
      running: story.category,
      kicker: `GEC STORIES // ${yearOf(story)}`,
      category: story.startupName?.toUpperCase(),
      title: story.title,
      deck: story.excerpt,
      note: [story.readTime, published(story)].filter(Boolean).join(' · '),
    },
    {
      running: 'Filed Under',
      kicker: byline.toUpperCase() || undefined,
      category: 'CATALOGUE ENTRY',
      title: 'Where this story sits on the shelf',
      stepper: story.tags?.length ? story.tags : [story.category],
      note: `Shelved ${published(story)}`,
    },
    {
      running: 'Keep Reading',
      kicker: 'THE FULL STORY',
      category: 'GEC STORIES ARCHIVE',
      title: 'The rest of this story lives in the archive.',
      deck: 'Continue on the Stories page. And when you are ready, the empty shelf at the end of this aisle is yours.',
      action: { tag: 'ARCHIVE', label: 'Read the full story', value: '/stories →' },
      note: 'Galgotias Entrepreneurship Cell',
    },
  ];
  return {
    tone,
    cover: (
      <article className={`gec-book-cover gec-book-cover--full gec-book-cover--${tone}`} style={coverStyle(tone)}>
        <div className="df-cover-foil-border" aria-hidden="true" />
        <header className="gec-book-cover__running">
          <span>GEC STORIES // {story.category.toUpperCase()}</span>
          <span>NO. {String(index + 1).padStart(3, '0')}</span>
        </header>
        <div className="gec-book-cover__title-block">
          <GecMark size={54} />
          <span className="gec-book-cover__mark-label">{byline || 'GEC STORIES'}</span>
          <h2>{story.title}</h2>
          <p>{story.startupName ?? story.category}</p>
        </div>
        <footer className="gec-book-cover__footer">
          <span>Galgotias Entrepreneurship Cell</span>
          <span>Open Volume →</span>
        </footer>
      </article>
    ),
    pages: pages.map((page, i) => <EditorialPage key={i} tone={tone} folio={i + 1} page={page} />),
    backCover: (
      <article className={`gec-book-cover gec-book-cover--full gec-book-cover--${tone} gec-book-cover--back`} style={coverStyle(tone)}>
        <div className="df-cover-foil-border" aria-hidden="true" />
        <header className="gec-book-cover__running">
          <span>GEC STORIES</span>
          <span>{yearOf(story)}</span>
        </header>
        <div className="gec-book-cover__title-block">
          <GecMark size={54} />
          <h2>Every venture starts with a story.</h2>
          <p>{byline || story.category}</p>
        </div>
        <footer className="gec-book-cover__footer">
          <span>Galgotias University // Greater Noida</span>
          <span>GEC / {String(yearOf(story)).slice(2)}</span>
        </footer>
      </article>
    ),
  };
}

/* -------------------------------------------------------------------------- */
/* Reader: the spine flies out of the wall and opens as a DeskFolio flip-book */
/* -------------------------------------------------------------------------- */

function StoryReader({ book, from, onDone }: { book: Book; from: DOMRect; onDone: () => void }) {
  const reduce = useReducedMotion();
  const [closing, setClosing] = useState(false);
  const [fit, setFit] = useState(1);
  const data = useMemo(() => storyBook(book.story, book.index), [book]);
  const close = useCallback(() => setClosing(true), []);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => setFit(Math.min(1, (innerWidth - 24) / (PAGE_W * 2 + 24), (innerHeight - 150) / PAGE_H));
    measure();
    addEventListener('resize', measure);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    addEventListener('keydown', onKey);
    // ponytail: block scroll on the overlay instead of overflow:hidden on <html>, which breaks the sticky act behind it
    const el = overlayRef.current;
    const stop = (e: Event) => e.preventDefault();
    el?.addEventListener('wheel', stop, { passive: false });
    el?.addEventListener('touchmove', stop, { passive: false });
    return () => {
      removeEventListener('resize', measure);
      removeEventListener('keydown', onKey);
      el?.removeEventListener('wheel', stop);
      el?.removeEventListener('touchmove', stop);
    };
  }, [close]);

  // Launch from the spine's on-screen box: closed cover sits centred, so offset from the viewport centre.
  const dx = from.left + from.width / 2 - innerWidth / 2;
  const dy = from.top + from.height / 2 - (innerHeight / 2 - 30);

  return createPortal(
    <div ref={overlayRef} className="sa-reader" role="dialog" aria-modal="true" aria-label={book.story.title} data-closing={closing || undefined}>
      <div className="sa-reader__backdrop" onClick={close} aria-hidden="true" />
      <motion.div
        className="sa-reader__book"
        initial={reduce ? false : { x: dx, y: dy, scale: from.height / PAGE_H, rotateY: 70, opacity: 0.4 }}
        animate={{ x: 0, y: 0, scale: fit, rotateY: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 170, damping: 24, mass: 0.9 }}
      >
        <DeskFolio
          cover={data.cover}
          pages={data.pages}
          backCover={data.backCover}
          closeOnEnd
          autoOpen
          autoOpenDelay={reduce ? 0 : 650}
          closeRequested={closing}
          onClose={onDone}
          pageWidth={PAGE_W}
          pageHeight={PAGE_H}
          style={coverVars(data.tone)}
          label={book.story.title}
          virtualizePages
        />
      </motion.div>
      <div className="sa-reader__bar">
        <button type="button" onClick={close} autoFocus>
          ✕ Close <kbd>Esc</kbd>
        </button>
        <ViewTransitionLink href={`/stories/${book.story.slug}`} className="sa-reader__cta">
          Read the full story →
        </ViewTransitionLink>
      </div>
    </div>,
    document.body
  );
}

/* -------------------------------------------------------------------------- */
/* The aisle                                                                  */
/* -------------------------------------------------------------------------- */

function Spine({ book, side, slot, onOpen }: { book: Book; side: 'L' | 'R'; slot: number; onOpen: (b: Book, el: HTMLElement) => void }) {
  const { story, index } = book;
  const { base, ink } = BOOK_SPECS[TONES[index % TONES.length]].coverTheme;
  const row = 1 + (index % 2); // eye-level shelves only
  const d = 170 + Math.floor(slot / 2) * 330;
  const h = 136;
  return (
    <button
      type="button"
      className="sa-spine"
      aria-label={`Read “${story.title}”${story.authorOrFounder ? ` by ${story.authorOrFounder}` : ''}`}
      onClick={(e) => onOpen(book, e.currentTarget)}
      style={
        {
          left: side === 'L' ? d : SEG - d - 44,
          top: SHELF.top + row * SHELF.pitch + SHELF.cavity - h,
          height: h,
          '--c': base,
          '--x': ink === 'light' ? '#FCF8ED' : '#222222',
        } as CSSProperties
      }
    >
      <span>{story.title}</span>
    </button>
  );
}

export function StoriesAisle({ progress, stories }: { progress: MotionValue<number>; stories: Story[] }) {
  const reduce = useReducedMotion();
  const bays = useMemo(() => planAisle(stories), [stories]);
  const rootRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const look = useRef({ x: 0, y: 0, s: 1 });
  const [manual, setManual] = useState(false); // phones + reduced motion walk with buttons, not scroll
  const [stepAt, setStepAt] = useState(0);
  const [reading, setReading] = useState<{ book: Book; from: DOMRect } | null>(null);

  const last = bays.length - 1;
  const yearCount = (y?: number) => {
    const n = stories.filter((s) => yearOf(s) === y).length;
    return `${n} ${n === 1 ? 'STORY' : 'STORIES'}`;
  };
  const camMax = last * SEG - 200;
  const nextYear = Math.max(new Date().getFullYear(), ...stories.map(yearOf)) + 1;

  const render = useCallback(() => {
    const world = worldRef.current;
    if (!world) return;
    const t = manual ? stepAt / last : clamp01((progress.get() - EXPAND_END) / (0.97 - EXPAND_END));
    const cam = t * camMax;
    const { x, y, s } = look.current;
    world.style.transform = `scale(${s}) rotateY(${x * 6}deg) rotateX(${-y * 3}deg) translateZ(${cam}px)`;
    world.querySelectorAll<HTMLElement>('[data-bay]').forEach((el) => {
      const near = Z0 - Number(el.dataset.bay) * SEG + cam;
      el.style.visibility = near - SEG > 700 ? 'hidden' : 'visible';
      el.style.setProperty('--fog', String(clamp01((-(near - SEG / 2) - 900) / 3200) * 0.9));
    });
    const k = Math.min(last, Math.floor((cam + 800) / SEG));
    if (hudRef.current) hudRef.current.textContent = k === 0 ? 'The entrance' : k === last ? 'Your shelf' : `Cohort ${bays[k].year}`;
    if (barRef.current) barRef.current.style.width = `${t * 100}%`;
  }, [bays, camMax, last, manual, progress, stepAt]);

  useMotionValueEvent(progress, 'change', () => !manual && render());
  useEffect(render, [render]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mq = matchMedia('(max-width: 768px)');
    const sync = () => {
      setManual(mq.matches || !!reduce);
      look.current.s = root.clientHeight / 810;
      render();
    };
    sync();
    mq.addEventListener('change', sync);
    const ro = new ResizeObserver(sync);
    ro.observe(root);
    return () => {
      mq.removeEventListener('change', sync);
      ro.disconnect();
    };
  }, [reduce, render]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || reduce) return;
    const b = e.currentTarget.getBoundingClientRect();
    look.current.x = (e.clientX - b.left) / b.width - 0.5;
    look.current.y = (e.clientY - b.top) / b.height - 0.5;
    requestAnimationFrame(render);
  };

  const open = useCallback((book: Book, el: HTMLElement) => setReading({ book, from: el.getBoundingClientRect() }), []);

  // ponytail: fixed decorative motes, no per-frame JS
  const motes = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 90}%`, delay: `${-(i * 1.7)}s` })), []);

  return (
    <div
      ref={rootRef}
      className="sa"
      data-reading={reading ? '' : undefined}
      onPointerMove={onPointerMove}
      style={
        {
          '--sa-shelf': TEXTURES.shelf,
          '--sa-floor': TEXTURES.floor,
          '--sa-ceiling': TEXTURES.ceiling,
          '--sa-damask': TEXTURES.damask,
          '--sa-noise': TEXTURES.noise,
        } as CSSProperties
      }
    >
      <div ref={worldRef} className="sa-world">
        {bays.map((bay, k) => {
          const near = Z0 - k * SEG;
          const zc = near - SEG / 2;
          const shelfX = `${-k * SEG}px 0`;
          const left = bay.books.filter((_, j) => j % 2 === 0);
          const right = bay.books.filter((_, j) => j % 2 === 1);
          return (
            <div key={k} className="sa-bay">
              <div data-bay={k} className="sa-3d sa-wall" style={{ transform: `translate3d(${-HALF}px,0,${zc}px) rotateY(90deg)`, backgroundPosition: `0 0, 0 0, ${shelfX}` }}>
                {left.map((b, j) => <Spine key={b.story.id} book={b} side="L" slot={j * 2} onOpen={open} />)}
              </div>
              <div data-bay={k} className="sa-3d sa-wall" style={{ transform: `translate3d(${HALF}px,0,${zc}px) rotateY(-90deg)`, backgroundPosition: `100% 0, 0 0, ${-k * SEG - 450}px 0` }}>
                {right.map((b, j) => <Spine key={b.story.id} book={b} side="R" slot={j * 2 + 1} onOpen={open} />)}
              </div>
              <div data-bay={k} className="sa-3d sa-floor" style={{ transform: `translate3d(0,380px,${zc}px) rotateX(90deg)` }} />
              <div data-bay={k} className="sa-3d sa-ceiling" style={{ transform: `translate3d(0,-380px,${zc}px) rotateX(-90deg)` }} />
              <div data-bay={k} className="sa-3d sa-pendant" style={{ transform: `translate3d(0,-300px,${zc}px)` }} aria-hidden="true" />
              {bay.sign && (
                <div data-bay={k} className="sa-3d sa-sign" style={{ transform: `translate3d(0,-240px,${near - 60}px)` }}>
                  <b>{bay.year}</b>
                  <small>COHORT · {yearCount(bay.year)}</small>
                </div>
              )}
            </div>
          );
        })}

        {/* End wall with the framed invitation */}
        <div data-bay={last} className="sa-3d sa-endwall" style={{ transform: `translate3d(0,0,${Z0 - bays.length * SEG + 2}px)` }}>
          <div className="sa-frame">
            <span className="sa-frame__wire" aria-hidden="true" />
            <span className="sa-frame__lamp" aria-hidden="true" />
            <div className="sa-frame__moulding">
              <div className="sa-frame__mat">
                <div className="sa-frame__art">
                  <span className="sa-frame__kicker">Shelf {nextYear} · reserved</span>
                  <h3>Your story belongs on this shelf.</h3>
                  <ViewTransitionLink href="/initiatives" className="sa-frame__cta">
                    Start yours at GEC →
                  </ViewTransitionLink>
                </div>
              </div>
            </div>
            <span className="sa-frame__plate">GEC Library · Accession {nextYear}-001</span>
          </div>
        </div>
      </div>

      <div className="sa-motes" aria-hidden="true">
        {motes.map((m, i) => <i key={i} style={{ left: m.left, top: m.top, animationDelay: m.delay }} />)}
      </div>
      <div className="sa-vignette" aria-hidden="true" />

      <div className="sa-hud sa-hud--bl">
        <span>Now walking</span>
        <b ref={hudRef}>The entrance</b>
      </div>
      <div className="sa-hud sa-hud--br">
        {manual ? (
          <div className="sa-steps">
            <button type="button" onClick={() => setStepAt((v) => Math.max(0, v - 1))} disabled={stepAt === 0} aria-label="Walk back">←</button>
            <button type="button" onClick={() => setStepAt((v) => Math.min(last, v + 1))} disabled={stepAt === last} aria-label="Walk forward">→</button>
          </div>
        ) : (
          <span>Scroll to walk · move to look · click a glowing spine</span>
        )}
        <div className="sa-bar"><i ref={barRef} /></div>
      </div>

      {reading && <StoryReader book={reading.book} from={reading.from} onDone={() => setReading(null)} />}
    </div>
  );
}
