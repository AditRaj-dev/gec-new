// styled.html 2726–2804 ("1.5 Spotlight" — Historic Milestones).
// ponytail: Unsplash placeholders (same as teamsData); swap `photo` for real
// GEC event shots in public/milestones/ — remove it to fall back to the swatch.
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&h=750&fit=crop`;

const MILESTONES = [
  {
    badgeClass: 'badge-crimson',
    badgeText: 'SUMMIT 2023',
    yearText: 'YEAR 2023',
    place: 'CAMPUS HUB',
    title: 'Foundation Summit & Live Pitch Arena',
    desc: "The historic inauguration of GEC’s campus incubator network, connecting 400+ student innovators with initial angel mentors.",
    swatchClass: 'milestones__thumb--crimson',
    photo: unsplash('1475721027785-f74eccf877e2'),
  },
  {
    badgeClass: 'badge-blue',
    badgeText: 'E-SUMMIT 2024',
    yearText: 'YEAR 2024',
    place: 'AUDITORIUM 01',
    title: 'Galgotias E-Summit Scaling to 1,500+',
    desc: 'Keynotes by unicorn founders, live venture pitch rounds, and regional collegiate participation across NCR.',
    swatchClass: 'milestones__thumb--blue',
    photo: unsplash('1540575467063-178a50c2df87'),
  },
  {
    badgeClass: 'badge-gold',
    badgeText: 'GICRISE ALLIANCE',
    yearText: 'YEAR 2025',
    place: 'INSTITUTIONAL',
    title: 'GICRISE Incubation Alliance & Grant Fund',
    desc: 'Formal partnership with Galgotias Incubation Centre establishing the ₹50L student prototype grant pipeline.',
    swatchClass: 'milestones__thumb--gold',
    photo: unsplash('1515187029135-18ee286d815b'),
  },
] as const;

export type Milestone = (typeof MILESTONES)[number];
export const MILESTONES_FALLBACK: Milestone[] = [...MILESTONES];
