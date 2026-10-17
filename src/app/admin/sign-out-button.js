'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Flex, Text } from 'theme-ui';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignOut = async () => {
    setErrorMessage('');
    setIsSigningOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setErrorMessage(error.message);
        setIsSigningOut(false);
        return;
      }

      router.replace('/login');
      router.refresh();
    } catch {
      setErrorMessage('Sign out failed. Please try again.');
      setIsSigningOut(false);
    }
  };

  return (
    <Flex sx={{ alignItems: 'center', gap: 3 }}>
      <Button onClick={handleSignOut} disabled={isSigningOut}>
        {isSigningOut ? 'Signing out...' : 'Log out'}
      </Button>
      {errorMessage && (
        <Text as="p" sx={{ color: 'error' }}>
          {errorMessage}
        </Text>
      )}
    </Flex>
  );
}
