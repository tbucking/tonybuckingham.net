'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Flex, Input, Label, Text } from 'theme-ui';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

export function Auth({ children }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

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
  }, []);

  const resetMessages = () => {
    setStatusMessage('');
    setErrorMessage('');
  };

  const userEmail = session?.user?.email ?? '';

  const handleSignUp = async () => {
    if (!supabase) {
      return;
    }

    resetMessages();
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setStatusMessage('Account created. You can now sign in.');
    setIsLoading(false);
  };

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
      <Box sx={{ bg: 'background', color: 'text', p: 4, borderRadius: 8, maxWidth: 420 }}>
        <Text as="p">Checking your session...</Text>
      </Box>
    );
  }

  if (!isSupabaseConfigured || !supabase) {
    return (
      <Box sx={{ bg: 'background', color: 'text', p: 4, borderRadius: 8, maxWidth: 520 }}>
        <Text as="h1" sx={{ mb: 2, fontSize: 4 }}>
          Supabase auth is not configured
        </Text>
        <Text as="p" sx={{ color: 'primary' }}>
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.
        </Text>
      </Box>
    );
  }

  if (session) {
    return (
      <Flex sx={{ flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <Box
          sx={{
            bg: 'background',
            color: 'text',
            p: 4,
            borderRadius: 8,
            maxWidth: 420,
            width: '100%'
          }}
        >
          <Text as="p" sx={{ mb: 3 }}>
            Signed in as <strong>{userEmail}</strong>
          </Text>
          <Button onClick={handleSignOut} disabled={isLoading}>
            {isLoading ? 'Signing out...' : 'Sign out'}
          </Button>
          {statusMessage && (
            <Text as="p" sx={{ mt: 3, color: 'primary' }}>
              {statusMessage}
            </Text>
          )}
          {errorMessage && (
            <Text as="p" sx={{ mt: 3, color: 'error' }}>
              {errorMessage}
            </Text>
          )}
        </Box>
        {children}
      </Flex>
    );
  }

  return (
    <Box
      as="section"
      sx={{
        bg: 'background',
        color: 'text',
        p: 4,
        borderRadius: 8,
        maxWidth: 420,
        width: '100%'
      }}
    >
      <Text as="h1" sx={{ mb: 3, fontSize: 4 }}>
        Sign in
      </Text>
      <Flex sx={{ flexDirection: 'column', gap: 3 }}>
        <Box>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </Box>

        <Box>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </Box>

        <Flex sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Button onClick={handleSignIn} disabled={isLoading}>
            {isLoading ? 'Please wait...' : 'Sign in'}
          </Button>
          <Button variant="secondary" onClick={handleSignUp} disabled={isLoading}>
            {isLoading ? 'Please wait...' : 'Sign up'}
          </Button>
        </Flex>
      </Flex>

      {statusMessage && (
        <Text as="p" sx={{ mt: 3, color: 'primary' }}>
          {statusMessage}
        </Text>
      )}
      {errorMessage && (
        <Text as="p" sx={{ mt: 3, color: 'error' }}>
          {errorMessage}
        </Text>
      )}
    </Box>
  );
}
