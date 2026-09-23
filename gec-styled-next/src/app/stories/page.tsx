import type { Metadata } from 'next';
import { NewsletterSection } from '@/components/NewsletterSection';
import { PortfolioGrid } from '@/components/stories/PortfolioGrid';

export const metadata: Metadata = {
  title: 'Stories | Galgotias Entrepreneurship Cell',
  description:
    'Founder chronicles, the GEC Dispatch archive, and the startup portfolio built at Galgotias.',
};

export default function StoriesPage() {
  return (
    <main aria-label="GEC Stories">
      {/* ---- Hero ---- */}
      <section className="surface-cream gec-grain">
        <div className="mx-auto max-w-[860px] px-6 py-24 text-center md:px-10 md:py-32 lg:px-16">
          <span className="font-mono text-xs uppercase tracking-[0.09em] text-[var(--gec-crimson)]">
            Culture &amp; Insights
          </span>
          <h1
            className="mt-3 font-display font-bold text-[var(--gec-ink)]"
            style={{ fontSize: 'var(--text-3xl)', lineHeight: 1.05 }}
          >
            People Build Companies.
            <br />
            <span className="text-[var(--gec-crimson)]">Stories Build Culture.</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-[65ch] text-[var(--gec-ink-muted)]"
            style={{ fontSize: 'var(--text-lg)', lineHeight: 1.7 }}
          >
            Ideas, failures, experiments, wins, and lessons from people inside and around the
            Galgotias entrepreneurial ecosystem.
          </p>
        </div>
      </section>

      {/* ---- The GEC Dispatch: bookshelf, reader, subscribe ---- */}
      {/* id="dispatch" is a contract with Task 9's /newsletter -> /stories#dispatch redirect. */}
      <section id="dispatch">
        <NewsletterSection />
      </section>

      {/* ---- Startup portfolio: "Built at Galgotias" ---- */}
      <section className="surface-sand">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24 lg:px-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[60ch]">
              <span className="font-mono text-xs uppercase tracking-[0.09em] text-[var(--gec-crimson)]">
                Venture Showcase
              </span>
              <h2
                className="mt-3 font-display font-bold text-[var(--gec-ink)]"
                style={{ fontSize: 'var(--text-2xl)' }}
              >
                Built at Galgotias.
              </h2>
              <p
                className="mt-3 text-[var(--gec-ink-muted)]"
                style={{ fontSize: 'var(--text-base)', lineHeight: 1.7 }}
              >
                Discover startups and student ventures emerging from the Galgotias
                entrepreneurial ecosystem.
              </p>
            </div>
          </div>

          <PortfolioGrid />
        </div>
      </section>
    </main>
  );
}
