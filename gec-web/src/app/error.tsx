'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the failure for diagnostics without blocking the fallback UI.
    console.error(error);
  }, [error]);

  return (
    <main aria-label="Something broke">
      <section className="surface-cream gec-grain">
        <div className="mx-auto flex min-h-[70vh] max-w-[720px] flex-col items-center justify-center gap-8 px-6 py-24 text-center md:px-10">
          <div className="flex max-w-[46ch] flex-col gap-3">
            <h1
              className="font-display font-bold text-[var(--gec-ink)]"
              style={{ fontSize: 'var(--text-3xl)', lineHeight: 1.05 }}
            >
              This build hit a snag.
            </h1>
            <p
              className="text-[var(--gec-ink-muted)]"
              style={{ fontSize: 'var(--text-lg)', lineHeight: 1.7 }}
            >
              Something failed on our end, not yours. Try again — most of
              the time the second attempt just works.
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center rounded-full px-8 text-base font-semibold text-white transition-colors"
            style={{
              background: 'var(--gec-crimson)',
              transitionDuration: 'var(--dur-ui)',
            }}
          >
            Try again →
          </button>
        </div>
      </section>
    </main>
  );
}
