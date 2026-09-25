'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';

type Props = ComponentProps<typeof Link>;

/**
 * True only for a string href that resolves to the same origin and isn't a
 * hash-only fragment. `next/link` already does this local-URL check
 * internally before intercepting a click; this wrapper needs its own copy
 * because it intercepts before delegating to `Link`. Anything that fails
 * this check (a `UrlObject` href, an external URL, a `#hash`) is handed
 * back to `next/link`'s own click handling instead of being pushed through
 * `router.push`, which only accepts a string route.
 */
function isSameOriginRoute(href: Props['href']): href is string {
  if (typeof href !== 'string' || href.startsWith('#')) return false;
  try {
    return new URL(href, window.location.origin).origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Drop-in replacement for `next/link` that routes navigation through
 * `document.startViewTransition` when the browser supports it, so route
 * changes pick up the `wipe` curtain defined in globals.css. Modified
 * clicks (new tab / new window / non-primary button), external or
 * hash-only hrefs, and browsers without View Transitions support fall
 * through to ordinary `next/link` navigation.
 */
export function ViewTransitionLink({ href, onClick, ...rest }: Props) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Let the browser handle modified clicks and external targets.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (!isSameOriginRoute(href)) return; // let next/link handle it natively
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (typeof doc.startViewTransition !== 'function') return; // next/link handles navigation
    e.preventDefault();
    doc.startViewTransition(() => {
      router.push(href);
    });
  }

  return <Link href={href} onClick={handleClick} {...rest} />;
}
