import { fetchSite, fetchPage } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { AdmissionsForm } from '@/components/public/admissions-form';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, FileText, DollarSign, CheckCircle } from 'lucide-react';

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
      <section className="bg-[var(--school-primary)] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">Admissions</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">Apply online, view fees and contact the admissions office.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Application form */}
          <div className="lg:col-span-2 space-y-8">
            {page && (
              <section className="prose dark:prose-invert max-w-none">
                <MarkdownRenderer content={page.content} />
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold mb-4">Online Application</h2>
              <AdmissionsForm schoolId={school.id} schoolName={school.name} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CheckCircle className="size-5" /> Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <FileText className="size-4 mt-0.5 text-[var(--school-primary)]" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="size-5" /> School Fees</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Phone className="size-5" /> Admissions Office</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {admissionsPhone && <p><span className="font-semibold">Phone:</span> {admissionsPhone}</p>}
                {admissionsEmail && <p><span className="font-semibold">Email:</span> <a href={`mailto:${admissionsEmail}`} className="text-[var(--school-primary)] hover:underline">{admissionsEmail}</a></p>}
                {school.address && <p><span className="font-semibold">Address:</span> {school.address}</p>}
                {school.officeHours && (
                  <div className="pt-2 border-t mt-2">
                    <p className="font-semibold">Office Hours</p>
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
