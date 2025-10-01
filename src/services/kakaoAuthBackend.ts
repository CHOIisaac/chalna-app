import {
    KakaoOAuthToken,
    login,
    logout,
    unlink
} from '@react-native-seoul/kakao-login';
import { getApiBaseUrl } from '../config/api';
import { AuthService } from './auth';

// 백엔드 연동 카카오 로그인 서비스
export const kakaoAuthBackendService = {
  // 카카오 로그인 (백엔드 연동)
  async login(): Promise<{
    accessToken: string;
    refreshToken?: string;
    user: { id: string; email: string; name: string; profile_image?: string };
  }> {
    try {
      console.log('🔄 백엔드 연동 카카오 로그인 시작...');
      
      // 1. 카카오 로그인
      const kakaoToken: KakaoOAuthToken = await login();
      console.log('✅ 카카오 로그인 성공, 토큰:', kakaoToken.accessToken);
      
      // 2. 백엔드에 카카오 토큰 전송 (Query Parameter로)
      const request = { access_token: kakaoToken.accessToken };
      
      console.log('🔄 백엔드에 카카오 토큰 전송 중...');
      console.log('📤 카카오 토큰 길이:', kakaoToken.accessToken.length);
      console.log('📤 요청 데이터:', JSON.stringify(request, null, 2));
      
      // 카카오 로그인은 토큰이 필요하지 않으므로 직접 fetch 사용
      const response = await fetch(`${getApiBaseUrl()}/api/v1/kakao/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      console.log('📥 백엔드 응답 전체:', JSON.stringify(responseData, null, 2));
      console.log('📥 responseData 타입:', typeof responseData);
      console.log('📥 responseData 키들:', Object.keys(responseData));
      console.log('📥 responseData.success:', responseData.success);
      console.log('📥 responseData.data:', responseData.data);
      console.log('📥 responseData.error:', responseData.error);
      console.log('📥 responseData.message:', responseData.message);
      
      // 백엔드 응답 구조 확인
      if (responseData.success === false) {
        console.log('❌ 백엔드에서 success: false 반환');
        throw new Error(responseData.error || responseData.message || '백엔드 로그인 실패');
      }
      
      if (!responseData.access_token || !responseData.user) {
        console.log('❌ 백엔드에서 필수 데이터가 없음');
        throw new Error('백엔드에서 필수 데이터를 반환하지 않았습니다.');
      }
      
      console.log('✅ 백엔드 로그인 성공:', responseData.user.full_name);
      
      // 3. 백엔드에서 받은 JWT 토큰 저장
      await AuthService.setTokens(responseData.access_token, responseData.refresh_token || '');
      console.log('✅ 백엔드로부터 JWT 토큰 저장 완료');
      
      return {
        accessToken: responseData.access_token,
        refreshToken: responseData.refresh_token, // 백엔드에서 제공하지 않을 수 있음
        user: {
          id: responseData.user.id.toString(),
          email: responseData.user.email,
          name: responseData.user.full_name,
          profile_image: responseData.kakao_info?.profile_image,
        },
      };
    } catch (error) {
      console.error('❌ 백엔드 연동 카카오 로그인 실패:', error);
      throw error;
    }
  },

  // 카카오 로그아웃
  async logout(): Promise<void> {
    try {
      console.log('🔄 카카오 로그아웃 시작...');
      
      // 1. 앱 토큰 삭제 (먼저 삭제)
      await AuthService.logout();
      console.log('✅ 앱 토큰 삭제 완료');
      
      // 2. 카카오 SDK 로그아웃 (에러가 발생해도 무시)
      try {
        const message = await logout();
        console.log('✅ 카카오 로그아웃 완료:', message);
      } catch (kakaoError) {
        console.log('⚠️ 카카오 SDK 로그아웃 실패 (무시):', kakaoError);
        // 카카오 SDK 로그아웃 실패는 무시하고 계속 진행
      }
      
      console.log('✅ 전체 로그아웃 완료');
    } catch (error) {
      console.error('❌ 로그아웃 실패:', error);
      throw error;
    }
  },

  // 카카오 연결 해제
  async unlink(): Promise<void> {
    try {
      console.log('🔄 카카오 연결 해제 시작...');
      
      // 1. 앱 토큰 삭제 (먼저 삭제)
      await AuthService.logout();
      console.log('✅ 앱 토큰 삭제 완료');
      
      // 2. 카카오 SDK 연결 해제 (에러가 발생해도 무시)
      try {
        const message = await unlink();
        console.log('✅ 카카오 연결 해제 완료:', message);
      } catch (kakaoError) {
        console.log('⚠️ 카카오 SDK 연결 해제 실패 (무시):', kakaoError);
        // 카카오 SDK 연결 해제 실패는 무시하고 계속 진행
      }
      
      console.log('✅ 전체 연결 해제 완료');
    } catch (error) {
      console.error('❌ 연결 해제 실패:', error);
      throw error;
    }
  },
};