import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import SplashScreen from '../src/components/SplashScreen';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);
  const [isDevMode, setIsDevMode] = useState(__DEV__); // 개발 모드일 때 true
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // NanumPenScript: require('../assets/fonts/NanumPenScript-Regular.ttf'), // 임시로 주석 처리
  });

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // 개발 모드에서 스플래시 다시 보기
  const resetSplash = () => {
    setShowSplash(true);
  };

  // 전역에서 접근 가능하도록 설정
  if (__DEV__) {
    (global as any).resetSplash = resetSplash;
  }

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  if (showSplash) {
    return <SplashScreen onAnimationFinish={handleSplashFinish} isDevMode={isDevMode} />;
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
          <Stack.Screen name="add-schedule" options={{ headerShown: false }} />
          <Stack.Screen name="schedule-detail" options={{ headerShown: false }} />
          <Stack.Screen name="edit-schedule-field" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
