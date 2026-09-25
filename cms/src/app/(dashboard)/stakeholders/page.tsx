'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Partner, Speaker, Startup, Alumni } from '../../../lib/types';
import { LiveImpactRibbon } from '../../../components/layout/LiveImpactRibbon';
import {
  Briefcase,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Globe,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function StakeholdersPage() {
  const [activeTab, setActiveTab] = useState<'startups' | 'partners' | 'speakers' | 'alumni'>('startups');
  const [data, setData] = useState<{
    partners: Partner[];
    speakers: Speaker[];
    startups: Startup[];
    alumni: Alumni[];
  }>({
    partners: [],
    speakers: [],
    startups: [],
    alumni: [],
  });
  const [search, setSearch] = useState('');
  const [modalType, setModalType] = useState<'startup' | 'partner' | 'speaker' | null>(null);

  // Form states
  const [startupForm, setStartupForm] = useState<Partial<Startup>>({
    name: '',
    pitch: '',
    founders: [''],
    cohortYear: '2026',
    sector: 'Tech',
    stage: 'Incubated',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80',
    websiteUrl: '',
    featured: true,
  });

  const [partnerForm, setPartnerForm] = useState<Partial<Partner>>({
    name: '',
    category: 'Incubation',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    websiteUrl: '',
    featuredOnHome: true,
    orderRank: 1,
  });

  const [speakerForm, setSpeakerForm] = useState<Partial<Speaker>>({
    name: '',
    designation: '',
    company: '',
    eventName: 'Annual E-Summit 2026',
    portraitUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    socialUrl: '',
    featuredOnHome: true,
  });

  const loadData = () => {
    apiClient.getStakeholders().then(setData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startupForm.name) return;
    await apiClient.createStartup(startupForm as any);
    setModalType(null);
    loadData();
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name) return;
    await apiClient.createPartner(partnerForm as any);
    setModalType(null);
    loadData();
  };

  const handleAddSpeaker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!speakerForm.name) return;
    await apiClient.createSpeaker(speakerForm as any);
    setModalType(null);
    loadData();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#222222] tracking-tight font-sans">
            Stakeholders & Ecosystem Directory
          </h1>
          <p className="text-xs text-[#6E655F]">
            Incubated Startups, Ecosystem Partner Logos, Guest Keynote Speakers, and Alumni Founders.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (activeTab === 'startups') setModalType('startup');
            else if (activeTab === 'partners') setModalType('partner');
            else if (activeTab === 'speakers') setModalType('speaker');
          }}
          className="px-4 py-2 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add to {activeTab.toUpperCase()}</span>
        </button>
      </div>

      <LiveImpactRibbon
        targetSection="Page 01 §1.5 Speakers, §1.7 Ecosystem Logos, and Page 05 §5.4 Startup Portfolio"
        description="Controls partner brand logos, speaker portrait cards, and active student startup portfolio listings."
      />

      {/* Tabs Strip */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('startups')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'startups' ? 'bg-[#A3040F] text-white' : 'bg-[#FCF8ED] text-[#6E655F] hover:text-[#222222]'
          }`}
        >
          Campus Startups ({data.startups.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('partners')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'partners' ? 'bg-[#A3040F] text-white' : 'bg-[#FCF8ED] text-[#6E655F] hover:text-[#222222]'
          }`}
        >
          Ecosystem Partners ({data.partners.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('speakers')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'speakers' ? 'bg-[#A3040F] text-white' : 'bg-[#FCF8ED] text-[#6E655F] hover:text-[#222222]'
          }`}
        >
          Guest Speakers ({data.speakers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('alumni')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'alumni' ? 'bg-[#A3040F] text-white' : 'bg-[#FCF8ED] text-[#6E655F] hover:text-[#222222]'
          }`}
        >
          Alumni Network ({data.alumni.length})
        </button>
      </div>

      {/* Tab 1: Startups Portfolio */}
      {activeTab === 'startups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.startups.map(startup => (
            <div
              key={startup.id}
              className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#FCF8ED] border border-[#A3040F]/20 text-[#A3040F]">
                    {startup.stage} · {startup.sector}
                  </span>
                  {startup.featured && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FBCA05]/20 text-[#A16207]">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#CBD5E1] p-1 shrink-0">
                    <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#222222] truncate">{startup.name}</h3>
                    <p className="text-[11px] text-[#6E655F]">Cohort of {startup.cohortYear}</p>
                  </div>
                </div>

                <p className="text-xs text-[#222222] mt-2.5 line-clamp-2">
                  {startup.pitch}
                </p>

                <p className="text-[11px] font-mono text-[#6E655F] mt-2">
                  Founders: <strong className="text-[#222222]">{startup.founders.join(', ')}</strong>
                </p>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                {startup.websiteUrl ? (
                  <a
                    href={startup.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#A3040F] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Website</span> <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[#6E655F] italic">In Stealth</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Ecosystem Partners */}
      {activeTab === 'partners' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.partners.map(partner => (
            <div
              key={partner.id}
              className="bg-[#FFFDF8] border border-[#CBD5E1] rounded-xl p-4 text-center space-y-2.5 shadow-xs"
            >
              <div className="h-14 flex items-center justify-center">
                <img src={partner.logoUrl} alt={partner.name} className="max-h-12 max-w-full object-contain" />
              </div>
              <h4 className="font-bold text-xs text-[#222222] truncate">{partner.name}</h4>
              <span className="inline-block text-[10px] font-mono text-[#6E655F] bg-[#FCF8ED] px-2 py-0.5 rounded">
                {partner.category}
              </span>
              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                <span className="text-[#16A34A] font-bold">
                  {partner.featuredOnHome ? 'On Home' : 'Catalog'}
                </span>
                <a
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#6E655F] hover:text-[#A3040F]"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Speakers */}
      {activeTab === 'speakers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.speakers.map(speaker => (
            <div
              key={speaker.id}
              className="bg-[#FFFDF8] border border-[#CBD5E1] rounded-xl p-4 flex items-center gap-3.5 shadow-xs"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-[#F4E2CA] shrink-0 border border-[#A3040F]/20">
                <img src={speaker.portraitUrl} alt={speaker.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-[#222222] truncate">{speaker.name}</h4>
                <p className="text-[11px] text-[#A3040F] font-semibold truncate">{speaker.designation}</p>
                <p className="text-[11px] text-[#6E655F] truncate">{speaker.company}</p>
                <span className="text-[10px] font-mono text-[#6E655F] block mt-0.5">
                  {speaker.eventName}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Alumni */}
      {activeTab === 'alumni' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.alumni.map(alm => (
            <div
              key={alm.id}
              className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-xl p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#F4E2CA] shrink-0">
                  <img src={alm.avatarUrl} alt={alm.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-[#222222]">{alm.name}</h4>
                  <p className="text-[11px] text-[#A3040F] font-semibold">
                    {alm.currentRole} · {alm.company}
                  </p>
                  <p className="text-[10px] font-mono text-[#6E655F]">Graduated {alm.graduationYear}</p>
                </div>
              </div>
              {alm.testimonial && (
                <p className="text-xs text-[#222222] italic bg-[#FCF8ED] p-2.5 rounded-lg border border-[#E2E8F0]">
                  "{alm.testimonial}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Startup */}
      {modalType === 'startup' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-2xl border border-[#A3040F]/20 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <h3 className="text-sm font-bold text-[#222222]">Add Startup to Portfolio</h3>
              <button onClick={() => setModalType(null)} className="text-[#6E655F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStartup} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#222222] mb-0.5">Startup Name *</label>
                <input
                  type="text"
                  required
                  value={startupForm.name}
                  onChange={e => setStartupForm({ ...startupForm, name: e.target.value })}
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#222222] mb-0.5">Sector</label>
                  <select
                    value={startupForm.sector}
                    onChange={e => setStartupForm({ ...startupForm, sector: e.target.value as any })}
                    className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                  >
                    {['Tech', 'Consumer', 'Health', 'Climate', 'SaaS', 'EdTech'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#222222] mb-0.5">Incubation Stage</label>
                  <select
                    value={startupForm.stage}
                    onChange={e => setStartupForm({ ...startupForm, stage: e.target.value as any })}
                    className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                  >
                    {['Idea Lab', 'Incubated', 'Bootstrapped', 'Seed', 'Alumni'].map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-[#222222] mb-0.5">One-Sentence Pitch</label>
                <textarea
                  rows={2}
                  value={startupForm.pitch}
                  onChange={e => setStartupForm({ ...startupForm, pitch: e.target.value })}
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-[#222222] mb-0.5">Founders (comma separated)</label>
                <input
                  type="text"
                  value={startupForm.founders?.join(', ')}
                  onChange={e => setStartupForm({ ...startupForm, founders: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#A3040F] hover:bg-[#C62F29] text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Save Startup
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Partner */}
      {modalType === 'partner' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-2xl border border-[#A3040F]/20 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <h3 className="text-sm font-bold text-[#222222]">Add Ecosystem Partner</h3>
              <button onClick={() => setModalType(null)} className="text-[#6E655F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPartner} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#222222] mb-0.5">Company / Partner Name *</label>
                <input
                  type="text"
                  required
                  value={partnerForm.name}
                  onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-[#222222] mb-0.5">Category</label>
                <select
                  value={partnerForm.category}
                  onChange={e => setPartnerForm({ ...partnerForm, category: e.target.value as any })}
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                >
                  {['Incubation', 'Media', 'Cloud', 'Funding', 'Corporate'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#222222] mb-0.5">Website URL</label>
                <input
                  type="text"
                  value={partnerForm.websiteUrl}
                  onChange={e => setPartnerForm({ ...partnerForm, websiteUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white font-mono text-[11px]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#A3040F] hover:bg-[#C62F29] text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Save Partner
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Speaker */}
      {modalType === 'speaker' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-2xl border border-[#A3040F]/20 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <h3 className="text-sm font-bold text-[#222222]">Add Guest Speaker</h3>
              <button onClick={() => setModalType(null)} className="text-[#6E655F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSpeaker} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#222222] mb-0.5">Speaker Name *</label>
                <input
                  type="text"
                  required
                  value={speakerForm.name}
                  onChange={e => setSpeakerForm({ ...speakerForm, name: e.target.value })}
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-[#222222] mb-0.5">Designation</label>
                <input
                  type="text"
                  value={speakerForm.designation}
                  onChange={e => setSpeakerForm({ ...speakerForm, designation: e.target.value })}
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-[#222222] mb-0.5">Company / Organization</label>
                <input
                  type="text"
                  value={speakerForm.company}
                  onChange={e => setSpeakerForm({ ...speakerForm, company: e.target.value })}
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#A3040F] hover:bg-[#C62F29] text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Save Speaker
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
