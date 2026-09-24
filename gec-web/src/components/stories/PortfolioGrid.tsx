'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { DURATION, EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';
import './portfolio.css';

/**
 * Verbatim from public/styled.html:4238-4337 (`#portfolio-grid-container`,
 * `.portfolio-startup-item[data-sector]`) — the client's real portfolio
 * ventures. Do not paraphrase copy here; if a venture is added or removed in
 * the wireframe, mirror it here rather than editing around it.
 *
 * Accent tokens are remapped onto brand colors this app ships (--gec-gold,
 * --gec-blue, --gec-ink) — the wireframe's raw green/amber/dark-red literals
 * for CirculaWaste, QuickLogist and ByteCraft have no equivalent CSS custom
 * property in globals.css, so they're folded onto the nearest existing token
 * instead of introducing new color literals. Crimson is deliberately not a
 * card accent option: this route reserves crimson for exactly one moment —
 * the active filter chip below — so it isn't reused as decoration on every
 * card (review finding 2).
 */
type VentureSector = 'tech' | 'health' | 'sustainability' | 'consumer';
type AccentToken = 'gold' | 'blue' | 'ink';

interface PortfolioVenture {
  id: string;
  name: string;
  initials: string;
  sector: VentureSector;
  sectorLabel: string;
  stageLabel: string;
  accent: AccentToken;
  description: string;
  founders: string;
  /** Public site; the card only shows "Visit ↗" when this is set. */
  url?: string;
}

export const PORTFOLIO_VENTURES: PortfolioVenture[] = [
  {
    id: 'farmvision-ai',
    name: 'FarmVision AI',
    initials: 'FV',
    sector: 'tech',
    sectorLabel: 'AGRITECH / AI',
    stageLabel: 'SEED · ₹75L',
    // Was 'crimson'. The active filter chip is this route's one reserved
    // crimson moment (review finding 2) — every card accent moves off
    // crimson so it isn't reused as decoration six times over.
    accent: 'ink',
    description:
      'Multispectral drone telemetry analyzing crop disease patterns and pesticide requirements for rural farmers.',
    founders: 'Aman Sharma & Riya Verma',
  },
  {
    id: 'revivehealth',
    name: 'ReviveHealth',
    initials: 'RH',
    sector: 'health',
    sectorLabel: 'HEALTHCARE',
    stageLabel: 'PRE-SEED',
    accent: 'blue',
    description:
      'Point-of-care rapid blood analysis diagnostic sensors designed for tier-3 clinics and emergency responders.',
    founders: 'Dr. Siddharth & Team',
  },
  {
    id: 'codecampus',
    name: 'CodeCampus',
    initials: 'CC',
    sector: 'tech',
    sectorLabel: 'EDTECH / DEV',
    stageLabel: 'INCUBATED',
    accent: 'ink',
    description:
      'Peer-to-peer software engineering apprenticeship and automated code review platform serving 15k+ students.',
    founders: 'Tanmay Joshi',
  },
  {
    id: 'circulawaste',
    name: 'CirculaWaste',
    initials: 'CW',
    sector: 'sustainability',
    sectorLabel: 'SUSTAINABILITY',
    stageLabel: 'PROTOTYPE',
    accent: 'gold',
    description:
      'Smart IoT waste segregation bins using computer vision sensors to sort recyclable polymers automatically.',
    founders: 'Pooja Kulkarni',
  },
  {
    id: 'quicklogist',
    name: 'QuickLogist',
    initials: 'QL',
    sector: 'consumer',
    sectorLabel: 'CONSUMER LOGISTICS',
    stageLabel: 'EARLY TRACTION',
    accent: 'gold',
    description:
      'Automated campus smart parcel lockers and zero-emission micro-hub delivery for university students.',
    founders: 'Arjun Saxena',
  },
  {
    id: 'bytecraft-studios',
    name: 'ByteCraft Studios',
    initials: 'BC',
    sector: 'tech',
    sectorLabel: 'GAMING & TECH',
    stageLabel: 'BOOTSTRAPPED',
    accent: 'ink',
    description:
      'Indie game development studio producing Indian historical and mythology inspired mobile titles with 250k+ downloads.',
    founders: 'Varun & Team',
  },
];

/** Display copy for each sector. `Record<VentureSector, string>` makes this
 * the single canonical enum of sectors — TypeScript won't compile if a
 * sector is missing here, so the filter chip list (derived from this map's
 * keys below) can't drift out of sync with a second hand-copied list. */
const SECTOR_LABELS: Record<VentureSector, string> = {
  tech: 'Technology',
  health: 'Healthcare',
  sustainability: 'Sustainability',
  consumer: 'Consumer',
};

type FilterValue = 'all' | VentureSector;

// The filter chips come from SECTOR_LABELS' keys, not a second hand-copied
// list of sector strings — `Record<VentureSector, string>` above means
// TypeScript itself refuses to compile if a sector is added to the
// `VentureSector` union without a label for it, so this can't drift out of
// sync with the type. It's intentionally NOT derived from "which sectors the
// current ventures happen to use": a sector can be a real filter with zero
// ventures in it today, which is exactly the case the empty state below
// exists for.
const AVAILABLE_SECTORS = Object.keys(SECTOR_LABELS) as VentureSector[];

export function PortfolioGrid() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const prefersReducedMotion = useReducedMotion();

  const filtered = useMemo(() => {
    if (filter === 'all') return PORTFOLIO_VENTURES;
    return PORTFOLIO_VENTURES.filter((v) => v.sector === filter);
  }, [filter]);

  const fadeDuration = prefersReducedMotion ? 0 : DURATION.micro / 1000;

  return (
    <div>
      <div
        className="pf-filters"
        role="group"
        aria-label="Filter portfolio by sector"
      >
        <FilterButton
          label={`All Sectors (${PORTFOLIO_VENTURES.length})`}
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        {AVAILABLE_SECTORS.map((sector) => (
          <FilterButton
            key={sector}
            label={SECTOR_LABELS[sector]}
            active={filter === sector}
            onClick={() => setFilter(sector)}
          />
        ))}
      </div>

      <div className="pf-body">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeDuration, ease: EASE.spring }}
          >
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="pf-grid">
                {filtered.map((venture) => (
                  <VentureCard key={venture.id} venture={venture} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={cn('pf-chip', active && 'is-active')}>
      {label}
    </button>
  );
}

function VentureCard({ venture }: { venture: PortfolioVenture }) {
  return (
    <article id={venture.id} className={`brand-card pf-card pf-accent-${venture.accent}`} data-sector={venture.sector}>
      <div className="pf-card__top">
        <div className="pf-initials" aria-hidden="true">{venture.initials}</div>
        <span className="pf-stage">{venture.stageLabel}</span>
      </div>
      <h3 className="h3-card pf-name">{venture.name}</h3>
      <div className="pf-sector">SECTOR: {venture.sectorLabel}</div>
      <p className="body-editorial pf-desc">{venture.description}</p>
      <div className="pf-foot">
        <span className="pf-founders">{venture.founders}</span>
        {venture.url && (
          <a className="pf-visit" href={venture.url} target="_blank" rel="noreferrer">Visit ↗</a>
        )}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="brand-card pf-empty" role="status">
      <p className="h3-card">No ventures in this sector yet.</p>
      <p className="body-editorial">
        New founders join the Galgotias portfolio every cohort — check back soon, or explore another sector above.
      </p>
    </div>
  );
}
