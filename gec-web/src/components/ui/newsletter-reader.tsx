'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { DeskFolio } from '@/components/deskfolio/DeskFolio';
import type { NewsletterBookshelfItem } from './newsletter-bookshelf';
import '@/components/deskfolio/deskfolio.css';
import '@/components/deskfolio/gec-editorial.css';

export interface NewsletterReaderProps {
  books: NewsletterBookshelfItem[];
  selectedBookId: string;
  onSelectBook: (book: NewsletterBookshelfItem, index: number) => void;
  onClose: () => void;
}

export function buildDispatchPages(item: NewsletterBookshelfItem, completionAction?: React.ReactNode) {
  const isLight = item.color === '#FCF8ED' || item.color === '#F4E2CA' || item.color === '#FFFDF8';
  const foilColor = item.foil || (isLight ? '#A3040F' : '#FBCA05');
  const baseBg = item.color || '#A3040F';
  const textColor = isLight ? '#222222' : '#FFFDF8';

  const cover = (
    <article
      className="gec-book-cover select-none"
      onCopy={(e) => e.preventDefault()}
      style={{
        background: `radial-gradient(120% 90% at 50% 15%, rgba(255,255,255,0.18) 0%, transparent 60%), linear-gradient(160deg, ${baseBg} 0%, rgba(0,0,0,0.35) 100%)`,
        backgroundColor: baseBg,
        color: textColor,
        boxShadow: `inset 0 0 0 1px ${foilColor}55, inset 0 0 0 8px rgba(0,0,0,0.25)`,
      }}
    >
      <div className="df-cover-foil-border" style={{ borderColor: `${foilColor}66` }} aria-hidden="true" />
      <header className="gec-book-cover__running" style={{ borderBottomColor: `${foilColor}44`, color: foilColor }}>
        <span>GEC ARCHIVES // QUARTERLY DISPATCH</span>
        <span>{item.id.toUpperCase()}</span>
      </header>
      <div className="gec-book-cover__title-block">
        <svg className="gec-book-cover__mark" viewBox="0 0 72 72" style={{ color: foilColor }} aria-hidden="true">
          <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="36" cy="36" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
          <path d="M36 19 47 26v12c0 8-4.4 13.5-11 16-6.6-2.5-11-8-11-16V26l11-7Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="m36 27 2.2 5.7 5.8 2.2-5.8 2.1-2.2 5.8-2.2-5.8-5.8-2.1 5.8-2.2L36 27Z" fill="currentColor" />
        </svg>
        <span className="gec-book-cover__mark-label" style={{ color: foilColor }}>
          {item.editionNumber || 'VOL. 2026'} {'//'} {item.category || 'VENTURE ARCHIVE'}
        </span>
        <h2 style={{ color: textColor }}>{item.title}</h2>
        <p style={{ color: isLight ? '#5F5650' : 'rgba(255,255,255,0.75)' }}>
          {item.subtitle || 'Operational notes and blueprints for student venture teams.'}
        </p>
      </div>
      <footer className="gec-book-cover__footer" style={{ borderTopColor: `${foilColor}44`, color: isLight ? '#5F5650' : 'rgba(255,255,255,0.75)' }}>
        <span>Galgotias Entrepreneurship Cell</span>
        <span style={{ color: foilColor }}>Open Volume &rarr;</span>
      </footer>
    </article>
  );

  const page1 = (
    <article className="gec-editorial-page select-none" onCopy={(e) => e.preventDefault()}>
      <div className="gec-editorial-page__texture" aria-hidden="true" />
      <header className="gec-editorial-page__running">
        <div className="gec-editorial-page__running-left">
          <span className="gec-editorial-page__running-pill">{item.editionNumber || 'DISPATCH'}</span>
          <span className="gec-editorial-page__kicker">Issue Briefing</span>
        </div>
        <span className="gec-editorial-page__folio-id">FOLIO 01</span>
      </header>
      <div className="gec-editorial-page__content">
        <span className="gec-editorial-page__category">{item.category || 'Executive Memo'}</span>
        <h3 className="gec-editorial-page__title">{item.title}</h3>
        <p className="gec-editorial-page__deck">{item.executiveSummary || item.subtitle}</p>
        <div className="p-3 rounded-lg bg-[#FCF8ED] border border-[rgba(163,4,15,0.15)] text-xs text-[#222222]">
          <strong className="block text-[#A3040F] font-mono uppercase text-[11px] mb-1">Working Hypothesis</strong>
          Every student venture begins with unverified assumptions. This dispatch archives the direct proof points that moved the work forward.
        </div>
      </div>
      <footer className="gec-editorial-page__footer flex items-center justify-between text-xs text-[#78716C] pt-2 border-t border-black/10">
        <span>{item.date}</span>
        <span>Page 1</span>
      </footer>
    </article>
  );

  const page2 = (
    <article className="gec-editorial-page select-none" onCopy={(e) => e.preventDefault()}>
      <div className="gec-editorial-page__texture" aria-hidden="true" />
      <header className="gec-editorial-page__running">
        <div className="gec-editorial-page__running-left">
          <span className="gec-editorial-page__running-pill">FRAMEWORK</span>
          <span className="gec-editorial-page__kicker">Operational Blueprint</span>
        </div>
        <span className="gec-editorial-page__folio-id">FOLIO 02</span>
      </header>
      <div className="gec-editorial-page__content">
        <span className="gec-editorial-page__category">Execution Mechanics</span>
        <h3 className="gec-editorial-page__title">Three Promises to Early Builders</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-[#374151]">
            <span className="w-5 h-5 rounded-md bg-[#A3040F] text-white font-mono font-bold flex items-center justify-center shrink-0">01</span>
            <div>
              <strong className="text-[#111827] block font-semibold">Evidence Over Applause</strong>
              Customer behaviour and pilot retention matter infinitely more than polished pitch decks.
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#374151]">
            <span className="w-5 h-5 rounded-md bg-[#1F7EC0] text-white font-mono font-bold flex items-center justify-center shrink-0">02</span>
            <div>
              <strong className="text-[#111827] block font-semibold">Founder Sovereignty</strong>
              Mentorship is designed around student equity control and long-term operating autonomy.
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#374151]">
            <span className="w-5 h-5 rounded-md bg-[#FBCA05] text-[#222222] font-mono font-bold flex items-center justify-center shrink-0">03</span>
            <div>
              <strong className="text-[#111827] block font-semibold">Timely Capital Injection</strong>
              Prototype grants and compute credits arrive at the precise moment the experiment demands them.
            </div>
          </div>
        </div>
      </div>
      <footer className="gec-editorial-page__footer flex items-center justify-between text-xs text-[#78716C] pt-2 border-t border-black/10">
        <span>GEC Operating Charter</span>
        <span>Page 2</span>
      </footer>
    </article>
  );

  const page3 = (
    <article className="gec-editorial-page select-none" onCopy={(e) => e.preventDefault()}>
      <div className="gec-editorial-page__texture" aria-hidden="true" />
      <header className="gec-editorial-page__running">
        <div className="gec-editorial-page__running-left">
          <span className="gec-editorial-page__running-pill">CAPITAL</span>
          <span className="gec-editorial-page__kicker">Deal Mechanics</span>
        </div>
        <span className="gec-editorial-page__folio-id">FOLIO 03</span>
      </header>
      <div className="gec-editorial-page__content">
        <span className="gec-editorial-page__category">Non-Dilutive Capital</span>
        <h3 className="gec-editorial-page__title">Under the Hood: Tranches &amp; Diligence</h3>
        <p className="text-xs text-[#374151] leading-relaxed">
          How student teams navigate angel syndicates, seed grants, and university IP assignments without early dilution.
        </p>
        <blockquote className="p-3 rounded-lg bg-[#F4E2CA]/40 border-l-2 border-[#A3040F] text-xs text-[#222222] italic">
          &ldquo;The prototype grant mattered because it paid for the experiment everyone else wanted us to postpone.&rdquo;
          <cite className="block text-[11px] text-[#A3040F] font-bold not-italic mt-1.5">&mdash; Galgotias Alumni Founder</cite>
        </blockquote>
      </div>
      <footer className="gec-editorial-page__footer flex items-center justify-between text-xs text-[#78716C] pt-2 border-t border-black/10">
        <span>GEC Capital Stack</span>
        <span>Page 3</span>
      </footer>
    </article>
  );

  const page4 = (
    <article className="gec-editorial-page select-none" onCopy={(e) => e.preventDefault()}>
      <div className="gec-editorial-page__texture" aria-hidden="true" />
      <header className="gec-editorial-page__running">
        <div className="gec-editorial-page__running-left">
          <span className="gec-editorial-page__running-pill">DIRECTIVES</span>
          <span className="gec-editorial-page__kicker">Founder Checklist</span>
        </div>
        <span className="gec-editorial-page__folio-id">FOLIO 04</span>
      </header>
      <div className="gec-editorial-page__content">
        <span className="gec-editorial-page__category">Action Items</span>
        <h3 className="gec-editorial-page__title">Takeaways for this Sprint</h3>
        <ul className="space-y-2 text-xs text-[#222222]">
          {(item.takeaways || [
            'Audit the user pain: interview 10 people who encountered the problem this week.',
            'Test the exchange: ask for economic sacrifice before writing backend code.',
            'Keep founder paperwork unambiguous: clear 4-year vesting and IP assignment.',
          ]).map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#A3040F] font-bold font-mono">&rarr;</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 pt-2 border-t border-black/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#5F5650]">Office hours: Innovation Tower</span>
          <span className="text-[11px] font-bold text-[#A3040F]">incubation@gecgalgotias.org</span>
        </div>
      </div>
      <footer className="gec-editorial-page__footer flex items-center justify-between text-xs text-[#78716C] pt-2 border-t border-black/10">
        <span>End of Dispatch</span>
        <span>Page 4</span>
      </footer>
    </article>
  );

  const backCover = (
    <article className="gec-book-cover gec-book-cover--back select-none" onCopy={(e) => e.preventDefault()}>
      <header className="gec-book-cover__running">
        <span>GEC ARCHIVES</span>
        <span>2026</span>
      </header>
      <div className="gec-book-cover__title-block">
        <svg className="gec-book-cover__mark" viewBox="0 0 72 72" style={{ color: '#FBCA05' }} aria-hidden="true">
          <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="36" cy="36" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
          <path d="M36 19 47 26v12c0 8-4.4 13.5-11 16-6.6-2.5-11-8-11-16V26l11-7Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="m36 27 2.2 5.7 5.8 2.2-5.8 2.1-2.2 5.8-2.2-5.8-5.8-2.1 5.8-2.2L36 27Z" fill="currentColor" />
        </svg>
        <h2 style={{ color: '#FAF8F5' }}>Build what the evidence can carry.</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>A working record for student founders.</p>
        {completionAction && <div className="pt-4 flex justify-center">{completionAction}</div>}
      </div>
      <footer className="gec-book-cover__footer">
        <span>Greater Noida, UP</span>
        <span style={{ color: '#FBCA05' }}>GEC / 26</span>
      </footer>
    </article>
  );

  return {
    cover,
    pages: [page1, page2, page3, page4],
    backCover,
  };
}

export function NewsletterReader({
  books,
  selectedBookId,
  onSelectBook,
  onClose,
}: NewsletterReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(800);
  const [currentSpread, setCurrentSpread] = useState(0);

  // Throttled ResizeObserver for sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let rafId: number | null = null;
    const ro = new ResizeObserver((entries) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        for (const entry of entries) {
          setStageWidth(entry.contentRect.width);
        }
      });
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const activeBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) || books[0],
    [books, selectedBookId]
  );

  const flippableData = useMemo(() => {
    if (!activeBook) return null;
    return buildDispatchPages(activeBook);
  }, [activeBook]);

  const pageWidth = Math.min(350, Math.max(160, Math.floor((stageWidth - 48) / 2)));
  const pageHeight = Math.round(pageWidth * 1.38);

  const handleSpreadChange = useCallback((spread: number) => {
    setCurrentSpread(spread);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative pt-6 pb-8 px-4 bg-gradient-to-b from-[#FAF6EC] to-[#F4E8D3] min-h-[580px] flex flex-col items-center justify-between select-none"
      onCopy={(e) => e.preventDefault()}
    >
      {/* Reader Sub-Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4 px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#A3040F] text-white font-mono font-bold text-[11px]">
            {activeBook?.editionNumber || 'EDITION'}
          </span>
          <strong className="text-sm text-[#222222] font-bold">{activeBook?.title}</strong>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#5F5650]">
          <span className="hidden sm:inline">Use arrows &larr; / &rarr; or drag corners to turn</span>
          <span className="px-2 py-0.5 rounded bg-[#FFFDF8] border border-[rgba(163,4,15,0.18)] font-bold text-[#A3040F]">
            {currentSpread === 0 ? 'COVER' : currentSpread >= 3 ? 'BACK COVER' : `SPREAD ${currentSpread} / 2`}
          </span>
        </div>
      </div>

      {/* Flippable 3D DeskFolio Book Stage with page virtualization */}
      <div className="w-full flex items-center justify-center py-4 overflow-visible">
        {flippableData && (
          <DeskFolio
            cover={flippableData.cover}
            pages={flippableData.pages}
            backCover={flippableData.backCover}
            pageWidth={pageWidth}
            pageHeight={pageHeight}
            onTurn={handleSpreadChange}
            virtualizePages={true}
            className="gec-newsletter-deskfolio shadow-2xl"
          />
        )}
      </div>

      {/* Bottom Shelf Mini-Switcher Row */}
      <div className="w-full max-w-4xl mt-6 pt-4 border-t border-[rgba(163,4,15,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#5F5650] flex items-center gap-2">
          <span className="font-bold text-[#222222]">Switch Volume:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-md no-scrollbar py-1">
            {books.map((b, i) => (
              <button
                key={b.id}
                onClick={() => {
                  setCurrentSpread(0);
                  onSelectBook(b, i);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                  selectedBookId === b.id
                    ? 'bg-[#A3040F] text-white'
                    : 'bg-[#FFFDF8] hover:bg-[#F4E2CA] text-[#5F5650] border border-[rgba(163,4,15,0.15)]'
                }`}
              >
                {b.editionNumber || b.id.replace('dispatch-', '#')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="h-9 px-4 text-xs font-bold text-[#222222] hover:text-[#A3040F] bg-[#FFFDF8] hover:bg-white border border-[rgba(163,4,15,0.22)] rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>&larr; Return to Shelf Overview</span>
        </button>
      </div>
    </div>
  );
}
