import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-primary">
            EduVision
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/pricing" className="hover:text-primary">Pricing</Link>
            <Link href="/demo" className="hover:text-primary">Request a Demo</Link>
            <Link href="/contact" className="hover:text-primary">Contact Sales</Link>
            <Button asChild size="sm">
              <Link href="/admin/login">Login</Link>
            </Button>
          </nav>
          <div className="md:hidden">
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-muted-foreground flex flex-col md:flex-row justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} EduVision School Website Platform</span>
          <div className="flex gap-4">
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/demo" className="hover:text-foreground">Demo</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
