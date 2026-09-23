import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found | Galgotias Entrepreneurship Cell',
  description: 'This page does not exist.',
};

const ROUTES: { href: string; label: string; description: string }[] = [
  { href: '/', label: 'Home', description: 'The six-act tour of what GEC builds.' },
  { href: '/about', label: 'About', description: 'The story, mission and manifesto behind GEC.' },
  { href: '/initiatives', label: 'Initiatives', description: 'The programs that turn curiosity into ventures.' },
  { href: '/stories', label: 'Stories', description: 'Dispatches, ventures and the people building them.' },
  { href: '/teams', label: 'Teams', description: 'Seven teams, one cell — apply to build with us.' },
];

export default function NotFound() {
  return (
    <main aria-label="Page not found">
      <section className="surface-cream">
        <div className="mx-auto flex min-h-[70vh] max-w-[900px] flex-col items-center justify-center gap-12 px-6 py-24 text-center md:px-10">
          <div className="flex max-w-[46ch] flex-col gap-3">
            <h1
              className="font-display font-bold text-[var(--gec-ink)]"
              style={{ fontSize: 'var(--text-3xl)', lineHeight: 1.05 }}
            >
              Nothing to build here.
            </h1>
            <p
              className="text-[var(--gec-ink-muted)]"
              style={{ fontSize: 'var(--text-lg)', lineHeight: 1.7 }}
            >
              This page doesn&rsquo;t exist — but the stage is still open.
              Pick a route below.
            </p>
          </div>

          <nav aria-label="Site routes" className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {ROUTES.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="surface-card flex flex-col gap-1.5 rounded-2xl border border-transparent p-6 text-left transition-colors hover:border-[var(--gec-crimson)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gec-crimson)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--gec-canvas)]"
                style={{
                  boxShadow: 'var(--elev-raised)',
                  transitionDuration: 'var(--dur-ui)',
                }}
              >
                <span
                  className="font-display font-bold text-[var(--gec-ink)]"
                  style={{ fontSize: 'var(--text-base)' }}
                >
                  {route.label}
                </span>
                <span
                  className="text-[var(--gec-ink-muted)]"
                  style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
                >
                  {route.description}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
