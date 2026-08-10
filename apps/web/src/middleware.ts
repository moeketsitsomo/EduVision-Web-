import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BYPASSED_PATHS = [
  '/setup',
  '/admin',
  '/api',
  '/portal',
  '/_next',
  '/static',
  '/uploads',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (BYPASSED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  try {
    const apiUrl = process.env.API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/setup/status`, {
      headers: { 'x-school-slug': 'setup' },
      cache: 'no-store',
    });
    const data = (await res.json()) as { setupRequired?: boolean };
    if (data.setupRequired) {
      return NextResponse.redirect(new URL('/setup', request.url));
    }
  } catch {
    // If the API is not reachable yet, let the request through so the
    // application can show its own loading/error state.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|api|uploads|favicon.ico|robots.txt|sitemap.xml).*)'],
};
