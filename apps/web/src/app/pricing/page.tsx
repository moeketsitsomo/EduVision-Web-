import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingShell } from '@/components/marketing/shell';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: 'R 499',
    period: '/ month',
    description: 'Perfect for small schools getting online.',
    features: [
      'Custom school website',
      'Admin dashboard',
      'Up to 5 staff users',
      '100 MB storage',
      'News, events & pages',
      'Email support',
    ],
    missing: ['Parent portal', 'Online admissions', 'Results portal', 'Priority support'],
    cta: 'Start Trial',
    popular: false,
  },
  {
    name: 'Standard',
    price: 'R 999',
    period: '/ month',
    description: 'For growing schools with active communication.',
    features: [
      'Custom school website',
      'Admin dashboard',
      'Up to 25 staff users',
      '5 GB storage',
      'News, events, notices & downloads',
      'Parent & teacher portals',
      'School calendar',
      'Standard support',
    ],
    missing: ['Online admissions', 'Results portal'],
    cta: 'Start Trial',
    popular: true,
  },
  {
    name: 'Premium',
    price: 'R 1 999',
    period: '/ month',
    description: 'Complete digital school management.',
    features: [
      'Custom school website',
      'Admin dashboard',
      'Up to 100 staff users',
      '50 GB storage',
      'Online admissions',
      'Results portal',
      'Attendance module',
      'Priority support',
    ],
    missing: [],
    cta: 'Contact Sales',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For school groups, districts and franchises.',
    features: [
      'Unlimited schools',
      'Unlimited users',
      'Unlimited storage',
      'Custom domain & branding',
      'Dedicated account manager',
      'SLA & advanced security',
      'Custom integrations',
    ],
    missing: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Choose a plan that fits your school. All plans include a 14-day free trial with no credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? 'border-primary ring-1 ring-primary' : ''}>
              {plan.popular && (
                <div className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-t-lg">Most Popular</div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="size-4 text-green-600 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-muted-foreground">
                      <X className="size-4 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  <Link href={plan.cta === 'Contact Sales' ? '/contact' : '/demo'}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Prices exclude VAT. Annual billing available with a discount. Schools on the Premium plan can add
          SMS, online payments and extra storage as optional add-ons.
        </p>
      </section>
    </MarketingShell>
  );
}
