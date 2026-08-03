import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CountUp } from './count-up';

export function StatCard({ label, value, icon: Icon }: { label: string; value: string | number | null | undefined; icon: LucideIcon }) {
  const str = String(value ?? '');
  const match = str.match(/^([\d,.]+)(.*)$/);
  const numeric = typeof value === 'number' ? value : match ? parseFloat(match[1].replace(/,/g, '')) : NaN;
  const suffix = match ? match[2] : '';
  const isNumber = !Number.isNaN(numeric);

  return (
    <Card className="group hover:-translate-y-1 transition-transform duration-300 border-l-4" style={{ borderLeftColor: 'var(--school-primary)' }}>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-[var(--school-primary)]/10 text-[var(--school-primary)] group-hover:scale-110 transition-transform">
          <Icon className="size-6" />
        </div>
        <div>
          <p className="text-3xl font-bold tracking-tight">
            {isNumber ? <>
              <CountUp target={numeric} />{suffix}
            </> : value}
          </p>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
