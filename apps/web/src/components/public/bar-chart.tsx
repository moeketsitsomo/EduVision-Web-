'use client';

interface Bar {
  label: string;
  value: number;
  color?: string;
}

export function BarChart({ bars, max, unit = '' }: { bars: Bar[]; max?: number; unit?: string }) {
  const top = max ?? Math.max(...bars.map((b) => b.value), 1);
  return (
    <div className="w-full">
      <div className="flex items-end gap-2 h-48">
        {bars.map((bar, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative w-full flex items-end justify-center h-36">
              <div
                className="w-full max-w-[48px] rounded-t-md transition-all duration-700"
                style={{ height: `${(bar.value / top) * 100}%`, backgroundColor: bar.color || 'var(--school-primary)' }}
              />
              <span className="absolute -top-6 opacity-0 group-hover:opacity-100 text-xs font-semibold transition-opacity">
                {bar.value}{unit}
              </span>
            </div>
            <span className="text-xs text-muted-foreground text-center truncate w-full" title={bar.label}>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({ segments, size = 120 }: { segments: { label: string; value: number; color?: string }[]; size?: number }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let offset = 0;
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * c;
          const circle = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="transparent"
              stroke={seg.color || 'var(--school-primary)'}
              strokeWidth="16"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              className="transition-all"
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1 text-xs">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color || 'var(--school-primary)' }} />
            {seg.label}: {seg.value}
          </div>
        ))}
      </div>
    </div>
  );
}
