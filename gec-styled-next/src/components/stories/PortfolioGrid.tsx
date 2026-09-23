'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { DURATION, EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Verbatim from public/styled.html:4238-4337 (`#portfolio-grid-container`,
 * `.portfolio-startup-item[data-sector]`) — the client's real portfolio
 * ventures. Do not paraphrase copy here; if a venture is added or removed in
 * the wireframe, mirror it here rather than editing around it.
 *
 * Accent tokens are remapped onto the four brand colors this app ships
 * (--gec-crimson, --gec-gold, --gec-blue, --gec-ink) — the wireframe's raw
 * green/amber/dark-red literals for CirculaWaste, QuickLogist and ByteCraft
 * have no equivalent CSS custom property in globals.css, so they're folded
 * onto the nearest existing token instead of introducing new color literals.
 */
type VentureSector = 'tech' | 'health' | 'sustainability' | 'consumer';
type AccentToken = 'crimson' | 'gold' | 'blue' | 'ink';

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
}

export const PORTFOLIO_VENTURES: PortfolioVenture[] = [
  {
    id: 'farmvision-ai',
    name: 'FarmVision AI',
    initials: 'FV',
    sector: 'tech',
    sectorLabel: 'AGRITECH / AI',
    stageLabel: 'SEED · ₹75L',
    accent: 'crimson',
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

const ACCENT_CLASSES: Record<AccentToken, { chip: string; badge: string }> = {
  crimson: {
    chip: 'bg-[var(--gec-crimson)]/10 border-[var(--gec-crimson)] text-[var(--gec-crimson)]',
    badge: 'bg-[var(--gec-crimson)] text-white',
  },
  blue: {
    chip: 'bg-[var(--gec-blue)]/10 border-[var(--gec-blue)] text-[var(--gec-blue)]',
    badge: 'bg-[var(--gec-blue)] text-white',
  },
  gold: {
    chip: 'bg-[var(--gec-gold)]/15 border-[var(--gec-gold)] text-[var(--gec-ink)]',
    badge: 'bg-[var(--gec-gold)]/25 text-[var(--gec-ink)]',
  },
  ink: {
    chip: 'bg-[var(--gec-ink)]/8 border-[var(--gec-ink)] text-[var(--gec-ink)]',
    badge: 'bg-[var(--gec-ink)] text-white',
  },
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

  const fadeDuration = prefersReducedMotion ? 0 : DURATION.ui / 1000;

  return (
    <div>
      <div
        className="flex flex-wrap justify-center gap-2 sm:justify-start"
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

      <div className="relative mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeDuration, ease: EASE.out }}
          >
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-11 items-center rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'focus-visible:ring-[var(--gec-crimson)] focus-visible:ring-offset-[var(--gec-canvas)]',
        active
          ? 'border-[var(--gec-crimson)] bg-[var(--gec-crimson)] text-white'
          : 'border-[var(--gec-border)] bg-[var(--gec-surface-card)] text-[var(--gec-ink-muted)] hover:text-[var(--gec-ink)]'
      )}
      style={{ transitionDuration: 'var(--dur-ui)' }}
    >
      {label}
    </button>
  );
}

function VentureCard({ venture }: { venture: PortfolioVenture }) {
  const accent = ACCENT_CLASSES[venture.accent];
  return (
    <div
      className="surface-card flex flex-col rounded-2xl p-6"
      style={{ boxShadow: 'var(--elev-raised)' }}
      data-sector={venture.sector}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-lg border font-display text-base font-black',
            accent.chip
          )}
          aria-hidden="true"
        >
          {venture.initials}
        </div>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.04em]',
            accent.badge
          )}
        >
          {venture.stageLabel}
        </span>
      </div>

      <h3
        className="mt-4 font-display font-bold text-[var(--gec-ink)]"
        style={{ fontSize: 'var(--text-lg)' }}
      >
        {venture.name}
      </h3>
      <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.04em] text-[var(--gec-ink-muted)]">
        SECTOR: {venture.sectorLabel}
      </div>
      <p
        className="mt-2 flex-1 text-[var(--gec-ink-muted)]"
        style={{ fontSize: 'var(--text-sm)', lineHeight: 1.55 }}
      >
        {venture.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--gec-border)] pt-3 text-xs">
        <span className="font-semibold text-[var(--gec-ink)]">{venture.founders}</span>
        <span className="font-bold text-[var(--gec-crimson)]">Visit →</span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="surface-card flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[var(--gec-border)] px-6 py-16 text-center"
      role="status"
    >
      <p
        className="font-display font-bold text-[var(--gec-ink)]"
        style={{ fontSize: 'var(--text-lg)' }}
      >
        No ventures in this sector yet.
      </p>
      <p className="max-w-[46ch] text-[var(--gec-ink-muted)]" style={{ fontSize: 'var(--text-sm)' }}>
        New founders join the Galgotias portfolio every cohort — check back soon, or explore
        another sector above.
      </p>
    </div>
  );
}
