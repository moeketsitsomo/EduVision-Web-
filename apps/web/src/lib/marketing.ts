import { headers } from 'next/headers';

export async function isMarketingHost(): Promise<boolean> {
  const h = (await headers()).get('host');
  if (!h) return false;

  const host = h.split(':')[0].toLowerCase();
  const platformHosts = (process.env.NEXT_PUBLIC_PLATFORM_HOSTS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (platformHosts.includes(host)) return true;

  // If a specific platform host is configured, match exactly.
  const platformHost = (process.env.NEXT_PUBLIC_PLATFORM_HOST || '').trim().toLowerCase();
  if (platformHost && host === platformHost) return true;

  return false;
}
