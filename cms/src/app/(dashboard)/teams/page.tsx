'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Team, Submission } from '../../../lib/types';
import { LiveImpactRibbon } from '../../../components/layout/LiveImpactRibbon';
import {
  Layers,
  Users,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  UserCheck,
  Clock,
  Mail,
  Upload,
  Save,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('team_01');
  const [activeTab, setActiveTab] = useState<'overview' | 'pillars' | 'roster' | 'recruitment'>('overview');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    apiClient.getTeams().then(data => {
      setTeams(data);
      if (data.length > 0) setSelectedTeamId(data[0].id);
    });
    apiClient.getSubmissions().then(subs => {
      setSubmissions(subs.filter(s => s.formType === 'Join Team Application'));
    });
  }, []);

  const currentTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  const handleUpdateCurrentTeam = (updates: Partial<Team>) => {
    if (!currentTeam) return;
    const updated = { ...currentTeam, ...updates };
    setTeams(prev => prev.map(t => (t.id === currentTeam.id ? updated : t)));
  };

  const handleSaveTeam = async () => {
    if (!currentTeam) return;
    setSaving(true);
    try {
      await apiClient.updateTeam(currentTeam.id, currentTeam);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePillarChange = (index: number, field: 'title' | 'scope', value: string) => {
    if (!currentTeam) return;
    const newPillars = [...currentTeam.responsibilities];
    newPillars[index] = { ...newPillars[index], [field]: value };
    handleUpdateCurrentTeam({ responsibilities: newPillars });
  };

  if (!currentTeam) {
    return <div className="py-20 text-center font-mono text-xs text-[#6E655F]">Loading Teams...</div>;
  }

  // Filter applications for current team
  const teamApplications = submissions.filter(
    s => s.teamTarget && s.teamTarget.toLowerCase().includes(currentTeam.name.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#222222] tracking-tight font-sans">
            7 Functional Teams Management
          </h1>
          <p className="text-xs text-[#6E655F]">
            Autonomous sub-workspaces, 6 pillar responsibility mapping, heads, and recruitment pipelines.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveTeam}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : `Save ${currentTeam.name}`}</span>
        </button>
      </div>

      <LiveImpactRibbon
        targetSection="Page 03 §3.1 Roster, §3.2 Responsibilities (6 Pillars), and §3.3 Detail Canvas"
        description="Controls team overview copy, the 6 focus area pillars, current head portraits, and Join Team recruitment state."
      />

      {savedSuccess && (
        <div className="p-3 bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-xl text-xs text-[#16A34A] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Team settings saved and updated for public website rendering.</span>
        </div>
      )}

      {/* 7 Teams Navigation Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E2E8F0]">
        {teams.map(team => {
          const isSelected = team.id === selectedTeamId;
          return (
            <button
              key={team.id}
              type="button"
              onClick={() => setSelectedTeamId(team.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer',
                isSelected
                  ? 'bg-[#FFFDF8] border-[#A3040F] shadow-sm text-[#A3040F]'
                  : 'bg-[#FCF8ED] border-[#CBD5E1] text-[#222222] hover:bg-[#F4E2CA]/50'
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: team.accentColor }}
              />
              <span className="font-mono text-[11px]">Team {team.number}</span>
              <span className="hidden md:inline">· {team.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Team Banner */}
      <div className="bg-[#FFFDF8] border border-[#A3040F]/20 rounded-2xl p-5 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm"
              style={{ backgroundColor: currentTeam.accentColor }}
            >
              {currentTeam.number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#222222]">
                  Team {currentTeam.number}: {currentTeam.name}
                </h2>
                <span
                  className={cn(
                    'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase',
                    currentTeam.recruitmentStatus === 'open'
                      ? 'bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30'
                      : 'bg-[#6E655F]/20 text-[#6E655F] border border-[#6E655F]/30'
                  )}
                >
                  Recruitment {currentTeam.recruitmentStatus}
                </span>
              </div>
              <p className="text-xs text-[#6E655F] mt-0.5">{currentTeam.tagline}</p>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1 bg-[#FCF8ED] p-1 rounded-xl border border-[#CBD5E1] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-[#A3040F] text-white' : 'text-[#6E655F] hover:text-[#222222]'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pillars')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'pillars' ? 'bg-[#A3040F] text-white' : 'text-[#6E655F] hover:text-[#222222]'
              }`}
            >
              6 Pillars (§3.2)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'roster' ? 'bg-[#A3040F] text-white' : 'text-[#6E655F] hover:text-[#222222]'
              }`}
            >
              Head & Coordinators
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('recruitment')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'recruitment' ? 'bg-[#A3040F] text-white' : 'text-[#6E655F] hover:text-[#222222]'
              }`}
            >
              Join Applications ({teamApplications.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#222222] uppercase tracking-wider mb-1">
                Team Tagline (Public kicker)
              </label>
              <input
                type="text"
                value={currentTeam.tagline}
                onChange={e => handleUpdateCurrentTeam({ tagline: e.target.value })}
                className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#222222] uppercase tracking-wider mb-1">
                Core Mission Statement
              </label>
              <textarea
                rows={2}
                value={currentTeam.mission}
                onChange={e => handleUpdateCurrentTeam({ mission: e.target.value })}
                className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#222222] uppercase tracking-wider mb-1">
                Extended Team Overview (Page 03 §3.1)
              </label>
              <textarea
                rows={4}
                value={currentTeam.overview}
                onChange={e => handleUpdateCurrentTeam({ overview: e.target.value })}
                className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-[#6E655F] mb-1">Team Email</label>
                <input
                  type="email"
                  value={currentTeam.socialLinks.email || ''}
                  onChange={e =>
                    handleUpdateCurrentTeam({
                      socialLinks: { ...currentTeam.socialLinks, email: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E655F] mb-1">LinkedIn Page</label>
                <input
                  type="text"
                  value={currentTeam.socialLinks.linkedin || ''}
                  onChange={e =>
                    handleUpdateCurrentTeam({
                      socialLinks: { ...currentTeam.socialLinks, linkedin: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E655F] mb-1">Instagram Handle</label>
                <input
                  type="text"
                  value={currentTeam.socialLinks.instagram || ''}
                  onChange={e =>
                    handleUpdateCurrentTeam({
                      socialLinks: { ...currentTeam.socialLinks, instagram: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 6 Pillars of Responsibility */}
        {activeTab === 'pillars' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#FCF8ED] border border-[#A3040F]/15 rounded-xl">
              <h4 className="font-bold text-[#A3040F] uppercase tracking-wider font-mono">
                Mandatory 6 Responsibility Pillars
              </h4>
              <p className="text-[11px] text-[#6E655F] mt-0.5">
                These exactly populate the 6 discrete focus tags displayed on Public Page 03 §3.2.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTeam.responsibilities.map((pillar, idx) => (
                <div
                  key={pillar.id || idx}
                  className="p-3.5 bg-white border border-[#CBD5E1] rounded-xl space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#A3040F] text-[11px]">
                      PILLAR 0{idx + 1}
                    </span>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#6E655F] mb-0.5">Pillar Title</label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={e => handlePillarChange(idx, 'title', e.target.value)}
                      className="w-full p-1.5 border border-[#CBD5E1] rounded-lg font-bold text-[#222222]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#6E655F] mb-0.5">Operational Scope</label>
                    <textarea
                      rows={2}
                      value={pillar.scope}
                      onChange={e => handlePillarChange(idx, 'scope', e.target.value)}
                      className="w-full p-1.5 border border-[#CBD5E1] rounded-lg text-[#222222]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Head & Coordinators */}
        {activeTab === 'roster' && (
          <div className="space-y-6 text-xs">
            {/* Current Head */}
            <div className="p-4 bg-white border border-[#A3040F]/20 rounded-xl space-y-3">
              <h4 className="font-bold text-[#A3040F] uppercase tracking-wider font-mono">
                Current Team Head
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#F4E2CA] border border-[#CBD5E1] shrink-0">
                  <img
                    src={currentTeam.headPhoto}
                    alt={currentTeam.headName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#6E655F]">Full Name</label>
                      <input
                        type="text"
                        value={currentTeam.headName}
                        onChange={e => handleUpdateCurrentTeam({ headName: e.target.value })}
                        className="w-full p-1.5 border border-[#CBD5E1] rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#6E655F]">Designation</label>
                      <input
                        type="text"
                        value={currentTeam.headDesignation}
                        onChange={e => handleUpdateCurrentTeam({ headDesignation: e.target.value })}
                        className="w-full p-1.5 border border-[#CBD5E1] rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coordinators List */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#222222] uppercase tracking-wider font-mono">
                Active Coordinators ({currentTeam.coordinators.length} of 4)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentTeam.coordinators.map(coord => (
                  <div
                    key={coord.id}
                    className="p-3 bg-white border border-[#CBD5E1] rounded-xl flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F4E2CA] shrink-0">
                      <img src={coord.photo} alt={coord.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-[#222222] truncate">{coord.name}</h5>
                      <p className="text-[11px] text-[#6E655F] truncate">{coord.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Join Team Applications */}
        {activeTab === 'recruitment' && (
          <div className="space-y-4 text-xs">
            {/* Recruitment Toggle */}
            <div className="p-4 bg-[#FCF8ED] border border-[#CBD5E1] rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#222222]">Recruitment Status Toggle</h4>
                <p className="text-[#6E655F] text-[11px]">
                  Controls the live "Join Team" button and submission intake on Page 03 §3.3.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={currentTeam.recruitmentStatus}
                  onChange={e =>
                    handleUpdateCurrentTeam({
                      recruitmentStatus: e.target.value as 'open' | 'closed',
                    })
                  }
                  className="p-1.5 bg-white border border-[#CBD5E1] rounded-lg font-bold text-xs"
                >
                  <option value="open">Open (Accepting Applicants)</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#222222]">
                Student Applicants ({teamApplications.length})
              </h4>
              {teamApplications.map(sub => (
                <div
                  key={sub.id}
                  className="p-3 bg-white border border-[#CBD5E1] rounded-xl flex items-center justify-between gap-3"
                >
                  <div>
                    <h5 className="font-bold text-[#222222]">{sub.applicantName}</h5>
                    <p className="text-[11px] text-[#6E655F]">
                      {sub.applicantEmail} · {sub.applicantPhone}
                    </p>
                    <p className="text-[11px] text-[#222222] mt-1 italic">
                      "{sub.answers['Key Projects'] || sub.answers['Target Role'] || 'No notes'}"
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#16A34A]/20 text-[#16A34A]">
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}

              {teamApplications.length === 0 && (
                <div className="py-8 text-center text-[#6E655F]">
                  No recruitment applications received for {currentTeam.name} yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
