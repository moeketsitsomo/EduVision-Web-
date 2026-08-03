import type { Metadata } from 'next';
import { fetchSite } from '@/lib/api';
import { schoolMetadata } from '@/lib/metadata';
import { PublicShell } from '@/components/public/public-shell';
import { PortalClient } from './portal-client';

export async function generateMetadata(): Promise<Metadata> {
  return schoolMetadata('Parent & Learner Portal', 'Secure login for parents and learners.');
}

export default async function PortalPage() {
  const site = await fetchSite();
  return (
    <PublicShell site={site}>
      <PortalClient site={site} />
    </PublicShell>
  );
}
