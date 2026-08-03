interface Props {
  title: string;
  subtitle?: string | null;
}

export function PageHeader({ title, subtitle }: Props) {
  return (
    <section className="relative bg-[var(--school-primary)] text-white py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--school-primary)] to-[var(--school-primary)]/70" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-4 text-lg md:text-xl opacity-90 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}
