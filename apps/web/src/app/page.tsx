import type { Metadata } from 'next';
import { SchoolHome } from '@/components/public/school-home';
import { MarketingLanding } from '@/components/marketing/landing';
import { isMarketingHost } from '@/lib/marketing';
import { fetchSite } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const site = await fetchSite();
    return {
      title: { default: `${site.school.name} — Home`, template: `%s | ${site.school.name}` },
      description: site.school.metaDescription || site.school.name,
      openGraph: {
        title: site.school.websiteTitle || site.school.name,
        description: site.school.metaDescription || '',
        images: site.school.bannerImageUrl ? [site.school.bannerImageUrl] : undefined,
      },
    };
  } catch {
    return { title: 'EduVision School Platform', description: 'Professional multi-tenant school websites and CMS' };
  }
}

export default async function RootPage() {
  const marketing = await isMarketingHost();
  if (marketing) return <MarketingLanding />;
  return <SchoolHome />;
}
