import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Galgotias Entrepreneurship Cell',
  description: 'The story, mission and manifesto behind GEC.',
};

const PIPELINE_STAGES = [
  {
    label: 'Stage 01 · GEC Community',
    color: 'var(--gec-crimson)',
    description: 'Ideation, team formation, hackathons & peer builder cohorts',
  },
  {
    label: 'Stage 02 · SDP Accelerator',
    color: 'var(--gec-gold)',
    description: '12-week intensive prototyping, pitch coaching, and MVP validation',
  },
  {
    label: 'Stage 03 · GICRISE Incubation',
    color: 'var(--gec-blue)',
    description: 'Formal seed grant funding, legal incorporation, and angel demo day',
  },
];

const CORE_LEADERSHIP = [
  {
    name: 'Simran Jaiswal',
    role: 'President',
    bio: 'Executive direction and strategic vision across all 7 operational teams.',
  },
  {
    name: 'Anant Gupta',
    role: 'Vice President',
    bio: 'Operations oversight, initiative execution, and ecosystem coordination.',
  },
  {
    name: 'Mukul Kumar Sharma',
    role: 'Secretary',
    bio: 'Administrative governance, community affairs, and internal liaison.',
  },
];

const ECOSYSTEM_MENTORS = [
  {
    name: 'Mr. Kamal Kishor Malhotra',
    role: 'CEO',
    bio: 'Galgotias Incubation Centre for Research, Innovation, Startup & Entrepreneurs',
  },
  {
    name: 'Mr. Sonu Kadam',
    role: 'Incubation Manager',
    bio: 'GICRISE · Mentoring, incubation programs, and venture screening.',
  },
  {
    name: 'Mr. Sourabh Arya',
    role: 'Marketing Manager',
    bio: 'GICRISE · Brand communications, external alliances, and investor relations.',
  },
];

export default function AboutPage() {
  return (
    <main aria-label="About Galgotias Entrepreneurship Cell">
      {/* ---- Hero ---- */}
      <section className="surface-cream">
        <div className="mx-auto max-w-[900px] px-6 py-24 text-center md:px-10 md:py-32 lg:px-16">
          <span className="font-mono text-xs uppercase tracking-[0.09em] text-[var(--gec-crimson)]">
            Who We Are
          </span>
          <h1
            className="mt-3 font-display font-bold text-[var(--gec-ink)]"
            style={{ fontSize: 'var(--text-3xl)', lineHeight: 1.05 }}
          >
            We Don&rsquo;t Just Talk About Entrepreneurship.
            <br />
            <span className="text-[var(--gec-crimson)]">
              We Create Space to Experience It.
            </span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-[65ch] text-[var(--gec-ink-muted)]"
            style={{ fontSize: 'var(--text-lg)', lineHeight: 1.7 }}
          >
            Galgotias Entrepreneurship Cell is a student-driven community built around
            innovation, leadership, creativity, and entrepreneurship. Through mentorship,
            workshops, startup-focused programs, and collaborative experiences, GEC
            encourages students to turn curiosity into action.
          </p>
        </div>
      </section>

      {/* ---- Origin & the GICRISE ecosystem ---- */}
      <section className="surface-sand">
        <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-14 md:px-10 md:pt-24 md:pb-16 lg:px-16 lg:pt-28 lg:pb-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[7fr_5fr] lg:items-start lg:gap-10">
            <div>
              <h2
                className="font-display font-bold text-[var(--gec-ink)]"
                style={{ fontSize: 'var(--text-2xl)' }}
              >
                From Curiosity to Community.
              </h2>
              <div className="mt-6 flex max-w-[68ch] flex-col gap-4 text-[var(--gec-ink-muted)]" style={{ fontSize: 'var(--text-base)', lineHeight: 1.7 }}>
                <p>
                  GEC exists to bring together students who want to think differently,
                  solve problems, and explore entrepreneurship beyond classrooms.
                </p>
                <p>
                  The community grows around startup development, pitching sessions,
                  workshops, founder interactions, networking, and practical experiences
                  that allow students to learn entrepreneurship by participating in it.
                </p>
                <p>
                  GEC works within the wider Galgotias innovation ecosystem alongside the{' '}
                  <strong className="text-[var(--gec-ink)]">
                    Galgotias Incubation Centre for Research, Innovation, Startup &amp;
                    Entrepreneurs — GICRISE
                  </strong>
                  .
                </p>
                <p>
                  GICRISE supports startups and student innovators through mentorship,
                  exposure, networking, incubation, and growth opportunities.
                </p>
              </div>
            </div>

            <div
              className="surface-card rounded-2xl p-8"
              style={{ boxShadow: 'var(--elev-lifted)' }}
            >
              <span
                className="inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.06em] text-[var(--gec-crimson)]"
                style={{ borderColor: 'var(--gec-crimson)' }}
              >
                Incubation Pipeline Matrix
              </span>
              <h3
                className="mt-4 font-display font-bold text-[var(--gec-ink)]"
                style={{ fontSize: 'var(--text-lg)' }}
              >
                Student Idea to Market Venture
              </h3>
              <div className="mt-5 flex flex-col gap-4">
                {PIPELINE_STAGES.map((stage) => (
                  <div key={stage.label} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span
                        className="font-mono text-xs font-bold uppercase tracking-[0.05em]"
                        style={{ color: stage.color }}
                      >
                        {stage.label}
                      </span>
                    </div>
                    <p
                      className="pl-4 text-[var(--gec-ink-muted)]"
                      style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
                    >
                      {stage.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Mission & Vision ---- */}
      <section className="surface-cream">
        <div className="mx-auto max-w-[1200px] px-6 pt-12 pb-12 md:px-10 md:pt-14 md:pb-14 lg:px-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div
              className="surface-card rounded-2xl p-9"
              style={{ boxShadow: 'var(--elev-raised)', borderTop: '2px solid var(--gec-crimson)' }}
            >
              <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[var(--gec-crimson)]">
                Our Mission
              </span>
              <h2
                className="mt-3 font-display font-bold text-[var(--gec-crimson)]"
                style={{ fontSize: 'var(--text-xl)' }}
              >
                Create Builders, Not Spectators.
              </h2>
              <p
                className="mt-4 max-w-[62ch] text-[var(--gec-ink)]"
                style={{ fontSize: 'var(--text-base)', lineHeight: 1.7 }}
              >
                Our mission is to foster an entrepreneurial mindset among students by
                creating opportunities to ideate, collaborate, experiment, lead, and
                execute.
              </p>
              <p
                className="mt-3 max-w-[62ch] text-[var(--gec-ink-muted)]"
                style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
              >
                We aim to connect students with the knowledge, mentorship, and ecosystem
                required to move from curiosity toward meaningful action.
              </p>
            </div>

            <div
              className="surface-card rounded-2xl p-9"
              style={{ boxShadow: 'var(--elev-raised)', borderTop: '2px solid var(--gec-gold)' }}
            >
              <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[var(--gec-ink)]">
                Our Vision
              </span>
              <h2
                className="mt-3 font-display font-bold text-[var(--gec-ink)]"
                style={{ fontSize: 'var(--text-xl)' }}
              >
                A Campus Where Ideas Have Somewhere to Go.
              </h2>
              <p
                className="mt-4 max-w-[62ch] text-[var(--gec-ink)]"
                style={{ fontSize: 'var(--text-base)', lineHeight: 1.7 }}
              >
                Our vision is to build a thriving student entrepreneurship ecosystem where
                ambitious ideas can find collaborators, guidance, opportunities, and a
                pathway toward becoming impactful ventures.
              </p>
              <p
                className="mt-3 max-w-[62ch] text-[var(--gec-ink-muted)]"
                style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
              >
                Transforming campus talent into fearless problem solvers ready to lead
                India&rsquo;s technology and economic frontier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Leadership & Mentors ---- */}
      <section className="surface-sand">
        <div className="mx-auto max-w-[1100px] px-6 pt-28 pb-28 md:px-10 md:pt-32 md:pb-36 lg:px-16 lg:pt-36 lg:pb-40">
          <div className="max-w-[65ch]">
            <h2
              className="font-display font-bold text-[var(--gec-ink)]"
              style={{ fontSize: 'var(--text-2xl)' }}
            >
              Student-Led. Mentor-Guided.
            </h2>
            <p
              className="mt-4 text-[var(--gec-ink-muted)]"
              style={{ fontSize: 'var(--text-base)', lineHeight: 1.7 }}
            >
              GEC is driven by students and strengthened by experienced mentors from the
              wider Galgotias innovation ecosystem.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
            <div>
              <h3
                className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[var(--gec-crimson)]"
              >
                Core Leadership
              </h3>
              <ul className="mt-5 flex flex-col gap-5 border-t border-[var(--gec-border)]">
                {CORE_LEADERSHIP.map((person) => (
                  <li key={person.name} className="pt-5">
                    <p className="font-display font-bold text-[var(--gec-ink)]" style={{ fontSize: 'var(--text-base)' }}>
                      {person.name}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-[0.04em] text-[var(--gec-crimson)]">
                      {person.role}
                    </p>
                    <p className="mt-1.5 text-[var(--gec-ink-muted)]" style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                      {person.bio}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3
                className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[var(--gec-blue)]"
              >
                Ecosystem Mentors
              </h3>
              <ul className="mt-5 flex flex-col gap-5 border-t border-[var(--gec-border)]">
                {ECOSYSTEM_MENTORS.map((person) => (
                  <li key={person.name} className="pt-5">
                    <p className="font-display font-bold text-[var(--gec-ink)]" style={{ fontSize: 'var(--text-base)' }}>
                      {person.name}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-[0.04em] text-[var(--gec-blue)]">
                      {person.role}
                    </p>
                    <p className="mt-1.5 text-[var(--gec-ink-muted)]" style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                      {person.bio}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Teams banner ---- */}
      <section className="surface-cream">
        <div className="mx-auto max-w-[1100px] px-6 pt-16 pb-24 md:px-10 md:pt-20 md:pb-28 lg:px-16">
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-[var(--gec-border)] p-10 sm:flex-row sm:items-center" style={{ background: 'var(--gec-surface-sand)' }}>
            <div className="max-w-[52ch]">
              <span className="font-mono text-xs uppercase tracking-[0.09em] text-[var(--gec-crimson)]">
                Team Architecture
              </span>
              <h2
                className="mt-3 font-display font-bold text-[var(--gec-ink)]"
                style={{ fontSize: 'var(--text-xl)' }}
              >
                7 Teams. One Vision.
              </h2>
              <p
                className="mt-3 text-[var(--gec-ink-muted)]"
                style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
              >
                Seven specialised teams work together to run the community, build
                opportunities, and execute the initiatives of GEC.
              </p>
            </div>
            <Link
              href="/teams"
              className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-[var(--gec-crimson)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--gec-crimson-act)]"
              style={{ transitionDuration: 'var(--dur-ui)' }}
            >
              Meet Our Teams →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
