'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';

type Props = ComponentProps<typeof Link>;

/**
 * Drop-in replacement for `next/link` that routes navigation through
 * `document.startViewTransition` when the browser supports it, so route
 * changes pick up the `wipe` curtain defined in globals.css. Modified
 * clicks (new tab / new window / non-primary button) and browsers without
 * View Transitions support fall through to ordinary `next/link` navigation.
 */
export function ViewTransitionLink({ href, onClick, ...rest }: Props) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Let the browser handle modified clicks and external targets.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (typeof doc.startViewTransition !== 'function') return; // instant nav fallback
    e.preventDefault();
    doc.startViewTransition(() => {
      router.push(String(href));
    });
  }

  return <Link href={href} onClick={handleClick} {...rest} />;
}
