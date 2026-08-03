import Link from 'next/link';
import { PublicNav } from './public-nav';
import type { SiteData } from '@/lib/types';

export function Header({ site }: { site: SiteData }) {
  return (
    <header className="bg-[var(--school-primary)] text-white sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-3 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
        <Link href="/" className="font-bold text-lg md:text-xl truncate flex items-center gap-3 flex-shrink-0">
          {site.school.logoUrl ? (
            <img src={site.school.logoUrl} alt={site.school.name} loading="lazy" className="h-10 w-auto max-w-[160px] object-contain" />
          ) : (
            <span className="font-semibold">{site.school.name}</span>
          )}
        </Link>
        <PublicNav pages={site.pages} />
      </div>
    </header>
  );
}
