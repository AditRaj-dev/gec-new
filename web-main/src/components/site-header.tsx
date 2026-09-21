"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { useModal } from "@/components/modal-context";
import { navigation } from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const { openApplyModal } = useModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(false);

  useEffect(() => {
    const complete = () => setIntroPlaying(false);
    const replay = () => setIntroPlaying(true);
    window.addEventListener("gec-intro-completed", complete);
    window.addEventListener("gec-replay-intro", replay);
    return () => {
      window.removeEventListener("gec-intro-completed", complete);
      window.removeEventListener("gec-replay-intro", replay);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="site-container site-header__inner" aria-label="Main navigation">
        <Link
          id="navbar-brand-logo"
          href="/"
          aria-label="Galgotias Entrepreneurship Cell — Home"
          className="site-header__logo"
          style={{ opacity: introPlaying ? 0 : 1 }}
          onClick={closeMenu}
        >
          <BrandMark className="site-header__logo-mark" />
        </Link>

        <div className="site-header__links">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`site-header__link ${pathname === item.href ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button type="button" className="button button--crimson site-header__cta" onClick={() => openApplyModal()}>
          Get involved
        </button>

        <button
          type="button"
          className="site-header__menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span aria-hidden="true" className="site-header__menu-icon">
            {menuOpen ? (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </span>
        </button>
      </nav>

      <div id="mobile-navigation" className={`site-header__mobile ${menuOpen ? "is-open" : ""}`}>
        <div className="site-container site-header__mobile-inner">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`site-header__mobile-link ${pathname === item.href ? "is-active" : ""}`}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <button type="button" className="button button--crimson" onClick={() => { closeMenu(); openApplyModal(); }}>
            Get involved
          </button>
        </div>
      </div>
    </header>
  );
}
