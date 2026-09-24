import Image from 'next/image';
import { ShaderLayer } from '@/components/ShaderLayer';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import './speakers.css';

// Vertical portrait cards on an infinite trail. Drop a portrait into
// public/speakers/ and set `photo` on the entry; until then the frame shows initials.
export type Speaker = { initials: string; name: string; role: string; org: string; photo?: string };

export const SPEAKERS: readonly Speaker[] = [
  { initials: 'AG', name: 'Ashneer Grover', role: 'Co-Founder', org: 'BharatPe' },
  { initials: 'AG', name: 'Aman Gupta', role: 'Co-Founder & CMO', org: 'boAt Lifestyle' },
  { initials: 'SJ', name: 'Sandeep Jain', role: 'Founder & CEO', org: 'GeeksforGeeks' },
  { initials: 'SB', name: 'Sanjeev Bikhchandani', role: 'Founder & Vice Chairman', org: 'Info Edge / Naukri.com' },
  { initials: 'DS', name: 'Debojit Sen', role: 'Founder', org: 'Crack-ED' },
  { initials: 'HA', name: 'Himanshu Adlakha', role: 'Co-Founder', org: 'Winston India' },
  { initials: 'IS', name: 'Ishant Sachdeva', role: 'Founder', org: 'Being Chief' },
  { initials: 'TV', name: 'Tushar Vadera', role: 'Founding Member', org: 'Zomato Feeding India' },
];

/** Infinite portrait trail — shared by the home section and /stories#speakers. */
export function SpeakersTrail() {
  return (
    <div className="speakers__trail">
      {/* Two identical runs; the track slides by exactly one run for a seamless loop.
          Each run repeats the list twice so it stays wider than ultrawide viewports. */}
      <div className="speakers__track">
        {[0, 1].map((run) => (
          <ul className="speakers__run" key={run} aria-hidden={run === 1 || undefined}>
            {[...SPEAKERS, ...SPEAKERS].map((speaker, i) => (
              <li className="speakers__card" key={i} aria-hidden={i >= SPEAKERS.length || undefined}>
                <div className="speakers__photo">
                  {speaker.photo ? (
                    <Image src={speaker.photo} alt={run === 0 ? speaker.name : ''} fill sizes="240px" className="speakers__img" />
                  ) : (
                    <span className="speakers__initials" aria-hidden="true">{speaker.initials}</span>
                  )}
                </div>
                <div className="speakers__meta">
                  <div className="speakers__name">{speaker.name}</div>
                  <div className="speakers__role">{speaker.role}</div>
                  <div className="speakers__org">{speaker.org}</div>
                </div>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

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

      <SpeakersTrail />

      <div className="speakers__cta-row">
        <ViewTransitionLink href="/stories#speakers" className="gec-btn btn-white">
          Discover Our Speakers →
        </ViewTransitionLink>
      </div>
    </section>
  );
}
