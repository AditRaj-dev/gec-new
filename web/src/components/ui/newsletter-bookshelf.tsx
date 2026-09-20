'use client';

import React, { useState, useRef, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

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

// Dynamically imported reader to avoid bundling DeskFolio, Motion, and reader styles with initial shelf
const NewsletterReader = dynamic(
  () => import('./newsletter-reader').then((mod) => mod.NewsletterReader),
  {
    ssr: false,
    loading: () => (
      <div className="relative pt-6 pb-8 px-4 bg-gradient-to-b from-[#FAF6EC] to-[#F4E8D3] min-h-[580px] flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-xs font-mono text-[#5F5650]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A3040F] animate-pulse" />
          <span>Opening interactive volume...</span>
        </div>
      </div>
    ),
  }
);

export function NewsletterBookshelf({
  items = defaultNewsletterBooks,
  className,
  onSelect,
  activeId,
}: NewsletterBookshelfProps) {
  const books = useMemo(() => (items.length ? items : defaultNewsletterBooks), [items]);

  // Sync prop changes without useEffect setState
  const [controlledActiveId, setControlledActiveId] = useState(activeId);
  const [selectedBookId, setSelectedBookId] = useState<string>(activeId || books[0]?.id || '');
  if (activeId !== controlledActiveId) {
    setControlledActiveId(activeId);
    if (activeId) {
      setSelectedBookId(activeId);
    }
  }

  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const shelfScrollRef = useRef<HTMLDivElement>(null);

  const activeBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) || books[0],
    [books, selectedBookId],
  );

  // Prefetch reader component and CSS upon hover/focus
  const prefetchReader = useCallback(() => {
    void import('./newsletter-reader');
  }, []);

  const handleSelect = useCallback((book: NewsletterBookshelfItem, index: number) => {
    setSelectedBookId(book.id);
    setIsReaderOpen(true);
    onSelect?.(book, index);
  }, [onSelect]);

  const handleCloseReader = useCallback(() => {
    setIsReaderOpen(false);
  }, []);

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (shelfScrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      shelfScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  }, []);

  return (
    <div
      className={cn('relative w-full rounded-2xl bg-[#FCF8ED] border border-[rgba(163,4,15,0.2)] overflow-hidden shadow-xs', className)}
    >
      {/* ===================================================================== */}
      {/* 1. TOP RAIL & MODE SWITCH CONTROLS                                    */}
      {/* ===================================================================== */}
      <div className="px-5 py-3 border-b border-[rgba(163,4,15,0.12)] bg-[#F4E2CA]/35 flex items-center justify-between text-xs font-mono text-[#5F5650]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#A3040F]" />
          <span className="font-bold text-[#222222]">
            {isReaderOpen ? 'FLIPPABLE EDITION READER' : 'ARCHIVE BOOKSHELF'}
          </span>
          <span>&middot;</span>
          <span className="hidden sm:inline">{books.length} EDITIONS CATALOGUED</span>
        </div>

        <div className="flex items-center gap-3">
          {isReaderOpen ? (
            <button
              onClick={handleCloseReader}
              className="px-3 py-1 bg-[#FFFDF8] hover:bg-white text-[#A3040F] border border-[rgba(163,4,15,0.25)] rounded-md font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <span>&larr; Put Back on Shelf</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                className="w-7 h-7 rounded-md bg-[#FFFDF8] hover:bg-white border border-[rgba(163,4,15,0.2)] flex items-center justify-center text-[#222222] transition-colors cursor-pointer shadow-2xs"
                title="Scroll Shelf Left"
                aria-label="Scroll left"
              >
                &larr;
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-7 h-7 rounded-md bg-[#FFFDF8] hover:bg-white border border-[rgba(163,4,15,0.2)] flex items-center justify-center text-[#222222] transition-colors cursor-pointer shadow-2xs"
                title="Scroll Shelf Right"
                aria-label="Scroll right"
              >
                &rarr;
              </button>
              <span className="hidden md:inline px-2 py-0.5 rounded bg-[#A3040F]/10 text-[#A3040F] font-bold text-[10px]">
                LIGHTWEIGHT CSS3D
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MAIN STAGE: EITHER BOOKSHELF ROW OR DYNAMICALLY LOADED FLIPBOOK    */}
      {/* ===================================================================== */}
      {!isReaderOpen ? (
        /* ------------------------------------------------------------------- */
        /* MODE A: TACTILE PHYSICAL BOOKSHELF (NO WEBGL, PURE CSS3D)           */
        /* ------------------------------------------------------------------- */
        <div className="relative pt-12 pb-6 px-4 sm:px-8 bg-gradient-to-b from-[#FCF8ED] via-[#FBF4E4] to-[#F5EAD4] overflow-hidden min-h-[440px] flex flex-col justify-end">
          {/* Subtle architectural vertical wall lines */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #A3040F 0, #A3040F 1px, transparent 1px, transparent 48px)',
            }}
          />

          {/* Brass coordinate plaque in center */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1 rounded bg-[#EBD8B8]/60 border border-[rgba(163,4,15,0.2)] text-[10px] font-mono tracking-widest text-[#7A030B] shadow-2xs uppercase">
            <span>GEC SHELF ARCHIVE</span>
            <span>&middot;</span>
            <span>CLICK ANY VOLUME TO FLIP</span>
          </div>

          {/* Book Spine Shelf Row */}
          <div
            ref={shelfScrollRef}
            className="relative z-10 flex items-end justify-start gap-2.5 sm:gap-3.5 overflow-x-auto pb-0 px-4 no-scrollbar scroll-smooth"
            style={{ minHeight: '320px' }}
          >
            {books.map((book, index) => {
              const isSelected = selectedBookId === book.id;
              const isLight = book.color === '#FCF8ED' || book.color === '#F4E2CA' || book.color === '#FFFDF8';
              const foil = book.foil || (isLight ? '#A3040F' : '#FBCA05');
              const spineHeight = 250 + ((index * 7) % 24); // Subtle height variance
              const spineWidth = 46 + ((index * 3) % 10); // Subtle width variance

              return (
                <div
                  key={book.id}
                  className="relative group shrink-0 flex flex-col items-center select-none cursor-pointer focus:outline-none"
                  tabIndex={0}
                  role="button"
                  aria-label={`Open volume ${book.editionNumber || book.title}`}
                  onPointerEnter={prefetchReader}
                  onFocus={prefetchReader}
                  onClick={() => handleSelect(book, index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(book, index);
                    }
                  }}
                >
                  {/* Floating Tooltip On Hover/Focus using pure CSS */}
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

                  {/* Physical 3D Book Spine with CSS hover/focus transforms */}
                  <div
                    style={{
                      height: `${spineHeight}px`,
                      width: `${spineWidth}px`,
                      backgroundColor: book.color || '#A3040F',
                    }}
                    className={cn(
                      'relative rounded-t-sm rounded-b-xs flex flex-col justify-between items-center py-2.5 px-1 overflow-hidden transition-all duration-250 ease-out',
                      'group-hover:-translate-y-5.5 group-hover:scale-[1.03] group-hover:shadow-[0_24px_28px_-6px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.2)]',
                      'group-focus-visible:-translate-y-5.5 group-focus-visible:scale-[1.03] group-focus-visible:shadow-[0_24px_28px_-6px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.2)]',
                      isSelected
                        ? '-translate-y-2.5 shadow-[0_16px_20px_-6px_rgba(163,4,15,0.35),inset_0_0_0_2px_#FBCA05]'
                        : 'shadow-[0_8px_12px_-4px_rgba(0,0,0,0.25)]'
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
                        className="w-4 h-4 opacity-90"
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
                </div>
              );
            })}
          </div>

          {/* Dimensional Wooden Shelf Ledge */}
          <div className="relative z-20 w-full mt-0">
            {/* Top Shelf Bevel Surface */}
            <div className="h-4 bg-gradient-to-r from-[#DFCDB0] via-[#F4E2CA] to-[#DFCDB0] border-t border-[rgba(163,4,15,0.22)] shadow-sm" />
            {/* Wooden Front Edge Profile with Rich Warm Tone */}
            <div className="h-5 bg-gradient-to-b from-[#CDB491] via-[#BA9E79] to-[#A88C67] border-t border-white/25 shadow-md flex items-center justify-center">
              <span className="text-[9px] font-mono tracking-widest text-[#FFFDF8]/70 uppercase">
                GALGOTIAS ENTREPRENEURSHIP CELL &middot; FOUNDER ARCHIVES
              </span>
            </div>
            {/* Under-shelf Drop Shadow */}
            <div className="h-2 bg-gradient-to-b from-black/15 to-transparent" />
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------------- */
        /* MODE B: DYNAMICALLY IMPORTED FLIPPABLE BOOK READER                 */
        /* ------------------------------------------------------------------- */
        <NewsletterReader
          key={activeBook.id}
          books={books}
          selectedBookId={selectedBookId}
          onSelectBook={handleSelect}
          onClose={handleCloseReader}
        />
      )}
    </div>
  );
}
