import Link from 'next/link';
import { Mail, MapPin, Phone, Globe } from 'lucide-react';
import type { SiteData, Page } from '@/lib/types';

const socialIcon = () => Globe;

const CORE_SLUGS = new Set(['home', 'about', 'academics', 'admissions', 'news', 'events', 'gallery', 'contact', 'portal']);

export function Footer({ site }: { site: SiteData }) {
  const { school, socials, contacts, pages } = site;
  const emergency = contacts.filter((c) => c.type === 'emergency');
  const menuPages = pages
    .filter((p: Page) => p.showInMenu && !CORE_SLUGS.has(p.slug))
    .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));

  return (
    <footer className="bg-[var(--school-secondary)] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <h3 className="font-bold text-xl mb-4">{school.name}</h3>
            <p className="opacity-80 text-sm leading-relaxed mb-6">{school.footerText || school.metaDescription}</p>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socials.map((social) => {
                  const Icon = socialIcon();
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.platform}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide opacity-90">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/" className="hover:opacity-100 hover:underline">Home</Link></li>
              <li><Link href="/about" className="hover:opacity-100 hover:underline">About</Link></li>
              <li><Link href="/academics" className="hover:opacity-100 hover:underline">Academics</Link></li>
              <li><Link href="/admissions" className="hover:opacity-100 hover:underline">Admissions</Link></li>
              <li><Link href="/news" className="hover:opacity-100 hover:underline">News</Link></li>
              <li><Link href="/events" className="hover:opacity-100 hover:underline">Events</Link></li>
              <li><Link href="/gallery" className="hover:opacity-100 hover:underline">Gallery</Link></li>
              <li><Link href="/contact" className="hover:opacity-100 hover:underline">Contact</Link></li>
              {menuPages.map((page) => (
                <li key={page.id}><Link href={`/${page.slug}`} className="hover:opacity-100 hover:underline">{page.title}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide opacity-90">Contact Us</h4>
            <ul className="space-y-3 text-sm opacity-80">
              {school.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="size-4 mt-0.5 shrink-0" />
                  <span>{school.address}</span>
                </li>
              )}
              {school.contactPhone && (
                <li className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0" />
                  <a href={`tel:${school.contactPhone}`} className="hover:opacity-100 hover:underline">{school.contactPhone}</a>
                </li>
              )}
              {school.contactEmail && (
                <li className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0" />
                  <a href={`mailto:${school.contactEmail}`} className="hover:opacity-100 hover:underline">{school.contactEmail}</a>
                </li>
              )}
              {school.officeHours && (
                <li className="pt-2 border-t border-white/10 mt-4 whitespace-pre-line">{school.officeHours}</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide opacity-90">Emergency Contacts</h4>
            <ul className="space-y-2 text-sm opacity-80">
              {emergency.length > 0 ? emergency.map((contact) => (
                <li key={contact.id}>
                  {contact.name}: <a href={`tel:${contact.number}`} className="hover:underline">{contact.number}</a>
                  {contact.label ? ` (${contact.label})` : ''}
                </li>
              )) : (
                <li>No emergency contacts listed.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70">
          <span>&copy;{' '}{new Date().getFullYear()}{' '}{school.name}. All rights reserved.</span>
          <span>Powered by <Link href="/" className="hover:underline">EduVision</Link></span>
        </div>
      </div>
    </footer>
  );
}
