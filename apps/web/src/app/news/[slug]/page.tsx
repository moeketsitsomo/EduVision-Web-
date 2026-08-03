import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = await fetchSite().catch(() => null);
  const post = site?.posts.find((p) => p.slug === slug);
  if (!site || !post) return { title: 'News Article | EduVision' };
  return {
    title: `${post.title} | ${site.school.name}`,
    description: post.summary || post.title,
    openGraph: { title: post.title, description: post.summary || '' },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const site = await fetchSite();
  const post = site.posts.find((p) => p.slug === slug && p.isPublished);

  if (!post) notFound();

  return (
    <PublicShell site={site}>
      <section className="bg-[var(--school-primary)] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/news" className="text-sm opacity-90 hover:underline flex items-center gap-1 mb-4 w-fit">
            <ChevronLeft className="size-4" /> Back to News
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 opacity-90 text-sm">
            <span className="flex items-center gap-1"><Calendar className="size-4" /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently published'}</span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <Card className="overflow-hidden">
          {post.featuredImageUrl && (
            <div className="h-72 md:h-96">
              <img src={post.featuredImageUrl} alt={post.title} loading="eager" className="w-full h-full object-cover" />
            </div>
          )}
          <CardContent className="p-8 md:p-10">
            {post.summary && <p className="text-xl text-muted-foreground mb-8 italic leading-relaxed">{post.summary}</p>}
            <div className="prose dark:prose-invert max-w-none text-foreground leading-relaxed">
              <MarkdownRenderer content={post.content || ''} />
            </div>
          </CardContent>
        </Card>
      </section>
    </PublicShell>
  );
}
