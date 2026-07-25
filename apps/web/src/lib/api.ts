import { headers } from 'next/headers';
import { getSchoolSlug } from './tenant';
import type { Page, SiteData } from './types';

const API_BASE = process.env.API_URL || 'http://localhost:4000';

async function tenantHeaders() {
  const h = await headers();
  return { 'x-school-slug': getSchoolSlug(h.get('host')) };
}

export async function fetchSite(): Promise<SiteData> {
  const res = await fetch(`${API_BASE}/public/site`, {
    headers: await tenantHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch site: ${res.status}`);
  return (await res.json()) as SiteData;
}

export async function fetchPage(slug: string): Promise<Page | null> {
  const res = await fetch(`${API_BASE}/public/pages/${encodeURIComponent(slug)}`, {
    headers: await tenantHeaders(),
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch page: ${res.status}`);
  return (await res.json()) as Page;
}
