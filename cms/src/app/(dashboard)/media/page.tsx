'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { MediaAsset, MediaCategory, MediaAspectRatio } from '../../../lib/types';
import { LiveImpactRibbon } from '../../../components/layout/LiveImpactRibbon';
import { MediaUploader } from '../../../components/media/MediaUploader';
import {
  FolderArchive,
  Search,
  Upload,
  Copy,
  Check,
  Trash2,
  Lock,
  ExternalLink,
  Film,
  FileText,
  Sparkles,
} from 'lucide-react';
import { formatBytes, formatDate } from '../../../lib/utils';

export default function MediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [aspectFilter, setAspectFilter] = useState<string>('all');
  const [showUploader, setShowUploader] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadAssets = () => {
    apiClient.getMediaAssets().then(setAssets);
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.cdnUrl);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (asset.referenceCount > 0) {
      alert(`Cannot delete asset: It is actively referenced in ${asset.references.join(', ')}.`);
      return;
    }
    if (confirm(`Permanently delete ${asset.name}?`)) {
      await apiClient.deleteMediaAsset(asset.id);
      loadAssets();
    }
  };

  const filtered = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    const matchesAspect = aspectFilter === 'all' || asset.aspectRatio === aspectFilter;
    return matchesSearch && matchesCategory && matchesAspect;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#222222] tracking-tight font-sans">
            Central Reusable Media Library
          </h1>
          <p className="text-xs text-[#6E655F]">
            Direct Cloudflare R2 presigned storage, strict aspect ratio calibration, and live reference protection.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowUploader(!showUploader)}
          className="px-4 py-2 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>{showUploader ? 'Hide Uploader' : '+ Direct R2 Presigned Upload'}</span>
        </button>
      </div>

      <LiveImpactRibbon
        targetSection="All Public Website Pages & Social Asset Distribution"
        description="Every uploaded image/video features live reference tracking preventing broken links on the public website."
      />

      {/* Embedded Uploader when open */}
      {showUploader && (
        <div className="bg-[#FFFDF8] p-4 rounded-2xl border border-[#A3040F]/20 shadow-xs mb-4">
          <MediaUploader
            purpose="general"
            onUploadSuccess={newAsset => {
              setAssets(prev => [newAsset, ...prev]);
              setShowUploader(false);
            }}
          />
        </div>
      )}

      {/* Filter Strip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#FFFDF8] p-3 rounded-xl border border-[#A3040F]/15">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#6E655F] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by file name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto text-xs pb-1 md:pb-0">
          {['all', 'Images', 'Videos', 'Brand Assets', 'Documents'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#A3040F] text-white font-bold'
                  : 'bg-[#FCF8ED] border border-[#CBD5E1] text-[#222222]'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Aspect Ratio Filters */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="text-[#6E655F] hidden lg:inline">Ratio:</span>
          {['all', '16:9', '4:3', '1:1', '3:4', '9:16'].map(ratio => (
            <button
              key={ratio}
              type="button"
              onClick={() => setAspectFilter(ratio)}
              className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                aspectFilter === ratio
                  ? 'bg-[#222222] text-white border-[#222222]'
                  : 'bg-white text-[#6E655F] border-[#CBD5E1]'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(asset => (
          <div
            key={asset.id}
            className="bg-[#FFFDF8] border border-[#A3040F]/15 hover:border-[#A3040F] rounded-xl overflow-hidden shadow-xs flex flex-col justify-between transition-all group"
          >
            <div>
              {/* Asset Preview Box */}
              <div className="h-44 bg-[#F4E2CA]/50 relative overflow-hidden flex items-center justify-center">
                {asset.mimeType.startsWith('video/') ? (
                  <div className="flex flex-col items-center gap-2 text-[#A3040F]">
                    <Film className="w-10 h-10 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase">Video Asset (MP4/WebM)</span>
                  </div>
                ) : asset.mimeType === 'image/svg+xml' ? (
                  <div className="p-6 flex items-center justify-center">
                    <img src={asset.cdnUrl} alt={asset.name} className="max-h-24 max-w-full object-contain" />
                  </div>
                ) : (
                  <img
                    src={asset.cdnUrl}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                {/* Aspect Badge */}
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/65 text-white font-mono text-[9px] font-bold">
                  {asset.aspectRatio}
                </span>

                {/* Reference Count Badge */}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-white/90 text-[#222222] border border-[#CBD5E1] font-mono text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  {asset.referenceCount > 0 ? (
                    <>
                      <Lock className="w-3 h-3 text-[#16A34A]" />
                      <span>{asset.referenceCount} References</span>
                    </>
                  ) : (
                    <span>0 References</span>
                  )}
                </span>
              </div>

              {/* Metadata */}
              <div className="p-4 space-y-2">
                <h4 className="text-xs font-bold text-[#222222] truncate" title={asset.name}>
                  {asset.name}
                </h4>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#6E655F]">
                  <span>{formatBytes(asset.sizeBytes)}</span>
                  <span>{formatDate(asset.uploadedAt)}</span>
                </div>

                {/* Active references note */}
                {asset.references.length > 0 && (
                  <div className="bg-[#FCF8ED] p-2 rounded-lg border border-[#E2E8F0] text-[10px] text-[#6E655F]">
                    <span className="font-bold text-[#222222] block mb-0.5">Used in:</span>
                    <ul className="list-disc list-inside space-y-0.5 truncate">
                      {asset.references.map((ref, idx) => (
                        <li key={idx} className="truncate">{ref}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs bg-[#FAF7F2]">
              <button
                type="button"
                onClick={() => handleCopyUrl(asset)}
                className="flex items-center gap-1 text-[#A3040F] font-bold hover:underline cursor-pointer"
              >
                {copiedId === asset.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span className="text-[#16A34A]">CDN Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy CDN URL</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <a
                  href={asset.cdnUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded text-[#6E655F] hover:text-[#222222]"
                  title="Open asset"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(asset)}
                  className="p-1 rounded text-[#6E655F] hover:text-[#991B1B] cursor-pointer"
                  title={asset.referenceCount > 0 ? 'Protected by live references' : 'Delete asset'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
