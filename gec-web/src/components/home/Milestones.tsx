import Image from 'next/image';
import { MilestoneRelive } from './MilestoneRelive';
import type { Milestone } from '@/content/milestones';
import './milestones.css';

// styled.html 2726–2804 ("1.5 Spotlight" — Historic Milestones).

export function Milestones({ items }: { items: Milestone[] }) {
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
        {items.map((milestone) => (
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
