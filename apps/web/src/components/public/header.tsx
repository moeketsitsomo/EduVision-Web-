import Link from 'next/link';
import { PublicNav } from './public-nav';
import type { SiteData } from '@/lib/types';
import { GraduationCap } from 'lucide-react';

export function Header({ site }: { site: SiteData }) {
  return (
    <header className="bg-[var(--school-primary)] text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
          {site.school.logoUrl ? (
            <img
              src={site.school.logoUrl}
              alt={`${site.school.name} logo`}
              loading="eager"
              className="h-10 md:h-12 w-auto max-w-[160px] object-contain group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <GraduationCap className="size-6" />
            </div>
          )}
          <div className="hidden sm:block">
            <p className="font-bold text-lg md:text-xl leading-tight">{site.school.name}</p>
            <p className="text-xs opacity-80 hidden md:block">{site.school.metaDescription?.slice(0, 40)}...</p>
          </div>
        </Link>
        <PublicNav pages={site.pages} />
      </div>
    </header>
  );
}
