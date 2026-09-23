export interface HeroCampaign {
  id: string;
  key: string;
  badge: string;
  priorityTag: string;
  deadline: string;
  headline: string;
  subline: string;
  context: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  featuredCard: {
    tag: string;
    cohortBadge: string;
    title: string;
    description: string;
    metrics: { label: string; value: string }[];
    badgeAccent: string;
  };
}

export const HERO_CAMPAIGNS: Record<string, HeroCampaign> = {
  sdp: {
    id: 'sdp',
    key: '01. SDP 2026 (P1 OPEN)',
    badge: 'APPLICATIONS OPEN · COHORT 04',
    priorityTag: 'P1 FLAGSHIP INITIATIVE',
    deadline: 'Applications close 28 September · 23:59 IST',
    headline: 'IDEAS BEGIN HERE. BUILDERS GROW HERE.',
    subline: 'Innovate. Inspire. Impact.',
    context:
      'Galgotias Entrepreneurship Cell is a student-driven entrepreneurial community where ideas are explored, skills are built, and aspiring founders find the people, opportunities, and support needed to take their next step.',
    primaryCtaText: 'Apply for SDP Cohort 04',
    primaryCtaHref: '#apply',
    secondaryCtaText: 'Discover GEC Story',
    secondaryCtaHref: '/about',
    featuredCard: {
      tag: 'FEATURED CAMPAIGN',
      cohortBadge: 'COHORT 04',
      title: 'STARTUP DEVELOPMENT PROGRAM 2026',
      description:
        'A 12-week venture acceleration sprint providing dedicated student founder cohorts with faculty mentors, prototyping sandbox access, and pre-seed demo slots.',
      metrics: [
        { label: 'Duration', value: '12 Weeks' },
        { label: 'Cohort Size', value: '12 Startups' },
        { label: 'Seed Pipeline', value: '₹50L Pool' },
      ],
      badgeAccent: '#A3040F',
    },
  },
  ideathon: {
    id: 'ideathon',
    key: '02. IDEATHON (P0 48H)',
    badge: 'REGISTRATION LIVE · 48H SPRINT',
    priorityTag: 'P0 HIGH INTENSITY SPRINT',
    deadline: 'Registration closes 12 October · 18:00 IST',
    headline: '48 HOURS TO PROTOTYPE THE FUTURE.',
    subline: 'Sprint. Validate. Build.',
    context:
      'A high-intensity 48-hour inter-college hackathon and business model sprint. Transform raw hypotheses into validated prototypes before industry judges.',
    primaryCtaText: 'Register Your Team',
    primaryCtaHref: '#apply',
    secondaryCtaText: 'Explore Initiatives',
    secondaryCtaHref: '/initiatives',
    featuredCard: {
      tag: 'HACKATHON SPRINT',
      cohortBadge: 'ROUND 01',
      title: 'GALGOTIAS NATIONAL IDEATHON',
      description:
        'Rapid validation crucible where 60+ engineering and management teams build working MVPs across AI, CleanTech, and FinTech domains.',
      metrics: [
        { label: 'Timeframe', value: '48 Hours' },
        { label: 'Prize Pool', value: '₹2.5 Lakhs' },
        { label: 'VC Mentors', value: '15+ Angels' },
      ],
      badgeAccent: '#FBCA05',
    },
  },
  esummit: {
    id: 'esummit',
    key: '03. E-SUMMIT (P2 LIVE)',
    badge: 'ANNUAL FLAGSHIP SUMMIT',
    priorityTag: 'P2 REGIONAL GATHERING',
    deadline: 'Main Stage Passes Available · Campus Hub',
    headline: 'THE LARGEST STUDENT ENTREPRENEURSHIP SUMMIT IN NCR.',
    subline: 'Network. Pitch. Scale.',
    context:
      'Bringing together over 1,500 aspiring innovators, 50+ visionary founders, and 20+ angel syndicates for keynotes, live shark arenas, and networking.',
    primaryCtaText: 'Get Summit Pass',
    primaryCtaHref: '#apply',
    secondaryCtaText: 'View Speakers',
    secondaryCtaHref: '#speakers',
    featuredCard: {
      tag: 'ANNUAL SUMMIT',
      cohortBadge: 'EDITION 2026',
      title: 'GALGOTIAS E-SUMMIT 2026',
      description:
        'Greater Noida’s marquee entrepreneurial gathering featuring keynote stages, pitch competitions, and bilateral investor matchmaking.',
      metrics: [
        { label: 'Attendees', value: '1,500+' },
        { label: 'Founders', value: '50+ On Stage' },
        { label: 'Exhibition', value: '30 Demo Pods' },
      ],
      badgeAccent: '#1F7EC0',
    },
  },
  evergreen: {
    id: 'evergreen',
    key: '04. EVERGREEN FALLBACK',
    badge: 'ALWAYS OPEN · GEC COMMUNITY',
    priorityTag: 'PERPETUAL ACCESS',
    deadline: 'Rolling Admissions · All Departments Welcome',
    headline: 'WHERE AMBITIOUS STUDENTS TURN INTO FOUNDERS.',
    subline: 'Learn by Doing.',
    context:
      'Galgotias Entrepreneurship Cell is your campus launchpad. Join student-led teams, access institutional grants, and connect with experienced mentors.',
    primaryCtaText: 'Join the Community',
    primaryCtaHref: '#apply',
    secondaryCtaText: 'Meet the Teams',
    secondaryCtaHref: '/teams',
    featuredCard: {
      tag: 'COMMUNITY PORTAL',
      cohortBadge: 'YEAR-ROUND',
      title: 'GEC STUDENT INCUBATION NETWORK',
      description:
        'Continuous access to workshops, peer hack nights, venture advisory, and the Galgotias Incubation Centre (GICRISE) facilities.',
      metrics: [
        { label: 'Active Teams', value: '7 Divisions' },
        { label: 'Community', value: '12k+ Students' },
        { label: 'Resources', value: '100% Free' },
      ],
      badgeAccent: '#222222',
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
    actionHref: '/initiatives',
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
    actionHref: '#apply',
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
    actionHref: '/stories',
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
