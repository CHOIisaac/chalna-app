import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthService } from '@/src/services/auth';
import { fcmNotificationService } from '@/src/services/fcmNotificationService';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // NanumPenScript: require('../assets/fonts/NanumPenScript-Regular.ttf'), // 임시로 주석 처리
  });

  // 인증 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 앱 시작 시 로그인 상태 확인 및 FCM 초기화 (한 번만 실행)
  useEffect(() => {
    let isMounted = true; // 컴포넌트가 마운트된 상태인지 확인
    
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 인증 상태 확인 중...');
        const isLoggedIn = await AuthService.isLoggedIn();
        // console.log('🔑 저장된 토큰:', isLoggedIn ? '있음' : '없음');
        console.log('🔍 로그인 상태:', isLoggedIn);
        
        if (!isMounted) return; // 컴포넌트가 언마운트되었으면 실행하지 않음
        
        setIsAuthenticated(isLoggedIn);
        console.log('✅ 인증 상태 설정 완료:', isLoggedIn);

        // 로그인 상태이면 FCM 토큰 등록
        if (isLoggedIn) {
          await initializeFCM();
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuthStatus();
    
    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 플래그 설정
    };
  }, []); // 의존성 배열을 빈 배열로 설정하여 한 번만 실행

  // FCM 푸시 알림 초기화
  const initializeFCM = async () => {
    try {
      console.log('🔔 FCM 푸시 알림 초기화 중...');
      
      // FCM 토큰 등록
      const token = await fcmNotificationService.registerForPushNotificationsAsync();
      
      if (token) {
        console.log('✅ FCM 토큰 등록 완료:', token);
        
        // 서버에 FCM 토큰 등록
        const userData = await AuthService.getUserData();
        if (userData?.id) {
          const result = await fcmNotificationService.registerTokenToServer(userData.id.toString());
          if (result.success) {
            console.log('✅ 서버에 FCM 토큰 등록 완료');
          } else {
            console.log('⚠️ 서버에 FCM 토큰 등록 실패:', result.error);
          }
        }
      } else {
        console.log('⚠️ FCM 토큰을 가져오지 못했습니다. (시뮬레이터 또는 권한 거부)');
      }
    } catch (error) {
      console.error('❌ FCM 초기화 실패:', error);
    }
  };

  // FCM 알림 리스너 설정
  useEffect(() => {
    const unsubscribe = fcmNotificationService.setupNotificationListeners();
    return unsubscribe;
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
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            initialRouteName={isAuthenticated === null ? undefined : (isAuthenticated ? "(tabs)" : "login")}
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
    </SafeAreaProvider>
  );
}