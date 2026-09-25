'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../lib/api-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.forgotPassword(email);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8ED] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#FFFDF8] py-8 px-6 shadow-sm rounded-xl border border-[#A3040F]/20 sm:px-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A3040F] hover:underline mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>

          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#222222]">Reset Link Sent</h2>
              <p className="text-xs text-[#6E655F] mt-2 mb-6">
                If an account exists for <span className="font-semibold text-[#222222]">{email}</span>, a single-use password reset link expiring in 15 minutes has been dispatched.
              </p>
              <Link
                href="/login"
                className="inline-block w-full py-2 px-4 rounded-lg bg-[#A3040F] text-white text-xs font-bold hover:bg-[#C62F29]"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold text-[#222222]">Reset Account Password</h2>
              <p className="text-xs text-[#6E655F] mt-1 mb-6">
                Enter your registered GEC staff email to receive secure recovery instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider mb-1">
                    Staff Email
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold text-[#FFFDF8] bg-[#A3040F] hover:bg-[#C62F29] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Sending link...' : 'Send Reset Link'}
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
