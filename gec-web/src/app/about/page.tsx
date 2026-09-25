import type { Metadata } from 'next';
import Image from 'next/image';
import { RouteHero } from '@/components/route/RouteHero';
import { FinalCta } from '@/components/home/FinalCta';
import { ShaderLayer } from '@/components/ShaderLayer';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';

export const metadata: Metadata = {
  title: 'About',
  description: "How Galgotias University's Entrepreneurship Cell turns student ideas into startups: our story, mission, vision, leadership and milestones.",
  alternates: { canonical: '/about' },
};

const PIPELINE_STAGES = [
  { label: 'Stage 01 · GEC Community', color: 'var(--gec-crimson)', text: 'var(--gec-crimson)', description: 'Ideation, team formation, hackathons & peer builder cohorts' },
  { label: 'Stage 02 · SDP Accelerator', color: 'var(--gec-gold)', text: '#8A6D00', description: '12-week intensive prototyping, pitch coaching, and MVP validation' },
  { label: 'Stage 03 · GICRISE Incubation', color: 'var(--gec-blue)', text: 'var(--gec-blue)', description: 'Formal seed grant funding, legal incorporation, and angel demo day' },
];

// Portraits: drop a photo into public/leadership/ and set `photo` on the entry;
// until then the frame shows initials.
type Person = { name: string; initials: string; role: string; bio: string; photo?: string };

const CORE_LEADERSHIP: Person[] = [
  { name: 'Simran Jaiswal', initials: 'SJ', role: 'President', bio: 'Executive direction and strategic vision across all 7 operational teams.' },
  { name: 'Anant Gupta', initials: 'AG', role: 'Vice President', bio: 'Operations oversight, initiative execution, and ecosystem coordination.' },
  { name: 'Mukul Kumar Sharma', initials: 'MS', role: 'Secretary', bio: 'Administrative governance, community affairs, and internal liaison.' },
];

const ECOSYSTEM_MENTORS: Person[] = [
  { name: 'Mr. Kamal Kishor Malhotra', initials: 'KM', role: 'CEO', bio: 'Galgotias Incubation Centre for Research, Innovation, Startup & Entrepreneurs' },
  { name: 'Mr. Sonu Kadam', initials: 'SK', role: 'Incubation Manager', bio: 'GICRISE · Mentoring, incubation programs, and venture screening.' },
  { name: 'Mr. Sourabh Arya', initials: 'SA', role: 'Marketing Manager', bio: 'GICRISE · Brand communications, external alliances, and investor relations.' },
];

function Portrait({ person }: { person: Person }) {
  return (
    <div className="rt-portrait">
      {person.photo ? (
        <Image src={person.photo} alt={person.name} fill sizes="(max-width: 900px) 100vw, 30vw" className="rt-portrait__img" />
      ) : (
        <span className="rt-portrait__initials" aria-hidden="true">{person.initials}</span>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main aria-label="About Galgotias Entrepreneurship Cell">
      <RouteHero
        kicker="WHO WE ARE"
        title="We Don’t Just Talk About Entrepreneurship."
        accent="We Create Space to Experience It."
        lede="Galgotias Entrepreneurship Cell is a student-driven community built around innovation, leadership, creativity, and entrepreneurship. Through mentorship, workshops, startup-focused programs, and collaborative experiences, GEC encourages students to turn curiosity into action."
        anchors={[
          { href: '#origin', label: 'Our story' },
          { href: '#leadership', label: 'Leadership' },
        ]}
      />

      <section id="origin" className="wf-section surface-sand gec-shader-host" data-surface="sand">
        <ShaderLayer family="halftone" />
        <div className="rt-wrap rt-grid">
          <div className="rt-c7 rt-stack">
            <h2 className="h2-section">From Curiosity to Community.</h2>
            <p className="body-editorial">
              GEC exists to bring together students who want to think differently, solve problems, and explore
              entrepreneurship beyond classrooms.
            </p>
            <p className="body-editorial">
              The community grows around startup development, pitching sessions, workshops, founder interactions,
              networking, and practical experiences that allow students to learn entrepreneurship by participating in it.
            </p>
            <p className="body-editorial">
              GEC works within the wider Galgotias innovation ecosystem alongside the{' '}
              <strong style={{ color: 'var(--gec-ink)' }}>
                Galgotias Incubation Centre for Research, Innovation, Startup &amp; Entrepreneurs — GICRISE
              </strong>
              .
            </p>
            <p className="body-editorial">
              GICRISE supports startups and student innovators through mentorship, exposure, networking, incubation, and
              growth opportunities.
            </p>
          </div>
          <aside className="rt-c5 brand-card">
            <span className="status-badge badge-outline">Incubation Pipeline Matrix</span>
            <h3 className="h3-card" style={{ marginTop: 14 }}>Student Idea to Market Venture</h3>
            <ol className="rt-timeline">
              {PIPELINE_STAGES.map((s) => (
                <li key={s.label}>
                  <span className="rt-timeline__dot" style={{ background: s.color }} aria-hidden="true" />
                  <div className="rt-mono" style={{ color: s.text }}>{s.label}</div>
                  <p className="body-editorial">{s.description}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="wf-section surface-cream gec-shader-host" data-surface="cream">
        <ShaderLayer family="hatch" />
        <div className="rt-wrap rt-grid">
          <article className="rt-c6 brand-card rt-stack rt-rule-top">
            <span className="editorial-kicker">OUR MISSION</span>
            <h2 className="h2-section rt-accent">Create Builders, Not Spectators.</h2>
            <p className="body-editorial" style={{ color: 'var(--gec-ink)' }}>
              Our mission is to foster an entrepreneurial mindset among students by creating opportunities to ideate,
              collaborate, experiment, lead, and execute.
            </p>
            <p className="body-editorial">
              We aim to connect students with the knowledge, mentorship, and ecosystem required to move from curiosity
              toward meaningful action.
            </p>
          </article>
          <article className="rt-c6 brand-card rt-stack rt-rule-top rt-rule-top--gold">
            <span className="editorial-kicker" style={{ color: 'var(--gec-ink)' }}>OUR VISION</span>
            <h2 className="h2-section">A Campus Where Ideas Have Somewhere to Go.</h2>
            <p className="body-editorial" style={{ color: 'var(--gec-ink)' }}>
              Our vision is to build a thriving student entrepreneurship ecosystem where ambitious ideas can find
              collaborators, guidance, opportunities, and a pathway toward becoming impactful ventures.
            </p>
            <p className="body-editorial">
              Transforming campus talent into fearless problem solvers ready to lead India&rsquo;s technology and
              economic frontier.
            </p>
          </article>
        </div>
      </section>

      <section id="leadership" className="wf-section surface-sand gec-shader-host" data-surface="sand">
        <ShaderLayer family="halftone" />
        <div className="rt-wrap">
          <div className="rt-head__copy">
            <span className="editorial-kicker">GOVERNANCE &amp; GUIDANCE</span>
            <h2 className="h2-section">Student-Led. Mentor-Guided.</h2>
            <p className="body-editorial">
              GEC is driven by students and strengthened by experienced mentors from the wider Galgotias innovation
              ecosystem.
            </p>
          </div>
          <div className="rt-row-label rt-mono">Core Leadership</div>
          <div className="rt-grid">
            {CORE_LEADERSHIP.map((p) => (
              <article key={p.name} className="rt-c4 brand-card rt-person">
                <Portrait person={p} />
                <h3 className="h3-card">{p.name}</h3>
                <div className="rt-mono rt-accent">{p.role}</div>
                <p className="body-editorial">{p.bio}</p>
              </article>
            ))}
          </div>
          <div className="rt-row-label rt-mono">Ecosystem Mentors · GICRISE</div>
          <div className="rt-grid">
            {ECOSYSTEM_MENTORS.map((p) => (
              <article key={p.name} className="rt-c4 brand-card rt-person rt-person--mentor">
                <Portrait person={p} />
                <h3 className="h3-card">{p.name}</h3>
                <div className="rt-mono rt-muted">{p.role}</div>
                <p className="body-editorial">{p.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wf-section surface-cream gec-shader-host" data-surface="cream">
        <ShaderLayer family="hatch" />
        <div className="rt-wrap">
          <ViewTransitionLink href="/teams" className="brand-card rt-bridge">
            <div className="rt-bridge__copy">
              <span className="editorial-kicker">TEAM ARCHITECTURE</span>
              <h2 className="h2-section">
                <span className="rt-accent">7 Teams.</span> One Vision.
              </h2>
              <p className="body-editorial" style={{ marginTop: 12 }}>
                Seven specialised teams work together to run the community, build opportunities, and execute the
                initiatives of GEC.
              </p>
            </div>
            <span className="gec-btn btn-crimson rt-bridge__cta">Meet Our Teams →</span>
          </ViewTransitionLink>
        </div>
      </section>

      <FinalCta
        shader="riso"
        primary={{ href: '/teams', label: 'Join GEC' }}
        secondary={{ href: '/initiatives', label: 'Discover Initiatives' }}
      />
    </main>
  );
}
