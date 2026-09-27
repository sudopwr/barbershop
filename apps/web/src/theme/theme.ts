import { alpha, createTheme } from '@mui/material/styles';

// Warm charcoal + brass: an old-school barbershop at night
const GOLD = '#C9A45C';
const INK = '#0F0E0C';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: GOLD, light: '#E2C68C', dark: '#9C7A36', contrastText: INK },
    secondary: { main: '#C0392B' },
    background: { default: INK, paper: '#191715' },
    text: { primary: '#F4EFE6', secondary: alpha('#F4EFE6', 0.64), disabled: alpha('#F4EFE6', 0.38) },
    divider: alpha('#F4EFE6', 0.1),
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter Variable", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 },
    h4: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    overline: { fontWeight: 600, letterSpacing: '0.24em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        body: { WebkitFontSmoothing: 'antialiased' },
        '::selection': { background: alpha(GOLD, 0.35) },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 999, paddingInline: 22 }, sizeLarge: { paddingBlock: 12 } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', minHeight: 44, borderRadius: 999 },
      },
    },
  },
});

export const brand = { gold: GOLD, ink: INK };
