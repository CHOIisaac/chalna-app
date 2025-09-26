import {
    getProfile,
    KakaoOAuthToken,
    KakaoProfile,
    login,
    logout,
    unlink,
} from '@react-native-seoul/kakao-login';

// 카카오 로그인 서비스 V2 (react-native-kakao-login 사용)
export const kakaoAuthServiceV2 = {
  // 카카오 로그인
  async login(): Promise<{
    accessToken: string;
    refreshToken?: string;
    user: KakaoProfile;
  }> {
    try {
      console.log('🔄 카카오 로그인 시작...');
      
      // 1. 카카오 로그인
      const token: KakaoOAuthToken = await login();
      console.log('✅ 카카오 로그인 성공, 토큰:', token.accessToken);
      
      // 2. 사용자 프로필 가져오기
      const profile: KakaoProfile = await getProfile();
      console.log('✅ 사용자 프로필 가져오기 성공:', profile.nickname);
      
      return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: profile,
      };
    } catch (error) {
      console.error('❌ 카카오 로그인 실패:', error);
      throw error;
    }
  },

  // 카카오 로그아웃
  async logout(): Promise<void> {
    try {
      console.log('🔄 카카오 로그아웃...');
      const message = await logout();
      console.log('✅ 카카오 로그아웃 완료:', message);
    } catch (error) {
      console.error('❌ 카카오 로그아웃 실패:', error);
      throw error;
    }
  },

  // 카카오 연결 해제
  async unlink(): Promise<void> {
    try {
      console.log('🔄 카카오 연결 해제...');
      const message = await unlink();
      console.log('✅ 카카오 연결 해제 완료:', message);
    } catch (error) {
      console.error('❌ 카카오 연결 해제 실패:', error);
      throw error;
    }
  },

  // 사용자 프로필 가져오기
  async getProfile(): Promise<KakaoProfile> {
    try {
      console.log('🔄 사용자 프로필 가져오기...');
      const profile = await getProfile();
      console.log('✅ 사용자 프로필 가져오기 성공');
      return profile;
    } catch (error) {
      console.error('❌ 사용자 프로필 가져오기 실패:', error);
      throw error;
    }
  },
};

// 카카오 SDK 초기화 (app.json에서 설정된 앱 키 사용)
export const initializeKakaoV2 = async () => {
  try {
    // react-native-kakao-login은 app.json의 설정을 자동으로 읽어옵니다
    console.log('✅ 카카오 SDK V2 초기화 완료');
  } catch (error) {
    console.error('❌ 카카오 SDK V2 초기화 실패:', error);
    throw error;
  }
};
