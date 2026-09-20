'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('president@gec.in');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const ok = await login(email, password);
      if (!ok) {
        setError('Invalid credentials or account is deactivated.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demopassword123');
  };

  return (
    <div className="min-h-screen bg-[#FCF8ED] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#A3040F] text-[#FFFDF8] font-black flex items-center justify-center text-xl shadow-md border-2 border-[#7A000A]">
            GEC
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#A3040F] font-sans">
              DIGITAL COMMAND CENTER
            </h1>
            <p className="text-xs font-mono text-[#6E655F]">INTERNAL CONTENT MANAGEMENT · v2.4</p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#FFFDF8] py-8 px-6 shadow-sm rounded-xl border border-[#A3040F]/20 sm:px-10">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#222222]">Staff Sign In</h2>
            <p className="text-xs text-[#6E655F] mt-1">
              Enter authorized GEC credentials to access live editorial systems.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#A3040F]/10 border border-[#A3040F]/30 rounded-lg flex items-center gap-2 text-xs text-[#A3040F]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-1">
                Institutional Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E655F]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] focus:border-[#A3040F] text-[#222222]"
                  placeholder="name@gec.in"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#A3040F] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E655F]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] focus:border-[#A3040F] text-[#222222]"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#FFFDF8] bg-[#A3040F] hover:bg-[#C62F29] focus:outline-none transition-colors duration-150 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Command Center'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Role Selector */}
          <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E655F]">
                Quick Test Roles:
              </span>
              <span className="text-[10px] bg-[#16A34A]/10 text-[#16A34A] px-2 py-0.5 rounded font-mono font-bold">
                1-Click Autofill
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('president@gec.in')}
                className="text-left px-2.5 py-1.5 rounded bg-[#F4E2CA]/50 hover:bg-[#F4E2CA] border border-[#A3040F]/15 font-medium text-[#222222] transition-colors"
              >
                Super Admin <span className="text-[10px] text-[#A3040F] block">Aarav (President)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin.core@gec.in')}
                className="text-left px-2.5 py-1.5 rounded bg-[#F4E2CA]/50 hover:bg-[#F4E2CA] border border-[#A3040F]/15 font-medium text-[#222222] transition-colors"
              >
                Core Admin <span className="text-[10px] text-[#A3040F] block">Pooja (Ops Lead)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('tech.head@gec.in')}
                className="text-left px-2.5 py-1.5 rounded bg-[#F4E2CA]/50 hover:bg-[#F4E2CA] border border-[#A3040F]/15 font-medium text-[#222222] transition-colors"
              >
                Team Head <span className="text-[10px] text-[#1F7EC0] block">Rohan (Team 06 Tech)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('editorial@gec.in')}
                className="text-left px-2.5 py-1.5 rounded bg-[#F4E2CA]/50 hover:bg-[#F4E2CA] border border-[#A3040F]/15 font-medium text-[#222222] transition-colors"
              >
                Content Editor <span className="text-[10px] text-[#D97706] block">Sneha (Stories/News)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#6E655F]">
          <p>Protected by GEC RBAC Policy & Argon2id session tokens.</p>
        </div>
      </div>
    </div>
  );
}
