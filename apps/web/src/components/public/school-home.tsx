import Link from 'next/link';
import { fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Newspaper, GraduationCap, ChevronRight, Megaphone, Users, BookOpen, School, Award } from 'lucide-react';
import { StatCard } from './stat-card';

export async function SchoolHome() {
  const site = await fetchSite();
  const { school, pages, posts, events, notices, staff, subjects } = site;
  const homePage = pages.find((p) => p.slug === 'home') || pages[0];
  const menuPages = pages
    .filter((p) => p.showInMenu)
    .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));

  const stats = [
    { label: 'Learners', value: school.enrollmentCount, icon: Users },
    { label: 'Teachers', value: school.teacherCount, icon: BookOpen },
    { label: 'Classrooms', value: school.classroomCount, icon: School },
    { label: 'Pass Rate', value: school.passRate ? `${school.passRate}%` : undefined, icon: Award },
  ].filter((s) => s.value != null);

  const quickLinks = menuPages.slice(0, 6);

  return (
    <PublicShell site={site}>
      {/* Hero */}
      <section
        className="relative bg-[var(--school-primary)] text-white py-24 md:py-32"
        style={school.bannerImageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${school.bannerImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        aria-label="School hero"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold">{school.websiteTitle || school.name}</h1>
            <p className="mt-4 text-lg md:text-xl opacity-90 max-w-2xl">{school.metaDescription}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="bg-white text-[var(--school-primary)] hover:bg-gray-100">
                <Link href="/about">About Us</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/admissions">Apply Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Principal message + intro */}
      {(school.principalName || school.principalMessage || homePage) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-4">Welcome to {school.name}</h2>
              {homePage ? (
                <div className="prose max-w-none text-muted-foreground">
                  <MarkdownRenderer content={homePage.content.replace(/^#\s.*$/m, '').trim() || homePage.content} />
                </div>
              ) : (
                <p className="text-muted-foreground">Welcome to {school.name}</p>
              )}
            </div>
            {(school.principalName || school.principalMessage) && (
              <Card className="bg-muted/30 border-l-4" style={{ borderLeftColor: 'var(--school-primary)' }}>
                <CardHeader>
                  <CardTitle>Principal&apos;s Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {school.principalMessage && <p className="text-muted-foreground italic mb-4">&ldquo;{school.principalMessage}&rdquo;</p>}
                  {school.principalName && <p className="font-semibold">— {school.principalName}</p>}
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Mission / Vision / Values */}
      {(school.mission || school.vision || school.values) && (
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {school.mission && (
                <Card>
                  <CardHeader><CardTitle>Our Mission</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground">{school.mission}</p></CardContent>
                </Card>
              )}
              {school.vision && (
                <Card>
                  <CardHeader><CardTitle>Our Vision</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground">{school.vision}</p></CardContent>
                </Card>
              )}
              {school.values && (
                <Card>
                  <CardHeader><CardTitle>Our Values</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {school.values.split('\n').map((v, i) => v.trim() && <li key={i}>{v.trim()}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {stats.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />)}
          </div>
        </section>
      )}

      {/* Cards: News, Notices, Events, Quick Links, Staff preview, Subjects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Latest News</CardTitle>
            <Newspaper className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {posts.slice(0, 4).length > 0 ? (
              <ul className="space-y-2">
                {posts.slice(0, 4).map((post) => (
                  <li key={post.id} className="text-sm">
                    <Link href={`/news/${post.slug}`} className="hover:underline">{post.title}</Link>
                    {post.publishedAt ? <span className="text-muted-foreground ml-1">— {new Date(post.publishedAt).toLocaleDateString()}</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No news yet.</p>
            )}
            <Link href="/news" className="text-sm text-[var(--school-primary)] hover:underline mt-3 inline-block">View all news</Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notices</CardTitle>
            <Megaphone className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {notices?.slice(0, 4).length > 0 ? (
              <ul className="space-y-2">
                {notices.slice(0, 4).map((notice) => (
                  <li key={notice.id} className="text-sm">
                    <Link href="/notices" className="hover:underline">{notice.title}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No notices yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {events.slice(0, 4).length > 0 ? (
              <ul className="space-y-2">
                {events.slice(0, 4).map((event) => (
                  <li key={event.id} className="text-sm">
                    <Link href="/events" className="hover:underline">{event.title}</Link>
                    {event.startAt ? <span className="text-muted-foreground ml-1">— {new Date(event.startAt).toLocaleDateString()}</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No events yet.</p>
            )}
            <Link href="/events" className="text-sm text-[var(--school-primary)] hover:underline mt-3 inline-block">View calendar</Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quick Links</CardTitle>
            <GraduationCap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {quickLinks.slice(0, 8).map((page) => (
                <li key={page.id}>
                  <Link href={`/${page.slug}`} className="text-sm flex items-center hover:underline">
                    {page.title} <ChevronRight className="size-3 ml-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Leadership</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {staff.slice(0, 3).length > 0 ? (
              <ul className="space-y-2">
                {staff.slice(0, 3).map((member) => (
                  <li key={member.id} className="text-sm flex items-center gap-2">
                    {member.photoUrl && <img src={member.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />}
                    <span>{member.name} <span className="text-muted-foreground">— {member.role}</span></span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">No staff listed.</p>}
            <Link href="/about" className="text-sm text-[var(--school-primary)] hover:underline mt-3 inline-block">Meet the team</Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {subjects.slice(0, 5).length > 0 ? (
              <ul className="space-y-1">
                {subjects.slice(0, 5).map((subject) => (
                  <li key={subject.id} className="text-sm">{subject.name}</li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">No subjects listed.</p>}
            <Link href="/academics" className="text-sm text-[var(--school-primary)] hover:underline mt-3 inline-block">View academics</Link>
          </CardContent>
        </Card>
      </section>
    </PublicShell>
  );
}
