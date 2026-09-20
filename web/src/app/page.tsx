'use client';

import React from 'react';
import Link from 'next/link';
import { NewsletterSection } from '@/components/NewsletterSection';

export default function Home() {
  const handleReplay = () => {
    try {
      sessionStorage.removeItem('gec_intro_seen');
    } catch {}
    window.dispatchEvent(new CustomEvent('gec-replay-intro'));
  };

  return (
    <div className="w-full flex flex-col">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Asymmetric 7:5 Editorial Split)                         */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-[rgba(163,4,15,0.12)]">
        {/* Soft background ambient warmth */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial from-[#FBCA05]/10 via-[#A3040F]/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-radial from-[#1F7EC0]/8 to-transparent rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left 7 Columns: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[rgba(163,4,15,0.22)] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#A3040F]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#A3040F]">
                  Incubation Cohort &apos;26 Open
                </span>
                <span className="text-xs font-mono text-[#5F5650] border-l border-[rgba(163,4,15,0.2)] pl-2">
                  18 Days Left
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#222222] leading-[1.08]">
                Where Student Ideas Become{' '}
                <span className="text-[#A3040F] underline decoration-[rgba(163,4,15,0.3)] decoration-wavy decoration-from-font">
                  Scaled Ventures.
                </span>
              </h1>

              {/* Lead Body Paragraph */}
              <p className="text-lg md:text-xl text-[#5F5650] leading-relaxed max-w-2xl">
                The official entrepreneurship hub at Galgotias University. We bridge the gap between dorm-room concepts, early-stage capital, and tier-one venture mentorship.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="#apply"
                  className="h-12 px-7 bg-[#A3040F] hover:bg-[#C62F29] text-white font-semibold text-base rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
                >
                  Apply for Incubation
                </Link>

                <button
                  onClick={handleReplay}
                  className="h-12 px-5 bg-[#FFFDF8] hover:bg-white text-[#222222] hover:text-[#A3040F] border border-[rgba(163,4,15,0.2)] font-semibold text-sm rounded-lg shadow-2xs transition-all duration-150 flex items-center gap-2 cursor-pointer active:scale-95"
                  title="Experience the theatrical curtain reveal and FLIP logo docking"
                >
                  <svg className="w-4 h-4 text-[#A3040F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Replay Curtain Intro</span>
                </button>
              </div>

              {/* Metric Row */}
              <div className="pt-8 border-t border-[rgba(163,4,15,0.12)] grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#222222]">120+</div>
                  <div className="text-xs font-semibold text-[#5F5650] uppercase tracking-wider mt-0.5">Startups Launched</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#A3040F]">₹4.8Cr+</div>
                  <div className="text-xs font-semibold text-[#5F5650] uppercase tracking-wider mt-0.5">Seed Funding Raised</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#222222]">18K+</div>
                  <div className="text-xs font-semibold text-[#5F5650] uppercase tracking-wider mt-0.5">Students Mentored</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1F7EC0]">50+</div>
                  <div className="text-xs font-semibold text-[#5F5650] uppercase tracking-wider mt-0.5">Industry Partners</div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Feature Showcase Bento Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FFFDF8] border border-[rgba(163,4,15,0.18)] rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-[rgba(163,4,15,0.1)]">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#A3040F]">Featured Program</span>
                    <h3 className="text-xl font-bold text-[#222222] mt-0.5">Venture Catalyst Cohort</h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#FBCA05]/20 text-[#222222]">Summer &apos;26</span>
                </div>

                <div className="py-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#A3040F]/10 flex items-center justify-center text-[#A3040F] shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#222222]">₹5 Lakh Equity-Free Grant</h4>
                      <p className="text-xs text-[#5F5650]">Direct non-dilutive prototype capital for selected student venture teams.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#A3040F]/10 flex items-center justify-center text-[#A3040F] shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#222222]">1-on-1 VC Pitch Prep</h4>
                      <p className="text-xs text-[#5F5650]">Bi-weekly deal-flow reviews with partners from marquee Indian venture firms.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#A3040F]/10 flex items-center justify-center text-[#A3040F] shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#222222]">Prototyping Labs & Legal</h4>
                      <p className="text-xs text-[#5F5650]">IP protection, incorporation filing, AWS/GCP credits, and hardware workspace.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[rgba(163,4,15,0.1)] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#5F5650]">Selection Rate: ~4.2%</span>
                  <Link
                    href="#apply"
                    className="text-xs font-bold text-[#A3040F] hover:text-[#C62F29] flex items-center gap-1"
                  >
                    <span>View Curriculum</span>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Quick Architecture Note Card */}
              <div className="bg-[#F4E2CA]/40 border border-[rgba(163,4,15,0.12)] rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FBCA05]/30 flex items-center justify-center text-[#222222] shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <div className="text-xs text-[#5F5650] leading-snug">
                  <strong className="text-[#222222] font-semibold">Dynamic FLIP Animation:</strong> The entrance curtain smoothly ignites the bulb with two 72-frame pulses, then docks seamlessly into the sticky navigation bar above.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PILLARS & INITIATIVES                                                 */}
      {/* ========================================================================= */}
      <section id="initiatives" className="py-20 md:py-28 bg-[#FFFDF8] border-b border-[rgba(163,4,15,0.12)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A3040F]">Our Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#222222]">
              Three Pillars of Entrepreneurial Momentum
            </h2>
            <p className="text-base text-[#5F5650]">
              Engineered to de-risk high-conviction ventures from Day 0 through market scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-[#FCF8ED] border border-[rgba(163,4,15,0.16)] rounded-2xl p-8 flex flex-col justify-between hover:border-[#A3040F] transition-colors shadow-2xs group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#A3040F] text-white flex items-center justify-center font-mono font-bold text-lg">
                  01
                </div>
                <h3 className="text-xl font-bold text-[#222222] group-hover:text-[#A3040F] transition-colors">
                  Incubation & Venture Studio
                </h3>
                <p className="text-sm text-[#5F5650] leading-relaxed">
                  Dedicated campus workspaces, high-performance computing clusters, legal counsel, and direct grants for MVP validation.
                </p>
              </div>
              <div className="pt-6 border-t border-[rgba(163,4,15,0.1)] mt-6 text-xs font-semibold text-[#A3040F] flex items-center gap-1">
                <span>Learn about incubation</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#FCF8ED] border border-[rgba(163,4,15,0.16)] rounded-2xl p-8 flex flex-col justify-between hover:border-[#A3040F] transition-colors shadow-2xs group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#FBCA05] text-[#222222] flex items-center justify-center font-mono font-bold text-lg">
                  02
                </div>
                <h3 className="text-xl font-bold text-[#222222] group-hover:text-[#A3040F] transition-colors">
                  Annual E-Summit &apos;26
                </h3>
                <p className="text-sm text-[#5F5650] leading-relaxed">
                  Northern India&apos;s premier university entrepreneurship summit uniting 5,000+ delegates, 60+ keynote founders, and angel syndicates.
                </p>
              </div>
              <div className="pt-6 border-t border-[rgba(163,4,15,0.1)] mt-6 text-xs font-semibold text-[#A3040F] flex items-center gap-1">
                <span>Explore E-Summit stages</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#FCF8ED] border border-[rgba(163,4,15,0.16)] rounded-2xl p-8 flex flex-col justify-between hover:border-[#A3040F] transition-colors shadow-2xs group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#1F7EC0] text-white flex items-center justify-center font-mono font-bold text-lg">
                  03
                </div>
                <h3 className="text-xl font-bold text-[#222222] group-hover:text-[#A3040F] transition-colors">
                  Venture Capital Network
                </h3>
                <p className="text-sm text-[#5F5650] leading-relaxed">
                  Institutional pipeline directly connecting seed-stage student founders with angels, accelerators (Y Combinator, Surge), and micro-VC funds.
                </p>
              </div>
              <div className="pt-6 border-t border-[rgba(163,4,15,0.1)] mt-6 text-xs font-semibold text-[#A3040F] flex items-center gap-1">
                <span>View mentor directory</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. NEWSLETTER & DISPATCH ARCHIVES (3D WebGL Bookshelf)                   */}
      {/* ========================================================================= */}
      <NewsletterSection />

      {/* ========================================================================= */}
      {/* 4. CTA & FOOTER                                                          */}
      {/* ========================================================================= */}
      <section id="apply" className="py-20 bg-[#FCF8ED]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A3040F]">Join the Ecosystem</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#222222] tracking-tight">
            Ready to Build Your Venture?
          </h2>
          <p className="text-base sm:text-lg text-[#5F5650] max-w-xl mx-auto">
            Whether you have a pitch deck or just a scribbled wireframe, the Galgotias Entrepreneurship Cell is ready to back you.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#apply"
              className="h-12 px-8 bg-[#A3040F] hover:bg-[#C62F29] text-white font-semibold text-base rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95"
            >
              Submit Application
            </Link>
            <button
              onClick={handleReplay}
              className="h-12 px-6 bg-[#FFFDF8] hover:bg-white text-[#222222] border border-[rgba(163,4,15,0.2)] font-semibold text-sm rounded-lg shadow-2xs transition-all duration-150 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Test Curtain Animation Again</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(163,4,15,0.15)] bg-[#FFFDF8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#5F5650]">
          <div>
            <span className="font-bold text-[#222222]">Galgotias Entrepreneurship Cell</span> — Galgotias University, Greater Noida, UP, India.
          </div>
          <div className="flex items-center gap-6">
            <Link href="#about" className="hover:text-[#A3040F]">About</Link>
            <Link href="#initiatives" className="hover:text-[#A3040F]">Initiatives</Link>
            <Link href="#newsletter" className="hover:text-[#A3040F]">Dispatch</Link>
            <Link href="#team" className="hover:text-[#A3040F]">Team</Link>
            <Link href="#contact" className="hover:text-[#A3040F]">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
