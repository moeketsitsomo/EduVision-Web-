import { fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { AdmissionsForm } from '@/components/public/admissions-form';

export default async function AdmissionsPage() {
  const site = await fetchSite();

  return (
    <PublicShell site={site}>
      <section className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Online Admissions</h1>
        <AdmissionsForm schoolId={site.school.id} schoolName={site.school.name} />
      </section>
    </PublicShell>
  );
}
