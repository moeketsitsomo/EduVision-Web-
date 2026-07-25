import Link from 'next/link';
import { PublicNav } from './public-nav';
import type { SiteData } from '@/lib/types';

export function Header({ site }: { site: SiteData }) {
  return (
    <header className="bg-[var(--school-primary)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl truncate">
          {site.school.name}
        </Link>
        <PublicNav pages={site.pages} />
      </div>
    </header>
  );
}
