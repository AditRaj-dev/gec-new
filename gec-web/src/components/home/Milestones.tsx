import Image from 'next/image';
import { MilestoneRelive } from './MilestoneRelive';
import './milestones.css';

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

export function Milestones() {
  return (
    <section className="wf-section surface-sand" data-surface="sand">
      <div className="milestones__intro">
        <span className="editorial-kicker">HISTORIC MILESTONES</span>
        <h2 className="h2-section milestones__heading">Moments That Shaped GEC.</h2>
        <p className="body-editorial milestones__lede">
          Not every milestone belongs in a statistic. Explore the events, conversations, competitions, founder
          interactions, and experiences that have shaped the GEC community over the years.
        </p>
      </div>

      <div className="initiatives-offset-grid">
        {MILESTONES.map((milestone) => (
          <div className="brand-card milestones__card" key={milestone.title}>
            <div className={`milestones__thumb ${milestone.swatchClass}`}>
              {milestone.photo && (
                <Image
                  src={milestone.photo}
                  alt={milestone.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="milestones__img"
                />
              )}
              <span className={`status-badge ${milestone.badgeClass}`}>{milestone.badgeText}</span>
            </div>
            <div className="milestones__meta-row">
              <span className="status-badge badge-gold">{milestone.yearText}</span>
              <span className="milestones__place">{milestone.place}</span>
            </div>
            <h3 className="h3-card milestones__title">{milestone.title}</h3>
            <p className="milestones__desc">{milestone.desc}</p>
            <div className="milestones__footer">
              <MilestoneRelive
                title={milestone.title}
                desc={milestone.desc}
                meta={`${milestone.yearText} · ${milestone.place}`}
                photo={milestone.photo}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
