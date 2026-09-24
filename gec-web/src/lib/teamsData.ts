export interface TeamPillar {
  name: string;
  desc: string;
}

export interface TeamMember {
  role: 'head' | 'coordinator' | 'member';
  title?: string;
  name?: string;
}

export interface TeamStageData {
  index: number;
  id: string;
  slug: string;
  name: string;
  shortName: string;
  roleTag: string;
  tagColor: {
    bg: string;
    text: string;
  };
  route: string;
  desc: string;
  headName: string;
  headRole: string;
  headPhoto: string;
  heroImage: string;
  galleryImages: string[];
  applyTarget: string;
  pillars: TeamPillar[];
  previewScale: number;
  previewOpacity: number;
  coordinatorsCount: number;
  membersCount: number;
  /** Real coordinator roster; until filled, the composition shows `coordinatorsCount` placeholder tiles. */
  coordinators?: TeamCoordinator[];
}

export interface TeamCoordinator {
  name: string;
  /** Square-ish portrait, e.g. '/team/startup-dev/riya.webp'. */
  photo?: string;
  role?: string;
}

// Professional student-portrait photos (Unsplash, free-to-use)
const P = {
  aarav: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=faces',
  ananya: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces',
  kabir: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
  vikram: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces',
  priya: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces',
  siddharth: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces',
  ishaan: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop&crop=faces',
};

// Placeholder coordinator portraits (Unsplash, portrait crop) — swap for real photos.
const coord = (id: string) => `https://images.unsplash.com/photo-${id}?w=300&h=400&fit=crop&crop=faces`;

const G = {
  incubation: [
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&h=900&fit=crop',
  ],
  pr: [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1560523159-4a9692d222f8?w=1600&h=900&fit=crop',
  ],
  marketing: [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&h=900&fit=crop',
  ],
  events: [
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1600&h=900&fit=crop',
  ],
  media: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=1600&h=900&fit=crop',
  ],
  tech: [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1550439062-609e1531270e?w=1600&h=900&fit=crop',
  ],
  career: [
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1552581234-26160f608093?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&h=900&fit=crop',
  ],
};

export const GEC_TEAMS: TeamStageData[] = [
  {
    index: 1,
    id: 'startup-development',
    slug: 'startup-development',
    name: 'Startup Development & Incubation',
    shortName: 'Startup Dev',
    roleTag: 'Team 01',
    tagColor: { bg: '#FBCA05', text: '#222222' },
    route: '/teams/startup-development',
    desc: 'Fostering student ventures from raw idea to market validation through structured cohorts, incubation alignment with GICRISE, and founder support networks.',
    headName: 'Aarav Sharma',
    headRole: 'Lead · Startup Development',
    headPhoto: P.aarav,
    heroImage: G.incubation[0],
    galleryImages: G.incubation,
    applyTarget: 'Startup Development Team',
    previewScale: 0.94,
    previewOpacity: 0.85,
    coordinatorsCount: 3,
    // Sample roster — replace with real coordinators (add `photo` for portraits).
    coordinators: [
      { name: 'Ananya Rao', role: 'Coordinator', photo: coord('1494790108377-be9c29b29330') },
      { name: 'Kabir Mehta', role: 'Coordinator', photo: coord('1506794778202-cad84cf45f1d') },
      { name: 'Priya Nair', role: 'Coordinator', photo: coord('1438761681033-6461ffad8d80') },
    ],
    membersCount: 8,
    pillars: [
      { name: 'Idea Discovery', desc: 'Campus-wide problem ideation workshops.' },
      { name: 'Venture Building', desc: 'Rapid prototype & proof-of-concept testing.' },
      { name: 'Founder Relations', desc: 'Continuous milestone reviews & support.' },
      { name: 'Pitching', desc: 'Decks, demo days, and pitch coaching.' },
      { name: 'Mentorship', desc: 'Pairing teams with alumni & startup experts.' },
      { name: 'Ecosystem', desc: 'Direct pipeline integration into GICRISE.' },
    ],
  },
  {
    index: 2,
    id: 'pr-and-networking',
    slug: 'pr-and-networking',
    name: 'PR & Networking',
    shortName: 'PR & Net',
    roleTag: 'Team 02',
    tagColor: { bg: '#A3040F', text: '#FFFFFF' },
    route: '/teams/pr-and-networking',
    desc: 'Connecting Galgotias with industry pioneers, angel syndicates, corporate accelerators, and peer university e-cells across India.',
    headName: 'Ananya Roy',
    headRole: 'Lead · PR & Ecosystem Partnerships',
    headPhoto: P.ananya,
    heroImage: G.pr[0],
    galleryImages: G.pr,
    applyTarget: 'PR & Networking Team',
    previewScale: 0.96,
    previewOpacity: 0.9,
    coordinatorsCount: 3,
    // Sample roster — replace with real coordinators (add `photo` for portraits).
    coordinators: [
      { name: 'Rohan Gupta', role: 'Coordinator', photo: coord('1472099645785-5658abf4ff4e') },
      { name: 'Isha Verma', role: 'Coordinator', photo: coord('1534528741775-53994a69daeb') },
      { name: 'Arjun Bose', role: 'Coordinator', photo: coord('1539571696357-5a69c17a67c6') },
    ],
    membersCount: 8,
    pillars: [
      { name: 'External Relations', desc: 'Building inter-university and corporate networks.' },
      { name: 'Speaker Outreach', desc: 'Curating founders & VC angels for keynotes.' },
      { name: 'Partnerships', desc: 'Formal MoU agreements with accelerators.' },
      { name: 'Networking', desc: 'E-Summit ecosystem mixer operations.' },
      { name: 'Collaborations', desc: 'Cross-chapter initiatives with IEEE / CSI.' },
      { name: 'Ecosystem', desc: 'Representing GEC in regional innovation summits.' },
    ],
  },
  {
    index: 3,
    id: 'marketing-ca',
    slug: 'marketing-ca',
    name: 'Marketing & Campus Ambassador',
    shortName: 'Marketing',
    roleTag: 'Team 03',
    tagColor: { bg: '#F97316', text: '#FFFFFF' },
    route: '/teams/marketing-ca',
    desc: 'Driving campus awareness, student signups, ambassador networks across all academic blocks, and high-conversion cohort recruitment campaigns.',
    headName: 'Kabir Mehta',
    headRole: 'Lead · Growth & Ambassador Ops',
    headPhoto: P.kabir,
    heroImage: G.marketing[0],
    galleryImages: G.marketing,
    applyTarget: 'Marketing & CA Team',
    previewScale: 0.98,
    previewOpacity: 1.0,
    coordinatorsCount: 3,
    // Sample roster — replace with real coordinators (add `photo` for portraits).
    coordinators: [
      { name: 'Sneha Iyer', role: 'Coordinator', photo: coord('1517841905240-472988babdf9') },
      { name: 'Vivaan Jain', role: 'Coordinator', photo: coord('1507591064344-4c6ce005b128') },
      { name: 'Meera Das', role: 'Coordinator', photo: coord('1524504388940-b1c1722653e1') },
    ],
    membersCount: 8,
    pillars: [
      { name: 'Campus Marketing', desc: 'On-ground brand blitzes and interactive kiosks.' },
      { name: 'Campaign Strategy', desc: 'Multi-channel launch calendars for E-Week.' },
      { name: 'Community Growth', desc: 'WhatsApp & Discord builder group moderation.' },
      { name: 'Ambassadors', desc: 'Managing 40+ block coordinators across campus.' },
      { name: 'Promotions', desc: 'Merchandise, stickers, and viral flyers.' },
      { name: 'Engagement', desc: 'Pop-up surveys and student feedback loops.' },
    ],
  },
  {
    index: 4,
    id: 'events-operations',
    slug: 'events-operations',
    name: 'Event Management & Operations',
    shortName: 'Events',
    roleTag: 'Team 04',
    tagColor: { bg: '#701A24', text: '#FFFFFF' },
    route: '/teams/events-operations',
    desc: 'Orchestrating large-scale hackathons, founder fireside chats, pitch arenas, auditorium logistics, and frictionless attendee experiences.',
    headName: 'Vikram Malhotra',
    headRole: 'Lead · Events & Venue Operations',
    headPhoto: P.vikram,
    heroImage: G.events[0],
    galleryImages: G.events,
    applyTarget: 'Event Management Team',
    previewScale: 0.96,
    previewOpacity: 0.92,
    coordinatorsCount: 3,
    // Sample roster — replace with real coordinators (add `photo` for portraits).
    coordinators: [
      { name: 'Aditya Singh', role: 'Coordinator', photo: coord('1500648767791-00dcc994a43e') },
      { name: 'Kavya Reddy', role: 'Coordinator', photo: coord('1488426862026-3ee34a7d66df') },
      { name: 'Neel Kapoor', role: 'Coordinator', photo: coord('1507003211169-0a1dd7228f2d') },
    ],
    membersCount: 8,
    pillars: [
      { name: 'Event Planning', desc: 'End-to-end rundown sheets and master timelines.' },
      { name: 'Venues', desc: 'Auditorium booking, AV rigging, acoustic setup.' },
      { name: 'Participants', desc: 'Check-in QR desk, badges, and delegate kits.' },
      { name: 'Operations', desc: 'Stage management and VIP protocol handling.' },
      { name: 'Logistics', desc: 'Equipment procurement and hospitality catering.' },
      { name: 'On-Ground Exec', desc: 'Emergency protocols and live crowd direction.' },
    ],
  },
  {
    index: 5,
    id: 'digital-media',
    slug: 'digital-media',
    name: 'Digital Media & Storytelling',
    shortName: 'Media',
    roleTag: 'Team 05',
    tagColor: { bg: '#1F7EC0', text: '#FFFFFF' },
    route: '/teams/digital-media',
    desc: 'Crafting the visual identity of GEC, producing high-octane reels, founder video interviews, photo archives, and editorial magazine issues.',
    headName: 'Priya Iyer',
    headRole: 'Lead · Creative Direction & Media',
    headPhoto: P.priya,
    heroImage: G.media[0],
    galleryImages: G.media,
    applyTarget: 'Digital Media Team',
    previewScale: 0.96,
    previewOpacity: 0.9,
    coordinatorsCount: 3,
    // Sample roster — replace with real coordinators (add `photo` for portraits).
    coordinators: [
      { name: 'Tara Menon', role: 'Coordinator', photo: coord('1544005313-94ddf0286df2') },
      { name: 'Dev Malhotra', role: 'Coordinator', photo: coord('1506794778202-cad84cf45f1d') },
      { name: 'Riya Sen', role: 'Coordinator', photo: coord('1531123897727-8f129e1688ce') },
    ],
    membersCount: 8,
    pillars: [
      { name: 'Social Media', desc: 'Instagram, LinkedIn & X visual scheduling.' },
      { name: 'Campaigns', desc: 'Creative reels, carousels, and poster systems.' },
      { name: 'Content', desc: 'Editorial storytelling and interview transcripts.' },
      { name: 'Photo & Video', desc: 'HD coverage of all campus events.' },
      { name: 'Motion', desc: 'Motion graphics, Remotion assets, and teasers.' },
      { name: 'Storytelling', desc: 'Founder origin documentation and case studies.' },
    ],
  },
  {
    index: 6,
    id: 'technical-product-lab',
    slug: 'technical-product-lab',
    name: 'Technical & Product Lab',
    shortName: 'Technical',
    roleTag: 'Team 06',
    tagColor: { bg: '#334155', text: '#FFFFFF' },
    route: '/teams/technical-product-lab',
    desc: 'Engineering public web platforms, CMS internal command centers, attendance scanners, registration engines, and student developer micro-tools.',
    headName: 'Siddharth Nair',
    headRole: 'Lead · Engineering & Infrastructure',
    headPhoto: P.siddharth,
    heroImage: G.tech[0],
    galleryImages: G.tech,
    applyTarget: 'Technical Team',
    previewScale: 0.94,
    previewOpacity: 0.86,
    coordinatorsCount: 3,
    // Sample roster — replace with real coordinators (add `photo` for portraits).
    coordinators: [
      { name: 'Karan Joshi', role: 'Coordinator', photo: coord('1472099645785-5658abf4ff4e') },
      { name: 'Aisha Khan', role: 'Coordinator', photo: coord('1494790108377-be9c29b29330') },
      { name: 'Yash Patel', role: 'Coordinator', photo: coord('1539571696357-5a69c17a67c6') },
    ],
    membersCount: 8,
    pillars: [
      { name: 'Web Development', desc: 'High-performance Next.js and Tailwind portals.' },
      { name: 'Infrastructure', desc: 'Serverless deployment, edge caching, and DNS.' },
      { name: 'Internal Tools', desc: 'Applicant triage and CMS back-office tools.' },
      { name: 'Tech Support', desc: 'Live event streaming and registration kiosks.' },
      { name: 'Event Tech', desc: 'Automated QR ticketing and check-in scanner apps.' },
      { name: 'Product Lab', desc: 'Incubating student tech prototypes & APIs.' },
    ],
  },
  {
    index: 7,
    id: 'career-connect',
    slug: 'career-connect',
    name: 'Career Connect & Talent Ops',
    shortName: 'Career',
    roleTag: 'Team 07',
    tagColor: { bg: '#854D0E', text: '#FFFFFF' },
    route: '/teams/career-connect',
    desc: 'Bridging high-growth startups with Galgotias builders for paid internships, live project externships, and venture talent placement.',
    headName: 'Ishaan Gupta',
    headRole: 'Lead · Venture Talent & Placements',
    headPhoto: P.ishaan,
    heroImage: G.career[0],
    galleryImages: G.career,
    applyTarget: 'Career Connect Team',
    previewScale: 0.94,
    previewOpacity: 0.82,
    coordinatorsCount: 3,
    // Sample roster — replace with real coordinators (add `photo` for portraits).
    coordinators: [
      { name: 'Nisha Pillai', role: 'Coordinator', photo: coord('1438761681033-6461ffad8d80') },
      { name: 'Aryan Shah', role: 'Coordinator', photo: coord('1507591064344-4c6ce005b128') },
      { name: 'Diya Chawla', role: 'Coordinator', photo: coord('1534528741775-53994a69daeb') },
    ],
    membersCount: 8,
    pillars: [
      { name: 'Internships', desc: 'Curated 8-week summer and winter startup internships.' },
      { name: 'Career Exposure', desc: 'Founder AMAs on breaking into tech & VC.' },
      { name: 'Startup Hiring', desc: 'Exclusive hiring drives for funded alumni startups.' },
      { name: 'Industry Bridge', desc: 'Corporate shadow days and VC immersions.' },
      { name: 'Opportunities', desc: 'Live freelance projects and startup bounty boards.' },
      { name: 'Talent Ops', desc: 'Resume reviews and mock founder technical interviews.' },
    ],
  },
];
