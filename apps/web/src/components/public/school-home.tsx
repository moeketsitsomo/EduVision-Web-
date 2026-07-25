import Link from 'next/link';
import { fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Newspaper, GraduationCap, ChevronRight, Megaphone } from 'lucide-react';

export async function SchoolHome() {
  const site = await fetchSite();
  const { school, pages, posts, events, notices } = site;
  const homePage = pages.find((p) => p.slug === 'home') || pages[0];
  const menuPages = pages
    .filter((p) => p.showInMenu)
    .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));

  return (
    <PublicShell site={site}>
      <section className="bg-[var(--school-primary)] text-white py-20" aria-label="School hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">{school.websiteTitle}</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">{school.metaDescription}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="bg-white text-[var(--school-primary)] hover:bg-gray-100">
              <Link href="/about">About Us</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {homePage ? <MarkdownRenderer content={homePage.content} /> : <p>Welcome to {school.name}</p>}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Latest News</CardTitle>
            <Newspaper className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {posts.slice(0, 3).length > 0 ? (
              <ul className="space-y-2">
                {posts.slice(0, 3).map((post) => (
                  <li key={post.id} className="text-sm">
                    {post.title}
                    {post.publishedAt ? ` - ${new Date(post.publishedAt).toLocaleDateString()}` : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No news yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notices</CardTitle>
            <Megaphone className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {notices?.slice(0, 3).length > 0 ? (
              <ul className="space-y-2">
                {notices.slice(0, 3).map((notice) => (
                  <li key={notice.id} className="text-sm">
                    {notice.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No notices yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {events.slice(0, 3).length > 0 ? (
              <ul className="space-y-2">
                {events.slice(0, 3).map((event) => (
                  <li key={event.id} className="text-sm">
                    {event.title}
                    {event.startAt ? ` - ${new Date(event.startAt).toLocaleDateString()}` : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No events yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quick Links</CardTitle>
            <GraduationCap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {menuPages.slice(0, 6).map((page) => (
                <li key={page.id}>
                  <Link href={`/${page.slug}`} className="text-sm flex items-center hover:underline">
                    {page.title} <ChevronRight className="size-3 ml-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </PublicShell>
  );
}
