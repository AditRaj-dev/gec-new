'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Layers,
  Rocket,
  BookOpen,
  Briefcase,
  FolderArchive,
  Inbox,
  FileSpreadsheet,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const navModules = [
  { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'people', name: 'People', href: '/people', icon: Users },
  { id: 'teams', name: 'Teams', href: '/teams', icon: Layers },
  { id: 'initiatives', name: 'Initiatives', href: '/initiatives', icon: Rocket },
  { id: 'stories', name: 'Stories', href: '/stories', icon: BookOpen },
  { id: 'stakeholders', name: 'Stakeholders', href: '/stakeholders', icon: Briefcase },
  { id: 'media', name: 'Media', href: '/media', icon: FolderArchive },
  { id: 'submissions', name: 'Submissions', href: '/submissions', icon: Inbox, badge: '3' },
  { id: 'forms', name: 'Google Forms & AI', href: '/forms', icon: FileSpreadsheet },
  { id: 'analytics', name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { id: 'settings', name: 'Settings & RBAC', href: '/settings', icon: Settings },
];

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[#141518] text-[#F8FAFC] flex flex-col border-r border-white/10 transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#A3040F] text-[#FFFDF8] font-black flex items-center justify-center text-sm shadow-sm border border-[#7A000A]">
              GEC
            </div>
            <div>
              <h2 className="text-xs font-black tracking-wider uppercase text-white font-sans">
                GEC CMS COMMAND
              </h2>
              <p className="text-[10px] font-mono text-[#94A3B8]">DIGITAL PLATFORM</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#16A34A]/20 text-[#4ADE80] border border-[#4ADE80]/30">
              v2.4
            </span>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded text-[#94A3B8] hover:text-white md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 11 Modules Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
            Core Modules
          </div>
          {navModules.map(item => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group',
                  isActive
                    ? 'bg-[#A3040F] text-white font-bold shadow-xs'
                    : 'text-[#CBD5E1] hover:bg-white/5 hover:text-white'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-white'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono',
                      isActive
                        ? 'bg-[#FFFDF8] text-[#A3040F]'
                        : 'bg-[#A3040F] text-white'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Current User & Role Status */}
        <div className="p-3 border-t border-white/10 bg-[#0E0F12] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#A3040F]/30 border border-[#A3040F]/50 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Authorized Staff'}
                </p>
                <p className="text-[10px] font-mono text-[#FBCA05] uppercase tracking-wider truncate flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  {role.replace('_', ' ')}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded text-[#94A3B8] hover:text-[#C62F29] hover:bg-white/5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
