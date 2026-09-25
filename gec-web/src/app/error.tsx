'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import '@/components/route/route.css';

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    // Surface the failure for diagnostics without blocking the fallback UI.
    console.error(error);
  }, [error]);

  return (
    <main aria-label="Something broke">
      <section className="wf-section surface-cream rt-center" data-surface="cream">
        <div>
          <div className="rt-center__code" aria-hidden="true">Oops</div>
          <h1 className="h2-section" style={{ marginTop: 12 }}>This build hit a snag.</h1>
          <p className="body-editorial" style={{ margin: '12px auto 0' }}>
            Something failed on our end, not yours. Try again — most of the time the second attempt just works.
          </p>
          <div className="rt-center__actions">
            <button type="button" className="gec-btn btn-crimson" onClick={() => retry()}>Try again →</button>
            <Link className="rt-link" href="/">Back to Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
