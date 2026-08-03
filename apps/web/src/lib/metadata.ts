import type { Metadata } from 'next';
import { fetchSite } from './api';

export async function schoolMetadata(title: string, description?: string | null): Promise<Metadata> {
  try {
    const site = await fetchSite();
    const full = `${title} | ${site.school.name}`;
    return {
      title: full,
      description: description || site.school.metaDescription || site.school.name,
      openGraph: { title: full, description: description || site.school.metaDescription || '' },
    };
  } catch {
    return { title: `${title} | EduVision School Platform` };
  }
}
