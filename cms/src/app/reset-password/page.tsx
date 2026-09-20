'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../lib/api-client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiClient.resetPassword('sample_token', password);
      setCompleted(true);
    } catch {
      setError('Failed to reset password. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8ED] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#FFFDF8] py-8 px-6 shadow-sm rounded-xl border border-[#A3040F]/20 sm:px-10">
          {completed ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#222222]">Password Updated</h2>
              <p className="text-xs text-[#6E655F] mt-2 mb-6">
                Your credentials have been securely updated. You can now sign in with your new password.
              </p>
              <Link
                href="/login"
                className="inline-block w-full py-2 px-4 rounded-lg bg-[#A3040F] text-white text-xs font-bold hover:bg-[#C62F29]"
              >
                Sign In Now
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold text-[#222222]">Set New Password</h2>
              <p className="text-xs text-[#6E655F] mt-1 mb-6">
                Create a strong password with at least 8 characters.
              </p>

              {error && (
                <div className="mb-4 p-2.5 bg-[#A3040F]/10 border border-[#A3040F]/30 rounded-lg text-xs text-[#A3040F]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-1">
                    New Password
                  </label>
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

                <div>
                  <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E655F]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] focus:border-[#A3040F] text-[#222222]"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold text-[#FFFDF8] bg-[#A3040F] hover:bg-[#C62F29] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
