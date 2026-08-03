import type { Metadata } from 'next';
import { fetchSite } from '@/lib/api';
import { schoolMetadata } from '@/lib/metadata';
import { PublicShell } from '@/components/public/public-shell';
import { PageHeader } from '@/components/public/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Calendar } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return schoolMetadata('Notices', 'Important school notices and announcements.');
}

export default async function NoticesPage() {
  const site = await fetchSite();
  const { school, notices = [] } = site;

  return (
    <PublicShell site={site}>
      <PageHeader title="Notices" subtitle={`Important announcements from ${school.name}.`} />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {notices.length === 0 ? (
          <div className="text-center py-20">
            <Megaphone className="size-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">No notices available.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {notices.map((notice) => (
              <Card key={notice.id} className="hover:shadow-lg transition-all hover:-translate-y-1 border-l-4" style={{ borderLeftColor: 'var(--school-primary)' }}>
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <div className="p-2 rounded-lg bg-[var(--school-primary)]/10 text-[var(--school-primary)]">
                    <Megaphone className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{notice.title}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="size-3" />
                      {notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString() : ''} · Audience: {notice.audience}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-muted-foreground leading-relaxed">{notice.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  );
}
