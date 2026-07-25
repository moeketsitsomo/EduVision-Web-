import { notFound } from 'next/navigation';
import { fetchPage, fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { MarkdownRenderer } from '@/components/markdown-renderer';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function PagePage({ params }: Props) {
  const { slug } = await params;
  const [site, page] = await Promise.all([
    fetchSite(),
    fetchPage(slug.join('/')).catch(() => null),
  ]);

  if (!page) notFound();

  return (
    <PublicShell site={site}>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
        {page.subtitle && (
          <p className="text-lg text-muted-foreground mb-8">{page.subtitle}</p>
        )}
        <MarkdownRenderer content={page.content} />
      </section>
    </PublicShell>
  );
}
