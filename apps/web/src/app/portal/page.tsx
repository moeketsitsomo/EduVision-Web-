'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiFetch } from '@/lib/admin-api';
import { toast } from 'sonner';

type PortalUser = { id: string; email: string; firstName?: string; lastName?: string; role: string; school?: { name: string } };

export default function PortalPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<PortalUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolSlug, setSchoolSlug] = useState('demo-school');
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
            <CardHeader>
              <CardTitle>Parent / Teacher / Learner Portal</CardTitle>
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
            </CardContent>
          </form>
        </Card>
      </div>
    );
  }

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{user.school?.name} Portal</h1>
            <p className="text-sm text-muted-foreground capitalize">{user.role.toLowerCase()}: {user.firstName} {user.lastName}</p>
          </div>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>
        <Tabs defaultValue="notices">
          <TabsList>
            <TabsTrigger value="notices">Notices</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          <TabsContent value="notices"><PortalList endpoint="/portal/notices" title="Notices" fields={['title','audience']} /></TabsContent>
          <TabsContent value="calendar"><PortalList endpoint="/portal/calendar" title="Calendar" fields={['title','startAt','location']} /></TabsContent>
          <TabsContent value="results"><PortalList endpoint="/portal/results" title="Results" fields={['subject','score','maxScore','grade']} /></TabsContent>
          <TabsContent value="attendance"><PortalList endpoint="/portal/attendance" title="Attendance" fields={['date','status','reason']} /></TabsContent>
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

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {loading ? <p>Loading...</p> : items.length === 0 ? <p>No {title.toLowerCase()} found.</p> : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="border-b pb-2">
                <p className="font-medium">{item.title || `${item.subject || ''}`.trim()}</p>
                <p className="text-sm text-muted-foreground">
                  {fields.filter((f) => item[f] != null).map((f) => `${f}: ${item[f]}`).join(' · ')}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
