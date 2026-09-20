'use client';

import React from 'react';
import { Sparkles, Radio } from 'lucide-react';

interface LiveImpactRibbonProps {
  targetSection: string;
  description: string;
}

export function LiveImpactRibbon({ targetSection, description }: LiveImpactRibbonProps) {
  return (
    <div className="bg-[#F4E2CA]/70 border border-[#A3040F]/20 rounded-xl p-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-md bg-[#A3040F] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-[#A3040F] text-[#FFFDF8] px-1.5 py-0.5 rounded">
              LIVE IMPACT
            </span>
            <span className="text-xs font-bold text-[#A3040F] font-mono">
              {targetSection}
            </span>
          </div>
          <p className="text-xs text-[#6E655F] truncate mt-0.5">
            {description}
          </p>
        </div>
      </div>
      <div className="text-[11px] font-mono text-[#6E655F] shrink-0 flex items-center gap-1 self-end sm:self-center">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
        Immediate CDN Sync on Save
      </div>
    </div>
  );
}
