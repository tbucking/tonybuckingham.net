'use client';

import { useEffect, useState } from 'react';
import LoginClient from './login-client';

interface LoginShellProps {
  redirectTo: string;
}

export default function LoginShell({ redirectTo }: LoginShellProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <LoginClient redirectTo={redirectTo} />;
}
