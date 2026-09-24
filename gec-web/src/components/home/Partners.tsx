import Image from 'next/image';
import './partners.css';

// styled.html 2956–3008 ("1.8 Partners Section"). Drop a logo into
// public/partners/ and set `logo` on the entry; until then the box shows the name.
type Partner = { name: string; tag: string; href: string; logo?: string };

const PARTNERS: readonly Partner[] = [
  { name: 'STARTUP INDIA', href: 'https://www.startupindia.gov.in/', tag: 'DPIIT Recognized', logo: '/partners/startup-india.png' },
  { name: 'MSME', href: 'https://msme.gov.in/', tag: 'Ministry Host', logo: '/partners/msme.svg' },
  { name: 'IIC GU', href: 'https://iic.mic.gov.in/', tag: 'Innovation Council', logo: '/partners/iic-gu.png' },
  { name: 'AWS ACTIVATE', href: 'https://aws.amazon.com/startups/', tag: '$10k Cloud Credits', logo: '/partners/aws.svg' },
  { name: 'GITHUB CAMPUS', href: 'https://education.github.com/', tag: 'Dev Tools Tier', logo: '/partners/github.svg' },
  { name: 'WADHWANI', href: 'https://wadhwanifoundation.org/', tag: 'Curriculum Partner', logo: '/partners/wadhwani.png' },
];

export function Partners() {
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
        {PARTNERS.map((partner) => (
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
