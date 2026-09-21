'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  NewsletterBookshelf,
  type NewsletterBookshelfItem,
} from '@/components/ui/newsletter-bookshelf';

export interface GecDispatchItem extends NewsletterBookshelfItem {
  category: 'Incubation & Grants' | 'Conclave & E-Summit' | 'Founders & Cap Tables' | 'Hardware & DeepTech';
  readTime: string;
  tags: string[];
  takeaways: string[];
  editionNumber: string;
  executiveSummary: string;
}

export const GEC_DISPATCH_ARCHIVE: GecDispatchItem[] = [
  {
    id: 'dispatch-12',
    editionNumber: '#12',
    title: 'Dorm Room to Term Sheet',
    date: 'MAY 28, 2026',
    category: 'Founders & Cap Tables',
    readTime: '8 min read',
    color: '#A3040F', // GEC Crimson
    foil: '#FBCA05', // GEC Gold
    subtitle: 'How 4 Galgotias undergrads closed a ₹1.2Cr pre-seed round while balancing end-term labs.',
    executiveSummary: 'An unvarnished teardown of the 14-week fundraising journey: outreach conversion metrics across 32 angel syndicates, balancing academic credit caps with term-sheet diligence, and structured cap table hygiene.',
    tags: ['Pre-Seed', 'Fundraising', 'Student Cap Tables'],
    takeaways: [
      'Cold outreach conversion: 4.8% reply rate on generic decks vs 42% when leading with customer pilot retention numbers.',
      'How to structure academic leave and lab access agreements before institutional due diligence begins.',
      'Avoiding dirty liquidation preferences and early advisory equity traps on campus ventures.',
    ],
    href: '#apply',
  },
  {
    id: 'dispatch-11',
    editionNumber: '#11',
    title: 'The ₹5L Prototype Corpus',
    date: 'MAY 14, 2026',
    category: 'Incubation & Grants',
    readTime: '6 min read',
    color: '#222222', // GEC Charcoal
    foil: '#FBCA05', // GEC Gold
    subtitle: 'Non-dilutive milestone tranches, vendor invoices, and de-risking Day 0 hardware experiments.',
    executiveSummary: 'A practical deployment guide for the GEC prototype grant: structuring three milestone tranches, clearing vendor audit requirements, and using non-dilutive capital to buy critical proof.',
    tags: ['Grants', 'Non-Dilutive', 'MVP Validation'],
    takeaways: [
      'Milestone structuring: Tranche 1 (Bill of Materials), Tranche 2 (Bench Testing), Tranche 3 (10 Pilot Users).',
      'How non-dilutive capital prevents unnecessary pre-seed dilution of 15-25%.',
      'The single biggest reason grants stall: lack of auditable customer acceptance criteria.',
    ],
    href: '#apply',
  },
  {
    id: 'dispatch-10',
    editionNumber: '#10',
    title: "E-Summit '26 Conclave Blueprint",
    date: 'APR 30, 2026',
    category: 'Conclave & E-Summit',
    readTime: '11 min read',
    color: '#1F7EC0', // GEC Ecosystem Blue
    foil: '#FFFDF8', // GEC Ivory
    subtitle: "Behind the scenes of North India's premier student entrepreneurship conclave uniting 5,000+ delegates.",
    executiveSummary: 'The operational blueprint behind Northern India’s largest campus venture conclave: multi-track curation across AI, climate tech, and student syndicates, plus the real numbers behind the 24-hour BuildSprint.',
    tags: ['E-Summit', 'Conclave', 'Ecosystem'],
    takeaways: [
      'Pitch Arena anatomy: 50 shortlisted startups, 25 institutional operators, and a ₹12L cash grant pool.',
      'BuildSprint track mechanics: moving from problem brief to working hardware prototype in 24 continuous hours.',
      'Converting conclave momentum into sustained monthly cohort office hours.',
    ],
    href: '#apply',
  },
  {
    id: 'dispatch-09',
    editionNumber: '#09',
    title: 'Campus Hardware & Maker Labs',
    date: 'APR 16, 2026',
    category: 'Hardware & DeepTech',
    readTime: '7 min read',
    color: '#7B020B', // GEC Deep Burgundy
    foil: '#FBCA05', // GEC Gold
    subtitle: 'Rapid PCB prototyping, IoT telemetry benches, and mechanical CNC fabrication on university grounds.',
    executiveSummary: 'An inventory and operating manual for GEC hardware fellows: reserving high-speed solder stations, accessing component lockers, and safely navigating campus fabrication facilities.',
    tags: ['Hardware', 'Maker Lab', 'IoT Prototyping'],
    takeaways: [
      'Turnaround times: same-day PCB etching vs 4-day external courier cycles.',
      'Component library inventory: 1,200+ pre-stocked microcontrollers, sensors, and power modules for fellows.',
      'Thermal and FCC compliance testing before field pilot deployments.',
    ],
    href: '#apply',
  },
  {
    id: 'dispatch-08',
    editionNumber: '#08',
    title: 'Student Cap Tables & Angel Rounds',
    date: 'APR 02, 2026',
    category: 'Founders & Cap Tables',
    readTime: '9 min read',
    color: '#F4E2CA', // GEC Soft Sand
    foil: '#A3040F', // GEC Crimson
    subtitle: 'Founder vesting schedules, option pools, and avoiding toxic early-stage dilution traps.',
    executiveSummary: 'Why 4-year vesting with a 1-year cliff is non-negotiable for student co-founders, how to model an unallocated ESOP pool, and navigating university faculty co-founder designations.',
    tags: ['Cap Table', 'Legal & Tax', 'Founder Equity'],
    takeaways: [
      'Never allocate static equity on day zero: standard 4-year vesting protects against mid-semester departures.',
      'The 10-15% unallocated option pool: why angels demand it before issuing term sheets.',
      'Handling IP assignment deeds cleanly between student inventors and newly incorporated private limiteds.',
    ],
    href: '#apply',
  },
  {
    id: 'dispatch-07',
    editionNumber: '#07',
    title: 'De-risking Day 0 Hypotheses',
    date: 'MAR 19, 2026',
    category: 'Incubation & Grants',
    readTime: '5 min read',
    color: '#145582', // GEC Slate Blue
    foil: '#FBCA05', // GEC Gold
    subtitle: 'The sharp difference between polite campus applause and genuine customer economic sacrifice.',
    executiveSummary: 'A tactical framework for testing whether anyone actually wants what you are building: fake doors, pre-order token deposits, and why user interviews fail when you pitch instead of listen.',
    tags: ['Customer Discovery', 'Validation', 'Product-Market Fit'],
    takeaways: [
      'The Mom Test applied to university ventures: asking about past behavior rather than hypothetical future interest.',
      'Fake door experiments: setting up a one-page landing page with a pre-order button before writing backend code.',
      'Ten obsessive users beat a hundred lukewarm signups every single time.',
    ],
    href: '#apply',
  },
  {
    id: 'dispatch-06',
    editionNumber: '#06',
    title: 'DeepTech Patenting & University IP',
    date: 'MAR 05, 2026',
    category: 'Hardware & DeepTech',
    readTime: '10 min read',
    color: '#C89E04', // GEC Ochre Gold
    foil: '#222222', // GEC Charcoal
    subtitle: 'Navigating university assignment deeds, provisional patent filings, and technology transfer.',
    executiveSummary: 'A complete primer on protecting research intellectual property without surrendering startup agility: university technology transfer offices, patent prior-art searches, and global PCT filing windows.',
    tags: ['Patents', 'University IP', 'DeepTech'],
    takeaways: [
      'Provisional patent filing gives a 12-month priority window to seek venture funding before public disclosure.',
      'Negotiating institutional equity royalty caps (typically 2-4%) in lieu of cash patent licensing fees.',
      'Publishing academic papers after filing patent claims, not before.',
    ],
    href: '#apply',
  },
  {
    id: 'dispatch-05',
    editionNumber: '#05',
    title: 'Micro-SaaS Runway & Cloud Credits',
    date: 'FEB 19, 2026',
    category: 'Incubation & Grants',
    readTime: '6 min read',
    color: '#2D2B29', // GEC Warm Charcoal
    foil: '#FBCA05', // GEC Gold
    subtitle: 'Maximizing AWS, GCP, and OpenAI credits to achieve cash-flow breakeven before Series A.',
    executiveSummary: 'How to stack startup credits effectively across cloud, authentication, monitoring, and AI inference providers to extend runway by 18+ months without raising institutional capital.',
    tags: ['Cloud Runway', 'Bootstrapping', 'Unit Economics'],
    takeaways: [
      'Staging cloud programs: claim credits in sequence (AWS Activate Portfolio → GCP Startup → Azure Founders Hub).',
      'Containerizing infrastructure early so migration between credit grants is painless.',
      'Tracking net unit cost per query/transaction from Day 1 to avoid deceptive margin cliffs.',
    ],
    href: '#apply',
  },
  {
    id: 'dispatch-04',
    editionNumber: '#04',
    title: 'The Pre-Seed Syndicate Memo',
    date: 'FEB 05, 2026',
    category: 'Founders & Cap Tables',
    readTime: '8 min read',
    color: '#A3040F', // GEC Crimson
    foil: '#FFFDF8', // GEC Ivory
    subtitle: 'What angel syndicates actually look for when evaluating student-led venture dossiers.',
    executiveSummary: 'An inside look at the scoring matrix used by institutional angel networks: founder velocity, distribution asymmetries, technical depth, and signs of unfair campus market advantages.',
    tags: ['Angel Network', 'Syndicates', 'Dealflow'],
    takeaways: [
      'Angel networks value execution velocity over static pedigree: shipping updates every 14 days proves agency.',
      'The unfair campus distribution moat: why student founders have unique zero-CAC advantages.',
      'Red flags: part-time founder commitments, unclear IP splits, and lack of customer access.',
    ],
    href: '#apply',
  },
  {
    id: 'dispatch-03',
    editionNumber: '#03',
    title: 'Customer Discovery in the Wild',
    date: 'JAN 22, 2026',
    category: 'Incubation & Grants',
    readTime: '7 min read',
    color: '#FCF8ED', // GEC Ivory Canvas
    foil: '#A3040F', // GEC Crimson
    subtitle: 'Conducting 50 industrial interviews across Greater Noida without pitching solutions.',
    executiveSummary: 'Field notes from 3 student teams visiting manufacturing units, logistics hubs, and clinic networks to map unaddressed operational pain points before writing a single line of software.',
    tags: ['Interviews', 'Field Notes', 'Discovery'],
    takeaways: [
      'Never start an interview by pitching your idea; ask them how they solved the problem yesterday.',
      'Look for homegrown Excel sheets and WhatsApp workarounds: that is where real software demand hides.',
      'Securing signed Letters of Intent (LOIs) before product build.',
    ],
    href: '#apply',
  },
  {
    id: 'dispatch-02',
    editionNumber: '#02',
    title: 'Building the First 100 User Test',
    date: 'JAN 08, 2026',
    category: 'Conclave & E-Summit',
    readTime: '6 min read',
    color: '#2A8DD4', // GEC Tech Blue
    foil: '#FFFDF8', // GEC Ivory
    subtitle: 'Campus distribution flywheels, localized ambassador loops, and private beta telemetry.',
    executiveSummary: 'Strategies for leveraging 30,000+ on-campus students as a fertile initial test ground: peer referral incentives, classroom demos, feedback channels, and actionable cohorts.',
    tags: ['Distribution', 'Beta Testing', 'Campus Flywheel'],
    takeaways: [
      'High-touch onboarding: setting up the product in person with the first 50 users.',
      'Creating private feedback loops via closed Telegram/Discord channels.',
      'Distinguishing between campus-specific viral spikes and durable, repeatable retention.',
    ],
    href: '#apply',
  },
  {
    id: 'dispatch-01',
    editionNumber: '#01',
    title: 'Genesis of Galgotias E-Cell',
    date: 'DEC 18, 2025',
    category: 'Conclave & E-Summit',
    readTime: '12 min read',
    color: '#8C0C16', // GEC Crimson Shade
    foil: '#FBCA05', // GEC Gold
    subtitle: 'The founding charter, operational ethos, and vision for North India’s entrepreneurial core.',
    executiveSummary: 'The founding manifesto of GEC: bridging the gap between student ambition and tier-one venture capital, providing non-dilutive capital, and building a culture of relentless maker momentum.',
    tags: ['Charter', 'Manifesto', 'Origins'],
    takeaways: [
      'Our fundamental premise: dorm rooms produce generational companies when backed with conviction.',
      'The three institutional pillars: Incubation Studio, E-Summit, and Venture Capital Network.',
      'The unwritten rule of GEC: builders back builders.',
    ],
    href: '#apply',
  },
];

const CATEGORIES = [
  'All Dispatches',
  'Incubation & Grants',
  'Conclave & E-Summit',
  'Founders & Cap Tables',
  'Hardware & DeepTech',
] as const;

export function NewsletterSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Dispatches');
  const [selectedDispatch, setSelectedDispatch] = useState<GecDispatchItem | null>(GEC_DISPATCH_ARCHIVE[0] || null);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter items by category
  const filteredBooks = useMemo(() => {
    if (selectedCategory === 'All Dispatches') {
      return GEC_DISPATCH_ARCHIVE;
    }
    return GEC_DISPATCH_ARCHIVE.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleSelectBook = (item: NewsletterBookshelfItem) => {
    const fullItem = GEC_DISPATCH_ARCHIVE.find((d) => d.id === item.id);
    if (fullItem) {
      setSelectedDispatch(fullItem);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscribeStatus('error');
      return;
    }
    setSubscribeStatus('loading');
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
    }, 800);
  };

  const handleCopyLink = (dispatch: GecDispatchItem) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/#newsletter?edition=${dispatch.id}`;
      navigator.clipboard?.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    }
  };

  return (
    <section
      id="newsletter"
      className="relative py-20 md:py-28 bg-[#FCF8ED] border-b border-[rgba(163,4,15,0.16)] overflow-hidden"
    >
      {/* Warm Ambient Texture Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-radial from-[#FBCA05]/10 via-[#A3040F]/5 to-transparent rounded-full blur-3xl pointer-events-none -mt-32" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-radial from-[#1F7EC0]/8 to-transparent rounded-full blur-3xl pointer-events-none -mr-40 -mb-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* ===================================================================== */}
        {/* SECTION HEADER: Editorial Title, Eyebrow, and Interactivity Cue        */}
        {/* ===================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(163,4,15,0.15)]">
          <div className="space-y-3 max-w-3xl">
            {/* Eyebrow Stamp */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[rgba(163,4,15,0.22)] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#A3040F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#A3040F]">
                GEC Archives &middot; Quarterly Dispatch
              </span>
              <span className="text-xs font-mono text-[#5F5650] border-l border-[rgba(163,4,15,0.2)] pl-2">
                Vol. IV &middot; 2026 Edition
              </span>
            </div>

            {/* Main Section Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#222222] tracking-tight leading-[1.1]">
              The GEC Dispatch &amp;{' '}
              <span className="text-[#A3040F] underline decoration-[rgba(163,4,15,0.3)] decoration-wavy">
                Founder Chronicles
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#5F5650] leading-relaxed max-w-2xl">
              An interactive WebGL cloth-bound bookshelf archiving our student venture deep-dives, seed grant blueprints, cap table field notes, and operator playbooks.
            </p>
          </div>

          {/* Interactive Hint Badge */}
          <div className="shrink-0 flex items-center gap-3 bg-[#FFFDF8] border border-[rgba(163,4,15,0.18)] rounded-xl px-4 py-3 shadow-2xs max-w-xs">
            <div className="w-8 h-8 rounded-lg bg-[#A3040F]/10 flex items-center justify-center text-[#A3040F] shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10M6 10h10" />
              </svg>
            </div>
            <div className="text-xs text-[#5F5650] leading-snug">
              <strong className="text-[#222222] font-semibold block">Tactile 3D Shelf</strong>
              Drag horizontally to slide. Click any book to orbit cover in 3D.
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* CATEGORY FILTER CHIPS                                                 */}
        {/* ===================================================================== */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#A3040F] text-white shadow-xs'
                    : 'bg-[#FFFDF8] text-[#5F5650] hover:text-[#222222] hover:bg-[#F4E2CA]/50 border border-[rgba(163,4,15,0.16)]'
                }`}
              >
                {cat}
                {cat === 'All Dispatches' ? ` (${GEC_DISPATCH_ARCHIVE.length})` : ''}
              </button>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* 3D BOOKSHELF STAGE                                                    */}
        {/* ===================================================================== */}
        <div className="w-full">
          <NewsletterBookshelf
            items={filteredBooks}
            brand="GEC DISPATCH"
            onSelect={handleSelectBook}
          />
        </div>

        {/* ===================================================================== */}
        {/* ASYMMETRIC INSPECTION DOCK & NEWSLETTER SUBSCRIPTION FORM             */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Selected Dispatch Inspector */}
          <div className="lg:col-span-7 bg-[#FFFDF8] border border-[rgba(163,4,15,0.18)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 select-none" onCopy={(e) => e.preventDefault()}>
            {selectedDispatch ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[rgba(163,4,15,0.12)]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#A3040F] text-white font-mono font-bold text-xs">
                      {selectedDispatch.editionNumber}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#A3040F]">
                      {selectedDispatch.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#5F5650]">
                    <span>{selectedDispatch.date}</span>
                    <span>&middot;</span>
                    <span className="text-[#1F7EC0] font-semibold">{selectedDispatch.readTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
                    {selectedDispatch.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#5F5650] leading-relaxed">
                    {selectedDispatch.subtitle}
                  </p>
                </div>

                {/* Executive Summary Block */}
                <div className="p-4 rounded-xl bg-[#FCF8ED] border border-[rgba(163,4,15,0.12)] space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A3040F] font-mono">
                    Executive Summary
                  </span>
                  <p className="text-xs sm:text-sm text-[#222222] leading-relaxed">
                    {selectedDispatch.executiveSummary}
                  </p>
                </div>

                {/* Key Insights List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5F5650] font-mono">
                    Key Operator Insights Covered
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedDispatch.takeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#222222]">
                        <span className="w-5 h-5 rounded-full bg-[#FBCA05]/30 text-[#A3040F] font-bold font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags & Action Row */}
                <div className="pt-4 border-t border-[rgba(163,4,15,0.12)] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedDispatch.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#F4E2CA]/50 text-[#5F5650] border border-[rgba(163,4,15,0.1)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleCopyLink(selectedDispatch)}
                      className="h-10 px-3.5 text-xs font-semibold text-[#5F5650] hover:text-[#A3040F] bg-[#FFFDF8] hover:bg-white border border-[rgba(163,4,15,0.2)] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      <span>{copiedLink ? 'Link Copied!' : 'Share Brief'}</span>
                    </button>

                    <Link
                      href="#apply"
                      className="h-10 px-5 text-xs font-bold text-white bg-[#A3040F] hover:bg-[#C62F29] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Request Full Brief</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-[#5F5650]">
                Select any book on the shelf above to view its contents.
              </div>
            )}
          </div>

          {/* Right 5 Columns: Publication Subscribe Box */}
          <div className="lg:col-span-5 bg-[#FFFDF8] border border-[rgba(163,4,15,0.18)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FBCA05]/20 text-[#222222] font-mono text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A3040F]" />
                MONTHLY FOUNDER DISPATCH
              </div>
              <h3 className="text-2xl font-extrabold text-[#222222] tracking-tight">
                Subscribe to GEC Intelligence
              </h3>
              <p className="text-sm text-[#5F5650] leading-relaxed">
                Raw venture data, seed grant application windows, angel term-sheet breakdowns, and confidential operator clinics sent directly to your inbox.
              </p>
            </div>

            {/* Subscriber Metrics Strip */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#FCF8ED] border border-[rgba(163,4,15,0.12)]">
              <div>
                <div className="text-2xl font-extrabold text-[#222222]">4,200+</div>
                <div className="text-[11px] font-semibold text-[#5F5650] uppercase tracking-wider mt-0.5">
                  Subscribed Founders
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#A3040F]">1st of Month</div>
                <div className="text-[11px] font-semibold text-[#5F5650] uppercase tracking-wider mt-0.5">
                  Editorial Cadence
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <label htmlFor="newsletter-email" className="block text-xs font-bold uppercase tracking-wider text-[#222222] mb-1.5">
                  Your Student / Work Email
                </label>
                <div className="relative">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (subscribeStatus === 'error') setSubscribeStatus('idle');
                    }}
                    placeholder="founder@galgotiasuniversity.edu.in"
                    className="w-full h-11 px-4 bg-[#FCF8ED] border border-[rgba(34,34,34,0.25)] focus:border-[#A3040F] focus:outline-2 focus:outline-[#A3040F] rounded-lg text-sm text-[#222222] placeholder:text-[#5F5650]/60 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                className="w-full h-11 bg-[#A3040F] hover:bg-[#C62F29] text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-98"
              >
                {subscribeStatus === 'loading' ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : subscribeStatus === 'success' ? (
                  <>
                    <svg className="w-4 h-4 text-[#FBCA05]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Subscribed to GEC Dispatch!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe to Archives</span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>

              {subscribeStatus === 'error' && (
                <p className="text-xs text-[#A3040F] font-semibold">
                  Please enter a valid email address to subscribe.
                </p>
              )}

              {subscribeStatus === 'success' && (
                <p className="text-xs text-[#1F7EC0] font-semibold">
                  Welcome to the GEC community. Check your inbox on the 1st of next month!
                </p>
              )}
            </form>

            {/* Privacy & Anti-Spam Guarantee */}
            <div className="pt-2 flex items-center gap-2 text-xs text-[#5F5650]">
              <svg className="w-3.5 h-3.5 text-[#1F7EC0] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Zero marketing spam. One-click unsubscribe anytime. Curated strictly for founders.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
