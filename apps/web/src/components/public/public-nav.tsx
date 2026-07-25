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

export function PublicNav({ pages }: { pages: Page[] }) {
  const [open, setOpen] = useState(false);
  const menuPages = pages
    .filter((p) => p.showInMenu)
    .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));

  return (
    <>
      <nav className="hidden md:flex items-center gap-6">
        {menuPages.map((page) => (
          <Link
            key={page.id}
            href={`/${page.slug}`}
            className="text-sm font-medium hover:opacity-80"
          >
            {page.title}
          </Link>
        ))}
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
            <div className="px-3 py-2">
              <ThemeToggle />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
