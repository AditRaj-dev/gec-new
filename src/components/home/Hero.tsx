'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { DURATION, EASE, exitDuration } from '@/lib/motion';
import type { HeroCampaign } from '@/lib/siteContent';
import { ShaderLayer } from '@/components/ShaderLayer';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import './hero.css';

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

export function Hero({ campaigns }: { campaigns: Record<string, HeroCampaign> }) {
  const [activeId, setActiveId] = useState<string>('sdp');
  const active = campaigns[activeId] ?? campaigns.sdp;
  const prefersReducedMotion = useReducedMotion();

  const enterS = prefersReducedMotion ? 0 : DURATION.macro / 1000;
  const exitS = prefersReducedMotion ? 0 : exitDuration(DURATION.macro) / 1000;

  const initial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 };
  const exit = prefersReducedMotion
    ? { opacity: 0, y: 0, transition: { duration: 0 } }
    : { opacity: 0, y: 8, transition: { duration: exitS, ease: EASE.spring } };

  return (
    <section
      className="wf-section surface-cream gec-shader-host gec-fallback-watercolor"
      id="hero-spotlight-section"
      data-surface="cream"
    >
      <ShaderLayer family="watercolor" />

      <div className="hero-asymmetric-split">
        {/* Left Typography Stack (Col 1-7) */}
        <div className="hero-primary-content hero__primary">
          <div className="hero__meta-row">
            <span className={`status-badge ${active.badgeClass}`}>{active.badgeText}</span>
            <span className="status-badge badge-outline">{active.priorityTag}</span>
            <span className="editorial-kicker hero__kicker">GALGOTIAS ENTREPRENEURSHIP CELL</span>
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active.id}
              initial={initial}
              animate={{ opacity: 1, y: 0 }}
              exit={exit}
              transition={{ duration: enterS, ease: EASE.spring }}
            >
              <div>
                <h1 className="h1-display">
                  <span style={{ color: active.headlineAccent }}>{active.headlineLine1}</span>
                  <br />
                  <span className="hero__headline-line2">{active.headlineLine2}</span>
                </h1>
                <div className="hero__subline">{active.subline}</div>
              </div>

              <div className="hero__deadline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gec-crimson)" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="hero__deadline-text">{active.deadline}</span>
              </div>

              <p className="body-editorial hero__context">{active.context}</p>

              <div className="hero__cta-row">
                <ViewTransitionLink href={active.primaryCtaHref} className="gec-btn btn-crimson">
                  {active.primaryCtaText}
                </ViewTransitionLink>
                <ViewTransitionLink href={active.secondaryCtaHref} className="gec-btn btn-outline-ink">
                  {active.secondaryCtaText}
                </ViewTransitionLink>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Visual Stage Card (Col 8-12): a campaign "ticket" (head band, perforation, lead stat, footer). */}
        <div className="brand-card hero__card">
          <div className="hero__card-head">
            <span className="hero__card-head-tag">
              <span className="hero__card-dot" aria-hidden="true" />
              FEATURED CAMPAIGN
            </span>
            <span className="hero__card-cohort">{active.card.chip}</span>
          </div>

          {/* Every campaign's copy sits invisibly in the same grid cell (sizers), so the card is always as tall
              as the longest campaign and never jumps when the billboard switches. */}
          <div className="hero__card-body hero__stack">
            {Object.values(campaigns).map((c) => (
              <div key={c.id} className="hero__sizer" aria-hidden="true">
                <CardTop campaign={c} />
              </div>
            ))}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active.id}
                initial={initial}
                animate={{ opacity: 1, y: 0 }}
                exit={exit}
                transition={{ duration: enterS, ease: EASE.spring }}
              >
                <CardTop campaign={active} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hero__card-perf" aria-hidden="true" />

          <div className="hero__card-lower hero__stack">
            {Object.values(campaigns).map((c) => (
              <div key={c.id} className="hero__sizer" aria-hidden="true" inert>
                <CardLower campaign={c} />
              </div>
            ))}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active.id}
                className="hero__card-lower-live"
                initial={initial}
                animate={{ opacity: 1, y: 0 }}
                exit={exit}
                transition={{ duration: enterS, ease: EASE.spring }}
              >
                <CardLower campaign={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Secondary Concurrent Initiatives Strip */}
      <div className="hero-secondary-dock">
        <div className="hero__dock-row">
          <span className="editorial-kicker hero__kicker">CONCURRENT INITIATIVES &amp; FOCUS AREAS</span>
          <span className="hero__dock-hint">Click to switch billboard view</span>
        </div>

        <div className="hero-secondary-strip">
          {SECONDARY_CARDS.map((card) => (
            <button
              type="button"
              key={card.id}
              className={`hero-secondary-card${card.id === activeId ? ' active-secondary' : ''}`}
              aria-pressed={card.id === activeId}
              onClick={() => setActiveId(card.id)}
            >
              <div className="hero__secondary-top">
                <span className={`hero__secondary-label ${card.labelClass}`}>{card.label}</span>
                <span className={`status-badge ${card.badgeClass} hero__secondary-badge`}>{card.badgeText}</span>
              </div>
              <div className="hero__secondary-title">{card.title}</div>
              <div className="hero__secondary-meta">{card.meta}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardTop({ campaign }: { campaign: HeroCampaign }) {
  return (
    <>
      <div className="hero__card-title">{campaign.mediaTitle}</div>
      <p className="hero__card-subtitle">{campaign.mediaSubtitle}</p>
    </>
  );
}

function CardLower({ campaign: { card } }: { campaign: HeroCampaign }) {
  return (
    <>
      <div className="hero__card-stats">
        <div className="hero__card-lead">
          <div className="hero__card-lead-value">{card.lead.value}</div>
          <div className="hero__card-metric-label">{card.lead.label}</div>
        </div>
        <dl className="hero__card-metrics">
          {card.metrics.map((metric) => (
            <div className="hero__card-metric" key={metric.label}>
              <dt className="hero__card-metric-label">{metric.label}</dt>
              <dd className="hero__card-metric-value">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="hero__card-foot">
        <span className="hero__card-deadline">{card.closes}</span>
        <ViewTransitionLink href={card.ctaHref} className="gec-btn btn-crimson hero__card-cta">
          {card.ctaText}
        </ViewTransitionLink>
      </div>
    </>
  );
}
