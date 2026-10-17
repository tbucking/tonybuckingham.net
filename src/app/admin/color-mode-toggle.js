'use client';

import { Button, useColorMode } from 'theme-ui';

export default function ColorModeToggle() {
  const [mode, setMode] = useColorMode();
  const isDark = mode === 'dark';

  return (
    <Button
      variant="secondary"
      onClick={() => setMode(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? 'Light mode' : 'Dark mode'}
    </Button>
  );
}
