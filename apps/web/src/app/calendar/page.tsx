import type { Metadata } from 'next';
import { fetchSite } from '@/lib/api';
import { schoolMetadata } from '@/lib/metadata';
import { PublicShell } from '@/components/public/public-shell';
import { PageHeader } from '@/components/public/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, MapPin, Clock, Tag } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return schoolMetadata('Academic Calendar', 'View the school academic calendar and upcoming events.');
}

export default async function CalendarPage() {
  const site = await fetchSite();
  const { school, events } = site;
  const sorted = [...events].sort((a, b) => {
    const da = a.startAt ? new Date(a.startAt).getTime() : 0;
    const db = b.startAt ? new Date(b.startAt).getTime() : 0;
    return da - db;
  });

  return (
    <PublicShell site={site}>
      <PageHeader title="School Calendar" subtitle={`All upcoming events at ${school.name}.`} />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDays className="size-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">No events scheduled.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sorted.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-all hover:-translate-y-1 border-l-4" style={{ borderLeftColor: 'var(--school-primary)' }}>
                <CardHeader className="flex flex-col sm:flex-row sm:items-start gap-4 pb-2">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[var(--school-primary)] text-white text-center min-w-[64px]">
                      <span className="block text-xs font-semibold uppercase">{event.startAt ? new Date(event.startAt).toLocaleString('en-US', { month: 'short' }) : 'TBA'}</span>
                      <span className="block text-2xl font-bold">{event.startAt ? new Date(event.startAt).getDate() : '—'}</span>
                    </div>
                    <div>
                      {event.category && <span className="text-xs uppercase tracking-wide text-[var(--school-primary)] font-semibold flex items-center gap-1 mb-1"><Tag className="size-3" /> {event.category}</span>}
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  {event.startAt && (
                    <p className="flex items-center gap-2"><Clock className="size-4" />
                      {event.allDay ? 'All day' : new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {event.endAt && !event.allDay ? ` – ${new Date(event.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                    </p>
                  )}
                  {event.location && <p className="flex items-center gap-2"><MapPin className="size-4" /> {event.location}</p>}
                  {event.description && <p className="text-foreground pt-2">{event.description}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  );
}
