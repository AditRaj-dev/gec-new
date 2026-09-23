'use client';

import { useId, useState } from 'react';
import Link from 'next/link';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FOOTER_ROUTES: { href: string; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/initiatives', label: 'Initiatives' },
  { href: '/stories', label: 'Stories' },
  { href: '/teams', label: 'Teams' },
];

export function ActClose() {
  const emailId = useId();
  const errorId = useId();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const error = touched && !EMAIL_PATTERN.test(email.trim())
    ? email.trim() === ''
      ? 'An email address is required — enter yours to subscribe.'
      : `"${email.trim()}" isn't a valid email — check for a missing @ or domain, e.g. name@example.com.`
    : null;

  const handleBlur = () => setTouched(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!EMAIL_PATTERN.test(email.trim())) return;
    setStatus('success');
    setEmail('');
    setTouched(false);
  };

  return (
    <section aria-label="Join GEC" className="surface-sand w-full">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 py-20 md:px-10 lg:px-16">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex max-w-[46ch] flex-col gap-3">
            <h2
              className="font-display font-bold text-[var(--gec-ink)]"
              style={{ fontSize: 'var(--text-2xl)' }}
            >
              Your seat on the stage is open.
            </h2>
            <p
              className="text-[var(--gec-ink-muted)]"
              style={{ fontSize: 'var(--text-lg)' }}
            >
              Seven teams, one cell, and a place for whatever you're building
              next.
            </p>
          </div>

          {/* Primary CTA — the one action this act asks for. */}
          <Link
            href="/teams"
            className="inline-flex min-h-12 items-center rounded-full px-8 text-base font-semibold text-white transition-colors"
            style={{
              background: 'var(--gec-crimson)',
              transitionDuration: 'var(--dur-ui)',
            }}
          >
            Apply to a team →
          </Link>

          {/* Dispatch subscribe — visually subordinate to the CTA above:
              smaller type, no filled background, a plain text submit. */}
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex w-full max-w-sm flex-col items-center gap-2"
            noValidate
          >
            <div className="flex w-full flex-col gap-1.5 text-left">
              <label
                htmlFor={emailId}
                className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--gec-ink-muted)]"
              >
                Get GEC Dispatch in your inbox
              </label>
              <div className="flex gap-2">
                <input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  placeholder="you@example.com"
                  className="min-h-11 flex-1 rounded-lg border bg-[var(--gec-surface-card)] px-3 text-sm text-[var(--gec-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--gec-crimson)]"
                  style={{
                    borderColor: error
                      ? 'var(--gec-crimson)'
                      : 'var(--gec-border)',
                  }}
                />
                <button
                  type="submit"
                  className="min-h-11 rounded-lg border border-[var(--gec-border)] bg-transparent px-4 text-sm font-medium text-[var(--gec-ink)] transition-colors hover:bg-[var(--gec-surface-card)]"
                  style={{ transitionDuration: 'var(--dur-ui)' }}
                >
                  Subscribe
                </button>
              </div>
              {error && (
                <p
                  id={errorId}
                  role="alert"
                  className="text-xs text-[var(--gec-crimson)]"
                >
                  {error}
                </p>
              )}
              {status === 'success' && (
                <p role="status" className="text-xs text-[var(--gec-ink-muted)]">
                  Subscribed — the next issue lands in your inbox.
                </p>
              )}
            </div>
          </form>
        </div>

        <footer className="flex flex-col gap-6 border-t border-[var(--gec-border)] pt-8 text-sm text-[var(--gec-ink-muted)] sm:flex-row sm:items-start sm:justify-between">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_ROUTES.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="transition-colors hover:text-[var(--gec-ink)]"
                style={{ transitionDuration: 'var(--dur-ui)' }}
              >
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-1 sm:text-right">
            <a
              href="mailto:gec@galgotiasuniversity.edu.in"
              className="transition-colors hover:text-[var(--gec-ink)]"
              style={{ transitionDuration: 'var(--dur-ui)' }}
            >
              gec@galgotiasuniversity.edu.in
            </a>
            <span>Galgotias Entrepreneurship Cell · Galgotias University</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
