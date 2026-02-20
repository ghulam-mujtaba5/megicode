import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'megicode.com';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');

  // 1. Force HTTPS in production
  if (proto === 'http' && process.env.NODE_ENV === 'production') {
    url.protocol = 'https:';
    url.host = hostname.startsWith('www.') ? hostname.replace('www.', '') : hostname;
    return NextResponse.redirect(url, 301);
  }

  // 2. Force www → non-www 301 redirect
  if (hostname.startsWith('www.')) {
    url.host = hostname.replace('www.', '');
    return NextResponse.redirect(url, 301);
  }

  // 3. Remove trailing slashes (except root "/")
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '');
    return NextResponse.redirect(url, 301);
  }

  const response = NextResponse.next();

  // 4. Add X-Robots-Tag: noindex for internal pages
  if (url.pathname.startsWith('/internal') || url.pathname.startsWith('/megicode')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // 5. Set canonical host header for downstream usage
  response.headers.set('X-Canonical-Host', CANONICAL_HOST);

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon\\.ico|meta/|sitemap|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot|xml|json)).*)',
  ],
};
