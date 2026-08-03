import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchSite, fetchPage } from '@/lib/api';
import { schoolMetadata } from '@/lib/metadata';
import { PublicShell } from '@/components/public/public-shell';
import { PageHeader } from '@/components/public/page-header';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Building2, GraduationCap, Users, FileText, BookOpen, Briefcase } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return schoolMetadata('About Us', 'Learn about our school history, staff, facilities and achievements.');
}

export default async function AboutPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPage('about').catch(() => null)]);
  const { school, staff, downloads } = site;

  if (!site.school) notFound();

  const facilities = Array.isArray(school.facilities) ? school.facilities : [];
  const awards = Array.isArray(school.awards) ? school.awards.filter((a) => a) : [];
  const publishedStaff = staff.filter((s) => s.isPublished).sort((a, b) => a.order - b.order);
  const management = publishedStaff.filter((s) => s.role.toLowerCase().includes('principal') || s.role.toLowerCase().includes('deputy') || s.role.toLowerCase().includes('head'));
  const departments = Array.from(new Set(publishedStaff.map((s) => s.department || 'General').filter(Boolean)));
  const policies = downloads?.filter((d) => d.category === 'policy' || d.title.toLowerCase().includes('policy')) || [];
  const prospectus = downloads?.find((d) => d.title.toLowerCase().includes('prospectus'));

  return (
    <PublicShell site={site}>
      <PageHeader title={`About ${school.name}`} subtitle="Learn about our history, values, leadership and the facilities we offer." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20">
        {/* History */}
        <section>
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 animate-fade-in-up">
              <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-2">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our History</h2>
              {page ? (
                <div className="prose max-w-none text-muted-foreground leading-relaxed">
                  <MarkdownRenderer content={page.content} />
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed">{school.history || `Welcome to ${school.name}.`}</p>
              )}
            </div>
            <div>
              <Card className="h-full border-l-4" style={{ borderLeftColor: 'var(--school-primary)' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Building2 className="size-5 text-[var(--school-primary)]" /> At a Glance</CardTitle>
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
          <section className="bg-muted/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-2">Our Foundation</p>
                <h2 className="text-3xl md:text-4xl font-bold">Mission, Vision & Values</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {school.mission && (
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-8">
                      <Briefcase className="size-8 text-[var(--school-primary)] mb-4" />
                      <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                      <p className="text-muted-foreground leading-relaxed">{school.mission}</p>
                    </CardContent>
                  </Card>
                )}
                {school.vision && (
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-8">
                      <GraduationCap className="size-8 text-[var(--school-primary)] mb-4" />
                      <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                      <p className="text-muted-foreground leading-relaxed">{school.vision}</p>
                    </CardContent>
                  </Card>
                )}
                {school.values && (
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-8">
                      <Award className="size-8 text-[var(--school-primary)] mb-4" />
                      <h3 className="text-xl font-bold mb-3">Our Values</h3>
                      <ul className="list-disc list-inside text-muted-foreground leading-relaxed">
                        {school.values.split('\n').map((v, i) => v.trim() && <li key={i}>{v.trim()}</li>)}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Facilities */}
        {facilities.length > 0 && (
          <section>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-2">World-Class Facilities</p>
              <h2 className="text-3xl md:text-4xl font-bold">Our Facilities</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility: any, i: number) => (
                <Card key={i} className="hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="p-2 rounded-lg bg-[var(--school-primary)]/10 text-[var(--school-primary)]">
                      <GraduationCap className="size-5" />
                    </div>
                    <p className="text-muted-foreground">{typeof facility === 'string' ? facility : facility.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Staff directory */}
        {publishedStaff.length > 0 && (
          <section>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-2">Our People</p>
              <h2 className="text-3xl md:text-4xl font-bold">Staff Directory</h2>
            </div>
            <Tabs defaultValue={departments[0] || 'All'}>
              <TabsList className="flex-wrap h-auto mb-8">
                {departments.map((dept) => (
                  <TabsTrigger key={dept} value={dept}>{dept}</TabsTrigger>
                ))}
                <TabsTrigger value="Management">Management</TabsTrigger>
              </TabsList>
              {departments.map((dept) => {
                const members = publishedStaff.filter((s) => (s.department || 'General') === dept);
                return (
                  <TabsContent key={dept} value={dept}>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {members.map((member) => (
                        <Card key={member.id} className="text-center overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                          <div className="h-36 bg-muted/50 relative">
                            {member.photoUrl ? (
                              <img src={member.photoUrl} alt={member.name} loading="lazy" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                                <Users className="size-12" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-5">
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-[var(--school-primary)]">{member.role}</p>
                            {member.department && <p className="text-xs text-muted-foreground mt-1">{member.department}</p>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                );
              })}
              <TabsContent value="Management">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {management.map((member) => (
                    <Card key={member.id} className="text-center overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                      <div className="h-36 bg-muted/50 relative">
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                            <Users className="size-12" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-[var(--school-primary)]">{member.role}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>
        )}

        {/* Policies & Prospectus */}
        <section className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
            <CardContent className="p-8">
              <FileText className="size-10 text-[var(--school-primary)] mb-4" />
              <h3 className="text-2xl font-bold mb-2">School Policies</h3>
              <p className="text-muted-foreground mb-6">Access our admissions, behaviour, uniform and safety policies.</p>
              {policies.length > 0 ? (
                <ul className="space-y-2 mb-6">
                  {policies.slice(0, 4).map((p) => (
                    <li key={p.id}>
                      <a href={p.fileUrl || '#'} target="_blank" rel="noreferrer" className="text-sm text-[var(--school-primary)] hover:underline flex items-center gap-2">
                        <FileText className="size-4" /> {p.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground mb-6">Policies will be published soon.</p>
              )}
              <Link href="/downloads" className="text-sm font-semibold text-[var(--school-primary)] hover:underline">View all documents</Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
            <CardContent className="p-8">
              <BookOpen className="size-10 text-[var(--school-primary)] mb-4" />
              <h3 className="text-2xl font-bold mb-2">School Prospectus</h3>
              <p className="text-muted-foreground mb-6">Download our prospectus to learn more about what we offer.</p>
              {prospectus && prospectus.fileUrl ? (
                <a href={prospectus.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[var(--school-primary)] font-semibold hover:underline">
                  <FileText className="size-4" /> Download prospectus
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">Prospectus will be available soon.</p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Awards */}
        {awards.length > 0 && (
          <section className="bg-muted/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-2">Excellence</p>
                <h2 className="text-3xl md:text-4xl font-bold">Awards & Achievements</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {awards.map((award: any, i: number) => (
                  <Card key={i} className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardContent className="p-6">
                      <Award className="size-10 mx-auto mb-4 text-[var(--school-primary)]" />
                      <p className="font-semibold text-lg">{award.title || award}</p>
                      {award.year && <p className="text-sm text-muted-foreground">{award.year}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
