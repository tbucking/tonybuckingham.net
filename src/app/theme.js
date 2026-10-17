import { swiss } from '@theme-ui/presets';

const theme = {
  ...swiss,
  useRootStyles: false,
  colors: {
    ...swiss.colors,
    error: '#e53e3e'
  },
  // ThemeUI's Button primitive does not set `cursor` and the `swiss` preset
  // defines no button variants, so buttons default to the browser's arrow
  // cursor. Add the pointer cursor expected for clickable controls.
  buttons: {
    primary: {
      cursor: 'pointer'
    },
    secondary: {
      cursor: 'pointer'
    }
  }
};

export default theme;
