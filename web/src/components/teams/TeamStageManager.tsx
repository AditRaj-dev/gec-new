'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { flushSync } from 'react-dom';
import { GEC_TEAMS, TeamStageData } from '@/lib/teamsData';
import './stage-manager.css';

export interface TeamStageManagerProps {
  /** Initial selected team index (1-7). Defaults to 1 */
  initialTeamIndex?: number;
  /** Initial view mode: 'detail' (Stage Manager Rail + Canvas) or 'roster' (Full Roster Stack) */
  initialMode?: 'detail' | 'roster';
  /** Show the 3.1 Hero section with headline and 7 quick-jump category filter pills */
  showHero?: boolean;
  /** Optional custom teams dataset (defaults to official 7 GEC teams) */
  teams?: TeamStageData[];
  /** Optional ID anchor for section navigation (defaults to "teams-stage-manager") */
  id?: string;
  /** Optional callback when application button is clicked */
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
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    yearBranch: '',
    interest: '',
  });

  const sectionRef = useRef<HTMLElement>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeTeam = teams.find((t) => t.index === activeTeamIndex) || teams[0];

  const showToast = (title: string, desc: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage({ title, desc });
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  /**
   * Prepares the shared view-transition-name pairings for Stage Manager.
   * - blueprint: outgoing team's shared name (e.g. team-shared-1)
   * - nextCard: incoming team's shared name (e.g. team-shared-2)
   * - other rail cards: team-card-N
   */
  const prepareTeamSharedTransition = (nextTeamIndex: number) => {
    const blueprint = document.getElementById('team-detail-blueprint');
    const currentCard = document.querySelector(`#${id} .team-item-card.is-active-team`) as HTMLElement | null;
    const currentTeamIndex = currentCard
      ? Number(currentCard.dataset.teamIndex)
      : activeTeamIndex;
    const nextCard = document.querySelector(`#${id} .team-item-card[data-team-index="${nextTeamIndex}"]`) as HTMLElement | null;

    // Assign stable transition names to all rail cards
    document.querySelectorAll(`#${id} .team-item-card`).forEach((card) => {
      (card as HTMLElement).style.viewTransitionName = `team-card-${(card as HTMLElement).dataset.teamIndex}`;
    });

    if (blueprint) {
      blueprint.style.viewTransitionName = `team-shared-${currentTeamIndex}`;
    }
    if (nextCard) {
      nextCard.style.viewTransitionName = `team-shared-${nextTeamIndex}`;
    }

    return () => {
      const bp = document.getElementById('team-detail-blueprint');
      if (bp) bp.style.removeProperty('view-transition-name');
      document.querySelectorAll(`#${id} .team-item-card`).forEach((card) => {
        (card as HTMLElement).style.removeProperty('view-transition-name');
      });
    };
  };

  /**
   * Explores a team detail with seamless Stage Manager expansion animation.
   * - When View Transitions API is supported: the clicked rail card physically morphs & expands into the canvas,
   *   while the previous active card morphs & shrinks back into the rail.
   * - Fallback: Uses FLIP + WAAPI to animate expanding from the exact rail card rect & 3D angle to the blueprint.
   */
  const exploreTeamDetail = (teamIndex: number) => {
    const targetTeam = teams.find((t) => t.index === teamIndex);
    if (!targetTeam) return;

    const stage = document.getElementById(id);
    const currentCard = document.querySelector(`#${id} .team-item-card.is-active-team`) as HTMLElement | null;
    const currentTeamIndex = currentCard ? Number(currentCard.dataset.teamIndex) : activeTeamIndex;

    if (currentCard && currentTeamIndex === teamIndex && viewMode === 'detail') {
      if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const nextCard = document.querySelector(`#${id} .team-item-card[data-team-index="${teamIndex}"]`) as HTMLElement | null;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hasViewTransitions =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !reducedMotion;

    if (hasViewTransitions) {
      const clearSharedNames = prepareTeamSharedTransition(teamIndex);

      const doc = document as Document & {
        startViewTransition: (callback: () => void) => { finished: Promise<void> };
      };

      const transition = doc.startViewTransition(() => {
        flushSync(() => {
          setActiveTeamIndex(teamIndex);
          setViewMode('detail');
        });

        // Live DOM blueprint takes incoming shared name to expand from nextCard
        const liveBlueprint = document.getElementById('team-detail-blueprint');
        if (liveBlueprint) {
          liveBlueprint.setAttribute('aria-hidden', 'false');
          liveBlueprint.style.viewTransitionName = `team-shared-${teamIndex}`;
        }

        // Returning rail card takes outgoing shared name to shrink back from old blueprint
        const prevCard = document.querySelector(`#${id} .team-item-card[data-team-index="${currentTeamIndex}"]`) as HTMLElement | null;
        if (prevCard) {
          prevCard.style.viewTransitionName = `team-shared-${currentTeamIndex}`;
        }
      });

      transition.finished
        .then(() => {
          clearSharedNames();
          showToast('Team Route Active', `Displaying ${targetTeam.name} blueprint details.`);
        })
        .catch(() => {
          clearSharedNames();
        });
      return;
    }

    // Fallback: FLIP Expansion for browsers without View Transitions (e.g. Firefox)
    if (nextCard && !reducedMotion) {
      const fromRect = nextCard.getBoundingClientRect();

      flushSync(() => {
        setActiveTeamIndex(teamIndex);
        setViewMode('detail');
      });

      const liveBlueprint = document.getElementById('team-detail-blueprint');
      if (liveBlueprint) {
        const toRect = liveBlueprint.getBoundingClientRect();
        const deltaX = fromRect.left - toRect.left;
        const deltaY = fromRect.top - toRect.top;
        const scaleX = Math.max(0.1, fromRect.width / toRect.width);
        const scaleY = Math.max(0.1, fromRect.height / toRect.height);

        liveBlueprint.animate(
          [
            {
              transformOrigin: 'top left',
              transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY}) rotateY(32deg)`,
              opacity: 0.86,
            },
            {
              transformOrigin: 'top left',
              transform: 'translate3d(0, 0, 0) scale(1, 1) rotateY(0deg)',
              opacity: 1,
            },
          ],
          {
            duration: 550,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'both',
          }
        );
      }
      showToast('Team Route Active', `Displaying ${targetTeam.name} blueprint details.`);
      return;
    }

    // Direct update (reduced motion or fallback)
    flushSync(() => {
      setActiveTeamIndex(teamIndex);
      setViewMode('detail');
    });
    showToast('Team Route Active', `Displaying ${targetTeam.name} blueprint details.`);
  };

  /**
   * Toggles between Stage Manager view (3D rail + canvas) and Full Roster Stack (7 overview rows).
   */
  const toggleViewMode = (nextMode: 'detail' | 'roster') => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !reducedMotion
    ) {
      const doc = document as Document & {
        startViewTransition: (callback: () => void) => { finished: Promise<void> };
      };
      const bp = document.getElementById('team-detail-blueprint');
      if (bp) bp.style.viewTransitionName = 'team-detail';

      const transition = doc.startViewTransition(() => {
        flushSync(() => {
          setViewMode(nextMode);
        });
      });

      transition.finished.finally(() => {
        if (bp) bp.style.removeProperty('view-transition-name');
        if (nextMode === 'roster') {
          showToast('Roster Overview', 'Displaying full 7-row team stack.');
        }
      });
      return;
    }

    flushSync(() => {
      setViewMode(nextMode);
    });
    if (nextMode === 'roster') {
      showToast('Roster Overview', 'Displaying full 7-row team stack.');
    }
  };

  const handleApplyOpen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onApplyClick) {
      onApplyClick(activeTeam);
    }
    setApplicationSubmitted(false);
    setIsApplyModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSubmitted(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      setApplicationSubmitted(false);
      showToast('Application Received', `Your interest for ${activeTeam.applyTarget} has been recorded.`);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        yearBranch: '',
        interest: '',
      });
    }, 1200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isApplyModalOpen) {
        setIsApplyModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isApplyModalOpen]);

  const modalTitleId = useId();

  return (
    <div className="team-stage-wrapper w-full">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-[#FFFDF8] border border-[rgba(163,4,15,0.3)] shadow-xl rounded-xl p-4 max-w-md animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#A3040F] mt-1 shrink-0 animate-pulse" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3040F]">
              {toastMessage.title}
            </div>
            <div className="text-sm font-medium text-[#222222] mt-0.5 truncate">
              {toastMessage.desc}
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#5F5650] hover:text-[#222222] text-xs font-mono px-1 py-0.5 rounded cursor-pointer"
            aria-label="Dismiss toast"
          >
            [X]
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3.1 TEAMS HERO & QUICK JUMP FILTER STRIP (WIREFRAME V2 SPECIFICATION)     */}
      {/* ========================================================================= */}
      {showHero && (
        <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-6xl mx-auto text-center">
          <div className="section-id-stamp mx-auto">3.1 TEAMS HERO · 7 TEAMS ROSTER</div>
          <div className="section-coord-stamp mx-auto">CANVAS: WARM CREAM | 7-TEAM QUICK JUMP BAR</div>

          <div className="mt-8 max-w-3xl mx-auto">
            <span className="element-role-tag role-crimson">
              [THE ENGINE OF GEC]
            </span>

            <div className="p-4 sm:p-6 border-1.5 border-dashed border-[#A3040F] rounded-lg my-4 bg-[#A3040F]/[0.03]">
              <span className="element-role-tag">[H1 TITLE: &quot;7 TEAMS. ONE VISION.&quot;]</span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#222222] mt-2 leading-[1.06]">
                7 Teams. One Shared Vision.
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#5F5650] leading-relaxed max-w-2xl mx-auto">
              Different specialized capabilities, working in tight synchronization to build Northern
              India&apos;s most active student startup ecosystem.
            </p>

            {/* 7 Quick Jump Filter Pills */}
            <div className="category-filter-strip justify-center mt-6" role="group" aria-label="Quick jump to team">
              {teams.map((team) => {
                const isActive = team.index === activeTeamIndex && viewMode === 'detail';
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => exploreTeamDetail(team.index)}
                    className={`filter-chip-button ${isActive ? 'active-filter' : ''}`}
                    aria-pressed={isActive}
                  >
                    <span>{String(team.index).padStart(2, '0')}.</span>
                    <span className="ml-1">{team.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3.2 PERSISTENT STAGE MANAGER TEAM SYSTEM (3D SPATIAL RAIL + DETAIL CANVAS) */}
      {/* ========================================================================= */}
      <section
        ref={sectionRef}
        id={id}
        data-motion-state={viewMode}
        className={`wf-section surface-sand team-stage-manager-section ${
          viewMode === 'detail' ? 'is-detail-active' : ''
        }`}
      >
        <div className="section-id-stamp">3.2 THE 7 TEAMS · STAGE MANAGER TRANSITION</div>
        <div className="section-coord-stamp">PART 01: ROSTER · PART 02: ACTIVE TEAM CANVAS</div>

        {/* Storyboard Timing Ribbon */}
        <aside className="team-stage-storyboard" aria-label="Animation storyboard timing">
          <div className="team-stage-storyboard-steps">
            <span className="team-stage-step">01 · SELECT · 0–120MS</span>
            <span className="team-stage-step">02 · SPATIAL SWAP · 100–450MS</span>
            <span className="team-stage-step">03 · CONTENT REVEAL · 300–600MS</span>
            <span className="team-stage-step">SPRING · 250 / 28 / 0.9</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span id="team-stage-status" className="team-stage-status" aria-live="polite">
              STATE · {String(activeTeam.index).padStart(2, '0')} ACTIVE ·{' '}
              {viewMode === 'detail' ? 'DETAIL CANVAS' : 'ROSTER STACK'}
            </span>

            {/* Toggle between 3D Stage Manager and Full 7-Row Overview Roster */}
            <button
              type="button"
              onClick={() => toggleViewMode(viewMode === 'detail' ? 'roster' : 'detail')}
              className="team-mode-toggle"
              title="Switch between Stage Manager rail and full roster overview"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                {viewMode === 'detail' ? (
                  <>
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </>
                ) : (
                  <>
                    <rect x="3" y="3" width="6" height="18" />
                    <rect x="12" y="3" width="9" height="18" />
                  </>
                )}
              </svg>
              <span>{viewMode === 'detail' ? 'View All Roster' : 'Stage Manager View'}</span>
            </button>
          </div>
        </aside>

        {/* 3D Rail (or Horizontal Stack in Overview Mode) */}
        <div className="teams-horizontal-stack" role="group" aria-label="Teams roster rail">
          {teams.map((team) => {
            const isActive = team.index === activeTeamIndex;
            return (
              <div
                key={team.id}
                data-team-index={team.index}
                role="button"
                tabIndex={0}
                aria-label={`Open ${team.name} detail`}
                aria-pressed={isActive}
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest('.wf-action-slot')) return;
                  exploreTeamDetail(team.index);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    exploreTeamDetail(team.index);
                  }
                }}
                className={`team-item-card ${isActive && viewMode === 'detail' ? 'is-active-team' : ''}`}
              >
                {/* 1. Large Index Stamp (Child 1) */}
                <div className="team-index-display">{String(team.index).padStart(2, '0')}</div>

                {/* 2. Team Role Tag & Titles (Child 2) */}
                <div>
                  <span
                    className="element-role-tag"
                    style={{
                      backgroundColor: team.tagColor.bg,
                      color: team.tagColor.text,
                    }}
                  >
                    {team.roleTag}
                  </span>
                  <div className="skel-title-h2" style={{ height: '20px', width: '90%' }}></div>
                  <div className="skel-line" style={{ width: '95%' }}></div>
                </div>

                {/* 3. Focus Chips (Child 3 - Hidden on compact 3D rail by wireframe CSS) */}
                <div>
                  <span className="dim-label" style={{ fontWeight: 700 }}>
                    [{team.pillars.length} RESPONSIBILITY AREAS]
                  </span>
                  <div className="team-chips-container">
                    {team.pillars.map((pillar) => (
                      <span key={pillar.name} className="team-focus-tag">
                        {pillar.name.replace(/^\d+\.\s*/, '')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Action Button Slot (Child 4 - Hidden on compact 3D rail by wireframe CSS) */}
                <div style={{ textAlign: 'right' }}>
                  <div
                    className="wf-action-slot action-fill-crimson"
                    style={{ height: '40px', width: '100%', cursor: 'pointer' }}
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

        {/* ===================================================================== */}
        {/* 3.3 ACTIVE TEAM DETAIL CANVAS BLUEPRINT                               */}
        {/* ===================================================================== */}
        <div
          id="team-detail-blueprint"
          className="modular-subblueprint-wrapper"
          aria-hidden={viewMode !== 'detail'}
        >
          {/* Toolbar */}
          <div className="team-detail-toolbar">
            <div className="team-detail-toolbar-copy">
              <span className="element-role-tag role-blue" id="bp-team-tag">
                [TEAM DETAIL SUB-PAGE BLUEPRINT · SITEMAP §5 &amp; §6]
              </span>
              <span className="dim-label" id="bp-team-route">
                {activeTeam.route}
              </span>
            </div>

            {/* Back to Roster Action */}
            <button
              type="button"
              onClick={() => toggleViewMode('roster')}
              className="team-stage-back"
              title="Return to full roster overview"
              aria-label="Back to roster overview"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          </div>

          {/* Team Hero Card */}
          <div className="wf-card-container" style={{ background: '#FFF', marginBottom: '24px' }}>
            <span className="element-role-tag role-crimson" id="bp-team-badge">
              {activeTeam.badge}
            </span>
            <div
              id="bp-team-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 900,
                color: 'var(--gec-crimson)',
                margin: '8px 0',
              }}
            >
              {activeTeam.name}
            </div>
            <div
              id="bp-team-desc"
              className="dim-label"
              style={{ fontSize: '13px', lineHeight: 1.6, maxWidth: '80ch' }}
            >
              {activeTeam.desc}
            </div>
          </div>

          {/* 6 Responsibilities Matrix */}
          <div>
            <span className="element-role-tag">
              [WHAT WE OWN: 6 RESPONSIBILITIES MATRIX (3×2)]
            </span>
            <div id="bp-team-pillars" className="initiatives-offset-grid" style={{ marginTop: '14px' }}>
              {activeTeam.pillars.map((pillar) => (
                <div key={pillar.name} className="wf-card-container">
                  <div className="element-role-tag role-crimson">{pillar.name}</div>
                  <div className="dim-label" style={{ marginTop: '6px' }}>
                    {pillar.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Head & Hierarchy Matrix (1fr : 2fr Grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginTop: '24px' }}>
            {/* Current Head Profile */}
            <div className="wf-card-container" style={{ textAlign: 'center' }}>
              <span className="element-role-tag role-crimson" id="bp-head-tag">
                {activeTeam.headTag}
              </span>
              <div className="wf-avatar-slot" style={{ margin: '14px auto', width: '80px', height: '80px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div
                id="bp-head-name"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: 'var(--gec-ink)',
                }}
              >
                {activeTeam.headName}
              </div>
              <div
                id="bp-head-role"
                className="dim-label"
                style={{ color: 'var(--gec-crimson)', fontWeight: 700, marginTop: '4px' }}
              >
                {activeTeam.headRole}
              </div>
            </div>

            {/* Team Hierarchy Matrix */}
            <div className="wf-card-container">
              <span className="element-role-tag">
                [TEAM HIERARCHY: COORDINATORS ({activeTeam.coordinatorsCount}) &amp; MEMBERS (
                {activeTeam.membersCount})]
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
                {Array.from({ length: activeTeam.coordinatorsCount }).map((_, i) => (
                  <div
                    key={`coord-${i}`}
                    className="wf-avatar-slot"
                    style={{ width: '46px', height: '46px' }}
                    title={`Coordinator ${i + 1}`}
                  >
                    <span style={{ fontSize: '8px' }}>COORD</span>
                  </div>
                ))}
                {Array.from({ length: activeTeam.membersCount }).map((_, i) => (
                  <div
                    key={`mem-${i}`}
                    className="wf-avatar-slot"
                    style={{ width: '46px', height: '46px' }}
                    title={`Team Member ${i + 1}`}
                  >
                    <span style={{ fontSize: '8px' }}>MEM</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery & Application Split (2fr : 1fr Grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
            {/* Behind the Scenes Gallery */}
            <div className="wf-card-container">
              <span className="element-role-tag">[BEHIND THE SCENES GALLERY (4 TILES)]</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '12px' }}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="wf-media-container ratio-1-1">
                    <svg className="architectural-cross" viewBox="0 0 100 100">
                      <line x1="0" y1="0" x2="100" y2="100" />
                      <line x1="100" y1="0" x2="0" y2="100" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Team Application CTA */}
            <div
              className="wf-card-container"
              style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <span className="element-role-tag role-crimson">[JOIN TEAM APPLICATION CTA]</span>
              <div className="skel-line" style={{ width: '80%', margin: '10px auto' }}></div>
              <div
                id="bp-team-apply-cta"
                className="wf-action-slot action-fill-crimson"
                style={{ height: '42px', width: '100%', cursor: 'pointer' }}
                onClick={handleApplyOpen}
              >
                [APPLY TO TEAM]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTEGRATED APPLICATION MODAL FOR WIREFRAME V2 FLOW                        */}
      {/* ========================================================================= */}
      {isApplyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsApplyModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#FFFDF8] border-2 border-[#A3040F] rounded-2xl p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 text-[#5F5650] hover:text-[#A3040F] p-1 font-mono text-sm"
              aria-label="Close dialog"
            >
              [ESC]
            </button>

            <span className="element-role-tag role-crimson">
              [TEAM RECRUITMENT APPLICATION]
            </span>
            <h2 id={modalTitleId} className="text-2xl font-black text-[#222222] mt-2">
              Apply to {activeTeam.applyTarget}
            </h2>
            <p className="text-xs text-[#5F5650] mt-1 leading-relaxed">
              Submit your interest to join the {activeTeam.name}. Our coordinators will review your
              profile and schedule an interview.
            </p>

            {applicationSubmitted ? (
              <div className="my-8 text-center p-6 bg-[#FBCA05]/10 border border-[#FBCA05] rounded-xl">
                <div className="text-sm font-bold text-[#A3040F]">
                  Application Received Successfully!
                </div>
                <p className="text-xs text-[#5F5650] mt-1">
                  Thank you for applying. We will be in touch via email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#222222]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Priyanshu Sharma"
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[rgba(163,4,15,0.25)] rounded-lg focus:outline-2 focus:outline-[#A3040F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#222222]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@galgotias.edu"
                      className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[rgba(163,4,15,0.25)] rounded-lg focus:outline-2 focus:outline-[#A3040F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#222222]">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[rgba(163,4,15,0.25)] rounded-lg focus:outline-2 focus:outline-[#A3040F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#222222]">
                    Year &amp; Branch / Specialization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.yearBranch}
                    onChange={(e) => setFormData({ ...formData, yearBranch: e.target.value })}
                    placeholder="e.g. 2nd Year, B.Tech CSE (AI/ML)"
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[rgba(163,4,15,0.25)] rounded-lg focus:outline-2 focus:outline-[#A3040F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#222222]">
                    Why are you interested in this team? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    placeholder="Briefly describe your relevant skills or motivation..."
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-[rgba(163,4,15,0.25)] rounded-lg focus:outline-2 focus:outline-[#A3040F]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-[#5F5650] hover:text-[#222222] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="wf-action-slot action-fill-crimson px-6 py-2.5 text-xs font-bold cursor-pointer"
                  >
                    Submit Application →
                  </button>
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
