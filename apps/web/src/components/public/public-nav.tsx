'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, GraduationCap } from 'lucide-react';
import type { Page } from '@/lib/types';

const HARDCODED_SLUGS = new Set([
  'home', 'about', 'academics', 'admissions', 'news', 'events', 'gallery', 'contact', 'portal',
  'downloads', 'calendar', 'notices', 'principal-message', 'vision-mission', 'history',
  'school-fees', 'school-uniform', 'sports', 'emergency', 'departments', 'staff', 'policies',
  'prospectus', 'media',
]);

const coreLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/academics', label: 'Academics' },
  { href: '/admissions', label: 'Admissions' },
  { href: '/news', label: 'News' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export function PublicNav({ pages }: { pages: Page[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuPages = pages
    .filter((p) => p.showInMenu && !HARDCODED_SLUGS.has(p.slug))
    .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const NavLink = ({
    href,
    children,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`text-sm font-medium whitespace-nowrap transition-colors ${
          active ? 'text-white underline underline-offset-8' : 'text-white/90 hover:text-white'
        }`}
      >
        {children}
      </Link>
    );
  };

  const mobileLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      onClick={() => setOpen(false)}
      className={`px-3 py-2 rounded-md text-sm ${
        isActive(href) ? 'bg-[var(--school-primary)]/10 font-semibold text-[var(--school-primary)]' : 'text-foreground hover:bg-muted'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <nav className="hidden lg:flex flex-wrap items-center justify-end gap-x-6 gap-y-1">
        {coreLinks.map((link) => (
          <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
        ))}
        {menuPages.map((page) => (
          <NavLink key={page.id} href={`/${page.slug}`}>{page.title}</NavLink>
        ))}
        <Link
          href="/portal"
          className={`text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/30 ${
            isActive('/portal') ? 'bg-white text-[var(--school-primary)]' : 'text-white hover:bg-white/10'
          }`}
        >
          <GraduationCap className="size-4" /> Portal
        </Link>
        <ThemeToggle />
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/10">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 mt-6">
            {coreLinks.map((link) => mobileLink(link.href, link.label))}
            {menuPages.map((page) => mobileLink(`/${page.slug}`, page.title))}
            <Link href="/portal" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md font-semibold text-[var(--school-primary)] hover:bg-muted">
              Portal
            </Link>
            <div className="px-3 py-2">
              <ThemeToggle />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
