export type HappeningContent = {
  kicker: string;
  heading: string;
  lede: string;
  event: { badge: string; date: string; title: string; desc: string; chips: string[]; note: string; cta: { label: string; href: string } };
  apply: { badge: string; title: string; desc: string; metaLabel: string; metaValue: string; cta: { label: string; href: string } };
  story: { badge: string; title: string; desc: string; byline: string; cta: { label: string; href: string } };
  spotlight: { mark: string; badge: string; status: string; title: string; meta: string; cta: { label: string; href: string } };
  allStories: { label: string; href: string };
};

export const HAPPENING_FALLBACK: HappeningContent = {
  kicker: 'REALTIME ECOSYSTEM DISPATCH',
  heading: 'Always Something in Motion.',
  lede: 'Ideas are being pitched. Teams are building. Founders are sharing. Opportunities are opening. Discover what is currently happening across the Galgotias entrepreneurial ecosystem.',
  event: {
    badge: 'UPCOMING EVENT',
    date: 'APRIL 14, 2026',
    title: 'Galgotias E-Summit 2026: The Builder Arena',
    desc: 'Greater Noida’s premier student entrepreneurship summit featuring 50+ founders, live demo rounds, and venture angel mixers across Campus Hub.',
    chips: ['Main Auditorium 01', '10:00 AM – 6:00 PM', '480 Seats'],
    note: 'Admissions Free for Students',
    cta: { label: 'View Event Details →', href: '/initiatives#esummit' },
  },
  apply: {
    badge: 'APPLICATIONS OPEN',
    title: 'SDP Cohort 04',
    desc: 'Find programs and opportunities currently accepting applications across the campus accelerator.',
    metaLabel: 'PRE-SEED COHORT',
    metaValue: '12 Teams Selected per Batch',
    cta: { label: 'Apply Now', href: '/initiatives#apply' },
  },
  story: {
    badge: 'LATEST STORY',
    title: 'From Garage to Seed Round',
    desc: 'Meet the student builders turning ideas into funded agritech ventures inside Galgotias.',
    byline: 'By Aman Sharma · FarmVision AI',
    cta: { label: 'Read Story →', href: '/stories#farmvision-ai' },
  },
  spotlight: {
    mark: 'FV',
    badge: 'STARTUP SPOTLIGHT',
    status: '● ACTIVE VENTURE',
    title: 'FarmVision AI — Autonomous Multispectral Drone Analytics for Precision Agriculture',
    meta: 'Founded by Galgotias B.Tech builders · Raised ₹75L Seed Round · Mentored through GEC Cohort 02 & GICRISE',
    cta: { label: 'Explore Startup →', href: '/stories#farmvision-ai' },
  },
  allStories: { label: 'Read All Stories →', href: '/stories' },
};
