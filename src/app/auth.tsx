'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface AuthProps {
  children?: React.ReactNode;
  redirectTo?: string | null;
}

export function Auth({ children, redirectTo = null }: AuthProps) {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    setSupabase(createClient());
  }, [isSupabaseConfigured]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsCheckingSession(false);
      return undefined;
    }

    let mounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        setErrorMessage(error.message);
        setIsCheckingSession(false);
        return;
      }

      setSession(data.session);
      setIsCheckingSession(false);
    };

    loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isSupabaseConfigured, supabase]);

  // Navigating away as soon as the client sees a session used to loop: if the
  // server rejected that session, /admin sent the browser back to /login and
  // this effect immediately sent it to /admin again. The proxy already
  // redirects signed-in visitors away from /login, so only navigate after a
  // sign-in this component actually performed.

  const resetMessages = () => {
    setStatusMessage('');
    setErrorMessage('');
  };

  const userEmail = session?.user?.email ?? '';

  const handleSignIn = async () => {
    if (!supabase) {
      return;
    }

    resetMessages();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setStatusMessage('Signed in successfully.');
    setIsLoading(false);

    if (redirectTo) {
      router.replace(redirectTo);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    resetMessages();
    setIsLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setStatusMessage('Signed out.');
    setIsLoading(false);
  };

  if (isCheckingSession) {
    return (
      <Card className="w-full max-w-[420px]">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Checking your session...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isSupabaseConfigured || !supabase) {
    return (
      <Card className="w-full max-w-[520px]">
        <CardHeader>
          <CardTitle>Supabase auth is not configured</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your
              environment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (session) {
    return (
      <div className="flex w-full flex-col items-center gap-6">
        <Card className="w-full max-w-[420px]">
          <CardContent className="pt-6">
            <p className="mb-4 text-sm">
              Signed in as <strong>{userEmail}</strong>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild>
                <Link href="/admin">Go to admin</Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut} disabled={isLoading}>
                {isLoading ? 'Signing out...' : 'Sign out'}
              </Button>
            </div>
            {statusMessage && (
              <p className="mt-4 text-sm text-muted-foreground">{statusMessage}</p>
            )}
            {errorMessage && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        {children}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-[420px]">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use your email and password to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSignIn();
          }}
        >
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Please wait...' : 'Sign in'}
            </Button>
          </FieldGroup>
        </form>

        {statusMessage && (
          <p className="mt-4 text-sm text-muted-foreground">{statusMessage}</p>
        )}
        {errorMessage && (
          <FieldError className="mt-4">{errorMessage}</FieldError>
        )}
      </CardContent>
    </Card>
  );
}
