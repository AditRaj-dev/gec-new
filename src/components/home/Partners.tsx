import './partners.css';

// styled.html 2956–3008 ("1.8 Partners Section"). No logo images in the
// wireframe — each partner is a text badge box, ported as-is.
const PARTNERS = [
  { name: 'STARTUP INDIA', tag: 'DPIIT Recognized' },
  { name: 'MSME', tag: 'Ministry Host' },
  { name: 'IIC GU', tag: 'Innovation Council' },
  { name: 'AWS ACTIVATE', tag: '$10k Cloud Credits' },
  { name: 'GITHUB CAMPUS', tag: 'Dev Tools Tier' },
  { name: 'WADHWANI', tag: 'Curriculum Partner' },
] as const;

export function Partners() {
  return (
    <section className="wf-section surface-cream" data-surface="cream">
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
          <div className="partner-logo-box" key={partner.name}>
            <div className="partners__logo-name">{partner.name}</div>
            <div className="partners__logo-tag">{partner.tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
