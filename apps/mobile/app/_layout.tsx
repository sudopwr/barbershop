import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { colors, navigationTheme, paperTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

// Refetch stale data when the app comes back to the foreground
AppState.addEventListener('change', (status) => {
  if (Platform.OS !== 'web') focusManager.setFocused(status === 'active');
});

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 2 } } }));

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_700Bold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => undefined);
  }, [fontsLoaded, fontError]);

  // Render nothing until fonts are ready (the splash screen stays up meanwhile)
  if (!fontsLoaded && !fontError) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={navigationTheme}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.ink },
              headerTintColor: colors.text,
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.ink },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="service/[id]" options={{ title: '', presentation: 'card' }} />
            <Stack.Screen name="+not-found" options={{ title: 'Not found' }} />
          </Stack>
        </ThemeProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
