import LoginClient from './login-client';

export default async function LoginPage({ searchParams }) {
  const nextPath = (await searchParams)?.next;
  const redirectTo = typeof nextPath === 'string' && nextPath.startsWith('/') ? nextPath : '/admin';

  return <LoginClient redirectTo={redirectTo} />;
}
