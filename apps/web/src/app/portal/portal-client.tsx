'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/admin-api';
import { toast } from 'sonner';
import type { SiteData } from '@/lib/types';
import { GraduationCap, FileText, CalendarDays, ClipboardList, BookOpen, Download } from 'lucide-react';
import Link from 'next/link';

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
    const t = localStorage.getItem('eduvision_token');
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
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-md">
          <form onSubmit={handleLogin}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[var(--school-primary)]/10 flex items-center justify-center">
                <GraduationCap className="size-6 text-[var(--school-primary)]" />
              </div>
              <CardTitle>Parent / Learner Portal</CardTitle>
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
                Demo parent: parent1@example.com / Parent123!<br />
                Demo learner: learner-SP2026001@example.com / Learner123!
              </p>
            </CardContent>
          </form>
        </Card>
      </div>
    );
  }

  if (!user) return <div className="min-h-screen p-8">Loading...</div>;

  const learnerName = user.student ? `${user.student.firstName} ${user.student.lastName || ''}`.trim() : `${user.firstName} ${user.lastName || ''}`.trim();

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{site.school.name} Portal</h1>
            <p className="text-sm text-muted-foreground capitalize">{user.role.toLowerCase()}: {learnerName}</p>
            {user.student && <Badge variant="outline">{user.student.grade} · {user.student.studentNumber}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild><Link href="/">Back to Website</Link></Button>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>

        <Tabs defaultValue="notices">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="notices"><ClipboardList className="size-4 mr-2" /> Notices</TabsTrigger>
            <TabsTrigger value="calendar"><CalendarDays className="size-4 mr-2" /> Calendar</TabsTrigger>
            <TabsTrigger value="results"><FileText className="size-4 mr-2" /> Reports</TabsTrigger>
            <TabsTrigger value="attendance"><ClipboardList className="size-4 mr-2" /> Attendance</TabsTrigger>
            <TabsTrigger value="homework"><BookOpen className="size-4 mr-2" /> Homework</TabsTrigger>
          </TabsList>
          <TabsContent value="notices"><PortalList endpoint="/portal/notices" title="Notices" fields={['title','audience']} /></TabsContent>
          <TabsContent value="calendar"><PortalList endpoint="/portal/calendar" title="Calendar" fields={['title','startAt','location']} /></TabsContent>
          <TabsContent value="results">
            <div className="space-y-4">
              <ReportCard user={user} />
              <PortalList endpoint="/portal/results" title="Detailed Results" fields={['subject','score','maxScore','grade','term']} />
            </div>
          </TabsContent>
          <TabsContent value="attendance"><PortalList endpoint="/portal/attendance" title="Attendance" fields={['date','status','reason']} /></TabsContent>
          <TabsContent value="homework"><PortalList endpoint="/portal/homework" title="Homework" fields={['subject','title','dueDate']} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PortalList({ endpoint, title, fields }: { endpoint: string; title: string; fields: string[] }) {
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
  }, [endpoint]);

  const format = (item: any, field: string) => {
    if (field === 'startAt' && item[field]) return new Date(item[field]).toLocaleString();
    if (field === 'date' && item[field]) return new Date(item[field]).toLocaleDateString();
    if (field === 'dueDate' && item[field]) return `Due ${new Date(item[field]).toLocaleDateString()}`;
    return `${item[field]}`;
  };

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {loading ? <p>Loading...</p> : items.length === 0 ? <p>No {title.toLowerCase()} found.</p> : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="border-b pb-2 last:border-0">
                <p className="font-medium">{item.title || `${item.subject || ''}`.trim()}</p>
                <p className="text-sm text-muted-foreground">
                  {fields.filter((f) => item[f] != null).map((f) => `${f === 'score' ? '' : ''}${format(item, f)}`).join(' · ')}
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
