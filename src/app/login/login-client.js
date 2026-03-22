'use client';

import { Box, Text } from 'theme-ui';
import { Auth } from '../auth';

export default function LoginClient({ redirectTo }) {
  return (
    <Box
      as="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4
      }}
    >
      <Auth redirectTo={redirectTo}>
        <Text as="p" sx={{ color: 'text' }}>
          Sign in to access the admin area.
        </Text>
      </Auth>
    </Box>
  );
}
