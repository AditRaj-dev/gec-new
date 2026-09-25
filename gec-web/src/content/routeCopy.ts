import type { ComponentProps } from 'react';
import type { RouteHero } from '@/components/route/RouteHero';
import type { FinalCta } from '@/components/home/FinalCta';

// Serialisable copy for RouteHero + FinalCta on /about, /teams, /initiatives, /stories.
// Tied to the real component prop types (Omit + string overrides) so they can't drift apart.
// title/accent are always plain strings here, even where a page wraps them in extra markup
// (e.g. /teams re-wraps them in `<span className="rt-accent">…</span>` — see that page).
// Anything genuinely non-serialisable (JSX with its own structure, functions) stays in the page:
// `aside`/`children` on RouteHero, and — for /stories, whose FinalCta heading has its own
// `<br />` + accent-span markup — `heading` is replaced by two plain-string lines instead.
export type RouteHeroCopy = Omit<ComponentProps<typeof RouteHero>, 'title' | 'accent' | 'aside' | 'children'> & {
  title: string;
  accent?: string;
};

export type FinalCtaCopy = Omit<ComponentProps<typeof FinalCta>, 'heading'> & {
  heading?: string;
  /** /stories only: words for `<>{headingLine1}<br /><span className="final-cta__heading-accent">{headingLine2}</span></>`. */
  headingLine1?: string;
  headingLine2?: string;
};

export type RouteKey = 'about' | 'teams' | 'initiatives' | 'stories';
export type RouteCopy = Record<RouteKey, { hero: RouteHeroCopy; cta: FinalCtaCopy }>;

export const ROUTE_COPY_FALLBACK: RouteCopy = {
  about: {
    hero: {
      kicker: 'WHO WE ARE',
      title: 'We Don’t Just Talk About Entrepreneurship.',
      accent: 'We Create Space to Experience It.',
      lede: 'Galgotias Entrepreneurship Cell is a student-driven community built around innovation, leadership, creativity, and entrepreneurship. Through mentorship, workshops, startup-focused programs, and collaborative experiences, GEC encourages students to turn curiosity into action.',
      anchors: [
        { href: '#origin', label: 'Our story' },
        { href: '#leadership', label: 'Leadership' },
      ],
    },
    cta: {
      shader: 'riso',
      primary: { href: '/teams', label: 'Join GEC' },
      secondary: { href: '/initiatives', label: 'Discover Initiatives' },
    },
  },
  teams: {
    hero: {
      kicker: 'THE ENGINE BEHIND GEC',
      title: '7 Teams.',
      accent: 'One Vision.',
      lede: 'Different skills. Different responsibilities. One entrepreneurial ecosystem. Behind every event, startup initiative, campaign, partnership, and opportunity is a team of students making it happen.',
    },
    cta: {
      shader: 'riso',
      kicker: 'RECRUITMENT',
      heading: 'Find Your Team.',
      lede: 'Every team takes new members each semester. Pick the one that matches how you like to build.',
      primary: { href: '/about', label: 'About GEC' },
      secondary: { href: '/initiatives', label: 'See What Teams Run' },
    },
  },
  initiatives: {
    hero: {
      kicker: 'ACTION OVER THEORY',
      title: 'Ideas Need More',
      accent: 'Than Inspiration.',
      lede: 'Our initiatives are designed to give students opportunities to explore entrepreneurship through building, pitching, learning, collaborating, and connecting with the ecosystem. Every initiative solves a different problem. Every initiative creates a different path forward.',
      anchors: [
        { href: '#desk', label: 'Open the desk' },
        { href: '#programmes', label: 'All programmes' },
        { href: '#ideathon', label: 'Ideathon' },
        { href: '#esummit', label: 'E-Summit' },
      ],
    },
    cta: {
      shader: 'riso',
      lede: 'Applications for SDP Cohort 04 are open now. Zero fees, zero equity.',
      primary: { href: '#sdp', label: 'Apply to SDP' },
      secondary: { href: '/stories', label: 'Read Founder Stories' },
    },
  },
  stories: {
    hero: {
      kicker: 'CULTURE & INSIGHTS',
      title: 'People Build Companies.',
      accent: 'Stories Build Culture.',
      lede: 'Ideas, failures, experiments, wins, and lessons from people inside and around the Galgotias entrepreneurial ecosystem.',
      anchors: [
        { href: '#portfolio', label: 'Portfolio' },
        { href: '#dispatch', label: 'The Dispatch' },
      ],
    },
    cta: {
      shader: 'riso',
      kicker: 'SHARE YOURS',
      headingLine1: 'Built Something at Galgotias?',
      headingLine2: 'Tell Us the Story.',
      lede: 'Failures and experiments count too. We feature founders, teams, and events from across the ecosystem.',
      primary: { href: '/about', label: 'Get in Touch' },
      secondary: { href: '/initiatives', label: 'Discover Initiatives' },
    },
  },
};
