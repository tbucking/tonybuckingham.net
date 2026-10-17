import { Auth } from '../auth';

interface LoginClientProps {
  redirectTo: string;
}

export default function LoginClient({ redirectTo }: LoginClientProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <Auth redirectTo={redirectTo}>
        <p className="text-sm text-muted-foreground">
          Sign in to access the admin area.
        </p>
      </Auth>
    </main>
  );
}
