import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthService } from '@/src/services/auth';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // NanumPenScript: require('../assets/fonts/NanumPenScript-Regular.ttf'), // 임시로 주석 처리
  });

  // 인증 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isLoggedIn = await AuthService.isLoggedIn();
        setIsAuthenticated(isLoggedIn);
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (!loaded || isAuthenticated === null) {
    // 폰트 로딩 또는 인증 상태 확인 중
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A' }}>
        <ActivityIndicator size="large" color="#4A5568" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {!isAuthenticated ? (
            // 로그인하지 않은 경우 - 로그인 화면
            <Stack.Screen name="login" options={{ headerShown: false }} />
          ) : (
            // 로그인한 경우 - 메인 앱 화면들
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          )}
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="notification-detail" options={{ headerShown: false }} />
          <Stack.Screen name="ledger-detail" options={{ headerShown: false }} />
          <Stack.Screen name="edit-field" options={{ headerShown: false }} />
          <Stack.Screen name="add-ledger" options={{ headerShown: false }} />
          <Stack.Screen name="add-schedule" options={{ headerShown: false }} />
          <Stack.Screen name="schedule-detail" options={{ headerShown: false }} />
          <Stack.Screen name="edit-schedule-field" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}