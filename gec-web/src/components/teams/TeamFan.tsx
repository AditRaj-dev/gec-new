'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Blinds, type BlindsItem } from 'feral-blinds';
import 'feral-blinds/blinds.css';
import { GEC_TEAMS } from '@/lib/teamsData';
import './team-fan.css';

const ITEMS: BlindsItem[] = GEC_TEAMS.map((t) => ({ title: t.shortName, subtitle: t.roleTag, image: t.heroImage }));

/**
 * Phone recomposition of the Stage Manager: the seven teams as a fan of cards (feral-blinds).
 * Tap a card to open it; tap the open card again for the team sheet. Rendered by StageRunway below 769px.
 * `initialTeamIndex` is the 1-based team index used by /teams?team=N.
 */
export function TeamFan({ initialTeamIndex }: { initialTeamIndex?: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const start = GEC_TEAMS.findIndex((t) => t.index === initialTeamIndex);
  const team = active === null ? null : GEC_TEAMS[active];

  // Entrance: fade the fan up once it scrolls into view (team-fan.css).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.dataset.entered = '';
      io.disconnect();
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (active !== null && !sheetRef.current?.open) sheetRef.current?.showModal();
  }, [active]);

  return (
    <div ref={rootRef} className="team-fan">
      <div className="team-fan__stage">
        <Blinds
          items={ITEMS}
          mode="fan"
          labelStyle="steady"
          labelPosition="bottom"
          radius={16}
          gap={0}
          textSize={1.05}
          expandRatio={1.35}
          tuning={{ k: 150, c: 18, lean: 0.3, squeeze: 1 }}
          autoPlay={3000}
          showIndex={false}
          showBody={false}
          cardScale={1.45}
          defaultOpen={start >= 0 ? start : null}
          onActivate={setActive}
        />
      </div>
      <p className="team-fan__hint">Tap a card to bring it forward · tap it again to meet the team</p>

      <dialog
        ref={sheetRef}
        className="team-sheet"
        aria-label={team?.name ?? 'Team'}
        onClose={() => setActive(null)}
        onClick={(e) => e.target === sheetRef.current && sheetRef.current.close()}
      >
        {team && (
          <div className="team-sheet__body" style={{ '--team-accent': team.tagColor.bg } as React.CSSProperties}>
            <div className="team-sheet__grab" aria-hidden="true" />
            <span className="team-sheet__tag" style={{ background: team.tagColor.bg, color: team.tagColor.text }}>
              {team.roleTag}
            </span>
            <h3 className="h3-card">{team.name}</h3>
            <p className="body-editorial">{team.desc}</p>

            <span className="editorial-kicker">What you&apos;ll do</span>
            <ul className="team-sheet__pillars">
              {team.pillars.map((p) => (
                <li key={p.name}>
                  <strong>{p.name}</strong>
                  <span>{p.desc}</span>
                </li>
              ))}
            </ul>

            <span className="editorial-kicker">Who runs it</span>
            <div className="team-sheet__lead">
              <div className="team-sheet__photo team-sheet__photo--lead">
                <Image src={team.headPhoto} alt={team.headName} fill sizes="72px" unoptimized />
              </div>
              <div>
                <strong>{team.headName}</strong>
                <span>{team.headRole}</span>
              </div>
            </div>
            {team.coordinators?.length ? (
              <>
                <ul className="team-sheet__coords">
                  {team.coordinators.map((c) => (
                    <li key={c.name}>
                      <div className="team-sheet__photo">
                        {c.photo ? (
                          <Image src={c.photo} alt={c.name} fill sizes="110px" unoptimized />
                        ) : (
                          <span aria-hidden="true">{c.name.split(' ').map((w) => w[0]).join('')}</span>
                        )}
                      </div>
                      <strong>{c.name}</strong>
                      <span>{c.role ?? 'Coordinator'}</span>
                    </li>
                  ))}
                </ul>
                <p className="team-sheet__roster">
                  {team.coordinatorsCount} coordinators · {team.membersCount} members
                </p>
              </>
            ) : null}

            <div className="team-sheet__actions">
              <a className="gec-btn btn-crimson" href="/initiatives#apply">
                Apply to {team.shortName} →
              </a>
              <button type="button" className="gec-btn btn-outline-ink" onClick={() => sheetRef.current?.close()}>
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
