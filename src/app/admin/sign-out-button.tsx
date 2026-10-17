'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

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
    <div className="flex items-center gap-3">
      <Button variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
        <LogOut />
        {isSigningOut ? 'Signing out...' : 'Log out'}
      </Button>
      {errorMessage && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
