import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingShell } from './shell';
import { CheckCircle, Globe, Shield, Smartphone, Zap, Clock, Users, CreditCard } from 'lucide-react';

const features = [
  { icon: Globe, title: 'Own Website', description: 'Every school gets a professional public website with its own domain or subdomain.' },
  { icon: Shield, title: 'Secure', description: 'HTTPS, encrypted passwords, role-based access, audit logs and file validation.' },
  { icon: Smartphone, title: 'Responsive', description: 'Websites look great on mobile, tablet and desktop with dark and light mode.' },
  { icon: Zap, title: 'Fast', description: 'Built on Next.js and NestJS with Redis caching, database indexes and a CDN-ready architecture.' },
  { icon: Clock, title: 'Self-Service', description: 'Update pages, posts, staff, events, fees and media without any coding.' },
  { icon: Users, title: 'Multi-Tenant', description: 'Hundreds of schools on one platform, each with isolated data and users.' },
  { icon: CreditCard, title: 'Subscriptions', description: 'Built-in trial accounts, subscriptions, invoices and license management.' },
];

const steps = [
  'Sign up for a free trial',
  'Choose your school domain',
  'Customise your branding',
  'Publish content and go live',
];

export function MarketingLanding() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            School Websites That Manage Themselves
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            EduVision gives every school a professional website, secure admin dashboard, and full control — no programmer required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/demo">Request a Demo</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Everything a School Needs</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A complete platform designed for South African schools, from marketing pages to parent portals.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title}>
              <CardHeader className="flex flex-row items-center gap-4">
                <f.icon className="size-6 text-primary" />
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold">Launch in Minutes</h2>
              <p className="mt-4 text-muted-foreground">
                EduVision is built for schools that want to be online today. The setup wizard, sample content and automated deployment make going live simple.
              </p>
              <ol className="mt-8 space-y-4">
                {steps.map((step, i) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-semibold">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 border">
              <h3 className="text-xl font-semibold mb-4">Built for growth</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><CheckCircle className="size-5 text-green-600" /> Admissions & applications</li>
                <li className="flex items-center gap-2"><CheckCircle className="size-5 text-green-600" /> Parent, teacher & learner portals</li>
                <li className="flex items-center gap-2"><CheckCircle className="size-5 text-green-600" /> School calendar, notices & events</li>
                <li className="flex items-center gap-2"><CheckCircle className="size-5 text-green-600" /> Results, attendance & reports</li>
                <li className="flex items-center gap-2"><CheckCircle className="size-5 text-green-600" /> Billing, subscriptions & licences</li>
                <li className="flex items-center gap-2"><CheckCircle className="size-5 text-green-600" /> Daily backups & health monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold">Ready to see EduVision in action?</h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Book a personal demo or contact our sales team to discuss pricing and onboarding for your school.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/demo">Request a Demo</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </section>
    </MarketingShell>
  );
}
