import type { Metadata } from 'next';
import { fetchSite, fetchPage } from '@/lib/api';
import { schoolMetadata } from '@/lib/metadata';
import { PublicShell } from '@/components/public/public-shell';
import { PageHeader } from '@/components/public/page-header';
import { AdmissionsForm } from '@/components/public/admissions-form';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, FileText, DollarSign, CheckCircle2, Mail, MapPin, Clock } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return schoolMetadata('Admissions', 'Apply online, view requirements, fees and admissions contact details.');
}

export default async function AdmissionsPage() {
  const [site, page] = await Promise.all([fetchSite(), fetchPage('admissions').catch(() => null)]);
  const { school, fees } = site;

  const admissionsEmail = school.admissionsEmail || school.contactEmail;
  const admissionsPhone = school.admissionsPhone || school.contactPhone;

  const requirements = [
    'Completed online application form',
    'Birth certificate or passport copy',
    'Previous school report card',
    'Immunisation record',
    'Proof of residence',
    'Parent/guardian ID copy',
  ];

  return (
    <PublicShell site={site}>
      <PageHeader title="Admissions" subtitle="Apply online, view fees and contact the admissions office." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Application form */}
          <div className="lg:col-span-2 space-y-10">
            {page && (
              <section className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                <MarkdownRenderer content={page.content} />
              </section>
            )}

            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Online Application</h2>
              <AdmissionsForm schoolId={school.id} schoolName={school.name} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><CheckCircle2 className="size-5 text-[var(--school-primary)]" /> Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <FileText className="size-4 mt-0.5 text-[var(--school-primary)]" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><DollarSign className="size-5 text-[var(--school-primary)]" /> School Fees</CardTitle>
              </CardHeader>
              <CardContent>
                {fees.length > 0 ? (
                  <ul className="space-y-3">
                    {fees.map((fee) => (
                      <li key={fee.id} className="flex justify-between text-sm border-b pb-2">
                        <span>{fee.grade} — {fee.item}</span>
                        <span className="font-semibold">R {Number(fee.amount).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Fee information will be published soon.</p>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Phone className="size-5 text-[var(--school-primary)]" /> Admissions Office</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {admissionsPhone && (
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <a href={`tel:${admissionsPhone}`} className="hover:text-[var(--school-primary)] hover:underline">{admissionsPhone}</a>
                  </p>
                )}
                {admissionsEmail && (
                  <p className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <a href={`mailto:${admissionsEmail}`} className="hover:text-[var(--school-primary)] hover:underline">{admissionsEmail}</a>
                  </p>
                )}
                {school.address && (
                  <p className="flex items-start gap-2">
                    <MapPin className="size-4 mt-0.5 text-muted-foreground" />
                    {school.address}
                  </p>
                )}
                {school.officeHours && (
                  <div className="pt-3 border-t mt-3 flex items-start gap-2">
                    <Clock className="size-4 mt-0.5 text-muted-foreground" />
                    <p className="whitespace-pre-line text-muted-foreground">{school.officeHours}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
