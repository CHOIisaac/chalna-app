import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthService } from '@/src/services/auth';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // NanumPenScript: require('../assets/fonts/NanumPenScript-Regular.ttf'), // 임시로 주석 처리
  });

  // 인증 상태 관리 (임시로 false로 설정하여 테스트)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 인증 상태 확인 중...');
        const isLoggedIn = await AuthService.isLoggedIn();
        console.log('🔍 로그인 상태:', isLoggedIn);
        setIsAuthenticated(isLoggedIn);
        
        // 프로그래밍 방식으로 리디렉션
        if (!isLoggedIn) {
          console.log('🚀 로그인 페이지로 리디렉션');
          router.replace('/login');
        } else {
          console.log('🚀 메인 앱으로 리디렉션');
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        setIsAuthenticated(false);
        router.replace('/login');
      }
    };

    checkAuthStatus();
  }, []);

  if (!loaded || isAuthenticated === null) {
    // 폰트 로딩 또는 인증 상태 확인 중
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A' }}>
        <ActivityIndicator size="large" color="#4A5568" />
        <TouchableOpacity 
          style={{ marginTop: 20, padding: 10, backgroundColor: '#ff4444', borderRadius: 5 }}
          onPress={async () => {
            console.log('🧹 강제 로그아웃 실행');
            await AuthService.logout();
            setIsAuthenticated(false);
          }}
        >
          <Text style={{ color: 'white' }}>강제 로그아웃 (디버깅용)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          initialRouteName={!isAuthenticated ? "login" : "(tabs)"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
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