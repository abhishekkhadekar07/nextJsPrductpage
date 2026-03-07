import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from './lib/auth';

const PUBLIC_PAGE_PATHS = ['/login', '/signup'];
const PUBLIC_API_PATHS = ['/api/auth/login', '/api/auth/signup', '/api/auth/me', '/api/auth/logout'];
const PROXY_DEBUG_ENABLED = process.env.AUTH_PROXY_DEBUG === 'true';

function shouldDebug(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') return false;
  return PROXY_DEBUG_ENABLED || request.nextUrl.searchParams.get('__authDebug') === '1';
}

function debugLog(request: NextRequest, stage: string, details: Record<string, unknown> = {}) {
  if (!shouldDebug(request)) return;
  const base = {
    stage,
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
  };
  console.log('[auth-proxy]', { ...base, ...details });
}

function withBrowserDebug(
  request: NextRequest,
  response: NextResponse,
  stage: string,
  details: { destination?: string; status?: number } = {}
) {
  if (!shouldDebug(request)) return response;
  response.headers.set('x-auth-proxy-stage', stage);
  response.headers.set('x-auth-proxy-pathname', request.nextUrl.pathname);
  if (details.destination) {
    response.headers.set('x-auth-proxy-destination', details.destination);
  }
  if (typeof details.status === 'number') {
    response.headers.set('x-auth-proxy-status', String(details.status));
  }
  return response;
}

function buildDebugRedirectUrl(request: NextRequest, destination: string, stage: string) {
  const url = new URL(destination, request.url);
  if (shouldDebug(request)) {
    url.searchParams.set('__proxyStage', stage);
    url.searchParams.set('__authDebug', '1');
  }
  return url;
}

function isPublicPage(pathname: string) {
  return PUBLIC_PAGE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isPublicApi(pathname: string) {
  return PUBLIC_API_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isStaticAsset(pathname: string) {
  return pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || /\.(.*)$/.test(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    debugLog(request, 'allow-static');
    return withBrowserDebug(request, NextResponse.next(), 'allow-static');
  }

  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(authCookie);
  debugLog(request, 'request-start', {
    isAuthenticated,
    isApiRoute: pathname.startsWith('/api'),
    isPublicPage: isPublicPage(pathname),
    isPublicApi: isPublicApi(pathname),
  });

  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    const stage = 'redirect-authenticated-away-from-auth-pages';
    const destination = '/products';
    debugLog(request, 'redirect-authenticated-away-from-auth-pages', {
      destination,
    });
    return withBrowserDebug(
      request,
      NextResponse.redirect(buildDebugRedirectUrl(request, destination, stage)),
      stage,
      { destination }
    );
  }

  if (isPublicPage(pathname)) {
    debugLog(request, 'allow-public-page');
    return withBrowserDebug(request, NextResponse.next(), 'allow-public-page');
  }

  if (pathname.startsWith('/api')) {
    if (isPublicApi(pathname)) {
      debugLog(request, 'allow-public-api');
      return withBrowserDebug(request, NextResponse.next(), 'allow-public-api');
    }

    if (!isAuthenticated) {
      const stage = 'block-protected-api-unauthorized';
      debugLog(request, 'block-protected-api-unauthorized', { status: 401 });
      return withBrowserDebug(
        request,
        NextResponse.json(
          {
            success: false,
            message: 'Unauthorized',
          },
          { status: 401 }
        ),
        stage,
        { status: 401 }
      );
    }

    debugLog(request, 'allow-protected-api-authenticated');
    return withBrowserDebug(request, NextResponse.next(), 'allow-protected-api-authenticated');
  }

  if (!isAuthenticated) {
    const stage = 'redirect-protected-page-unauthenticated';
    const from = `${pathname}${search}`;
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', from);
    if (shouldDebug(request)) {
      loginUrl.searchParams.set('__proxyStage', stage);
      loginUrl.searchParams.set('__authDebug', '1');
    }
    const destination = loginUrl.pathname + loginUrl.search;
    debugLog(request, stage, {
      destination: loginUrl.pathname + loginUrl.search,
    });
    return withBrowserDebug(request, NextResponse.redirect(loginUrl), stage, { destination });
  }

  debugLog(request, 'allow-protected-page-authenticated');
  return withBrowserDebug(request, NextResponse.next(), 'allow-protected-page-authenticated');
}

export const config = {
  matcher: '/:path*',
};
