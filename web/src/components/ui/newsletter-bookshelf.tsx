'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { DeskFolio } from '@/components/deskfolio/DeskFolio';
import { cn } from '@/lib/utils';
import '@/components/deskfolio/deskfolio.css';
import '@/components/deskfolio/deskfolio-page.css';

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

function buildDispatchPages(item: NewsletterBookshelfItem) {
  const isLight = item.color === '#FCF8ED' || item.color === '#F4E2CA' || item.color === '#FFFDF8';
  const foilColor = item.foil || (isLight ? '#A3040F' : '#FBCA05');
  const baseBg = item.color || '#A3040F';
  const textColor = isLight ? '#222222' : '#FFFDF8';

  const cover = (
    <article
      className="gec-book-cover"
      style={{
        background: `radial-gradient(120% 90% at 50% 15%, rgba(255,255,255,0.18) 0%, transparent 60%), linear-gradient(160deg, ${baseBg} 0%, rgba(0,0,0,0.35) 100%)`,
        backgroundColor: baseBg,
        color: textColor,
        boxShadow: `inset 0 0 0 1px ${foilColor}55, inset 0 0 0 8px rgba(0,0,0,0.25)`,
      }}
    >
      <div className="df-cover-foil-border" style={{ borderColor: `${foilColor}66` }} aria-hidden="true" />
      <header className="gec-book-cover__running" style={{ borderBottomColor: `${foilColor}44`, color: foilColor }}>
        <span>GEC ARCHIVES // QUARTERLY DISPATCH</span>
        <span>{item.id.toUpperCase()}</span>
      </header>
      <div className="gec-book-cover__title-block">
        <svg className="gec-book-cover__mark" viewBox="0 0 72 72" style={{ color: foilColor }} aria-hidden="true">
          <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="36" cy="36" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
          <path d="M36 19 47 26v12c0 8-4.4 13.5-11 16-6.6-2.5-11-8-11-16V26l11-7Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="m36 27 2.2 5.7 5.8 2.2-5.8 2.1-2.2 5.8-2.2-5.8-5.8-2.1 5.8-2.2L36 27Z" fill="currentColor" />
        </svg>
        <span className="gec-book-cover__mark-label" style={{ color: foilColor }}>
          {item.editionNumber || 'VOL. 2026'} // {item.category || 'VENTURE ARCHIVE'}
        </span>
        <h2 style={{ color: textColor }}>{item.title}</h2>
        <p style={{ color: isLight ? '#5F5650' : 'rgba(255,255,255,0.75)' }}>
          {item.subtitle || 'Operational notes and blueprints for student venture teams.'}
        </p>
      </div>
      <footer className="gec-book-cover__footer" style={{ borderTopColor: `${foilColor}44`, color: isLight ? '#5F5650' : 'rgba(255,255,255,0.75)' }}>
        <span>Galgotias Entrepreneurship Cell</span>
        <span style={{ color: foilColor }}>Open Volume &rarr;</span>
      </footer>
    </article>
  );

  const page1 = (
    <article className="gec-editorial-page">
      <div className="gec-editorial-page__texture" aria-hidden="true" />
      <header className="gec-editorial-page__running">
        <div className="gec-editorial-page__running-left">
          <span className="gec-editorial-page__running-pill">{item.editionNumber || 'DISPATCH'}</span>
          <span className="gec-editorial-page__kicker">Issue Briefing</span>
        </div>
        <span className="gec-editorial-page__folio-id">FOLIO 01</span>
      </header>
      <div className="gec-editorial-page__content">
        <span className="gec-editorial-page__category">{item.category || 'Executive Memo'}</span>
        <h3 className="gec-editorial-page__title">{item.title}</h3>
        <p className="gec-editorial-page__deck">{item.executiveSummary || item.subtitle}</p>
        <div className="p-3 rounded-lg bg-[#FCF8ED] border border-[rgba(163,4,15,0.15)] text-xs text-[#222222]">
          <strong className="block text-[#A3040F] font-mono uppercase text-[11px] mb-1">Working Hypothesis</strong>
          Every student venture begins with unverified assumptions. This dispatch archives the direct proof points that moved the work forward.
        </div>
      </div>
      <footer className="gec-editorial-page__footer flex items-center justify-between text-xs text-[#78716C] pt-2 border-t border-black/10">
        <span>{item.date}</span>
        <span>Page 1</span>
      </footer>
    </article>
  );

  const page2 = (
    <article className="gec-editorial-page">
      <div className="gec-editorial-page__texture" aria-hidden="true" />
      <header className="gec-editorial-page__running">
        <div className="gec-editorial-page__running-left">
          <span className="gec-editorial-page__running-pill">FRAMEWORK</span>
          <span className="gec-editorial-page__kicker">Operational Blueprint</span>
        </div>
        <span className="gec-editorial-page__folio-id">FOLIO 02</span>
      </header>
      <div className="gec-editorial-page__content">
        <span className="gec-editorial-page__category">Execution Mechanics</span>
        <h3 className="gec-editorial-page__title">Three Promises to Early Builders</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-[#374151]">
            <span className="w-5 h-5 rounded-md bg-[#A3040F] text-white font-mono font-bold flex items-center justify-center shrink-0">01</span>
            <div>
              <strong className="text-[#111827] block font-semibold">Evidence Over Applause</strong>
              Customer behaviour and pilot retention matter infinitely more than polished pitch decks.
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#374151]">
            <span className="w-5 h-5 rounded-md bg-[#1F7EC0] text-white font-mono font-bold flex items-center justify-center shrink-0">02</span>
            <div>
              <strong className="text-[#111827] block font-semibold">Founder Sovereignty</strong>
              Mentorship is designed around student equity control and long-term operating autonomy.
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#374151]">
            <span className="w-5 h-5 rounded-md bg-[#FBCA05] text-[#222222] font-mono font-bold flex items-center justify-center shrink-0">03</span>
            <div>
              <strong className="text-[#111827] block font-semibold">Timely Capital Injection</strong>
              Prototype grants and compute credits arrive at the precise moment the experiment demands them.
            </div>
          </div>
        </div>
      </div>
      <footer className="gec-editorial-page__footer flex items-center justify-between text-xs text-[#78716C] pt-2 border-t border-black/10">
        <span>GEC Operating Charter</span>
        <span>Page 2</span>
      </footer>
    </article>
  );

  const page3 = (
    <article className="gec-editorial-page">
      <div className="gec-editorial-page__texture" aria-hidden="true" />
      <header className="gec-editorial-page__running">
        <div className="gec-editorial-page__running-left">
          <span className="gec-editorial-page__running-pill">CAPITAL</span>
          <span className="gec-editorial-page__kicker">Deal Mechanics</span>
        </div>
        <span className="gec-editorial-page__folio-id">FOLIO 03</span>
      </header>
      <div className="gec-editorial-page__content">
        <span className="gec-editorial-page__category">Non-Dilutive Capital</span>
        <h3 className="gec-editorial-page__title">Under the Hood: Tranches &amp; Diligence</h3>
        <p className="text-xs text-[#374151] leading-relaxed">
          How student teams navigate angel syndicates, seed grants, and university IP assignments without early dilution.
        </p>
        <blockquote className="p-3 rounded-lg bg-[#F4E2CA]/40 border-l-2 border-[#A3040F] text-xs text-[#222222] italic">
          &ldquo;The prototype grant mattered because it paid for the experiment everyone else wanted us to postpone.&rdquo;
          <cite className="block text-[11px] text-[#A3040F] font-bold not-italic mt-1.5">&mdash; Galgotias Alumni Founder</cite>
        </blockquote>
      </div>
      <footer className="gec-editorial-page__footer flex items-center justify-between text-xs text-[#78716C] pt-2 border-t border-black/10">
        <span>GEC Capital Stack</span>
        <span>Page 3</span>
      </footer>
    </article>
  );

  const page4 = (
    <article className="gec-editorial-page">
      <div className="gec-editorial-page__texture" aria-hidden="true" />
      <header className="gec-editorial-page__running">
        <div className="gec-editorial-page__running-left">
          <span className="gec-editorial-page__running-pill">DIRECTIVES</span>
          <span className="gec-editorial-page__kicker">Founder Checklist</span>
        </div>
        <span className="gec-editorial-page__folio-id">FOLIO 04</span>
      </header>
      <div className="gec-editorial-page__content">
        <span className="gec-editorial-page__category">Action Items</span>
        <h3 className="gec-editorial-page__title">Takeaways for this Sprint</h3>
        <ul className="space-y-2 text-xs text-[#222222]">
          {(item.takeaways || [
            'Audit the user pain: interview 10 people who encountered the problem this week.',
            'Test the exchange: ask for economic sacrifice before writing backend code.',
            'Keep founder paperwork unambiguous: clear 4-year vesting and IP assignment.',
          ]).map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#A3040F] font-bold font-mono">&rarr;</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 pt-2 border-t border-black/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#5F5650]">Office hours: Innovation Tower</span>
          <span className="text-[11px] font-bold text-[#A3040F]">incubation@gecgalgotias.org</span>
        </div>
      </div>
      <footer className="gec-editorial-page__footer flex items-center justify-between text-xs text-[#78716C] pt-2 border-t border-black/10">
        <span>End of Dispatch</span>
        <span>Page 4</span>
      </footer>
    </article>
  );

  const backCover = (
    <article className="gec-book-cover gec-book-cover--back">
      <header className="gec-book-cover__running">
        <span>GEC ARCHIVES</span>
        <span>2026</span>
      </header>
      <div className="gec-book-cover__title-block">
        <svg className="gec-book-cover__mark" viewBox="0 0 72 72" style={{ color: '#FBCA05' }} aria-hidden="true">
          <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="36" cy="36" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
          <path d="M36 19 47 26v12c0 8-4.4 13.5-11 16-6.6-2.5-11-8-11-16V26l11-7Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="m36 27 2.2 5.7 5.8 2.2-5.8 2.1-2.2 5.8-2.2-5.8-5.8-2.1 5.8-2.2L36 27Z" fill="currentColor" />
        </svg>
        <h2 style={{ color: '#FAF8F5' }}>Build what the evidence can carry.</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>A working record for student founders.</p>
      </div>
      <footer className="gec-book-cover__footer">
        <span>Greater Noida, UP</span>
        <span style={{ color: '#FBCA05' }}>GEC / 26</span>
      </footer>
    </article>
  );

  return {
    cover,
    pages: [page1, page2, page3, page4],
    backCover,
  };
}

export function NewsletterBookshelf({
  items = defaultNewsletterBooks,
  className,
  onSelect,
  activeId,
}: NewsletterBookshelfProps) {
  const books = useMemo(() => (items.length ? items : defaultNewsletterBooks), [items]);
  const [selectedBookId, setSelectedBookId] = useState<string>(activeId || books[0]?.id || '');
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [stageWidth, setStageWidth] = useState(800);
  const shelfScrollRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeId) {
      setSelectedBookId(activeId);
    }
  }, [activeId]);

  useEffect(() => {
    const handleResize = () => {
      if (stageRef.current) {
        setStageWidth(stageRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) || books[0],
    [books, selectedBookId],
  );

  const flippableData = useMemo(() => {
    if (!activeBook) return null;
    return buildDispatchPages(activeBook);
  }, [activeBook]);

  const handleSelect = (book: NewsletterBookshelfItem, index: number) => {
    setSelectedBookId(book.id);
    setIsReaderOpen(true);
    setCurrentSpread(0);
    onSelect?.(book, index);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (shelfScrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      shelfScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Dimensions for DeskFolio
  const pageWidth = Math.min(350, Math.max(160, Math.floor((stageWidth - 48) / 2)));
  const pageHeight = Math.round(pageWidth * 1.38);

  return (
    <div
      ref={stageRef}
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
              onClick={() => setIsReaderOpen(false)}
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
      {/* 2. MAIN STAGE: EITHER BOOKSHELF ROW OR INTERACTIVE FLIPBOOK           */}
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
              const isHovered = hoveredBookId === book.id;
              const isLight = book.color === '#FCF8ED' || book.color === '#F4E2CA' || book.color === '#FFFDF8';
              const foil = book.foil || (isLight ? '#A3040F' : '#FBCA05');
              const spineHeight = 250 + ((index * 7) % 24); // Realistic subtle height variance
              const spineWidth = 46 + ((index * 3) % 10); // Subtle width variance

              return (
                <div
                  key={book.id}
                  className="relative group shrink-0 flex flex-col items-center select-none"
                  onMouseEnter={() => setHoveredBookId(book.id)}
                  onMouseLeave={() => setHoveredBookId(null)}
                  onClick={() => handleSelect(book, index)}
                >
                  {/* Floating Tooltip On Hover */}
                  {isHovered && (
                    <div className="absolute -top-16 z-30 pointer-events-none rounded-lg bg-[#222222] text-white px-3 py-1.5 text-center shadow-xl border border-[rgba(163,4,15,0.3)] whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
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

                  {/* Physical 3D Book Spine */}
                  <div
                    style={{
                      height: `${spineHeight}px`,
                      width: `${spineWidth}px`,
                      backgroundColor: book.color || '#A3040F',
                      transform: isHovered ? 'translateY(-22px) scale(1.03)' : isSelected ? 'translateY(-10px)' : 'translateY(0)',
                      transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
                      boxShadow: isHovered
                        ? '0 24px 28px -6px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.2)'
                        : isSelected
                        ? '0 16px 20px -6px rgba(163,4,15,0.35), inset 0 0 0 2px #FBCA05'
                        : '0 8px 12px -4px rgba(0,0,0,0.25)',
                    }}
                    className="relative rounded-t-sm rounded-b-xs cursor-pointer flex flex-col justify-between items-center py-2.5 px-1 overflow-hidden"
                  >
                    {/* Cylindrical 3D Spine Curvature Lighting */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(255,255,255,0.25) 16%, rgba(255,255,255,0.06) 50%, rgba(0,0,0,0.15) 82%, rgba(0,0,0,0.48) 100%)',
                      }}
                    />

                    {/* Top Headband & Foil Band */}
                    <div className="relative z-10 w-full flex flex-col items-center gap-1">
                      <div className="w-full h-1 bg-white/20 rounded-full" />
                      <div
                        className="w-full h-0.5"
                        style={{ backgroundColor: foil }}
                      />
                      <span
                        className="text-[10px] font-mono font-black mt-1"
                        style={{ color: foil }}
                      >
                        {book.editionNumber || `#${12 - index}`}
                      </span>
                    </div>

                    {/* Vertical Spine Title (Clean English, 180deg vertical) */}
                    <div
                      className="relative z-10 my-auto text-center truncate"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        maxHeight: `${spineHeight - 90}px`,
                      }}
                    >
                      <span
                        className="text-xs font-bold tracking-wider leading-none"
                        style={{
                          color: isLight ? '#222222' : '#FFFDF8',
                          textShadow: isLight ? 'none' : '0 1px 2px rgba(0,0,0,0.6)',
                        }}
                      >
                        {book.title}
                      </span>
                    </div>

                    {/* Bottom Headband & Foil Emblem */}
                    <div className="relative z-10 w-full flex flex-col items-center gap-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full border flex items-center justify-center text-[7px] font-bold font-mono"
                        style={{ borderColor: foil, color: foil }}
                      >
                        G
                      </div>
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
        /* MODE B: INTERACTIVE FLIPPABLE BOOK READER (DESKFOLIO 3D CSS)       */
        /* ------------------------------------------------------------------- */
        <div className="relative pt-6 pb-8 px-4 bg-gradient-to-b from-[#FAF6EC] to-[#F4E8D3] min-h-[580px] flex flex-col items-center justify-between">
          {/* Reader Sub-Header */}
          <div className="w-full max-w-4xl flex items-center justify-between mb-4 px-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#A3040F] text-white font-mono font-bold text-[11px]">
                {activeBook?.editionNumber || 'EDITION'}
              </span>
              <strong className="text-sm text-[#222222] font-bold">{activeBook?.title}</strong>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#5F5650]">
              <span className="hidden sm:inline">Use arrows &larr; / &rarr; or drag corners to turn</span>
              <span className="px-2 py-0.5 rounded bg-[#FFFDF8] border border-[rgba(163,4,15,0.18)] font-bold text-[#A3040F]">
                {currentSpread === 0 ? 'COVER' : currentSpread >= 3 ? 'BACK COVER' : `SPREAD ${currentSpread} / 2`}
              </span>
            </div>
          </div>

          {/* Flippable 3D DeskFolio Book Stage */}
          <div className="w-full flex items-center justify-center py-4 overflow-visible">
            {flippableData && (
              <DeskFolio
                cover={flippableData.cover}
                pages={flippableData.pages}
                backCover={flippableData.backCover}
                pageWidth={pageWidth}
                pageHeight={pageHeight}
                onTurn={(spread) => setCurrentSpread(spread)}
                className="gec-newsletter-deskfolio shadow-2xl"
              />
            )}
          </div>

          {/* Bottom Shelf Mini-Switcher Row */}
          <div className="w-full max-w-4xl mt-6 pt-4 border-t border-[rgba(163,4,15,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#5F5650] flex items-center gap-2">
              <span className="font-bold text-[#222222]">Switch Volume:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-md no-scrollbar py-1">
                {books.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBookId(b.id);
                      setCurrentSpread(0);
                      onSelect?.(b, books.indexOf(b));
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                      selectedBookId === b.id
                        ? 'bg-[#A3040F] text-white'
                        : 'bg-[#FFFDF8] hover:bg-[#F4E2CA] text-[#5F5650] border border-[rgba(163,4,15,0.15)]'
                    }`}
                  >
                    {b.editionNumber || b.id.replace('dispatch-', '#')}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsReaderOpen(false)}
              className="h-9 px-4 text-xs font-bold text-[#222222] hover:text-[#A3040F] bg-[#FFFDF8] hover:bg-white border border-[rgba(163,4,15,0.22)] rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>&larr; Return to Shelf Overview</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
