import { swiss } from '@theme-ui/presets';

const theme = {
  ...swiss,
  useRootStyles: false,
  // Use an explicit light default with a manual toggle rather than following
  // the OS color scheme, so the dashboard theme stays predictable.
  useColorSchemeMediaQuery: false,
  initialColorModeName: 'light',
  colors: {
    ...swiss.colors,
    error: '#e53e3e',
    border: '#e7e2dd',
    modes: {
      dark: {
        text: '#e8e6e3',
        background: '#111214',
        primary: '#ff7a45',
        secondary: '#e0633a',
        highlight: '#1b1d21',
        muted: '#1d1f24',
        gray: '#8a8580',
        border: '#2c2e33'
      }
    }
  },
  shadows: {
    card: '0 1px 3px rgba(0, 0, 0, 0.06)'
  },
  // ThemeUI's Button primitive does not set `cursor` and the `swiss` preset
  // defines no button variants, so define both with a pointer cursor and
  // distinct primary/secondary treatments.
  buttons: {
    primary: {
      cursor: 'pointer',
      '&:hover': {
        bg: 'secondary'
      }
    },
    secondary: {
      cursor: 'pointer',
      color: 'text',
      bg: 'transparent',
      border: '1px solid',
      borderColor: 'border',
      '&:hover': {
        bg: 'muted'
      }
    }
  }
};

export default theme;
