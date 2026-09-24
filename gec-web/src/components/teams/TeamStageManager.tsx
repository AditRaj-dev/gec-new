'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { ShaderLayer } from '@/components/ShaderLayer';
import Image from 'next/image';
import { GEC_TEAMS, TeamStageData } from '@/lib/teamsData';
import { TeamEmblem } from './TeamEmblem';
import { submitForm } from '@/lib/api';
import './stage-manager.css';

export interface TeamStageManagerProps {
  initialTeamIndex?: number;
  initialMode?: 'detail' | 'roster';
  showHero?: boolean;
  teams?: TeamStageData[];
  id?: string;
  onApplyClick?: (team: TeamStageData) => void;
}

const TEAM_CONFIG: Record<number, { roleClass: string; roleTag: string; badge: string }> = {
  1: { roleClass: 'role-gold', roleTag: '[STARTUP DEVELOPMENT]', badge: 'Cohort Incubation' },
  2: { roleClass: 'role-crimson', roleTag: '[PR & NETWORKING]', badge: 'VC & Corporate Alliances' },
  3: { roleClass: 'role-orange', roleTag: '[MARKETING & CA]', badge: '40+ Block Ambassadors' },
  4: { roleClass: 'role-burgundy', roleTag: '[EVENT MANAGEMENT]', badge: 'Stage Ops & Venues' },
  5: { roleClass: 'role-blue', roleTag: '[DIGITAL MEDIA]', badge: 'Visual & Editorial Lab' },
  6: { roleClass: 'role-slate', roleTag: '[TECHNICAL TEAM]', badge: 'Full-Stack & Infra' },
  7: { roleClass: 'role-bronze', roleTag: '[CAREER CONNECT]', badge: '8-Week Internships' },
};

export function TeamStageManager({
  initialTeamIndex = 1,
  initialMode = 'detail',
  showHero = true,
  teams = GEC_TEAMS,
  id = 'teams-stage-manager',
  onApplyClick,
}: TeamStageManagerProps) {
  const [activeTeamIndex, setActiveTeamIndex] = useState<number>(initialTeamIndex);
  const [viewMode, setViewMode] = useState<'detail' | 'roster'>(initialMode);
  const [toast, setToast] = useState<{ title: string; desc: string } | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({ fullName:'', email:'', phone:'', yearBranch:'', interest:'' });

  const sectionRef = useRef<HTMLElement>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);
  const activeTeam = teams.find((t) => t.index === activeTeamIndex) || teams[0];

  const showToast = (title: string, desc: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ title, desc });
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  };
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const exploreTeamDetail = (teamIndex: number) => {
    const target = teams.find((t) => t.index === teamIndex);
    if (!target) return;
    if (teamIndex === activeTeamIndex && viewMode === 'detail') return;

    const reducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasVT = typeof document !== 'undefined' &&
      'startViewTransition' in document && !reducedMotion;

    /**
     * Stage-Manager shared-element choreography:
     *  - Outgoing active card + current detail canvas share `team-shared-{prev}`
     *    → canvas shrinks into the rail slot the old card came from.
     *  - Incoming target card + soon-to-be canvas share `team-shared-{next}`
     *    → target card physically expands into the big detail canvas.
     *  - Every other rail card gets a stable `team-card-{N}` so their tilted
     *    positions animate smoothly (roster → rail, rail → roster).
     */
    const prepareSharedNames = () => {
      const blueprint = document.getElementById('team-detail-blueprint');
      const currentCard = document.querySelector<HTMLElement>(
        `#${id} .team-item-card.is-active-team`
      );
      const nextCard = document.querySelector<HTMLElement>(
        `#${id} .team-item-card[data-team-index="${teamIndex}"]`
      );

      // Base names for every rail card (roster ↔ rail morph)
      document.querySelectorAll<HTMLElement>(`#${id} .team-item-card`).forEach((card) => {
        card.style.viewTransitionName = `team-card-${card.dataset.teamIndex}`;
      });

      // Pair outgoing card ↔ outgoing canvas
      if (blueprint && currentCard && viewMode === 'detail') {
        const outgoing = `team-shared-${currentCard.dataset.teamIndex}`;
        blueprint.style.viewTransitionName = outgoing;
        currentCard.style.viewTransitionName = outgoing;
      }
      // Incoming card takes the new shared name
      if (nextCard) {
        nextCard.style.viewTransitionName = `team-shared-${teamIndex}`;
      }

      return () => {
        if (blueprint) blueprint.style.removeProperty('view-transition-name');
        document.querySelectorAll<HTMLElement>(`#${id} .team-item-card`).forEach((card) => {
          card.style.removeProperty('view-transition-name');
        });
      };
    };

    if (hasVT) {
      const cleanup = prepareSharedNames();
      const doc = document as Document & {
        startViewTransition: (cb: () => void) => { finished: Promise<void> };
      };
      const transition = doc.startViewTransition(() => {
        flushSync(() => {
          setActiveTeamIndex(teamIndex);
          setViewMode('detail');
        });
        // Live blueprint takes the incoming shared name so it lands aligned
        const liveBlueprint = document.getElementById('team-detail-blueprint');
        if (liveBlueprint) {
          liveBlueprint.style.viewTransitionName = `team-shared-${teamIndex}`;
        }
      });
      transition.finished.finally(() => cleanup());
    } else {
      setActiveTeamIndex(teamIndex);
      setViewMode('detail');
    }
    showToast('Team selected', target.name);
  };

  const handleApplyOpen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onApplyClick) onApplyClick(activeTeam);
    setApplied(false); setSubmitError(''); setIsApplyOpen(true);
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setSubmitError('');
    const res = await submitForm({
      formType: 'recruitment',
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      message: formData.interest,
      metadata: { team: activeTeam.applyTarget, yearBranch: formData.yearBranch, source: 'teams-stage-manager' },
    });
    setSubmitting(false);
    // Keep what the user typed on failure; only confirm when the service accepted it.
    if (!res.success) { setSubmitError(res.message); return; }
    setApplied(true);
    setTimeout(() => {
      setIsApplyOpen(false); setApplied(false);
      showToast('Application received', `We'll reach out about ${activeTeam.applyTarget}.`);
      setFormData({ fullName:'', email:'', phone:'', yearBranch:'', interest:'' });
    }, 1200);
  };
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isApplyOpen) setIsApplyOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isApplyOpen]);
  const modalTitleId = useId();

  return (
    <div className="team-stage-wrapper w-full">
      {toast && (
        <div role="status" aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-[#FFFDF8] border border-[rgba(163,4,15,0.28)] shadow-xl rounded-xl p-4 max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-[#A3040F] mt-1.5 shrink-0 animate-pulse" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A3040F]">{toast.title}</div>
            <div className="text-sm font-medium text-[#222222] mt-0.5 truncate">{toast.desc}</div>
          </div>
          <button onClick={() => setToast(null)} className="text-[#5F5650] hover:text-[#222222] text-lg leading-none px-1 cursor-pointer" aria-label="Dismiss">×</button>
        </div>
      )}

      {/* HERO */}
      {showHero && (
        <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[rgba(163,4,15,0.22)] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A3040F]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#A3040F]">The Engine of GEC</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#222222] leading-[1.05]">
            7 Teams. <span className="text-[#A3040F]">One Shared Vision.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#5F5650] leading-relaxed max-w-2xl mx-auto">
            Different specialised capabilities, working in tight synchronisation to build
            Northern India&apos;s most active student startup ecosystem.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Jump to team">
            {teams.map((team) => {
              const active = team.index === activeTeamIndex && viewMode === 'detail';
              return (
                <button key={team.id} type="button" onClick={() => exploreTeamDetail(team.index)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer border ${
                    active ? 'bg-[#A3040F] text-white border-[#A3040F] shadow-sm'
                    : 'bg-[#FFFDF8] text-[#5F5650] hover:text-[#222222] hover:bg-white border-[rgba(163,4,15,0.18)]'
                  }`}
                  aria-pressed={active}>
                  <span className="font-mono text-[#A3040F] mr-1 opacity-60">{String(team.index).padStart(2,'0')}</span>
                  {team.shortName}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* STAGE MANAGER */}
      <section ref={sectionRef} id={id} data-motion-state={viewMode}
        className={`team-stage-manager-section gec-shader-host ${viewMode === 'detail' ? 'is-detail-active' : ''}`}>
        <ShaderLayer family="wash" />
        <div className="stage-status-bar">
          <div className="stage-status-label">
            {viewMode === 'detail'
              ? <><span className="stage-status-dim">Now viewing ·</span> <span className="stage-status-name">{activeTeam.name}</span></>
              : <span className="stage-status-dim">Full roster · 7 teams</span>}
          </div>
        </div>

        {/* Rail / stack of team cards */}
        <div className="teams-horizontal-stack" role="group" aria-label="Teams roster">
          {teams.map((team) => {
            const isActive = team.index === activeTeamIndex;
            const meta = TEAM_CONFIG[team.index] || {
              roleClass: 'role-gold',
              roleTag: `[${team.shortName.toUpperCase()}]`,
              badge: team.roleTag,
            };

            return (
              <div
                key={team.id}
                data-team-index={team.index}
                role="button"
                tabIndex={0}
                aria-label={`Open ${team.name} team detail`}
                aria-pressed={isActive}
                onClick={() => exploreTeamDetail(team.index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    exploreTeamDetail(team.index);
                  }
                }}
                style={{
                  ['--preview-scale' as string]: team.previewScale,
                  ['--preview-opacity' as string]: team.previewOpacity,
                }}
                className={`team-item-card ${isActive && viewMode === 'detail' ? 'is-active-team' : ''}`}
              >
                {/* Rail-only decoration (hidden in roster mode via CSS) */}
                <span className="team-card-halo" aria-hidden="true" />
                <TeamEmblem index={team.index} className="team-card-emblem" />
                <div className="team-card-identity">
                  <div className="team-card-meta-top">
                    <span className="team-card-num">{String(team.index).padStart(2, '0')}</span>
                    <span className={`element-role-tag ${meta.roleClass}`}>{meta.roleTag}</span>
                    <span className="team-card-hover-cue">SELECT ↗</span>
                  </div>
                  <h3 className="team-card-title">{team.name}</h3>
                  <p className="team-card-desc">{team.desc}</p>
                  <div className="team-card-meta-bottom">
                    <span className="team-meta-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Lead: {team.headName}
                    </span>
                    <span className="team-meta-sep">·</span>
                    <span className="team-meta-badge">{meta.badge}</span>
                    <span className="team-meta-sep">·</span>
                    <span className="team-meta-subtle">{team.coordinatorsCount} Coordinators</span>
                  </div>
                </div>

                <div className="team-card-responsibilities">
                  <div className="team-pillars-header">
                    <span className="dim-label" style={{ fontWeight: 700 }}>[6 RESPONSIBILITY AREAS]</span>
                    <span className="team-pillars-count-tag">6 PILLARS</span>
                  </div>
                  <div className="team-chips-container">
                    {team.pillars.map((pillar) => (
                      <span key={pillar.name} className="team-focus-tag">{pillar.name}</span>
                    ))}
                  </div>
                </div>

                <div className="team-card-action">
                  <div
                    className="wf-action-slot action-fill-crimson"
                    style={{ height: '42px', width: '100%', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      exploreTeamDetail(team.index);
                    }}
                  >
                    [EXPLORE TEAM →]
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAIL CANVAS — bento board */}
        <div id="team-detail-blueprint" className="detail-canvas" aria-hidden={viewMode !== 'detail'}>
          <div className="detail-bento" style={{ ['--team-accent' as string]: activeTeam.tagColor.bg }}>
            <div className="bento-hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(20,15,15,0.05) 20%, rgba(20,15,15,0.88) 100%), url(${activeTeam.heroImage})` }}>
              <span className="detail-hero-tag" style={{ backgroundColor: activeTeam.tagColor.bg, color: activeTeam.tagColor.text }}>
                {activeTeam.roleTag}
              </span>
              <h2 className="detail-hero-title">{activeTeam.name}</h2>
              <p className="detail-hero-desc">{activeTeam.desc}</p>
            </div>

            <div className="bento-portrait bento-lead">
              <Image src={activeTeam.headPhoto} alt={activeTeam.headName} fill sizes="260px" className="object-cover" unoptimized />
              <div className="bento-portrait-text">
                <span className="bento-portrait-label">Team Lead</span>
                <span className="bento-portrait-name">{activeTeam.headName}</span>
                <span className="bento-portrait-role">{activeTeam.headRole}</span>
              </div>
            </div>

            <div className="bento-apply">
              <span className="bento-apply-eyebrow">Recruitment · Cohort 04</span>
              <strong className="bento-apply-title">Join {activeTeam.shortName}.</strong>
              <span className="bento-apply-live">Applications open</span>
              <button type="button" onClick={handleApplyOpen} className="bento-apply-btn">
                Apply to team
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>

            <div className="bento-panel bento-pillars">
              <div className="bento-panel-head">
                <h3>What we own</h3>
                <span>{activeTeam.pillars.length} responsibilities</span>
              </div>
              <ul>
                {activeTeam.pillars.map((pillar) => (
                  <li key={pillar.name}>
                    <span className="pillar-name">{pillar.name}</span>
                    <span className="pillar-desc">{pillar.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bento-panel bento-coords">
              <div className="bento-panel-head">
                <h3>Coordinators</h3>
                <span>{activeTeam.coordinatorsCount}</span>
              </div>
              <ul>
                {(activeTeam.coordinators ?? Array.from({ length: activeTeam.coordinatorsCount }, () => null)).map((coord, i) => (
                  <li key={`c-${i}`} className="bento-portrait coord-portrait">
                    {coord?.photo ? (
                      <Image src={coord.photo} alt={coord.name} fill sizes="140px" className="object-cover" unoptimized />
                    ) : (
                      <span className="coord-initials" aria-hidden="true">
                        {coord ? coord.name.split(' ').map((w) => w[0]).join('').slice(0, 2) : `C${i + 1}`}
                      </span>
                    )}
                    <div className="bento-portrait-text">
                      <span className="bento-portrait-label">{coord?.role ?? 'Coordinator'}</span>
                      <span className="bento-portrait-name">{coord?.name ?? `Coordinator ${String(i + 1).padStart(2, '0')}`}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {activeTeam.galleryImages.filter((src) => src !== activeTeam.heroImage).slice(0, 3).map((src, idx) => (
              <div key={idx} className={`bento-gallery bento-gallery-${idx + 1}`}>
                <Image src={src} alt={`${activeTeam.name} moment ${idx + 1}`} fill sizes="(min-width: 901px) 22vw, 50vw" className="object-cover" unoptimized />
                <span className="bento-gallery-cap">{idx === 0 ? 'Behind the scenes · ' : ''}{idx + 1}/3</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* APPLY MODAL */}
      {isApplyOpen && createPortal(
        <div role="dialog" aria-modal="true" aria-labelledby={modalTitleId}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsApplyOpen(false)}>
          <div className="w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-[#FFFDF8] rounded-2xl p-6 sm:p-8 shadow-2xl relative border border-[rgba(163,4,15,0.15)]"
            onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setIsApplyOpen(false)}
              className="absolute top-4 right-4 text-[#5F5650] hover:text-[#A3040F] text-2xl leading-none cursor-pointer" aria-label="Close">×</button>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#A3040F]/10 text-[#A3040F] text-[10px] font-mono font-bold uppercase tracking-widest">
              Recruitment · Cohort 04
            </div>
            <h2 id={modalTitleId} className="text-2xl font-black text-[#222222] mt-2 tracking-tight">Apply to {activeTeam.applyTarget}</h2>
            <p className="text-sm text-[#5F5650] mt-1 leading-relaxed">Submit your interest and our coordinators will review your profile within 3 working days.</p>
            {applied ? (
              <div className="my-8 text-center p-6 bg-[#FBCA05]/10 border border-[#FBCA05]/40 rounded-xl">
                <div className="text-sm font-bold text-[#A3040F]">Application received!</div>
                <p className="text-xs text-[#5F5650] mt-1">Watch your inbox — we&apos;ll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="mt-5 space-y-3.5">
                <label className="block">
                  <span className="block text-xs font-semibold text-[#222222] mb-1">Full name</span>
                  <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Priyanshu Sharma"
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[rgba(163,4,15,0.2)] rounded-lg focus:outline-2 focus:outline-[#A3040F]/40 focus:border-[#A3040F]" />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-xs font-semibold text-[#222222] mb-1">Email</span>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@galgotias.edu"
                      className="w-full px-3 py-2.5 text-sm bg-white border border-[rgba(163,4,15,0.2)] rounded-lg focus:outline-2 focus:outline-[#A3040F]/40 focus:border-[#A3040F]" />
                  </label>
                  <label className="block">
                    <span className="block text-xs font-semibold text-[#222222] mb-1">WhatsApp</span>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2.5 text-sm bg-white border border-[rgba(163,4,15,0.2)] rounded-lg focus:outline-2 focus:outline-[#A3040F]/40 focus:border-[#A3040F]" />
                  </label>
                </div>
                <label className="block">
                  <span className="block text-xs font-semibold text-[#222222] mb-1">Year &amp; Branch</span>
                  <input type="text" required value={formData.yearBranch} onChange={(e) => setFormData({ ...formData, yearBranch: e.target.value })}
                    placeholder="e.g. 2nd Year · B.Tech CSE"
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[rgba(163,4,15,0.2)] rounded-lg focus:outline-2 focus:outline-[#A3040F]/40 focus:border-[#A3040F]" />
                </label>
                <label className="block">
                  <span className="block text-xs font-semibold text-[#222222] mb-1">Why this team?</span>
                  <textarea required rows={3} value={formData.interest} onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    placeholder="Tell us about your relevant skills or motivation..."
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[rgba(163,4,15,0.2)] rounded-lg focus:outline-2 focus:outline-[#A3040F]/40 focus:border-[#A3040F] resize-none" />
                </label>
                {submitError && <p role="alert" className="text-xs text-[#A3040F]">{submitError}</p>}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsApplyOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-[#5F5650] hover:text-[#222222] cursor-pointer">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="px-6 py-2.5 text-xs font-bold bg-[#A3040F] hover:bg-[#C62F29] disabled:opacity-60 text-white rounded-lg cursor-pointer transition-colors">{submitting ? 'Sending…' : 'Submit application →'}</button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default TeamStageManager;
