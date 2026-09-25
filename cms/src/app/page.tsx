'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF8ED]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded bg-[#A3040F] text-[#FFFDF8] font-black flex items-center justify-center text-lg animate-pulse">
          G
        </div>
        <p className="text-xs font-mono tracking-wider text-[#6E655F]">LOADING GEC CMS COMMAND CENTER...</p>
      </div>
    </div>
  );
}
