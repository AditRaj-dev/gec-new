'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Submission, SubmissionStatus, SubmissionFormType } from '../../../lib/types';
import { LiveImpactRibbon } from '../../../components/layout/LiveImpactRibbon';
import {
  Inbox,
  Search,
  Download,
  Eye,
  FileText,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { cn, formatDateTime, exportToCsv } from '../../../lib/utils';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [notesText, setNotesText] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadSubmissions = () => {
    apiClient.getSubmissions().then(setSubmissions);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleOpenDetail = (sub: Submission) => {
    setSelectedSub(sub);
    setNotesText(sub.notes || '');
  };

  const handleUpdateStatus = async (newStatus: SubmissionStatus) => {
    if (!selectedSub) return;
    setUpdating(true);
    try {
      const updated = await apiClient.updateSubmissionStatus(selectedSub.id, newStatus, notesText);
      setSelectedSub(updated);
      loadSubmissions();
    } finally {
      setUpdating(false);
    }
  };

  const handleExportCsv = () => {
    const exportRows = filtered.map(s => ({
      ID: s.id,
      FormType: s.formType,
      Applicant: s.applicantName,
      Email: s.applicantEmail,
      Phone: s.applicantPhone,
      Target: s.initiativeTarget || s.teamTarget || 'General',
      Status: s.status,
      SubmittedAt: s.submittedAt,
      Notes: s.notes || '',
    }));
    exportToCsv(`gec_submissions_export_${new Date().toISOString().split('T')[0]}`, exportRows);
  };

  const filtered = submissions.filter(sub => {
    const matchesSearch =
      sub.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      sub.applicantEmail.toLowerCase().includes(search.toLowerCase()) ||
      (sub.initiativeTarget && sub.initiativeTarget.toLowerCase().includes(search.toLowerCase())) ||
      (sub.teamTarget && sub.teamTarget.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || sub.formType === typeFilter;
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#222222] tracking-tight font-sans">
            Submissions Central Inbox
          </h1>
          <p className="text-xs text-[#6E655F]">
            Consolidated intake pipeline across Initiative applications, team recruitment, and startup pitches.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-lg bg-[#FFFDF8] border border-[#CBD5E1] hover:bg-[#F4E2CA]/40 text-xs font-bold text-[#222222] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#A3040F]" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      <LiveImpactRibbon
        targetSection="Public Forms Intake & Offline Committee Review"
        description="Receives cohort applications, pitches, and recruitment data with status progression triggers."
      />

      {/* Filter Strip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#FFFDF8] p-3 rounded-xl border border-[#A3040F]/15">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#6E655F] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by applicant, email, or program..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="p-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
          >
            <option value="all">All Form Types</option>
            <option value="Initiative Application">Initiative Applications</option>
            <option value="Join Team Application">Join Team Applications</option>
            <option value="Startup Pitch">Startup Pitches</option>
            <option value="Event Registration">Event Registrations</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="p-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Submissions Data Table */}
      <div className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#FCF8ED] text-[#6E655F] font-mono text-[10px] uppercase">
                <th className="p-3">Applicant Details</th>
                <th className="p-3">Form Type & Target</th>
                <th className="p-3">Submitted At</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map(sub => (
                <tr key={sub.id} className="hover:bg-[#FCF8ED]/50 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-[#222222]">{sub.applicantName}</p>
                    <p className="text-[11px] text-[#6E655F] font-mono">{sub.applicantEmail}</p>
                    <p className="text-[10px] text-[#6E655F]">{sub.applicantPhone}</p>
                  </td>
                  <td className="p-3">
                    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4E2CA] text-[#222222] font-semibold mb-0.5">
                      {sub.formType}
                    </span>
                    <p className="text-xs font-medium text-[#A3040F] truncate max-w-xs">
                      {sub.initiativeTarget || sub.teamTarget || 'General'}
                    </p>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-[#6E655F]">
                    {formatDateTime(sub.submittedAt)}
                  </td>
                  <td className="p-3">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase',
                        sub.status === 'New' && 'bg-[#A3040F]/15 text-[#A3040F]',
                        sub.status === 'Shortlisted' && 'bg-[#16A34A]/20 text-[#16A34A]',
                        sub.status === 'Reviewed' && 'bg-[#1F7EC0]/15 text-[#1F7EC0]',
                        sub.status === 'Rejected' && 'bg-red-100 text-red-700'
                      )}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(sub)}
                      className="px-2.5 py-1 rounded-lg bg-[#FCF8ED] hover:bg-[#F4E2CA] border border-[#CBD5E1] text-xs font-bold text-[#222222] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#A3040F]" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-[#6E655F]">
            No submissions matched your search criteria.
          </div>
        )}
      </div>

      {/* Submission Review Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] w-full max-w-2xl max-h-[90vh] rounded-2xl border border-[#A3040F]/20 p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 shrink-0">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#F4E2CA] text-[#A3040F]">
                  {selectedSub.formType}
                </span>
                <h3 className="text-base font-bold text-[#222222] mt-1">
                  {selectedSub.applicantName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="text-[#6E655F] hover:text-[#222222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-[#FCF8ED] rounded-xl border border-[#CBD5E1]">
                <div>
                  <span className="text-[10px] font-mono text-[#6E655F] uppercase">Email</span>
                  <p className="font-semibold text-[#222222] font-mono truncate">{selectedSub.applicantEmail}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6E655F] uppercase">Phone</span>
                  <p className="font-semibold text-[#222222] font-mono">{selectedSub.applicantPhone}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6E655F] uppercase">Target Entity</span>
                  <p className="font-semibold text-[#A3040F] truncate">
                    {selectedSub.initiativeTarget || selectedSub.teamTarget || 'General'}
                  </p>
                </div>
              </div>

              {/* Attachment if present */}
              {selectedSub.attachmentUrl && (
                <div className="p-3 bg-white border border-[#CBD5E1] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#A3040F]" />
                    <div>
                      <span className="font-bold text-[#222222]">Pitch Deck / Resume Attachment</span>
                      <p className="text-[10px] font-mono text-[#6E655F]">Stored in Private R2 Submissions Bucket</p>
                    </div>
                  </div>
                  <a
                    href={selectedSub.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#A3040F] text-white font-bold text-xs flex items-center gap-1 hover:bg-[#C62F29]"
                  >
                    <span>Download File</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Answers Breakdown */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-[#222222] uppercase tracking-wider font-mono text-[11px]">
                  Submitted Questionnaire Answers
                </h4>
                <div className="space-y-2">
                  {Object.entries(selectedSub.answers).map(([key, val]) => (
                    <div key={key} className="p-3 bg-white border border-[#CBD5E1] rounded-xl space-y-1">
                      <span className="font-bold text-[#6E655F] text-[11px] block">{key}</span>
                      <p className="text-xs text-[#222222] whitespace-pre-wrap leading-relaxed">
                        {val}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluation Notes & Status Transition */}
              <div className="p-3.5 bg-[#FFFBEB] border border-[#D97706]/30 rounded-xl space-y-2.5">
                <h4 className="font-bold text-[#92400E] uppercase tracking-wider font-mono text-[11px]">
                  Evaluation Pipeline & Notes
                </h4>
                <textarea
                  rows={2}
                  value={notesText}
                  onChange={e => setNotesText(e.target.value)}
                  placeholder="Add private committee evaluation notes..."
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
                />
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="font-semibold text-[#92400E]">Transition Status:</span>
                  {(['New', 'Reviewed', 'Shortlisted', 'Interview', 'Rejected'] as SubmissionStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      disabled={updating}
                      onClick={() => handleUpdateStatus(st)}
                      className={cn(
                        'px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer',
                        selectedSub.status === st
                          ? 'bg-[#A3040F] text-white'
                          : 'bg-white border border-[#CBD5E1] text-[#222222] hover:bg-[#F4E2CA]'
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
