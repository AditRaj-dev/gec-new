"use client";

import { useRef, useState } from "react";
import type { PublicTeam } from "@/lib/content-types";
import { TeamRecruitmentForm } from "./team-recruitment-form";

export function TeamStageManager({ teams }: { teams: PublicTeam[] }) {
  const [activeId, setActiveId] = useState(teams[0]?.id ?? "");
  const detail = useRef<HTMLElement>(null);
  const active = teams.find((team) => team.id === activeId) ?? teams[0];

  function select(id: string) {
    const update = () => setActiveId(id);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startViewTransition = (document as Document & { startViewTransition?: (callback: () => void) => unknown }).startViewTransition;
    if (!reduced && startViewTransition) startViewTransition.call(document, update); else update();
    window.setTimeout(() => detail.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" }), 0);
  }

  if (!active) return <div className="mx-auto max-w-6xl px-5 py-24"><h1 className="text-4xl font-black text-[var(--gec-ink)]">Teams</h1><p className="mt-4 text-[var(--gec-ink-muted)]">Team profiles will appear here as they are published.</p></div>;

  return <div className="min-w-0 max-w-full overflow-x-hidden">
    <section className="mx-auto min-w-0 max-w-4xl px-5 py-20 text-center sm:px-8 lg:py-28"><p className="text-sm font-bold uppercase tracking-[.14em] text-[var(--gec-crimson)]">The engine of GEC</p><h1 className="mt-5 break-words text-balance text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[1.05] tracking-[-.04em] text-[var(--gec-ink)]">Seven teams. One vision.</h1><p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-[var(--gec-ink-muted)]">Different skills and responsibilities, working together to make the entrepreneurial ecosystem move.</p></section>
    <section className="min-w-0 max-w-full overflow-hidden border-y border-[var(--gec-border)] bg-[var(--gec-surface-sand)] px-5 py-12 sm:px-8 lg:py-20"><div className="team-stage-shell mx-auto min-w-0 max-w-7xl"><div className="max-w-full flex gap-2 overflow-x-auto pb-4" role="group" aria-label="Select a team">{teams.map((team, index) => <button key={team.id} type="button" aria-pressed={active.id === team.id} onClick={() => select(team.id)} className={`team-stage-button min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold ${active.id === team.id ? "border-[var(--gec-crimson)] bg-[var(--gec-crimson)] text-white" : "border-[var(--gec-border)] bg-[var(--gec-surface-card)] text-[var(--gec-ink)]"}`}>{String(index + 1).padStart(2, "0")} · {team.name}</button>)}</div>
      <div className="team-stage-preview mt-8 grid min-w-0 gap-8 lg:grid-cols-[minmax(14rem,.7fr)_minmax(0,1.6fr)]"><nav className="team-stage-rail hidden min-w-0 lg:grid lg:content-start lg:gap-2" aria-label="Team roster">{teams.map((team, index) => <button key={team.id} type="button" aria-current={active.id === team.id ? "true" : undefined} onClick={() => select(team.id)} className={`team-stage-button min-h-14 rounded-lg border px-4 text-left font-bold ${active.id === team.id ? "border-[var(--gec-crimson)] bg-white text-[var(--gec-crimson)]" : "border-transparent text-[var(--gec-ink-muted)]"}`}>{String(index + 1).padStart(2, "0")} <span className="ml-2">{team.name}</span></button>)}</nav>
        <section ref={detail} id="team-detail" aria-live="polite" className="team-stage-detail min-w-0 max-w-full overflow-hidden rounded-2xl border border-[var(--gec-border)] bg-[var(--gec-surface-card)] p-6 shadow-[var(--shadow-ambient)] sm:p-9" style={{ viewTransitionName: "team-stage-detail" }}><p className="text-sm font-bold uppercase tracking-[.14em] text-[var(--gec-crimson)]">{active.name}</p><h2 className="mt-4 break-words text-balance text-3xl font-extrabold tracking-[-.03em] text-[var(--gec-ink)]">{active.headline}</h2><p className="mt-5 max-w-2xl text-pretty leading-7 text-[var(--gec-ink-muted)]">{active.description}</p><h3 className="mt-9 text-xl font-extrabold text-[var(--gec-ink)]">What we own</h3><div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">{active.responsibilities.map((responsibility) => <div className="min-w-0 break-words rounded-lg border border-[var(--gec-border)] p-4 text-sm font-semibold text-[var(--gec-ink)]" key={responsibility}>{responsibility}</div>)}</div>{active.head ? <div className="mt-8 rounded-lg bg-[var(--gec-surface-sand)] p-4"><p className="font-bold text-[var(--gec-ink)]">{active.head.name}</p><p className="mt-1 text-sm text-[var(--gec-ink-muted)]">{active.head.role}</p></div> : null}{active.recruitmentSettings?.acceptsApplications ? <TeamRecruitmentForm team={active} /> : null}</section>
      </div>
    </div></section>
  </div>;
}
