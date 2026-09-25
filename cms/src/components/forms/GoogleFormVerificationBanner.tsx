'use client';

import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';
import { apiClient } from '../../lib/api-client';

interface GoogleFormVerificationBannerProps {
  formId: string;
  editUri: string;
  onVerified?: () => void;
}

export function GoogleFormVerificationBanner({
  formId,
  editUri,
  onVerified,
}: GoogleFormVerificationBannerProps) {
  const [verifying, setVerifying] = useState(false);
  const [verifiedMessage, setVerifiedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setVerifying(true);
    setError(null);
    try {
      const res = await apiClient.verifyGoogleFormManualUpload(formId);
      if (res.verified) {
        setVerifiedMessage(res.message);
        onVerified?.();
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please ensure the file upload item exists.');
    } finally {
      setVerifying(false);
    }
  };

  if (verifiedMessage) {
    return (
      <div className="p-3.5 bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-xl flex items-center justify-between gap-3 text-xs text-[#16A34A] mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{verifiedMessage} Form is ready for review.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#FFFBEB] border-2 border-[#D97706]/40 rounded-xl text-xs space-y-3 mb-5 shadow-xs">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#D97706]/20 text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-[#92400E] uppercase tracking-wider font-mono">
            Checkpoint: Manual File-Upload Setup Required
          </h4>
          <p className="text-[#B45309] leading-relaxed">
            Google Forms API does not allow automated creation of file-upload questions.
            To complete this form, open it in the Google Forms editor, add the required file-upload question in your automation account’s My Drive, then verify below.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-1 pl-9">
        <a
          href={editUri}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D97706]/50 text-[#92400E] font-bold hover:bg-[#FEF3C7] transition-colors"
        >
          <span>Open in Google Forms Editor</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          type="button"
          onClick={handleVerify}
          disabled={verifying}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
        >
          {verifying ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying in Google Drive...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verify in Google Forms</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="text-[11px] font-mono text-[#991B1B] pl-9">
          {error}
        </div>
      )}
    </div>
  );
}
