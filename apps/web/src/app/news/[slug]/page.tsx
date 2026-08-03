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

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const site = await fetchSite();
  const post = site.posts.find((p) => p.slug === slug && p.isPublished);

  if (!post) notFound();

  return (
    <PublicShell site={site}>
      <section className="bg-[var(--school-primary)] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/news" className="text-sm opacity-90 hover:underline flex items-center gap-1 mb-4"><ChevronLeft className="size-4" /> Back to News</Link>
          <h1 className="text-3xl md:text-5xl font-bold">{post.title}</h1>
          <div className="mt-4 flex items-center gap-2 opacity-90 text-sm">
            <Calendar className="size-4" />
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently published'}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="pt-6">
            {post.summary && <p className="text-lg text-muted-foreground mb-6 italic">{post.summary}</p>}
            {post.featuredImageUrl && <img src={post.featuredImageUrl} alt={post.title} className="w-full h-auto rounded-lg mb-6" />}
            <MarkdownRenderer content={post.content || ''} />
          </CardContent>
        </Card>
      </section>
    </PublicShell>
  );
}
