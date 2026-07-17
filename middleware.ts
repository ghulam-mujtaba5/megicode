import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'www.megicode.com';
const CANONICAL_ORIGIN = 'https://www.megicode.com';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  const isLocalHost =
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('[::1]') ||
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname === '::1';

  if (host && host !== CANONICAL_HOST && !isLocalHost && !host.includes('vercel.app')) {
    return NextResponse.redirect(`${CANONICAL_ORIGIN}${url.pathname}${url.search}`, 301);
  }

  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '');
    return NextResponse.redirect(url, 301);
  }

  if (url.pathname === '/article' || url.pathname.startsWith('/article/')) {
    url.pathname = url.pathname.replace(/^\/article/, '/insights');
    return NextResponse.redirect(url, 301);
  }

  const response = NextResponse.next();

  if (url.pathname.startsWith('/internal') || url.pathname.startsWith('/megicode')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  response.headers.set('X-Canonical-Host', CANONICAL_HOST);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|meta/|sitemap|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot|xml|json)).*)',
  ],
};
