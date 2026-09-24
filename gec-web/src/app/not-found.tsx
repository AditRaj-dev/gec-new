import type { Metadata } from 'next';
import Link from 'next/link';
import { ShaderLayer } from '@/components/ShaderLayer';
import '@/components/route/route.css';

export const metadata: Metadata = {
  title: 'Page not found | Galgotias Entrepreneurship Cell',
  description: 'This page does not exist.',
};

export default function NotFound() {
  return (
    <main aria-label="Page not found">
      <section className="wf-section surface-cream gec-shader-host rt-center" data-surface="cream">
        <ShaderLayer family="contour" />
        <div>
          <div className="rt-center__code" aria-hidden="true">404</div>
          <h1 className="h2-section" style={{ marginTop: 12 }}>This page never made it past the idea stage.</h1>
          <div className="rt-center__actions">
            <Link className="gec-btn btn-crimson" href="/">Back to Home</Link>
            <Link className="rt-link" href="/stories">Read Stories →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
