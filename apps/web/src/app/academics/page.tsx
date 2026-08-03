import { notFound } from 'next/navigation';
import { fetchSite, fetchPage } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Clock, GraduationCap } from 'lucide-react';

export default async function AcademicsPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPage('academics').catch(() => null)]);
  const { school, subjects, events } = site;

  if (!school) notFound();

  const academicEvents = events.filter((e) => e.category === 'academic' || e.title.toLowerCase().includes('exam') || e.title.toLowerCase().includes('assessment'));
  const calendarEvents = events.filter((e) => e.category === 'academic' || e.category === 'general').slice(0, 10);

  return (
    <PublicShell site={site}>
      <section className="bg-[var(--school-primary)] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">Academics</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">Curriculum, subjects, timetables and examination information.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
        {page && (
          <section>
            <MarkdownRenderer content={page.content} />
          </section>
        )}

        {/* Subjects */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><BookOpen className="size-7" /> Subjects Offered</h2>
          {subjects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.sort((a, b) => a.order - b.order).map((subject) => (
                <Card key={subject.id}>
                  <CardHeader>
                    <CardTitle>{subject.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {subject.code && <p className="text-sm text-muted-foreground mb-1">Code: {subject.code}</p>}
                    {subject.grade && <p className="text-sm text-muted-foreground mb-1">Grade: {subject.grade}</p>}
                    {subject.category && <p className="text-sm text-muted-foreground mb-2">Category: {subject.category}</p>}
                    {subject.description && <p className="text-sm text-muted-foreground">{subject.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No subjects have been published yet.</p>
          )}
        </section>

        {/* Curriculum info */}
        <section className="bg-muted/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-background">
              <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="size-5" /> Curriculum</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Our school follows the national curriculum with a strong emphasis on literacy, numeracy, science, technology, creative arts and physical education. Learners are assessed continuously and through formal examinations.</p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="size-5" /> Timetable</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">The school day runs from 07:30 to 14:30. Each class has a structured timetable covering all subjects, with breaks for sport, culture and lunch. Detailed class timetables are available from the school office.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Academic calendar / exam events */}
        {(calendarEvents.length > 0 || academicEvents.length > 0) && (
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><Calendar className="size-7" /> Academic Calendar</h2>
            {calendarEvents.length > 0 ? (
              <div className="space-y-4">
                {calendarEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.allDay ? 'All day' : null}
                        {event.startAt ? ` ${new Date(event.startAt).toLocaleDateString()}` : ''}
                        {event.endAt ? ` – ${new Date(event.endAt).toLocaleDateString()}` : ''}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming academic events.</p>
            )}
          </section>
        )}
      </div>
    </PublicShell>
  );
}
