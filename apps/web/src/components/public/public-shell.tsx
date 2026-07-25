import type { SiteData } from '@/lib/types';
import { Header } from './header';
import { Footer } from './footer';

export function PublicShell({
  site,
  children,
}: {
  site: SiteData;
  children: React.ReactNode;
}) {
  const style = {
    '--school-primary': site.school.primaryColor,
    '--school-secondary': site.school.secondaryColor,
  } as React.CSSProperties;

  return (
    <div style={style} className="flex min-h-screen flex-col">
      <Header site={site} />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
    </div>
  );
}
