import { notFound } from 'next/navigation';
import { fetchSite, fetchPage } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Building2, GraduationCap, Users } from 'lucide-react';

export default async function AboutPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPage('about').catch(() => null)]);
  const { school, staff } = site;

  if (!site.school) notFound();

  const facilities = Array.isArray(school.facilities) ? school.facilities : [];
  const awards = Array.isArray(school.awards) ? school.awards : [];
  const leadership = staff.filter((s) => s.isPublished).sort((a, b) => a.order - b.order);

  return (
    <PublicShell site={site}>
      {/* Banner */}
      <section className="bg-[var(--school-primary)] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">About {school.name}</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">Learn about our history, values, leadership and the facilities we offer.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
        {/* History */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Our History</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {page ? <MarkdownRenderer content={page.content} /> : <p className="text-muted-foreground">{school.history || `Welcome to ${school.name}.`}</p>}
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Building2 className="size-5" /> At a Glance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {school.establishedYear && <p><span className="font-semibold">Established:</span> {school.establishedYear}</p>}
                  {school.enrollmentCount != null && <p><span className="font-semibold">Learners:</span> {school.enrollmentCount}</p>}
                  {school.teacherCount != null && <p><span className="font-semibold">Teachers:</span> {school.teacherCount}</p>}
                  {school.classroomCount != null && <p><span className="font-semibold">Classrooms:</span> {school.classroomCount}</p>}
                  {school.passRate != null && <p><span className="font-semibold">Pass Rate:</span> {school.passRate}%</p>}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission / Vision / Values */}
        {(school.mission || school.vision || school.values) && (
          <section className="bg-muted/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-3 gap-6">
              {school.mission && (
                <Card className="bg-background">
                  <CardHeader><CardTitle>Our Mission</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground">{school.mission}</p></CardContent>
                </Card>
              )}
              {school.vision && (
                <Card className="bg-background">
                  <CardHeader><CardTitle>Our Vision</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground">{school.vision}</p></CardContent>
                </Card>
              )}
              {school.values && (
                <Card className="bg-background">
                  <CardHeader><CardTitle>Our Values</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {school.values.split('\n').map((v, i) => v.trim() && <li key={i}>{v.trim()}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Facilities */}
        {facilities.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Our Facilities</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map((facility: any, i: number) => (
                <Card key={i}>
                  <CardContent className="flex items-start gap-3 pt-6">
                    <GraduationCap className="size-5 text-[var(--school-primary)] mt-0.5" />
                    <p className="text-muted-foreground">{typeof facility === 'string' ? facility : facility.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Awards & Achievements</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.map((award: any, i: number) => (
                <Card key={i}>
                  <CardContent className="flex items-start gap-3 pt-6">
                    <Award className="size-5 text-[var(--school-primary)] mt-0.5" />
                    <div>
                      <p className="font-semibold">{typeof award === 'string' ? award : award.title}</p>
                      {award.year && <p className="text-sm text-muted-foreground">{award.year}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* School Management / Staff */}
        {leadership.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><Users className="size-7" /> School Management</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadership.map((member) => (
                <Card key={member.id} className="overflow-hidden">
                  <div className="h-32 bg-muted/50 flex items-center justify-center">
                    {member.photoUrl ? <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" /> : <Users className="size-12 text-muted-foreground/50" />}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-[var(--school-primary)]">{member.role}</p>
                    {member.department && <p className="text-sm text-muted-foreground">{member.department}</p>}
                    {member.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{member.bio}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
