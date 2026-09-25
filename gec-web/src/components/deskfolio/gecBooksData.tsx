'use client'

import React from 'react'

export interface GecBook {
  id: string
  title: string
  shortTitle: string
  subtitle: string
  themeColor: string
  badge: string
  coverTheme: { base: string; accent: string; foil: string; ink: 'light' | 'dark' }
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

export type Tone = 'incubation' | 'summit' | 'handbook' | 'founders'

export const DESK_BOOK_COORDINATES: Record<string, { x: number; y: number; rotate: number }> = {
  incubation: { x: 82, y: 145, rotate: -5 },
  summit: { x: 1085, y: 290, rotate: 4 },
  handbook: { x: 242, y: 558, rotate: 3 },
  founders: { x: 1060, y: 588, rotate: -4 },
}

export const MINI_BOOK_SIZE = { width: 92, height: 122 }
export const CENTER_BOOK_COORDINATES = { x: 525, y: 118.5, width: 350, height: 483, rotate: 0 }

export interface BookSpec {
  id: string
  tone: Tone
  title: string
  shortTitle: string
  subtitle: string
  series: string
  edition: string
  mark: string
  badge: string
  coverTheme: { base: string; accent: string; foil: string; ink: 'light' | 'dark' }
  spineColor: string
}

export const BOOK_SPECS: Record<string, BookSpec> = {
  incubation: {
    id: 'incubation',
    tone: 'incubation',
    title: 'Venture Incubation Dossier',
    shortTitle: 'Incubation',
    subtitle: 'From dorm-room spark to institutional scale.',
    series: 'GEC ARCHIVES // VENTURE SCALING',
    edition: 'DOC NO. 2026-INC',
    mark: 'GEC / 01 // COHORT 2026',
    badge: 'COHORT 2026',
    coverTheme: { base: '#80030B', accent: '#FBCA05', foil: '#FBCA05', ink: 'light' },
    spineColor: '#6A0209',
  },
  summit: {
    id: 'summit',
    tone: 'summit',
    title: "E-Summit '26 Conclave Blueprint",
    shortTitle: 'E-Summit',
    subtitle: 'People, arenas, and capital in productive collision.',
    series: 'CONCLAVE MONOGRAPH // FLAGSHIP ARENA',
    edition: 'EDITION 2026',
    mark: 'GEC / 02 // ARENA BLUEPRINT',
    badge: 'FLAGSHIP CONCLAVE',
    coverTheme: { base: '#0F75BC', accent: '#FFFFFF', foil: 'rgba(255, 255, 255, 0.72)', ink: 'light' },
    spineColor: '#0B5C94',
  },
  handbook: {
    id: 'handbook',
    tone: 'handbook',
    title: "Innovator's Field Handbook",
    shortTitle: 'Handbook',
    subtitle: 'Validation loops & operating notes for zero-to-one builders.',
    series: 'ZERO-TO-ONE FIELD MANUAL',
    edition: 'VOL. IV — 2026',
    mark: 'GEC / 03 // FIELD NOTES',
    badge: 'FOUNDER PLAYBOOK',
    coverTheme: { base: '#FCF8ED', accent: '#8B020B', foil: 'rgba(139, 2, 11, 0.42)', ink: 'dark' },
    spineColor: '#8B020B',
  },
  founders: {
    id: 'founders',
    tone: 'founders',
    title: 'Wall of Founders',
    shortTitle: 'Founders',
    subtitle: 'Alumni ventures, syndicates, and portfolio records.',
    series: 'VENTURE ALUMNI ROLL // 2018–2026',
    edition: 'LIBER FUNDATORUM',
    mark: 'GEC / 04 // ALUMNI LEDGER',
    badge: 'ALUMNI ROLL',
    coverTheme: { base: '#18181B', accent: '#FBCA05', foil: 'rgba(251, 202, 5, 0.65)', ink: 'light' },
    spineColor: '#101012',
  },
}

export function GecMark({ size = 54 }: { size?: number }) {
  return (
    <svg
      className="gec-book-cover__mark"
      viewBox="0 0 72 72"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="36" cy="36" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M36 19 47 26v12c0 8-4.4 13.5-11 16-6.6-2.5-11-8-11-16V26l11-7Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="m36 27 2.2 5.7 5.8 2.2-5.8 2.1-2.2 5.8-2.2-5.8-5.8-2.1 5.8-2.2L36 27Z" fill="currentColor" />
    </svg>
  )
}

/**
 * Unified Cover Artwork System shared across:
 * - Miniature desk books (92×122px)
 * - Flight traveling transition element
 * - Full-size 3D book cover (350×483px)
 */
export function BookCoverArtwork({
  id,
  size = 'full',
  className = '',
}: {
  id: string
  size?: 'mini' | 'full'
  className?: string
}) {
  const spec = BOOK_SPECS[id] ?? BOOK_SPECS.incubation
  const isMini = size === 'mini'

  if (isMini) {
    return (
      <article
        className={`gec-book-cover gec-book-cover--mini gec-book-cover--${spec.tone} ${className}`.trim()}
        style={
          {
            backgroundColor: spec.coverTheme.base,
            color: spec.coverTheme.ink === 'light' ? '#FCF8ED' : '#222222',
            '--cover-foil': spec.coverTheme.foil,
          } as React.CSSProperties
        }
      >
        <div className="df-cover-foil-border df-cover-foil-border--mini" aria-hidden="true" />
        <header className="gec-book-cover__mini-header">
          <span className="gec-book-cover__mini-mark">{spec.badge}</span>
        </header>

        <div className="gec-book-cover__mini-center">
          <GecMark size={28} />
          <h4 className="gec-book-cover__mini-title">{spec.shortTitle}</h4>
        </div>

        <footer className="gec-book-cover__mini-footer">
          <span>GEC / 26</span>
          <span className="gec-book-cover__mini-arrow">→</span>
        </footer>
      </article>
    )
  }

  return (
    <article
      className={`gec-book-cover gec-book-cover--full gec-book-cover--${spec.tone} ${className}`.trim()}
      style={
        {
          backgroundColor: spec.coverTheme.base,
          color: spec.coverTheme.ink === 'light' ? '#FCF8ED' : '#222222',
          '--cover-foil': spec.coverTheme.foil,
        } as React.CSSProperties
      }
    >
      <div className="df-cover-foil-border" aria-hidden="true" />
      <header className="gec-book-cover__running">
        <span>{spec.series}</span>
        <span>{spec.edition}</span>
      </header>

      <div className="gec-book-cover__title-block">
        <GecMark size={54} />
        <span className="gec-book-cover__mark-label">{spec.mark}</span>
        <h2>{spec.title}</h2>
        <p>{spec.subtitle}</p>
      </div>

      <footer className="gec-book-cover__footer">
        <span>Galgotias Entrepreneurship Cell</span>
        <span>Open Volume →</span>
      </footer>
    </article>
  )
}

export function BookBackCoverArtwork({
  id,
  epigraph,
  line,
}: {
  id: string
  epigraph: string
  line: string
}) {
  const spec = BOOK_SPECS[id] ?? BOOK_SPECS.incubation
  return (
    <article
      className={`gec-book-cover gec-book-cover--full gec-book-cover--${spec.tone} gec-book-cover--back`}
      style={
        {
          backgroundColor: spec.coverTheme.base,
          color: spec.coverTheme.ink === 'light' ? '#FCF8ED' : '#222222',
          '--cover-foil': spec.coverTheme.foil,
        } as React.CSSProperties
      }
    >
      <div className="df-cover-foil-border" aria-hidden="true" />
      <header className="gec-book-cover__running">
        <span>GEC ARCHIVES</span>
        <span>2026 REVISED</span>
      </header>
      <div className="gec-book-cover__title-block">
        <GecMark size={54} />
        <h2>{epigraph}</h2>
        <p>{line}</p>
      </div>
      <footer className="gec-book-cover__footer">
        <span>Galgotias University // Greater Noida</span>
        <span>GEC / 26</span>
      </footer>
    </article>
  )
}

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

export type PageData = {
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

export function EditorialPage({ tone, folio, page }: { tone: Tone; folio: number; page: PageData }) {
  const id = `${tone.slice(0, 3).toUpperCase()}—${String(folio).padStart(2, '0')}`
  return (
    <article className={`gec-editorial-page gec-editorial-page--${tone}`}>
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

const buildPages = (tone: Tone, data: PageData[]) =>
  data.map((page, index) => (
    <EditorialPage key={`${tone}-${index + 1}`} tone={tone} folio={index + 1} page={page} />
  ))

/* -------------------------------------------------------------------------- */
/* VOLUME 01: INCUBATION DOSSIER (8 Pages)                                    */
/* -------------------------------------------------------------------------- */
const INCUBATION_PAGES = buildPages('incubation', [
  {
    running: 'Opening Mandate',
    kicker: 'MANDATE // COHORT 2026',
    category: 'INCUBATION CHARTER',
    title: 'Ideas deserve a room before they need a company.',
    deck: 'The incubation programme is a protected sanctuary to test acute friction, build the smallest useful prototype, and learn from verifiable evidence.',
    highlight: 'Premature scaling kills more student ventures than lack of funding. We protect your right to iterate quietly away from pitch theater.',
    note: 'Begin with the problem · Doc 2026-INC-01',
  },
  {
    running: 'Ethos & Rights',
    kicker: 'FOUNDER RIGHTS',
    category: 'THREE PROMISES',
    title: 'Three institutional promises to student builders',
    deck: 'Standard university incubators extract equity too early. GEC does the exact opposite.',
    items: [
      { label: '01', title: 'Founders retain 100% equity', tag: 'ZERO DILUTION', body: 'Zero institutional equity clawback during prototype exploration. Your intellectual property stays entirely yours.' },
      { label: '02', title: 'Evidence before scale', tag: 'DATA FIRST', body: 'Observed user transactions and retention telemetry matter infinitely more than vanity follower metrics.' },
      { label: '03', title: 'Surgical operator network', tag: 'ACTIVE MENTORS', body: 'Seasoned alumni operators and venture partners arrive on-demand at the precise moment a technical roadblock occurs.' },
    ],
    note: 'Incubation Governance Charter',
  },
  {
    running: 'Cohort Architecture',
    kicker: 'CAPACITY & RATIOS',
    category: 'SPRINT METRICS',
    title: 'A high-conviction programme with room to work',
    deck: 'Structured across 16 guided sprint weeks with high selectivity and active operator advisory.',
    stats: [
      { value: '16', label: 'Guided Sprint Weeks', sub: '3 phased milestone gates' },
      { value: '24', label: 'Teams Per Cohort', sub: 'High selectivity baseline' },
      { value: '1:6', label: 'Mentor-to-Team Ratio', sub: 'Active weekly advisory' },
    ],
    note: 'Cohort 2026 Programme Structure',
  },
  {
    running: 'Sprint Milestones',
    kicker: 'PHASED GATES',
    category: 'SPRINT PHASES',
    title: 'Three phased milestones from spark to syndicate',
    deck: 'Each phase requires verified customer telemetry before unlocking the next operational tier.',
    stepper: [
      'Phase I: Problem Validation & Friction Audit (Weeks 1–4)',
      'Phase II: Functional MVP Build & Field Trial (Weeks 5–12)',
      'Phase III: Institutional Syndication & Demo Day (Weeks 13–16)',
    ],
    note: 'Milestone Gates & Review Protocol',
  },
  {
    running: 'Capital Allocation',
    kicker: 'PROTOTYPE GRANTS',
    category: 'NON-DILUTIVE SEED',
    title: 'Seed support without losing the plot',
    deck: 'Prototype grants purchase learning velocity: a manufacturing batch, field trial, or critical experiment.',
    items: [
      { label: '₹1L', title: 'Tranche I: Proof of Need', tag: 'MILESTONE 1', body: 'Awarded upon verification of 15 customer discovery interviews and competitor teardown.' },
      { label: '₹2L', title: 'Tranche II: Working Prototype', tag: 'MILESTONE 2', body: 'Disbursed to manufacture hardware prototypes or host production cloud beta software.' },
      { label: '₹2L', title: 'Tranche III: Pilot Trial', tag: 'MILESTONE 3', body: 'Allocated for on-ground village or campus pilot deployments with active telemetry.' },
    ],
    note: 'Zero equity dilution · Disbursed on milestone verification',
  },
  {
    running: 'Lab Infrastructure',
    kicker: 'LAB ACCESS',
    category: 'FABRICATION & CLOUD',
    title: 'Make the first version tangible',
    deck: 'From precision SMD electronics to scalable model inference, build without infrastructure friction.',
    items: [
      { label: 'FAB', title: 'Rapid Hardware Fabrication Bench', tag: 'HARDWARE', body: 'Dual-extruder 3D printers, laser cutters, SMD soldering, and oscilloscope diagnostic rigs.' },
      { label: 'GPU', title: '₹12L+ Cloud Runway Credits', tag: 'AI & CLOUD', body: 'AWS Activate, Google for Startups, and Azure compute credits for live fine-tuning and hosting.' },
      { label: 'SAAS', title: 'Production Dev Tooling Suite', tag: 'TOOLING', body: 'Full team seats on GitHub Enterprise, Figma Organization, Postman, and Mixpanel analytics stacks.' },
    ],
    note: 'Reserve benches via GEC Maker Desk',
  },
  {
    running: 'Governance & Legal',
    kicker: 'FOUNDER PROTECTION',
    category: 'LEGAL PROTOCOLS',
    title: 'Get the fundamentals right early',
    deck: 'Clean legal foundations protect friendships, eliminate cap-table disputes, and accelerate diligence.',
    items: [
      { label: 'IP', title: 'Unambiguous IP Assignment', tag: 'PATENTS', body: 'Ensure all software source code, circuit schematics, and design assets belong legally to the corporate entity.' },
      { label: 'ESOP', title: 'Universal 4-Year Vesting with 1-Year Cliff', tag: 'VESTING', body: 'Every founder vests shares over 4 years to guarantee long-term alignment and protect the venture.' },
      { label: 'TAX', title: 'DPIIT & Section 80-IAC Exemption', tag: 'COMPLIANCE', body: '1-on-1 sessions covering Pvt Ltd incorporation, GST setup, and 3-year income tax exemptions.' },
    ],
    note: 'Clarity is a form of velocity',
  },
  {
    running: 'Admissions Desk',
    kicker: 'APPLICATION PROTOCOL',
    category: 'PROOF OVER PROMISES',
    title: 'Show the problem, then the proof',
    deck: 'We prioritize evidence of execution over presentation polish. Tell us what you learned from speaking directly with users.',
    action: { label: 'Admissions Office', value: 'incubation@gecgalgotias.org', tag: 'SUBMIT BRIEF' },
    note: 'Official Incubation Office · Innovation Tower 3F',
  },
])

/* -------------------------------------------------------------------------- */
/* VOLUME 02: E-SUMMIT CONCLAVE BLUEPRINT (8 Pages)                           */
/* -------------------------------------------------------------------------- */
const SUMMIT_PAGES = buildPages('summit', [
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
    title: 'Three active stages engineered for focus',
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
    highlight: 'Fifty shortlisted teams defend unit economics directly before a jury of institutional venture partners. Winners receive direct induction into GEC Incubator.',
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
      { label: 'SALON', title: 'Founder & Syndicate Lounge', tag: 'DEAL FLOW', body: 'Continuous lounge where partners examine live product demos and sign preliminary diligence sheets.' },
    ],
    note: 'Enforced by digital countdown displays on stage',
  },
  {
    running: 'BuildSprint Arena',
    kicker: 'HACKATHON PROTOCOL',
    category: '24-HOUR SPRINT',
    title: 'A sleepless night for turning code into arguments',
    deck: 'Multidisciplinary teams tackle complex civic, financial, and climate problems, delivering testable prototypes before sunrise.',
    stepper: [
      'T-00: Problem Drop & Team Registration Lock',
      'T-06: Technical Architecture & API Checkpoint',
      'T-14: Functional Prototype & Hardware Bench Test',
      'T-24: Stage Demonstration & Jury Evaluation',
    ],
    note: 'Continuous fuel, hardware benches & mentors provided',
  },
  {
    running: 'Hackathon Tracks',
    kicker: 'PROBLEM DOMAINS',
    category: 'CHALLENGE BRIEFS',
    title: 'Four systemic friction domains',
    deck: 'Choose a track with high local consequence and build software or embedded systems that solve the core bottleneck.',
    items: [
      { label: 'TRACK 1', title: 'Climate Tech & Circular Materials', tag: 'GREEN', body: 'Decentralized energy microgrids, battery recycling logistics, and biodegradable packaging.' },
      { label: 'TRACK 2', title: 'Edge AI & Healthcare Diagnostics', tag: 'HEALTH', body: 'Low-latency screening models for tier-3 clinics, telemedicine triaging, and rural records.' },
      { label: 'TRACK 3', title: 'Future of Work & Freelance Rails', tag: 'FINTECH', body: 'Instant cross-border settlement, worker safety infrastructure, and micro-business credit.' },
      { label: 'TRACK 4', title: 'Open Digital Public Infrastructure', tag: 'DPI', body: 'Interoperable protocols built on ONDC, UPI, and Account Aggregator rails.' },
    ],
    note: 'Jury includes track-sponsor engineering leaders',
  },
  {
    running: 'Capital Partners',
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
    action: { label: 'Conclave Registry', value: 'summit@gecgalgotias.org', tag: 'REGISTER NOW' },
    note: 'E-Summit 2026 Directorate · Greater Noida',
  },
])

/* -------------------------------------------------------------------------- */
/* VOLUME 03: INNOVATOR'S FIELD HANDBOOK (8 Pages)                            */
/* -------------------------------------------------------------------------- */
const HANDBOOK_PAGES = buildPages('handbook', [
  {
    running: 'Validation Playbook',
    kicker: 'RULE 01 // DISCOVERY',
    category: 'FIELD MANUAL',
    title: 'Do not ask whether they like it.',
    deck: 'Compliments are conversational currency that costs the user nothing. Only past behaviour and monetary commitments count.',
    highlight: 'Never ask "Would you use this?" Instead ask: "When was the last time this problem occurred, and how much did you pay to patch it?"',
    note: 'Founder Field Handbook · Page 01',
  },
  {
    running: 'Pricing & Evidence',
    kicker: 'RULE 02 // MONETIZATION',
    category: 'ECONOMIC BASELINE',
    title: 'Pressure-test the economic exchange',
    deck: 'A product that cannot charge on day one rarely finds magic pricing power on day three hundred.',
    stats: [
      { value: '10', label: 'Obsessed Early Users', sub: 'Who refuse to leave without it' },
      { value: '3x', label: 'LTV to CAC Target', sub: 'Baseline venture sustainability' },
      { value: '₹500', label: 'Minimum Beta Charge', sub: 'Filter polite friends from users' },
    ],
    note: 'Audit baseline unit economics monthly',
  },
  {
    running: 'Hardware Protocol',
    kicker: 'RULE 03 // FABRICATION',
    category: 'MAKER DESK',
    title: 'Prototype the riskiest component first',
    deck: 'Do not spend two weeks polishing an enclosure when you haven\'t verified if the sensor communicates over I2C.',
    items: [
      { label: 'HW-1', title: 'Breadboard Before Custom PCB', tag: 'PROTOTYPING', body: 'Prove component compatibility using off-the-shelf boards (ESP32/RP2040) before Gerber layout.' },
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
      { label: 'GOV-3', title: 'Founder Departure Clause', tag: 'EXIT CLAUSE', body: 'Pre-agree on unvested share buyback mechanisms at nominal par value if a founder departs for placements.' },
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
    deck: 'Office hours are surgical sessions. Arrive with the specific blocker halting progress this week.',
    items: [
      { label: 'EIR', title: 'Weekly EIR Sprint Reviews', tag: 'SPRINT', body: '45-minute sprint planning focusing on the single bottleneck that unlocks customer growth this cycle.' },
      { label: 'DECK', title: 'Deck Teardown & Narrative Audit', tag: 'STORY', body: 'Aggressive slide-by-slide teardown examining logical jumps, market sizing fallacies, and defense.' },
      { label: 'FIN', title: 'Financial Runway & Burn Modeling', tag: 'CASH FLOW', body: 'Translating headcount, server usage, and marketing experiments into exact monthly cash burn.' },
    ],
    note: 'One clinic / one clear decision',
  },
  {
    running: 'Field Desk Hours',
    kicker: 'RULE 08 // CLINIC TIMETABLE',
    category: 'BOOKING RULES',
    title: 'Write the question before booking the room',
    deck: 'Clinic slots open every Monday morning on the founder portal. Bring raw data, not vague theories.',
    items: [
      { label: 'TUE', title: 'Legal & Compliance Clinic', tag: '15:00–18:00', body: 'Contracts, IP assignment, cap table structuring, and DPIIT tax filings · Innovation Tower 304.' },
      { label: 'WED', title: 'Hardware & Circuit Bench Hours', tag: '14:00–19:00', body: 'Oscilloscope diagnostic testing, SMD soldering, and laser cutter certification · Fabrication Lab.' },
      { label: 'THU', title: 'Pitch & Narrative Salons', tag: '16:00–19:00', body: 'Mock investor interrogation and term sheet mechanics with visiting venture partners · Boardroom.' },
    ],
    note: 'Official GEC Founder Field Manual · Rev 2026',
  },
])

/* -------------------------------------------------------------------------- */
/* VOLUME 04: WALL OF FOUNDERS (8 Pages)                                      */
/* -------------------------------------------------------------------------- */
const FOUNDERS_PAGES = buildPages('founders', [
  {
    running: 'Venture Alumni Roll',
    kicker: 'LIBER FUNDATORUM // 2018–2026',
    category: 'VENTURE LEDGER',
    title: 'The ventures are the historical record.',
    deck: 'A living ledger of Galgotias student founders who turned dorm-room prototypes into institutional-grade enterprises.',
    stats: [
      { value: '120+', label: 'Founded Ventures', sub: 'Active enterprises' },
      { value: '₹180Cr+', label: 'Combined Valuation', sub: 'Audited portfolio total' },
      { value: '18', label: 'Institutional Alliances', sub: 'VCs & angel syndicates' },
    ],
    note: 'Official Alumni Record · Registry No. 2026-VAL',
  },
  {
    running: 'Venture Monograph 01',
    kicker: 'ALUMNI SPOTLIGHT',
    category: 'AGRITECH & ROBOTICS',
    title: 'DroneX Mobility: Precision from Above',
    deck: 'Founded in 2021 by mechanical engineering students, DroneX built autonomous micro-spraying drones for North Indian farmland.',
    items: [
      { label: 'FOUNDERS', title: 'Arjun Sharma & Priyanshu Tyagi', tag: 'BATCH 2022', body: 'Built first prototype in GEC Maker Lab using 3D-printed carbon composites. Valued at ₹42Cr (Series Pre-A).' },
      { label: 'MILESTONE', title: 'Commercial DGCA Type Certification', tag: 'AEROSPACE', body: 'Secured full DGCA airworthiness approval and signed commercial distributor pact serving 140+ villages.' },
    ],
    note: 'DroneX Mobility Pvt Ltd · Alumnus 2022',
  },
  {
    running: 'Venture Monograph 02',
    kicker: 'ALUMNI SPOTLIGHT',
    category: 'CROSS-BORDER FINTECH',
    title: 'ZyroPay: Cross-Border Liquidity Rails',
    deck: 'Automated instant payout rails designed for student freelancers and digital exports across South Asia.',
    items: [
      { label: 'FOUNDER', title: 'Rohan Nair (B.Tech CSE 2023)', tag: 'FINTECH', body: 'Started as campus peer-to-peer split payment app. Processed over $8.5M annualized TPV for 65K+ freelancers.' },
      { label: 'BACKERS', title: 'Backed by Y-Combinator Alum Angels', tag: 'SEED ROUND', body: 'Raised $650K seed round led by Singapore-based fintech syndicates and Indian Angel Network.' },
    ],
    note: 'ZyroPay Technologies Inc · Alumnus 2023',
  },
  {
    running: 'Frontier Technologies',
    kicker: 'PORTFOLIO HIGHLIGHTS',
    category: 'HEALTH & MATERIALS',
    title: 'Pioneering edge AI and circular materials',
    deck: 'Galgotias founders creating breakthrough hardware and biotech solving foundational human challenges.',
    items: [
      { label: 'HEALTH', title: 'NeuraHealth Diagnostics', tag: 'EDGE AI', body: 'Portable non-invasive retinal scanning AI detecting diabetic retinopathy in under 90 seconds. Deployed in 40 district hospitals.' },
      { label: 'BIO', title: 'EcoKraft BioMaterials', tag: 'CIRCULAR', body: 'Agricultural waste transformed via mycelium growth into 100% compostable structural packaging, replacing styrofoam.' },
    ],
    note: 'Recognized under National Bio-Entrepreneurship Awards',
  },
  {
    running: 'Capital Alliances',
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
      { value: '₹2.4Cr', label: 'Grants Disbursed', sub: 'To campus startups since 2020' },
      { value: '100%', label: 'Compliance Record', sub: 'CAG & DPIIT audit pass rate' },
    ],
    note: 'Government Liaison Desk · Innovation Tower 4F',
  },
  {
    running: 'Oral Archive',
    kicker: 'FOUNDER REFLECTIONS',
    category: 'REFLECTIONS FROM THE ARENA',
    title: 'What founders remember when the dust settles',
    deck: 'Unfiltered reflections from founders looking back on the inflection points that saved their companies.',
    quote: 'The GEC prototype grant was the only check that mattered in 2021. It paid for the motor testbench that every external investor told us to postpone.',
    attribution: 'Arjun Sharma · Co-Founder, DroneX Mobility (Series Pre-A)',
    note: 'Recorded at GEC Alumni Conclave 2025',
  },
  {
    running: 'Alumni Registry',
    kicker: 'LEDGER APPLICATION',
    category: 'ROLL OF HONOR',
    title: 'Write your company into the record',
    deck: 'The Wall of Founders welcomes student and alumni ventures on rolling evaluation. Join the investment syndicate network.',
    action: { label: 'Founders Roll Desk', value: 'founders@gecgalgotias.org', tag: 'REGISTER VENTURE' },
    note: 'Official Wall of Founders · Liber Fundatorum 2026',
  },
])

export const GEC_BOOKS: GecBook[] = [
  {
    id: 'incubation',
    title: BOOK_SPECS.incubation.title,
    shortTitle: BOOK_SPECS.incubation.shortTitle,
    subtitle: BOOK_SPECS.incubation.subtitle,
    themeColor: BOOK_SPECS.incubation.coverTheme.base,
    badge: BOOK_SPECS.incubation.badge,
    coverTheme: BOOK_SPECS.incubation.coverTheme,
    spineColor: BOOK_SPECS.incubation.spineColor,
    cover: <BookCoverArtwork id="incubation" size="full" />,
    backCover: (
      <BookBackCoverArtwork
        id="incubation"
        epigraph="Build what the evidence can carry."
        line="A working dossier for student founders."
      />
    ),
    pages: INCUBATION_PAGES,
  },
  {
    id: 'summit',
    title: BOOK_SPECS.summit.title,
    shortTitle: BOOK_SPECS.summit.shortTitle,
    subtitle: BOOK_SPECS.summit.subtitle,
    themeColor: BOOK_SPECS.summit.coverTheme.base,
    badge: BOOK_SPECS.summit.badge,
    coverTheme: BOOK_SPECS.summit.coverTheme,
    spineColor: BOOK_SPECS.summit.spineColor,
    cover: <BookCoverArtwork id="summit" size="full" />,
    backCover: (
      <BookBackCoverArtwork
        id="summit"
        epigraph="Leave with a next move."
        line="The official E-Summit programme book."
      />
    ),
    pages: SUMMIT_PAGES,
  },
  {
    id: 'handbook',
    title: BOOK_SPECS.handbook.title,
    shortTitle: BOOK_SPECS.handbook.shortTitle,
    subtitle: BOOK_SPECS.handbook.subtitle,
    themeColor: BOOK_SPECS.handbook.coverTheme.base,
    badge: BOOK_SPECS.handbook.badge,
    coverTheme: BOOK_SPECS.handbook.coverTheme,
    spineColor: BOOK_SPECS.handbook.spineColor,
    cover: <BookCoverArtwork id="handbook" size="full" />,
    backCover: (
      <BookBackCoverArtwork
        id="handbook"
        epigraph="Validate fast. Write it down."
        line="A field manual for the work before scale."
      />
    ),
    pages: HANDBOOK_PAGES,
  },
  {
    id: 'founders',
    title: BOOK_SPECS.founders.title,
    shortTitle: BOOK_SPECS.founders.shortTitle,
    subtitle: BOOK_SPECS.founders.subtitle,
    themeColor: BOOK_SPECS.founders.coverTheme.base,
    badge: BOOK_SPECS.founders.badge,
    coverTheme: BOOK_SPECS.founders.coverTheme,
    spineColor: BOOK_SPECS.founders.spineColor,
    cover: <BookCoverArtwork id="founders" size="full" />,
    backCover: (
      <BookBackCoverArtwork
        id="founders"
        epigraph="The record is still being written."
        line="Galgotias Venture Alumni."
      />
    ),
    pages: FOUNDERS_PAGES,
  },
]

export const GEC_BOOKS_BY_ID: Record<string, GecBook> = Object.fromEntries(
  GEC_BOOKS.map((book) => [book.id, book]),
)
