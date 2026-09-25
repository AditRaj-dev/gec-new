'use client';

import React, { useState, useEffect } from 'react';
import { MediaAsset, MediaCategory } from '../../lib/types';
import { apiClient } from '../../lib/api-client';
import { MediaUploader } from './MediaUploader';
import { X, Search, Check, FolderArchive, Plus } from 'lucide-react';
import { formatBytes } from '../../lib/utils';

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (cdnUrl: string, asset: MediaAsset) => void;
  allowedCategories?: MediaCategory[];
  title?: string;
}

export function AssetPickerModal({
  isOpen,
  onClose,
  onSelect,
  allowedCategories,
  title = 'Select Media Asset',
}: AssetPickerModalProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiClient.getMediaAssets().then(setAssets);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesAllowed = !allowedCategories || allowedCategories.includes(a.category);
    return matchesSearch && matchesCategory && matchesAllowed;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] w-full max-w-3xl max-h-[85vh] rounded-2xl border border-[#A3040F]/20 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="h-14 px-5 bg-[#FCF8ED] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FolderArchive className="w-4 h-4 text-[#A3040F]" />
            <h3 className="text-sm font-bold text-[#222222] font-sans">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="px-2.5 py-1 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showUploader ? 'Browse Library' : 'Upload New'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-black/5 text-[#6E655F] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {showUploader ? (
            <MediaUploader
              onUploadSuccess={asset => {
                setAssets(prev => [asset, ...prev]);
                setShowUploader(false);
              }}
            />
          ) : (
            <>
              {/* Filter Strip */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#6E655F] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search assets by file name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
                  />
                </div>
                <div className="flex items-center gap-1 text-xs overflow-x-auto w-full sm:w-auto">
                  {['all', 'Images', 'Videos', 'Brand Assets', 'Documents'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#A3040F] text-white font-bold'
                          : 'bg-[#FCF8ED] border border-[#CBD5E1] text-[#222222] hover:bg-[#F4E2CA]/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredAssets.map(asset => (
                  <div
                    key={asset.id}
                    onClick={() => {
                      onSelect(asset.cdnUrl, asset);
                      onClose();
                    }}
                    className="group relative border border-[#E2E8F0] rounded-xl overflow-hidden bg-white hover:border-[#A3040F] hover:shadow-md transition-all cursor-pointer flex flex-col"
                  >
                    <div className="h-28 bg-[#F4E2CA]/40 flex items-center justify-center overflow-hidden relative">
                      {asset.mimeType.startsWith('video/') ? (
                        <div className="flex flex-col items-center gap-1 text-[#A3040F]">
                          <FolderArchive className="w-8 h-8" />
                          <span className="text-[10px] font-mono font-bold uppercase">Video Poster</span>
                        </div>
                      ) : (
                        <img
                          src={asset.cdnUrl}
                          alt={asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      )}
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white font-mono text-[9px]">
                        {asset.aspectRatio}
                      </span>
                    </div>
                    <div className="p-2 flex-1 flex flex-col justify-between">
                      <p className="text-xs font-semibold text-[#222222] truncate" title={asset.name}>
                        {asset.name}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#6E655F] mt-1">
                        <span>{formatBytes(asset.sizeBytes)}</span>
                        <span className="text-[#A3040F] font-bold group-hover:underline flex items-center gap-0.5">
                          Select <Check className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAssets.length === 0 && (
                <div className="py-12 text-center text-xs text-[#6E655F]">
                  No media assets matched your search.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
