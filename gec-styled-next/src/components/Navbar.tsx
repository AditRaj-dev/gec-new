'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
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

export const Navbar: React.FC = () => {
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

  const triggerReplay = () => {
    try {
      sessionStorage.removeItem('gec_intro_seen');
    } catch {}
    setLogoVisible(false);
    window.dispatchEvent(new CustomEvent('gec-replay-intro'));
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FCF8ED]/90 backdrop-blur-md border-b border-[rgba(163,4,15,0.15)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Slot: FLIP Target for Brand Entrance */}
        <Link
          href="/"
          className="flex items-center group py-2"
          aria-label="Galgotias Entrepreneurship Cell Home"
        >
          <div
            id="navbar-brand-logo"
            className="h-12 sm:h-14 w-auto transition-opacity duration-300 ease-out"
            style={{ opacity: logoVisible ? 1 : 0 }}
          >
            <svg
              viewBox={LOGO_VIEWBOX}
              className="h-full w-auto drop-shadow-xs"
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
          </div>
        </Link>

        {/* Desktop Navigation Links — 5 core routes */}
        <nav className="hidden lg:flex items-center gap-10 text-sm font-semibold text-[#222222]">
          <ViewTransitionLink
            href="/"
            className="hover:text-[#A3040F] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#A3040F] hover:after:w-full after:transition-all after:duration-200"
          >
            Home
          </ViewTransitionLink>
          <ViewTransitionLink
            href="/about"
            className="hover:text-[#A3040F] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#A3040F] hover:after:w-full after:transition-all after:duration-200"
          >
            About
          </ViewTransitionLink>
          <ViewTransitionLink
            href="/teams"
            className="hover:text-[#A3040F] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#A3040F] hover:after:w-full after:transition-all after:duration-200"
          >
            Teams
          </ViewTransitionLink>
          <ViewTransitionLink
            href="/initiatives"
            className="hover:text-[#A3040F] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#A3040F] hover:after:w-full after:transition-all after:duration-200"
          >
            Initiatives
          </ViewTransitionLink>
          <ViewTransitionLink
            href="/stories"
            className="hover:text-[#A3040F] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#A3040F] hover:after:w-full after:transition-all after:duration-200"
          >
            Stories
          </ViewTransitionLink>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Replay Intro Button */}
          <button
            onClick={triggerReplay}
            className="h-10 px-3.5 text-xs font-semibold uppercase tracking-wider text-[#5F5650] hover:text-[#A3040F] bg-[#FFFDF8] hover:bg-white border border-[rgba(163,4,15,0.2)] rounded-lg shadow-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Replay GEC Entrance Animation"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Replay Intro</span>
          </button>

          {/* Primary CTA */}
          <Link
            href="#apply"
            className="h-10 px-5 text-sm font-semibold text-white bg-[#A3040F] hover:bg-[#C62F29] rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
          >
            Apply for Cohort
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={triggerReplay}
            className="p-2 text-[#5F5650] hover:text-[#A3040F] bg-[#FFFDF8] border border-[rgba(163,4,15,0.2)] rounded-lg shadow-xs active:scale-95"
            aria-label="Replay intro animation"
            title="Replay Intro"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#222222] hover:text-[#A3040F] rounded-lg cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer — 5 core routes */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[rgba(163,4,15,0.15)] bg-[#FCF8ED] px-4 pt-3 pb-6 space-y-3">
          <ViewTransitionLink href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-[#222222] hover:text-[#A3040F]">Home</ViewTransitionLink>
          <ViewTransitionLink href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-[#222222] hover:text-[#A3040F]">About</ViewTransitionLink>
          <ViewTransitionLink href="/teams" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-[#222222] hover:text-[#A3040F]">Teams</ViewTransitionLink>
          <ViewTransitionLink href="/initiatives" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-[#222222] hover:text-[#A3040F]">Initiatives</ViewTransitionLink>
          <ViewTransitionLink href="/stories" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-[#222222] hover:text-[#A3040F]">Stories</ViewTransitionLink>
          <div className="pt-2">
            <Link
              href="#apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-sm font-semibold text-white bg-[#A3040F] hover:bg-[#C62F29] rounded-lg flex items-center justify-center shadow-xs"
            >
              Apply for Cohort
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
