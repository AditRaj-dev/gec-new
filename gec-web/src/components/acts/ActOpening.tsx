'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { DURATION, EASE } from '@/lib/motion';
import type { HeroCampaign } from '@/lib/siteContent';
import { cn } from '@/lib/utils';

export function ActOpening({
  campaigns,
}: {
  campaigns: Record<string, HeroCampaign>;
}) {
  const keys = Object.keys(campaigns);
  // First campaign renders synchronously on the server — no mount effect gates content.
  const [activeKey, setActiveKey] = useState<string>(keys[0]);
  const active = campaigns[activeKey] ?? campaigns[keys[0]];
  const prefersReducedMotion = useReducedMotion();

  const slideDuration = DURATION.micro / 1000;

  return (
    <section
      aria-label="Current campaigns"
      className="surface-cream gec-grain relative min-h-[100dvh] overflow-hidden"
    >
      <div className="relative z-[1] mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col justify-between px-6 py-10 md:px-10 lg:px-16">
        {/* Campaign pills */}
        <nav aria-label="Choose a campaign" className="flex flex-wrap gap-2 pt-2">
          {keys.map((key) => {
            const campaign = campaigns[key];
            const isActive = key === activeKey;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveKey(key)}
                className={cn(
                  'inline-flex min-h-11 items-center rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  'focus-visible:ring-[var(--gec-crimson)] focus-visible:ring-offset-[var(--gec-canvas)]',
                  isActive
                    ? 'border-[var(--gec-crimson)] bg-[var(--gec-crimson)] text-white'
                    : 'border-[var(--gec-border)] bg-[var(--gec-surface-card)] text-[var(--gec-ink-muted)] hover:text-[var(--gec-ink)]'
                )}
                style={{ transitionDuration: 'var(--dur-ui)' }}
              >
                {campaign.key}
              </button>
            );
          })}
        </nav>

        {/* Swappable content */}
        <div className="relative mt-10 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 16 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: -16 }
              }
              transition={{ duration: slideDuration, ease: EASE.spring }}
              className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:items-end"
            >
              {/* Left: headline column */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="gec-stamp rounded-full border border-[var(--gec-crimson)] px-3 py-1">
                    {active.priorityTag}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--gec-ink-muted)]">
                    {active.badge}
                  </span>
                </div>

                <h1
                  className="font-display font-bold uppercase text-[var(--gec-ink)]"
                  style={{ fontSize: 'var(--text-hero)', lineHeight: 0.98 }}
                >
                  {active.headline}
                </h1>

                <p
                  className="font-display text-[var(--gec-crimson)]"
                  style={{ fontSize: 'var(--text-lg)' }}
                >
                  {active.subline}
                </p>

                <p
                  className="max-w-[42ch] text-[var(--gec-ink-muted)]"
                  style={{ fontSize: 'var(--text-base)' }}
                >
                  {active.context}
                </p>

                <p className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--gec-crimson-act)]">
                  {active.deadline}
                </p>

                <div className="mt-2 flex flex-wrap gap-3">
                  <a
                    href={active.primaryCtaHref}
                    className="inline-flex min-h-11 items-center rounded-full bg-[var(--gec-crimson)] px-6 py-3 text-sm font-medium text-white shadow-[var(--elev-raised)] transition-colors hover:bg-[var(--gec-crimson-act)]"
                    style={{ transitionDuration: 'var(--dur-ui)' }}
                  >
                    {active.primaryCtaText}
                  </a>
                  <a
                    href={active.secondaryCtaHref}
                    className="inline-flex min-h-11 items-center rounded-full border border-[var(--gec-border)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--gec-ink)] transition-colors hover:bg-[var(--gec-surface-card)]"
                    style={{ transitionDuration: 'var(--dur-ui)' }}
                  >
                    {active.secondaryCtaText}
                  </a>
                </div>
              </div>

              {/* Right: featured card */}
              <div
                className="surface-card relative flex flex-col gap-5 rounded-2xl p-7"
                style={{ boxShadow: 'var(--elev-lifted)' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--gec-ink-muted)]">
                    {active.featuredCard.tag}
                  </span>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.04em] text-white"
                    style={{ backgroundColor: active.featuredCard.badgeAccent }}
                  >
                    {active.featuredCard.cohortBadge}
                  </span>
                </div>

                <h2
                  className="font-display font-bold uppercase text-[var(--gec-ink)]"
                  style={{ fontSize: 'var(--text-2xl)' }}
                >
                  {active.featuredCard.title}
                </h2>

                <p className="text-[var(--gec-ink-muted)]" style={{ fontSize: 'var(--text-sm)' }}>
                  {active.featuredCard.description}
                </p>

                <dl className="mt-2 grid grid-cols-3 gap-4 border-t border-[var(--gec-border)] pt-4">
                  {active.featuredCard.metrics.map((metric) => (
                    <div key={metric.label} className="flex flex-col gap-1">
                      <dt className="font-mono text-xs uppercase tracking-[0.05em] text-[var(--gec-ink-muted)]">
                        {metric.label}
                      </dt>
                      <dd
                        className="font-display font-bold text-[var(--gec-ink)]"
                        style={{ fontSize: 'var(--text-lg)' }}
                      >
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
