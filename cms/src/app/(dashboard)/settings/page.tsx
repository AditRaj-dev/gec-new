'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { SiteSettings, CmsUser, AuditLog, UserRole } from '../../../lib/types';
import { LiveImpactRibbon } from '../../../components/layout/LiveImpactRibbon';
import {
  Settings,
  Users,
  Shield,
  History,
  RefreshCw,
  CheckCircle2,
  Lock,
  Globe,
  Plus,
  Trash2,
  X,
  Sliders,
  Send,
  Sparkles,
} from 'lucide-react';
import { cn, formatDateTime } from '../../../lib/utils';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'users' | 'audit' | 'seo'>('settings');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [purging, setPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Add User Modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<CmsUser, 'id'>>({
    name: '',
    email: '',
    role: 'content_editor',
    active: true,
  });

  const loadData = async () => {
    const s = await apiClient.getSiteSettings();
    const u = await apiClient.getUsers();
    const a = await apiClient.getAuditLogs();
    setSettings(s);
    setUsers(u);
    setAuditLogs(a);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    try {
      const updated = await apiClient.updateSiteSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePurgeCache = async () => {
    setPurging(true);
    setPurgeSuccess(null);
    try {
      const res = await apiClient.purgeCdnCache();
      setPurgeSuccess(`Purged cache across ${res.purgedPathsCount} public routes successfully.`);
      loadData();
    } finally {
      setPurging(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    await apiClient.createUser(newUser);
    setUserModalOpen(false);
    setNewUser({ name: '', email: '', role: 'content_editor', active: true });
    loadData();
  };

  if (!settings) {
    return <div className="py-20 text-center font-mono text-xs text-[#6E655F]">Loading System Settings...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#222222] tracking-tight font-sans">
            Users, RBAC & Global Settings
          </h1>
          <p className="text-xs text-[#6E655F]">
            Role-based access control, immutable security audit logs, impact counters override, and instant cache purge.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePurgeCache}
            disabled={purging}
            className="px-3.5 py-1.5 rounded-lg border border-[#A3040F] bg-[#FCF8ED] hover:bg-[#F4E2CA] text-xs font-bold text-[#A3040F] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', purging && 'animate-spin')} />
            <span>{purging ? 'Purging CDN Cache...' : 'Instant Cache Purge'}</span>
          </button>
        </div>
      </div>

      <LiveImpactRibbon
        targetSection="Page 01 §1.4 Impact Counters, Header Ticker, and Cloudflare CDN Cache"
        description="Immediate global sync across all 5 public pages within 5 seconds of confirmation."
      />

      {purgeSuccess && (
        <div className="p-3 bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-xl text-xs text-[#16A34A] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{purgeSuccess}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-xl text-xs text-[#16A34A] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Global site settings saved and published to public website.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'settings' ? 'bg-[#A3040F] text-white' : 'bg-[#FCF8ED] text-[#6E655F] hover:text-[#222222]'
          }`}
        >
          General & Impact Counters
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'users' ? 'bg-[#A3040F] text-white' : 'bg-[#FCF8ED] text-[#6E655F] hover:text-[#222222]'
          }`}
        >
          Users & Permissions ({users.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'audit' ? 'bg-[#A3040F] text-white' : 'bg-[#FCF8ED] text-[#6E655F] hover:text-[#222222]'
          }`}
        >
          Audit Logs ({auditLogs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'seo' ? 'bg-[#A3040F] text-white' : 'bg-[#FCF8ED] text-[#6E655F] hover:text-[#222222]'
          }`}
        >
          SEO & Social Links
        </button>
      </div>

      {/* Tab 1: Settings & Impact Counters */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-[#FFFDF8] border border-[#A3040F]/20 rounded-2xl p-6 shadow-xs space-y-6 text-xs">
          {/* Live Announcement Ticker */}
          <div className="p-4 bg-[#FCF8ED] border border-[#CBD5E1] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#222222]">Live Header Announcement Ticker</h3>
                <p className="text-[11px] text-[#6E655F]">
                  Top banner strip rendered directly above public website navigation.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-bold">
                <input
                  type="checkbox"
                  checked={settings.announcementTicker.enabled}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      announcementTicker: { ...settings.announcementTicker, enabled: e.target.checked },
                    })
                  }
                  className="rounded text-[#A3040F] focus:ring-[#A3040F]"
                />
                <span>Active Banner</span>
              </label>
            </div>

            <div>
              <label className="block font-semibold text-[#6E655F] mb-1">Ticker Message Text</label>
              <input
                type="text"
                value={settings.announcementTicker.text}
                onChange={e =>
                  setSettings({
                    ...settings,
                    announcementTicker: { ...settings.announcementTicker, text: e.target.value },
                  })
                }
                className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg text-[#222222]"
              />
            </div>
          </div>

          {/* Impact Counter Overrides */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#222222]">
                  Public Impact Counters (Page 01 §1.4)
                </h3>
                <p className="text-[11px] text-[#6E655F]">
                  Live numbers rendered in the interactive counter ticker.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-white border border-[#CBD5E1] rounded-xl space-y-1">
                <label className="block font-mono text-[10px] uppercase text-[#6E655F]">Startups Incubated</label>
                <input
                  type="number"
                  value={settings.impactCounters.startupsIncubated}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      impactCounters: {
                        ...settings.impactCounters,
                        startupsIncubated: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg font-bold text-base"
                />
              </div>

              <div className="p-3 bg-white border border-[#CBD5E1] rounded-xl space-y-1">
                <label className="block font-mono text-[10px] uppercase text-[#6E655F]">Events Conducted</label>
                <input
                  type="number"
                  value={settings.impactCounters.eventsConducted}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      impactCounters: {
                        ...settings.impactCounters,
                        eventsConducted: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg font-bold text-base"
                />
              </div>

              <div className="p-3 bg-white border border-[#CBD5E1] rounded-xl space-y-1">
                <label className="block font-mono text-[10px] uppercase text-[#6E655F]">Student Footfall</label>
                <input
                  type="number"
                  value={settings.impactCounters.studentFootfall}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      impactCounters: {
                        ...settings.impactCounters,
                        studentFootfall: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg font-bold text-base"
                />
              </div>

              <div className="p-3 bg-white border border-[#CBD5E1] rounded-xl space-y-1">
                <label className="block font-mono text-[10px] uppercase text-[#6E655F]">Funding Raised (Lakhs)</label>
                <input
                  type="number"
                  value={settings.impactCounters.fundingRaisedLakhs}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      impactCounters: {
                        ...settings.impactCounters,
                        fundingRaisedLakhs: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg font-bold text-base"
                />
                <span className="text-[10px] font-mono text-[#A3040F] block">
                  = ₹{(settings.impactCounters.fundingRaisedLakhs / 100).toFixed(2)} Crores
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-5 py-2 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingSettings ? 'Saving Settings...' : 'Save Global Settings'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Users & RBAC */}
      {activeTab === 'users' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <p className="text-[#6E655F]">
              Authorized staff accounts governed by strict Argon2id token rotation and Neon RBAC guards.
            </p>
            <button
              type="button"
              onClick={() => setUserModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#A3040F] text-white font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Staff</span>
            </button>
          </div>

          <div className="bg-[#FFFDF8] border border-[#CBD5E1] rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FCF8ED] border-b border-[#CBD5E1] text-[#6E655F] font-mono text-[10px] uppercase">
                  <th className="p-3">Staff Member</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Team Scope</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#FCF8ED]/40">
                    <td className="p-3 font-semibold text-[#222222]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#A3040F]/15 text-[#A3040F] font-bold flex items-center justify-center text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <span>{u.name}</span>
                          <span className="block text-[11px] font-mono text-[#6E655F] font-normal">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#F4E2CA] text-[#A3040F]">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[#6E655F]">
                      {u.teamScope ? u.teamScope.toUpperCase() : 'Global'}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-mono font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#6E655F]">
                      {formatDateTime(u.lastLogin)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Immutable Audit Logs */}
      {activeTab === 'audit' && (
        <div className="space-y-4 text-xs">
          <p className="text-[#6E655F]">
            Immutable record of staff actions, content publishing, cache invalidations, and Google Forms operations.
          </p>

          <div className="bg-[#FFFDF8] border border-[#CBD5E1] rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FCF8ED] border-b border-[#CBD5E1] text-[#6E655F] font-mono text-[10px] uppercase">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Resource</th>
                  <th className="p-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#FCF8ED]/40">
                    <td className="p-3 font-mono text-[11px] text-[#6E655F] whitespace-nowrap">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="p-3 font-semibold text-[#222222]">
                      {log.actorName}
                      <span className="block text-[10px] font-mono text-[#6E655F] font-normal">{log.actorEmail}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FCF8ED] border border-[#A3040F]/20 text-[#A3040F]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[#222222]">
                      {log.resource}
                    </td>
                    <td className="p-3 text-[#6E655F]">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: SEO & Social Links */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveSettings} className="bg-[#FFFDF8] border border-[#A3040F]/20 rounded-2xl p-6 shadow-xs space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-[#222222] mb-3">SEO Defaults</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-[#222222] mb-1">Global Meta Title</label>
                <input
                  type="text"
                  value={settings.seoDefaults.metaTitle}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      seoDefaults: { ...settings.seoDefaults, metaTitle: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-[#222222] mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={settings.seoDefaults.metaDescription}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      seoDefaults: { ...settings.seoDefaults, metaDescription: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0]">
            <h3 className="text-sm font-bold text-[#222222] mb-3">Official Social Handles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#6E655F] mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={settings.socialLinks.instagram}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E655F] mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={settings.socialLinks.linkedin}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0]">
            <h3 className="text-sm font-bold text-[#222222] mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#6E655F] mb-1">General Inquiries Email</label>
                <input
                  type="email"
                  value={settings.contactInfo.email}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      contactInfo: { ...settings.contactInfo, email: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E655F] mb-1">Support Phone</label>
                <input
                  type="text"
                  value={settings.contactInfo.phone}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      contactInfo: { ...settings.contactInfo, phone: e.target.value },
                    })
                  }
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-5 py-2 rounded-lg bg-[#A3040F] hover:bg-[#C62F29] text-white font-bold transition-colors cursor-pointer"
            >
              Save SEO & Social Settings
            </button>
          </div>
        </form>
      )}

      {/* Add User Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-2xl border border-[#A3040F]/20 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <h3 className="text-sm font-bold text-[#222222]">Add New Staff User</h3>
              <button onClick={() => setUserModalOpen(false)} className="text-[#6E655F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#222222] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-[#222222] mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="name@gec.in"
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-[#222222] mb-1">System Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full p-2 border border-[#CBD5E1] rounded-lg bg-white"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="core_admin">Core Team Admin</option>
                  <option value="team_head">Team Head</option>
                  <option value="content_editor">Content Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#A3040F] hover:bg-[#C62F29] text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Create Staff User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
