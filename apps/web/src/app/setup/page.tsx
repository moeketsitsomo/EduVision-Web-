'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Upload, Plus, Trash2, Loader2 } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
}

interface SetupForm {
  schoolName: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  principalName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  bannerImageUrl: string;
  heroTitle: string;
  heroDescription: string;
  welcomeTitle: string;
  welcomeMessage: string;
  websiteTitle: string;
  metaDescription: string;
  footerText: string;
  mission: string;
  vision: string;
  values: string;
  socials: SocialLink[];
  adminEmail: string;
  adminPassword: string;
  adminConfirmPassword: string;
  adminFirstName: string;
  adminLastName: string;
}

const defaultForm: SetupForm = {
  schoolName: '',
  address: '',
  contactPhone: '',
  contactEmail: '',
  principalName: '',
  primaryColor: '#2563eb',
  secondaryColor: '#1e293b',
  logoUrl: '',
  faviconUrl: '',
  bannerImageUrl: '',
  heroTitle: '',
  heroDescription: '',
  welcomeTitle: '',
  welcomeMessage: '',
  websiteTitle: '',
  metaDescription: '',
  footerText: '',
  mission: '',
  vision: '',
  values: '',
  socials: [{ platform: 'Facebook', url: '' }],
  adminEmail: '',
  adminPassword: '',
  adminConfirmPassword: '',
  adminFirstName: '',
  adminLastName: '',
};

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [required, setRequired] = useState(false);
  const [form, setForm] = useState<SetupForm>(defaultForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/setup/status')
      .then((r) => r.json())
      .then((data) => {
        setRequired(data.setupRequired);
        if (!data.setupRequired) router.replace('/admin/login');
      })
      .catch(() => setError('Unable to reach the setup API.'))
      .finally(() => setLoading(false));
  }, [router]);

  const update = (field: keyof SetupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocial = (idx: number, field: keyof SocialLink, value: string) => {
    setForm((prev) => {
      const socials = [...prev.socials];
      socials[idx] = { ...socials[idx], [field]: value };
      return { ...prev, socials };
    });
  };

  const addSocial = () => {
    setForm((prev) => ({ ...prev, socials: [...prev.socials, { platform: '', url: '' }] }));
  };

  const removeSocial = (idx: number) => {
    setForm((prev) => ({ ...prev, socials: prev.socials.filter((_, i) => i !== idx) }));
  };

  const uploadFile = async (file: File, field: keyof SetupForm) => {
    if (!file) return;
    const key = String(field);
    setUploading((u) => ({ ...u, [key]: true }));
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await fetch('/api/setup/upload', { method: 'POST', body: data });
      const result = (await res.json()) as { url?: string; message?: string };
      if (!res.ok) throw new Error(result.message || 'Upload failed');
      setForm((prev) => ({ ...prev, [field]: result.url || '' }));
      toast.success(`${key.replace('Url', '')} uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading((u) => ({ ...u, [key]: false }));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    if (form.adminPassword !== form.adminConfirmPassword) {
      setError('Passwords do not match.');
      setBusy(false);
      return;
    }
    if (form.adminPassword.length < 8) {
      setError('Admin password must be at least 8 characters.');
      setBusy(false);
      return;
    }

    const payload = {
      ...form,
      socials: form.socials.filter((s) => s.platform && s.url),
      adminFirstName: form.adminFirstName,
      adminLastName: form.adminLastName,
    };

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Setup failed');
      toast.success('School created. Please sign in.');
      router.push('/admin/login');
    } catch (err: any) {
      setError(err.message || 'Setup failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <p className="text-muted-foreground">Checking setup status...</p>
      </div>
    );
  }

  if (!required) return null;

  return (
    <div className="min-h-screen bg-muted/40 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to EduVision</CardTitle>
            <CardDescription>
              Set up your school website. You can change everything later from the School Website Builder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={submit}>
              <Tabs defaultValue="school" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="school">School</TabsTrigger>
                  <TabsTrigger value="branding">Branding</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>

                <TabsContent value="school" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School name *</Label>
                    <Input
                      id="schoolName"
                      value={form.schoolName}
                      onChange={(e) => update('schoolName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={form.contactEmail}
                        onChange={(e) => update('contactEmail', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Telephone</Label>
                      <Input
                        id="contactPhone"
                        value={form.contactPhone}
                        onChange={(e) => update('contactPhone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={form.address}
                      onChange={(e) => update('address', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="principalName">Principal / Headteacher</Label>
                    <Input
                      id="principalName"
                      value={form.principalName}
                      onChange={(e) => update('principalName', e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="branding" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary colour</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          value={form.primaryColor}
                          onChange={(e) => update('primaryColor', e.target.value)}
                        />
                        <input
                          type="color"
                          value={form.primaryColor}
                          onChange={(e) => update('primaryColor', e.target.value)}
                          className="h-10 w-10 rounded border p-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary colour</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          value={form.secondaryColor}
                          onChange={(e) => update('secondaryColor', e.target.value)}
                        />
                        <input
                          type="color"
                          value={form.secondaryColor}
                          onChange={(e) => update('secondaryColor', e.target.value)}
                          className="h-10 w-10 rounded border p-1"
                        />
                      </div>
                    </div>
                  </div>

                  <UploadField
                    label="School logo"
                    url={form.logoUrl}
                    uploading={uploading.logoUrl}
                    onSelect={(file) => uploadFile(file, 'logoUrl')}
                  />
                  <UploadField
                    label="Favicon"
                    url={form.faviconUrl}
                    uploading={uploading.faviconUrl}
                    onSelect={(file) => uploadFile(file, 'faviconUrl')}
                  />
                  <UploadField
                    label="Hero / Banner image"
                    url={form.bannerImageUrl}
                    uploading={uploading.bannerImageUrl}
                    onSelect={(file) => uploadFile(file, 'bannerImageUrl')}
                  />

                  <div className="space-y-2">
                    <Label>Social media links</Label>
                    <div className="space-y-2">
                      {form.socials.map((social, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <Input
                            placeholder="Platform (e.g. Facebook)"
                            value={social.platform}
                            onChange={(e) => updateSocial(idx, 'platform', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="https://..."
                            value={social.url}
                            onChange={(e) => updateSocial(idx, 'url', e.target.value)}
                            className="flex-[2]"
                          />
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeSocial(idx)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={addSocial}>
                        <Plus className="size-4 mr-2" /> Add social link
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="websiteTitle">Website title</Label>
                      <Input
                        id="websiteTitle"
                        value={form.websiteTitle}
                        onChange={(e) => update('websiteTitle', e.target.value)}
                        placeholder={form.schoolName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heroTitle">Hero title</Label>
                      <Input
                        id="heroTitle"
                        value={form.heroTitle}
                        onChange={(e) => update('heroTitle', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroDescription">Hero description</Label>
                    <Textarea
                      id="heroDescription"
                      value={form.heroDescription}
                      onChange={(e) => update('heroDescription', e.target.value)}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="welcomeTitle">Welcome title</Label>
                      <Input
                        id="welcomeTitle"
                        value={form.welcomeTitle}
                        onChange={(e) => update('welcomeTitle', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="welcomeMessage">Welcome message</Label>
                      <Textarea
                        id="welcomeMessage"
                        value={form.welcomeMessage}
                        onChange={(e) => update('welcomeMessage', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mission">Mission</Label>
                      <Textarea
                        id="mission"
                        value={form.mission}
                        onChange={(e) => update('mission', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vision">Vision</Label>
                      <Textarea
                        id="vision"
                        value={form.vision}
                        onChange={(e) => update('vision', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="values">Values</Label>
                      <Textarea
                        id="values"
                        value={form.values}
                        onChange={(e) => update('values', e.target.value)}
                        placeholder="One per line"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">SEO description</Label>
                    <Textarea
                      id="metaDescription"
                      value={form.metaDescription}
                      onChange={(e) => update('metaDescription', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="footerText">Footer text</Label>
                    <Input
                      id="footerText"
                      value={form.footerText}
                      onChange={(e) => update('footerText', e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="admin" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminFirstName">First name</Label>
                      <Input
                        id="adminFirstName"
                        value={form.adminFirstName}
                        onChange={(e) => update('adminFirstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminLastName">Last name</Label>
                      <Input
                        id="adminLastName"
                        value={form.adminLastName}
                        onChange={(e) => update('adminLastName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Administrator email *</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={form.adminEmail}
                      onChange={(e) => update('adminEmail', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminPassword">Password *</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={form.adminPassword}
                        onChange={(e) => update('adminPassword', e.target.value)}
                        required
                        minLength={8}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminConfirmPassword">Confirm password *</Label>
                      <Input
                        id="adminConfirmPassword"
                        type="password"
                        value={form.adminConfirmPassword}
                        onChange={(e) => update('adminConfirmPassword', e.target.value)}
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 flex justify-end">
                <Button type="submit" disabled={busy} className="min-w-[160px]">
                  {busy ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" /> Creating school...
                    </>
                  ) : (
                    'Create school website'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UploadField({
  label,
  url,
  uploading,
  onSelect,
}: {
  label: string;
  url: string;
  uploading: boolean;
  onSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file);
          if (e.target) e.target.value = '';
        }}
      />
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : (
            <Upload className="size-4 mr-2" />
          )}
          {uploading ? 'Uploading...' : `Upload ${label}`}
        </Button>
        {url ? (
          <span className="text-sm text-muted-foreground truncate max-w-xs">{url}</span>
        ) : (
          <span className="text-sm text-muted-foreground">No file selected</span>
        )}
      </div>
    </div>
  );
}
