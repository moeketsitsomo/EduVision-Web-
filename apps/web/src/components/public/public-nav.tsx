'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu } from 'lucide-react';
import type { Page } from '@/lib/types';

const HARDCODED_SLUGS = new Set([
  'home',
  'about',
  'academics',
  'admissions',
  'news',
  'events',
  'gallery',
  'contact',
  'portal',
  'downloads',
  'calendar',
  'notices',
  'principal-message',
  'vision-mission',
  'history',
  'school-fees',
  'school-uniform',
  'sports',
  'emergency',
]);

export function PublicNav({ pages }: { pages: Page[] }) {
  const [open, setOpen] = useState(false);
  const menuPages = pages
    .filter((p) => p.showInMenu && !HARDCODED_SLUGS.has(p.slug))
    .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));

  const NavLink = ({
    href,
    children,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      onClick={onClick}
      className="text-sm font-medium hover:opacity-80 whitespace-nowrap"
    >
      {children}
    </Link>
  );

  return (
    <>
      <nav className="hidden md:flex flex-wrap items-center justify-end gap-x-6 gap-y-1 max-w-[70%]">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/academics">Academics</NavLink>
        <NavLink href="/admissions">Admissions</NavLink>
        <NavLink href="/news">News</NavLink>
        <NavLink href="/events">Events</NavLink>
        <NavLink href="/gallery">Gallery</NavLink>
        <NavLink href="/contact">Contact</NavLink>
        {menuPages.map((page) => (
          <NavLink key={page.id} href={`/${page.slug}`}>
            {page.title}
          </NavLink>
        ))}
        <Link
          href="/portal"
          className="text-sm font-bold underline-offset-4 hover:underline whitespace-nowrap"
        >
          Portal
        </Link>
        <ThemeToggle />
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/10">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-2 mt-6">
            <Link href="/" onClick={() => setOpen(false)} className="text-foreground hover:bg-muted px-3 py-2 rounded-md">Home</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="text-foreground hover:bg-muted px-3 py-2 rounded-md">About</Link>
            <Link href="/academics" onClick={() => setOpen(false)} className="text-foreground hover:bg-muted px-3 py-2 rounded-md">Academics</Link>
            <Link href="/admissions" onClick={() => setOpen(false)} className="text-foreground hover:bg-muted px-3 py-2 rounded-md">Admissions</Link>
            <Link href="/news" onClick={() => setOpen(false)} className="text-foreground hover:bg-muted px-3 py-2 rounded-md">News</Link>
            <Link href="/events" onClick={() => setOpen(false)} className="text-foreground hover:bg-muted px-3 py-2 rounded-md">Events</Link>
            <Link href="/gallery" onClick={() => setOpen(false)} className="text-foreground hover:bg-muted px-3 py-2 rounded-md">Gallery</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="text-foreground hover:bg-muted px-3 py-2 rounded-md">Contact</Link>
            {menuPages.map((page) => (
              <Link
                key={page.id}
                href={`/${page.slug}`}
                onClick={() => setOpen(false)}
                className="text-foreground hover:bg-muted px-3 py-2 rounded-md"
              >
                {page.title}
              </Link>
            ))}
            <Link href="/portal" onClick={() => setOpen(false)} className="text-foreground hover:bg-muted px-3 py-2 rounded-md font-semibold">Portal</Link>
            <div className="px-3 py-2">
              <ThemeToggle />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
