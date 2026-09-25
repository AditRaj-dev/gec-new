'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { HeroSpotlight, HeroPriority, HeroGroundLifecycle, HeroPublishStatus } from '../../../lib/types';
import { LiveImpactRibbon } from '../../../components/layout/LiveImpactRibbon';
import { AssetPickerModal } from '../../../components/media/AssetPickerModal';
import {
  Sparkles,
  Play,
  Calendar,
  Layers,
  Inbox,
  BookOpen,
  FileSpreadsheet,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { formatDateTime } from '../../../lib/utils';

export default function DashboardPage() {
  const [hero, setHero] = useState<HeroSpotlight | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'evergreen'>('desktop');

  // Asset picker modal states
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [assetTargetField, setAssetTargetField] = useState<keyof HeroSpotlight>('desktopPoster');

  useEffect(() => {
    apiClient.getHeroSpotlight().then(setHero);
  }, []);

  if (!hero) {
    return (
      <div className="py-20 text-center font-mono text-xs text-[#6E655F]">
        Loading GEC Command Center & Hero Spotlight...
      </div>
    );
  }

  const handleFieldChange = (field: keyof HeroSpotlight, value: any) => {
    setHero(prev => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async (publish = false) => {
    if (!hero) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      if (publish) {
        const updated = await apiClient.updateHeroSpotlight({
          ...hero,
          publishStatus: 'Live',
        });
        setHero(updated);
      } else {
        const updated = await apiClient.updateHeroSpotlight(hero);
        setHero(updated);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const openAssetPicker = (field: keyof HeroSpotlight) => {
    setAssetTargetField(field);
    setAssetModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#222222] tracking-tight font-sans">
            Editorial Command Center
          </h1>
          <p className="text-xs text-[#6E655F]">
            Operational overview, live telemetry, and Homepage Dynamic Hero Spotlight gating.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F4E2CA]/40 text-xs font-semibold text-[#222222] transition-colors cursor-pointer disabled:opacity-50"
          >
            Save Changes
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FBCA05]" />
            <span>Publish to Live Hero</span>
          </button>
        </div>
      </div>

      {/* Live Impact Ribbon */}
      <LiveImpactRibbon
        targetSection="Page 01 §1.1 Dynamic Hero Spotlight"
        description="Controls the primary campaign billboard, urgency badge, background video/posters, and CTAs on the public homepage."
      />

      {saveSuccess && (
        <div className="p-3 bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-xl text-xs text-[#16A34A] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Hero Spotlight published and synchronized to CDN cache.</span>
        </div>
      )}

      {/* 4 Metric Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#6E655F] font-bold">Active Programs</span>
            <div className="w-7 h-7 rounded-md bg-[#A3040F]/10 text-[#A3040F] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#222222] mt-2">3</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-1">SDP Cohort 04 accepting pitches</p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#6E655F] font-bold">Pending Triage</span>
            <div className="w-7 h-7 rounded-md bg-[#D97706]/10 text-[#D97706] flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#222222] mt-2">3</p>
          <p className="text-[11px] text-[#D97706] font-semibold mt-1">Unread cohort applications</p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#6E655F] font-bold">Published Stories</span>
            <div className="w-7 h-7 rounded-md bg-[#1F7EC0]/10 text-[#1F7EC0] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#222222] mt-2">4</p>
          <p className="text-[11px] text-[#6E655F] mt-1">1 in review for publication</p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#6E655F] font-bold">Forms & Sync</span>
            <div className="w-7 h-7 rounded-md bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#222222] mt-2">206</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-1">Responses synchronized</p>
        </div>
      </div>

      {/* Main Section: Hero Spotlight Editorial Command */}
      <div className="bg-[#FFFDF8] border border-[#A3040F]/20 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#222222]">
                Dynamic Hero Spotlight Billboard
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30">
                {hero.publishStatus}
              </span>
            </div>
            <p className="text-xs text-[#6E655F] mt-0.5">
              Strictly decoupled semantic DOM text with 16:9 desktop and 9:16 vertical video poster staging.
            </p>
          </div>

          {/* Preview Modes Switcher */}
          <div className="flex items-center gap-1 bg-[#FCF8ED] p-1 rounded-lg border border-[#CBD5E1]">
            <button
              type="button"
              onClick={() => setPreviewMode('desktop')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                previewMode === 'desktop' ? 'bg-[#A3040F] text-white' : 'text-[#6E655F] hover:text-[#222222]'
              }`}
            >
              Desktop 16:9
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('mobile')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                previewMode === 'mobile' ? 'bg-[#A3040F] text-white' : 'text-[#6E655F] hover:text-[#222222]'
              }`}
            >
              Mobile 9:16
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('evergreen')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                previewMode === 'evergreen' ? 'bg-[#A3040F] text-white' : 'text-[#6E655F] hover:text-[#222222]'
              }`}
            >
              Evergreen Fallback
            </button>
          </div>
        </div>

        {/* Live Interactive Preview Box */}
        <div className="border border-[#A3040F]/30 rounded-xl overflow-hidden bg-[#FCF8ED] relative shadow-inner">
          <div className="p-2.5 bg-[#F4E2CA] border-b border-[#A3040F]/15 flex items-center justify-between text-[11px] font-mono">
            <span className="font-bold text-[#A3040F] flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              LIVE PREVIEW: {previewMode.toUpperCase()} VIEWPORT
            </span>
            <span className="text-[#6E655F]">
              Priority: <strong className="text-[#A3040F]">{hero.priority}</strong> · State: <strong className="text-[#222222]">{hero.status}</strong>
            </span>
          </div>

          {previewMode === 'desktop' && (
            <div className="p-6 sm:p-10 relative overflow-hidden min-h-[300px] flex flex-col justify-center">
              {/* Background Poster/Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={hero.desktopPoster}
                  alt="Hero Poster"
                  className="w-full h-full object-cover opacity-20 filter blur-xs"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FCF8ED] via-[#FCF8ED]/90 to-transparent" />
              </div>

              {/* Text Overlays */}
              <div className="relative z-10 max-w-2xl space-y-3">
                <span className="inline-block text-[11px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded bg-[#A3040F] text-[#FFFDF8]">
                  {hero.eyebrowBadge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#A3040F] leading-tight font-sans">
                  {hero.headline}
                </h3>
                <p className="text-xs sm:text-sm text-[#222222] font-medium leading-relaxed max-w-xl">
                  {hero.supportingText}
                </p>
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <span className="px-4 py-2 rounded-lg bg-[#A3040F] text-white text-xs font-bold shadow-xs inline-flex items-center gap-1">
                    {hero.primaryCtaText} <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                  {hero.secondaryCtaText && (
                    <span className="px-4 py-2 rounded-lg border border-[#A3040F] text-[#A3040F] bg-white/70 text-xs font-bold inline-flex items-center gap-1">
                      {hero.secondaryCtaText}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {previewMode === 'mobile' && (
            <div className="p-6 flex justify-center bg-black/5">
              <div className="w-72 bg-[#FCF8ED] border-4 border-[#222222] rounded-3xl p-4 shadow-xl space-y-3">
                <span className="inline-block text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#A3040F] text-white">
                  {hero.eyebrowBadge}
                </span>
                <h3 className="text-lg font-black text-[#A3040F] leading-tight">
                  {hero.headline}
                </h3>
                <div className="h-32 rounded-xl overflow-hidden bg-black/10 border border-[#CBD5E1]">
                  <img
                    src={hero.mobilePoster}
                    alt="Mobile Poster"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] text-[#222222] leading-snug">
                  {hero.supportingText}
                </p>
                <div className="w-full py-2 rounded-lg bg-[#A3040F] text-white text-xs font-bold text-center">
                  {hero.primaryCtaText}
                </div>
              </div>
            </div>
          )}

          {previewMode === 'evergreen' && (
            <div className="p-8 text-center space-y-3 bg-[#FCF8ED]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6E655F]">
                EVERGREEN BRAND STATE (FALLBACK)
              </span>
              <h3 className="text-3xl font-black text-[#A3040F]">
                IDEAS BEGIN HERE. <span className="text-[#222222]">BUILDERS GROW HERE.</span>
              </h3>
              <p className="text-xs text-[#6E655F] max-w-md mx-auto">
                Innovate. Inspire. Impact. Northern India’s student startup nerve center.
              </p>
              <div className="pt-2">
                <span className="px-4 py-2 rounded-lg bg-[#A3040F] text-white text-xs font-bold inline-flex items-center gap-1">
                  Explore GEC Programs <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Configuration Form: 16 Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Priority Gating (P0-P2) */}
          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Priority Gating
            </label>
            <select
              value={hero.priority}
              onChange={e => handleFieldChange('priority', e.target.value as HeroPriority)}
              className="w-full p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
            >
              <option value="P0">P0 — Critical / Institutional Announcement</option>
              <option value="P1">P1 — Flagship GEC Initiative (SDP Cohorts)</option>
              <option value="P2">P2 — Major Event / Application Window (Ideathon/Summit)</option>
            </select>
            <p className="text-[10px] text-[#6E655F] mt-1 font-mono">
              Note: P3-P5 items automatically route to "What's Happening" section.
            </p>
          </div>

          {/* Ground Execution Lifecycle */}
          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Ground-Execution Lifecycle State
            </label>
            <select
              value={hero.status}
              onChange={e => handleFieldChange('status', e.target.value as HeroGroundLifecycle)}
              className="w-full p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
            >
              <option value="Announcement">Announcement</option>
              <option value="Applications Open">Applications Open</option>
              <option value="Registrations Growing">Registrations Growing</option>
              <option value="Urgency / Deadline">Urgency / Deadline (48h left)</option>
              <option value="Live">Live (Event day)</option>
              <option value="Completed">Completed</option>
              <option value="Results / Highlights">Results / Highlights</option>
              <option value="Stories">Stories / Founder Winner</option>
            </select>
          </div>

          {/* Campaign Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Internal Campaign Name
            </label>
            <input
              type="text"
              value={hero.campaignName}
              onChange={e => handleFieldChange('campaignName', e.target.value)}
              className="w-full p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
            />
          </div>

          {/* Eyebrow Badge */}
          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Eyebrow / Badge Text
            </label>
            <input
              type="text"
              value={hero.eyebrowBadge}
              onChange={e => handleFieldChange('eyebrowBadge', e.target.value)}
              placeholder="e.g. APPLICATIONS OPEN · COHORT 04"
              className="w-full p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
            />
          </div>

          {/* Fallback Behavior */}
          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Expiration Fallback Behavior
            </label>
            <select
              value={hero.fallbackBehavior}
              onChange={e => handleFieldChange('fallbackBehavior', e.target.value)}
              className="w-full p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
            >
              <option value="evergreen_brand">Evergreen GEC Brand Hero ("Ideas Begin Here")</option>
              <option value="next_priority">Next Eligible High-Priority Campaign</option>
            </select>
          </div>

          {/* Headline */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Headline (Rendered in live DOM text, max 2 rows)
            </label>
            <input
              type="text"
              value={hero.headline}
              onChange={e => handleFieldChange('headline', e.target.value)}
              className="w-full p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222] font-bold"
            />
          </div>

          {/* Supporting Text */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Supporting Text (Max 68 characters per line)
            </label>
            <textarea
              rows={2}
              value={hero.supportingText}
              onChange={e => handleFieldChange('supportingText', e.target.value)}
              className="w-full p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
            />
          </div>

          {/* Video & Poster Assets */}
          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Desktop Video (16:9 WebM/MP4)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hero.desktopVideo}
                onChange={e => handleFieldChange('desktopVideo', e.target.value)}
                className="flex-1 p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
              />
              <button
                type="button"
                onClick={() => openAssetPicker('desktopVideo')}
                className="px-2.5 py-1.5 rounded-lg bg-[#FCF8ED] border border-[#A3040F]/30 text-xs font-semibold text-[#A3040F] hover:bg-[#F4E2CA]/50 cursor-pointer"
              >
                Browse
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Desktop Static Poster (16:9 Image)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hero.desktopPoster}
                onChange={e => handleFieldChange('desktopPoster', e.target.value)}
                className="flex-1 p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
              />
              <button
                type="button"
                onClick={() => openAssetPicker('desktopPoster')}
                className="px-2.5 py-1.5 rounded-lg bg-[#FCF8ED] border border-[#A3040F]/30 text-xs font-semibold text-[#A3040F] hover:bg-[#F4E2CA]/50 cursor-pointer"
              >
                Browse
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Mobile Video (9:16 Vertical)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hero.mobileVideo}
                onChange={e => handleFieldChange('mobileVideo', e.target.value)}
                className="flex-1 p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
              />
              <button
                type="button"
                onClick={() => openAssetPicker('mobileVideo')}
                className="px-2.5 py-1.5 rounded-lg bg-[#FCF8ED] border border-[#A3040F]/30 text-xs font-semibold text-[#A3040F] hover:bg-[#F4E2CA]/50 cursor-pointer"
              >
                Browse
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Mobile Static Poster (9:16 Image)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hero.mobilePoster}
                onChange={e => handleFieldChange('mobilePoster', e.target.value)}
                className="flex-1 p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
              />
              <button
                type="button"
                onClick={() => openAssetPicker('mobilePoster')}
                className="px-2.5 py-1.5 rounded-lg bg-[#FCF8ED] border border-[#A3040F]/30 text-xs font-semibold text-[#A3040F] hover:bg-[#F4E2CA]/50 cursor-pointer"
              >
                Browse
              </button>
            </div>
          </div>

          {/* Primary CTA */}
          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Primary CTA Button Label & Target Route
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Button Label"
                value={hero.primaryCtaText}
                onChange={e => handleFieldChange('primaryCtaText', e.target.value)}
                className="p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg"
              />
              <input
                type="text"
                placeholder="/initiatives/..."
                value={hero.primaryCtaUrl}
                onChange={e => handleFieldChange('primaryCtaUrl', e.target.value)}
                className="p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Secondary CTA */}
          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Secondary CTA (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Label"
                value={hero.secondaryCtaText || ''}
                onChange={e => handleFieldChange('secondaryCtaText', e.target.value)}
                className="p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg"
              />
              <input
                type="text"
                placeholder="/route"
                value={hero.secondaryCtaUrl || ''}
                onChange={e => handleFieldChange('secondaryCtaUrl', e.target.value)}
                className="p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Schedule Datetime */}
          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Publication Start Datetime
            </label>
            <input
              type="text"
              value={hero.startDatetime}
              onChange={e => handleFieldChange('startDatetime', e.target.value)}
              className="w-full p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">
              Automatic Expiration Datetime
            </label>
            <input
              type="text"
              value={hero.endDatetime}
              onChange={e => handleFieldChange('endDatetime', e.target.value)}
              className="w-full p-2 text-xs bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* Asset Picker Modal */}
      <AssetPickerModal
        isOpen={assetModalOpen}
        onClose={() => setAssetModalOpen(false)}
        onSelect={cdnUrl => handleFieldChange(assetTargetField, cdnUrl)}
        title={`Select Asset for ${String(assetTargetField)}`}
      />
    </div>
  );
}
