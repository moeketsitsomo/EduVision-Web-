export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('eduvision_token');
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers);

  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`/api${path}`, { ...init, headers });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Request failed' })) as { message?: string };
    throw new Error(data.message || 'Request failed');
  }
  return res;
}
