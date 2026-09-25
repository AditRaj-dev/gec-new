import type { ReactNode } from 'react';
import { ShaderLayer } from '@/components/ShaderLayer';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import type { ShaderFamily } from '@/lib/shaders/renderer';
import './final-cta.css';

type CtaAction = { href: string; label: string };

// styled.html 3011–3030 ("1.9 Final CTA"). Defaults are the home copy; routes pass their own.
export function FinalCta({
  kicker = 'YOUR INVITATION TO BUILD',
  heading = (
    <>
      Your Idea Doesn’t Need to Be Perfect.
      <br />
      <span className="final-cta__heading-accent">It Needs a Beginning.</span>
    </>
  ),
  lede = 'Whether you want to build a startup, develop entrepreneurial skills, find collaborators, or simply explore what’s possible — there is a place for you here.',
  primary = { href: '/about', label: 'Explore GEC' },
  secondary = { href: '/initiatives', label: 'Discover Initiatives' },
  shader = 'liquid',
}: {
  kicker?: string;
  heading?: ReactNode;
  lede?: string;
  primary?: CtaAction;
  secondary?: CtaAction;
  shader?: ShaderFamily;
}) {
  return (
    <section
      className="wf-section surface-crimson gec-shader-host gec-fallback-liquid final-cta"
      data-surface="crimson"
    >
      <ShaderLayer family={shader} />

      <div className="brand-card final-cta__card">
        <span className="status-badge badge-gold final-cta__badge">{kicker}</span>
        <h2 className="h2-section final-cta__heading">{heading}</h2>
        <p className="body-editorial final-cta__lede">{lede}</p>
        <div className="final-cta__actions">
          <ViewTransitionLink href={primary.href} className="gec-btn btn-crimson final-cta__cta">
            {primary.label}
          </ViewTransitionLink>
          <ViewTransitionLink href={secondary.href} className="gec-btn btn-outline-ink final-cta__cta">
            {secondary.label}
          </ViewTransitionLink>
        </div>
      </div>
    </section>
  );
}
