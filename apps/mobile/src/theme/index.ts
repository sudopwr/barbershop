import { DarkTheme as NavigationDark, type Theme as NavigationTheme } from '@react-navigation/native';
import { MD3DarkTheme, type MD3Theme } from 'react-native-paper';

// Same palette as the website: warm charcoal + brass
export const colors = {
  gold: '#C9A45C',
  goldLight: '#E2C68C',
  goldDark: '#9C7A36',
  ink: '#0F0E0C',
  paper: '#191715',
  paperRaised: '#221F1C',
  text: '#F4EFE6',
  textMuted: 'rgba(244, 239, 230, 0.64)',
  textFaint: 'rgba(244, 239, 230, 0.38)',
  divider: 'rgba(244, 239, 230, 0.10)',
  red: '#C0392B',
};

export const fonts = {
  display: 'PlayfairDisplay_700Bold',
  displayItalic: 'PlayfairDisplay_700Bold_Italic',
  displaySemi: 'PlayfairDisplay_600SemiBold',
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const paperTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 4,
  fonts: {
    ...MD3DarkTheme.fonts,
    default: { ...MD3DarkTheme.fonts.default, fontFamily: fonts.body },
    displayLarge: { ...MD3DarkTheme.fonts.displayLarge, fontFamily: fonts.display },
    displayMedium: { ...MD3DarkTheme.fonts.displayMedium, fontFamily: fonts.display },
    displaySmall: { ...MD3DarkTheme.fonts.displaySmall, fontFamily: fonts.display },
    headlineLarge: { ...MD3DarkTheme.fonts.headlineLarge, fontFamily: fonts.display },
    headlineMedium: { ...MD3DarkTheme.fonts.headlineMedium, fontFamily: fonts.display },
    headlineSmall: { ...MD3DarkTheme.fonts.headlineSmall, fontFamily: fonts.displaySemi },
    titleLarge: { ...MD3DarkTheme.fonts.titleLarge, fontFamily: fonts.semibold },
    titleMedium: { ...MD3DarkTheme.fonts.titleMedium, fontFamily: fonts.semibold },
    titleSmall: { ...MD3DarkTheme.fonts.titleSmall, fontFamily: fonts.semibold },
    labelLarge: { ...MD3DarkTheme.fonts.labelLarge, fontFamily: fonts.semibold },
    labelMedium: { ...MD3DarkTheme.fonts.labelMedium, fontFamily: fonts.medium },
    labelSmall: { ...MD3DarkTheme.fonts.labelSmall, fontFamily: fonts.medium },
    bodyLarge: { ...MD3DarkTheme.fonts.bodyLarge, fontFamily: fonts.body },
    bodyMedium: { ...MD3DarkTheme.fonts.bodyMedium, fontFamily: fonts.body },
    bodySmall: { ...MD3DarkTheme.fonts.bodySmall, fontFamily: fonts.body },
  },
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.gold,
    onPrimary: colors.ink,
    primaryContainer: colors.goldDark,
    onPrimaryContainer: colors.text,
    secondary: colors.goldLight,
    onSecondary: colors.ink,
    secondaryContainer: 'rgba(201, 164, 92, 0.16)',
    onSecondaryContainer: colors.goldLight,
    background: colors.ink,
    onBackground: colors.text,
    surface: colors.paper,
    onSurface: colors.text,
    surfaceVariant: colors.paperRaised,
    onSurfaceVariant: colors.textMuted,
    outline: 'rgba(244, 239, 230, 0.18)',
    outlineVariant: colors.divider,
    error: '#FF8A7A',
    elevation: {
      level0: 'transparent',
      level1: colors.paper,
      level2: colors.paperRaised,
      level3: '#2A2622',
      level4: '#2E2A25',
      level5: '#332E29',
    },
  },
};

export const navigationTheme: NavigationTheme = {
  ...NavigationDark,
  colors: {
    ...NavigationDark.colors,
    primary: colors.gold,
    background: colors.ink,
    card: colors.ink,
    text: colors.text,
    border: colors.divider,
    notification: colors.red,
  },
};

export const spacing = (n: number) => n * 8;
