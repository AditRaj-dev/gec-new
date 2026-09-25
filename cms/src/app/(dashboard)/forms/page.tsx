'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { GoogleForm, GoogleFormResponse, GoogleFormLifecycleState } from '../../../lib/types';
import { LiveImpactRibbon } from '../../../components/layout/LiveImpactRibbon';
import { GoogleFormVerificationBanner } from '../../../components/forms/GoogleFormVerificationBanner';
import { SheetExportModal } from '../../../components/forms/SheetExportModal';
import { useCopilot } from '../../../context/CopilotContext';
import {
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  Search,
  Filter,
  Bot,
  Plus,
} from 'lucide-react';
import { cn, formatDateTime } from '../../../lib/utils';

export default function GoogleFormsPage() {
  const [forms, setForms] = useState<GoogleForm[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>('gf-001');
  const [responses, setResponses] = useState<GoogleFormResponse[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [searchResponse, setSearchResponse] = useState('');
  const { openDrawer, sendMessage } = useCopilot();

  const loadForms = () => {
    apiClient.getGoogleForms().then(data => {
      setForms(data);
      if (data.length > 0 && !selectedFormId) {
        setSelectedFormId(data[0].id);
      }
    });
  };

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    if (selectedFormId) {
      apiClient.getFormResponses(selectedFormId).then(setResponses);
    }
  }, [selectedFormId]);

  const activeForm = forms.find(f => f.id === selectedFormId) || forms[0];

  const handleSync = async (formId: string) => {
    setSyncingId(formId);
    try {
      await apiClient.syncGoogleFormResponses(formId);
      loadForms();
      if (selectedFormId === formId) {
        apiClient.getFormResponses(formId).then(setResponses);
      }
    } finally {
      setSyncingId(null);
    }
  };

  const handleGenerateWithCopilot = () => {
    openDrawer();
    sendMessage('Create a new Google Form plan for the upcoming Ideathon team registration with 4 questions and 1 pitch deck upload requirement.');
  };

  // Find if active form requires manual verification
  const needsVerification = activeForm?.lifecycleState === 'needs_manual_upload_setup';

  const filteredResponses = responses.filter(r => {
    const q = searchResponse.toLowerCase();
    const matchesEmail = r.respondentEmail.toLowerCase().includes(q);
    const matchesAnswers = Object.values(r.answers).some(v => v.toLowerCase().includes(q));
    return matchesEmail || matchesAnswers;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#222222] tracking-tight font-sans">
            Google Forms Integration & AI Copilot
          </h1>
          <p className="text-xs text-[#6E655F]">
            Governed Google Workspace forms management, manual upload checkpoints, on-demand response sync, and Sheets exports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateWithCopilot}
            className="px-4 py-2 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FBCA05]" />
            <span>Plan Form with Gemini Copilot</span>
          </button>
        </div>
      </div>

      <LiveImpactRibbon
        targetSection="Google Forms API & Dedicated Institutional My Drive"
        description="Google hosts responder experience. GEC CMS stores integration control state and response cache only on demand."
      />

      {/* Managed Forms Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forms.map(form => {
          const isSelected = form.id === selectedFormId;
          const isSyncing = syncingId === form.id;
          return (
            <div
              key={form.id}
              onClick={() => setSelectedFormId(form.id)}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer bg-[#FFFDF8] flex flex-col justify-between',
                isSelected
                  ? 'border-[#A3040F] ring-1 ring-[#A3040F] shadow-sm'
                  : 'border-[#CBD5E1] hover:border-[#A3040F]/50'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full',
                      form.lifecycleState === 'published' && 'bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30',
                      form.lifecycleState === 'needs_manual_upload_setup' && 'bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30',
                      form.lifecycleState === 'ready_for_review' && 'bg-[#1F7EC0]/20 text-[#1F7EC0] border border-[#1F7EC0]/30',
                      form.lifecycleState === 'closed' && 'bg-[#6E655F]/20 text-[#6E655F]'
                    )}
                  >
                    {form.lifecycleState.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] font-mono text-[#6E655F]">
                    {form.responseCount} Responses
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#222222] mt-2 leading-snug">
                  {form.title}
                </h3>
                <p className="text-xs text-[#6E655F] line-clamp-2 mt-1">
                  {form.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-[#6E655F]">
                  Synced: {formatDateTime(form.lastResponseSyncAt)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleSync(form.id);
                    }}
                    disabled={isSyncing}
                    className="p-1.5 rounded-md hover:bg-[#F4E2CA]/50 text-[#A3040F] font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    title="On-demand sync responses"
                  >
                    <RefreshCw className={cn('w-3.5 h-3.5', isSyncing && 'animate-spin')} />
                    <span className="text-[11px]">Sync</span>
                  </button>
                  <a
                    href={form.responderUri}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-1.5 rounded-md hover:bg-[#F4E2CA]/50 text-[#6E655F] hover:text-[#222222]"
                    title="View Responder URI"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual File-Upload Verification Checkpoint Banner if applicable */}
      {needsVerification && (
        <GoogleFormVerificationBanner
          formId={activeForm.id}
          editUri={activeForm.editUri}
          onVerified={loadForms}
        />
      )}

      {/* Active Form Detail & Response Data Grid */}
      {activeForm && (
        <div className="bg-[#FFFDF8] border border-[#A3040F]/20 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#222222]">
                  {activeForm.title}
                </h2>
                <span className="text-[10px] font-mono bg-[#FCF8ED] border border-[#A3040F]/20 text-[#A3040F] px-2 py-0.5 rounded font-bold">
                  {activeForm.items.length} Questions
                </span>
              </div>
              <p className="text-xs text-[#6E655F] mt-0.5">
                Cached Google Responses · Sync on demand to avoid unnecessary quota exhaustion.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExportModalOpen(true)}
                className="px-3 py-1.5 rounded-lg border border-[#16A34A]/40 bg-[#16A34A]/10 text-[#16A34A] text-xs font-bold hover:bg-[#16A34A]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export to Google Sheets</span>
              </button>
            </div>
          </div>

          {/* Response Search Filter */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#6E655F] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search response values or emails..."
                value={searchResponse}
                onChange={e => setSearchResponse(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
              />
            </div>
            <div className="text-[11px] font-mono text-[#6E655F]">
              Showing {filteredResponses.length} cached responses
            </div>
          </div>

          {/* Response Data Grid */}
          <div className="border border-[#CBD5E1] rounded-xl overflow-x-auto bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FCF8ED] border-b border-[#CBD5E1] text-[#6E655F] font-mono text-[10px] uppercase">
                  <th className="p-3">Respondent</th>
                  <th className="p-3">Timestamp</th>
                  {activeForm.items.map(item => (
                    <th key={item.id} className="p-3 whitespace-nowrap">
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredResponses.map(resp => (
                  <tr key={resp.id} className="hover:bg-[#FCF8ED]/40 transition-colors">
                    <td className="p-3 font-semibold text-[#222222] font-mono">
                      {resp.respondentEmail}
                    </td>
                    <td className="p-3 font-mono text-[#6E655F] text-[11px] whitespace-nowrap">
                      {formatDateTime(resp.submittedAt)}
                    </td>
                    {activeForm.items.map(item => {
                      const ans = resp.answers[item.title] || '—';
                      const isUrl = ans.startsWith('http');
                      return (
                        <td key={item.id} className="p-3 max-w-xs truncate">
                          {isUrl ? (
                            <a
                              href={ans}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#A3040F] underline flex items-center gap-1 font-mono text-[11px]"
                            >
                              <span>View File</span> <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[#222222]">{ans}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredResponses.length === 0 && (
              <div className="py-10 text-center text-xs text-[#6E655F]">
                No responses recorded or matching your filter. Click "Sync" to pull latest records.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sheets Export Modal */}
      {activeForm && (
        <SheetExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          formId={activeForm.id}
          formTitle={activeForm.title}
        />
      )}
    </div>
  );
}
