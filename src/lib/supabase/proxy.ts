import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseEnv } from './env';

const ADMIN_PATH = '/admin';
const LOGIN_PATH = '/login';

export async function updateSession(request: NextRequest) {
  const env = getSupabaseEnv();
  if (!env) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
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

  if (isAdminRoute && (!claims || error)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && claims) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = ADMIN_PATH;
    adminUrl.search = '';
    return NextResponse.redirect(adminUrl);
  }

  return response;
}
