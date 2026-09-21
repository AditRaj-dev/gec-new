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
  badge: string;
  roleTag: string;
  tagColor: {
    bg: string;
    text: string;
  };
  route: string;
  desc: string;
  headName: string;
  headRole: string;
  headTag: string;
  applyTarget: string;
  pillars: TeamPillar[];
  previewScale: number;
  previewOpacity: number;
  coordinatorsCount: number;
  membersCount: number;
}

export const GEC_TEAMS: TeamStageData[] = [
  {
    index: 1,
    id: 'startup-development',
    slug: 'startup-development',
    name: '01. STARTUP DEVELOPMENT & INCUBATION',
    shortName: 'Startup Dev',
    badge: '[TEAM HERO: STARTUP DEVELOPMENT]',
    roleTag: '[TEAM 01: STARTUP DEVELOPMENT]',
    tagColor: {
      bg: '#FBCA05',
      text: '#222222',
    },
    route: 'Route: /teams/startup-development',
    desc: 'Fostering student ventures from raw idea to market validation through structured cohorts, incubation alignment with GICRISE, and founder support networks.',
    headName: 'Aarav Sharma',
    headRole: 'Lead · Startup Development',
    headTag: '[CURRENT HEAD: AARAV SHARMA]',
    applyTarget: 'Startup Development Team',
    previewScale: 0.93,
    previewOpacity: 0.78,
    coordinatorsCount: 4,
    membersCount: 8,
    pillars: [
      { name: '01. Idea Discovery', desc: 'Campus-wide problem ideation workshops' },
      { name: '02. Venture Building', desc: 'Rapid prototype & proof-of-concept testing' },
      { name: '03. Founder Relations', desc: 'Continuous milestone reviews & support' },
      { name: '04. Pitching', desc: 'Decks, demo days, and pitch coaching' },
      { name: '05. Mentorship', desc: 'Pairing teams with alumni & startup experts' },
      { name: '06. Ecosystem', desc: 'Direct pipeline integration into GICRISE' },
    ],
  },
  {
    index: 2,
    id: 'pr-and-networking',
    slug: 'pr-and-networking',
    name: '02. PR & NETWORKING',
    shortName: 'PR & Net',
    badge: '[TEAM HERO: PR & NETWORKING]',
    roleTag: '[TEAM 02: PR & NETWORKING]',
    tagColor: {
      bg: '#A3040F',
      text: '#FFFFFF',
    },
    route: 'Route: /teams/pr-and-networking',
    desc: 'Connecting Galgotias with industry pioneers, angel syndicates, corporate accelerators, and peer university e-cells across India.',
    headName: 'Ananya Roy',
    headRole: 'Lead · PR & Ecosystem Partnerships',
    headTag: '[CURRENT HEAD: ANANYA ROY]',
    applyTarget: 'PR & Networking Team',
    previewScale: 0.95,
    previewOpacity: 0.88,
    coordinatorsCount: 4,
    membersCount: 8,
    pillars: [
      { name: '01. External Relations', desc: 'Building inter-university and corporate networks' },
      { name: '02. Speaker Outreach', desc: 'Curating founders & VC angels for keynotes' },
      { name: '03. Partnerships', desc: 'Formal MoU agreements with accelerators' },
      { name: '04. Networking', desc: 'E-Summit ecosystem mixer operations' },
      { name: '05. Collaborations', desc: 'Cross-chapter initiatives with IEEE/CSI' },
      { name: '06. Ecosystem', desc: 'Representing GEC in regional innovation summits' },
    ],
  },
  {
    index: 3,
    id: 'marketing-ca',
    slug: 'marketing-ca',
    name: '03. MARKETING & CAMPUS AMBASSADOR',
    shortName: 'Mktg & CA',
    badge: '[TEAM HERO: MARKETING & CA]',
    roleTag: '[TEAM 03: MARKETING & CA]',
    tagColor: {
      bg: '#F97316',
      text: '#FFFFFF',
    },
    route: 'Route: /teams/marketing-ca',
    desc: 'Driving campus awareness, student signups, ambassador networks across all academic blocks, and high-conversion cohort recruitment campaigns.',
    headName: 'Kabir Mehta',
    headRole: 'Lead · Growth & Ambassador Ops',
    headTag: '[CURRENT HEAD: KABIR MEHTA]',
    applyTarget: 'Marketing & CA Team',
    previewScale: 0.97,
    previewOpacity: 1.0,
    coordinatorsCount: 4,
    membersCount: 8,
    pillars: [
      { name: '01. Campus Marketing', desc: 'On-ground brand blitzes and interactive kiosks' },
      { name: '02. Campaign Strategy', desc: 'Multichannel launch calendars for E-Week' },
      { name: '03. Community Growth', desc: 'WhatsApp & Discord builder group moderation' },
      { name: '04. Ambassadors', desc: 'Managing 40+ block coordinators across campus' },
      { name: '05. Promotions', desc: 'Merchandise, stickers, and viral flyers' },
      { name: '06. Engagement', desc: 'Pop-up surveys and student feedback loops' },
    ],
  },
  {
    index: 4,
    id: 'events-operations',
    slug: 'events-operations',
    name: '04. EVENT MANAGEMENT & OPERATIONS',
    shortName: 'Event Mgmt',
    badge: '[TEAM HERO: EVENT MANAGEMENT]',
    roleTag: '[TEAM 04: EVENT MANAGEMENT]',
    tagColor: {
      bg: '#701A24',
      text: '#FFFFFF',
    },
    route: 'Route: /teams/events-operations',
    desc: 'Orchestrating large-scale hackathons, founder fireside chats, pitch arenas, auditorium logistics, and frictionless attendee experiences.',
    headName: 'Vikram Malhotra',
    headRole: 'Lead · Events & Venue Operations',
    headTag: '[CURRENT HEAD: VIKRAM MALHOTRA]',
    applyTarget: 'Event Management Team',
    previewScale: 0.96,
    previewOpacity: 0.92,
    coordinatorsCount: 4,
    membersCount: 8,
    pillars: [
      { name: '01. Event Planning', desc: 'End-to-end rundown sheets and master timelines' },
      { name: '02. Venues', desc: 'Auditorium booking, AV rigging, and acoustic setup' },
      { name: '03. Participants', desc: 'Check-in QR desk, badges, and delegate kits' },
      { name: '04. Operations', desc: 'Stage management and VIP protocol handling' },
      { name: '05. Logistics', desc: 'Equipment procurement and hospitality catering' },
      { name: '06. On-Ground Exec', desc: 'Emergency protocols and live crowd direction' },
    ],
  },
  {
    index: 5,
    id: 'digital-media',
    slug: 'digital-media',
    name: '05. DIGITAL MEDIA & STORYTELLING',
    shortName: 'Digital Media',
    badge: '[TEAM HERO: DIGITAL MEDIA]',
    roleTag: '[TEAM 05: DIGITAL MEDIA]',
    tagColor: {
      bg: '#1F7EC0',
      text: '#FFFFFF',
    },
    route: 'Route: /teams/digital-media',
    desc: 'Crafting the visual identity of GEC, producing high-octane reels, founder video interviews, photo archives, and editorial magazine issues.',
    headName: 'Priya Iyer',
    headRole: 'Lead · Creative Direction & Media',
    headTag: '[CURRENT HEAD: PRIYA IYER]',
    applyTarget: 'Digital Media Team',
    previewScale: 0.95,
    previewOpacity: 0.88,
    coordinatorsCount: 4,
    membersCount: 8,
    pillars: [
      { name: '01. Social Media', desc: 'Instagram, LinkedIn & X visual scheduling' },
      { name: '02. Campaigns', desc: 'Creative reels, carousels, and poster systems' },
      { name: '03. Content', desc: 'Editorial storytelling and interview transcripts' },
      { name: '04. Photo & Video', desc: 'High-definition coverage of all campus events' },
      { name: '05. Promotions', desc: 'Motion graphics, Remotion assets, and teasers' },
      { name: '06. Storytelling', desc: 'Founder origin documentation and case studies' },
    ],
  },
  {
    index: 6,
    id: 'technical-product-lab',
    slug: 'technical-product-lab',
    name: '06. TECHNICAL & PRODUCT LAB',
    shortName: 'Technical',
    badge: '[TEAM HERO: TECHNICAL TEAM]',
    roleTag: '[TEAM 06: TECHNICAL TEAM]',
    tagColor: {
      bg: '#334155',
      text: '#FFFFFF',
    },
    route: 'Route: /teams/technical-product-lab',
    desc: 'Engineering public web platforms, CMS internal command centers, attendance scanners, registration engines, and student developer micro-tools.',
    headName: 'Siddharth Nair',
    headRole: 'Lead · Engineering & Infrastructure',
    headTag: '[CURRENT HEAD: SIDDHARTH NAIR]',
    applyTarget: 'Technical Team',
    previewScale: 0.94,
    previewOpacity: 0.84,
    coordinatorsCount: 4,
    membersCount: 8,
    pillars: [
      { name: '01. Web Development', desc: 'High-performance Next.js and Tailwind portals' },
      { name: '02. Infrastructure', desc: 'Serverless deployment, edge caching, and DNS' },
      { name: '03. Internal Tools', desc: 'Applicant triage and CMS back-office tools' },
      { name: '04. Tech Support', desc: 'Live event streaming and registration kiosks' },
      { name: '05. Event Tech', desc: 'Automated QR ticketing and check-in scanner apps' },
      { name: '06. Product Lab', desc: 'Incubating student tech prototypes & APIs' },
    ],
  },
  {
    index: 7,
    id: 'career-connect',
    slug: 'career-connect',
    name: '07. CAREER CONNECT & TALENT OPS',
    shortName: 'Career Connect',
    badge: '[TEAM HERO: CAREER CONNECT]',
    roleTag: '[TEAM 07: CAREER CONNECT]',
    tagColor: {
      bg: '#854D0E',
      text: '#FFFFFF',
    },
    route: 'Route: /teams/career-connect',
    desc: 'Bridging high-growth startups with Galgotias builders for paid internships, live project externships, and venture talent placement.',
    headName: 'Ishaan Gupta',
    headRole: 'Lead · Venture Talent & Placements',
    headTag: '[CURRENT HEAD: ISHAAN GUPTA]',
    applyTarget: 'Career Connect Team',
    previewScale: 0.93,
    previewOpacity: 0.78,
    coordinatorsCount: 4,
    membersCount: 8,
    pillars: [
      { name: '01. Internships', desc: 'Curated 8-week summer and winter startup internships' },
      { name: '02. Career Exposure', desc: 'Founder AMAs on breaking into tech & venture capital' },
      { name: '03. Startup Hiring', desc: 'Exclusive hiring drives for funded alumni startups' },
      { name: '04. Industry Bridge', desc: 'Corporate shadow days and venture capital immersions' },
      { name: '05. Opportunities', desc: 'Live freelance projects and startup bounty boards' },
      { name: '06. Talent Ops', desc: 'Resume reviews and mock founder technical interviews' },
    ],
  },
];
