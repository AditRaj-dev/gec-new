import { ShaderLayer } from '@/components/ShaderLayer';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import './speakers.css';

// styled.html 2878–2953 ("1.7 Speakers Matrix"). No avatars in the
// wireframe — each speaker is an initials circle, ported as-is.
const SPEAKERS = [
  { initials: 'AG', name: 'Ashneer Grover', role: 'Co-Founder', org: 'BharatPe' },
  { initials: 'AG', name: 'Aman Gupta', role: 'Co-Founder & CMO', org: 'boAt Lifestyle' },
  { initials: 'SJ', name: 'Sandeep Jain', role: 'Founder & CEO', org: 'GeeksforGeeks' },
  { initials: 'SB', name: 'Sanjeev Bikhchandani', role: 'Founder & Vice Chairman', org: 'Info Edge / Naukri.com' },
  { initials: 'DS', name: 'Debojit Sen', role: 'Founder', org: 'Crack-ED' },
  { initials: 'HA', name: 'Himanshu Adlakha', role: 'Co-Founder', org: 'Winston India' },
  { initials: 'IS', name: 'Ishant Sachdeva', role: 'Founder', org: 'Being Chief' },
  { initials: 'TV', name: 'Tushar Vadera', role: 'Founding Member', org: 'Zomato Feeding India' },
] as const;

export function Speakers() {
  return (
    <section
      className="wf-section surface-crimson gec-shader-host gec-fallback-liquid"
      data-surface="crimson"
    >
      <ShaderLayer family="liquid" />

      <div className="speakers__intro">
        <span className="editorial-kicker">REAL-WORLD PERSPECTIVES</span>
        <h2 className="h2-section speakers__heading">Ideas From People Who Built Them.</h2>
        <p className="body-editorial speakers__lede">
          GEC has hosted entrepreneurs and business leaders who bring real-world experiences, lessons, and
          perspectives into the student ecosystem.
        </p>
      </div>

      <div className="speakers-8col-grid">
        {SPEAKERS.map((speaker) => (
          <div className="brand-card speakers__card" key={speaker.name}>
            <div className="speakers__avatar">{speaker.initials}</div>
            <div className="speakers__name">{speaker.name}</div>
            <div className="speakers__role">{speaker.role}</div>
            <div className="speakers__org">{speaker.org}</div>
          </div>
        ))}
      </div>

      <div className="speakers__cta-row">
        <ViewTransitionLink href="/stories" className="gec-btn btn-white">
          Discover Our Speakers →
        </ViewTransitionLink>
      </div>
    </section>
  );
}
