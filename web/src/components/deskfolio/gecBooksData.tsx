'use client'

import React from 'react'
import { DeskFolio } from './DeskFolio'
import { haptic } from './haptics'

export interface GecBook {
  id: string
  title: string
  shortTitle: string
  subtitle: string
  themeColor: string
  badge: string
  coverTheme: { base: string; accent: string; ink: 'light' | 'dark' }
  spineColor: string
  cover: React.ReactNode
  backCover?: React.ReactNode
  pages: React.ReactNode[]
}

export interface GecMatTheme {
  id: 'gec-crimson' | 'gec-obsidian' | 'gec-blueprint' | 'gec-parchment' | string
  name: string
  description: string
  swatch: string
  baseColor: string
  gridColor: string
  borderColor: string
  accentColor: string
  ink: 'light' | 'dark'
  style: React.CSSProperties
}

const buildMatBackground = (light: string, mid: string, dark: string, major: string, minor: string) => [
  `repeating-linear-gradient(0deg, ${major} 0 1px, transparent 1px 112px)`,
  `repeating-linear-gradient(90deg, ${major} 0 1px, transparent 1px 112px)`,
  `repeating-linear-gradient(0deg, ${minor} 0 1px, transparent 1px 28px)`,
  `repeating-linear-gradient(90deg, ${minor} 0 1px, transparent 1px 28px)`,
  `radial-gradient(130% 120% at 50% 0%, ${light} 0%, ${mid} 70%, ${dark} 100%)`,
].join(', ')

const makeMat = (
  id: GecMatTheme['id'],
  name: string,
  description: string,
  swatch: string,
  accent: string,
  ink: GecMatTheme['ink'],
  colors: [string, string, string],
  grid: [string, string],
): GecMatTheme => ({
  id, name, description, swatch, baseColor: swatch, gridColor: grid[0], borderColor: grid[0], accentColor: accent, ink,
  style: {
    backgroundColor: swatch,
    backgroundImage: buildMatBackground(...colors, ...grid),
    border: `1px solid ${grid[0]}`,
    boxShadow: `inset 0 0 0 1px ${grid[0]}, inset 0 0 0 9px ${grid[1]}, inset 0 2px 40px rgba(0,0,0,.48), 0 30px 60px -30px rgba(0,0,0,.64)`,
  },
})

const gecCrimsonMat = makeMat('gec-crimson', 'GEC Crimson Mat', 'Deep crimson cutting mat with gold drafting rules.', '#8B020B', '#FBCA05', 'light', ['#9E030D', '#780209', '#4D0005'], ['rgba(251,202,5,.20)', 'rgba(251,202,5,.08)'])
const gecObsidianMat = makeMat('gec-obsidian', 'GEC Obsidian Mat', 'Charcoal mat with amber drafting rules.', '#18181B', '#F59E0B', 'light', ['#27272A', '#18181B', '#09090B'], ['rgba(245,158,11,.18)', 'rgba(245,158,11,.07)'])
const gecBlueprintMat = makeMat('gec-blueprint', 'GEC Blueprint Mat', 'Venture-blue mat with white precision rules.', '#1F7EC0', '#FFFFFF', 'light', ['#2A8DD4', '#1A71AD', '#0E4A74'], ['rgba(255,255,255,.18)', 'rgba(255,255,255,.07)'])
const gecParchmentMat = makeMat('gec-parchment', 'GEC Parchment Drafting Pad', 'Ivory drafting pad with crimson perimeter rules.', '#FCF8ED', '#A3040F', 'dark', ['#FFFFFF', '#FCF8ED', '#F0E7D3'], ['rgba(163,4,15,.14)', 'rgba(163,4,15,.05)'])

const matList = [gecCrimsonMat, gecObsidianMat, gecBlueprintMat, gecParchmentMat]

export const GEC_MAT_THEMES = Object.assign(matList, {
  'gec-crimson': gecCrimsonMat,
  'gec-obsidian': gecObsidianMat,
  'gec-blueprint': gecBlueprintMat,
  'gec-parchment': gecParchmentMat,
}) as GecMatTheme[] & Record<'gec-crimson' | 'gec-obsidian' | 'gec-blueprint' | 'gec-parchment', GecMatTheme>

export const GEC_MAT_THEME_LIST = matList

type Tone = 'incubation' | 'summit' | 'handbook' | 'founders'

type PageItem = { label?: string; title: string; body: string }
type PageStat = { value: string; label: string }
type PageData = {
  running: string
  title: string
  deck?: string
  items?: PageItem[]
  stats?: PageStat[]
  quote?: string
  attribution?: string
  note?: string
  action?: { label: string; value: string }
}

type CoverSpec = {
  tone: Tone
  series: string
  edition: string
  title: string
  subtitle: string
  mark: string
}

function GecMark() {
  return (
    <svg className="gec-book-cover__mark" viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="36" cy="36" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M36 19 47 26v12c0 8-4.4 13.5-11 16-6.6-2.5-11-8-11-16V26l11-7Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="m36 27 2.2 5.7 5.8 2.2-5.8 2.1-2.2 5.8-2.2-5.8-5.8-2.1 5.8-2.2L36 27Z" fill="currentColor" />
    </svg>
  )
}

function IncubationCover() {
  return (
    <article className="gec-book-cover gec-book-cover--incubation">
      <div className="df-cover-foil-border" aria-hidden="true" />
      <header className="gec-book-cover__running">
        <span>GEC ARCHIVES // VENTURE SCALING</span>
        <span>DOC NO. 2026-INC</span>
      </header>
      <div className="gec-book-cover__title-block">
        <GecMark />
        <span className="gec-book-cover__mark-label">GEC / 01 // COHORT 2026</span>
        <h2>Venture Incubation Dossier</h2>
        <p>From dorm-room spark to institutional scale. A working ledger for student founders.</p>
      </div>
      <footer className="gec-book-cover__footer">
        <span>Galgotias Entrepreneurship Cell</span>
        <span>Open Volume →</span>
      </footer>
    </article>
  )
}

function SummitCover() {
  return (
    <article className="gec-book-cover gec-book-cover--summit">
      <div className="df-cover-foil-border df-foil-silver" aria-hidden="true" />
      <header className="gec-book-cover__running">
        <span>CONCLAVE MONOGRAPH // NORTH INDIA FLAGSHIP</span>
        <span>EDITION 2026</span>
      </header>
      <div className="gec-book-cover__title-block">
        <GecMark />
        <span className="gec-book-cover__mark-label">GEC / 02 // ARENA BLUEPRINT</span>
        <h2>E-Summit &apos;26 Conclave Blueprint</h2>
        <p>People, arenas, and capital in productive collision. 15,000+ delegates &amp; ₹12L pitch arena.</p>
      </div>
      <footer className="gec-book-cover__footer">
        <span>E-Summit Conclave Directorate</span>
        <span>Explore Blueprint →</span>
      </footer>
    </article>
  )
}

function HandbookCover() {
  return (
    <article className="gec-book-cover gec-book-cover--handbook">
      <div className="df-cover-foil-border" style={{ borderColor: 'rgba(163,4,15,0.45)' }} aria-hidden="true" />
      <header className="gec-book-cover__running">
        <span>ZERO-TO-ONE FIELD MANUAL</span>
        <span>VOL. IV — 2026 REVISED</span>
      </header>
      <div className="gec-book-cover__title-block">
        <GecMark />
        <span className="gec-book-cover__mark-label">GEC / 03 // FIELD NOTES</span>
        <h2>Innovator&apos;s Field Handbook</h2>
        <p>Validation loops, governance checklists &amp; tactical clinic notes for zero-to-one builders.</p>
      </div>
      <footer className="gec-book-cover__footer">
        <span>Founder Field Protocols</span>
        <span>Open Manual →</span>
      </footer>
    </article>
  )
}

function FoundersCover() {
  return (
    <article className="gec-book-cover gec-book-cover--founders">
      <div className="df-cover-foil-border" aria-hidden="true" />
      <header className="gec-book-cover__running">
        <span>VENTURE ALUMNI ROLL // 2018–2026</span>
        <span>LIBER FUNDATORUM</span>
      </header>
      <div className="gec-book-cover__title-block">
        <GecMark />
        <span className="gec-book-cover__mark-label">GEC / 04 // ALUMNI LEDGER</span>
        <h2>Wall of Founders</h2>
        <p>The builders, ventures, and institutional syndicates behind ₹180Cr+ in portfolio record.</p>
      </div>
      <footer className="gec-book-cover__footer">
        <span>Galgotias Venture Alumni</span>
        <span>View Ledger →</span>
      </footer>
    </article>
  )
}

function BookCover({ spec }: { spec: CoverSpec }) {
  if (spec.tone === 'incubation') return <IncubationCover />
  if (spec.tone === 'summit') return <SummitCover />
  if (spec.tone === 'handbook') return <HandbookCover />
  if (spec.tone === 'founders') return <FoundersCover />
  return (
    <article className={`gec-book-cover gec-book-cover--${spec.tone}`}>
      <header className="gec-book-cover__running"><span>{spec.series}</span><span>{spec.edition}</span></header>
      <div className="gec-book-cover__title-block">
        <GecMark />
        <span className="gec-book-cover__mark-label">{spec.mark}</span>
        <h2>{spec.title}</h2>
        <p>{spec.subtitle}</p>
      </div>
      <footer className="gec-book-cover__footer"><span>Galgotias Entrepreneurship Cell</span><span>Open →</span></footer>
    </article>
  )
}

function BackCover({ tone, title, line }: { tone: Tone; title: string; line: string }) {
  return (
    <article className={`gec-book-cover gec-book-cover--${tone} gec-book-cover--back`}>
      <header className="gec-book-cover__running"><span>GEC ARCHIVES</span><span>2026</span></header>
      <div className="gec-book-cover__title-block"><GecMark /><h2>{title}</h2><p>{line}</p></div>
      <footer className="gec-book-cover__footer"><span>Greater Noida</span><span>GEC / 26</span></footer>
    </article>
  )
}

function EditorialPage({ tone, folio, page }: { tone: Tone; folio: number; page: PageData }) {
  const id = `${tone.slice(0, 3).toUpperCase()}—${String(folio).padStart(2, '0')}`
  return (
    <article className={`gec-editorial-page gec-editorial-page--${tone}`}>
      <header className="gec-editorial-page__running"><span>{page.running}</span><span>{id}</span></header>
      <div className="gec-editorial-page__content">
        <h3>{page.title}</h3>
        {page.deck && <p className="gec-editorial-page__deck">{page.deck}</p>}
        {page.stats && <dl className="gec-editorial-page__stats">{page.stats.map((stat) => <div key={stat.label}><dt>{stat.value}</dt><dd>{stat.label}</dd></div>)}</dl>}
        {page.items && <ol className="gec-editorial-page__list">{page.items.map((item, index) => (
          <li key={`${item.title}-${index}`}><span className="gec-editorial-page__index">{item.label ?? String(index + 1).padStart(2, '0')}</span><div><h4>{item.title}</h4><p>{item.body}</p></div></li>
        ))}</ol>}
        {page.quote && <blockquote><p>“{page.quote}”</p>{page.attribution && <cite>{page.attribution}</cite>}</blockquote>}
        {page.action && <div className="gec-editorial-page__action"><span>{page.action.label}</span><strong>{page.action.value}</strong></div>}
      </div>
      <footer className="gec-editorial-page__footer"><span>{page.note ?? 'GEC working edition'}</span><span>{folio}</span></footer>
    </article>
  )
}

const pages = (tone: Tone, data: PageData[]) => data.map((page, index) => <EditorialPage key={`${tone}-${index + 1}`} tone={tone} folio={index + 1} page={page} />)

const INCUBATION_PAGES = pages('incubation', [
  { running: 'Opening note', title: 'Ideas deserve a room before they need a company.', deck: 'The incubation programme is a protected place to test a real problem, make the smallest useful thing, and learn from evidence—not applause.', note: 'Begin with the problem', action: { label: 'Working question', value: 'Who is already trying to solve this pain?' } },
  { running: 'What we protect', title: 'Three promises to early builders', items: [
    { title: 'Founders keep control', body: 'Support is designed around student ownership and long-term conviction.' },
    { title: 'Evidence before scale', body: 'Customer behaviour matters more than a polished pitch or crowded feature list.' },
    { title: 'Useful networks', body: 'Mentors, operators, and peers arrive at the moment the work needs them.' },
  ], note: 'Incubation principles' },
  { running: 'Cohort at a glance', title: 'A small programme with room to work', stats: [
    { value: '16', label: 'weeks of guided building' }, { value: '24', label: 'founder teams per cohort' }, { value: '1:6', label: 'mentor-to-team ratio' },
  ], note: 'Draft figures — verify before release' },
  { running: 'Capital', title: 'Seed support without losing the plot', deck: 'Prototype grants are meant to buy learning: a field test, a first batch, or the experiment that resolves the riskiest assumption.', items: [
    { label: '₹', title: 'Prototype corpus', body: 'Milestone-based support for selected teams, paired with a simple evidence review.' },
    { label: '↗', title: 'Investor readiness', body: 'Narrative, model, and diligence preparation only when the venture is ready for it.' },
  ], note: 'Terms depend on programme approval' },
  { running: 'Build resources', title: 'Make the first version tangible', items: [
    { title: 'Maker access', body: 'Rapid prototyping, electronics benches, fabrication guidance, and safe test planning.' },
    { title: 'Cloud runway', body: 'Startup credits and technical reviews for teams moving from demo to dependable product.' },
  ], note: 'Use only what advances the test' },
  { running: 'Founder protection', title: 'Get the fundamentals right early', items: [
    { title: 'IP and incorporation', body: 'Clear ownership, entity choices, and assignment paperwork before avoidable ambiguity appears.' },
    { title: 'Founder agreements', body: 'Roles, vesting, decision rights, and difficult scenarios written down while trust is high.' },
    { title: 'Office hours', body: 'Focused legal and finance clinics for questions that block the next decision.' },
  ], note: 'Clarity is a form of speed' },
  { running: 'Application / I', title: 'Show the problem, then the proof', items: [
    { label: '01', title: 'Submit the one-page brief', body: 'Name the user, the pain, and what you have observed—not the size of the dream.' },
    { label: '02', title: 'Bring one artifact', body: 'A prototype, interview log, waitlist, field note, or transaction is enough to start.' },
  ], note: 'No ornamental deck required' },
  { running: 'Application / II', title: 'Build in public with the cohort', items: [
    { label: '03', title: 'Working interview', body: 'A practical conversation about decisions, unknowns, and the experiment you would run next.' },
    { label: '04', title: 'Cohort invitation', body: 'Selected teams receive a programme brief, mentor map, and first-week milestone.' },
  ], action: { label: 'Application desk', value: 'incubation@gecgalgotias.org' }, note: 'Cohort 2026' },
])

const SUMMIT_PAGES = pages('summit', [
  { running: 'E-Summit 2026', title: 'One campus. A thousand unfinished ideas.', deck: 'The conclave brings builders, operators, investors, and students into the same rooms—then gives those rooms a reason to produce something.', stats: [
    { value: '15K+', label: 'delegates' }, { value: '150+', label: 'speakers' }, { value: '80+', label: 'sessions' },
  ], note: 'Programme figures — verify before release' },
  { running: 'Main programme', title: 'Hear from people still close to the work', items: [
    { title: 'Founder stories', body: 'How decisions were made when the company was small and the evidence incomplete.' },
    { title: 'Operator rooms', body: 'Product, distribution, hiring, and finance sessions built around live problems.' },
    { title: 'Investor office hours', body: 'Short, candid conversations about readiness, fit, and the next proof point.' },
  ], note: 'No keynote theatre without takeaways' },
  { running: 'Pitch Arena', title: 'The pitch is a doorway, not the event.', deck: 'Shortlisted teams get a clear room, a disciplined format, and enough time after the stage to hold a real conversation.', stats: [
    { value: '50', label: 'shortlisted startups' }, { value: '25', label: 'investors and operators' }, { value: '₹12L', label: 'grant pool' },
  ], note: 'Arena programme' },
  { running: 'Pitch format', title: 'Make every minute earn its place', items: [
    { label: '06', title: 'Six-minute story', body: 'Problem, insight, proof, model, and the specific ask.' },
    { label: '04', title: 'Four-minute examination', body: 'Questions test the quality of the thinking, not just presentation polish.' },
    { label: '∞', title: 'Founder lounge', body: 'The useful conversations continue off-stage with warm introductions and notes.' },
  ], note: 'Pitch Arena / format' },
  { running: 'BuildSprint', title: 'A night for making the argument tangible', deck: 'Cross-disciplinary teams turn a chosen civic or market problem into a testable prototype before the campus wakes up.', action: { label: 'Working rhythm', value: '24 hours / mentor checkpoints / final demo' }, note: 'BuildSprint field brief' },
  { running: 'BuildSprint tracks / I', title: 'Systems close to everyday life', items: [
    { label: '01', title: 'Climate and circularity', body: 'Energy, materials, mobility, water, and waste with measurable local outcomes.' },
    { label: '02', title: 'Health access', body: 'Screening, continuity of care, clinical workflow, and trustworthy patient tools.' },
  ], note: 'Choose one narrow outcome' },
  { running: 'BuildSprint tracks / II', title: 'Infrastructure for participation', items: [
    { label: '03', title: 'Future of work', body: 'Skills, livelihoods, small-business productivity, and inclusive work systems.' },
    { label: '04', title: 'Open digital public goods', body: 'Interoperable tools that make essential services easier to reach and understand.' },
  ], note: 'Prototype before presentation' },
  { running: 'Delegate desk', title: 'Choose the pass that matches the work', items: [
    { title: 'Student delegate', body: 'Main sessions, expo floor, workshops, and BuildSprint access.' },
    { title: 'Founder delegate', body: 'Adds Pitch Arena eligibility, founder lounge, and office-hour access.' },
    { title: 'Ecosystem partner', body: 'Curated introductions, partner roundtables, and hosted programme access.' },
  ], action: { label: 'Registration', value: 'summit@gecgalgotias.org' }, note: 'E-Summit 2026' },
])

const HANDBOOK_PAGES = pages('handbook', [
  { running: 'Validation loop / I', title: 'Do not ask whether they like it.', items: [
    { label: '01', title: 'Audit the pain', body: 'Interview people about the last time the problem happened and what they did next.' },
    { label: '02', title: 'Build a fake door', body: 'Test the promise before building the machinery behind it.' },
    { label: '03', title: 'Find ten who care', body: 'Work closely with a tiny group whose behaviour changes when the product disappears.' },
  ], note: 'Field rule: behaviour over compliments' },
  { running: 'Validation loop / II', title: 'Pressure-test the exchange', items: [
    { label: '04', title: 'Charge early', body: 'A real exchange exposes value, urgency, and the compromises users will not make.' },
    { label: '05', title: 'Write the baseline', body: 'Record acquisition cost, retention, margin, and the assumptions hiding inside each.' },
  ], action: { label: 'Margin note', value: 'A metric without a decision is decoration.' }, note: 'Repeat until the evidence changes' },
  { running: 'Maker toolkit / I', title: 'Prototype the risky part first', items: [
    { title: 'Hardware bench', body: 'Fabrication, electronics, and measurement tools for physical-product experiments.' },
    { title: 'Test plan', body: 'Define what must be true, what signal will count, and what you will do if it fails.' },
  ], note: 'Reserve tools through the maker desk' },
  { running: 'Maker toolkit / II', title: 'Use cloud credits as runway, not confetti', items: [
    { title: 'Production foundations', body: 'Compute, storage, databases, and monitoring sized for the current proof—not imagined scale.' },
    { title: 'Developer stack', body: 'Version control, documentation, design, and payment tools with one accountable owner.' },
  ], note: 'Keep the stack legible' },
  { running: 'Governance / I', title: 'Make ownership unambiguous', items: [
    { title: 'Choose the entity deliberately', body: 'Match incorporation to the business, grant, and funding path instead of copying another startup.' },
    { title: 'Use vesting', body: 'Protect the team when roles change, commitments fade, or a founder leaves early.' },
  ], note: 'Bring questions to the legal desk' },
  { running: 'Governance / II', title: 'Leave room for the people who build it', items: [
    { title: 'Plan the option pool', body: 'Model dilution before promising equity and keep the logic easy to explain.' },
    { title: 'Assign the work', body: 'Code, designs, domains, data, and trademarks should belong to the company clearly.' },
  ], note: 'Good paperwork preserves friendships' },
  { running: 'Advisory clinics', title: 'Bring a decision, not an update', items: [
    { title: 'EIR sprint', body: 'A tactical review focused on the one bottleneck that changes the next week.' },
    { title: 'Deck teardown', body: 'Story, assumptions, and evidence examined before the deck reaches an investor.' },
    { title: 'Model clinic', body: 'Burn, runway, unit economics, and scenarios translated into operating choices.' },
  ], note: 'One clinic / one decision' },
  { running: 'Office hours', title: 'Write the question before you book the room.', deck: 'Slots open weekly on the founder intranet. Attach the artifact under discussion so the session can begin with the work.', action: { label: 'Bring with you', value: 'one decision / one artifact / one honest unknown' }, note: 'End of field section' },
])

const FOUNDERS_PAGES = pages('founders', [
  { running: 'Alumni roll', title: 'The ventures are the record.', deck: 'A working ledger of student-founded companies, the problems they chose, and the institutions that helped them move.', stats: [
    { value: '120+', label: 'alumni startups' }, { value: '₹180Cr+', label: 'combined portfolio value' }, { value: '18', label: 'institutional alliances' },
  ], note: 'Portfolio figures — verify before release' },
  { running: 'Portfolio / I', title: 'Built for movement and exchange', items: [
    { title: 'DroneX Mobility', body: 'Autonomous agricultural spraying systems tested across North Indian villages.' },
    { title: 'ZyroPay', body: 'Cross-border payment infrastructure designed around student freelancers.' },
  ], note: 'Alumni venture notes' },
  { running: 'Portfolio / II', title: 'Built for health and materials', items: [
    { title: 'NeuraHealth', body: 'Edge-AI screening tools for clinics working beyond major hospital networks.' },
    { title: 'EcoKraft Labs', body: 'Mycelium packaging developed as an alternative to single-use foam.' },
  ], note: 'Alumni venture notes' },
  { running: 'Investor network / I', title: 'Syndicates close to the first cheque', items: [
    { title: 'Indian Angel Network', body: 'University demo-day evaluation and early-stage founder introductions.' },
    { title: 'Mumbai Angels', body: 'Connections across deep-tech, robotics, and medical-imaging conversations.' },
  ], note: 'Institutional relationships' },
  { running: 'Investor network / II', title: 'Programmes that extend the runway', items: [
    { title: 'Venture Catalysts network', body: 'Pre-seed pathways for teams with early velocity and a defined next milestone.' },
    { title: 'Public seed programmes', body: 'Guidance around eligible state and national startup-fund applications.' },
  ], note: 'Funding is matched to readiness' },
  { running: 'Founder voice / I', title: 'The first useful vote of confidence', quote: 'The prototype grant mattered because it paid for the experiment everyone else wanted us to postpone.', attribution: 'Arjun Sharma · DroneX Mobility', note: 'Alumni oral history' },
  { running: 'Founder voice / II', title: 'Infrastructure becomes time', quote: 'The maker lab and cloud access gave us room to ship before personal savings became the product roadmap.', attribution: 'Rohan Nair · ZyroPay', note: 'Alumni oral history' },
  { running: 'Founder pipeline', title: 'Bring the venture back to the table.', deck: 'Rolling reviews begin with the deck, but the conversation is about the evidence behind it. Qualifying teams receive a committee interview.', items: [
    { title: 'Founder desk', body: 'Innovation Tower, 4th Floor · Tuesday and Thursday afternoons.' },
    { title: 'Direct channel', body: 'founders@gecgalgotias.org' },
  ], note: 'Official founders roll' },
])

const cover = (spec: CoverSpec) => <BookCover spec={spec} />

export const GEC_BOOKS: GecBook[] = [
  { id: 'incubation', title: 'Venture Incubation Dossier', shortTitle: 'Incubation', subtitle: 'From dorm-room spark to institutional scale', themeColor: '#A3040F', badge: 'COHORT 2026', coverTheme: { base: '#A3040F', accent: '#FBCA05', ink: 'light' }, spineColor: '#7B020B', cover: cover({ tone: 'incubation', series: 'Venture Dossier', edition: 'Cohort 2026', title: 'Incubation', subtitle: 'From first evidence to a venture with a spine.', mark: 'GEC / 01' }), backCover: <BackCover tone="incubation" title="Build what the evidence can carry." line="A working dossier for student founders." />, pages: INCUBATION_PAGES },
  { id: 'summit', title: "E-Summit '26 Conclave Blueprint", shortTitle: 'E-Summit', subtitle: "North India's flagship entrepreneurship conclave", themeColor: '#0F75BC', badge: 'FLAGSHIP CONCLAVE', coverTheme: { base: '#0F75BC', accent: '#FBCA05', ink: 'light' }, spineColor: '#0C5B94', cover: cover({ tone: 'summit', series: 'Conclave Programme', edition: '2026', title: 'E-Summit', subtitle: 'People, rooms, and ideas in productive collision.', mark: 'GEC / 02' }), backCover: <BackCover tone="summit" title="Leave with a next move." line="The official E-Summit programme book." />, pages: SUMMIT_PAGES },
  { id: 'handbook', title: "Innovator's Field Handbook", shortTitle: 'Handbook', subtitle: 'A practical playbook for zero-to-one builders', themeColor: '#FCF8ED', badge: 'FOUNDER PLAYBOOK', coverTheme: { base: '#FCF8ED', accent: '#A3040F', ink: 'dark' }, spineColor: '#8B020B', cover: cover({ tone: 'handbook', series: 'Field Notes', edition: 'Vol. IV', title: "Innovator's Handbook", subtitle: 'Experiments, operating notes, and useful questions.', mark: 'GEC / 03' }), backCover: <BackCover tone="handbook" title="Validate fast. Write it down." line="A field manual for the work before scale." />, pages: HANDBOOK_PAGES },
  { id: 'founders', title: 'Wall of Founders', shortTitle: 'Founders', subtitle: 'Alumni ventures, portfolios, and backers', themeColor: '#18181B', badge: 'ALUMNI ROLL', coverTheme: { base: '#18181B', accent: '#FBCA05', ink: 'light' }, spineColor: '#121214', cover: cover({ tone: 'founders', series: 'Alumni Ledger', edition: '2018–2026', title: 'Wall of Founders', subtitle: 'The builders, ventures, and people behind the record.', mark: 'GEC / 04' }), backCover: <BackCover tone="founders" title="The record is still being written." line="Galgotias Venture Alumni." />, pages: FOUNDERS_PAGES },
]

export const GEC_BOOKS_BY_ID: Record<string, GecBook> = Object.fromEntries(GEC_BOOKS.map((book) => [book.id, book]))

interface CompanionBooksProps { activeBookId: string; onSelect: (id: string) => void }
type CompanionBookPlacement = React.CSSProperties & {
  '--book-x': string
  '--book-y': string
  '--book-rotate': string
  '--book-scale': number
  '--book-px-factor'?: number
  '--book-py-factor'?: number
}

const COMPANION_BOOK_PLACEMENTS: Record<string, CompanionBookPlacement> = {
  incubation: { '--book-x': '4%', '--book-y': '11%', '--book-rotate': '-7deg', '--book-scale': 0.92, '--book-px-factor': 1.15, '--book-py-factor': 0.95 },
  summit: { '--book-x': '72%', '--book-y': '8%', '--book-rotate': '8deg', '--book-scale': 0.88, '--book-px-factor': 1.3, '--book-py-factor': 1.1 },
  handbook: { '--book-x': '5%', '--book-y': '67%', '--book-rotate': '6deg', '--book-scale': 0.86, '--book-px-factor': 0.9, '--book-py-factor': 1.05 },
  founders: { '--book-x': '82%', '--book-y': '66%', '--book-rotate': '-8deg', '--book-scale': 0.9, '--book-px-factor': 1.25, '--book-py-factor': 1.2 },
}

export function MatCompanionBooks({ activeBookId, onSelect }: CompanionBooksProps) {
  return (
    <div className="df-mat-companion-shelf" aria-label="Switch GEC book">
      {GEC_BOOKS.filter((book) => book.id !== activeBookId).map((book) => {
        const placement = COMPANION_BOOK_PLACEMENTS[book.id]
        return (
          <button
            key={book.id}
            type="button"
            className={`df-resting-book df-resting-book--${book.id}`}
            style={
              {
                ...placement,
                '--book-spine-bg': book.spineColor,
                '--book-cover-bg': book.coverTheme.base,
                '--book-accent': book.coverTheme.accent,
              } as React.CSSProperties
            }
            title={`Switch to ${book.title}`}
            aria-label={`Open ${book.title}`}
            onClick={() => {
              haptic('selection')
              onSelect(book.id)
            }}
          >
            {/* Ambient drop shadow cast on cutting mat with counter-parallax */}
            <div className="df-resting-book-shadow" aria-hidden="true" />

            {/* 3D Isometric Physical Book */}
            <div className="df-resting-book-3d" aria-hidden="true">
              {/* Hardcover Spine */}
              <div className="df-resting-book-spine">
                <span className="df-spine-rib" />
                <span className="df-spine-text">{book.shortTitle}</span>
                <span className="df-spine-logo">GEC</span>
                <span className="df-spine-rib" />
              </div>

              {/* Stacked Page Edges (Right and Bottom) */}
              <div className="df-resting-book-pages-right" />
              <div className="df-resting-book-pages-bottom" />

              {/* Hardcover Face */}
              <div className={`df-resting-book-cover df-resting-book-cover--${book.id}`}>
                <div className="df-resting-book-texture" />
                <div className="df-resting-book-foil-trim" />

                <div className="df-resting-book-header">
                  <span className="df-resting-book-badge">{book.badge}</span>
                  <span className="df-resting-book-pin">✦</span>
                </div>

                <div className="df-resting-book-body">
                  <h4 className="df-resting-book-title">{book.shortTitle}</h4>
                  <p className="df-resting-book-sub">{book.subtitle}</p>
                </div>

                <div className="df-resting-book-cta">
                  <span>Inspect &amp; Open</span>
                  <span className="df-resting-book-arrow">→</span>
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
