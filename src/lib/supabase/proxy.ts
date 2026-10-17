import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseEnv } from './env';

const ADMIN_PATH = '/admin';
const LOGIN_PATH = '/login';

interface PendingCookie {
  name: string;
  value: string;
  options?: CookieOptions;
}

export async function updateSession(request: NextRequest) {
  const env = getSupabaseEnv();
  if (!env) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  // Refreshed auth cookies must be attached to every response that leaves the
  // proxy, including redirects. Dropping them leaves the browser on a stale
  // token, so /admin and /login keep sending the request back and forth.
  let pendingCookies: PendingCookie[] = [];

  const withCookies = (target: NextResponse) => {
    pendingCookies.forEach(({ name, value, options }) => {
      target.cookies.set(name, value, options);
    });
    return target;
  };

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        pendingCookies = cookiesToSet;

        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  let claims: Record<string, unknown> | null = null;
  let error: unknown = null;

  try {
    const { data, error: claimsError } = await supabase.auth.getClaims();
    claims = (data?.claims as Record<string, unknown> | undefined) ?? null;
    error = claimsError;
  } catch (unexpectedError) {
    error = unexpectedError;
  }

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith(ADMIN_PATH);
  const isLoginRoute = pathname === LOGIN_PATH;
  const isAuthenticated = Boolean(claims) && !error;

  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.searchParams.set('next', pathname);
    return withCookies(NextResponse.redirect(loginUrl));
  }

  // Only bounce away from /login when the server is sure the session is good,
  // so a token that the browser holds but the server rejects cannot ping-pong
  // between /login and /admin.
  if (isLoginRoute && isAuthenticated) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = ADMIN_PATH;
    adminUrl.search = '';
    return withCookies(NextResponse.redirect(adminUrl));
  }

  return response;
}
