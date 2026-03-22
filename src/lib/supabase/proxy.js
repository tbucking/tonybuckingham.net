import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const ADMIN_PATH = '/admin';
const LOGIN_PATH = '/login';

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function updateSession(request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
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
    }
  );

  let claims = null;
  let error = null;

  try {
    const { data, error: claimsError } = await supabase.auth.getClaims();
    claims = data?.claims ?? null;
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
