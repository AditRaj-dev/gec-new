'use client';

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { DeskFolio } from '@/components/deskfolio/DeskFolio';
import { buildDispatchPages } from './newsletter-reader';
import { cn } from '@/lib/utils';
import { haptic } from '@/components/deskfolio/haptics';
import '@/components/deskfolio/deskfolio.css';
import '@/components/deskfolio/gec-editorial.css';

export interface NewsletterBookshelfItem {
  id: string;
  title: string;
  date: string;
  subtitle?: string;
  href?: string;
  color?: string;
  foil?: string;
  category?: string;
  readTime?: string;
  tags?: string[];
  takeaways?: string[];
  editionNumber?: string;
  executiveSummary?: string;
}

export interface NewsletterBookshelfProps {
  items?: NewsletterBookshelfItem[];
  className?: string;
  height?: number | string;
  brand?: string;
  onSelect?: (item: NewsletterBookshelfItem, index: number) => void;
  activeId?: string;
}

export const defaultNewsletterBooks: NewsletterBookshelfItem[] = [
  {
    id: 'dispatch-12',
    editionNumber: '#12',
    title: 'Dorm Room to Term Sheet',
    date: 'MAY 28, 2026',
    category: 'Founders & Cap Tables',
    readTime: '8 min read',
    color: '#A3040F',
    foil: '#FBCA05',
    subtitle: 'How 4 Galgotias undergrads closed a ₹1.2Cr pre-seed round while balancing end-term labs.',
    executiveSummary: 'An unvarnished teardown of the 14-week fundraising journey: outreach conversion metrics across 32 angel syndicates, balancing academic credit caps with term-sheet diligence, and structured cap table hygiene.',
    tags: ['Pre-Seed', 'Fundraising', 'Student Cap Tables'],
    takeaways: [
      'Cold outreach conversion: 4.8% reply rate on generic decks vs 42% when leading with customer pilot retention numbers.',
      'How to structure academic leave and lab access agreements before institutional due diligence begins.',
      'Avoiding dirty liquidation preferences and early advisory equity traps on campus ventures.',
    ],
  },
  {
    id: 'dispatch-11',
    editionNumber: '#11',
    title: 'The ₹5L Prototype Corpus',
    date: 'MAY 14, 2026',
    category: 'Incubation & Grants',
    readTime: '6 min read',
    color: '#222222',
    foil: '#FBCA05',
    subtitle: 'Non-dilutive milestone tranches, vendor invoices, and de-risking Day 0 hardware experiments.',
    executiveSummary: 'A practical deployment guide for the GEC prototype grant: structuring three milestone tranches, clearing vendor audit requirements, and using non-dilutive capital to buy critical proof.',
    tags: ['Grants', 'Non-Dilutive', 'MVP Validation'],
    takeaways: [
      'Milestone structuring: Tranche 1 (Bill of Materials), Tranche 2 (Bench Testing), Tranche 3 (10 Pilot Users).',
      'How non-dilutive capital prevents unnecessary pre-seed dilution of 15-25%.',
      'The single biggest reason grants stall: lack of auditable customer acceptance criteria.',
    ],
  },
  {
    id: 'dispatch-10',
    editionNumber: '#10',
    title: "E-Summit '26 Conclave Blueprint",
    date: 'APR 30, 2026',
    category: 'Conclave & E-Summit',
    readTime: '11 min read',
    color: '#1F7EC0',
    foil: '#FFFDF8',
    subtitle: "Behind the scenes of North India's premier student entrepreneurship conclave uniting 5,000+ delegates.",
    executiveSummary: 'The operational blueprint behind Northern India’s largest campus venture conclave: multi-track curation across AI, climate tech, and student syndicates, plus the real numbers behind the 24-hour BuildSprint.',
    tags: ['E-Summit', 'Conclave', 'Ecosystem'],
    takeaways: [
      'Pitch Arena anatomy: 50 shortlisted startups, 25 institutional operators, and a ₹12L cash grant pool.',
      'BuildSprint track mechanics: moving from problem brief to working hardware prototype in 24 continuous hours.',
      'Converting conclave momentum into sustained monthly cohort office hours.',
    ],
  },
  {
    id: 'dispatch-09',
    editionNumber: '#09',
    title: 'Campus Hardware & Maker Labs',
    date: 'APR 16, 2026',
    category: 'Hardware & DeepTech',
    readTime: '7 min read',
    color: '#7B020B',
    foil: '#FBCA05',
    subtitle: 'Rapid PCB prototyping, IoT telemetry benches, and mechanical CNC fabrication on university grounds.',
    executiveSummary: 'An inventory and operating manual for GEC hardware fellows: reserving high-speed solder stations, accessing component lockers, and safely navigating campus fabrication facilities.',
    tags: ['Hardware', 'Maker Lab', 'IoT Prototyping'],
    takeaways: [
      'Turnaround times: same-day PCB etching vs 4-day external courier cycles.',
      'Component library inventory: 1,200+ pre-stocked microcontrollers, sensors, and power modules for fellows.',
      'Thermal and FCC compliance testing before field pilot deployments.',
    ],
  },
  {
    id: 'dispatch-08',
    editionNumber: '#08',
    title: 'Student Cap Tables & Angel Rounds',
    date: 'APR 02, 2026',
    category: 'Founders & Cap Tables',
    readTime: '9 min read',
    color: '#F4E2CA',
    foil: '#A3040F',
    subtitle: 'Founder vesting schedules, option pools, and avoiding toxic early-stage dilution traps.',
    executiveSummary: 'Why 4-year vesting with a 1-year cliff is non-negotiable for student co-founders, how to model an unallocated ESOP pool, and navigating university faculty co-founder designations.',
    tags: ['Cap Table', 'Legal & Tax', 'Founder Equity'],
    takeaways: [
      'Never allocate static equity on day zero: standard 4-year vesting protects against mid-semester departures.',
      'The 10-15% unallocated option pool: why angels demand it before issuing term sheets.',
      'Handling IP assignment deeds cleanly between student inventors and newly incorporated private limiteds.',
    ],
  },
  {
    id: 'dispatch-07',
    editionNumber: '#07',
    title: 'De-risking Day 0 Hypotheses',
    date: 'MAR 19, 2026',
    category: 'Incubation & Grants',
    readTime: '5 min read',
    color: '#145582',
    foil: '#FBCA05',
    subtitle: 'The sharp difference between polite campus applause and genuine customer economic sacrifice.',
    executiveSummary: 'A tactical framework for testing whether anyone actually wants what you are building: fake doors, pre-order token deposits, and why user interviews fail when you pitch instead of listen.',
    tags: ['Customer Discovery', 'Validation', 'Product-Market Fit'],
    takeaways: [
      'The Mom Test applied to university ventures: asking about past behavior rather than hypothetical future interest.',
      'Fake door experiments: setting up a one-page landing page with a pre-order button before writing backend code.',
      'Ten obsessive users beat a hundred lukewarm signups every single time.',
    ],
  },
  {
    id: 'dispatch-06',
    editionNumber: '#06',
    title: 'DeepTech Patenting & University IP',
    date: 'MAR 05, 2026',
    category: 'Hardware & DeepTech',
    readTime: '10 min read',
    color: '#C89E04',
    foil: '#222222',
    subtitle: 'Navigating university assignment deeds, provisional patent filings, and technology transfer.',
    executiveSummary: 'A complete primer on protecting research intellectual property without surrendering startup agility: university technology transfer offices, patent prior-art searches, and global PCT filing windows.',
    tags: ['Patents', 'University IP', 'DeepTech'],
    takeaways: [
      'Provisional patent filing gives a 12-month priority window to seek venture funding before public disclosure.',
      'Negotiating institutional equity royalty caps (typically 2-4%) in lieu of cash patent licensing fees.',
      'Publishing academic papers after filing patent claims, not before.',
    ],
  },
  {
    id: 'dispatch-05',
    editionNumber: '#05',
    title: 'Micro-SaaS Runway & Cloud Credits',
    date: 'FEB 19, 2026',
    category: 'Incubation & Grants',
    readTime: '6 min read',
    color: '#2D2B29',
    foil: '#FBCA05',
    subtitle: 'Maximizing AWS, GCP, and OpenAI credits to achieve cash-flow breakeven before Series A.',
    executiveSummary: 'How to stack startup credits effectively across cloud, authentication, monitoring, and AI inference providers to extend runway by 18+ months without raising institutional capital.',
    tags: ['Cloud Runway', 'Bootstrapping', 'Unit Economics'],
    takeaways: [
      'Staging cloud programs: claim credits in sequence (AWS Activate Portfolio → GCP Startup → Azure Founders Hub).',
      'Containerizing infrastructure early so migration between credit grants is painless.',
      'Tracking net unit cost per query/transaction from Day 1 to avoid deceptive margin cliffs.',
    ],
  },
  {
    id: 'dispatch-04',
    editionNumber: '#04',
    title: 'The Pre-Seed Syndicate Memo',
    date: 'FEB 05, 2026',
    category: 'Founders & Cap Tables',
    readTime: '8 min read',
    color: '#A3040F',
    foil: '#FFFDF8',
    subtitle: 'What angel syndicates actually look for when evaluating student-led venture dossiers.',
    executiveSummary: 'An inside look at the scoring matrix used by institutional angel networks: founder velocity, distribution asymmetries, technical depth, and signs of unfair campus market advantages.',
    tags: ['Angel Network', 'Syndicates', 'Dealflow'],
    takeaways: [
      'Angel networks value execution velocity over static pedigree: shipping updates every 14 days proves agency.',
      'The unfair campus distribution moat: why student founders have unique zero-CAC advantages.',
      'Red flags: part-time founder commitments, unclear IP splits, and lack of customer access.',
    ],
  },
  {
    id: 'dispatch-03',
    editionNumber: '#03',
    title: 'Customer Discovery in the Wild',
    date: 'JAN 22, 2026',
    category: 'Incubation & Grants',
    readTime: '7 min read',
    color: '#FCF8ED',
    foil: '#A3040F',
    subtitle: 'Conducting 50 industrial interviews across Greater Noida without pitching solutions.',
    executiveSummary: 'Field notes from 3 student teams visiting manufacturing units, logistics hubs, and clinic networks to map unaddressed operational pain points before writing a single line of software.',
    tags: ['Interviews', 'Field Notes', 'Discovery'],
    takeaways: [
      'Never start an interview by pitching your idea; ask them how they solved the problem yesterday.',
      'Look for homegrown Excel sheets and WhatsApp workarounds: that is where real software demand hides.',
      'Securing signed Letters of Intent (LOIs) before product build.',
    ],
  },
  {
    id: 'dispatch-02',
    editionNumber: '#02',
    title: 'Building the First 100 User Test',
    date: 'JAN 08, 2026',
    category: 'Conclave & E-Summit',
    readTime: '6 min read',
    color: '#2A8DD4',
    foil: '#FFFDF8',
    subtitle: 'Campus distribution flywheels, localized ambassador loops, and private beta telemetry.',
    executiveSummary: 'Strategies for leveraging 30,000+ on-campus students as a fertile initial test ground: peer referral incentives, classroom demos, feedback channels, and actionable cohorts.',
    tags: ['Distribution', 'Beta Testing', 'Campus Flywheel'],
    takeaways: [
      'High-touch onboarding: setting up the product in person with the first 50 users.',
      'Creating private feedback loops via closed Telegram/Discord channels.',
      'Distinguishing between campus-specific viral spikes and durable, repeatable retention.',
    ],
  },
  {
    id: 'dispatch-01',
    editionNumber: '#01',
    title: 'Genesis of Galgotias E-Cell',
    date: 'DEC 18, 2025',
    category: 'Conclave & E-Summit',
    readTime: '12 min read',
    color: '#8C0C16',
    foil: '#FBCA05',
    subtitle: 'The founding charter, operational ethos, and vision for North India’s entrepreneurial core.',
    executiveSummary: 'The founding manifesto of GEC: bridging the gap between student ambition and tier-one venture capital, providing non-dilutive capital, and building a culture of relentless maker momentum.',
    tags: ['Charter', 'Manifesto', 'Origins'],
    takeaways: [
      'Our fundamental premise: dorm rooms produce generational companies when backed with conviction.',
      'The three institutional pillars: Incubation Studio, E-Summit, and Venture Capital Network.',
      'The unwritten rule of GEC: builders back builders.',
    ],
  },
];

export type BookshelfStage =
  | 'shelf'          // resting on shelf, all books intact
  | 'flying-out'     // selected book lifts out and animates to center stage
  | 'reading'        // cover is open, user flips pages interactively
  | 'closing'        // folding open pages cleanly back to cover
  | 'returning';     // book closed, physical 3D arc flight & slide into shelf slot

function CompleteVolumeAction({ onComplete }: { onComplete: () => void }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onComplete();
      }}
      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#FBCA05] px-4 py-2 font-mono text-xs font-bold text-[#222222] shadow-md transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-95 motion-reduce:transform-none"
    >
      <span>Complete Volume &middot; Put Back on Shelf</span>
      <span aria-hidden="true">&rarr;</span>
    </button>
  );
}

export function NewsletterBookshelf({
  items = defaultNewsletterBooks,
  className,
  onSelect,
}: NewsletterBookshelfProps) {
  const books = useMemo(() => (items.length ? items : defaultNewsletterBooks), [items]);

  const [stage, setStage] = useState<BookshelfStage>('shelf');
  const [activeBook, setActiveBook] = useState<NewsletterBookshelfItem | null>(null);
  const [activeBookIndex, setActiveBookIndex] = useState<number>(-1);
  const [justDockedIndex, setJustDockedIndex] = useState<number | null>(null);
  const [proxyCoords, setProxyCoords] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 48,
    height: 260,
  });
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [autoOpenReady, setAutoOpenReady] = useState(false);
  const [stageWidth, setStageWidth] = useState(800);
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const shelfScrollRef = useRef<HTMLDivElement>(null);
  const bookRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closingFallbackRef = useRef<number | null>(null);

  // Throttled ResizeObserver for responsive page sizing
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let rafId: number | null = null;
    const ro = new ResizeObserver((entries) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        for (const entry of entries) {
          setStageWidth(entry.contentRect.width);
        }
      });
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Compute flippable page sizes
  const pageWidth = Math.min(330, Math.max(160, Math.floor((stageWidth - 64) / 2)));
  const pageHeight = Math.round(pageWidth * 1.38);

  const clearClosingFallback = useCallback(() => {
    if (closingFallbackRef.current !== null) {
      window.clearTimeout(closingFallbackRef.current);
      closingFallbackRef.current = null;
    }
  }, []);

  useEffect(() => clearClosingFallback, [clearClosingFallback]);

  useEffect(() => {
    if (justDockedIndex === null) return;

    const releaseDockedBook = () => setJustDockedIndex(null);
    window.addEventListener('pointermove', releaseDockedBook, { once: true });
    window.addEventListener('keydown', releaseDockedBook, { once: true });

    return () => {
      window.removeEventListener('pointermove', releaseDockedBook);
      window.removeEventListener('keydown', releaseDockedBook);
    };
  }, [justDockedIndex]);

  // Measure against the animation stage itself. The proxy is positioned inside this
  // element, so using the outer container would leave the returned book offset by
  // the top rail's height.
  const updateProxyCoords = useCallback(() => {
    if (activeBookIndex === -1) return;
    const animationStage = stageRef.current;
    const bookEl = bookRefs.current[activeBookIndex];
    if (animationStage && bookEl) {
      const stageRect = animationStage.getBoundingClientRect();
      const bRect = bookEl.getBoundingClientRect();
      setProxyCoords({
        x: bRect.left + bRect.width / 2 - (stageRect.left + stageRect.width / 2),
        y: bRect.top + bRect.height / 2 - (stageRect.top + stageRect.height / 2),
        width: bRect.width,
        height: bRect.height,
      });
    }
  }, [activeBookIndex]);

  const beginReturn = useCallback(() => {
    clearClosingFallback();
    updateProxyCoords();
    setAutoOpenReady(false);
    setIsClosing(false);
    setStage('returning');
  }, [clearClosingFallback, updateProxyCoords]);

  // Close sequence: folds book closed, then triggers physical return flight
  const handleClose = useCallback(() => {
    if (stage === 'shelf' || stage === 'returning') return;
    updateProxyCoords();

    if (stage === 'flying-out') {
      haptic('tap');
      beginReturn();
      return;
    }

    if (stage === 'reading') {
      haptic('tap');
      if (currentSpread === 0) {
        beginReturn();
      } else {
        setStage('closing');
        setIsClosing(true);
        clearClosingFallback();
        // A generous fail-safe prevents a missing rest event from trapping the UI
        // without cutting across the cover's own closing spring.
        closingFallbackRef.current = window.setTimeout(() => {
          updateProxyCoords();
          setAutoOpenReady(false);
          setIsClosing(false);
          setStage((currentStage) => (currentStage === 'closing' ? 'returning' : currentStage));
          closingFallbackRef.current = null;
        }, 1800);
      }
    }
  }, [stage, currentSpread, beginReturn, clearClosingFallback, updateProxyCoords]);

  // When DeskFolio finishes closing sheets
  const handleDeskFolioClosed = useCallback(() => {
    haptic('tap');
    beginReturn();
  }, [beginReturn]);

  // Dispatch pages for active volume
  const activeBookData = useMemo(() => {
    if (!activeBook) return null;
    return buildDispatchPages(activeBook, <CompleteVolumeAction onComplete={handleClose} />);
  }, [activeBook, handleClose]);

  // Handle book click on shelf
  const handleSelectBook = useCallback(
    (book: NewsletterBookshelfItem, index: number) => {
      if (stage !== 'shelf') return;

      haptic('tap');
      clearClosingFallback();
      setJustDockedIndex(null);
      const animationStage = stageRef.current;
      const bookEl = bookRefs.current[index];

      if (!animationStage || !bookEl) {
        setActiveBook(book);
        setActiveBookIndex(index);
        setStage('reading');
        setAutoOpenReady(true);
        onSelect?.(book, index);
        return;
      }

      const stageRect = animationStage.getBoundingClientRect();
      const bRect = bookEl.getBoundingClientRect();

      const startOffset = {
        x: bRect.left + bRect.width / 2 - (stageRect.left + stageRect.width / 2),
        y: bRect.top + bRect.height / 2 - (stageRect.top + stageRect.height / 2),
        width: bRect.width,
        height: bRect.height,
      };

      setProxyCoords(startOffset);
      setActiveBook(book);
      setActiveBookIndex(index);
      setCurrentSpread(0);
      setIsClosing(false);
      setAutoOpenReady(false);
      setStage('flying-out');
      onSelect?.(book, index);
    },
    [stage, onSelect, clearClosingFallback]
  );

  // Keyboard navigation & Escape handling
  useEffect(() => {
    if (stage === 'reading' || stage === 'closing') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [stage, handleClose]);

  const handleSpreadChange = useCallback((spread: number) => {
    setCurrentSpread(spread);
  }, []);

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (shelfScrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      shelfScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  }, []);

  const turnNext = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    }
  }, []);

  const turnPrev = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full rounded-2xl bg-[#FCF8ED] border border-[rgba(163,4,15,0.2)] overflow-hidden shadow-xs select-none',
        className
      )}
    >
      {/* ===================================================================== */}
      {/* 1. TOP RAIL & MODE STATUS CONTROLS                                    */}
      {/* ===================================================================== */}
      <div className="px-5 py-3 border-b border-[rgba(163,4,15,0.12)] bg-[#F4E2CA]/35 flex items-center justify-between text-xs font-mono text-[#5F5650] relative z-40">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              'size-2 rounded-full transition-colors duration-150 motion-reduce:transition-none',
              stage === 'returning'
                ? 'bg-[#FBCA05] animate-pulse motion-reduce:animate-none'
                : stage !== 'shelf'
                ? 'bg-[#A3040F] animate-pulse motion-reduce:animate-none'
                : 'bg-[#A3040F]'
            )}
          />
          <span className="font-bold text-[#222222]">
            {stage !== 'shelf' && activeBook
              ? `VOLUME ${activeBook.editionNumber || ''} · ${activeBook.title.toUpperCase()}`
              : 'ARCHIVE BOOKSHELF'}
          </span>
          <span>&middot;</span>
          <span className="hidden sm:inline">
            {stage === 'closing'
              ? 'FOLDING VOLUME SHUT'
              : stage === 'returning'
              ? 'SLIDING INTO ARCHIVE SLOT'
              : stage === 'flying-out'
              ? 'RETRIEVING FROM ARCHIVE'
              : stage === 'reading'
              ? currentSpread === 0
                ? 'COVER VIEW'
                : currentSpread >= 3
                ? 'BACK COVER'
                : `SPREAD ${currentSpread} / 2`
              : `${books.length} EDITIONS CATALOGUED`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {stage !== 'shelf' ? (
            <button
              type="button"
              onClick={handleClose}
              disabled={stage === 'flying-out' || stage === 'closing' || stage === 'returning'}
              className={cn(
                'px-3 py-1 rounded-md font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-[transform,opacity,background-color,color,border-color] duration-150 ease-out motion-reduce:transition-none',
                stage === 'returning' || stage === 'flying-out'
                  ? 'bg-[#FBCA05]/20 text-[#A3040F] border border-[#FBCA05]/40 opacity-80 cursor-default'
                  : stage === 'closing'
                  ? 'bg-[#FFFDF8] text-[#A3040F] border border-[rgba(163,4,15,0.25)] opacity-80 cursor-default'
                  : 'bg-[#FFFDF8] hover:bg-white text-[#A3040F] border border-[rgba(163,4,15,0.25)] cursor-pointer active:scale-95'
              )}
            >
              <span>
                {stage === 'closing'
                  ? '← Folding closed...'
                  : stage === 'returning'
                  ? '← Docking into shelf...'
                  : stage === 'flying-out'
                  ? 'Retrieving volume...'
                  : '← Put Back on Shelf'}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="size-7 rounded-md bg-[#FFFDF8] hover:bg-white border border-[rgba(163,4,15,0.2)] flex items-center justify-center text-[#222222] transition-colors duration-150 cursor-pointer shadow-2xs motion-reduce:transition-none"
                title="Scroll Shelf Left"
                aria-label="Scroll left"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="size-7 rounded-md bg-[#FFFDF8] hover:bg-white border border-[rgba(163,4,15,0.2)] flex items-center justify-center text-[#222222] transition-colors duration-150 cursor-pointer shadow-2xs motion-reduce:transition-none"
                title="Scroll Shelf Right"
                aria-label="Scroll right"
              >
                &rarr;
              </button>
              <span className="hidden md:inline px-2 py-0.5 rounded bg-[#A3040F]/10 text-[#A3040F] font-bold text-[10px]">
                TACTILE 3D
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. THE PERSISTENT BOOKSHELF STAGE (Never unmounted)                   */}
      {/* ===================================================================== */}
      <div
        ref={stageRef}
        className="relative w-full min-h-[580px] md:min-h-[620px] flex flex-col justify-end overflow-hidden pt-12 pb-0 px-4 sm:px-8 bg-gradient-to-b from-[#FCF8ED] via-[#FBF4E4] to-[#F5EAD4]"
      >
        {/* Subtle architectural vertical wall stripes */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #A3040F 0, #A3040F 1px, transparent 1px, transparent 48px)',
          }}
        />

        {/* Brass coordinate plaque at top center */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1 rounded bg-[#EBD8B8]/60 border border-[rgba(163,4,15,0.2)] text-[10px] font-mono tracking-widest text-[#7A030B] shadow-2xs uppercase z-10 pointer-events-none">
          <span>GEC SHELF ARCHIVE</span>
          <span>&middot;</span>
          <span>CLICK ANY VOLUME TO FLIP</span>
        </div>

        {/* Physical Book Spines Row */}
        {/* data-gec-shelf-row: read by src/components/acts/ActShelf.tsx to
            measure this row's real scrollWidth for its scroll-driven pan.
            Keep this attribute on whichever element lays the covers out
            side by side if this row is ever restructured. */}
        <div
          ref={shelfScrollRef}
          data-gec-shelf-row
          className="relative z-10 flex items-end justify-start gap-2.5 sm:gap-3.5 overflow-x-auto pb-0 px-4 no-scrollbar scroll-smooth"
          style={{ minHeight: '320px' }}
        >
          {books.map((book, index) => {
            const isSelected = activeBook?.id === book.id;
            const isPulledOut = isSelected && stage !== 'shelf';
            const isLeftNeighbor = activeBookIndex !== -1 && index === activeBookIndex - 1;
            const isRightNeighbor = activeBookIndex !== -1 && index === activeBookIndex + 1;
            const isJustDocked = justDockedIndex === index;
            const isLight =
              book.color === '#FCF8ED' || book.color === '#F4E2CA' || book.color === '#FFFDF8';
            const foil = book.foil || (isLight ? '#A3040F' : '#FBCA05');
            const spineHeight = 250 + ((index * 7) % 24);
            const spineWidth = 46 + ((index * 3) % 10);

            return (
              <div
                key={book.id}
                ref={(el) => {
                  bookRefs.current[index] = el;
                }}
                className="relative group shrink-0 flex flex-col items-center select-none cursor-pointer focus:outline-none"
                tabIndex={0}
                role="button"
                aria-label={`Open volume ${book.editionNumber || book.title}`}
                onClick={() => handleSelectBook(book, index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectBook(book, index);
                  }
                }}
              >
                {/* Floating Tooltip On Hover/Focus when shelf is active */}
                {stage === 'shelf' && (
                  <div className="absolute -top-16 z-30 pointer-events-none rounded-lg bg-[#222222] text-white px-3 py-1.5 text-center shadow-xl border border-[rgba(163,4,15,0.3)] whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150">
                    <div className="font-bold text-xs text-[#FFFDF8]">{book.title}</div>
                    <div className="text-[10px] font-mono text-[#FBCA05] flex items-center justify-center gap-1.5 mt-0.5">
                      <span>{book.editionNumber || `#${12 - index}`}</span>
                      <span>&middot;</span>
                      <span>{book.date}</span>
                      <span>&middot;</span>
                      <span className="text-[#FFFDF8]">Click to flip &rarr;</span>
                    </div>
                  </div>
                )}

                {/* Slot Display: Either Recessed Empty Slot (if book is out) or Physical 3D Spine */}
                {isPulledOut ? (
                  <div
                    style={{
                      height: `${spineHeight}px`,
                      width: `${spineWidth}px`,
                    }}
                    className={cn(
                      'relative rounded-t-sm rounded-b-xs flex flex-col justify-between items-center py-3 px-1 transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none',
                      stage === 'returning'
                        ? 'bg-[#FBCA05]/10 shadow-[inset_0_0_0_1.5px_rgba(251,202,5,0.5),inset_0_4px_16px_rgba(0,0,0,0.35)] animate-df-dock-pulse motion-reduce:animate-none'
                        : 'border border-dashed border-[#A3040F]/30 bg-black/15 shadow-[inset_0_4px_16px_rgba(0,0,0,0.5)]'
                    )}
                  >
                    <div className="w-full flex flex-col items-center gap-1 pt-1">
                      <span
                        className={cn(
                          'text-[9px] font-mono font-bold tracking-widest uppercase transition-colors duration-200',
                          stage === 'returning' ? 'text-[#FBCA05]' : 'text-[#A3040F]/60'
                        )}
                      >
                        {book.editionNumber || `#${12 - index}`}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <span
                        className={cn(
                          'font-mono text-[9px] tracking-widest uppercase select-none font-bold transition-colors duration-200',
                          stage === 'returning'
                            ? 'text-[#FBCA05] animate-pulse drop-shadow-[0_0_6px_rgba(251,202,5,0.7)] motion-reduce:animate-none'
                            : 'text-[#5F5650]/60'
                        )}
                        style={{
                          writingMode: 'vertical-rl',
                          transform: 'rotate(180deg)',
                        }}
                      >
                        {stage === 'returning' ? '[ DOCKING... ]' : '[ IN USE ]'}
                      </span>
                    </div>
                    <div
                      className={cn(
                        'h-0.5 w-full origin-center rounded-full transition-[transform,background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none',
                        stage === 'returning'
                          ? 'scale-x-100 bg-[#FBCA05] shadow-[0_0_8px_#FBCA05]'
                          : 'scale-x-25 bg-[#A3040F]/25'
                      )}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      height: `${spineHeight}px`,
                      width: `${spineWidth}px`,
                      backgroundColor: book.color || '#A3040F',
                      transform:
                        stage !== 'shelf' && stage !== 'returning'
                          ? isLeftNeighbor
                            ? 'rotate(-1.8deg) translateX(-3px)'
                            : isRightNeighbor
                            ? 'rotate(1.8deg) translateX(3px)'
                            : undefined
                          : undefined,
                      transformOrigin: 'bottom center',
                      transition: prefersReducedMotion ? 'none' : 'transform 200ms ease-out',
                    }}
                    className={cn(
                      'relative rounded-t-sm rounded-b-xs flex flex-col justify-between items-center py-2.5 px-1 overflow-hidden transition-transform duration-200 ease-out motion-reduce:transition-none',
                      isJustDocked && 'shadow-[0_0_20px_rgba(251,202,5,0.55)]',
                      stage === 'shelf' && !isJustDocked &&
                        'group-hover:-translate-y-5.5 group-hover:scale-[1.03] group-hover:shadow-[0_24px_28px_-6px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.2)]',
                      stage === 'shelf' &&
                        'group-focus-visible:ring-2 group-focus-visible:ring-[#A3040F] group-focus-visible:ring-offset-2',
                      'shadow-[0_8px_12px_-4px_rgba(0,0,0,0.25)]'
                    )}
                  >
                    {/* Cylindrical 3D Spine Curvature Lighting */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(255,255,255,0.22) 18%, rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.55) 100%)',
                      }}
                    />

                    {/* Top Spine Foil Accent Ring */}
                    <div className="relative z-10 w-full flex flex-col items-center gap-1 pt-1">
                      <div
                        className="w-full h-1 rounded-full shadow-xs"
                        style={{ backgroundColor: foil }}
                      />
                      <div
                        className="w-4/5 h-0.5 opacity-60"
                        style={{ backgroundColor: foil }}
                      />
                      <span
                        className="text-[9px] font-mono font-bold tracking-widest mt-1 uppercase"
                        style={{ color: foil }}
                      >
                        {book.editionNumber || `#${12 - index}`}
                      </span>
                    </div>

                    {/* Center Spine Vertical Title */}
                    <div className="relative z-10 flex-1 flex items-center justify-center py-2 overflow-hidden w-full">
                      <span
                        className="font-bold text-xs tracking-wider whitespace-nowrap uppercase select-none"
                        style={{
                          writingMode: 'vertical-rl',
                          transform: 'rotate(180deg)',
                          color: isLight ? '#222222' : '#FFFDF8',
                          letterSpacing: '0.12em',
                          textShadow: isLight
                            ? '0 1px 1px rgba(255,255,255,0.4)'
                            : '0 1px 2px rgba(0,0,0,0.7)',
                        }}
                      >
                        {book.title}
                      </span>
                    </div>

                    {/* Bottom Spine GEC Publisher Emblem & Ribs */}
                    <div className="relative z-10 w-full flex flex-col items-center gap-1.5 pb-1">
                      <svg
                        className="size-4 opacity-90"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={foil}
                        strokeWidth="1.75"
                        aria-hidden="true"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      <div
                        className="w-full h-0.5"
                        style={{ backgroundColor: foil }}
                      />
                      <div className="w-full h-1 bg-black/20 rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dimensional Wooden Shelf Ledge */}
        <div className="relative z-20 w-full mt-0">
          {/* Top Shelf Bevel Surface */}
          <div className="h-4 bg-gradient-to-r from-[#DFCDB0] via-[#F4E2CA] to-[#DFCDB0] border-t border-[rgba(163,4,15,0.22)] shadow-sm" />
          {/* Wooden Front Edge Profile */}
          <div className="h-5 bg-gradient-to-b from-[#CDB491] via-[#BA9E79] to-[#A88C67] border-t border-white/25 shadow-md flex items-center justify-center">
            <span className="text-[9px] font-mono tracking-widest text-[#FFFDF8]/70 uppercase">
              GALGOTIAS ENTREPRENEURSHIP CELL &middot; FOUNDER ARCHIVES
            </span>
          </div>
          {/* Under-shelf Drop Shadow */}
          <div className="h-2 bg-gradient-to-b from-black/15 to-transparent" />
        </div>

        {/* ===================================================================== */}
        {/* 3. CREATIVE ATMOSPHERIC BLUR OVERLAY (Depth of Field + Warm Spotlight) */}
        {/* ===================================================================== */}
        <AnimatePresence>
          {stage !== 'shelf' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: stage === 'returning' ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.2,
                ease: 'easeOut',
              }}
              className="absolute inset-0 z-30 pointer-events-auto overflow-hidden cursor-pointer"
              onClick={(e) => {
                if (e.target === e.currentTarget && stage === 'reading') {
                  handleClose();
                }
              }}
              title={stage === 'reading' ? 'Click background to return book to shelf' : undefined}
            >
              {/* 1. Warm Library Lamp Spotlight */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    radial-gradient(
                      ellipse 72% 64% at 50% 44%,
                      rgba(255, 252, 246, 0.94) 0%,
                      rgba(252, 248, 237, 0.88) 35%,
                      rgba(244, 226, 202, 0.65) 65%,
                      rgba(163, 4, 15, 0.16) 88%,
                      rgba(28, 24, 20, 0.35) 100%
                    )
                  `,
                }}
              />

              {/* 2. Floating Bokeh Particles (Atmospheric dust & lens circles) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-12 left-1/4 size-36 rounded-full bg-[#FBCA05]/25 blur-xl animate-df-bokeh-1 motion-reduce:animate-none" />
                <div className="absolute top-1/3 -right-12 size-48 rounded-full bg-[#A3040F]/18 blur-2xl animate-df-bokeh-2 motion-reduce:animate-none" />
                <div className="absolute bottom-12 left-1/3 size-32 rounded-full bg-[#FFFDF8]/45 blur-lg animate-df-bokeh-3 motion-reduce:animate-none" />
                <div className="absolute -bottom-6 right-1/4 size-28 rounded-full bg-[#1F7EC0]/15 blur-xl animate-df-bokeh-1 motion-reduce:animate-none" />
                <div className="absolute top-8 right-1/3 size-40 rounded-full bg-[#FBCA05]/20 blur-2xl animate-df-bokeh-2 motion-reduce:animate-none" />
              </div>

              {/* 3. Fine Tactile Parchment Micro-Grain Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.045]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                }}
              />

              {/* 4. Edge Vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow:
                    'inset 0 0 90px rgba(28, 24, 20, 0.28), inset 0 0 20px rgba(163, 4, 15, 0.1)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================================== */}
        {/* 4. 3D PROXY BOOK FOR PHYSICAL FLIGHT & SHELF DOCKING                  */}
        {/* ===================================================================== */}
        {(stage === 'flying-out' || stage === 'returning') &&
          activeBook &&
          activeBookData && (() => {
            const shelfWidth = Math.max(36, proxyCoords.width);
            const shelfHeight = Math.max(220, proxyCoords.height);
            const shelfScale = shelfHeight / pageHeight;
            const bookDepth = shelfWidth / shelfScale;
            const zDockOffset = -((pageWidth / 2) * shelfScale);
            const isLight =
              activeBook.color === '#FCF8ED' ||
              activeBook.color === '#F4E2CA' ||
              activeBook.color === '#FFFDF8';
            const foil = activeBook.foil || (isLight ? '#A3040F' : '#FBCA05');

            return (
              <motion.div
                key={`proxy-${activeBook.id}`}
                initial={
                  stage === 'returning'
                    ? {
                        x: 0,
                        y: 0,
                        scale: 1,
                        rotateY: 0,
                        rotateZ: 0,
                        rotateX: 0,
                        z: 0,
                        transformPerspective: 2200,
                      }
                    : {
                        x: proxyCoords.x,
                        y: proxyCoords.y,
                        scale: shelfScale,
                        rotateY: 90,
                        rotateZ: 0,
                        rotateX: 0,
                        z: zDockOffset,
                        transformPerspective: 2200,
                      }
                }
                animate={
                  stage === 'returning'
                    ? {
                        x: [0, proxyCoords.x * 0.45, proxyCoords.x],
                        y: [0, -34, proxyCoords.y],
                        scale: [1, 0.92, shelfScale],
                        rotateY: [0, 45, 90],
                        rotateZ: [0, -2.5, 0],
                        rotateX: [0, 5, 0],
                        z: [0, 18, zDockOffset],
                      }
                    : stage === 'flying-out'
                    ? {
                        // Ease the volume out of its slot first, then rotate it
                        // toward the reader so the movement feels lifted rather
                        // than snapped directly to center.
                        x: [proxyCoords.x, proxyCoords.x * 0.82, proxyCoords.x * 0.38, 0],
                        y: [proxyCoords.y, proxyCoords.y - 28, -28, 0],
                        scale: [shelfScale, shelfScale * 1.12, 0.94, 1],
                        rotateY: [90, 78, 30, 0],
                        rotateZ: [0, 1.2, 2, 0],
                        rotateX: [0, 2, 4, 0],
                        z: [zDockOffset, 0, 24, 0],
                      }
                    : {
                        x: 0,
                        y: 0,
                        scale: 1,
                        rotateY: 0,
                        rotateZ: 0,
                        rotateX: 0,
                        z: 0,
                      }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0.01 }
                    : stage === 'returning'
                    ? {
                        duration: 0.58,
                        times: [0, 0.38, 1.0],
                        ease: 'easeOut',
                      }
                    : stage === 'flying-out'
                    ? {
                        duration: 0.9,
                        times: [0, 0.22, 0.72, 1],
                        ease: ['easeOut', 'easeInOut', 'easeOut'],
                      }
                    : { duration: 0.25 }
                }
                onAnimationComplete={() => {
                  if (stage === 'flying-out') {
                    haptic('soft');
                    setStage('reading');
                    setAutoOpenReady(true);
                  } else if (stage === 'returning') {
                    haptic('selection');
                    setJustDockedIndex(activeBookIndex);
                    setStage('shelf');
                    setActiveBook(null);
                    setActiveBookIndex(-1);
                    setIsClosing(false);
                    setAutoOpenReady(false);
                    setCurrentSpread(0);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -pageHeight / 2,
                  marginLeft: -pageWidth / 2,
                  width: pageWidth,
                  height: pageHeight,
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                  zIndex: 50,
                  pointerEvents: 'none',
                  boxShadow: '0 24px 48px -16px rgba(0,0,0,0.42)',
                }}
                className="select-none"
              >
                {/* 1. FRONT COVER FACE */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `translateZ(${bookDepth / 2}px)`,
                    backfaceVisibility: 'hidden',
                    borderRadius: '3px 14px 14px 3px',
                    overflow: 'hidden',
                  }}
                  className="shadow-2xl"
                >
                  {activeBookData.cover}
                </div>

                {/* 2. BACK COVER FACE */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `rotateY(180deg) translateZ(${bookDepth / 2}px)`,
                    backfaceVisibility: 'hidden',
                    borderRadius: '14px 3px 3px 14px',
                    overflow: 'hidden',
                  }}
                  className="shadow-2xl"
                >
                  {activeBookData.backCover}
                </div>

                {/* 3. SPINE FACE (Left Edge - Faces camera at rotateY: 90deg!) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${(pageWidth - bookDepth) / 2}px`,
                    width: `${bookDepth}px`,
                    height: '100%',
                    transform: `rotateY(-90deg) translateZ(${pageWidth / 2}px)`,
                    backfaceVisibility: 'hidden',
                    backgroundColor: activeBook.color || '#A3040F',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                  className="flex flex-col justify-between items-center py-2.5 px-1 shadow-[inset_0_0_12px_rgba(0,0,0,0.5)]"
                >
                  {/* Cylindrical 3D Spine Lighting */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(255,255,255,0.22) 18%, rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.55) 100%)',
                    }}
                  />

                  {/* Top Spine Foil Accent Ring */}
                  <div className="relative z-10 w-full flex flex-col items-center gap-1 pt-1">
                    <div
                      className="w-full h-1 rounded-full shadow-xs"
                      style={{ backgroundColor: foil }}
                    />
                    <div
                      className="w-4/5 h-0.5 opacity-60"
                      style={{ backgroundColor: foil }}
                    />
                    <span
                      className="text-[9px] font-mono font-bold tracking-widest mt-1 uppercase"
                      style={{ color: foil }}
                    >
                      {activeBook.editionNumber || `#${12 - activeBookIndex}`}
                    </span>
                  </div>

                  {/* Center Spine Vertical Title */}
                  <div className="relative z-10 flex-1 flex items-center justify-center py-2 overflow-hidden w-full">
                    <span
                      className="font-bold text-xs tracking-wider whitespace-nowrap uppercase select-none"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        color: isLight ? '#222222' : '#FFFDF8',
                        letterSpacing: '0.12em',
                        textShadow: isLight
                          ? '0 1px 1px rgba(255,255,255,0.4)'
                          : '0 1px 2px rgba(0,0,0,0.7)',
                      }}
                    >
                      {activeBook.title}
                    </span>
                  </div>

                  {/* Bottom Spine GEC Publisher Emblem & Ribs */}
                  <div className="relative z-10 w-full flex flex-col items-center gap-1.5 pb-1">
                    <svg
                      className="size-4 opacity-90"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={foil}
                      strokeWidth="1.75"
                      aria-hidden="true"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <div
                      className="w-full h-0.5"
                      style={{ backgroundColor: foil }}
                    />
                    <div className="w-full h-1 bg-black/20 rounded-full" />
                  </div>
                </div>

                {/* 4. FORE-EDGE (Right Edge - Layered Cream Paper Pages) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${(pageWidth - bookDepth) / 2}px`,
                    width: `${bookDepth}px`,
                    height: '100%',
                    transform: `rotateY(90deg) translateZ(${pageWidth / 2}px)`,
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#F7F2E6',
                    backgroundImage:
                      'repeating-linear-gradient(0deg, #FAF6EC 0px, #FAF6EC 2px, #E8DFCC 2px, #E8DFCC 3px)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 0 16px rgba(0,0,0,0.25)',
                  }}
                />

                {/* 5. TOP EDGE (Head - Stacked Page Edge) */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${(pageHeight - bookDepth) / 2}px`,
                    left: 0,
                    width: `${pageWidth}px`,
                    height: `${bookDepth}px`,
                    transform: `rotateX(90deg) translateZ(${pageHeight / 2}px)`,
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#F5EEDC',
                    backgroundImage:
                      'repeating-linear-gradient(90deg, #FAF6EC 0px, #FAF6EC 2px, #E8DFCC 2px, #E8DFCC 3px)',
                    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.25)',
                  }}
                />

                {/* 6. BOTTOM EDGE (Tail - Stacked Page Edge) */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${(pageHeight - bookDepth) / 2}px`,
                    left: 0,
                    width: `${pageWidth}px`,
                    height: `${bookDepth}px`,
                    transform: `rotateX(-90deg) translateZ(${pageHeight / 2}px)`,
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#F5EEDC',
                    backgroundImage:
                      'repeating-linear-gradient(90deg, #FAF6EC 0px, #FAF6EC 2px, #E8DFCC 2px, #E8DFCC 3px)',
                    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.25)',
                  }}
                />
              </motion.div>
            );
          })()}


        {/* ===================================================================== */}
        {/* 6. INTERACTIVE FLIPBOOK READING STAGE (DeskFolio)                     */}
        {/* ===================================================================== */}
        {(stage === 'reading' || stage === 'closing') && activeBook && activeBookData && (
          <div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 pointer-events-auto select-none"
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onContextMenu={(e) => {
              const target = e.target as HTMLElement;
              if (target && !target.closest('input, textarea, [contenteditable="true"]')) {
                e.preventDefault();
              }
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && stage === 'reading') {
                handleClose();
              }
            }}
          >
            {/* Stage Sub-Header */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-3 px-3 text-xs pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#A3040F] text-white font-mono font-bold text-[11px]">
                  {activeBook.editionNumber || 'EDITION'}
                </span>
                <strong className="text-sm text-[#222222] font-bold drop-shadow-xs">
                  {activeBook.title}
                </strong>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#5F5650]">
                <span className="hidden sm:inline">
                  {stage === 'closing'
                    ? 'Folding pages back to cover...'
                    : 'Turn pages with drag or arrows ← →'}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#FFFDF8] border border-[rgba(163,4,15,0.2)] font-bold text-[#A3040F] shadow-2xs">
                  {stage === 'closing'
                    ? 'CLOSING'
                    : currentSpread === 0
                    ? 'COVER'
                    : currentSpread >= 3
                    ? 'BACK COVER'
                    : `SPREAD ${currentSpread} / 2`}
                </span>
              </div>
            </div>

            {/* The Flippable 3D Book Container */}
            <div className="relative flex items-center justify-center py-2 overflow-visible select-none" onCopy={(e) => e.preventDefault()}>
              {/* Floating Previous Page Button */}
              <button
                type="button"
                onClick={turnPrev}
                disabled={currentSpread <= 0 || stage === 'closing'}
                aria-label="Previous page"
                className="absolute -left-12 sm:-left-16 z-50 size-10 rounded-full bg-[#FFFDF8] hover:bg-white text-[#222222] hover:text-[#A3040F] border border-[rgba(163,4,15,0.22)] shadow-lg flex items-center justify-center font-bold text-base transition-[transform,opacity,background-color,color,border-color] duration-150 ease-out disabled:opacity-20 disabled:pointer-events-none cursor-pointer active:scale-95 motion-reduce:transition-none"
              >
                &larr;
              </button>

              {/* DeskFolio Component with Auto-Open and Spring Physics */}
              <DeskFolio
                cover={activeBookData.cover}
                pages={activeBookData.pages}
                backCover={activeBookData.backCover}
                pageWidth={pageWidth}
                pageHeight={pageHeight}
                initialSpread={0}
                autoOpen={autoOpenReady}
                autoOpenDelay={120}
                closeRequested={isClosing}
                onClose={handleDeskFolioClosed}
                onTurn={handleSpreadChange}
                closeOnEnd={true}
                virtualizePages={true}
                className="gec-newsletter-deskfolio shadow-2xl"
              />

              {/* Floating Next Page Button */}
              <button
                type="button"
                onClick={turnNext}
                disabled={currentSpread >= 3 || stage === 'closing'}
                aria-label="Next page"
                className="absolute -right-12 sm:-right-16 z-50 size-10 rounded-full bg-[#FFFDF8] hover:bg-white text-[#222222] hover:text-[#A3040F] border border-[rgba(163,4,15,0.22)] shadow-lg flex items-center justify-center font-bold text-base transition-[transform,opacity,background-color,color,border-color] duration-150 ease-out disabled:opacity-20 disabled:pointer-events-none cursor-pointer active:scale-95 motion-reduce:transition-none"
              >
                &rarr;
              </button>
            </div>

            {/* Bottom Quick Return Bar */}
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={stage === 'closing'}
                className="px-4 py-1.5 rounded-full bg-[#FFFDF8]/90 hover:bg-white text-[#5F5650] hover:text-[#A3040F] border border-[rgba(163,4,15,0.18)] shadow-xs text-xs font-mono font-medium transition-[transform,opacity,background-color,color,border-color] duration-150 ease-out flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-60 motion-reduce:transition-none"
              >
                <span>
                  &larr; {stage === 'closing' ? 'Folding volume closed...' : 'Put back on shelf'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
