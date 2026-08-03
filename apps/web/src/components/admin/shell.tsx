'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { getToken } from '@/lib/admin-api';
import { RESOURCES } from './resource-config';
import { LogOut, Menu, LayoutDashboard, Shield, type LucideIcon } from 'lucide-react';
import {
  FileText,
  Newspaper,
  CalendarDays,
  Calendar,
  Users,
  UserCog,
  Image,
  Download,
  DollarSign,
  Phone,
  Share2,
  Compass,
  Images,
  Settings,
  Megaphone,
  ClipboardList,
  Award,
  Clock,
  CreditCard,
  Key,
  FileSpreadsheet,
  Activity,
  BookOpen,
  Receipt,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

const RESOURCE_ICONS: Record<string, LucideIcon> = {
  subjects: BookOpen,
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
  users: UserCog,
  students: Users,
  notices: Megaphone,
  admissions: ClipboardList,
  results: Award,
  attendance: Clock,
  timetable: Calendar,
  library: BookOpen,
  borrowings: BookOpen,
  finance: Receipt,
  communication: MessageSquare,
  reports: BarChart3,
  subscriptions: CreditCard,
  invoices: FileSpreadsheet,
  licenses: Key,
};

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

function getRoleFromToken(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { role?: string };
    return payload.role || null;
  } catch {
    return null;
  }
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getRoleFromToken());
  }, []);

  const navItems: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    ...Object.entries(RESOURCES).map(([key, config]) => ({
      href: `/admin/${key}`,
      label: config.title,
      icon: RESOURCE_ICONS[key] || FileText,
    })),
    { href: '/admin/media', label: 'Media Library', icon: Images },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    ...(role === 'SUPER_ADMIN'
      ? [
          { href: '/admin/health', label: 'System Health', icon: Activity },
          { href: '/admin/super', label: 'Super Admin', icon: Shield },
        ]
      : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem('eduvision_token');
    router.push('/admin/login');
  };

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(`${href}/`));

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="fixed top-0 left-0 right-0 z-20 h-16 border-b bg-background/95 px-4 flex items-center justify-between md:pl-64">
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>EduVision Admin</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-2 gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <span className="font-semibold">Admin</span>
        </div>

        <div className="hidden md:block font-semibold">EduVision Admin Dashboard</div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="xs" onClick={handleLogout}>
            <LogOut className="size-4 mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r bg-card pt-16">
        <nav className="flex-1 p-4 space-y-1 overflow-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="pt-16 md:pl-64 min-h-screen p-4 md:p-8">{children}</main>
    </div>
  );
}
