import Image from 'next/image';
import { BrandMark } from '@/components/BrandMark';
import { ShaderLayer } from '@/components/ShaderLayer';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import './site-footer.css';

const FOOTER_NAV_ROUTES = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About GEC' },
  { href: '/teams', label: 'The 7 Teams' },
  { href: '/initiatives', label: 'Initiatives & SDP' },
  { href: '/stories', label: 'Stories & Portfolio' },
];

const SOCIALS = [
  {
    href: 'https://www.instagram.com/galgotiasecell/',
    label: 'Instagram',
    handle: '@galgotiasecell',
    icon: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm5.3-1.8a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z',
  },
  {
    href: 'https://www.linkedin.com/company/ecell-gu/',
    label: 'LinkedIn',
    handle: 'Galgotias E-Cell',
    icon: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4V9.5Z',
  },
  {
    href: 'mailto:contact@ecellgu.in',
    label: 'Email',
    handle: 'contact@ecellgu.in',
    icon: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4.2 7H4v.9l8 5.3 8-5.3V7h-.2L12 12.2Z',
  },
];

// Same files the home Partners strip uses (public/partners/).
const PARTNERS = [
  { name: 'Startup India', logo: '/partners/startup-india.png' },
  { name: 'MSME', logo: '/partners/msme.svg' },
  { name: 'IIC GU', logo: '/partners/iic-gu.png' },
  { name: 'AWS Activate', logo: '/partners/aws.svg' },
  { name: 'GitHub Campus', logo: '/partners/github.svg' },
  { name: 'Wadhwani', logo: '/partners/wadhwani.png' },
];

/**
 * Global site footer. Server component, rendered from `layout.tsx` after `{children}`.
 * Charcoal surface with the `night` contour shader, the full GEC logo on a cream plate,
 * a closing CTA, link columns, partner logos and a watermark wordmark.
 */
export function SiteFooter() {
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
            {FOOTER_NAV_ROUTES.map((route) => (
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
            {SOCIALS.map((s) => (
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
          {PARTNERS.map((p) => (
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
