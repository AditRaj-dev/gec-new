import type { HappeningContent } from '@/content/happening';
import { ShaderLayer } from '@/components/ShaderLayer';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import './happening.css';

// styled.html 2484–2596 ("1.2 What's Happening").
export function Happening({ content: c }: { content: HappeningContent }) {
  return (
    <section className="wf-section surface-crimson gec-shader-host gec-fallback-liquid happening" data-surface="crimson">
      <ShaderLayer family="liquid" />

      <div className="happening__intro">
        <span className="editorial-kicker">{c.kicker}</span>
        <h2 className="h2-section happening__heading">{c.heading}</h2>
        <p className="body-editorial happening__lede">{c.lede}</p>
      </div>

      <div className="bento-matrix-4items">
        {/* Bento 1: Upcoming Event (Span 6) */}
        <div className="bento-span-6 brand-card happening__card happening__card--split">
          <div>
            <div className="happening__card-top-row">
              <span className="status-badge badge-crimson">{c.event.badge}</span>
              <span className="happening__event-date">{c.event.date}</span>
            </div>
            <h3 className="h3-card happening__event-title">{c.event.title}</h3>
            <p className="happening__event-desc">{c.event.desc}</p>
            <div className="happening__event-badges">
              {c.event.chips.map((chip) => (
                <span key={chip} className="status-badge badge-outline">{chip}</span>
              ))}
            </div>
          </div>

          <div className="happening__event-footer">
            <span className="happening__event-free">{c.event.note}</span>
            <ViewTransitionLink href={c.event.cta.href} className="gec-btn btn-crimson happening__event-cta">
              {c.event.cta.label}
            </ViewTransitionLink>
          </div>
        </div>

        {/* Bento 2: Applications Open (Span 3) */}
        <div className="bento-span-3 brand-card happening__card happening__card--split">
          <div>
            <span className="status-badge badge-gold happening__badge-spaced">{c.apply.badge}</span>
            <h3 className="h3-card happening__card-title">{c.apply.title}</h3>
            <p className="happening__card-desc">{c.apply.desc}</p>
            <div className="happening__pre-seed">
              <div className="happening__pre-seed-label">{c.apply.metaLabel}</div>
              <div className="happening__pre-seed-value">{c.apply.metaValue}</div>
            </div>
          </div>

          <ViewTransitionLink href={c.apply.cta.href} className="gec-btn btn-crimson happening__apply-cta">
            {c.apply.cta.label}
          </ViewTransitionLink>
        </div>

        {/* Bento 3: Latest Story (Span 3) */}
        <div className="bento-span-3 brand-card happening__card happening__card--split">
          <div>
            <span className="status-badge badge-blue happening__badge-spaced">{c.story.badge}</span>
            <h3 className="h3-card happening__card-title">{c.story.title}</h3>
            <p className="happening__story-desc">{c.story.desc}</p>
            <div className="happening__story-byline">{c.story.byline}</div>
          </div>

          <ViewTransitionLink href={c.story.cta.href} className="gec-btn btn-outline-ink happening__apply-cta">
            {c.story.cta.label}
          </ViewTransitionLink>
        </div>

        {/* Bento 4: Startup Spotlight (Span 12) */}
        <div className="bento-span-12 brand-card happening__spotlight">
          <div className="happening__spotlight-left">
            <div className="happening__spotlight-mark">{c.spotlight.mark}</div>
            <div>
              <div className="happening__spotlight-tags">
                <span className="status-badge badge-crimson happening__secondary-badge">{c.spotlight.badge}</span>
                <span className="happening__spotlight-active">{c.spotlight.status}</span>
              </div>
              <div className="happening__spotlight-title">{c.spotlight.title}</div>
              <div className="happening__spotlight-meta">{c.spotlight.meta}</div>
            </div>
          </div>

          <ViewTransitionLink href={c.spotlight.cta.href} className="gec-btn btn-crimson happening__spotlight-cta">
            {c.spotlight.cta.label}
          </ViewTransitionLink>
        </div>
      </div>

      <div className="happening__cta-row">
        <ViewTransitionLink href={c.allStories.href} className="gec-btn btn-white">
          {c.allStories.label}
        </ViewTransitionLink>
      </div>
    </section>
  );
}
