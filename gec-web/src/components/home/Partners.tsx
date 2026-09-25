import Image from 'next/image';
import type { Partner } from '@/content/partners';
import './partners.css';

// styled.html 2956–3008 ("1.8 Partners Section").

export function Partners({ items }: { items: Partner[] }) {
  return (
    <section className="wf-section surface-cream partners" data-surface="cream">
      <div className="partners__intro">
        <span className="editorial-kicker">INSTITUTIONAL ECOSYSTEM</span>
        <h2 className="h2-section partners__heading">Built With an Ecosystem.</h2>
        <p className="body-editorial partners__lede">
          Entrepreneurship does not happen in isolation. GEC works alongside mentors, institutions, communities, and
          ecosystem partners to create opportunities for student innovators and aspiring founders.
        </p>
      </div>

      <div className="brand-card partners__anchor">
        <span className="status-badge badge-crimson partners__anchor-badge">PRIMARY INCUBATION ANCHOR</span>
        <div className="partners__anchor-name">GICRISE</div>
        <div className="partners__anchor-title">
          Galgotias Incubation Centre for Research, Innovation, Startup & Entrepreneurs
        </div>
        <p className="partners__anchor-desc">
          Providing seed incubation, prototype funding grants, faculty intellectual property support, and dedicated
          startup lab infrastructure.
        </p>
      </div>

      <div className="partner-logos-strip">
        {items.map((partner) => (
          <a className="partner-logo-box" key={partner.name} href={partner.href} target="_blank" rel="noreferrer" aria-label={`${partner.name}: ${partner.tag} (opens in new tab)`}>
            {partner.logo ? (
              <div className="partners__logo-img">
                {/* unoptimized: next/image rejects SVG through the optimizer; logos are tiny anyway. */}
                <Image src={partner.logo} alt={partner.name} fill sizes="200px" unoptimized />
              </div>
            ) : (
              <div className="partners__logo-name">{partner.name}</div>
            )}
            <div className="partners__logo-tag">{partner.tag}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
