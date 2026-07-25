import { fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

export default async function CalendarPage() {
  const site = await fetchSite();
  const { events } = site;

  return (
    <PublicShell site={site}>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">School Calendar</h1>
        {events.length === 0 ? (
          <p className="text-muted-foreground">No events scheduled.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <CalendarDays className="size-5 text-[var(--school-primary)]" />
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {event.startAt ? new Date(event.startAt).toLocaleString() : ''}
                    {event.location ? ` · ${event.location}` : ''}
                  </p>
                  {event.description && <p className="mt-2">{event.description}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  );
}
