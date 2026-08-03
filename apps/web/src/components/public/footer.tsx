import { Mail, MapPin, Phone } from 'lucide-react';
import type { SiteData } from '@/lib/types';

export function Footer({ site }: { site: SiteData }) {
  const { school, socials, contacts } = site;
  const emergency = contacts.filter((c) => c.type === 'emergency');

  return (
    <footer className="bg-[var(--school-secondary)] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-2">{school.name}</h3>
          <p className="opacity-80 text-sm">{school.footerText || school.metaDescription}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li className="flex items-start gap-2">
              <MapPin className="size-4 mt-0.5 shrink-0" />
              <span>{school.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <span>{school.contactPhone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <span>{school.contactEmail}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Emergency Contacts</h4>
          <ul className="space-y-1 text-sm opacity-80">
            {emergency.length > 0 ? (
              emergency.map((contact) => (
                <li key={contact.id}>
                  {contact.name} - {contact.number}
                  {contact.label ? ` (${contact.label})` : ''}
                </li>
              ))
            ) : contacts.length > 0 ? (
              contacts.map((contact) => (
                <li key={contact.id}>
                  {contact.name} - {contact.number}
                </li>
              ))
            ) : (
              <li>No emergency contacts listed.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70">
        <span>&copy; {new Date().getFullYear()} {school.name}</span>
        <div className="flex gap-4">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-80"
            >
              {social.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
