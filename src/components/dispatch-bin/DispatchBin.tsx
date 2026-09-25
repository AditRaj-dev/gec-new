'use client';

import { useEffect, useRef } from 'react';
import { submitForm } from '@/lib/api';
import { GEC_DISPATCH_ARCHIVE, type GecDispatchItem } from '@/lib/dispatchData';
import { mountDispatchBin, registerDock } from './controller';
import './dispatch-bin.css';

// Plate scene per category (handoff §4b).
const SCENE: Record<GecDispatchItem['category'], string> = {
  'Conclave & E-Summit': 'stage',
  'Founders & Cap Tables': 'network',
  'Incubation & Grants': 'skyline',
  'Hardware & DeepTech': 'bulb',
};

// Archive item → broadsheet slots (handoff §3).
const ISSUES = GEC_DISPATCH_ARCHIVE.map((it) => {
  const [quote, ...rest] = it.takeaways;
  return {
    key: it.id,
    no: it.editionNumber.replace('#', ''),
    date: it.date,
    tag: it.category,
    scene: SCENE[it.category] ?? 'people',
    by: 'The GEC Desk',
    mins: parseInt(it.readTime, 10) || 5,
    title: it.title,
    dek: it.subtitle ?? '',
    cap: it.tags.slice(0, 3).join(' · '),
    body: [it.executiveSummary, ...(quote ? [`>${quote}`] : []), ...rest],
    band: it.color,
  };
});

const subscribe = (email: string) =>
  submitForm({ formType: 'newsletter', fullName: '', email, metadata: { source: 'dispatch-bin' } });

/** Floating newsletter bin + broadsheet reader. Mounted once in the root layout. */
export function DispatchBin() {
  const bin = useRef<HTMLButtonElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!bin.current || !dlg.current) return;
    return mountDispatchBin({ bin: bin.current, dlg: dlg.current, issues: ISSUES, onSubscribe: subscribe });
  }, []);

  return (
    <>
      <button ref={bin} type="button" className="bin bin-float" aria-haspopup="dialog" aria-label="Open The GEC Dispatch">
        <span className="bob">
          <span className="bin-art" />
          <span className="ground" />
        </span>
        <span className="badge" hidden />
        <span className="peek" />
      </button>
      <dialog ref={dlg} className="nl" aria-label="The GEC Dispatch">
        <div className="bar">
          {/* Phones: opens the issues drawer (the rail moves into .nl-drawer there; controller.js) */}
          <button type="button" className="bar-issues" data-act="issues" aria-controls="nl-drawer" aria-expanded="false">
            ☰ Issues
          </button>
          <span className="bar-label">
            The Bin · <b data-count />
          </span>
          <div className="bar-actions">
            <button type="button" data-act="full">⤢ Full screen</button>
            <button type="button" data-act="close" aria-label="Close">✕</button>
          </div>
        </div>
        <div className="body" />
        <div className="nl-scrim" data-act="issues-close" aria-hidden="true" />
        <aside className="nl-drawer" id="nl-drawer" aria-label="Issues in the bin" />
      </dialog>
    </>
  );
}

/** The same bin, placed inline and still (e.g. /stories #dispatch). Opens the shared reader. */
export function DockedBin() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => (ref.current ? registerDock(ref.current) : undefined), []);
  return <button ref={ref} type="button" className="bin bin-dock" aria-haspopup="dialog" aria-label="Open The GEC Dispatch" />;
}

/** Opens the reader from the docked bin on the page, if any (e.g. a "Read the latest issue" button). */
export function OpenDispatchButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => document.querySelector<HTMLButtonElement>('.bin-dock, .bin-float')?.click()}
    >
      {children}
    </button>
  );
}
