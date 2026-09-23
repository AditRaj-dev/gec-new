import { ShaderLayer } from '@/components/ShaderLayer';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import './happening.css';

// styled.html 2484–2596 ("1.2 What's Happening").
export function Happening() {
  return (
    <section className="wf-section surface-crimson gec-shader-host gec-fallback-liquid" data-surface="crimson">
      <ShaderLayer family="liquid" />

      <div className="happening__intro">
        <span className="editorial-kicker">REALTIME ECOSYSTEM DISPATCH</span>
        <h2 className="h2-section happening__heading">Always Something in Motion.</h2>
        <p className="body-editorial happening__lede">
          Ideas are being pitched. Teams are building. Founders are sharing. Opportunities are opening. Discover what
          is currently happening across the Galgotias entrepreneurial ecosystem.
        </p>
      </div>

      <div className="bento-matrix-4items">
        {/* Bento 1: Upcoming Event (Span 6) */}
        <div className="bento-span-6 brand-card happening__card happening__card--split">
          <div>
            <div className="happening__card-top-row">
              <span className="status-badge badge-crimson">UPCOMING EVENT</span>
              <span className="happening__event-date">APRIL 14, 2026</span>
            </div>
            <h3 className="h3-card happening__event-title">Galgotias E-Summit 2026: The Builder Arena</h3>
            <p className="happening__event-desc">
              Greater Noida’s premier student entrepreneurship summit featuring 50+ founders, live demo rounds, and
              venture angel mixers across Campus Hub.
            </p>
            <div className="happening__event-badges">
              <span className="status-badge badge-outline">Main Auditorium 01</span>
              <span className="status-badge badge-outline">10:00 AM – 6:00 PM</span>
              <span className="status-badge badge-outline">480 Seats</span>
            </div>
          </div>

          <div className="happening__event-footer">
            <span className="happening__event-free">Admissions Free for Students</span>
            <ViewTransitionLink href="/initiatives" className="gec-btn btn-crimson happening__event-cta">
              View Event Details →
            </ViewTransitionLink>
          </div>
        </div>

        {/* Bento 2: Applications Open (Span 3) */}
        <div className="bento-span-3 brand-card happening__card happening__card--split">
          <div>
            <span className="status-badge badge-gold happening__badge-spaced">APPLICATIONS OPEN</span>
            <h3 className="h3-card happening__card-title">SDP Cohort 04</h3>
            <p className="happening__card-desc">
              Find programs and opportunities currently accepting applications across the campus accelerator.
            </p>
            <div className="happening__pre-seed">
              <div className="happening__pre-seed-label">PRE-SEED COHORT</div>
              <div className="happening__pre-seed-value">12 Teams Selected per Batch</div>
            </div>
          </div>

          <ViewTransitionLink href="/initiatives" className="gec-btn btn-crimson happening__apply-cta">
            Apply Now
          </ViewTransitionLink>
        </div>

        {/* Bento 3: Latest Story (Span 3) */}
        <div className="bento-span-3 brand-card happening__card happening__card--split">
          <div>
            <span className="status-badge badge-blue happening__badge-spaced">LATEST STORY</span>
            <h3 className="h3-card happening__card-title">From Garage to Seed Round</h3>
            <p className="happening__story-desc">
              Meet the student builders turning ideas into funded agritech ventures inside Galgotias.
            </p>
            <div className="happening__story-byline">By Aman Sharma · FarmVision AI</div>
          </div>

          <ViewTransitionLink href="/stories" className="gec-btn btn-outline-ink happening__apply-cta">
            Read Story →
          </ViewTransitionLink>
        </div>

        {/* Bento 4: Startup Spotlight (Span 12) */}
        <div className="bento-span-12 brand-card happening__spotlight">
          <div className="happening__spotlight-left">
            <div className="happening__spotlight-mark">FV</div>
            <div>
              <div className="happening__spotlight-tags">
                <span className="status-badge badge-crimson happening__secondary-badge">STARTUP SPOTLIGHT</span>
                <span className="happening__spotlight-active">● ACTIVE VENTURE</span>
              </div>
              <div className="happening__spotlight-title">
                FarmVision AI — Autonomous Multispectral Drone Analytics for Precision Agriculture
              </div>
              <div className="happening__spotlight-meta">
                Founded by Galgotias B.Tech builders · Raised ₹75L Seed Round · Mentored through GEC Cohort 02 &amp;
                GICRISE
              </div>
            </div>
          </div>

          <ViewTransitionLink href="/stories#portfolio-grid-container" className="gec-btn btn-crimson happening__spotlight-cta">
            Explore Startup →
          </ViewTransitionLink>
        </div>
      </div>

      <div className="happening__cta-row">
        <ViewTransitionLink href="/stories" className="gec-btn btn-white">
          View All Updates →
        </ViewTransitionLink>
      </div>
    </section>
  );
}
