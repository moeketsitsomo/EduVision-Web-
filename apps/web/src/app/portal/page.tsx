import { fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { PortalClient } from './portal-client';

export default async function PortalPage() {
  const site = await fetchSite();
  return (
    <PublicShell site={site}>
      <PortalClient site={site} />
    </PublicShell>
  );
}
