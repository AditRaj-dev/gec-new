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
    labelColor: 'var(--gec-crimson)',
    label: '01 / STARTUP DEVELOPMENT',
    badgeClass: 'badge-crimson',
    badgeText: 'P1 ACTIVE',
    title: 'Cohort 04 Admissions',
    meta: 'Closes 28 Sep · 12-Week Sprint',
  },
  {
    id: 'ideathon',
    labelColor: '#b45309',
    label: '02 / IDEATHON 2026',
    badgeClass: 'badge-gold',
    badgeText: 'P0 48H',
    title: 'Venture Sprint Arena',
    meta: 'Final Call · 14 Team Slots Left',
  },
  {
    id: 'esummit',
    labelColor: 'var(--gec-blue)',
    label: '03 / E-SUMMIT 2026',
    badgeClass: 'badge-blue',
    badgeText: 'P2 LIVE',
    title: 'Campus Auditorium',
    meta: 'Happening Today · 50+ Founders',
  },
] as const;

// The featured card's tag, cohort chip, highlight metrics and its own CTA
// are never touched by `switchHeroCampaign` (styled.html 4715–4762) — there
// is no field for them in its data — so they stay fixed at the wireframe's
// static (SDP) values regardless of the active campaign.
const FEATURED_METRICS = [
  { label: 'Duration', value: '12 Weeks' },
  { label: 'Grant Sandbox', value: '₹50L Pool' },
  { label: 'Mentorship', value: '1-on-1 Access' },
  { label: 'Incubation', value: 'GICRISE Fast-Track' },
];

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
                  <span style={{ color: 'var(--gec-ink)' }}>{active.headlineLine2}</span>
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

        {/* Right Visual Stage Card (Col 8-12) */}
        <div className="brand-card hero__card">
          <div className="hero__card-glow" aria-hidden="true" />

          <div className="hero__card-top-row">
            <span className="status-badge badge-crimson">FEATURED CAMPAIGN</span>
            <span className="hero__card-cohort">COHORT 04</span>
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active.id}
              initial={initial}
              animate={{ opacity: 1, y: 0 }}
              exit={exit}
              transition={{ duration: enterS, ease: EASE.spring }}
            >
              <div className="hero__card-title">{active.mediaTitle}</div>
              <p className="hero__card-subtitle">{active.mediaSubtitle}</p>
            </motion.div>
          </AnimatePresence>

          <div className="hero__card-metrics">
            {FEATURED_METRICS.map((metric) => (
              <div className="hero__card-metric" key={metric.label}>
                <div className="hero__card-metric-label">{metric.label}</div>
                <div className="hero__card-metric-value">{metric.value}</div>
              </div>
            ))}
          </div>

          <ViewTransitionLink href="/initiatives" className="gec-btn btn-crimson hero__card-cta">
            Apply for Cohort 04 →
          </ViewTransitionLink>
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
                <span className="hero__secondary-label" style={{ color: card.labelColor }}>
                  {card.label}
                </span>
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
