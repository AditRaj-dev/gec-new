export type ImpactMetric = { value: string; title: string; subtitle: string };
export type ImpactContent = { pillars: string[]; metrics: ImpactMetric[] };

export const IMPACT_FALLBACK: ImpactContent = {
  pillars: ['Leadership', 'Communication', 'Teamwork', 'Ideation', 'Problem Solving', 'Execution'],
  metrics: [
    { value: '35+', title: 'Events & Experiences', subtitle: 'Summits, Hackathons & Mixers' },
    { value: '12,000+', title: 'Students Engaged', subtitle: 'Campus-Wide Ecosystem Reach' },
    { value: '45+', title: 'Startups Supported', subtitle: 'Incubated & Mentored Ventures' },
    { value: '28+', title: 'Speakers & Mentors', subtitle: 'Unicorn Founders & Industry VCs' },
  ],
};
