/**
 * 스플래시 화면과 동일한 스타일의 로그인 페이지
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { kakaoAuthBackendService } from '../src/services/kakaoAuthBackend';

export default function LoginScreen() {
  const router = useRouter();
  const [kakaoLoading, setKakaoLoading] = useState(false);

  const handleKakaoLogin = async () => {
    try {
      setKakaoLoading(true);
      console.log('🔄 카카오 로그인 시작...');
      
      const result = await kakaoAuthBackendService.login();
      
      // 로그인 성공 시 바로 홈 화면으로 이동 (알림창 없이)
      console.log('✅ 카카오 로그인 성공:', result);
      router.replace('/(tabs)');
      
    } catch (error) {
      console.error('❌ 카카오 로그인 실패:', error);
      Alert.alert(
        '카카오 로그인 실패',
        '로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    } finally {
      setKakaoLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 스플래시 화면과 동일한 배경 */}
      <View style={styles.background} />
      
      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {/* 스플래시 화면과 동일한 로고 */}
        <View style={styles.logoSection}>
          <Image 
            source={require('../assets/images/chalna-app-icon1.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* 하단 카카오 로그인 버튼 */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            onPress={handleKakaoLogin}
            style={[styles.kakaoButton, kakaoLoading && styles.kakaoButtonDisabled]}
            disabled={kakaoLoading}
            activeOpacity={0.8}
          >
            {kakaoLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#000" />
                <Text style={styles.kakaoButtonText}>로그인 중...</Text>
              </View>
            ) : (
              <View style={styles.kakaoButtonContent}>
                <Ionicons name="chatbubble" size={20} color="#000" />
                <Text style={styles.kakaoButtonText}>카카오로 계속하기</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000', // 스플래시 화면과 동일한 배경색
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  
  // 로고 섹션 (스플래시 화면과 동일)
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200, // 스플래시 화면과 동일한 크기
    height: 200,
  },
  
  // 하단 섹션
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#FEE500',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
  },
  kakaoButtonDisabled: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0.1,
  },
  kakaoButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  kakaoButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});