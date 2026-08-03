import Link from 'next/link';
import { fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper, GraduationCap, ChevronRight, Megaphone, Users, BookOpen, School, Award, Target, Eye, HeartHandshake, ArrowRight, PlayCircle } from 'lucide-react';
import { StatCard } from './stat-card';

const CORE_NAV_SLUGS = new Set([
  'home', 'about', 'academics', 'admissions', 'news', 'events', 'gallery', 'contact', 'portal',
]);

export async function SchoolHome() {
  const site = await fetchSite();
  const { school, pages, posts, events, notices, staff, subjects, galleries } = site;
  const homePage = pages.find((p) => p.slug === 'home') || pages[0];
  const menuPages = pages
    .filter((p) => p.showInMenu && !CORE_NAV_SLUGS.has(p.slug))
    .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));

  const stats = [
    { label: 'Learners', value: school.enrollmentCount, icon: Users },
    { label: 'Teachers', value: school.teacherCount, icon: BookOpen },
    { label: 'Classrooms', value: school.classroomCount, icon: School },
    { label: 'Pass Rate', value: school.passRate ? `${school.passRate}%` : undefined, icon: Award },
  ].filter((s) => s.value != null);

  const quickLinks = menuPages.slice(0, 8);
  const upcomingEvents = events.filter((e) => e.startAt && new Date(e.startAt) >= new Date()).slice(0, 3);
  const latestPosts = posts.slice(0, 3);
  const awards = Array.isArray(school.awards) ? school.awards.filter((a) => a) : [];
  const leadership = staff.filter((s) => s.isPublished).sort((a, b) => a.order - b.order).slice(0, 4);
  const previewGallery = galleries?.[0];

  const heroBg = school.bannerImageUrl
    ? { backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${school.bannerImageUrl})` }
    : {};

  return (
    <PublicShell site={site}>
      {/* Hero */}
      <section
        className="relative text-white overflow-hidden py-28 md:py-40 bg-[var(--school-primary)]"
        style={{ ...heroBg, backgroundSize: 'cover', backgroundPosition: 'center' }}
        aria-label="School hero"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--school-primary)]/90 to-[var(--school-primary)]/60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-sm font-medium mb-6">
              <School className="size-4" /> Welcome to {school.name}
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              {school.websiteTitle || school.name}
            </h1>
            <p className="mt-6 text-lg md:text-2xl opacity-95 max-w-2xl leading-relaxed">
              {school.metaDescription}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-[var(--school-primary)] hover:bg-gray-100 shadow-lg">
                <Link href="/admissions">Apply Now <ArrowRight className="size-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/15">
                <Link href="/about">Discover Our School</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />)}
          </div>
        </section>
      )}

      {/* Principal + Welcome */}
      {(school.principalName || school.principalMessage || homePage) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 md:pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="animate-fade-in-up">
              <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-2">About Us</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Welcome to {school.name}</h2>
              {homePage ? (
                <div className="prose max-w-none text-muted-foreground leading-relaxed">
                  <MarkdownRenderer content={homePage.content.replace(/^#\s.*$/m, '').trim() || homePage.content} />
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed">Welcome to {school.name}</p>
              )}
              <Button asChild variant="outline" className="mt-6">
                <Link href="/about">Learn more <ChevronRight className="size-4 ml-1" /></Link>
              </Button>
            </div>
            {(school.principalName || school.principalMessage) && (
              <Card className="bg-gradient-to-br from-muted/50 to-background border-l-4 shadow-lg" style={{ borderLeftColor: 'var(--school-primary)' }}>
                <CardContent className="p-8">
                  <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-4">Principal&apos;s Message</p>
                  {school.principalMessage && (
                    <p className="text-xl md:text-2xl font-medium italic leading-relaxed mb-6">
                      &ldquo;{school.principalMessage}&rdquo;
                    </p>
                  )}
                  {school.principalName && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--school-primary)]/10 flex items-center justify-center text-[var(--school-primary)] font-bold">
                        {school.principalName.charAt(0)}
                      </div>
                      <p className="font-semibold">— {school.principalName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Mission / Vision / Values */}
      {(school.mission || school.vision || school.values) && (
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-2">What We Stand For</p>
              <h2 className="text-3xl md:text-4xl font-bold">Mission, Vision & Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Our Mission', text: school.mission, icon: Target },
                { title: 'Our Vision', text: school.vision, icon: Eye },
                { title: 'Our Values', text: school.values, icon: HeartHandshake },
              ].filter((i) => i.text).map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--school-primary)]/10 text-[var(--school-primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icon className="size-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      {item.title === 'Our Values' ? (
                        <ul className="list-disc list-inside text-muted-foreground leading-relaxed">
                          {String(item.text).split('\n').map((v, i) => v.trim() && <li key={i}>{v.trim()}</li>)}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground leading-relaxed">{String(item.text)}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured News + Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* News */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-1">Stay Informed</p>
                <h2 className="text-3xl font-bold">Latest News</h2>
              </div>
              <Button asChild variant="ghost" className="text-[var(--school-primary)]">
                <Link href="/news">View all <ArrowRight className="size-4 ml-1" /></Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {latestPosts.length > 0 ? latestPosts.map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="group block">
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="h-40 bg-muted relative overflow-hidden">
                      {post.featuredImageUrl ? (
                        <img src={post.featuredImageUrl} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                          <Newspaper className="size-10" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <p className="text-xs text-muted-foreground mb-2">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</p>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--school-primary)] transition-colors">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.summary || ''}</p>
                    </CardContent>
                  </Card>
                </Link>
              )) : <p className="text-muted-foreground">No news yet.</p>}
            </div>
          </div>

          {/* Events + Notices */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-1">Coming Up</p>
                <h2 className="text-3xl font-bold">Upcoming Events</h2>
              </div>
            </div>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                <Link key={event.id} href="/events" className="group block">
                  <Card className="hover:shadow-md transition-all duration-300 hover:border-[var(--school-primary)]/50">
                    <CardContent className="p-4 flex gap-4 items-start">
                      <div className="shrink-0 w-14 h-14 rounded-xl bg-[var(--school-primary)]/10 text-[var(--school-primary)] flex flex-col items-center justify-center text-center">
                        <span className="text-xs uppercase font-semibold">{event.startAt ? new Date(event.startAt).toLocaleString('en-US', { month: 'short' }) : ''}</span>
                        <span className="text-xl font-bold leading-none">{event.startAt ? new Date(event.startAt).getDate() : ''}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-[var(--school-primary)] transition-colors">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.location || ''}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )) : <p className="text-muted-foreground">No upcoming events.</p>}
            </div>

            {notices && notices.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Megaphone className="size-5" /> Notices</h3>
                <ul className="space-y-3">
                  {notices.slice(0, 3).map((notice) => (
                    <li key={notice.id}>
                      <Link href="/notices" className="text-sm hover:text-[var(--school-primary)] hover:underline">{notice.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Achievements */}
      {awards.length > 0 && (
        <section className="bg-[var(--school-secondary)] text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-sm font-semibold opacity-80 uppercase tracking-wide mb-2">Our Track Record</p>
              <h2 className="text-3xl md:text-4xl font-bold">Awards & Achievements</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {awards.map((award: any, i: number) => (
                <Card key={i} className="bg-white/10 border-white/10 text-white hover:bg-white/15 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Award className="size-10 mx-auto mb-4 opacity-90" />
                    <p className="font-semibold text-lg mb-1">{award.title || award}</p>
                    {award.year && <p className="text-sm opacity-75">{award.year}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Leadership preview */}
      {leadership.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-2">Meet The Team</p>
            <h2 className="text-3xl md:text-4xl font-bold">School Leadership</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((member) => (
              <Card key={member.id} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-28 bg-muted/50 relative">
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
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/about">View all staff</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Subjects + Gallery + Quick links */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Subjects */}
            <Card className="lg:col-span-2">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-[var(--school-primary)] uppercase tracking-wide mb-1">Curriculum</p>
                    <h3 className="text-2xl font-bold">Subjects Offered</h3>
                  </div>
                  <BookOpen className="size-8 text-[var(--school-primary)]" />
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {subjects.slice(0, 9).map((subject) => (
                    <div key={subject.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border hover:border-[var(--school-primary)]/50 transition-colors">
                      <GraduationCap className="size-5 text-[var(--school-primary)]" />
                      <span className="text-sm font-medium">{subject.name}</span>
                    </div>
                  ))}
                </div>
                <Button asChild variant="ghost" className="mt-6 text-[var(--school-primary)]">
                  <Link href="/academics">Explore academics <ArrowRight className="size-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Gallery preview */}
              {previewGallery && (
                <Card className="overflow-hidden">
                  <div className="h-40 bg-muted relative">
                    {previewGallery.coverImageUrl ? (
                      <img src={previewGallery.coverImageUrl} alt={previewGallery.title} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                        <PlayCircle className="size-10" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-1">{previewGallery.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{previewGallery.description || 'School life in pictures.'}</p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/gallery">Browse gallery</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Quick links */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    {quickLinks.map((page) => (
                      <li key={page.id}>
                        <Link href={`/${page.slug}`} className="text-sm flex items-center hover:text-[var(--school-primary)] hover:underline">
                          {page.title} <ChevronRight className="size-3 ml-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center p-10 md:p-16 bg-gradient-to-br from-[var(--school-primary)] to-[var(--school-primary)]/80 text-white border-0">
            <CardContent className="p-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to join {school.name}?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                Applications are open for the upcoming academic year. Discover what makes our school a place where every learner thrives.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-[var(--school-primary)] hover:bg-gray-100">
                  <Link href="/admissions">Apply Online</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/15">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicShell>
  );
}
