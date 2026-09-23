'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { DURATION, EASE } from '@/lib/motion';
import './act-count.css';

export type Stat = { label: string; value: string };

/**
 * Renders `value` verbatim on the server (no-JS and reduced-motion both see
 * the true figure). On mount, if the section is in view and motion is
 * allowed, counts up from a lower number to that same value.
 */
function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || prefersReducedMotion || !ref.current) return;
    const el = ref.current;
    const match = value.match(/\d[\d,]*/);
    if (!match) return;
    const target = parseInt(match[0].replace(/,/g, ''), 10);
    if (!Number.isFinite(target) || target <= 0) return;

    const controls = animate(0, target, {
      duration: DURATION.act / 1000,
      ease: EASE.spring,
      onUpdate(latest) {
        el.textContent = value.replace(match[0], Math.round(latest).toString());
      },
      onComplete() {
        el.textContent = value;
      },
    });
    return () => controls.stop();
  }, [isInView, prefersReducedMotion, value]);

  return <span ref={ref}>{value}</span>;
}

function StatItem({ stat, animated }: { stat: Stat; animated: boolean }) {
  return (
    <div className="act-count__item">
      <span
        className="font-display font-bold text-[var(--gec-ink)]"
        style={{ fontSize: 'var(--text-3xl)' }}
      >
        {animated ? <StatValue value={stat.value} /> : stat.value}
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--gec-ink-muted)]">
        {stat.label}
      </span>
    </div>
  );
}

export function ActCount({ stats }: { stats: Stat[] }) {
  return (
    <section
      aria-label="GEC by the numbers"
      className="surface-sand flex items-center"
      style={{ minHeight: '40vh' }}
    >
      <div className="act-count__viewport w-full py-8">
        <div className="act-count__marquee">
          <div className="act-count__track" data-duplicate="false">
            {stats.map((stat) => (
              <StatItem key={stat.label} stat={stat} animated />
            ))}
          </div>
          {/* Duplicate track closes the loop seamlessly; screen readers should
              only hear each stat once, so it is hidden from the a11y tree and
              never animates its own count-up. */}
          <div className="act-count__track" data-duplicate="true" aria-hidden="true">
            {stats.map((stat) => (
              <StatItem key={`dup-${stat.label}`} stat={stat} animated={false} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
