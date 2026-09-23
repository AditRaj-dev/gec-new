'use client';

import {
  NewsletterBookshelf,
  type NewsletterBookshelfItem,
  defaultNewsletterBooks,
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
    href: '#apply',
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
    href: '#apply',
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
    executiveSummary: "The operational blueprint behind Northern India's largest campus venture conclave: multi-track curation across AI, climate tech, and student syndicates, plus the real numbers behind the 24-hour BuildSprint.",
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
    href: '#apply',
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
    href: '#apply',
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
    href: '#apply',
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
    href: '#apply',
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
    href: '#apply',
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
    href: '#apply',
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
    href: '#apply',
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
    href: '#apply',
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
    subtitle: "The founding charter, operational ethos, and vision for North India's entrepreneurial core.",
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

export { defaultNewsletterBooks };

export function NewsletterSection() {
  return (
    <NewsletterBookshelf
      items={GEC_DISPATCH_ARCHIVE}
      brand="GEC DISPATCH"
    />
  );
}
