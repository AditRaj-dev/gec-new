'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useCopilot } from '../../context/CopilotContext';
import { UserRole } from '../../lib/types';
import {
  Menu,
  Sparkles,
  ExternalLink,
  Shield,
  CheckCircle2,
  ChevronDown,
  Globe,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

const roleOptions: { value: UserRole; label: string; badge: string }[] = [
  { value: 'super_admin', label: 'Super Admin', badge: 'bg-[#A3040F] text-white' },
  { value: 'core_admin', label: 'Core Team Admin', badge: 'bg-[#C62F29] text-white' },
  { value: 'team_head', label: 'Team Head (Team 06)', badge: 'bg-[#1F7EC0] text-white' },
  { value: 'content_editor', label: 'Content Editor', badge: 'bg-[#D97706] text-white' },
  { value: 'viewer', label: 'Read-only Viewer', badge: 'bg-[#6E655F] text-white' },
];

export function Topbar({ onToggleMobileMenu }: TopbarProps) {
  const pathname = usePathname();
  const { role, switchRole } = useAuth();
  const { toggleDrawer, isOpen: copilotOpen, messages } = useCopilot();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [livePreviewOpen, setLivePreviewOpen] = useState(false);

  // Check if any message has an active pending proposal
  const hasPendingProposal = messages.some(
    m => m.proposal && m.proposal.status === 'proposed'
  );

  // Derive breadcrumbs
  const pathSegments = pathname.split('/').filter(Boolean);
  const activeModule = pathSegments[0] || 'dashboard';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <>
      <header className="h-16 bg-[#FFFDF8] border-b border-[#E2E8F0] px-4 md:px-6 flex items-center justify-between shrink-0 z-30">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg text-[#222222] hover:bg-[#F4E2CA]/50 md:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav className="flex items-center text-xs font-mono font-medium text-[#6E655F] space-x-1.5">
            <span className="text-[#A3040F] font-bold tracking-wider">GEC CMS</span>
            <span>/</span>
            <span className="uppercase text-[#222222] font-semibold tracking-wider">
              {activeModule}
            </span>
            {pathSegments.length > 1 && (
              <>
                <span>/</span>
                <span className="text-[#6E655F] capitalize">
                  {pathSegments.slice(1).join(' / ')}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Right Utility Cluster */}
        <div className="flex items-center gap-2.5">
          {/* Live Sync Status */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/25 text-[11px] font-mono font-bold text-[#16A34A]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>SYNCED · 100% OK</span>
          </div>

          {/* Interactive Role Switcher for Testing RBAC */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#222222] hover:bg-[#F4E2CA]/30 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#A3040F]" />
              <span className="hidden sm:inline">Role:</span>
              <span className="font-mono capitalize font-bold text-[#A3040F]">
                {role.replace('_', ' ')}
              </span>
              <ChevronDown className="w-3 h-3 text-[#6E655F]" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-[#CBD5E1] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1 text-[10px] font-mono uppercase text-[#6E655F] border-b border-[#E2E8F0]">
                  Switch Preview Role (RBAC)
                </div>
                {roleOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      switchRole(opt.value);
                      setRoleDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F4E2CA]/40 cursor-pointer',
                      role === opt.value ? 'bg-[#F4E2CA]/60 font-bold' : 'text-[#222222]'
                    )}
                  >
                    <span>{opt.label}</span>
                    {role === opt.value && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A3040F]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Live Website Button */}
          <button
            onClick={() => setLivePreviewOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#A3040F]/30 bg-[#FFFDF8] hover:bg-[#FCF8ED] text-xs font-bold text-[#A3040F] transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3 text-[#6E655F]" />
          </button>

          {/* Gemini Copilot Trigger Button */}
          <button
            onClick={toggleDrawer}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer',
              copilotOpen
                ? 'bg-[#A3040F] text-white ring-2 ring-[#FBCA05]'
                : 'bg-[#A3040F] text-white hover:bg-[#C62F29]'
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FBCA05] animate-spin-slow" />
            <span className="hidden md:inline">Gemini Copilot</span>
            {hasPendingProposal && (
              <span className="w-2 h-2 rounded-full bg-[#FBCA05] ring-2 ring-white animate-ping" />
            )}
          </button>
        </div>
      </header>

      {/* Live Website Preview Modal */}
      {livePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-[#FCF8ED] w-full max-w-5xl h-[85vh] rounded-2xl border-2 border-[#A3040F] flex flex-col shadow-2xl overflow-hidden">
            <div className="h-12 bg-[#A3040F] px-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#FBCA05]" />
                <span className="text-xs font-mono font-bold tracking-wider">
                  LIVE PUBLIC WEBSITE PREVIEW ({siteUrl})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono underline hover:text-[#FBCA05] flex items-center gap-1"
                >
                  Open in New Tab <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setLivePreviewOpen(false)}
                  className="p-1 rounded hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-white relative">
              <iframe
                src={siteUrl}
                title="GEC Live Website"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
