'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Person, PeopleTier } from '../../../lib/types';
import { LiveImpactRibbon } from '../../../components/layout/LiveImpactRibbon';
import { AssetPickerModal } from '../../../components/media/AssetPickerModal';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  ExternalLink,
  Globe,
  Link2,
  Upload,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const tierLabels: Record<PeopleTier, string> = {
  leadership_tier_1: 'Tier 1 · Leadership',
  mentors_tier_2: 'Tier 2 · Mentors',
  team_heads_tier_3: 'Tier 3 · Team Heads',
  coordinators_tier_3: 'Tier 3 · Coordinators',
  members_tier_4: 'Tier 4 · Members',
  alumni_tier_4: 'Tier 4 · Alumni',
};

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<Person>>({
    fullName: '',
    designation: '',
    tier: 'leadership_tier_1',
    department: '',
    graduationYear: '2027',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    linkedinUrl: '',
    twitterUrl: '',
    githubUrl: '',
    bio: '',
    active: true,
  });

  const loadPeople = () => {
    apiClient.getPeople().then(setPeople);
  };

  useEffect(() => {
    loadPeople();
  }, []);

  const handleOpenAdd = () => {
    setEditingPerson(null);
    setFormData({
      fullName: '',
      designation: '',
      tier: 'leadership_tier_1',
      department: 'B.Tech Computer Science',
      graduationYear: '2027',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      linkedinUrl: '',
      twitterUrl: '',
      githubUrl: '',
      bio: '',
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (person: Person) => {
    setEditingPerson(person);
    setFormData(person);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.designation) return;

    if (editingPerson) {
      await apiClient.updatePerson(editingPerson.id, formData);
    } else {
      await apiClient.createPerson(formData as any);
    }
    setModalOpen(false);
    loadPeople();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this person?')) {
      await apiClient.deletePerson(id);
      loadPeople();
    }
  };

  const filteredPeople = people.filter(p => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.designation.toLowerCase().includes(search.toLowerCase()) ||
      (p.department && p.department.toLowerCase().includes(search.toLowerCase()));
    const matchesTier = selectedTier === 'all' || p.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#222222] tracking-tight font-sans">
            People & Leadership Roster
          </h1>
          <p className="text-xs text-[#6E655F]">
            Manage Tier 1 office-bearers, GICRISE mentors, team heads, coordinators, members, and alumni.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      <LiveImpactRibbon
        targetSection="Page 02 §2.5 Leadership & Page 03 §3.3 Team Roster"
        description="Updates leadership cards, mentor advisory directories, and team head profiles on the public website."
      />

      {/* Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFDF8] p-3 rounded-xl border border-[#A3040F]/15">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6E655F] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, role, or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] text-[#222222]"
          />
        </div>

        {/* Tier Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedTier('all')}
            className={`px-3 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedTier === 'all'
                ? 'bg-[#A3040F] text-white font-bold'
                : 'bg-[#FCF8ED] border border-[#CBD5E1] text-[#222222]'
            }`}
          >
            All ({people.length})
          </button>
          {Object.entries(tierLabels).map(([tierKey, label]) => (
            <button
              key={tierKey}
              type="button"
              onClick={() => setSelectedTier(tierKey)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedTier === tierKey
                  ? 'bg-[#A3040F] text-white font-bold'
                  : 'bg-[#FCF8ED] border border-[#CBD5E1] text-[#222222]'
              }`}
            >
              {label.replace('Tier ', 'T')}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPeople.map(person => (
          <div
            key={person.id}
            className="bg-[#FFFDF8] border border-[#A3040F]/15 hover:border-[#A3040F] rounded-xl p-4 shadow-xs flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-start gap-3.5">
                {/* 3:4 portrait thumbnail */}
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#F4E2CA] shrink-0 border border-[#A3040F]/20 relative shadow-xs">
                  <img
                    src={person.avatarUrl}
                    alt={person.fullName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white font-mono text-[8px] text-center">
                    3:4
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#FCF8ED] border border-[#A3040F]/20 text-[#A3040F] block w-fit truncate">
                    {tierLabels[person.tier]}
                  </span>
                  <h3 className="text-sm font-bold text-[#222222] truncate mt-1 group-hover:text-[#A3040F] transition-colors">
                    {person.fullName}
                  </h3>
                  <p className="text-xs text-[#A3040F] font-semibold leading-tight line-clamp-1 mt-0.5">
                    {person.designation}
                  </p>
                  <p className="text-[11px] text-[#6E655F] truncate mt-0.5">
                    {person.department} {person.graduationYear && `· '${person.graduationYear}`}
                  </p>
                </div>
              </div>

              {person.bio && (
                <p className="text-xs text-[#222222] line-clamp-2 mt-3 bg-[#FCF8ED]/60 p-2 rounded-lg border border-[#E2E8F0]">
                  {person.bio}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {person.linkedinUrl && (
                  <a
                    href={person.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6E655F] hover:text-[#1F7EC0]"
                    title="LinkedIn Profile"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </a>
                )}
                {person.twitterUrl && (
                  <a
                    href={person.twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6E655F] hover:text-[#222222]"
                    title="Twitter / X"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
                {person.githubUrl && (
                  <a
                    href={person.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6E655F] hover:text-[#222222]"
                    title="GitHub"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(person)}
                  className="p-1.5 rounded text-[#6E655F] hover:text-[#A3040F] hover:bg-[#F4E2CA]/50 transition-colors cursor-pointer"
                  title="Edit member"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(person.id)}
                  className="p-1.5 rounded text-[#6E655F] hover:text-[#991B1B] hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] w-full max-w-lg rounded-2xl border border-[#A3040F]/20 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-sm font-bold text-[#222222]">
                {editingPerson ? 'Edit Member Details' : 'Add New Member to Roster'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#6E655F] hover:text-[#222222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#222222] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#222222] mb-1">Hierarchy Tier *</label>
                  <select
                    value={formData.tier}
                    onChange={e => setFormData({ ...formData, tier: e.target.value as PeopleTier })}
                    className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
                  >
                    {Object.entries(tierLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#222222] mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={formData.graduationYear || ''}
                    onChange={e => setFormData({ ...formData, graduationYear: e.target.value })}
                    placeholder="2027"
                    className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#222222] mb-1">Designation / Role Title *</label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Head, Technical Team"
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#222222] mb-1">Academic Department / School</label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
                />
              </div>

              {/* Avatar upload / selector */}
              <div>
                <label className="block font-bold text-[#222222] mb-1">
                  Portrait Avatar (Strict 3:4 Aspect Ratio)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 rounded-md overflow-hidden bg-[#F4E2CA] border border-[#A3040F]/30 shrink-0">
                    <img
                      src={formData.avatarUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={formData.avatarUrl}
                      onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                      className="w-full p-1.5 bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => setAssetPickerOpen(true)}
                      className="text-[11px] font-bold text-[#A3040F] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" /> Select from R2 Media Library / Presigned Upload
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-[#6E655F] mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={formData.linkedinUrl || ''}
                    onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-1.5 bg-white border border-[#CBD5E1] rounded text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#6E655F] mb-1">Twitter / X</label>
                  <input
                    type="text"
                    value={formData.twitterUrl || ''}
                    onChange={e => setFormData({ ...formData, twitterUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-1.5 bg-white border border-[#CBD5E1] rounded text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#6E655F] mb-1">GitHub</label>
                  <input
                    type="text"
                    value={formData.githubUrl || ''}
                    onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-1.5 bg-white border border-[#CBD5E1] rounded text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#222222] mb-1">Brief Bio</label>
                <textarea
                  rows={2}
                  value={formData.bio || ''}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Key contributions and background..."
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-[#222222] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white font-bold transition-colors"
                >
                  Save to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset Picker Modal */}
      <AssetPickerModal
        isOpen={assetPickerOpen}
        onClose={() => setAssetPickerOpen(false)}
        onSelect={cdnUrl => setFormData(prev => ({ ...prev, avatarUrl: cdnUrl }))}
        allowedCategories={['Images']}
        title="Select Member Portrait (3:4)"
      />
    </div>
  );
}
