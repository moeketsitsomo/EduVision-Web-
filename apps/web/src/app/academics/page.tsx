import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchSite, fetchPage } from '@/lib/api';
import { schoolMetadata } from '@/lib/metadata';
import { PublicShell } from '@/components/public/public-shell';
import { PageHeader } from '@/components/public/page-header';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Clock, GraduationCap, CheckCircle2 } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return schoolMetadata('Academics', 'Explore our subjects, curriculum, timetable and academic calendar.');
}

export default async function AcademicsPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPage('academics').catch(() => null)]);
  const { school, subjects, events } = site;

  if (!school) notFound();

  const academicEvents = events.filter((e) => e.category === 'academic' || e.title.toLowerCase().includes('exam') || e.title.toLowerCase().includes('assessment'));
  const calendarEvents = events.filter((e) => e.category === 'academic' || e.category === 'general').slice(0, 8);
  const categories = Array.from(new Set(subjects.map((s) => s.category || 'General')));

  return (
    <PublicShell site={site}>
      <PageHeader title="Academics" subtitle="Curriculum, subjects, timetables and examination information." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20">
        {page && (
          <section className="max-w-3xl mx-auto text-center">
            <div className="prose max-w-none text-muted-foreground leading-relaxed">
              <MarkdownRenderer content={page.content} />
            </div>
          </section>
        )}

        {/* Subjects */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-2">Curriculum</p>
            <h2 className="text-3xl md:text-4xl font-bold">Subjects Offered</h2>
          </div>
          {subjects.length > 0 ? (
            <Tabs defaultValue={categories[0] || 'All'}>
              <TabsList className="flex-wrap h-auto justify-center mb-8">
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                ))}
              </TabsList>
              {categories.map((cat) => (
                <TabsContent key={cat} value={cat}>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.filter((s) => (s.category || 'General') === cat).sort((a, b) => a.order - b.order).map((subject) => (
                      <Card key={subject.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="size-5 text-[var(--school-primary)]" /> {subject.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {subject.code && <p className="text-sm text-muted-foreground mb-1">Code: {subject.code}</p>}
                          {subject.grade && <p className="text-sm text-muted-foreground mb-1">Grade: {subject.grade}</p>}
                          {subject.description && <p className="text-sm text-muted-foreground">{subject.description}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <p className="text-muted-foreground text-center">No subjects have been published yet.</p>
          )}
        </section>

        {/* Curriculum & Timetable */}
        <section className="bg-muted/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="bg-background hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><GraduationCap className="size-6 text-[var(--school-primary)]" /> Curriculum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">Our school follows the national curriculum with a strong emphasis on literacy, numeracy, science, technology, creative arts and physical education.</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="size-4 text-[var(--school-primary)] mt-0.5" /> CAPS-aligned programmes</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="size-4 text-[var(--school-primary)] mt-0.5" /> Continuous assessment</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="size-4 text-[var(--school-primary)] mt-0.5" /> Formal examinations</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="size-4 text-[var(--school-primary)] mt-0.5" /> Extra classes and remediation</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-background hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Clock className="size-6 text-[var(--school-primary)]" /> Timetable</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">The school day runs from 07:30 to 14:30. Each class has a structured timetable covering all subjects, with breaks for sport, culture and lunch.</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="size-4 text-[var(--school-primary)] mt-0.5" /> Morning assembly</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="size-4 text-[var(--school-primary)] mt-0.5" /> Core subject blocks</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="size-4 text-[var(--school-primary)] mt-0.5" /> Sport and culture periods</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="size-4 text-[var(--school-primary)] mt-0.5" /> Aftercare until 17:00</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Academic calendar */}
        {(calendarEvents.length > 0 || academicEvents.length > 0) && (
          <section>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-2">Plan Ahead</p>
              <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2"><Calendar className="size-8" /> Academic Calendar</h2>
            </div>
            {calendarEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {calendarEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-all hover:-translate-y-1">
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="shrink-0 w-14 h-14 rounded-xl bg-[var(--school-primary)]/10 text-[var(--school-primary)] flex flex-col items-center justify-center text-center">
                        <span className="text-xs uppercase font-semibold">{event.startAt ? new Date(event.startAt).toLocaleString('en-US', { month: 'short' }) : ''}</span>
                        <span className="text-xl font-bold leading-none">{event.startAt ? new Date(event.startAt).getDate() : ''}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
                        <p className="text-sm text-muted-foreground">{event.allDay ? 'All day' : ''} {event.startAt ? new Date(event.startAt).toLocaleDateString() : ''} {event.endAt ? `– ${new Date(event.endAt).toLocaleDateString()}` : ''}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center">No upcoming academic events.</p>
            )}
          </section>
        )}
      </div>
    </PublicShell>
  );
}
