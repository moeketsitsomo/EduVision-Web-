export function getSchoolSlug(host?: string | null): string {
  const fallback = process.env.DEFAULT_SCHOOL_SLUG || 'demo-school';
  if (!host) return fallback;

  const h = host.split(':')[0].toLowerCase();
  const parts = h.split('.');

  if (parts.length >= 2) {
    const first = parts[0];
    const reserved = ['www', 'admin', 'api', 'app'];

    if (!reserved.includes(first)) {
      return first;
    }

    if (first === 'www' && parts.length >= 3 && !reserved.includes(parts[1])) {
      return parts[1];
    }
  }

  return fallback;
}
