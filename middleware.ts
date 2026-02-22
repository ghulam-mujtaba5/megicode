import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'megicode.com';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // 1. Force Canonical Host (non-www)
  // NOTE: This is currently commented out because it conflicts with Vercel's domain settings.
  // Vercel is configured to redirect megicode.com -> www.megicode.com, 
  // while this code redirects www.megicode.com -> megicode.com, causing a loop.
  // To re-enable this, first change the Primary Domain in Vercel to 'megicode.com'.
  /*
  const host = request.headers.get('host');
  if (host === `www.${CANONICAL_HOST}`) {
    return NextResponse.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301);
  }
  */

  // 2. Remove trailing slashes (except root "/")
  // Next.js handles this automatically by default (trailingSlash: false).
  /*
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '');
    return NextResponse.redirect(url, 301);
  }
  */

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
