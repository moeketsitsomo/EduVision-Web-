'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { apiFetch, getToken } from '@/lib/admin-api';
import { toast } from 'sonner';
import type { SiteData } from '@/lib/types';
import { GraduationCap, FileText, CalendarDays, ClipboardList, BookOpen, Download, Bell, LogOut, Home, Clock, CheckCircle2, AlertCircle, XCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { BarChart, DonutChart } from '@/components/public/bar-chart';

type PortalUser = { id: string; email: string; firstName?: string; lastName?: string; role: string; school?: { name: string }; student?: { firstName: string; lastName?: string; grade?: string; studentNumber: string } | null };

export function PortalClient({ site }: { site: SiteData }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<PortalUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolSlug, setSchoolSlug] = useState(site.school.slug);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, schoolSlug }),
      });
      const data = await res.json() as { access_token?: string; message?: string };
      if (!res.ok || !data.access_token) throw new Error(data.message || 'Login failed');
      localStorage.setItem('eduvision_token', data.access_token);
      setToken(data.access_token);
      toast.success('Signed in');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const res = await apiFetch('/portal/me');
      const u = (await res.json()) as PortalUser;
      setUser(u);
    } catch (e: any) {
      toast.error('Failed to load portal');
      localStorage.removeItem('eduvision_token');
      setToken(null);
    }
  };

  useEffect(() => {
    const t = getToken();
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (token) loadUser();
  }, [token]);

  const logout = () => {
    localStorage.removeItem('eduvision_token');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <form onSubmit={handleLogin}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[var(--school-primary)]/10 flex items-center justify-center">
                <GraduationCap className="size-7 text-[var(--school-primary)]" />
              </div>
              <CardTitle className="text-2xl">Parent / Learner Portal</CardTitle>
              <p className="text-sm text-muted-foreground">{site.school.name}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>School Slug</Label>
                <Input value={schoolSlug} onChange={(e) => setSchoolSlug(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
              <p className="text-xs text-center text-muted-foreground">
                Contact the school office if you need login help.
              </p>
            </CardContent>
          </form>
        </Card>
      </div>
    );
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
    </div>
  );

  const learnerName = user.student ? `${user.student.firstName} ${user.student.lastName || ''}`.trim() : `${user.firstName} ${user.lastName || ''}`.trim();

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[var(--school-primary)]/10 flex items-center justify-center text-[var(--school-primary)] text-xl font-bold">
              {learnerName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {learnerName}</h1>
              <p className="text-sm text-muted-foreground capitalize">{user.role.toLowerCase()} · {site.school.name}</p>
              {user.student && <Badge variant="outline" className="mt-1">{user.student.grade} · {user.student.studentNumber}</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild><Link href="/"><Home className="size-4 mr-1" /> Website</Link></Button>
            <Button variant="outline" size="sm" onClick={logout}><LogOut className="size-4 mr-1" /> Logout</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex-wrap h-auto bg-background p-1 rounded-xl">
            <TabsTrigger value="overview"><TrendingUp className="size-4 mr-2" /> Overview</TabsTrigger>
            <TabsTrigger value="notices"><Bell className="size-4 mr-2" /> Notices</TabsTrigger>
            <TabsTrigger value="calendar"><CalendarDays className="size-4 mr-2" /> Calendar</TabsTrigger>
            <TabsTrigger value="results"><FileText className="size-4 mr-2" /> Reports</TabsTrigger>
            <TabsTrigger value="attendance"><ClipboardList className="size-4 mr-2" /> Attendance</TabsTrigger>
            <TabsTrigger value="homework"><BookOpen className="size-4 mr-2" /> Homework</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview user={user} />
          </TabsContent>
          <TabsContent value="notices"><PortalList endpoint="/portal/notices" title="Notices" fields={['audience']} icon={<Bell className="size-5" />} /></TabsContent>
          <TabsContent value="calendar"><PortalList endpoint="/portal/calendar" title="Calendar" fields={['startAt','location']} icon={<CalendarDays className="size-5" />} /></TabsContent>
          <TabsContent value="results">
            <div className="space-y-6">
              <ReportCard user={user} />
              <ResultsChart />
              <PortalList endpoint="/portal/results" title="Detailed Results" fields={['subject','score','maxScore','grade','term']} icon={<FileText className="size-5" />} />
            </div>
          </TabsContent>
          <TabsContent value="attendance">
            <div className="space-y-6">
              <AttendanceSummary />
              <PortalList endpoint="/portal/attendance" title="Attendance Record" fields={['date','status','reason']} icon={<ClipboardList className="size-5" />} />
            </div>
          </TabsContent>
          <TabsContent value="homework"><PortalList endpoint="/portal/homework" title="Homework" fields={['subject','title','dueDate']} icon={<BookOpen className="size-5" />} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function DashboardOverview({ user }: { user: PortalUser }) {
  const [notices, setNotices] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch('/portal/notices').then((r) => r.json()).catch(() => []),
      apiFetch('/portal/homework').then((r) => r.json()).catch(() => []),
      apiFetch('/portal/attendance').then((r) => r.json()).catch(() => []),
      apiFetch('/portal/results').then((r) => r.json()).catch(() => []),
    ]).then(([n, h, a, r]) => { setNotices(n); setHomework(h); setAttendance(a); setResults(r); });
  }, []);

  const attendanceRate = useMemo(() => {
    if (!attendance.length) return 0;
    const present = attendance.filter((a) => a.status === 'PRESENT' || a.status === 'present').length;
    return Math.round((present / attendance.length) * 100);
  }, [attendance]);

  const avgScore = useMemo(() => {
    if (!results.length) return 0;
    const scored = results.filter((r) => r.score != null && r.maxScore);
    if (!scored.length) return 0;
    return Math.round(scored.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) / scored.length);
  }, [results]);

  const upcomingHomework = homework.filter((h) => h.dueDate && new Date(h.dueDate) >= new Date()).length;

  const cards = [
    { label: 'New Notices', value: notices.length, icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Average Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-[var(--school-primary)]', bg: 'bg-[var(--school-primary)]/10' },
    { label: 'Upcoming Homework', value: upcomingHomework, icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i} className="hover:shadow-md transition-all">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.color} flex items-center justify-center`}>
                <Icon className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="text-2xl font-bold">{c.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function AttendanceSummary() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/portal/attendance').then((r) => r.json()).then((data) => { setAttendance(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    attendance.forEach((a) => { const s = String(a.status).toLowerCase(); map[s] = (map[s] || 0) + 1; });
    return map;
  }, [attendance]);

  const total = attendance.length;
  const present = counts.present || 0;
  const absent = counts.absent || 0;
  const late = counts.late || 0;
  const rate = total ? Math.round((present / total) * 100) : 0;

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="size-5" /> Attendance Summary</CardTitle></CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading attendance...</p> : total === 0 ? <p className="text-muted-foreground">No attendance records yet.</p> : (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <DonutChart
              size={160}
              segments={[
                { label: 'Present', value: present, color: '#22c55e' },
                { label: 'Absent', value: absent, color: '#ef4444' },
                { label: 'Late', value: late, color: '#f59e0b' },
              ].filter((s) => s.value > 0)}
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 text-green-700">
                <span className="flex items-center gap-2"><CheckCircle2 className="size-4" /> Present</span>
                <span className="font-bold">{present}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 text-red-700">
                <span className="flex items-center gap-2"><XCircle className="size-4" /> Absent</span>
                <span className="font-bold">{absent}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 text-amber-700">
                <span className="flex items-center gap-2"><Clock className="size-4" /> Late</span>
                <span className="font-bold">{late}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="font-semibold">Attendance Rate</span>
                <span className="font-bold text-lg">{rate}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ResultsChart() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/portal/results').then((r) => r.json()).then((data) => { setResults(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const bars = useMemo(() => {
    const bySubject: Record<string, { score: number; max: number; count: number }> = {};
    results.forEach((r) => {
      if (!r.subject || !r.maxScore) return;
      if (!bySubject[r.subject]) bySubject[r.subject] = { score: 0, max: 0, count: 0 };
      bySubject[r.subject].score += r.score;
      bySubject[r.subject].max += r.maxScore;
      bySubject[r.subject].count += 1;
    });
    return Object.entries(bySubject).map(([label, v]) => ({ label, value: Math.round((v.score / v.max) * 100) })).slice(0, 10);
  }, [results]);

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="size-5" /> Results by Subject (%)</CardTitle></CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading results...</p> : bars.length === 0 ? <p className="text-muted-foreground">No published results yet.</p> : (
          <BarChart bars={bars} max={100} unit="%" />
        )}
      </CardContent>
    </Card>
  );
}

function PortalList({ endpoint, title, fields, icon }: { endpoint: string; title: string; fields: string[]; icon?: React.ReactNode }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch(endpoint);
        setItems((await res.json()) as any[]);
      } catch (e) {
        toast.error(`Failed to load ${title}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [endpoint, title]);

  const format = (item: any, field: string) => {
    if (field === 'startAt' && item[field]) return new Date(item[field]).toLocaleString();
    if (field === 'date' && item[field]) return new Date(item[field]).toLocaleDateString();
    if (field === 'dueDate' && item[field]) return `Due ${new Date(item[field]).toLocaleDateString()}`;
    if (field === 'score' && item.maxScore) return `${Math.round((item.score / item.maxScore) * 100)}%`;
    return `${item[field]}`;
  };

  const statusColor = (status: string) => {
    const s = String(status).toLowerCase();
    if (s.includes('present')) return 'text-green-600 bg-green-50';
    if (s.includes('absent')) return 'text-red-600 bg-red-50';
    if (s.includes('late')) return 'text-amber-600 bg-amber-50';
    return 'bg-muted';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{icon} {title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <div className="h-32 flex items-center justify-center text-muted-foreground">Loading...</div> : items.length === 0 ? <p className="text-muted-foreground">No {title.toLowerCase()} found.</p> : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="border-b last:border-0 pb-3">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-medium">{item.title || `${item.subject || ''}`.trim()}</p>
                  {item.status && <span className={`text-xs px-2 py-1 rounded-full ${statusColor(item.status)}`}>{item.status}</span>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {fields.filter((f) => item[f] != null && f !== 'status').map((f) => format(item, f)).join(' · ')}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReportCard({ user }: { user: PortalUser }) {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/portal/results').then((r) => r.json()).then(setResults).catch(() => {});
  }, []);

  const terms = Array.from(new Set(results.map((r) => `${r.academicYear} - ${r.term}`)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="size-5" /> Report Cards</CardTitle>
      </CardHeader>
      <CardContent>
        {terms.length > 0 ? (
          <div className="space-y-2">
            {terms.map((term) => (
              <div key={term} className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">{term}</span>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/portal/report-card?term=${encodeURIComponent(term)}`}><Download className="size-4 mr-2" /> View / Print</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No published results yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
