import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import './site-footer.css';

const FOOTER_NAV_ROUTES = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About GEC' },
  { href: '/teams', label: 'The 7 Teams' },
  { href: '/initiatives', label: 'Initiatives & SDP' },
  { href: '/stories', label: 'Stories & Portfolio' },
];

/**
 * Global site footer. Server component — no client interactivity, so it
 * renders directly from `layout.tsx` after `{children}`.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer" data-surface="charcoal">
      <div className="footer-grid-structure">
        <div>
          <div className="brand-mark site-footer__brand">
            <div className="brand-emblem-svg">GEC</div>
            <div className="brand-typography">
              <span className="brand-title site-footer__brand-title">GALGOTIAS</span>
              <span className="brand-sub site-footer__brand-sub">ENTREPRENEURSHIP CELL</span>
            </div>
          </div>
          <p className="site-footer__blurb">
            Galgotias Entrepreneurship Cell is a student-driven entrepreneurial
            community where ideas are explored, skills are built, and
            aspiring founders find the people, opportunities, and support
            needed to take their next step.
          </p>
          <div className="site-footer__tagline">Innovate. Inspire. Impact.</div>
        </div>

        <div>
          <div className="site-footer__heading">Navigation</div>
          <ul className="site-footer__list">
            {FOOTER_NAV_ROUTES.map((route) => (
              <li key={route.href}>
                <ViewTransitionLink href={route.href} className="site-footer__link">
                  {route.label}
                </ViewTransitionLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="site-footer__heading">Connect</div>
          <ul className="site-footer__list">
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="site-footer__link">
                Instagram (@gec_galgotias)
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="site-footer__link">
                LinkedIn (Galgotias E-Cell)
              </a>
            </li>
            <li>
              <a href="mailto:contact@ecellgu.in" className="site-footer__link">
                Email: contact@ecellgu.in
              </a>
            </li>
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

      <div className="footer-sub-bar">
        <span>Galgotias Entrepreneurship Cell © 2026</span>
        <span className="site-footer__powered">POWERED BY STUDENTS. BUILT FOR BUILDERS.</span>
      </div>
    </footer>
  );
}
