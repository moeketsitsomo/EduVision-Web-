'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('eduvision_token');
    if (!token) {
      router.replace('/admin/login');
    }
    setMounted(true);
  }, [router]);

  if (!mounted) return null;
  return <>{children}</>;
}
