'use client';

import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface User {
  id: string;
  schoolId: string;
  role: string;
}

interface SchoolForm {
  name: string;
  slug: string;
  customDomain: string;
  websiteTitle: string;
  metaDescription: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoUrl: string;
  faviconUrl: string;
  darkMode: boolean;
  isActive: boolean;
}

const emptySchool: SchoolForm = {
  name: '',
  slug: '',
  customDomain: '',
  websiteTitle: '',
  metaDescription: '',
  primaryColor: '#2563eb',
  secondaryColor: '#1e293b',
  contactEmail: '',
  contactPhone: '',
  address: '',
  logoUrl: '',
  faviconUrl: '',
  darkMode: false,
  isActive: true,
};

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<SchoolForm>(emptySchool);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const meRes = await apiFetch('/auth/me');
        const me = (await meRes.json()) as User;
        setUser(me);
        const schoolRes = await apiFetch(`/schools/${me.schoolId}`);
        const school = (await schoolRes.json()) as Partial<SchoolForm>;
        setForm({ ...emptySchool, ...school });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const uploadFile = async (file: File, field: 'logoUrl' | 'faviconUrl') => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await apiFetch('/media/upload', { method: 'POST', body: formData });
      const data = (await res.json()) as { url: string };
      setForm((prev) => ({ ...prev, [field]: data.url }));
      toast.success(`${field === 'logoUrl' ? 'Logo' : 'Favicon'} uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleChange = (field: keyof SchoolForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await apiFetch(`/schools/${user.schoolId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...form,
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          darkMode: form.darkMode,
        }),
      });
      toast.success('School settings saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading settings...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">School Settings & Branding</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">School Name</Label>
              <Input id="name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteTitle">Website Title</Label>
              <Input id="websiteTitle" value={form.websiteTitle} onChange={(e) => handleChange('websiteTitle', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customDomain">Custom Domain</Label>
              <Input id="customDomain" value={form.customDomain} onChange={(e) => handleChange('customDomain', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Input id="primaryColor" value={form.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} />
                <input type="color" value={form.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} className="h-10 w-12 rounded border" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <Input id="secondaryColor" value={form.secondaryColor} onChange={(e) => handleChange('secondaryColor', e.target.value)} />
                <input type="color" value={form.secondaryColor} onChange={(e) => handleChange('secondaryColor', e.target.value)} className="h-10 w-12 rounded border" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Input id="metaDescription" value={form.metaDescription} onChange={(e) => handleChange('metaDescription', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'logoUrl')}
              />
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" onClick={() => logoInputRef.current?.click()}>
                  <Upload className="size-4 mr-2" /> Upload Logo
                </Button>
                {form.logoUrl && <img src={form.logoUrl} alt="Logo preview" className="h-10 w-auto max-w-[160px] object-contain" />}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Favicon</Label>
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'faviconUrl')}
              />
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" onClick={() => faviconInputRef.current?.click()}>
                  <Upload className="size-4 mr-2" /> Upload Favicon
                </Button>
                {form.faviconUrl && <img src={form.faviconUrl} alt="Favicon preview" className="h-8 w-8 object-contain" />}
              </div>
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <Switch id="darkMode" checked={form.darkMode} onCheckedChange={(v) => handleChange('darkMode', v)} />
              <Label htmlFor="darkMode">Default Dark Mode</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" value={form.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input id="contactPhone" value={form.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
        </div>
      </form>
    </div>
  );
}
