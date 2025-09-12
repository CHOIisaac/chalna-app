import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="notification-detail" options={{ headerShown: false }} />
          <Stack.Screen name="ledger-detail" options={{ headerShown: false }} />
          <Stack.Screen name="edit-field" options={{ headerShown: false }} />
          <Stack.Screen name="add-ledger" options={{ headerShown: false }} />
          <Stack.Screen name="add-event" options={{ headerShown: false }} />
          <Stack.Screen name="edit-event" options={{ headerShown: false }} />
          <Stack.Screen name="event-detail" options={{ headerShown: false }} />
          <Stack.Screen name="edit-event-field" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
