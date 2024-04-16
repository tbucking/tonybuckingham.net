'use client';

import { ThemeUIProvider } from 'theme-ui';
import theme from './theme';

export function Providers({ children }) {
  return <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>;
}
