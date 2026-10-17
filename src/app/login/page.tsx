import LoginShell from './login-shell';

interface LoginPageProps {
  searchParams: Promise<{ next?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const nextPath = (await searchParams)?.next;
  const redirectTo = typeof nextPath === 'string' && nextPath.startsWith('/') ? nextPath : '/admin';

  return <LoginShell redirectTo={redirectTo} />;
}
