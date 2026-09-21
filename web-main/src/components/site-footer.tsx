import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { navigation } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer__grid">
          <div className="site-footer__intro">
            <Link href="/" aria-label="Galgotias Entrepreneurship Cell — Home" className="site-footer__logo">
              <BrandMark className="site-footer__logo-mark" />
            </Link>
            <p>A student-driven entrepreneurship ecosystem where ideas are explored and builders grow.</p>
            <p className="site-footer__tagline">Innovate. Inspire. Impact.</p>
          </div>

          <div>
            <h2 className="site-footer__label">Explore</h2>
            <nav className="site-footer__links" aria-label="Footer navigation">
              {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            </nav>
          </div>

          <div>
            <h2 className="site-footer__label">Connect</h2>
            <nav className="site-footer__links" aria-label="Social links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="mailto:contact@ecellgu.in">Email us</a>
            </nav>
          </div>

          <div>
            <h2 className="site-footer__label">The ecosystem</h2>
            <p className="site-footer__copy">GEC connects student builders with mentors, collaborators, and the wider GICRISE innovation ecosystem.</p>
            <a className="site-footer__external" href="https://gicrise.in" target="_blank" rel="noreferrer">Visit GICRISE <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Galgotias Entrepreneurship Cell</span>
          <span>Powered by students. Built for builders.</span>
        </div>
      </div>
    </footer>
  );
}
