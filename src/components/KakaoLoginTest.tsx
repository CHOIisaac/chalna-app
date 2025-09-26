import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { kakaoAuthService, KakaoUserInfo } from '../services/kakaoAuth';

const KakaoLoginTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<KakaoUserInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // 카카오 설정 정보 표시
  const showKakaoConfig = () => {
    Alert.alert(
      '카카오 설정 정보',
      `리다이렉트 URI: ${kakaoAuthService.getRedirectUri()}\n\n클라이언트 ID: ${kakaoAuthService.getClientId()}\n\n⚠️ 실제 카카오 앱 키로 교체 필요!`,
      [{ text: '확인' }]
    );
  };

  // 카카오 로그인 테스트
  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      console.log('🚀 카카오 로그인 테스트 시작...');
      
      const result = await kakaoAuthService.login();
      
      setAccessToken(result.accessToken);
      setUserInfo(result.user);
      
      Alert.alert(
        '카카오 로그인 성공!',
        `환영합니다, ${result.user.kakao_account?.profile?.nickname || '사용자'}님!\n\n이메일: ${result.user.kakao_account?.email || '없음'}\n\n액세스 토큰: ${result.accessToken.substring(0, 20)}...`,
        [{ text: '확인' }]
      );
      
      console.log('✅ 카카오 로그인 성공:', result);
      
    } catch (error: any) {
      console.error('❌ 카카오 로그인 실패:', error);
      Alert.alert(
        '카카오 로그인 실패',
        `오류: ${error.message || '알 수 없는 오류가 발생했습니다.'}\n\n카카오 개발자 콘솔에서 앱 설정을 확인해주세요.`,
        [{ text: '확인' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // 카카오 로그아웃
  const handleKakaoLogout = async () => {
    try {
      await kakaoAuthService.logout();
      setUserInfo(null);
      setAccessToken(null);
      Alert.alert('로그아웃 완료', '카카오 로그아웃이 완료되었습니다.');
    } catch (error: any) {
      console.error('❌ 카카오 로그아웃 실패:', error);
      Alert.alert('로그아웃 실패', error.message || '알 수 없는 오류가 발생했습니다.');
    }
  };

  // 사용자 정보 표시
  const showUserInfo = () => {
    if (!userInfo) return null;

    return (
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoTitle}>사용자 정보</Text>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoLabel}>ID:</Text>
          <Text style={styles.userInfoValue}>{userInfo.id}</Text>
        </View>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoLabel}>닉네임:</Text>
          <Text style={styles.userInfoValue}>
            {userInfo.kakao_account?.profile?.nickname || userInfo.properties?.nickname || '없음'}
          </Text>
        </View>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoLabel}>이메일:</Text>
          <Text style={styles.userInfoValue}>
            {userInfo.kakao_account?.email || '없음'}
          </Text>
        </View>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoLabel}>연결일:</Text>
          <Text style={styles.userInfoValue}>
            {new Date(userInfo.connected_at).toLocaleDateString('ko-KR')}
          </Text>
        </View>
        {accessToken && (
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoLabel}>액세스 토큰:</Text>
            <Text style={styles.userInfoValue} numberOfLines={2}>
              {accessToken.substring(0, 30)}...
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>카카오 로그인 테스트</Text>
      
      {/* 카카오 설정 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>설정 정보</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={showKakaoConfig}
        >
          <Ionicons name="settings" size={20} color="#fff" />
          <Text style={styles.buttonText}>카카오 설정 정보 보기</Text>
        </TouchableOpacity>
      </View>

      {/* 카카오 로그인 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>카카오 로그인</Text>
        <TouchableOpacity
          style={[styles.button, styles.kakaoButton, loading && styles.disabledButton]}
          onPress={handleKakaoLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="logo-google" size={20} color="#fff" />
          )}
          <Text style={styles.buttonText}>
            {loading ? '로그인 중...' : '카카오로 로그인'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 사용자 정보 */}
      {userInfo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>로그인된 사용자</Text>
          {showUserInfo()}
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleKakaoLogout}
          >
            <Ionicons name="log-out" size={20} color="#fff" />
            <Text style={styles.buttonText}>카카오 로그아웃</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 주의사항 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚠️ 주의사항</Text>
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            1. 카카오 개발자 콘솔에서 앱을 등록하고 REST API 키를 설정해주세요.{'\n'}
            2. 리다이렉트 URI를 카카오 앱 설정에 등록해주세요.{'\n'}
            3. src/services/kakaoAuth.ts에서 YOUR_KAKAO_REST_API_KEY를 실제 키로 교체해주세요.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userInfoContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  userInfoItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  userInfoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 80,
  },
  userInfoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  warningContainer: {
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});

export default KakaoLoginTest;
