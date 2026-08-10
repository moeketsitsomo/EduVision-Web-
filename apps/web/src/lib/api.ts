import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSchoolSlug } from './tenant';
import type { Page, SiteData } from './types';

const API_BASE = process.env.API_URL || 'http://localhost:4000';

async function tenantHeaders() {
  const h = await headers();
  const slug = getSchoolSlug(h.get('host'));
  const result: Record<string, string> = {};
  if (slug) result['x-school-slug'] = slug;
  return result;
}

async function handlePublicResponse(res: Response): Promise<unknown> {
  if (res.ok) {
    return res.json();
  }

  const body = await res.text();
  if (res.status === 403) {
    try {
      const data = JSON.parse(body);
      if (data.setupRequired) {
        redirect('/setup');
      }
    } catch {}
  }
  throw new Error(`Failed to fetch site: ${res.status}`);
}

export async function fetchSite(): Promise<SiteData> {
  const res = await fetch(`${API_BASE}/public/site`, {
    headers: await tenantHeaders(),
    cache: 'no-store',
  });
  return (await handlePublicResponse(res)) as SiteData;
}

export async function fetchPage(slug: string): Promise<Page | null> {
  const res = await fetch(`${API_BASE}/public/pages/${encodeURIComponent(slug)}`, {
    headers: await tenantHeaders(),
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  return (await handlePublicResponse(res)) as Page;
}
