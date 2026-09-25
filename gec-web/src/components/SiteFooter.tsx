import Image from 'next/image';
import { BrandMark } from '@/components/BrandMark';
import { ShaderLayer } from '@/components/ShaderLayer';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import type { SiteNav } from '@/content/siteNav';
import './site-footer.css';

/**
 * Global site footer. Server component, rendered from `layout.tsx` after `{children}`.
 * Charcoal surface with the `night` contour shader, the full GEC logo on a cream plate,
 * a closing CTA, link columns, partner logos and a watermark wordmark.
 */
export function SiteFooter({ nav }: { nav: SiteNav }) {
  return (
    <footer className="site-footer gec-shader-host" data-surface="charcoal">
      <ShaderLayer family="night" />

      <div className="site-footer__cta">
        <ViewTransitionLink href="/" className="site-footer__logo-plate" aria-label="Galgotias Entrepreneurship Cell, home">
          <BrandMark className="site-footer__logo" />
        </ViewTransitionLink>
        <div className="site-footer__cta-copy">
          <p className="site-footer__cta-kicker">Innovate. Inspire. Impact.</p>
          <p className="site-footer__cta-line">
            Got an idea? <span>Start building it here.</span>
          </p>
        </div>
        <div className="site-footer__cta-actions">
          <ViewTransitionLink href="/initiatives" className="gec-btn btn-crimson">
            Explore Initiatives →
          </ViewTransitionLink>
          <ViewTransitionLink href="/teams" className="gec-btn site-footer__btn-ghost">
            Join a Team
          </ViewTransitionLink>
        </div>
      </div>

      <div className="footer-grid-structure">
        <div>
          <div className="site-footer__heading">About</div>
          <p className="site-footer__blurb">
            Galgotias Entrepreneurship Cell is a student-driven entrepreneurial community where ideas are explored,
            skills are built, and aspiring founders find the people, opportunities, and support needed to take their
            next step.
          </p>
        </div>

        <nav aria-label="Footer">
          <div className="site-footer__heading">Navigation</div>
          <ul className="site-footer__list">
            {nav.footerRoutes.map((route) => (
              <li key={route.href}>
                <ViewTransitionLink href={route.href} className="site-footer__link">
                  {route.label}
                </ViewTransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <div className="site-footer__heading">Connect</div>
          <ul className="site-footer__list">
            {nav.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="site-footer__social"
                  {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  <span className="site-footer__social-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d={s.icon} />
                    </svg>
                  </span>
                  <span>
                    <span className="site-footer__social-label">{s.label}</span>
                    <span className="site-footer__social-handle">{s.handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="site-footer__heading">Ecosystem Portals</div>
          <div className="site-footer__portals">
            <div className="site-footer__portal-row">
              <span className="site-footer__portal-name">ecellgu.in</span>
              <span className="site-footer__portal-tag site-footer__portal-tag--gold">OFFICIAL</span>
            </div>
            <div className="site-footer__portal-row">
              <span className="site-footer__portal-name">gicrise.in</span>
              <span className="site-footer__portal-tag site-footer__portal-tag--blue">INCUBATOR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="site-footer__partners">
        <span className="site-footer__heading site-footer__partners-label">Built with</span>
        <ul className="site-footer__partner-list">
          {nav.footerPartners.map((p) => (
            <li key={p.name} className="site-footer__partner">
              {/* unoptimized: next/image rejects SVG through the optimizer; logos are tiny anyway. */}
              <Image src={p.logo} alt={p.name} fill sizes="120px" unoptimized />
            </li>
          ))}
        </ul>
      </div>

      <div className="site-footer__watermark" aria-hidden="true">GEC</div>

      <div className="footer-sub-bar">
        <span>Galgotias Entrepreneurship Cell © 2026</span>
        <a href="#" className="site-footer__top">Back to top ↑</a>
        <span className="site-footer__powered">POWERED BY STUDENTS. BUILT FOR BUILDERS.</span>
      </div>
    </footer>
  );
}
