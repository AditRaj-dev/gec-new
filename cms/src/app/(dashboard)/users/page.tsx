'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UsersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings');
  }, [router]);

  return (
    <div className="py-20 text-center font-mono text-xs text-[#6E655F]">
      Redirecting to Users & RBAC Governance...
    </div>
  );
}
