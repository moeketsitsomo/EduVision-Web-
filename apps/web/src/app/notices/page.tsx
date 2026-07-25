import { fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

export default async function NoticesPage() {
  const site = await fetchSite();
  const { school, notices = [] } = site;

  return (
    <PublicShell site={site}>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">Notices</h1>
        {notices.length === 0 ? (
          <p className="text-muted-foreground">No notices available.</p>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <Card key={notice.id}>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <Megaphone className="size-5 text-[var(--school-primary)]" />
                  <CardTitle className="text-lg">{notice.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString() : ''} · Audience: {notice.audience}
                  </p>
                  <p className="whitespace-pre-line">{notice.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  );
}
