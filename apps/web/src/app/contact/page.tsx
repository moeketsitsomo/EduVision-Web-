import type { Metadata } from 'next';
import { fetchSite } from '@/lib/api';
import { schoolMetadata } from '@/lib/metadata';
import { PublicShell } from '@/components/public/public-shell';
import { PageHeader } from '@/components/public/page-header';
import { ContactForm } from '@/components/public/contact-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, Clock, Mail, Globe, AlertCircle } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return schoolMetadata('Contact Us', 'Get in touch with our school office, find directions and emergency contacts.');
}

export default async function ContactPage() {
  const site = await fetchSite();
  const { school, contacts, socials } = site;

  const general = contacts.filter((c) => c.type === 'general' || c.type === 'office');
  const emergency = contacts.filter((c) => c.type === 'emergency');

  return (
    <PublicShell site={site}>
      <PageHeader title="Contact Us" subtitle={`Get in touch with ${school.name}.`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><MapPin className="size-5 text-[var(--school-primary)]" /> Visit Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {school.address && <p className="text-muted-foreground">{school.address}</p>}
                {school.googleMapsUrl && (
                  <div className="aspect-video rounded-lg overflow-hidden border">
                    <iframe
                      title={`${school.name} location`}
                      src={school.googleMapsUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Phone className="size-5 text-[var(--school-primary)]" /> Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {school.contactPhone && (
                  <p className="flex items-center gap-3">
                    <Phone className="size-4 text-[var(--school-primary)]" />
                    <a href={`tel:${school.contactPhone}`} className="hover:text-[var(--school-primary)] hover:underline">{school.contactPhone}</a>
                  </p>
                )}
                {school.contactEmail && (
                  <p className="flex items-center gap-3">
                    <Mail className="size-4 text-[var(--school-primary)]" />
                    <a href={`mailto:${school.contactEmail}`} className="hover:text-[var(--school-primary)] hover:underline">{school.contactEmail}</a>
                  </p>
                )}
                {school.officeHours && (
                  <div className="pt-3 border-t mt-2 flex items-start gap-3">
                    <Clock className="size-4 mt-0.5 text-[var(--school-primary)]" />
                    <p className="whitespace-pre-line">{school.officeHours}</p>
                  </div>
                )}
                {general.length > 0 && (
                  <ul className="pt-3 border-t mt-2 space-y-2">
                    {general.map((c) => (
                      <li key={c.id}>{c.label ? `${c.label}: ` : ''}{c.name} — <a href={`tel:${c.number}`} className="hover:text-[var(--school-primary)] hover:underline">{c.number}</a></li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {emergency.length > 0 && (
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400"><AlertCircle className="size-5" /> Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-red-700 dark:text-red-400">
                  {emergency.map((c) => (
                    <p key={c.id}>{c.label ? `${c.label}: ` : ''}{c.name} — <a href={`tel:${c.number}`} className="underline">{c.number}</a></p>
                  ))}
                </CardContent>
              </Card>
            )}

            {socials.length > 0 && (
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Globe className="size-5 text-[var(--school-primary)]" /> Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {socials.map((s) => (
                      <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="text-sm px-4 py-2 rounded-full bg-muted hover:bg-[var(--school-primary)] hover:text-white transition-colors">{s.platform}</a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Send a Message</h2>
            <ContactForm schoolName={school.name} />
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
