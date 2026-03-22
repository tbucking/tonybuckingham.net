import LoginShell from './login-shell';

export default async function LoginPage({ searchParams }) {
  const nextPath = (await searchParams)?.next;
  const redirectTo = typeof nextPath === 'string' && nextPath.startsWith('/') ? nextPath : '/admin';

  return <LoginShell redirectTo={redirectTo} />;
}
