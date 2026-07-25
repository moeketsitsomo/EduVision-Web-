'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { School } from '@/lib/types';

interface Stats {
  totalSchools: number;
  activeSchools: number;
  suspendedSchools: number;
  totalUsers: number;
  totalPages: number;
  totalPosts: number;
  totalMedia: number;
}

interface Activity {
  id: string;
  action: string;
  resource: string;
  details?: string | null;
  createdAt: string;
  user?: { email: string; firstName?: string | null; lastName?: string | null } | null;
  school?: { name: string } | null;
}

const emptySchool = {
  name: '',
  slug: '',
  primaryColor: '#2563eb',
  secondaryColor: '#1e293b',
  websiteTitle: '',
  metaDescription: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  adminEmail: '',
  adminPassword: '',
  adminFirstName: '',
  adminLastName: '',
};

export default function SuperAdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptySchool);

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, activityRes, schoolsRes] = await Promise.all([
        apiFetch('/super-admin/stats'),
        apiFetch('/super-admin/activity'),
        apiFetch('/schools'),
      ]);
      setStats((await statsRes.json()) as Stats);
      setActivity((await activityRes.json()) as Activity[]);
      setSchools((await schoolsRes.json()) as School[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load super admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[a-z0-9-]+$/.test(form.slug)) {
      toast.error('Slug must be lowercase letters, numbers, and hyphens only');
      return;
    }
    try {
      await apiFetch('/schools', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      toast.success('School created');
      setDialogOpen(false);
      setForm(emptySchool);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create school');
    }
  };

  const statCards = stats
    ? [
        { label: 'Total Schools', value: stats.totalSchools },
        { label: 'Active Schools', value: stats.activeSchools },
        { label: 'Suspended Schools', value: stats.suspendedSchools },
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Total Pages', value: stats.totalPages },
        { label: 'Total Posts', value: stats.totalPosts },
        { label: 'Total Media', value: stats.totalMedia },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Super Admin</h1>
        <Button onClick={() => setDialogOpen(true)}>New School</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schools</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!loading && schools.length === 0 && <p className="text-sm text-muted-foreground">No schools yet.</p>}
          {schools.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>{school.name}</TableCell>
                    <TableCell>{school.slug}</TableCell>
                    <TableCell>{school.isActive ? 'Active' : 'Suspended'}</TableCell>
                    <TableCell>{school.subscriptionStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.resource}</TableCell>
                    <TableCell>
                      {log.user
                        ? `${log.user.firstName || ''} ${log.user.lastName || ''}`.trim() || log.user.email
                        : '-'}
                    </TableCell>
                    <TableCell>{log.school?.name || '-'}</TableCell>
                    <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleCreate} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Create School</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">School Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="websiteTitle">Website Title</Label>
                <Input
                  id="websiteTitle"
                  value={form.websiteTitle}
                  onChange={(e) => setForm({ ...form, websiteTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Input
                  id="metaDescription"
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  id="secondaryColor"
                  value={form.secondaryColor}
                  onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 pt-4">
                <h3 className="text-sm font-semibold mb-2">Admin Account (optional)</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={form.adminEmail}
                  onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Admin Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  minLength={8}
                  value={form.adminPassword}
                  onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminFirstName">First Name</Label>
                <Input
                  id="adminFirstName"
                  value={form.adminFirstName}
                  onChange={(e) => setForm({ ...form, adminFirstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminLastName">Last Name</Label>
                <Input
                  id="adminLastName"
                  value={form.adminLastName}
                  onChange={(e) => setForm({ ...form, adminLastName: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create School</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
