export interface HeroCampaign {
  id: string;
  /** `id="hero-status-tag"` text + its `status-badge` modifier class. */
  badgeText: string;
  badgeClass: 'badge-crimson' | 'badge-gold' | 'badge-blue' | 'badge-outline';
  /** `id="hero-priority-chip"` — always rendered with the fixed `badge-outline` class. */
  priorityTag: string;
  /** `id="hero-headline"` — two lines; only the first line's colour changes per campaign. */
  headlineAccent: string;
  headlineLine1: string;
  headlineLine2: string;
  /** `id="hero-subline"` */
  subline: string;
  /** `id="hero-deadline-text"` */
  deadline: string;
  /** `id="hero-context"` */
  context: string;
  /** `id="hero-primary-cta"` */
  primaryCtaText: string;
  primaryCtaHref: string;
  /** `id="hero-secondary-cta"` */
  secondaryCtaText: string;
  secondaryCtaHref: string;
  /** `id="hero-media-title"` */
  mediaTitle: string;
  /** `id="hero-media-subtitle"` */
  mediaSubtitle: string;
  /** Featured card ("ticket") content: head-band chip, lead stat, three metrics, footer deadline + CTA. */
  card: {
    chip: string;
    lead: { value: string; label: string };
    metrics: { label: string; value: string }[];
    closes: string;
    ctaText: string;
    ctaHref: string;
  };
}

// Field-by-field diff against styled.html's `switchHeroCampaign` data (script
// block 4366–5133). The wireframe kept the featured card's chip, metrics and
// CTA fixed at SDP values; here `card` makes them follow the active campaign
// too (sdp's `card` is the wireframe's static content). `sdp` is the default campaign, so its fields match the
// wireframe's static hero markup (2340–2481) verbatim rather than the JS
// simulator data, which is itself only reachable by clicking a sim button.
export const HERO_CAMPAIGNS: Record<string, HeroCampaign> = {
  sdp: {
    id: 'sdp',
    badgeText: 'APPLICATIONS OPEN · COHORT 04',
    badgeClass: 'badge-crimson',
    priorityTag: 'P1 FLAGSHIP INITIATIVE',
    headlineAccent: 'var(--gec-crimson)',
    headlineLine1: 'IDEAS BEGIN HERE.',
    headlineLine2: 'BUILDERS GROW HERE.',
    subline: 'Innovate. Inspire. Impact.',
    deadline: 'Applications close 28 September · 23:59 IST',
    context:
      'Galgotias Entrepreneurship Cell is a student-driven entrepreneurial community where ideas are explored, skills are built, and aspiring founders find the people, opportunities, and support needed to take their next step.',
    primaryCtaText: 'Explore Initiatives →',
    primaryCtaHref: '/initiatives',
    secondaryCtaText: 'Discover GEC',
    secondaryCtaHref: '/about',
    mediaTitle: 'STARTUP DEVELOPMENT PROGRAM 2026',
    mediaSubtitle:
      'A 12-week venture acceleration sprint providing dedicated student founder cohorts with faculty mentors, prototyping sandbox access, and pre-seed demo slots.',
    card: {
      chip: 'COHORT 04',
      lead: { value: '₹50L', label: 'Grant sandbox pool' },
      metrics: [
        { label: 'Duration', value: '12 Weeks' },
        { label: 'Mentorship', value: '1-on-1 Access' },
        { label: 'Incubation', value: 'GICRISE Fast-Track' },
      ],
      closes: 'Closes 28 Sep · 23:59 IST',
      ctaText: 'Apply for Cohort 04 →',
      ctaHref: '/initiatives#apply',
    },
  },
  ideathon: {
    id: 'ideathon',
    badgeText: '48 HOURS LEFT · FINAL WINDOW',
    badgeClass: 'badge-gold',
    priorityTag: 'P0 CRITICAL INSTITUTIONAL WINDOW',
    headlineAccent: '#b45309',
    headlineLine1: 'IDEATHON 2026',
    headlineLine2: 'VENTURE SPRINT',
    subline: '48 hours to pitch, prototype, and defend your venture.',
    deadline: 'Strict Deadline: Closes in 48 Hours · 14 Team Slots Left',
    context:
      'Greater Noida’s premier 48-hour student venture sprint. Fast-track entry for teams building AI, climate-tech, consumer hardware, and fintech solutions.',
    primaryCtaText: 'Register Team (Final Call) →',
    primaryCtaHref: '/initiatives#ideathon-register',
    secondaryCtaText: 'View Problem Statements',
    secondaryCtaHref: '/initiatives#ideathon',
    mediaTitle: 'IDEATHON 2026 VENTURE SPRINT',
    mediaSubtitle:
      '48 hours of intense hacking, rapid prototyping, and live venture pitches before angel judges.',
    card: {
      chip: 'FINAL WINDOW',
      lead: { value: '48h', label: 'Build window' },
      metrics: [
        { label: 'Team slots', value: '14 Left' },
        { label: 'Tracks', value: 'AI · Climate · HW · Fintech' },
        { label: 'Judging', value: 'Angel Panel' },
      ],
      closes: 'Closes in 48 hours',
      ctaText: 'Register Team →',
      ctaHref: '/initiatives#ideathon-register',
    },
  },
  esummit: {
    id: 'esummit',
    badgeText: 'EVENT IS LIVE · MAIN AUDITORIUM',
    badgeClass: 'badge-blue',
    priorityTag: 'P2 MAJOR GROUND EXPERIENCE',
    headlineAccent: 'var(--gec-blue)',
    headlineLine1: 'GALGOTIAS',
    headlineLine2: 'E-SUMMIT 2026',
    subline: '50+ Founders. 12 Keynotes. Live Venture Arena.',
    deadline: 'Happening Today · 09:30 AM – 06:00 PM IST',
    context:
      'The annual flagship entrepreneurship summit is currently underway on ground. Campus screens, live stream broadcasting, and investor pitching are in session.',
    // ponytail: no stream URL yet; swap to 'Watch Live Stream ↗' + the YouTube link once there is one.
    primaryCtaText: 'Event Details →',
    primaryCtaHref: '/initiatives#esummit',
    secondaryCtaText: 'Full Event Schedule',
    secondaryCtaHref: '/initiatives#schedule',
    mediaTitle: 'GALGOTIAS E-SUMMIT 2026',
    mediaSubtitle:
      'The annual flagship entrepreneurship summit bringing founders, investors, and students together.',
    card: {
      chip: 'LIVE NOW',
      lead: { value: '50+', label: 'Founders on stage' },
      metrics: [
        { label: 'Keynotes', value: '12' },
        { label: 'Venue', value: 'Main Auditorium' },
        { label: 'Hours', value: '09:30 – 18:00 IST' },
      ],
      closes: 'Happening today',
      ctaText: 'See Today’s Schedule →',
      ctaHref: '/initiatives#schedule',
    },
  },
  evergreen: {
    id: 'evergreen',
    badgeText: 'GALGOTIAS ENTREPRENEURSHIP CELL',
    badgeClass: 'badge-outline',
    priorityTag: 'EVERGREEN BRAND BASELINE',
    headlineAccent: 'var(--gec-crimson)',
    headlineLine1: 'IDEAS BEGIN HERE.',
    headlineLine2: 'BUILDERS GROW HERE.',
    subline: 'Innovate. Inspire. Impact.',
    deadline: 'Always Active · Student Community & Venture Ecosystem',
    context:
      'Galgotias Entrepreneurship Cell is a student-driven entrepreneurial community where ideas are explored, skills are built, and aspiring founders find the people, opportunities, and support needed to take their next step.',
    primaryCtaText: 'Explore Initiatives →',
    primaryCtaHref: '/initiatives',
    secondaryCtaText: 'Discover GEC',
    secondaryCtaHref: '/about',
    mediaTitle: 'STUDENT-DRIVEN LAUNCHPAD',
    mediaSubtitle:
      'Connecting ambitious students with knowledge, mentorship, and the startup ecosystem.',
    card: {
      chip: 'ALWAYS OPEN',
      lead: { value: '7', label: 'Teams to join' },
      metrics: [
        { label: 'Community', value: 'Student-Led' },
        { label: 'Mentorship', value: 'Founders & Faculty' },
        { label: 'Incubation', value: 'GICRISE' },
      ],
      closes: 'Always active',
      ctaText: 'Explore Initiatives →',
      ctaHref: '/initiatives',
    },
  },
};

export const HAPPENINGS_DATA = [
  {
    type: 'UPCOMING EVENT',
    date: 'APRIL 14, 2026',
    title: 'Galgotias E-Summit 2026: The Builder Arena',
    description:
      'Greater Noida’s premier student entrepreneurship summit featuring 50+ founders, live demo rounds, and venture angel mixers across Campus Hub.',
    details: [
      { label: 'Venue', value: 'Main Auditorium 01' },
      { label: 'Timing', value: '10:00 AM – 6:00 PM' },
      { label: 'Capacity', value: '480 Seats' },
      { label: 'Access', value: 'Admissions Free for Students' },
    ],
    actionText: 'View Event Details →',
    actionHref: '/initiatives#esummit',
  },
  {
    type: 'APPLICATIONS OPEN',
    date: 'COHORT 04',
    title: 'Startup Development Program (SDP)',
    description:
      'Structured 12-week venture acceleration sprint providing dedicated student founder cohorts with faculty mentors and pre-seed demo slots.',
    details: [
      { label: 'Category', value: 'Pre-Seed Cohort' },
      { label: 'Intake', value: '12 Teams Selected' },
      { label: 'Grant', value: 'Prototyping Sandbox' },
    ],
    actionText: 'Apply Now →',
    actionHref: '/initiatives#apply',
  },
  {
    type: 'LATEST STORY',
    date: 'FOUNDER DISPATCH',
    title: 'From Garage to Seed Round: FarmVision AI',
    description:
      'Meet the Galgotias student builders turning aerial computer vision into funded agritech ventures deployed across regional farms.',
    details: [
      { label: 'Author', value: 'Aman Sharma' },
      { label: 'Company', value: 'FarmVision AI' },
      { label: 'Milestone', value: '₹25L Seed Grant' },
    ],
    actionText: 'Read Story →',
    actionHref: '/stories#farmvision-ai',
  },
];

export const INITIATIVES_DATA = [
  {
    number: '01',
    title: 'Startup Development Program',
    status: 'APPLICATIONS OPEN',
    description:
      'A structured 12-week venture sprint taking student ideas from customer discovery to investor-ready prototypes and pilot deployments.',
    link: '/initiatives',
  },
  {
    number: '02',
    title: 'Pitching Sessions & Shark Arena',
    status: 'MONTHLY COHORTS',
    description:
      'Closed-door live demo stages where campus founders pitch directly before seasoned angel investors, venture capitalists, and ecosystem mentors.',
    link: '/initiatives',
  },
  {
    number: '03',
    title: 'Founder Workshops & Masterclasses',
    status: 'ONGOING SERIES',
    description:
      'Practical operator masterclasses on unit economics, tech stacks, term-sheet negotiations, customer validation, and legal compliance.',
    link: '/initiatives',
  },
];

export const IMPACT_METRICS = [
  { value: '35+', label: 'Events & Experiences', sublabel: 'Summits, Hackathons & Mixers' },
  { value: '12,000+', label: 'Students Engaged', sublabel: 'Campus-Wide Ecosystem Reach' },
  { value: '45+', label: 'Startups Supported', sublabel: 'Incubated & Mentored Ventures' },
  { value: '28+', label: 'Speakers & Mentors', sublabel: 'Unicorn Founders & Industry VCs' },
];

export const IMPACT_COMPETENCIES = [
  'Leadership',
  'Communication',
  'Teamwork',
  'Ideation',
  'Problem Solving',
  'Execution',
];

export const SPOTLIGHT_TIMELINE = [
  {
    year: 'YEAR 2023',
    badge: 'SUMMIT 2023',
    location: 'CAMPUS HUB',
    title: 'Foundation Summit & Live Pitch Arena',
    description:
      'The historic inauguration of GEC’s campus incubator network, connecting 400+ student innovators with initial angel mentors.',
  },
  {
    year: 'YEAR 2024',
    badge: 'E-SUMMIT 2024',
    location: 'AUDITORIUM 01',
    title: 'Galgotias E-Summit Scaling to 1,500+',
    description:
      'Keynotes by unicorn founders, live venture pitch rounds, and regional collegiate participation across NCR.',
  },
  {
    year: 'YEAR 2025',
    badge: 'GICRISE ALLIANCE',
    location: 'INSTITUTIONAL',
    title: 'GICRISE Incubation Alliance & Grant Fund',
    description:
      'Formal partnership with Galgotias Incubation Centre establishing the ₹50L student prototype grant pipeline.',
  },
];

export const STORIES_DATA = [
  {
    tag: 'FOUNDER STORY',
    kicker: 'FROM IDEA TO FIRST REAL STEP',
    title: 'Overcoming the Cold Start in Student Ventures',
    excerpt:
      'How two Galgotias engineering students built an AI workflow tool and secured their first 50 paying customers on campus.',
    href: '/stories',
  },
  {
    tag: 'STARTUP STORY',
    kicker: 'TAKING SHAPE IN OUR ECOSYSTEM',
    title: 'Deploying Hardware Prototyping at FarmVision AI',
    excerpt:
      'Iterating multispectral drone cameras with local farmers across Uttar Pradesh to reduce pesticide overhead by 34%.',
    href: '/stories',
  },
  {
    tag: 'COMMUNITY MILESTONE',
    kicker: 'FROM GEC',
    title: 'Galgotias Delegations Win Top Honors at National E-Summit',
    excerpt:
      'Three student teams represented Galgotias University, securing top podium finishes in venture design and business case challenges.',
    href: '/stories',
  },
];

export const SPEAKERS_DATA = [
  {
    initials: 'AG',
    name: 'Ashneer Grover',
    role: 'Co-Founder',
    company: 'BharatPe',
    bio: 'Fintech pioneer and angel investor known for straightforward guidance on venture economics.',
  },
  {
    initials: 'AG',
    name: 'Aman Gupta',
    role: 'Co-Founder & CMO',
    company: 'boAt Lifestyle',
    bio: 'Consumer electronics trailblazer championing brand storytelling and product positioning.',
  },
  {
    initials: 'SJ',
    name: 'Sandeep Jain',
    role: 'Founder & CEO',
    company: 'GeeksforGeeks',
    bio: 'Computer science educator and entrepreneur who scaled India’s largest coding portal.',
  },
  {
    initials: 'SB',
    name: 'Sanjeev Bikhchandani',
    role: 'Founder & Vice Chairman',
    company: 'Info Edge / Naukri.com',
    bio: 'Pioneer of the Indian consumer internet and seasoned patron of student entrepreneurship.',
  },
  {
    initials: 'DS',
    name: 'Debojit Sen',
    role: 'Founder',
    company: 'Crack-ED',
    bio: 'EdTech innovator sharing frameworks on building career resilience and problem-solving.',
  },
];

export const PARTNERS_DATA = [
  { name: 'GICRISE', label: 'Primary Incubation Anchor', note: 'Galgotias Incubation Centre for Research, Innovation, Startup & Entrepreneurs' },
  { name: 'Startup India', label: 'DPIIT Recognized', note: 'National startup ecosystem linkage' },
  { name: 'MSME', label: 'Ministry Host', note: 'Central MSME enterprise incubation' },
  { name: 'IIC GU', label: 'Innovation Council', note: 'Institutional Innovation Council' },
  { name: 'AWS Activate', label: '$10k Cloud Credits', note: 'Infrastructure support program' },
  { name: 'GitHub Campus', label: 'Dev Tools Tier', note: 'Engineering suite for builders' },
  { name: 'Wadhwani', label: 'Curriculum Partner', note: 'Global entrepreneurship foundation' },
];

export const ABOUT_DATA = {
  kicker: 'WHO WE ARE',
  headline: 'We Don’t Just Talk About Entrepreneurship. We Create Space to Experience It.',
  narrative:
    'Galgotias Entrepreneurship Cell is a student-driven community built around innovation, leadership, creativity, and entrepreneurship. Through mentorship, workshops, startup-focused programs, and collaborative experiences, GEC encourages students to turn curiosity into action.',
  origin: {
    kicker: 'ORIGIN & EVOLUTION',
    title: 'From Curiosity to Community.',
    p1: 'GEC exists to bring together students who want to think differently, solve problems, and explore entrepreneurship beyond classrooms.',
    p2: 'The community grows around startup development, pitching sessions, workshops, founder interactions, networking, and practical experiences that allow students to learn entrepreneurship by participating in it.',
    p3: 'GEC works within the wider Galgotias innovation ecosystem alongside the Galgotias Incubation Centre for Research, Innovation, Startup & Entrepreneurs — GICRISE.',
  },
  pipeline: [
    {
      stage: 'STAGE 01',
      title: 'GEC COMMUNITY',
      description: 'Ideation, team formation, hackathons & peer builder cohorts',
    },
    {
      stage: 'STAGE 02',
      title: 'SDP ACCELERATOR',
      description: '12-week intensive prototyping, pitch coaching, and MVP validation',
    },
    {
      stage: 'STAGE 03',
      title: 'GICRISE INCUBATION',
      description: 'Formal seed grant funding, legal incorporation, and angel demo day',
    },
  ],
  mission: {
    kicker: 'OUR MISSION',
    title: 'Create Builders, Not Spectators.',
    text: 'Our mission is to foster an entrepreneurial mindset among students by creating opportunities to ideate, collaborate, experiment, lead, and execute. We aim to connect students with the knowledge, mentorship, and ecosystem required to move from curiosity toward meaningful action.',
  },
  vision: {
    kicker: 'OUR VISION',
    title: 'A Campus Where Ideas Have Somewhere to Go.',
    text: 'Our vision is to build a thriving student entrepreneurship ecosystem where ambitious ideas can find collaborators, guidance, opportunities, and a pathway toward becoming impactful ventures. Transforming campus talent into fearless problem solvers ready to lead India’s technology and economic frontier.',
  },
  leadership: [
    {
      initials: 'SJ',
      name: 'Simran Jaiswal',
      role: 'President',
      bio: 'Executive direction and strategic vision across all 7 operational teams.',
    },
    {
      initials: 'AG',
      name: 'Anant Gupta',
      role: 'Vice President',
      bio: 'Operations oversight, initiative execution, and ecosystem coordination.',
    },
    {
      initials: 'MS',
      name: 'Mukul Kumar Sharma',
      role: 'Secretary',
      bio: 'Administrative governance, community affairs, and internal liaison.',
    },
  ],
  mentors: [
    {
      initials: 'KM',
      name: 'Mr. Kamal Kishor Malhotra',
      role: 'CEO · GICRISE',
      company: 'Galgotias Incubation Centre for Research, Innovation, Startup & Entrepreneurs',
      bio: 'Leading institutional incubation, funding linkages, and campus venture policies.',
    },
    {
      initials: 'SK',
      name: 'Mr. Sonu Kadam',
      role: 'Incubation Manager',
      company: 'GICRISE',
      bio: 'Mentoring, incubation programs, and venture screening across university departments.',
    },
    {
      initials: 'SA',
      name: 'Mr. Sourabh Arya',
      role: 'Marketing Manager',
      company: 'GICRISE',
      bio: 'Brand communications, external alliances, and investor relations.',
    },
  ],
};
