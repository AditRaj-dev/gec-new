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

type PageItem = {
  label?: string
  title: string
  body: string
  tag?: string
}

type PageStat = {
  value: string
  label: string
  sub?: string
}

type PageData = {
  running: string
  kicker?: string
  category?: string
  title: string
  deck?: string
  highlight?: string
  stepper?: string[]
  items?: PageItem[]
  stats?: PageStat[]
  quote?: string
  attribution?: string
  note?: string
  action?: { label: string; value: string; tag?: string }
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
      {/* Decorative texture & watermark overlay */}
      <div className="gec-editorial-page__texture" aria-hidden="true" />
      <div className="gec-editorial-page__watermark" aria-hidden="true">
        <GecMark />
      </div>

      <header className="gec-editorial-page__running">
        <div className="gec-editorial-page__running-left">
          <span className="gec-editorial-page__running-pill">{page.running}</span>
          {page.kicker && <span className="gec-editorial-page__kicker">{page.kicker}</span>}
        </div>
        <div className="gec-editorial-page__running-right">
          <span className="gec-editorial-page__folio-id">{id}</span>
        </div>
      </header>

      <div className="gec-editorial-page__content">
        {page.category && <span className="gec-editorial-page__category">{page.category}</span>}
        <h3 className="gec-editorial-page__title">{page.title}</h3>
        {page.deck && <p className="gec-editorial-page__deck">{page.deck}</p>}

        {page.highlight && (
          <div className="gec-editorial-page__highlight">
            <span className="gec-editorial-page__highlight-badge">KEY DIRECTIVE</span>
            <p>{page.highlight}</p>
          </div>
        )}

        {page.stats && (
          <dl className="gec-editorial-page__stats">
            {page.stats.map((stat) => (
              <div key={stat.label} className="gec-editorial-page__stat-card">
                <dt className="gec-editorial-page__stat-val">{stat.value}</dt>
                <dd className="gec-editorial-page__stat-lbl">{stat.label}</dd>
                {stat.sub && <span className="gec-editorial-page__stat-sub">{stat.sub}</span>}
              </div>
            ))}
          </dl>
        )}

        {page.stepper && (
          <div className="gec-editorial-page__stepper">
            {page.stepper.map((step, sIdx) => (
              <div key={step} className="gec-editorial-page__step">
                <span className="gec-editorial-page__step-num">{sIdx + 1}</span>
                <span className="gec-editorial-page__step-text">{step}</span>
              </div>
            ))}
          </div>
        )}

        {page.items && (
          <ol className="gec-editorial-page__list">
            {page.items.map((item, index) => (
              <li key={`${item.title}-${index}`} className="gec-editorial-page__item">
                <span className="gec-editorial-page__index">
                  {item.label ?? String(index + 1).padStart(2, '0')}
                </span>
                <div className="gec-editorial-page__item-body">
                  <div className="gec-editorial-page__item-head">
                    <h4>{item.title}</h4>
                    {item.tag && <span className="gec-editorial-page__item-tag">{item.tag}</span>}
                  </div>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {page.quote && (
          <blockquote className="gec-editorial-page__quote">
            <div className="gec-editorial-page__quote-mark" aria-hidden="true">“</div>
            <p>{page.quote}</p>
            {page.attribution && <cite>{page.attribution}</cite>}
          </blockquote>
        )}

        {page.action && (
          <div className="gec-editorial-page__action">
            <div className="gec-editorial-page__action-info">
              {page.action.tag && <span className="gec-editorial-page__action-tag">{page.action.tag}</span>}
              <span className="gec-editorial-page__action-label">{page.action.label}</span>
            </div>
            <strong className="gec-editorial-page__action-val">{page.action.value}</strong>
          </div>
        )}
      </div>

      <footer className="gec-editorial-page__footer">
        <span className="gec-editorial-page__footer-note">{page.note ?? 'GEC working edition'}</span>
        <div className="gec-editorial-page__footer-folio">
          <span>PAGE</span>
          <span className="gec-editorial-page__folio-num">{folio}</span>
        </div>
      </footer>
    </article>
  )
}

const pages = (tone: Tone, data: PageData[]) => data.map((page, index) => <EditorialPage key={`${tone}-${index + 1}`} tone={tone} folio={index + 1} page={page} />)

const INCUBATION_PAGES = pages('incubation', [
  {
    running: 'Opening Mandate',
    kicker: 'MANDATE // COHORT 2026',
    category: 'INCUBATION CHARTER',
    title: 'Ideas deserve a room before they need a company.',
    deck: 'The incubation programme is a protected sanctuary to test an acute human friction, build the smallest useful prototype, and learn from verifiable evidence—not applause.',
    highlight: 'Premature scaling kills more student ventures than lack of funding. We protect your right to iterate quietly away from pitch theater.',
    items: [
      { label: '01', title: 'Problem Discovery Over Speculation', tag: 'DISCOVERY', body: '20+ structured customer interviews before opening a code editor or ordering components.' },
      { label: '02', title: '16-Week Zero-to-One Sprint', tag: 'EXECUTION', body: 'Phased milestones designed to test feasibility, validate demand, and achieve repeatable usage.' },
    ],
    action: { label: 'Working question', value: 'Who is already trying to solve this pain?', tag: 'CORE TEST' },
    note: 'Begin with the problem · Doc 2026-INC-01',
  },
  {
    running: 'Ethos & Rights',
    kicker: 'FOUNDER RIGHTS',
    category: 'THREE PROMISES',
    title: 'Three institutional promises to student builders',
    deck: 'Standard university incubators often extract equity too early. GEC does the exact opposite.',
    items: [
      { label: '01', title: 'Founders retain 100% control', tag: 'ZERO EQUITY', body: 'Zero institutional equity clawback or ownership claims during prototype exploration. Your intellectual property stays entirely yours.' },
      { label: '02', title: 'Evidence before scale', tag: 'DATA FIRST', body: 'Observed user transactions and retention telemetry matter infinitely more than polished pitch decks and vanity follower metrics.' },
      { label: '03', title: 'Surgical operator network', tag: 'ACTIVE MENTORS', body: 'Seasoned alumni operators and venture partners arrive on-demand at the precise moment a technical or regulatory roadblock occurs.' },
    ],
    note: 'Incubation Governance Charter',
  },
  {
    running: 'Cohort Architecture',
    kicker: 'CAPACITY & TIMELINE',
    category: 'SPRINT METRICS',
    title: 'A high-conviction programme with room to work',
    stats: [
      { value: '16', label: 'Guided Sprint Weeks', sub: '3 phased gates' },
      { value: '24', label: 'Teams Per Cohort', sub: 'High selectivity' },
      { value: '1:6', label: 'Mentor-to-Team Ratio', sub: 'Active advisory' },
    ],
    stepper: ['Phase I: Problem Validation (W1-4)', 'Phase II: MVP Build & Field Trial (W5-12)', 'Phase III: Syndicate Demo Day (W13-16)'],
    items: [
      { label: 'W1–4', title: 'Phase I: Problem Validation', body: 'Friction audits, competitor teardowns, and verified customer interview logs.' },
      { label: 'W5–12', title: 'Phase II: Build & Field Trial', body: 'Functional MVP deployment, telemetry instrumentation, and first financial transaction.' },
      { label: 'W13–16', title: 'Phase III: Institutional Syndication', body: 'Cap-table hygiene, data room assembly, and curated meetings with partner angel syndicates.' },
    ],
    note: 'Cohort 2026 Programme Structure',
  },
  {
    running: 'Capital Allocation',
    kicker: 'PROTOTYPE GRANTS',
    category: 'NON-DILUTIVE SEED',
    title: 'Seed support without losing the plot',
    deck: 'Prototype grants are designed to purchase learning velocity: a field trial, a manufacturing batch, or the experiment that resolves the riskiest bottleneck.',
    stats: [
      { value: '₹5L', label: 'Prototype Grant Pool', sub: 'Zero equity taken' },
      { value: '₹25L', label: 'Syndicate Match Pool', sub: 'Partner angels' },
    ],
    items: [
      { label: '₹1L', title: 'Tranche I: Proof of Need', tag: 'MILESTONE 1', body: 'Awarded upon verification of 15 customer discovery interviews and competitive audit.' },
      { label: '₹2L', title: 'Tranche II: Working Prototype', tag: 'MILESTONE 2', body: 'Disbursed to manufacture hardware prototypes or host production cloud beta software.' },
      { label: '₹2L', title: 'Tranche III: Pilot Trial', tag: 'MILESTONE 3', body: 'Allocated for on-ground village or campus pilot deployments with active telemetry.' },
    ],
    action: { label: 'Grant Office', value: 'grants@gecgalgotias.org', tag: 'DISBURSEMENT' },
    note: 'Terms subject to evaluation committee review',
  },
  {
    running: 'Physical & Digital Labs',
    kicker: 'LAB ACCESS',
    category: 'FABRICATION & CLOUD',
    title: 'Make the first version tangible',
    deck: 'From precision SMD electronics to scalable model inference, build without infrastructure friction.',
    items: [
      { label: 'FAB', title: 'Rapid Hardware Fabrication Bench', tag: 'HARDWARE', body: 'Dual-extruder 3D printers, precision laser cutters, SMD soldering, and oscilloscope diagnostic rigs with full technician support.' },
      { label: 'GPU', title: '₹12L+ Cloud Runway Credits', tag: 'AI & CLOUD', body: 'AWS Activate, Google for Startups, and Azure OpenAI compute credits for continuous live training, fine-tuning, and hosting.' },
      { label: 'SAAS', title: 'Production Dev Tooling Suite', tag: 'TOOLING', body: 'Full team seats on GitHub Enterprise, Figma Organization, Postman, and Mixpanel analytics stacks included.' },
    ],
    note: 'Reserve benches via the GEC Maker Desk',
  },
  {
    running: 'Governance & Diligence',
    kicker: 'FOUNDER PROTECTION',
    category: 'LEGAL PROTOCOLS',
    title: 'Get the fundamentals right early',
    deck: 'Clean legal foundations protect friendships, eliminate cap-table disputes, and accelerate institutional due diligence.',
    items: [
      { label: 'IP', title: 'Unambiguous IP Assignment', tag: 'PATENTS', body: 'Ensure all software source code, circuit schematics, and design assets belong legally to the corporate entity.' },
      { label: 'ESOP', title: 'Universal 4-Year Vesting with 1-Year Cliff', tag: 'VESTING', body: 'Every founder vests shares over 4 years to guarantee long-term alignment and protect the venture if someone departs early.' },
      { label: 'TAX', title: 'DPIIT & Section 80-IAC Tax Exemption', tag: 'COMPLIANCE', body: '1-on-1 sessions with chartered accountants covering Pvt Ltd incorporation, GST, and 3-year tax exemptions.' },
    ],
    note: 'Clarity is a form of velocity',
  },
  {
    running: 'Admissions Desk',
    kicker: 'APPLICATION STEP 01',
    category: 'PROOF OVER PROMISES',
    title: 'Show the problem, then the proof',
    deck: 'We prioritize evidence of execution over presentation polish. Tell us what you learned from speaking directly with users.',
    items: [
      { label: '01', title: 'The 1-Page Problem Dossier', tag: 'STEP 1', body: 'Define the specific user persona, observed friction, and quantify the economic cost of inaction.' },
      { label: '02', title: 'Attach One Verifiable Artifact', tag: 'STEP 2', body: 'A functional wireframe, raw customer interview recording, waitlist log, or pilot pre-order proof.' },
    ],
    action: { label: 'Round 1 Deadline', value: 'Rolling Cohort Admissions // 2026', tag: 'APPLY NOW' },
    note: 'No ornamental pitch decks required',
  },
  {
    running: 'Cohort Selection',
    kicker: 'APPLICATION STEP 02',
    category: 'WORKING SESSIONS',
    title: 'Build in public with the cohort',
    deck: 'Final selection takes the form of an interactive work session, dissecting technical unknowns together.',
    items: [
      { label: '03', title: 'Technical Teardown Session', tag: 'STEP 3', body: '30-minute working dialogue with incubation leads on unit economics, tech roadmap, and team balance.' },
      { label: '04', title: 'Floor Key & Grant Allocation', tag: 'STEP 4', body: 'Accepted teams receive 24/7 incubator access, dedicated mentor alignment, and Milestone 1 grant disbursement.' },
    ],
    action: { label: 'Direct Admissions Desk', value: 'incubation@gecgalgotias.org', tag: 'SUBMIT BRIEF' },
    note: 'Official Incubation Office · Innovation Tower 3F',
  },
])

const SUMMIT_PAGES = pages('summit', [
  {
    running: 'Conclave Monograph',
    kicker: 'FLAGSHIP SUMMIT // 2026',
    category: 'NORTH INDIA ARENA',
    title: 'One campus. A thousand collisions.',
    deck: 'E-Summit \'26 convenes founders, venture syndicates, policymakers, and student builders for 48 hours of catalytic momentum.',
    stats: [
      { value: '15K+', label: 'Conclave Delegates', sub: 'Across 120+ campuses' },
      { value: '150+', label: 'Founders & Operators', sub: 'Keynote & panel stages' },
      { value: '₹12L', label: 'Grant Prize Pool', sub: 'Non-dilutive awards' },
    ],
    note: 'Audited Figures · E-Summit Directorate',
  },
  {
    running: 'Stage Blueprints',
    kicker: 'ARENA SPECIFICATION',
    category: 'STAGE TIMETABLE',
    title: 'Four active stages engineered for focus',
    deck: 'Curated environments structured for real exchange—from raw founder failure stories to closed-door term sheet debates.',
    items: [
      { label: 'STAGE A', title: 'The Main Auditorium (Conclave Hall)', tag: 'KEYNOTE', body: 'Unfiltered fireside discussions with unicorn founders on scaling through market downturns.' },
      { label: 'STAGE B', title: 'The Operator Arena', tag: 'TACTICAL', body: 'Deep-dives into distribution loops, unit margins, high-velocity hiring, and regulatory moats.' },
      { label: 'STAGE C', title: 'Investor Diligence Salons', tag: 'ROUNDTABLES', body: 'Private 1-on-1 pitch salons matching vetted pre-seed startups with angel syndicates.' },
    ],
    note: 'All stages equipped with live streaming & recording',
  },
  {
    running: 'The Pitch Arena',
    kicker: 'VENTURE SHOWCASE',
    category: '₹12L GRANT ARENA',
    title: 'The pitch is a doorway, not the performance',
    deck: 'Shortlisted teams get an attentive room of active check-writers, a disciplined timer, and open lounge access afterwards.',
    stats: [
      { value: '50', label: 'Shortlisted Startups', sub: 'From 800+ entries' },
      { value: '25', label: 'Institutional VCs', sub: 'Seed to Series A' },
      { value: '₹12L', label: 'Non-Dilutive Pool', sub: 'Direct equity-free grants' },
    ],
    highlight: 'Winners receive direct induction into GEC Incubator with complimentary cloud compute and legal packaging.',
    note: 'Pitch Arena Handbook · Edition 2026',
  },
  {
    running: 'Pitch Protocol',
    kicker: 'TIMED EXAMINATION',
    category: '6 + 4 FORMAT',
    title: 'Make every single minute earn its place',
    deck: 'Rigidly timed presentation format that tests product depth and operational clarity over slick slide transitions.',
    items: [
      { label: '06m', title: 'Six-Minute Pitch Narrative', tag: 'PRESENTATION', body: 'Problem, observed customer insight, traction telemetry, business model, and specific capital ask.' },
      { label: '04m', title: 'Four-Minute Jury Examination', tag: 'DEFENSE', body: 'Direct interrogation on unit economics, retention curves, customer acquisition cost, and moat.' },
      { label: 'LOUNGE', title: 'The Founder & Syndicate Salon', tag: 'DEAL FLOW', body: 'Continuous coffee salon where partners examine product demos and sign preliminary diligence sheets.' },
    ],
    note: 'Enforced by digital countdown displays on stage',
  },
  {
    running: 'BuildSprint Arena',
    kicker: 'HACKATHON PROTOCOL',
    category: '24-HOUR SPRINT',
    title: 'A sleepless night for turning code into arguments',
    deck: 'Multidisciplinary teams tackle complex civic, financial, and climate problems, delivering testable prototypes before sunrise.',
    stepper: ['T-00: Problem Drop & Team Lock', 'T-06: Architecture Checkpoint', 'T-14: API & Hardware Demo Test', 'T-24: Stage Demo & Jury Score'],
    action: { label: 'Sprint Format', value: '24 Hours / Live Mentors / ₹3L Grand Prize', tag: 'BUILDSPRINT' },
    note: 'Continuous energy fuel, hardware rigs & mentors provided',
  },
  {
    running: 'Hackathon Tracks',
    kicker: 'PROBLEM DOMAINS',
    category: 'CHALLENGE BRIEFS',
    title: 'Four systemic friction domains',
    deck: 'Choose a track with high local consequence and build software or embedded systems that solve the core bottleneck.',
    items: [
      { label: 'TRACK 1', title: 'Climate Tech & Circular Materials', tag: 'GREEN', body: 'Decentralized energy microgrids, battery recycling logistics, and bio-degradable packaging.' },
      { label: 'TRACK 2', title: 'Edge AI & Healthcare Diagnostics', tag: 'HEALTH', body: 'Low-latency screening models for tier-3 clinics, telemedicine triaging, and rural health records.' },
      { label: 'TRACK 3', title: 'Future of Work & Freelance Rails', tag: 'FINTECH', body: 'Instant cross-border settlement, worker safety infrastructure, and micro-business credit.' },
      { label: 'TRACK 4', title: 'Open Digital Public Infrastructure', tag: 'DPI', body: 'Interoperable protocols built on ONDC, UPI, and Account Aggregator rails.' },
    ],
    note: 'Jury includes track-sponsor engineering leaders',
  },
  {
    running: 'Institutional Partners',
    kicker: 'CAPITAL ROSTER',
    category: 'ACTIVE SYNDICATES',
    title: 'Meet the institutions backing campus innovation',
    deck: 'Our investment partners manage over ₹5,000Cr in early-stage dry powder across deep-tech, consumer, and SaaS.',
    items: [
      { label: 'VC', title: 'Tier-1 Micro-VCs & Pre-Seed Funds', tag: 'INSTITUTIONAL', body: 'Leading fund partners actively seeking seed-stage technical founders and developer tooling.' },
      { label: 'ANGEL', title: 'Angel Syndicates & Founder Networks', tag: 'SYNDICATES', body: 'Active angel groups from Delhi-NCR, Bengaluru, and Mumbai with immediate check capacity.' },
      { label: 'CORP', title: 'Corporate Innovation Accelerators', tag: 'VENTURE ARMS', body: 'Strategic corporate partners providing enterprise pilot contracts and distribution agreements.' },
    ],
    note: 'Confidential syndicate registry available at investor desk',
  },
  {
    running: 'Conclave Accreditation',
    kicker: 'OFFICIAL PASS',
    category: 'DELEGATE TIERS',
    title: 'Choose the pass that matches the work',
    deck: 'Accreditation grants access to stages, networking lounges, and the BuildSprint arena floor.',
    items: [
      { label: 'STU', title: 'Student Builder Delegate', tag: '₹299', body: 'Access to all main stages, workshops, expo floor, and BuildSprint participation eligibility.' },
      { label: 'FND', title: 'Startup Founder Pass', tag: '₹799', body: 'Includes Pitch Arena evaluation slot, Founder Lounge access, and curated investor office hours.' },
      { label: 'VIP', title: 'Ecosystem Partner & VC Badge', tag: 'INVITE ONLY', body: 'Full VIP salon access, private meeting rooms, speaker banquet, and demo day deal book.' },
    ],
    action: { label: 'Conclave Portal', value: 'summit@gecgalgotias.org', tag: 'REGISTER' },
    note: 'E-Summit 2026 Directorate · Greater Noida',
  },
])

const HANDBOOK_PAGES = pages('handbook', [
  {
    running: 'Validation Playbook',
    kicker: 'RULE 01 // DISCOVERY',
    category: 'FIELD MANUAL',
    title: 'Do not ask whether they like it.',
    deck: 'Compliments are conversational currency that costs the user nothing. Only past behaviour and monetary commitments count.',
    highlight: 'Never ask "Would you use this?" Instead ask: "When was the last time this problem occurred, and how much did you pay to patch it?"',
    items: [
      { label: '01', title: 'Audit the Real Pain', tag: 'INTERVIEWS', body: 'Conduct 20 user interviews. If they haven’t tried to fix it in the last 6 months, it’s not an acute problem.' },
      { label: '02', title: 'The Fake-Door Demand Test', tag: 'SMOKE TEST', body: 'Launch a simple landing page or flyer. Measure deposit conversions before building backend plumbing.' },
    ],
    action: { label: 'Field Rule', value: 'Observed behaviour beats speculative optimism every time.', tag: 'RULE' },
    note: 'Founder Field Handbook · Page 01',
  },
  {
    running: 'Pricing & Evidence',
    kicker: 'RULE 02 // MONETIZATION',
    category: 'ECONOMIC BASELINE',
    title: 'Pressure-test the economic exchange',
    deck: 'A product that cannot charge on day one rarely finds magic pricing power on day three hundred.',
    stats: [
      { value: '10', label: 'Obsessed Early Users', sub: 'Who refuse to leave' },
      { value: '3x', label: 'LTV to CAC Target', sub: 'Baseline sustainability' },
    ],
    items: [
      { label: '03', title: 'Charge for the Beta', tag: 'PRICING', body: 'Charging even ₹500 weeds out polite friends from genuine customers who feel the burn of the problem.' },
      { label: '04', title: 'Map the True Unit Cost', tag: 'MARGINS', body: 'Calculate server inference, customer support hours, payment gateway fees, and packaging.' },
    ],
    action: { label: 'Margin Note', value: 'A metric without a decision is mere decoration.', tag: 'TACTICAL' },
    note: 'Audit baseline monthly',
  },
  {
    running: 'Hardware Protocol',
    kicker: 'RULE 03 // FABRICATION',
    category: 'MAKER DESK',
    title: 'Prototype the riskiest component first',
    deck: 'Do not spend two weeks polishing an enclosure when you haven\'t verified if the sensor communicates over I2C.',
    items: [
      { label: 'HW-1', title: 'Breadboard Before Custom PCB', tag: 'PROTOTYPING', body: 'Prove component compatibility using off-the-shelf development boards (ESP32/RP2040) before Gerber layout.' },
      { label: 'HW-2', title: '3D Enclosure Drafts', tag: 'DRAFTING', body: 'Print rough low-resolution shells to test ergonomics, port clearance, and thermal dissipation early.' },
      { label: 'HW-3', title: 'Risk-First Test Protocol', tag: 'RIG TESTING', body: 'Build custom stress test jigs for battery draw, vibration, and wireless drop-out before field trials.' },
    ],
    note: 'Sign out lab equipment through GEC Maker Desk',
  },
  {
    running: 'Software Architecture',
    kicker: 'RULE 04 // DEV STACK',
    category: 'INFRASTRUCTURE',
    title: 'Use cloud credits as runway, not confetti',
    deck: 'Complex multi-region Kubernetes clusters for an app with 50 daily users is procrastination disguised as engineering.',
    items: [
      { label: 'SYS-1', title: 'Boring Technology Stack', tag: 'SIMPLICITY', body: 'Use PostgreSQL, Next.js / Python, and managed serverless containers. Speed of shipping is your only moat.' },
      { label: 'SYS-2', title: 'Telemetry from Commit One', tag: 'OBSERVABILITY', body: 'Track error traces (Sentry), user event funnels (PostHog), and server latencies before public release.' },
      { label: 'SYS-3', title: 'Database Backup & Secret Hygiene', tag: 'SECURITY', body: 'Automated daily snapshots and environment secret management; zero API keys committed to git repositories.' },
    ],
    note: 'Keep your production architecture legible',
  },
  {
    running: 'Equity & Incorporation',
    kicker: 'RULE 05 // GOVERNANCE',
    category: 'CAP TABLE',
    title: 'Make ownership unambiguous on day zero',
    deck: 'Ambiguous ownership destroys more promising college startups than competitor execution ever will.',
    items: [
      { label: 'GOV-1', title: 'Incorporate as Private Limited', tag: 'ENTITY', body: 'Mandatory for raising angel/VC capital in India and qualifying for DPIIT Startup India seed grants.' },
      { label: 'GOV-2', title: 'Universal 4-Year Vesting', tag: 'VESTING', body: 'Every founder—including the initial creator—vests shares over 4 years with a strict 1-year cliff.' },
      { label: 'GOV-3', title: 'Founder Departure Clause', tag: 'EXIT CLAUSE', body: 'Pre-agree on unvested share buyback mechanisms at nominal par value if a founder departs for campus placements.' },
    ],
    note: 'Review boilerplate contracts with the legal clinic',
  },
  {
    running: 'Team & Protection',
    kicker: 'RULE 06 // INTELLECTUAL PROPERTY',
    category: 'EQUITY & IP',
    title: 'Leave room for the engineers who ship it',
    deck: 'Create equity incentives that attract top campus engineering talent and protect your company’s trade secrets.',
    items: [
      { label: 'ESOP', title: 'Carve Out a 10%–12% ESOP Pool', tag: 'POOL', body: 'Create an employee stock option pool prior to raising external funds so early hires are motivated like owners.' },
      { label: 'IP', title: 'Comprehensive Invention Assignment', tag: 'ASSIGNMENT', body: 'Every student contributor must execute an IP assignment ensuring source code belongs to the corporate entity.' },
      { label: 'TM', title: 'Domain, Brand & Trademark Filings', tag: 'TRADEMARK', body: 'Register class 9, 35, or 42 trademark applications once brand validation is confirmed.' },
    ],
    note: 'Good legal paperwork preserves friendships',
  },
  {
    running: 'Operating Clinics',
    kicker: 'RULE 07 // CLINICS',
    category: 'TACTICAL ADVISORY',
    title: 'Bring an acute decision, not an update',
    deck: 'Office hours are high-intensity surgical sessions. Arrive with the specific blocker halting progress this week.',
    items: [
      { label: 'EIR', title: 'Weekly EIR Sprint Reviews', tag: 'SPRINT', body: '45-minute sprint planning focusing on the single bottleneck that unlocks customer growth this cycle.' },
      { label: 'DECK', title: 'Deck Teardown & Narrative Audit', tag: 'STORY', body: 'Aggressive slide-by-slide teardown examining logical jumps, market sizing fallacies, and defense.' },
      { label: 'FIN', title: 'Financial Runway & Burn Modeling', tag: 'CASH FLOW', body: 'Translating headcount, server usage, and marketing experiments into exact monthly cash burn.' },
    ],
    note: 'One clinic / one clear decision',
  },
  {
    running: 'Field Desk Access',
    kicker: 'RULE 08 // FIELD OFFICE',
    category: 'BOOKING RULES',
    title: 'Write the question before booking the room',
    deck: 'Clinic slots open every Monday morning on the founder portal. Bring raw data, not vague theories.',
    action: { label: 'Required Artifacts', value: '1 Decision / 1 Metric / 1 Honest Unknown', tag: 'ENTRY CRITERIA' },
    items: [
      { label: '01', title: 'Legal & Compliance Clinic', body: 'Tuesdays 15:00–18:00 · Innovation Tower Room 304' },
      { label: '02', title: 'Hardware & Circuit Bench Hours', body: 'Wednesdays 14:00–19:00 · Advanced Fabrication Lab' },
      { label: '03', title: 'Investor Pitch & Narrative Salons', body: 'Thursdays 16:00–19:00 · GEC Boardroom' },
    ],
    note: 'End of Field Manual · Rev 2026',
  },
])

const FOUNDERS_PAGES = pages('founders', [
  {
    running: 'Venture Alumni Roll',
    kicker: 'LIBER FUNDATORUM // 2018–2026',
    category: 'VENTURE LEDGER',
    title: 'The ventures are the historical record.',
    deck: 'A living ledger of Galgotias student founders who turned dorm-room prototypes into institutional-grade enterprises.',
    stats: [
      { value: '120+', label: 'Founded Ventures', sub: 'Active enterprises' },
      { value: '₹180Cr+', label: 'Combined Valuation', sub: 'Audited portfolio' },
      { value: '18', label: 'Institutional Alliances', sub: 'VCs & syndicates' },
    ],
    note: 'Official Alumni Record · Registry No. 2026-VAL',
  },
  {
    running: 'Venture Monograph 01',
    kicker: 'ALUMNI SPOTLIGHT',
    category: 'AGRITECH & ROBOTICS',
    title: 'DroneX Mobility: Precision from Above',
    deck: 'Founded in 2021 by mechanical engineering students, DroneX built autonomous micro-spraying drones for North Indian farmland.',
    stats: [
      { value: '₹42Cr', label: 'Current Valuation', sub: 'Series Pre-A' },
      { value: '140+', label: 'Villages Served', sub: 'UP & Punjab belt' },
    ],
    items: [
      { label: 'FOUNDERS', title: 'Arjun Sharma & Priyanshu Tyagi', body: 'B.Tech Batch of 2022 · Built prototype in GEC Maker Lab using 3D-printed carbon composites.' },
      { label: 'MILESTONE', title: 'Commercial DGCA Type Certification', body: 'Secured full DGCA airworthiness approval and signed commercial distributor pact with IFFCO.' },
    ],
    note: 'DroneX Mobility Pvt Ltd · Alumnus 2022',
  },
  {
    running: 'Venture Monograph 02',
    kicker: 'ALUMNI SPOTLIGHT',
    category: 'CROSS-BORDER FINTECH',
    title: 'ZyroPay: Cross-Border Liquidity Rails',
    deck: 'Automated instant payout rails designed for student freelancers and digital exports across South Asia.',
    stats: [
      { value: '$8.5M', label: 'Annualized TPV', sub: 'Transaction volume' },
      { value: '65K+', label: 'Active Freelancers', sub: 'Instant settlements' },
    ],
    items: [
      { label: 'FOUNDER', title: 'Rohan Nair', body: 'B.Tech CSE 2023 · Started as a campus peer-to-peer split payment app during sophomore year.' },
      { label: 'BACKERS', title: 'Backed by Y-Combinator Alum Angels', body: 'Raised $650K seed round led by Singapore-based fintech syndicates and Indian Angel Network.' },
    ],
    note: 'ZyroPay Technologies Inc · Alumnus 2023',
  },
  {
    running: 'Venture Monograph 03',
    kicker: 'PORTFOLIO HIGHLIGHTS',
    category: 'HEALTH & MATERIALS',
    title: 'Pioneering edge AI and biomaterials',
    deck: 'Galgotias founders creating breakthrough hardware and biotech innovations solving foundational human challenges.',
    items: [
      { label: 'HEALTH', title: 'NeuraHealth Diagnostics', tag: 'EDGE AI', body: 'Portable non-invasive retinal scanning AI detecting diabetic retinopathy in under 90 seconds. Deployed in 40 district hospitals.' },
      { label: 'BIO', title: 'EcoKraft BioMaterials', tag: 'CIRCULAR', body: 'Agricultural waste transformed via mycelium growth into 100% compostable structural packaging, replacing styrofoam.' },
    ],
    note: 'Recognized under National Bio-Entrepreneurship Awards',
  },
  {
    running: 'Venture Capital Alliances',
    kicker: 'CAPITAL PARTNERS',
    category: 'CHECK WRITERS',
    title: 'Syndicates anchored close to the campus',
    deck: 'Long-term investment alliances ensuring qualified student startups have immediate access to pre-seed institutional cheques.',
    items: [
      { label: 'IAN', title: 'Indian Angel Network (IAN)', tag: 'PRE-SEED', body: 'Direct university fast-track evaluation and biannual demo day jury participation.' },
      { label: 'MUMBAI', title: 'Mumbai Angels Network', tag: 'DEEP TECH', body: 'Syndicate co-investment in robotics, diagnostics, and high-performance computing founders.' },
      { label: 'VCAT', title: 'Venture Catalysts Syndicate', tag: 'SEED ROUNDS', body: 'Multi-stage acceleration and follow-on support for regional enterprise SaaS teams.' },
    ],
    note: 'GEC maintains active institutional MOUs with all syndicates',
  },
  {
    running: 'Public Capital Channels',
    kicker: 'STATE & NATIONAL GRANTS',
    category: 'NON-DILUTIVE SEED',
    title: 'State and central capital extensions',
    deck: 'Maximizing non-dilutive government schemes to stretch founder runway prior to private equity syndication.',
    stats: [
      { value: '₹2.4Cr', label: 'Grants Disbursed', sub: 'To campus startups' },
      { value: '100%', label: 'Compliance Record', sub: 'Audit pass rate' },
    ],
    items: [
      { label: 'DPIIT', title: 'Startup India Seed Fund Scheme (SISFS)', body: 'Proof-of-concept grants up to ₹20L and convertible debentures up to ₹50L.' },
      { label: 'UP-IT', title: 'Uttar Pradesh Start-Up Policy Fund', body: 'Monthly sustenance allowances for student founders and prototype development subsidies.' },
    ],
    note: 'Government Liaison Desk · Innovation Tower 4F',
  },
  {
    running: 'Oral Archive',
    kicker: 'FOUNDER REFLECTIONS',
    category: 'REFLECTIONS FROM THE ARENA',
    title: 'What founders remember when the dust settles',
    deck: 'Unfiltered quotes from founders looking back on the inflection points that saved their companies.',
    quote: 'The GEC prototype grant was the only check that mattered in 2021. It paid for the motor testbench that every external investor told us to postpone.',
    attribution: 'Arjun Sharma · Co-Founder, DroneX Mobility (Series Pre-A)',
    items: [
      { label: 'ROHAN', title: 'Rohan Nair (ZyroPay)', body: '“Having 24/7 lab access and legal paperwork already done meant when the US partners called, we were ready to sign in 48 hours.”' },
    ],
    note: 'Recorded at GEC Alumni Conclave 2025',
  },
  {
    running: 'Alumni Syndicate Registration',
    kicker: 'LEDGER APPLICATION',
    category: 'ROLL OF HONOR',
    title: 'Write your company into the record',
    deck: 'The Wall of Founders welcomes student and alumni ventures on rolling evaluation. Join the investment syndicate network.',
    items: [
      { label: 'FLOOR', title: 'Alumni & Venture Desk', body: 'Innovation Tower, 4th Floor · Evaluation clinics every Tuesday & Thursday.' },
      { label: 'SYNDICATE', title: 'GEC Angel Syndicate Inquiries', body: 'Accredited alumni investors wishing to back student cohorts.' },
    ],
    action: { label: 'Official Founders Roll Desk', value: 'founders@gecgalgotias.org', tag: 'REGISTER VENTURE' },
    note: 'Official Wall of Founders · Liber Fundatorum 2026',
  },
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
}

const COMPANION_BOOK_PLACEMENTS: Record<string, CompanionBookPlacement> = {
  incubation: { '--book-x': '4%', '--book-y': '12%', '--book-rotate': '-6deg', '--book-scale': 0.92 },
  summit: { '--book-x': '74%', '--book-y': '10%', '--book-rotate': '7deg', '--book-scale': 0.9 },
  handbook: { '--book-x': '5%', '--book-y': '66%', '--book-rotate': '5deg', '--book-scale': 0.88 },
  founders: { '--book-x': '80%', '--book-y': '64%', '--book-rotate': '-7deg', '--book-scale': 0.9 },
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
            title={`Open ${book.title}`}
            aria-label={`Open ${book.title}`}
            onClick={() => {
              haptic('selection')
              onSelect(book.id)
            }}
          >
            {/* Grounded contact and ambient drop shadow directly on cutting mat */}
            <div className="df-resting-book-shadow" aria-hidden="true" />

            {/* Physical Hardcover Book resting still on desk */}
            <div className="df-resting-book-3d" aria-hidden="true">
              {/* Hardcover Spine */}
              <div className="df-resting-book-spine">
                <span className="df-spine-rib" />
                <span className="df-spine-text">{book.shortTitle}</span>
                <span className="df-spine-logo">GEC</span>
                <span className="df-spine-rib" />
              </div>

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
                  <span>Open Volume</span>
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
