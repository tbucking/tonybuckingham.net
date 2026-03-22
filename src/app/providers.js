'use client';

import { ThemeUIProvider } from 'theme-ui';
import { EmotionRegistry } from './emotion-registry';
import theme from './theme';

export function Providers({ children }) {
  return (
    <EmotionRegistry>
      <ThemeUIProvider theme={theme}>{children}</ThemeUIProvider>
    </EmotionRegistry>
  );
}
