'use client';

import React, { useState } from 'react';
import { CopilotActionProposal } from '../../lib/types';
import { useCopilot } from '../../context/CopilotContext';
import { Check, X, Clock, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActionProposalCardProps {
  proposal: CopilotActionProposal;
}

export function ActionProposalCard({ proposal }: ActionProposalCardProps) {
  const { confirmProposal } = useCopilot();
  const [executing, setExecuting] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  const isProposed = proposal.status === 'proposed';
  const isSucceeded = proposal.status === 'succeeded';

  const handleConfirm = async () => {
    setExecuting(true);
    const ok = await confirmProposal(proposal.id);
    setExecuting(false);
    if (ok) {
      setResultMsg('Action confirmed and executed successfully!');
    }
  };

  return (
    <div className="mt-3 p-3.5 rounded-xl border border-[#FBCA05]/50 bg-[#FFFDF8] shadow-sm text-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#A3040F]" />
          <span className="font-bold text-[#A3040F] uppercase tracking-wider font-mono">
            Action Proposal · Requires Confirmation
          </span>
        </div>
        <span
          className={cn(
            'px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase',
            isProposed && 'bg-[#FBCA05]/20 text-[#A16207] border border-[#FBCA05]/40',
            isSucceeded && 'bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/40'
          )}
        >
          {proposal.status}
        </span>
      </div>

      <p className="font-semibold text-[#222222]">
        {proposal.preview.summary}
      </p>

      {/* Diff View if available */}
      {proposal.preview.diff && proposal.preview.diff.length > 0 && (
        <div className="bg-[#FCF8ED] p-2.5 rounded-lg border border-[#A3040F]/15 space-y-2 font-mono text-[11px]">
          {proposal.preview.diff.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <span className="font-bold text-[#6E655F] uppercase text-[10px]">
                {item.field}:
              </span>
              <div className="bg-[#FEE2E2] text-[#991B1B] p-1.5 rounded border border-[#FCA5A5] line-through">
                {item.before}
              </div>
              <div className="bg-[#DCFCE7] text-[#166534] p-1.5 rounded border border-[#86EFAC] font-semibold">
                {item.after}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expiry note */}
      <div className="flex items-center gap-1 text-[10px] font-mono text-[#6E655F]">
        <Clock className="w-3 h-3 text-[#D97706]" />
        <span>One-time confirmation token expires in 60 mins</span>
      </div>

      {resultMsg && (
        <div className="p-2 rounded bg-[#16A34A]/10 text-[#16A34A] text-xs font-semibold">
          {resultMsg}
        </div>
      )}

      {/* Confirmation Actions */}
      {isProposed && (
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={handleConfirm}
            disabled={executing}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            {executing ? (
              'Executing...'
            ) : (
              <>
                <Check className="w-3.5 h-3.5" /> Confirm & Execute
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
