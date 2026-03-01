import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'www.megicode.com';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // 1. Force Canonical Host (www.megicode.com)
  // Vercel's primary domain is www.megicode.com, so we enforce that here.
  // Non-www requests are automatically redirected by Vercel (307).
  // If you change Vercel's primary domain, update CANONICAL_HOST above.

  // 2. Remove trailing slashes (except root "/")
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '');
    return NextResponse.redirect(url, 301);
  }

  const response = NextResponse.next();

  // 3. Add X-Robots-Tag: noindex for internal pages
  if (url.pathname.startsWith('/internal') || url.pathname.startsWith('/megicode')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // 4. Set canonical host header for downstream usage
  response.headers.set('X-Canonical-Host', CANONICAL_HOST);

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon\\.ico|meta/|sitemap|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot|xml|json)).*)',
  ],
};
