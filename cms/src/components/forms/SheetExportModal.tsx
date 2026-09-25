'use client';

import React, { useState } from 'react';
import { apiClient } from '../../lib/api-client';
import { FileSpreadsheet, X, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';

interface SheetExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
  formTitle: string;
}

export function SheetExportModal({
  isOpen,
  onClose,
  formId,
  formTitle,
}: SheetExportModalProps) {
  const [sheetName, setSheetName] = useState(`${formTitle} - Export ${new Date().toISOString().split('T')[0]}`);
  const [exporting, setExporting] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setExporting(true);
    try {
      const res = await apiClient.exportFormResponsesToSheet(formId, sheetName);
      setSheetUrl(res.sheetUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] w-full max-w-md rounded-2xl border border-[#A3040F]/20 p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#16A34A]" />
            <h3 className="text-sm font-bold text-[#222222]">Export to Google Sheets</h3>
          </div>
          <button onClick={onClose} className="text-[#6E655F] hover:text-[#222222]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sheetUrl ? (
          <div className="py-4 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-[#222222]">
              Responses exported to Google Sheets workbook successfully!
            </p>
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors"
            >
              <span>Open Google Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <form onSubmit={handleExport} className="space-y-3 text-xs">
            <p className="text-[#6E655F]">
              Operator-selected export creates or updates a Google Sheet in the automation account Drive.
            </p>
            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Target Sheet Workbook Title
              </label>
              <input
                type="text"
                required
                value={sheetName}
                onChange={e => setSheetName(e.target.value)}
                className="w-full p-2 border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222] bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={exporting}
              className="w-full py-2 px-4 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Sheet Export...</span>
                </>
              ) : (
                <span>Confirm & Generate Google Sheet</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
