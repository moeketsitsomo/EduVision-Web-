'use client';

import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  footerText: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  admissionsEmail: string;
  admissionsPhone: string;
  address: string;
  logoUrl: string;
  faviconUrl: string;
  bannerImageUrl: string;
  ogImageUrl: string;
  heroTitle: string;
  heroDescription: string;
  heroCtaText: string;
  heroCtaLink: string;
  welcomeTitle: string;
  welcomeMessage: string;
  principalName: string;
  principalMessage: string;
  mission: string;
  vision: string;
  values: string;
  history: string;
  establishedYear: string;
  enrollmentCount: string;
  teacherCount: string;
  classroomCount: string;
  passRate: string;
  facilities: string;
  awards: string;
  departments: string;
  academicsInfo: string;
  curriculumInfo: string;
  timetableInfo: string;
  admissionInfo: string;
  admissionRequirements: string;
  admissionDocuments: string;
  admissionImportantDates: string;
  admissionFeeInfo: string;
  policiesInfo: string;
  officeHours: string;
  googleMapsUrl: string;
  locationLat: string;
  locationLng: string;
  darkMode: boolean;
  isActive: boolean;
}

const emptySchool: SchoolForm = {
  name: '',
  slug: '',
  customDomain: '',
  websiteTitle: '',
  metaDescription: '',
  footerText: '',
  primaryColor: '#2563eb',
  secondaryColor: '#1e293b',
  contactEmail: '',
  contactPhone: '',
  admissionsEmail: '',
  admissionsPhone: '',
  address: '',
  logoUrl: '',
  faviconUrl: '',
  bannerImageUrl: '',
  ogImageUrl: '',
  heroTitle: '',
  heroDescription: '',
  heroCtaText: '',
  heroCtaLink: '',
  welcomeTitle: '',
  welcomeMessage: '',
  principalName: '',
  principalMessage: '',
  mission: '',
  vision: '',
  values: '',
  history: '',
  establishedYear: '',
  enrollmentCount: '',
  teacherCount: '',
  classroomCount: '',
  passRate: '',
  facilities: '',
  awards: '',
  departments: '',
  academicsInfo: '',
  curriculumInfo: '',
  timetableInfo: '',
  admissionInfo: '',
  admissionRequirements: '',
  admissionDocuments: '',
  admissionImportantDates: '',
  admissionFeeInfo: '',
  policiesInfo: '',
  officeHours: '',
  googleMapsUrl: '',
  locationLat: '',
  locationLng: '',
  darkMode: false,
  isActive: true,
};

function linesToStringArray(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function stringArrayToLines(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : item.name || item.title || JSON.stringify(item)))
      .join('\n');
  }
  return '';
}

function parseLinesToObjects(value: string): any[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith('{')) {
        try {
          return JSON.parse(line);
        } catch {}
      }
      return line;
    });
}

function normalizeJsonField(value: unknown): string {
  if (value == null) return '';
  if (Array.isArray(value)) return stringArrayToLines(value);
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
}

function normalizeSchool(school: any): Partial<SchoolForm> {
  const normalized: any = { ...school };
  normalized.facilities = stringArrayToLines(school.facilities);
  normalized.departments = stringArrayToLines(school.departments);
  normalized.curriculumInfo = stringArrayToLines(school.curriculumInfo);
  normalized.admissionRequirements = stringArrayToLines(school.admissionRequirements);
  normalized.admissionDocuments = stringArrayToLines(school.admissionDocuments);
  normalized.admissionImportantDates = stringArrayToLines(school.admissionImportantDates);
  normalized.awards = normalizeJsonField(school.awards);

  ['establishedYear', 'enrollmentCount', 'teacherCount', 'classroomCount'].forEach((k) => {
    if (school[k] != null) normalized[k] = String(school[k]);
  });
  if (school.passRate != null) normalized.passRate = String(school.passRate);
  if (school.locationLat != null) normalized.locationLat = String(school.locationLat);
  if (school.locationLng != null) normalized.locationLng = String(school.locationLng);

  return normalized;
}

function prepareSave(form: SchoolForm): any {
  const save: any = { ...form };

  save.facilities = linesToStringArray(form.facilities);
  save.departments = parseLinesToObjects(form.departments);
  save.curriculumInfo = parseLinesToObjects(form.curriculumInfo);
  save.admissionRequirements = parseLinesToObjects(form.admissionRequirements);
  save.admissionDocuments = parseLinesToObjects(form.admissionDocuments);
  save.admissionImportantDates = parseLinesToObjects(form.admissionImportantDates);

  try {
    save.awards = form.awards ? JSON.parse(form.awards) : [];
  } catch {
    save.awards = form.awards
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const yearMatch = line.match(/\((\d{4})\)$/);
        if (yearMatch) return { title: line.replace(/\s*\(\d{4}\)$/, ''), year: Number(yearMatch[1]) };
        return { title: line };
      });
  }

  ['establishedYear', 'enrollmentCount', 'teacherCount', 'classroomCount'].forEach((k) => {
    save[k] = form[k as keyof SchoolForm] ? parseInt(form[k as keyof SchoolForm] as string, 10) : null;
  });
  save.passRate = form.passRate ? parseFloat(form.passRate) : null;
  save.locationLat = form.locationLat ? parseFloat(form.locationLat) : null;
  save.locationLng = form.locationLng ? parseFloat(form.locationLng) : null;

  return save;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<SchoolForm>(emptySchool);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const ogInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const meRes = await apiFetch('/auth/me');
        const me = (await meRes.json()) as User;
        setUser(me);
        const schoolRes = await apiFetch(`/schools/${me.schoolId}`);
        const school = (await schoolRes.json()) as any;
        setForm({ ...emptySchool, ...normalizeSchool(school) });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const uploadFile = async (file: File, field: keyof SchoolForm) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await apiFetch('/media/upload', { method: 'POST', body: formData });
      const data = (await res.json()) as { url: string };
      setForm((prev) => ({ ...prev, [field]: data.url }));
      toast.success(`${field.replace('Url', '')} uploaded`);
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
        body: JSON.stringify(prepareSave(form)),
      });
      toast.success('School website settings saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading settings...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">School Website Builder</h1>
        <p className="text-sm text-muted-foreground">Update your school&apos;s public website. Changes appear immediately.</p>
      </div>

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
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="footerText">Footer Text</Label>
              <Input id="footerText" value={form.footerText} onChange={(e) => handleChange('footerText', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ogImageUrl">Open Graph Image</Label>
              <input ref={ogInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'ogImageUrl')} />
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" onClick={() => ogInputRef.current?.click()}><Upload className="size-4 mr-2" /> Upload OG Image</Button>
                {form.ogImageUrl && <img src={form.ogImageUrl} alt="Open Graph preview" loading="lazy" className="h-16 w-auto max-w-[200px] object-contain rounded" />}
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
            <CardTitle>Logo, Favicon & Banner</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Logo</Label>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'logoUrl')} />
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" onClick={() => logoInputRef.current?.click()}><Upload className="size-4 mr-2" /> Upload Logo</Button>
                {form.logoUrl && <img src={form.logoUrl} alt="Logo preview" loading="lazy" className="h-10 w-auto max-w-[160px] object-contain" />}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Favicon</Label>
              <input ref={faviconInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'faviconUrl')} />
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" onClick={() => faviconInputRef.current?.click()}><Upload className="size-4 mr-2" /> Upload Favicon</Button>
                {form.faviconUrl && <img src={form.faviconUrl} alt="Favicon preview" loading="lazy" className="h-8 w-8 object-contain" />}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Banner / Hero Image</Label>
              <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'bannerImageUrl')} />
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" onClick={() => bannerInputRef.current?.click()}><Upload className="size-4 mr-2" /> Upload Banner</Button>
                {form.bannerImageUrl && <img src={form.bannerImageUrl} alt="Banner preview" loading="lazy" className="h-16 w-auto max-w-[200px] object-cover rounded" />}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Home Page</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input id="heroTitle" value={form.heroTitle} onChange={(e) => handleChange('heroTitle', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="heroDescription">Hero Description</Label>
              <Textarea id="heroDescription" rows={3} value={form.heroDescription} onChange={(e) => handleChange('heroDescription', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroCtaText">Hero Button Text</Label>
              <Input id="heroCtaText" value={form.heroCtaText} onChange={(e) => handleChange('heroCtaText', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroCtaLink">Hero Button Link</Label>
              <Input id="heroCtaLink" value={form.heroCtaLink} onChange={(e) => handleChange('heroCtaLink', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="welcomeTitle">Welcome Title</Label>
              <Input id="welcomeTitle" value={form.welcomeTitle} onChange={(e) => handleChange('welcomeTitle', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <Textarea id="welcomeMessage" rows={3} value={form.welcomeMessage} onChange={(e) => handleChange('welcomeMessage', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="principalMessage">Principal&apos;s Message</Label>
              <Textarea id="principalMessage" rows={3} value={form.principalMessage} onChange={(e) => handleChange('principalMessage', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="principalName">Principal Name</Label>
              <Input id="principalName" value={form.principalName} onChange={(e) => handleChange('principalName', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About the School</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="establishedYear">Established Year</Label>
              <Input id="establishedYear" value={form.establishedYear} onChange={(e) => handleChange('establishedYear', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="history">School History</Label>
              <Textarea id="history" rows={4} value={form.history} onChange={(e) => handleChange('history', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mission">Mission</Label>
              <Textarea id="mission" rows={2} value={form.mission} onChange={(e) => handleChange('mission', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="vision">Vision</Label>
              <Textarea id="vision" rows={2} value={form.vision} onChange={(e) => handleChange('vision', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="values">Values (one per line)</Label>
              <Textarea id="values" rows={3} value={form.values} onChange={(e) => handleChange('values', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicsInfo">Academics Overview</Label>
              <Textarea id="academicsInfo" rows={4} value={form.academicsInfo} onChange={(e) => handleChange('academicsInfo', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="curriculumInfo">Curriculum Highlights (one per line)</Label>
              <Textarea id="curriculumInfo" rows={3} value={form.curriculumInfo} onChange={(e) => handleChange('curriculumInfo', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timetableInfo">Timetable Information</Label>
              <Textarea id="timetableInfo" rows={3} value={form.timetableInfo} onChange={(e) => handleChange('timetableInfo', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admissions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admissionInfo">Admissions Overview</Label>
              <Textarea id="admissionInfo" rows={4} value={form.admissionInfo} onChange={(e) => handleChange('admissionInfo', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionRequirements">Admission Requirements (one per line)</Label>
              <Textarea id="admissionRequirements" rows={4} value={form.admissionRequirements} onChange={(e) => handleChange('admissionRequirements', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionDocuments">Required Documents (one per line)</Label>
              <Textarea id="admissionDocuments" rows={3} value={form.admissionDocuments} onChange={(e) => handleChange('admissionDocuments', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionImportantDates">Important Dates (one per line)</Label>
              <Textarea id="admissionImportantDates" rows={3} value={form.admissionImportantDates} onChange={(e) => handleChange('admissionImportantDates', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionFeeInfo">Fee Information</Label>
              <Textarea id="admissionFeeInfo" rows={3} value={form.admissionFeeInfo} onChange={(e) => handleChange('admissionFeeInfo', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">General Email</Label>
              <Input id="contactEmail" type="email" value={form.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">General Phone</Label>
              <Input id="contactPhone" value={form.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionsEmail">Admissions Email</Label>
              <Input id="admissionsEmail" type="email" value={form.admissionsEmail} onChange={(e) => handleChange('admissionsEmail', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionsPhone">Admissions Phone</Label>
              <Input id="admissionsPhone" value={form.admissionsPhone} onChange={(e) => handleChange('admissionsPhone', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="officeHours">Office Hours</Label>
              <Textarea id="officeHours" value={form.officeHours} onChange={(e) => handleChange('officeHours', e.target.value)} placeholder="Mon – Fri: 07:30 – 15:30" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="googleMapsUrl">Google Maps Embed URL</Label>
              <Input id="googleMapsUrl" value={form.googleMapsUrl} onChange={(e) => handleChange('googleMapsUrl', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>School Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enrollmentCount">Learners</Label>
              <Input id="enrollmentCount" type="number" value={form.enrollmentCount} onChange={(e) => handleChange('enrollmentCount', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacherCount">Teachers</Label>
              <Input id="teacherCount" type="number" value={form.teacherCount} onChange={(e) => handleChange('teacherCount', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classroomCount">Classrooms</Label>
              <Input id="classroomCount" type="number" value={form.classroomCount} onChange={(e) => handleChange('classroomCount', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passRate">Pass Rate (%)</Label>
              <Input id="passRate" type="number" value={form.passRate} onChange={(e) => handleChange('passRate', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facilities, Departments & Awards</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facilities">Facilities (one per line)</Label>
              <Textarea id="facilities" rows={4} value={form.facilities} onChange={(e) => handleChange('facilities', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departments">Departments (one per line)</Label>
              <Textarea id="departments" rows={3} value={form.departments} onChange={(e) => handleChange('departments', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="awards">Awards (JSON or one per line)</Label>
              <Textarea id="awards" rows={4} value={form.awards} onChange={(e) => handleChange('awards', e.target.value)} placeholder='{&quot;year&quot;:2024,&quot;title&quot;:&quot;Best School&quot;}' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policies & Documents</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policiesInfo">Policies Overview</Label>
              <Textarea id="policiesInfo" rows={3} value={form.policiesInfo} onChange={(e) => handleChange('policiesInfo', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Website Settings'}</Button>
        </div>
      </form>
    </div>
  );
}
