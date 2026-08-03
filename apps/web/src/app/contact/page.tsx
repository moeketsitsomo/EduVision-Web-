import { fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { ContactForm } from '@/components/public/contact-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, Clock } from 'lucide-react';

export default async function ContactPage() {
  const site = await fetchSite();
  const { school, contacts, socials } = site;

  const general = contacts.filter((c) => c.type === 'general' || c.type === 'office');
  const emergency = contacts.filter((c) => c.type === 'emergency');

  return (
    <PublicShell site={site}>
      <section className="bg-[var(--school-primary)] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">Get in touch with {school.name}.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="size-5" /> Visit Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {school.address && <p>{school.address}</p>}
                {school.googleMapsUrl && (
                  <div className="mt-4 aspect-video rounded-lg overflow-hidden border">
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Phone className="size-5" /> Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {school.contactPhone && <p><span className="font-semibold">Phone:</span> {school.contactPhone}</p>}
                {school.contactEmail && <p><span className="font-semibold">Email:</span> <a href={`mailto:${school.contactEmail}`} className="text-[var(--school-primary)] hover:underline">{school.contactEmail}</a></p>}
                {school.officeHours && (
                  <div className="pt-2 border-t mt-2">
                    <p className="font-semibold flex items-center gap-2"><Clock className="size-4" /> Office Hours</p>
                    <p className="whitespace-pre-line text-muted-foreground">{school.officeHours}</p>
                  </div>
                )}
                {general.length > 0 && (
                  <ul className="pt-2 border-t mt-2 space-y-1">
                    {general.map((c) => (
                      <li key={c.id}>{c.label ? `${c.label}: ` : ''}{c.name} — {c.number}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {emergency.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  {emergency.map((c) => (
                    <p key={c.id}>{c.label ? `${c.label}: ` : ''}{c.name} — <a href={`tel:${c.number}`} className="text-[var(--school-primary)] hover:underline">{c.number}</a></p>
                  ))}
                </CardContent>
              </Card>
            )}

            {socials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {socials.map((s) => (
                      <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80">{s.platform}</a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
            <ContactForm schoolName={school.name} />
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
