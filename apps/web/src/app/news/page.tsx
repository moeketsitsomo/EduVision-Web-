import type { Metadata } from 'next';
import { fetchSite } from '@/lib/api';
import { schoolMetadata } from '@/lib/metadata';
import { PublicShell } from '@/components/public/public-shell';
import { PageHeader } from '@/components/public/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Newspaper, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return schoolMetadata('News & Announcements', 'Latest school news, announcements and updates.');
}

export default async function NewsPage() {
  const site = await fetchSite();
  const newsPosts = site.posts.filter((p) => p.category === 'news' || p.category === 'announcement');

  return (
    <PublicShell site={site}>
      <PageHeader title="News & Announcements" subtitle={`Stay up to date with the latest from ${site.school.name}.`} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {newsPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsPosts.map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`} className="group block">
                <Card className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="h-52 bg-muted/50 relative overflow-hidden">
                    {post.featuredImageUrl ? (
                      <img src={post.featuredImageUrl} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                        <Newspaper className="size-12" />
                      </div>
                    )}
                  </div>
                  <CardContent className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="size-3.5" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently published'}
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-[var(--school-primary)] transition-colors">{post.title}</h3>
                    {post.summary && <p className="text-muted-foreground text-sm line-clamp-3 flex-1">{post.summary}</p>}
                    <span className="text-sm font-semibold text-[var(--school-primary)] mt-4 inline-flex items-center">
                      Read more <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Newspaper className="size-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">No news or announcements have been published yet.</p>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
