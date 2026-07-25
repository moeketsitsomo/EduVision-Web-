'use client';

import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Shell } from '@/components/admin/shell';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <Shell>{children}</Shell>
    </AuthGuard>
  );
}
