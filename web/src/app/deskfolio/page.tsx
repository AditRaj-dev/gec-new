'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { DeskFolio, DeskFolioPage } from '@/components/deskfolio'

export default function DeskfolioPlaygroundPage() {
  const [tab, setTab] = useState<'full' | 'custom'>('full')

  return (
    <div className="w-full min-h-screen bg-[#111113] text-white flex flex-col">
      {/* Playground Navigation Toolbar */}
      <header className="w-full border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4 bg-[#18181b] z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-mono text-white/60 hover:text-white transition-colors"
          >
            ← Back to GEC Home
          </Link>
          <span className="text-white/20">|</span>
          <h1 className="text-base font-bold text-white tracking-wide">DeskFolio Component Sandbox</h1>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
            Interactive Dev Mode
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => setTab('full')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              tab === 'full'
                ? 'bg-[#A3040F] text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Full Desk Scene (DeskFolioPage)
          </button>
          <button
            onClick={() => setTab('custom')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              tab === 'custom'
                ? 'bg-[#A3040F] text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Modular FlipBook (&lt;DeskFolio /&gt;)
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 w-full relative">
        {tab === 'full' ? (
          <div className="w-full h-[calc(100vh-65px)] overflow-hidden relative">
            <DeskFolioPage />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto py-12 px-4 flex flex-col items-center">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Custom GEC Flip-Book Component</h2>
              <p className="text-sm text-white/60 mt-1 max-w-md">
                Iterate on your own custom pages, covers, and layouts using the modular{' '}
                <code className="text-amber-400 bg-white/5 px-1 rounded">&lt;DeskFolio /&gt;</code> component.
              </p>
            </div>

            <div className="w-full flex justify-center py-6">
              <DeskFolio
                cover={
                  <div className="w-full h-full bg-[#A3040F] text-white p-8 flex flex-col justify-between rounded-r-lg shadow-xl select-none">
                    <div className="text-xs uppercase font-mono tracking-widest text-white/70">
                      GEC Archives • 2026
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold tracking-tight">Galgotias</h3>
                      <h4 className="text-xl font-light text-amber-300">Entrepreneurship Cell</h4>
                      <p className="text-xs text-white/80 mt-3 leading-relaxed">
                        Where Student Ideas Become Scaled Ventures.
                      </p>
                    </div>
                    <div className="text-[11px] font-mono text-white/60">
                      Drag page corner or click to open →
                    </div>
                  </div>
                }
                pages={[
                  // Page 1
                  <div key="page-1" className="w-full h-full bg-[#FFFDF8] text-[#222222] p-8 flex flex-col justify-between select-none">
                    <div>
                      <span className="text-xs font-mono uppercase text-[#A3040F] font-bold">Page 01 // Vision</span>
                      <h4 className="text-2xl font-extrabold text-[#1a1a1a] mt-2">Venture Incubation</h4>
                      <p className="text-sm text-[#5F5650] mt-3 leading-relaxed">
                        Providing dorm-room innovators direct access to angel networks, prototyping grants, and legal venture scaffolding.
                      </p>
                    </div>
                    <div className="border-t border-black/10 pt-4 text-xs text-[#5F5650] font-mono">
                      120+ Startups Incubated
                    </div>
                  </div>,

                  // Page 2
                  <div key="page-2" className="w-full h-full bg-[#FFFDF8] text-[#222222] p-8 flex flex-col justify-between select-none">
                    <div>
                      <span className="text-xs font-mono uppercase text-[#1F7EC0] font-bold">Page 02 // Impact</span>
                      <h4 className="text-2xl font-extrabold text-[#1a1a1a] mt-2">₹4.8 Cr+ Raised</h4>
                      <p className="text-sm text-[#5F5650] mt-3 leading-relaxed">
                        Our student founders have secured institutional funding and won major national hackathons.
                      </p>
                    </div>
                    <div className="border-t border-black/10 pt-4 text-xs text-[#5F5650] font-mono">
                      18K+ Students Mentored
                    </div>
                  </div>,

                  // Page 3
                  <div key="page-3" className="w-full h-full bg-[#FFFDF8] text-[#222222] p-8 flex flex-col justify-between select-none">
                    <div>
                      <span className="text-xs font-mono uppercase text-[#FBCA05] font-bold text-amber-700">Page 03 // Programs</span>
                      <h4 className="text-2xl font-extrabold text-[#1a1a1a] mt-2">Venture Catalyst</h4>
                      <p className="text-sm text-[#5F5650] mt-3 leading-relaxed">
                        A rigorous 12-week accelerator designed to take student projects from MVP to market launch.
                      </p>
                    </div>
                    <div className="border-t border-black/10 pt-4 text-xs text-[#5F5650] font-mono">
                      Cohort &apos;26 Open
                    </div>
                  </div>,

                  // Page 4
                  <div key="page-4" className="w-full h-full bg-[#FFFDF8] text-[#222222] p-8 flex flex-col justify-between select-none">
                    <div>
                      <span className="text-xs font-mono uppercase text-[#A3040F] font-bold">Page 04 // Contact</span>
                      <h4 className="text-2xl font-extrabold text-[#1a1a1a] mt-2">Join the Ecosystem</h4>
                      <p className="text-sm text-[#5F5650] mt-3 leading-relaxed">
                        Reach out to pitch your deck or become a mentor.
                      </p>
                    </div>
                    <div className="border-t border-black/10 pt-4 text-xs text-[#A3040F] font-mono font-bold">
                      gec@galgotiasuniversity.edu.in
                    </div>
                  </div>,
                ]}
                backCover={
                  <div className="w-full h-full bg-[#7a030b] text-white p-8 flex flex-col justify-center items-center text-center select-none rounded-l-lg">
                    <span className="text-xs uppercase font-mono tracking-widest text-white/60">GEC</span>
                    <h5 className="text-lg font-bold mt-2">Galgotias Entrepreneurship Cell</h5>
                    <p className="text-xs text-white/70 mt-2">Greater Noida, India</p>
                  </div>
                }
                pageWidth={360}
                pageHeight={480}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
