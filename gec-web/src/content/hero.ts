import { HERO_CAMPAIGNS, type HeroCampaign } from '../lib/siteContent';

export type HeroSecondaryCard = (typeof SECONDARY_CARDS)[number];
export type HeroContent = { campaigns: Record<string, HeroCampaign>; secondaryCards: HeroSecondaryCard[] };

// The three wireframe secondary-strip cards (styled.html 2452–2479). Their
// copy is static wireframe content, independent of `switchHeroCampaign` —
// only the click target and `active-secondary` state depend on the campaign.
const SECONDARY_CARDS = [
  {
    id: 'sdp',
    labelClass: 'hero-secondary-card__label--sdp',
    label: '01 / STARTUP DEVELOPMENT',
    badgeClass: 'badge-crimson',
    badgeText: 'P1 ACTIVE',
    title: 'Cohort 04 Admissions',
    meta: 'Closes 28 Sep · 12-Week Sprint',
  },
  {
    id: 'ideathon',
    labelClass: 'hero-secondary-card__label--ideathon',
    label: '02 / IDEATHON 2026',
    badgeClass: 'badge-gold',
    badgeText: 'P0 48H',
    title: 'Venture Sprint Arena',
    meta: 'Final Call · 14 Team Slots Left',
  },
  {
    id: 'esummit',
    labelClass: 'hero-secondary-card__label--esummit',
    label: '03 / E-SUMMIT 2026',
    badgeClass: 'badge-blue',
    badgeText: 'P2 LIVE',
    title: 'Campus Auditorium',
    meta: 'Happening Today · 50+ Founders',
  },
] as const;

export const HERO_FALLBACK: HeroContent = { campaigns: HERO_CAMPAIGNS, secondaryCards: [...SECONDARY_CARDS] };
