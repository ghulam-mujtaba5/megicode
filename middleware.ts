import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'www.megicode.com';
const CANONICAL_ORIGIN = 'https://www.megicode.com';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // 1. Force Canonical Host (www.megicode.com) with 301 permanent redirect.
  //    Handles non-www → www and any other non-canonical hostnames.
  //    Vercel domain config for megicode.com should point to the project
  //    (not a redirect alias) so this middleware can issue a proper 301.
  if (host && host !== CANONICAL_HOST && !host.startsWith('localhost') && !host.includes('vercel.app')) {
    return NextResponse.redirect(
      `${CANONICAL_ORIGIN}${url.pathname}${url.search}`,
      301
    );
  }

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
