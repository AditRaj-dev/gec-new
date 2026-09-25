'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import { cn } from '@/lib/utils';
import type { SiteNav } from '@/content/siteNav';
import {
  LOGO_VIEWBOX,
  LOGO_COLORS,
  PATH_G_RED,
  PATH_G_YELLOW,
  PATH_G_BLUE,
  PATHS_G_EMBLEM,
  PATH_E,
  PATHS_C,
  PATHS_SUBTITLE,
} from '@/lib/logoData';

export const Navbar: React.FC<{ nav: Pick<SiteNav, 'routes' | 'mobileRoutes'> }> = ({ nav }) => {
  const pathname = usePathname();
  const [logoVisible, setLogoVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if intro has already been seen or reduced motion preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenIntro = sessionStorage.getItem('gec_intro_seen');

    if (hasSeenIntro || prefersReducedMotion) {
      setLogoVisible(true);
    }

    const handleIntroCompleted = () => {
      setLogoVisible(true);
    };

    const handleReplayIntro = () => {
      setLogoVisible(false);
    };

    window.addEventListener('gec-intro-completed', handleIntroCompleted);
    window.addEventListener('gec-replay-intro', handleReplayIntro);

    return () => {
      window.removeEventListener('gec-intro-completed', handleIntroCompleted);
      window.removeEventListener('gec-replay-intro', handleReplayIntro);
    };
  }, []);

  return (
    <>
      <nav className="site-navbar" aria-label="Main Navigation">
        {/* Brand Slot: FLIP Target for Brand Entrance */}
        <ViewTransitionLink
          href="/"
          id="navbar-brand-logo"
          className="brand-mark transition-opacity duration-300 ease-out"
          style={{ opacity: logoVisible ? 1 : 0 }}
          aria-label="Galgotias Entrepreneurship Cell Home"
        >
          <svg
            viewBox={LOGO_VIEWBOX}
            className="h-12 sm:h-14 w-auto drop-shadow-xs"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Letter G */}
            <g id="nav-letter-G">
              <path d={PATH_G_RED} fill={LOGO_COLORS.red} />
              <path d={PATH_G_YELLOW} fill={LOGO_COLORS.yellow} />
              <path d={PATH_G_BLUE} fill={LOGO_COLORS.blue} />
              {PATHS_G_EMBLEM.map((pathD, idx) => (
                <path key={idx} d={pathD} fill={LOGO_COLORS.emblem} />
              ))}
            </g>

            {/* Letter E */}
            <g id="nav-letter-E">
              <path d={PATH_E} fill={LOGO_COLORS.red} />
            </g>

            {/* Letter C with bulb */}
            <g id="nav-letter-C">
              <path d={PATHS_C[0].d} fill={LOGO_COLORS.red} />
              <path d={PATHS_C[1].d} fill={LOGO_COLORS.red} />
              <path d={PATHS_C[2].d} fill={LOGO_COLORS.red} />
              <path d={PATHS_C[3].d} fill={LOGO_COLORS.red} />
              <path
                d={PATHS_C[4].d}
                fill="none"
                stroke={LOGO_COLORS.red}
                strokeWidth="0.75"
                strokeMiterlimit={10}
              />
            </g>

            {/* Subtitle */}
            <g id="nav-subtitle">
              {PATHS_SUBTITLE.map((item, idx) => (
                <path
                  key={idx}
                  d={item.d}
                  fill={LOGO_COLORS.grey}
                  stroke={LOGO_COLORS.grey}
                  strokeWidth="0.5"
                  strokeMiterlimit={10}
                />
              ))}
            </g>
          </svg>
        </ViewTransitionLink>

        <div className="nav-links">
          {nav.routes.map((route) => (
            <ViewTransitionLink
              key={route.href}
              href={route.href}
              className={cn('nav-link', pathname === route.href && 'active-link')}
            >
              {route.label}
            </ViewTransitionLink>
          ))}
        </div>

        <div className="navbar-desktop-cta">
          <ViewTransitionLink href="/initiatives" className="gec-btn btn-crimson">
            Explore Initiatives
          </ViewTransitionLink>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle Navigation"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-drawer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div id="mobile-nav-drawer" className={cn('mobile-nav-drawer', mobileMenuOpen && 'drawer-open')} role="menu">
        {nav.mobileRoutes.map((route) => (
          <ViewTransitionLink
            key={route.href}
            href={route.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn('nav-link', pathname === route.href && 'active-link')}
          >
            {route.label}
          </ViewTransitionLink>
        ))}
        <ViewTransitionLink
          href="/initiatives"
          onClick={() => setMobileMenuOpen(false)}
          className="gec-btn btn-crimson"
        >
          Explore Initiatives
        </ViewTransitionLink>
      </div>
    </>
  );
};
