import { fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default async function EventsPage() {
  const site = await fetchSite();
  const { events } = site;

  const sorted = [...events].sort((a, b) => {
    const da = a.startAt ? new Date(a.startAt).getTime() : 0;
    const db = b.startAt ? new Date(b.startAt).getTime() : 0;
    return da - db;
  });

  return (
    <PublicShell site={site}>
      <section className="bg-[var(--school-primary)] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">Events Calendar</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">Sports, cultural activities, meetings and academic events.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {sorted.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((event) => (
              <Card key={event.id} className="flex flex-col">
                <CardContent className="pt-6 flex-1">
                  <div className="flex items-start gap-4">
                    <div className="bg-[var(--school-primary)]/10 text-[var(--school-primary)] rounded-lg p-3 text-center min-w-[64px]">
                      <span className="block text-xs font-semibold uppercase">{event.startAt ? new Date(event.startAt).toLocaleString('default', { month: 'short' }) : 'TBA'}</span>
                      <span className="block text-2xl font-bold">{event.startAt ? new Date(event.startAt).getDate() : '—'}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      {event.category && <p className="text-xs uppercase tracking-wide text-muted-foreground">{event.category}</p>}
                      {event.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{event.description}</p>}
                      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                        {event.location && <p className="flex items-center gap-1"><MapPin className="size-3.5" /> {event.location}</p>}
                        {event.startAt && (
                          <p className="flex items-center gap-1"><Clock className="size-3.5" />
                            {event.allDay ? 'All day' : new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {event.endAt && !event.allDay ? ` – ${new Date(event.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No events have been published yet.</p>
        )}
      </section>
    </PublicShell>
  );
}
