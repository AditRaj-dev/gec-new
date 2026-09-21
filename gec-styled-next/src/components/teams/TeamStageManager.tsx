'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import { GEC_TEAMS, TeamStageData } from '@/lib/teamsData';
import './stage-manager.css';

export interface TeamStageManagerProps {
  initialTeamIndex?: number;
  initialMode?: 'detail' | 'roster';
  showHero?: boolean;
  teams?: TeamStageData[];
  id?: string;
  onApplyClick?: (team: TeamStageData) => void;
}

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

  const toggleView = (next: 'detail' | 'roster') => {
    const reducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasVT = typeof document !== 'undefined' &&
      'startViewTransition' in document && !reducedMotion;

    if (hasVT) {
      const bp = document.getElementById('team-detail-blueprint');
      if (bp) bp.style.viewTransitionName = 'team-detail';
      document.querySelectorAll<HTMLElement>(`#${id} .team-item-card`).forEach((card) => {
        card.style.viewTransitionName = `team-card-${card.dataset.teamIndex}`;
      });

      const doc = document as Document & {
        startViewTransition: (cb: () => void) => { finished: Promise<void> };
      };
      const transition = doc.startViewTransition(() => {
        flushSync(() => setViewMode(next));
      });
      transition.finished.finally(() => {
        if (bp) bp.style.removeProperty('view-transition-name');
        document.querySelectorAll<HTMLElement>(`#${id} .team-item-card`).forEach((card) => {
          card.style.removeProperty('view-transition-name');
        });
      });
    } else {
      setViewMode(next);
    }
    if (next === 'roster') showToast('Roster overview', 'Showing all 7 teams');
  };

  const handleApplyOpen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onApplyClick) onApplyClick(activeTeam);
    setApplied(false); setIsApplyOpen(true);
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setApplied(true);
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
        className={`team-stage-manager-section ${viewMode === 'detail' ? 'is-detail-active' : ''}`}>
        <div className="stage-status-bar">
          <div className="stage-status-label">
            {viewMode === 'detail'
              ? <><span className="stage-status-dim">Now viewing ·</span> <span className="stage-status-name">{activeTeam.name}</span></>
              : <span className="stage-status-dim">Full roster · 7 teams</span>}
          </div>
          <button type="button" onClick={() => toggleView(viewMode === 'detail' ? 'roster' : 'detail')}
            className="stage-mode-toggle">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              {viewMode === 'detail' ? (
                <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>
              ) : (
                <><rect x="3" y="3" width="6" height="18" rx="1" /><rect x="12" y="3" width="9" height="18" rx="1" /></>
              )}
            </svg>
            <span>{viewMode === 'detail' ? 'View all teams' : 'Focus mode'}</span>
          </button>
        </div>

        {/* Rail / stack of team cards */}
        <div className="teams-horizontal-stack" role="group" aria-label="Teams roster">
          {teams.map((team) => {
            const isActive = team.index === activeTeamIndex;
            const roleTagBg = team.tagColor.bg;
            const roleTagText = team.tagColor.text;

            return (
              <div key={team.id} data-team-index={team.index}
                role="button" tabIndex={0}
                aria-label={`Open ${team.name}`} aria-pressed={isActive}
                onClick={() => exploreTeamDetail(team.index)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); exploreTeamDetail(team.index); } }}
                style={{
                  ['--preview-scale' as string]: team.previewScale,
                  ['--preview-opacity' as string]: team.previewOpacity,
                }}
                className={`team-item-card ${isActive && viewMode === 'detail' ? 'is-active-team' : ''}`}
              >
                <div className="team-card-identity">
                  <div className="team-card-meta-top">
                    <span className="team-card-num">{String(team.index).padStart(2, '0')}</span>
                    <span className="team-role-tag" style={{ backgroundColor: roleTagBg, color: roleTagText }}>
                      {team.roleTag}
                    </span>
                    <span className="team-card-hover-cue">SELECT ↗</span>
                  </div>
                  <h3 className="team-card-title">{team.name}</h3>
                  <p className="team-card-desc">{team.desc}</p>
                  <div className="team-card-meta-bottom">
                    <span className="team-meta-badge">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                      Lead: {team.headName}
                    </span>
                    <span className="team-meta-sep">·</span>
                    <span className="team-meta-subtle">{team.coordinatorsCount} Coords · {team.membersCount} Members</span>
                  </div>
                </div>

                <div className="team-card-responsibilities">
                  <div className="team-pillars-header">
                    <span className="team-pillars-label">6 responsibility areas</span>
                    <span className="team-pillars-count-tag">6 PILLARS</span>
                  </div>
                  <div className="team-chips-container">
                    {team.pillars.map((pillar) => (
                      <span key={pillar.name} className="team-focus-tag">{pillar.name}</span>
                    ))}
                  </div>
                </div>

                <div className="team-card-action">
                  <button type="button" className="team-action-button"
                    onClick={(e) => { e.stopPropagation(); exploreTeamDetail(team.index); }}>
                    Explore team
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAIL CANVAS */}
        <div id="team-detail-blueprint" className="detail-canvas" aria-hidden={viewMode !== 'detail'}>
          <div className="detail-hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(20,15,15,0) 30%, rgba(20,15,15,0.86) 100%), url(${activeTeam.heroImage})` }}>
            <div className="detail-hero-inner">
              <span className="detail-hero-tag" style={{ backgroundColor: activeTeam.tagColor.bg, color: activeTeam.tagColor.text }}>
                {activeTeam.roleTag}
              </span>
              <h2 className="detail-hero-title">{activeTeam.name}</h2>
              <p className="detail-hero-desc">{activeTeam.desc}</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-lg font-black text-[#222222] tracking-tight">What we own</h3>
              <span className="text-[11px] font-mono text-[#8A817A]">6 responsibilities</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTeam.pillars.map((pillar, idx) => (
                <div key={pillar.name} className="pillar-card">
                  <div className="pillar-num" style={{ color: activeTeam.tagColor.bg === '#FBCA05' ? '#B87F00' : activeTeam.tagColor.bg }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="pillar-name">{pillar.name}</div>
                  <div className="pillar-desc">{pillar.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="lead-card">
              <div className="lead-photo">
                <Image src={activeTeam.headPhoto} alt={activeTeam.headName} width={200} height={200} className="w-full h-full object-cover" unoptimized />
              </div>
              <div className="lead-label">Team Lead</div>
              <div className="lead-name">{activeTeam.headName}</div>
              <div className="lead-role">{activeTeam.headRole}</div>
            </div>

            <div className="md:col-span-2 team-composition">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-lg font-black text-[#222222] tracking-tight">Team composition</h3>
                <span className="text-[11px] font-mono text-[#8A817A]">{activeTeam.coordinatorsCount} coordinators · {activeTeam.membersCount} members</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: activeTeam.coordinatorsCount }).map((_, i) => (
                  <div key={`c-${i}`} className="avatar-chip avatar-coord" title={`Coordinator ${i + 1}`}>C{i + 1}</div>
                ))}
                {Array.from({ length: activeTeam.membersCount }).map((_, i) => (
                  <div key={`m-${i}`} className="avatar-chip avatar-member" title={`Member ${i + 1}`}>M{i + 1}</div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-[rgba(163,4,15,0.12)] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[#5F5650]">Recruitment status</div>
                  <div className="text-sm font-semibold text-[#222222] mt-0.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 align-middle animate-pulse" />
                    Applications open · Cohort 04
                  </div>
                </div>
                <button type="button" onClick={handleApplyOpen}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-[#A3040F] hover:bg-[#C62F29] text-white shadow-sm transition-colors cursor-pointer active:scale-95">
                  Apply to team
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-lg font-black text-[#222222] tracking-tight">Behind the scenes</h3>
              <span className="text-[11px] font-mono text-[#8A817A]">Snapshots from the field</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {activeTeam.galleryImages.map((src, idx) => (
                <div key={idx} className="gallery-tile">
                  <Image src={src} alt={`${activeTeam.name} moment ${idx + 1}`} width={400} height={400} className="w-full h-full object-cover" unoptimized />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* APPLY MODAL */}
      {isApplyOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby={modalTitleId}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsApplyOpen(false)}>
          <div className="w-full max-w-lg bg-[#FFFDF8] rounded-2xl p-6 sm:p-8 shadow-2xl relative border border-[rgba(163,4,15,0.15)]"
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
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsApplyOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-[#5F5650] hover:text-[#222222] cursor-pointer">Cancel</button>
                  <button type="submit"
                    className="px-6 py-2.5 text-xs font-bold bg-[#A3040F] hover:bg-[#C62F29] text-white rounded-lg cursor-pointer transition-colors">Submit application →</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamStageManager;
