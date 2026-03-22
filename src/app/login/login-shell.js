'use client';

import { useEffect, useState } from 'react';
import LoginClient from './login-client';

export default function LoginShell({ redirectTo }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <LoginClient redirectTo={redirectTo} />;
}
