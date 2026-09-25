'use client';

import Image from 'next/image';
import { useRef } from 'react';

/**
 * "Relive the Moment" — opens the milestone large, in place, in a native <dialog>
 * (Esc, focus trap and backdrop come free). ponytail: one photo per milestone today;
 * turn `photo` into `photos[]` and add a film strip once real event galleries exist.
 */
export function MilestoneRelive({
  title,
  desc,
  meta,
  photo,
}: {
  title: string;
  desc: string;
  meta: string;
  photo?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className="milestones__relive-link" onClick={() => ref.current?.showModal()}>
        Relive the Moment →
      </button>
      <dialog
        ref={ref}
        className="milestones__dialog"
        aria-label={title}
        onClick={(e) => e.target === ref.current && ref.current.close()}
      >
        {photo && (
          <div className="milestones__dialog-img">
            <Image src={photo} alt={title} fill sizes="(max-width: 900px) 100vw, 900px" />
          </div>
        )}
        <div className="milestones__dialog-body">
          <span className="status-badge badge-gold">{meta}</span>
          <h3 className="h3-card">{title}</h3>
          <p className="body-editorial">{desc}</p>
          <button type="button" className="gec-btn btn-outline-ink" onClick={() => ref.current?.close()} autoFocus>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
