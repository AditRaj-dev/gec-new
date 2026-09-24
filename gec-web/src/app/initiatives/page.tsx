import type { Metadata } from 'next';
import { RouteHero } from '@/components/route/RouteHero';
import { DeskRunway } from '@/components/home/DeskAct';
import { FinalCta } from '@/components/home/FinalCta';
import { ShaderLayer } from '@/components/ShaderLayer';
import { ProgramForm, type ProgramField } from '@/components/route/ProgramForm';

export const metadata: Metadata = {
  title: 'Initiatives | Galgotias Entrepreneurship Cell',
  description: 'Startup Development Program, pitching arenas and founder workshops at Galgotias Entrepreneurship Cell.',
};

// Wireframe copy, styled.html 3830–3900.
const PROGRAMMES = [
  {
    badge: 'Applications Open', badgeClass: 'badge-crimson', cadence: 'Cohort 04', href: '#sdp',
    title: 'Startup Development Program (SDP)',
    body: 'A structured 12-week pre-incubation accelerator taking student teams from problem discovery to investor-ready prototypes and pilot customers.',
    highlights: 'Faculty mentors · Prototyping sandbox · Pre-seed demo day',
  },
  {
    badge: 'Ongoing Sessions', badgeClass: 'badge-gold', cadence: 'Monthly', href: '#desk',
    title: 'Pitching Sessions & Shark Arena',
    body: 'High-intensity arena where student founders pitch live before venture capitalists, angel syndicates, and experienced mentors for critique and capital.',
    highlights: 'Angel feedback · Term-sheet coaching · Demo slots',
  },
  {
    badge: 'Upcoming Series', badgeClass: 'badge-blue', cadence: 'Weekly', href: '#desk',
    title: 'Founder Workshops & Masterclasses',
    body: 'Practical, tactical sessions led by operators and founders on customer discovery, unit economics, tech architecture, and fundraising.',
    highlights: 'Hands-on frameworks · Real financial models · Live Q&A',
  },
];

const PHASES = [
  ['Phase 01 · Weeks 1–3', 'Ideation', 'Problem validation, TAM sizing, and 50+ customer interviews.'],
  ['Phase 02 · Weeks 4–6', 'MVP Build', 'Prototyping sandbox, tech architecture, and no-code MVPs.'],
  ['Phase 03 · Weeks 7–9', 'Traction', 'Campus pilot testing, initial user feedback, and metric tracking.'],
  ['Phase 04 · Weeks 10–12', 'Demo Day', 'Pitch deck polishing and closed-door presentations to angel VCs.'],
];

const FAQ = [
  ['Who is eligible to apply for SDP Cohort 04?', 'Any registered student team of 2 to 5 members from Galgotias University or GCET with an original idea or working hardware/software prototype may apply.'],
  ['What incubation support does GICRISE offer?', 'Top cohort teams receive co-working desk access, legal incorporation assistance, patent filing facilitation, and closed-door demo presentations to angel investors.'],
  ['Is there any equity or registration fee?', 'Zero fees and zero equity. GEC is completely student-driven and supported by Galgotias University and GICRISE to empower student builders.'],
];

const SDP_STEPS = [
  ['Apply', 'Closes 28 Sep · 23:59 IST'],
  ['Shortlist', 'Emailed within 3 working days'],
  ['Interview', '15 minutes with the SDP panel'],
  ['Kickoff', 'Week 1 of the 12-week sprint'],
] as const;

const SDP_FIELDS: readonly ProgramField[] = [
  { name: 'fullName', label: 'Team lead name', placeholder: 'e.g. Priyanshu Sharma' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@galgotias.edu' },
  { name: 'phone', label: 'WhatsApp', type: 'tel', placeholder: '+91 98765 43210' },
  { name: 'teamSize', label: 'Team size', type: 'select', options: ['2', '3', '4', '5'] },
  { name: 'venture', label: 'Venture / idea name', placeholder: 'e.g. FarmVision AI', wide: true },
  { name: 'stage', label: 'Where are you today?', type: 'select', options: ['Validated problem', 'Working prototype', 'Early users'], wide: true },
  { name: 'pitch', label: 'The problem, in two sentences', type: 'textarea', placeholder: 'Who hurts, and how you know.', wide: true },
];

// ponytail: draft briefs written from the hero's four tracks — replace with the official Ideathon 2026 statements.
const IDEATHON_TRACKS = ['AI', 'Climate', 'Hardware', 'Fintech'] as const;
const PROBLEM_STATEMENTS = [
  { id: 'PS-01', track: 'AI', title: 'Lecture-to-Notes for Regional Languages', brief: 'Turn a recorded Hindi or mixed-language lecture into searchable, structured notes a first-year student can revise from.' },
  { id: 'PS-02', track: 'AI', title: 'Placement Prep Copilot', brief: 'Match a student’s resume against campus recruiter JDs and generate a 14-day, gap-first preparation plan.' },
  { id: 'PS-03', track: 'Climate', title: 'Campus Energy Leak Map', brief: 'Use existing meter or IoT data to spot hostel blocks and labs that waste power, and nudge the people who can fix it.' },
  { id: 'PS-04', track: 'Climate', title: 'Mess Food-Waste Loop', brief: 'Predict daily mess demand and route surplus to NGOs or compost before it spoils.' },
  { id: 'PS-05', track: 'Hardware', title: 'Sub-₹2,000 Air-Quality Node', brief: 'A buildable sensor node that reports PM2.5 for Greater Noida classrooms and survives a monsoon.' },
  { id: 'PS-06', track: 'Fintech', title: 'Student Credit Without a Credit Score', brief: 'Design a fair way to underwrite small student loans (laptops, fees) using signals students already have.' },
] as const;

const IDEATHON_FIELDS: readonly ProgramField[] = [
  { name: 'teamName', label: 'Team name', placeholder: 'e.g. Null Pointers' },
  { name: 'fullName', label: 'Team lead name', placeholder: 'e.g. Priyanshu Sharma' },
  { name: 'email', label: 'Lead email', type: 'email', placeholder: 'you@galgotias.edu' },
  { name: 'phone', label: 'Lead WhatsApp', type: 'tel', placeholder: '+91 98765 43210' },
  { name: 'track', label: 'Track', type: 'select', options: IDEATHON_TRACKS },
  { name: 'statement', label: 'Problem statement', type: 'select', options: PROBLEM_STATEMENTS.map((p) => `${p.id} · ${p.title}`) },
  { name: 'members', label: 'Other members (2–3 names, comma-separated)', placeholder: 'Aarav Singh, Diya Mehta', wide: true },
];

const ESUMMIT_FACTS = [
  ['Venue', 'Main Auditorium 01'],
  ['Hours', '09:30 – 18:00 IST'],
  ['Capacity', '480 seats'],
  ['Entry', 'Free · college ID'],
] as const;

// ponytail: draft run-of-show from the hero card (09:30–18:00, 12 keynotes, Pitch Arena) — replace with the final schedule.
const SCHEDULE = [
  {
    stage: 'Main Stage · Auditorium 01',
    slots: [
      ['09:30', 'Doors & registration', 'Collect your delegate band at the auditorium foyer.'],
      ['10:00', 'Opening keynote', 'Why campus is the cheapest place to start a company.'],
      ['11:15', 'Founder fireside', 'Two alumni founders on their first ₹1 of revenue.'],
      ['13:00', 'Lunch & expo floor', 'Student venture stalls open across Campus Hub.'],
      ['14:30', 'Keynote block', 'Operators on hiring, distribution and fundraising.'],
      ['17:15', 'Awards & closing', 'Pitch Arena winners and grant announcements.'],
    ],
  },
  {
    stage: 'Pitch Arena · Seminar Hall',
    slots: [
      ['10:30', 'Pitch round 1', '10 shortlisted teams · 5-minute pitch, 5-minute grill.'],
      ['12:00', 'Angel office hours', 'Book 15-minute slots with visiting investors.'],
      ['14:00', 'Pitch round 2', '10 more teams in front of the angel panel.'],
      ['16:00', 'Finals', 'Top 5 pitch for the grant pool.'],
    ],
  },
] as const;

export default function InitiativesPage() {
  return (
    <main aria-label="GEC Initiatives">
      <RouteHero
        kicker="ACTION OVER THEORY"
        title="Ideas Need More"
        accent="Than Inspiration."
        lede="Our initiatives are designed to give students opportunities to explore entrepreneurship through building, pitching, learning, collaborating, and connecting with the ecosystem. Every initiative solves a different problem. Every initiative creates a different path forward."
        anchors={[
          { href: '#desk', label: 'Open the desk' },
          { href: '#programmes', label: 'All programmes' },
          { href: '#ideathon', label: 'Ideathon' },
          { href: '#esummit', label: 'E-Summit' },
        ]}
      />

      <DeskRunway />

      <section id="programmes" className="wf-section surface-sand gec-shader-host" data-surface="sand">
        <ShaderLayer family="halftone" />
        <div className="rt-wrap">
          <div className="rt-head">
            <div className="rt-head__copy">
              <span className="editorial-kicker">PROGRAMMES</span>
              <h2 className="h2-section">Pick Your Path.</h2>
            </div>
          </div>
          <div className="rt-offset">
            {PROGRAMMES.map((p) => (
              <article key={p.title} className="brand-card rt-program">
                <div>
                  <div className="rt-program__meta">
                    <span className={`status-badge ${p.badgeClass}`}>{p.badge}</span>
                    <span className="rt-mono rt-muted">{p.cadence}</span>
                  </div>
                  <h3 className="h3-card">{p.title}</h3>
                  <p className="body-editorial">{p.body}</p>
                  <div className="rt-hl"><span className="rt-mono">Highlights:</span> {p.highlights}</div>
                </div>
                <a className="rt-link" href={p.href} style={{ marginTop: 20 }}>Explore Initiative →</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sdp" className="wf-section surface-cream gec-shader-host" data-surface="cream">
        <ShaderLayer family="hatch" />
        <div className="rt-wrap">
          <span className="editorial-kicker">FLAGSHIP PROGRAM · COHORT 04</span>
          <h2 className="h2-section">Startup Development Program (SDP)</h2>
          <p className="body-editorial" style={{ marginTop: 12 }}>
            A 12-week intensive pre-incubation sandbox for Galgotias student builders, providing mentorship, pitch
            coaching, and fast-track GICRISE incubation.
          </p>

          <div className="rt-phases">
            {PHASES.map(([when, name, body]) => (
              <div key={name} className="rt-phase">
                <div className="rt-mono rt-accent">{when}</div>
                <h3 className="h3-card">{name}</h3>
                <p className="body-editorial">{body}</p>
              </div>
            ))}
          </div>

          <div className="rt-grid">
            <div className="rt-c7 rt-stack rt-faq">
              <div className="rt-mono">Overview &amp; why it exists</div>
              <p className="body-editorial">
                SDP bridges the gap between classroom theory and real venture creation. Built by student founders for
                student founders, it equips participants with customer discovery frameworks, legal basics, and
                functional prototyping guidance.
              </p>
              <div className="rt-mono" style={{ marginTop: 28 }}>Frequently asked questions</div>
              {FAQ.map(([q, a], i) => (
                <details key={q} open={i === 0}>
                  <summary>{q}</summary>
                  <p className="body-editorial">{a}</p>
                </details>
              ))}
            </div>
            <aside className="rt-c5 brand-card rt-stack" style={{ alignSelf: 'start' }}>
              <div className="rt-mono">Eligibility criteria</div>
              <p className="body-editorial" style={{ fontSize: 14 }}>
                ✓ Galgotias Student Builders &amp; Aspiring Founders
                <br />✓ Multidisciplinary Teams of 2 to 5 Members
                <br />✓ Working Proof of Concept or Validated Problem Statement
              </p>
              <a className="gec-btn btn-crimson" href="#apply">Apply to Cohort 04 →</a>
            </aside>
          </div>
        </div>
      </section>

      <section id="apply" className="wf-section surface-sand gec-shader-host" data-surface="sand">
        <ShaderLayer family="halftone" />
        <div className="rt-wrap rt-grid">
          <div className="rt-c5 rt-stack">
            <span className="editorial-kicker">APPLY · SDP COHORT 04</span>
            <h2 className="h2-section">Put Your Team Forward.</h2>
            <p className="body-editorial">
              One form per team. Shortlisted teams get a 15-minute interview; 12 teams start the cohort.
            </p>
            <ol className="rt-timeline">
              {SDP_STEPS.map(([step, when]) => (
                <li key={step}>
                  <span className="rt-timeline__dot" style={{ background: 'var(--gec-crimson)' }} />
                  <div className="rt-mono">{step}</div>
                  <p className="body-editorial">{when}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="rt-c7 brand-card">
            <ProgramForm formType="incubation" source="initiatives-sdp" fields={SDP_FIELDS} submitLabel="Submit application →" />
          </div>
        </div>
      </section>

      <section id="ideathon" className="wf-section surface-cream gec-shader-host" data-surface="cream">
        <ShaderLayer family="hatch" />
        <div className="rt-wrap">
          <div className="rt-head">
            <div className="rt-head__copy">
              <span className="editorial-kicker">IDEATHON 2026 · 48-HOUR VENTURE SPRINT</span>
              <h2 className="h2-section">Pick a Problem. Build for 48 Hours.</h2>
              <p className="body-editorial">
                Teams of 3–4 pick one statement, prototype it, and defend it in front of an angel panel.
              </p>
            </div>
            <a className="gec-btn btn-crimson" href="#ideathon-register">Register your team →</a>
          </div>
          <div className="rt-cards">
            {PROBLEM_STATEMENTS.map((p) => (
              <article key={p.id} className="brand-card">
                <span className="status-badge badge-outline rt-card-track">{p.id} · {p.track}</span>
                <h3 className="h3-card">{p.title}</h3>
                <p className="body-editorial" style={{ fontSize: 14, marginTop: 8 }}>{p.brief}</p>
              </article>
            ))}
          </div>
          <div id="ideathon-register" className="rt-grid" style={{ marginTop: 56 }}>
            <div className="rt-c4 rt-stack">
              <span className="editorial-kicker">REGISTRATION</span>
              <h3 className="h3-card">14 team slots left.</h3>
              <p className="body-editorial">The lead registers for the whole team. You can switch statements until the sprint starts.</p>
            </div>
            <div className="rt-c8 brand-card">
              <ProgramForm formType="ideathon" source="initiatives-ideathon" fields={IDEATHON_FIELDS} submitLabel="Register team →" />
            </div>
          </div>
        </div>
      </section>

      <section id="esummit" className="wf-section surface-sand gec-shader-host" data-surface="sand">
        <ShaderLayer family="halftone" />
        <div className="rt-wrap">
          <span className="editorial-kicker">GALGOTIAS E-SUMMIT 2026 · THE BUILDER ARENA</span>
          <h2 className="h2-section">One Day. Two Stages. Free for Students.</h2>
          <p className="body-editorial" style={{ marginTop: 12, maxWidth: '62ch' }}>
            50+ founders, live demo rounds, and angel mixers across Campus Hub. Bring your college ID; no ticket needed.
          </p>
          <div className="rt-facts">
            {ESUMMIT_FACTS.map(([k, v]) => (
              <div key={k}><span className="rt-mono rt-muted">{k}</span><strong>{v}</strong></div>
            ))}
          </div>
          <div id="schedule" className="rt-schedule">
            {SCHEDULE.map((track) => (
              <div key={track.stage} className="brand-card">
                <div className="rt-mono rt-accent" style={{ marginBottom: 8 }}>{track.stage}</div>
                {track.slots.map(([time, title, body]) => (
                  <div key={time + title} className="rt-slot">
                    <span className="rt-mono">{time}</span>
                    <div><strong>{title}</strong><p className="body-editorial">{body}</p></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        shader="riso"
        lede="Applications for SDP Cohort 04 are open now. Zero fees, zero equity."
        primary={{ href: '#sdp', label: 'Apply to SDP' }}
        secondary={{ href: '/stories', label: 'Read Founder Stories' }}
      />
    </main>
  );
}
