import type { Metadata } from 'next';
import { fetchSite } from '@/lib/api';
import { schoolMetadata } from '@/lib/metadata';
import { PublicShell } from '@/components/public/public-shell';
import { PageHeader } from '@/components/public/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return schoolMetadata('Events Calendar', 'Upcoming school events, sports, cultural activities and calendar.');
}

export default async function EventsPage() {
  const site = await fetchSite();
  const { events } = site;

  const sorted = [...events].sort((a, b) => {
    const da = a.startAt ? new Date(a.startAt).getTime() : 0;
    const db = b.startAt ? new Date(b.startAt).getTime() : 0;
    return da - db;
  });

  const categories = Array.from(new Set(events.map((e) => e.category).filter(Boolean)));

  return (
    <PublicShell site={site}>
      <PageHeader title="Events Calendar" subtitle="Sports, cultural activities, meetings and academic events." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <span key={cat} className="text-sm px-3 py-1 rounded-full bg-[var(--school-primary)]/10 text-[var(--school-primary)] font-medium">{cat}</span>
            ))}
          </div>
        )}

        {sorted.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                <CardContent className="p-0">
                  <div className="flex items-start gap-5 p-6">
                    <div className="bg-[var(--school-primary)] text-white rounded-2xl p-4 text-center min-w-[72px] shadow-md">
                      <span className="block text-xs font-semibold uppercase">{event.startAt ? new Date(event.startAt).toLocaleString('en-US', { month: 'short' }) : 'TBA'}</span>
                      <span className="block text-2xl font-bold">{event.startAt ? new Date(event.startAt).getDate() : '—'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {event.category && <span className="text-xs uppercase tracking-wide text-[var(--school-primary)] font-semibold flex items-center gap-1"><Tag className="size-3" /> {event.category}</span>}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                      {event.description && <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>}
                    </div>
                  </div>
                  <div className="border-t px-6 py-4 bg-muted/30 text-sm text-muted-foreground space-y-1">
                    {event.location && <p className="flex items-center gap-2"><MapPin className="size-4" /> {event.location}</p>}
                    {event.startAt && (
                      <p className="flex items-center gap-2"><Clock className="size-4" />
                        {event.allDay ? 'All day' : new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {event.endAt && !event.allDay ? ` – ${new Date(event.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar className="size-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">No events have been published yet.</p>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
