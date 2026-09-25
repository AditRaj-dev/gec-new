import type {
  HeroSpotlight,
  Initiative,
  Story,
  Team,
  Person,
  Stakeholder,
} from './types';

/**
 * Deep freezes an object to ensure immutability at runtime.
 */
function deepFreeze<T>(obj: T): Readonly<T> {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const val = (obj as Record<string, unknown>)[prop];
    if (
      val !== null &&
      (typeof val === 'object' || typeof val === 'function') &&
      !Object.isFrozen(val)
    ) {
      deepFreeze(val);
    }
  });
  return obj;
}

/**
 * Frozen fallback for Hero Spotlight projection.
 * Sourced from GEC_Dynamic_Hero_Spotlight_Frozen.md & existing approved landing layout.
 */
export const FALLBACK_HERO_SPOTLIGHT: Readonly<HeroSpotlight> = deepFreeze({
  uuid: 'fallback-hero-001',
  badgeText: "Incubation Cohort '26 Open",
  badgeSubtext: '18 Days Left',
  headline: 'Where Student Ideas Become Scaled Ventures.',
  highlightedWord: 'Scaled Ventures.',
  leadParagraph:
    'The official entrepreneurship hub at Galgotias University. We bridge the gap between dorm-room concepts, early-stage capital, and tier-one venture mentorship.',
  primaryCta: {
    label: 'Apply for Incubation',
    href: '#apply',
  },
  secondaryCta: {
    label: 'Replay Curtain Intro',
    href: '#',
  },
  featuredProgram: {
    tag: 'Featured Program',
    title: 'Venture Catalyst Cohort',
    badge: "Summer '26",
    features: [
      {
        title: '₹5 Lakh Equity-Free Grant',
        description: 'Direct non-dilutive prototype capital for selected student venture teams.',
      },
      {
        title: '1-on-1 VC Pitch Prep',
        description: 'Bi-weekly deal-flow reviews with partners from marquee Indian venture firms.',
      },
      {
        title: 'Prototyping Labs & Legal',
        description: 'IP protection, incorporation filing, AWS/GCP credits, and hardware workspace.',
      },
    ],
    footerText: 'Selection Rate: ~4.2%',
    footerCta: {
      label: 'View Curriculum',
      href: '#apply',
    },
  },
  metrics: [
    { value: '120+', label: 'Startups Launched', color: '#222222' },
    { value: '₹4.8Cr+', label: 'Seed Funding Raised', color: '#A3040F' },
    { value: '18K+', label: 'Students Mentored', color: '#222222' },
    { value: '50+', label: 'Industry Partners', color: '#1F7EC0' },
  ],
});

/**
 * Frozen fallback for Initiatives projection.
 * Sourced from GEC_Website_Complete_Content_Frozen.md Section 4.
 */
export const FALLBACK_INITIATIVES: Readonly<Initiative[]> = deepFreeze([
  {
    id: 'init-01',
    slug: 'incubation-venture-studio',
    pillarNumber: '01',
    title: 'Incubation & Venture Studio',
    oneLiner:
      'Dedicated campus workspaces, high-performance computing clusters, legal counsel, and direct grants for MVP validation.',
    category: 'Incubation',
    status: 'Active',
    description:
      'A structured ecosystem giving early-stage student founders access to physical maker spaces, cloud credits, legal incorporation support, and direct seed grants.',
    ctaText: 'Learn about incubation',
    ctaHref: '#apply',
  },
  {
    id: 'init-02',
    slug: 'annual-e-summit-26',
    pillarNumber: '02',
    title: "Annual E-Summit '26",
    oneLiner:
      "Northern India's premier university entrepreneurship summit uniting 5,000+ delegates, 60+ keynote founders, and angel syndicates.",
    category: 'Flagship Event',
    status: 'Upcoming',
    description:
      'The signature entrepreneurship conclave hosting keynote speakers, nationwide business plan competitions, startup expos, and investor deal-flow arenas.',
    ctaText: 'Explore E-Summit stages',
    ctaHref: '#initiatives',
  },
  {
    id: 'init-03',
    slug: 'venture-capital-network',
    pillarNumber: '03',
    title: 'Venture Capital Network',
    oneLiner:
      'Institutional pipeline directly connecting seed-stage student founders with angels, accelerators (Y Combinator, Surge), and micro-VC funds.',
    category: 'Venture Capital',
    status: 'Active',
    description:
      'Curated mentorship sessions, pitch preparation, and direct demo day presentations with prominent Indian venture funds and global accelerators.',
    ctaText: 'View mentor directory',
    ctaHref: '#initiatives',
  },
  {
    id: 'init-04',
    slug: 'startup-development-program',
    title: 'Startup Development Program',
    oneLiner:
      'A 12-week immersive cohort guiding student builders from problem discovery to first revenue and venture backing.',
    category: 'Accelerator',
    status: 'Open',
    description:
      'Rigorous curriculum covering customer validation, lean MVP prototyping, unit economics, regulatory compliance, and pitching.',
    ctaText: 'Apply for Cohort',
    ctaHref: '#apply',
  },
  {
    id: 'init-05',
    slug: 'campus-pitching-sessions',
    title: 'Campus Pitching Sessions',
    oneLiner:
      'Bi-weekly pitch arenas where student teams stress-test their ideas with angel investors and ecosystem mentors.',
    category: 'Pitch Arena',
    status: 'Active',
    description:
      'High-energy closed-door pitch sessions designed to build confidence, sharpen value propositions, and uncover blind spots.',
    ctaText: 'Join Next Session',
    ctaHref: '#initiatives',
  },
]);

/**
 * Frozen fallback for Stories projection.
 * Sourced from GEC_Website_Complete_Content_Frozen.md Section 5.
 */
export const FALLBACK_STORIES: Readonly<Story[]> = deepFreeze([
  {
    id: 'story-01',
    slug: 'from-campus-project-to-seed-funding',
    title: 'From Dorm-Room Experiment to Institutional Seed Funding',
    category: 'Founder Story',
    authorOrFounder: 'Rohan Verma',
    startupName: 'AeroDynamics AI',
    excerpt:
      'How three Galgotias engineering undergraduates built an autonomous drone delivery platform and secured ₹75 Lakh in pre-seed venture backing.',
    publishedAt: '2026-03-12T10:00:00.000Z',
    tags: ['Robotics', 'Seed Round', 'DeepTech'],
    readTime: '4 min read',
  },
  {
    id: 'story-02',
    slug: 'northern-india-biggest-student-venture-summit',
    title: "Northern India's Biggest Student Venture Summit Returns for 2026",
    category: 'News',
    excerpt:
      'Galgotias Entrepreneurship Cell announces the dates and keynote lineup for E-Summit 2026, featuring 60+ venture partners, angel networks, and breakout founders.',
    publishedAt: '2026-03-01T09:00:00.000Z',
    tags: ['E-Summit', 'Keynotes', 'Ecosystem'],
    readTime: '3 min read',
  },
  {
    id: 'story-03',
    slug: 'patent-filing-and-ip-for-student-builders',
    title: 'Protecting Student IP: Zero-Cost Patent Filing at GEC',
    category: 'Startup Story',
    excerpt:
      "A breakdown of how GEC's legal and intellectual property clinic helped four campus student ventures file provisional patents before entering demo days.",
    publishedAt: '2026-02-18T14:30:00.000Z',
    tags: ['Intellectual Property', 'Legal', 'Incubation'],
    readTime: '5 min read',
  },
]);

/**
 * Frozen fallback for Teams projection.
 * Sourced from GEC_Website_Complete_Content_Frozen.md Section 3 (7 Teams. One Vision).
 */
export const FALLBACK_TEAMS: Readonly<Team[]> = deepFreeze([
  {
    id: 'team-01',
    slug: 'startup-development',
    name: 'Startup Development Team',
    headline: 'Turning Ideas Into Ventures.',
    description:
      'Works at the intersection of students, ideas, and entrepreneurship to create an environment where aspiring founders can explore ideas, develop skills, and move toward execution.',
    focusAreas: [
      'Idea discovery',
      'Startup development',
      'Founder engagement',
      'Pitching',
      'Mentorship coordination',
      'Startup ecosystem activities',
    ],
    memberCount: 16,
  },
  {
    id: 'team-02',
    slug: 'pr-networking',
    name: 'Public Relations & Networking Team',
    headline: 'Building Relationships That Expand Possibilities.',
    description:
      'Connects GEC with founders, speakers, communities, and institutional partners beyond the immediate campus to unlock valuable opportunities for students.',
    focusAreas: [
      'External relations',
      'Speaker outreach',
      'Community partnerships',
      'Networking',
      'Collaborations',
      'Ecosystem engagement',
    ],
    memberCount: 12,
  },
  {
    id: 'team-03',
    slug: 'marketing-campus-ambassador',
    name: 'Marketing & Campus Ambassador Team',
    headline: 'Taking GEC Beyond the Room.',
    description:
      "Ensures that GEC's opportunities, initiatives, and founder stories reach every student across the university and partner institutions.",
    focusAreas: [
      'Campus marketing',
      'Campaign strategy',
      'Community growth',
      'Ambassador network',
      'Promotions',
      'Student engagement',
    ],
    memberCount: 22,
  },
  {
    id: 'team-04',
    slug: 'event-management',
    name: 'Event Management Team',
    headline: 'Turning Plans Into Experiences.',
    description:
      'Handles the coordination, operations, and ground-level execution required to transform ambitious plans into seamless, memorable GEC experiences.',
    focusAreas: [
      'Event planning',
      'Venue coordination',
      'Participant management',
      'Operations',
      'Logistics',
      'On-ground execution',
    ],
    memberCount: 18,
  },
  {
    id: 'team-05',
    slug: 'digital-media-promotions',
    name: 'Digital Media & Promotions Team',
    headline: 'Making GEC Visible.',
    description:
      'Shapes how GEC communicates online through visual storytelling, photography, motion design, event campaigns, and high-impact digital content.',
    focusAreas: [
      'Social media',
      'Creative campaigns',
      'Content',
      'Photography and video',
      'Digital promotions',
      'Storytelling',
    ],
    memberCount: 14,
  },
  {
    id: 'team-06',
    slug: 'technical-team',
    name: 'Technical Team',
    headline: 'Technology Behind the Ecosystem.',
    description:
      'Builds and supports the digital infrastructure, web portals, cache systems, and internal software tools that power GEC initiatives and large-scale summits.',
    focusAreas: [
      'Web development',
      'Digital infrastructure',
      'Technical support',
      'Internal tools',
      'Event technology',
      'Product experimentation',
    ],
    memberCount: 10,
  },
  {
    id: 'team-07',
    slug: 'internship-career-connect',
    name: 'Internship & Career Connect Team',
    headline: 'Connecting Talent With Opportunity.',
    description:
      'Connects students with relevant professional exposure, internships, and early hiring opportunities within funded startups and fast-growing companies.',
    focusAreas: [
      'Internship opportunities',
      'Career exposure',
      'Startup hiring',
      'Industry connections',
      'Student opportunities',
      'Career-oriented initiatives',
    ],
    memberCount: 12,
  },
]);

/**
 * Frozen fallback for People projection.
 * Sourced from GEC_Website_Complete_Content_Frozen.md Section 2.5 & 1.7.
 */
export const FALLBACK_PEOPLE: Readonly<Person[]> = deepFreeze([
  // Core Leadership
  {
    id: 'person-01',
    name: 'Simran Jaiswal',
    role: 'President',
    category: 'leadership',
    organization: 'Galgotias Entrepreneurship Cell',
    bio: 'Directing community initiatives, ecosystem partnerships, and overall strategy for GEC.',
  },
  {
    id: 'person-02',
    name: 'Anant Gupta',
    role: 'Vice President',
    category: 'leadership',
    organization: 'Galgotias Entrepreneurship Cell',
    bio: 'Overseeing initiative execution, team operations, and venture cohort tracking.',
  },
  {
    id: 'person-03',
    name: 'Mukul Kumar Sharma',
    role: 'Secretary',
    category: 'leadership',
    organization: 'Galgotias Entrepreneurship Cell',
    bio: 'Managing external communications, institutional affairs, and documentation.',
  },
  // Mentors
  {
    id: 'person-04',
    name: 'Mr. Kamal Kishor Malhotra',
    role: 'CEO',
    category: 'mentor',
    organization: 'Galgotias Incubation Centre (GICRISE)',
    bio: 'Guiding startup incubation, institutional grant distribution, and venture acceleration.',
  },
  {
    id: 'person-05',
    name: 'Mr. Sonu Kadam',
    role: 'Incubation Manager',
    category: 'mentor',
    organization: 'Galgotias Incubation Centre (GICRISE)',
    bio: 'Mentoring student cohorts through prototyping, business modeling, and market access.',
  },
  {
    id: 'person-06',
    name: 'Mr. Sourabh Arya',
    role: 'Marketing Manager',
    category: 'mentor',
    organization: 'Galgotias Incubation Centre (GICRISE)',
    bio: 'Advising on startup branding, launch marketing, and ecosystem outreach.',
  },
  // Notable Guest Speakers
  {
    id: 'person-07',
    name: 'Aman Gupta',
    role: 'Co-Founder & CMO',
    category: 'speaker',
    organization: 'boAt Lifestyle',
  },
  {
    id: 'person-08',
    name: 'Sanjeev Bikhchandani',
    role: 'Founder & Executive Vice Chairman',
    category: 'speaker',
    organization: 'Info Edge (Naukri.com, Jeevansathi, 99acres)',
  },
  {
    id: 'person-09',
    name: 'Sandeep Jain',
    role: 'Founder & CEO',
    category: 'speaker',
    organization: 'GeeksforGeeks',
  },
  {
    id: 'person-10',
    name: 'Ashneer Grover',
    role: 'Founder & Investor',
    category: 'speaker',
    organization: 'Third Unicorn',
  },
]);

/**
 * Frozen fallback for Stakeholders projection.
 * Sourced from GEC_Website_Complete_Content_Frozen.md Section 1.8 & architecture.md Section 6.
 */
export const FALLBACK_STAKEHOLDERS: Readonly<Stakeholder[]> = deepFreeze([
  {
    id: 'stakeholder-01',
    name: 'Galgotias Incubation Centre (GICRISE)',
    category: 'ecosystem',
    description: 'Campus incubation hub providing infrastructure, lab equipment, and Seed Fund Scheme support.',
    websiteUrl: 'https://gicrise.in',
  },
  {
    id: 'stakeholder-02',
    name: 'AWS Activate',
    category: 'partner',
    description: 'Cloud infrastructure credits and technical training for enrolled student ventures.',
    websiteUrl: 'https://aws.amazon.com/activate/',
  },
  {
    id: 'stakeholder-03',
    name: 'Google for Startups',
    category: 'partner',
    description: 'Mentorship, Cloud credits, and product masterclasses for student startups.',
    websiteUrl: 'https://startup.google.com/',
  },
  {
    id: 'stakeholder-04',
    name: 'AeroDynamics AI',
    category: 'startup',
    stage: 'Seed Funded',
    founder: 'Rohan Verma',
    description: 'Autonomous drone delivery platform engineered on campus.',
  },
  {
    id: 'stakeholder-05',
    name: 'Edusphere Learning',
    category: 'startup',
    stage: 'Incubation Phase',
    founder: 'Pooja Narang',
    description: 'Adaptive AI tutoring for regional university engineering examinations.',
  },
]);
