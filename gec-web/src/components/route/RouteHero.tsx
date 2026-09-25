import type { ReactNode } from 'react';
import { ShaderLayer } from '@/components/ShaderLayer';
import './route.css';

/** Shared hero for /about, /teams, /initiatives, /stories (route layouts plan §0). */
export function RouteHero({
  kicker,
  title,
  accent,
  lede,
  anchors,
  aside,
  children,
}: {
  kicker: string;
  title: ReactNode;
  accent?: ReactNode;
  lede: ReactNode;
  anchors?: { href: string; label: string }[];
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="wf-section surface-cream gec-shader-host rt-hero" data-surface="cream">
      <ShaderLayer family="contour" />
      <div className="rt-wrap rt-grid">
        <div className="rt-c8">
          <span className="editorial-kicker">{kicker}</span>
          <h1 className="h1-display rt-hero__title">
            {title}
            {accent && (
              <>
                {' '}
                <span className="rt-accent">{accent}</span>
              </>
            )}
          </h1>
          <p className="body-editorial rt-lede">{lede}</p>
          {anchors && (
            <div className="rt-hero__anchors">
              {anchors.map((a) => (
                <a key={a.href} className="rt-link" href={a.href}>
                  {a.label} ↓
                </a>
              ))}
            </div>
          )}
          {children}
        </div>
        {aside && <div className="rt-c4 rt-hero__aside">{aside}</div>}
      </div>
    </section>
  );
}
