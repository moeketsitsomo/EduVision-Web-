import { fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function NewsPage() {
  const site = await fetchSite();
  const newsPosts = site.posts.filter((p) => p.category === 'news' || p.category === 'announcement');

  return (
    <PublicShell site={site}>
      <section className="bg-[var(--school-primary)] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">News & Announcements</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">Stay up to date with the latest from {site.school.name}.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {newsPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden flex flex-col">
                {post.featuredImageUrl && (
                  <div className="h-48 bg-muted/50">
                    <img src={post.featuredImageUrl} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href={`/news/${post.slug}`} className="hover:text-[var(--school-primary)]">{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  {post.summary && <p className="text-muted-foreground text-sm line-clamp-3">{post.summary}</p>}
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently published'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No news or announcements have been published yet.</p>
        )}
      </section>
    </PublicShell>
  );
}
