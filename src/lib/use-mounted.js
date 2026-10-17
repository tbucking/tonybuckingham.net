'use client';

import { useEffect, useState } from 'react';

// Returns false during server rendering and the initial client render, then
// flips to true after mount. Use this before rendering locale/timezone-
// dependent content so the server HTML matches the client's first paint.
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
