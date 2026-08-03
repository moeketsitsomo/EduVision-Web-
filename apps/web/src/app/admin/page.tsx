'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/admin-api';
import { RESOURCES } from '@/components/admin/resource-config';
import {
  FileText,
  Newspaper,
  CalendarDays,
  Calendar,
  Users,
  Image,
  Download,
  DollarSign,
  Phone,
  Share2,
  Compass,
  ChevronRight,
  LayoutDashboard,
  type LucideIcon,
  BookOpen,
  Receipt,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  pages: FileText,
  posts: Newspaper,
  events: CalendarDays,
  staff: Users,
  galleries: Image,
  downloads: Download,
  fees: DollarSign,
  contacts: Phone,
  socials: Share2,
  navigation: Compass,
  timetable: Calendar,
  library: BookOpen,
  borrowings: BookOpen,
  finance: Receipt,
  communication: MessageSquare,
  reports: BarChart3,
};

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    async function load() {
      const results: Record<string, number | null> = {};
      await Promise.all(
        Object.keys(RESOURCES).map(async (key) => {
          try {
            const res = await apiFetch(`/${key}`);
            const data = (await res.json()) as unknown[];
            results[key] = data.length;
          } catch {
            results[key] = null;
          }
        })
      );
      setCounts(results);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="size-6" />
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(RESOURCES).map(([key, config]) => {
          const Icon = ICONS[key] || FileText;
          const count = counts[key];
          return (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count ?? '-'}</div>
                <Button asChild variant="ghost" size="xs" className="mt-2 px-0 h-auto">
                  <Link href={`/admin/${key}`}>
                    Manage <ChevronRight className="size-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
