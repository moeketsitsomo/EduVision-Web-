import { SchoolHome } from '@/components/public/school-home';
import { MarketingLanding } from '@/components/marketing/landing';
import { isMarketingHost } from '@/lib/marketing';

export default async function RootPage() {
  const marketing = await isMarketingHost();
  if (marketing) return <MarketingLanding />;
  return <SchoolHome />;
}
