import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// WebBrowser를 완료하도록 설정
WebBrowser.maybeCompleteAuthSession();

// 카카오 OAuth 설정
const KAKAO_CONFIG = {
  // 실제 카카오 앱 키로 교체 필요
  clientId: 'cd8ddfc145a849f19e915e54d5dce6f6', // REST API 키
  redirectUri: AuthSession.makeRedirectUri({
    scheme: 'chalna', // app.json의 scheme과 일치
    path: '/auth/kakao/callback',
  }),
  scopes: ['profile_nickname', 'account_email'], // 필요한 권한
};

// 카카오 OAuth 엔드포인트
const KAKAO_ENDPOINTS = {
  authorization: 'https://kauth.kakao.com/oauth/authorize',
  token: 'https://kauth.kakao.com/oauth/token',
  userInfo: 'https://kapi.kakao.com/v2/user/me',
};

// 카카오 사용자 정보 타입
export interface KakaoUserInfo {
  id: number;
  connected_at: string;
  properties?: {
    nickname?: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account?: {
    profile?: {
      nickname?: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
    };
    email?: string;
    email_verified?: boolean;
    has_email?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
  };
}

// 카카오 로그인 서비스
export const kakaoAuthService = {
  // 카카오 로그인 시작
  async login(): Promise<{
    accessToken: string;
    refreshToken?: string;
    user: KakaoUserInfo;
  }> {
    try {
      console.log('🔄 카카오 로그인 시작...');
      
      // 1. AuthRequest 생성
      const request = new AuthSession.AuthRequest({
        clientId: KAKAO_CONFIG.clientId,
        scopes: KAKAO_CONFIG.scopes,
        redirectUri: KAKAO_CONFIG.redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {},
      });

      console.log('📱 카카오 인증 페이지로 이동');

      // 2. 인증 페이지 열기
      const result = await request.promptAsync({
        authorizationEndpoint: KAKAO_ENDPOINTS.authorization,
      });

      if (result.type === 'success' && result.params?.code) {
        console.log('✅ 인증 코드 받기 성공');
        
        // 3. 액세스 토큰 요청
        const tokenResponse = await this.getAccessToken(result.params.code);
        
        // 4. 사용자 정보 요청
        const userInfo = await this.getUserInfo(tokenResponse.access_token);
        
        console.log('🎉 카카오 로그인 완료:', userInfo.kakao_account?.profile?.nickname);
        
        return {
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          user: userInfo,
        };
      } else if (result.type === 'cancel') {
        throw new Error('사용자가 로그인을 취소했습니다.');
      } else {
        throw new Error('카카오 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 카카오 로그인 실패:', error);
      throw error;
    }
  },

  // 액세스 토큰 요청
  async getAccessToken(code: string): Promise<{
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
  }> {
    try {
      console.log('🔄 액세스 토큰 요청 중...');
      
      const response = await fetch(KAKAO_ENDPOINTS.token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: KAKAO_CONFIG.clientId,
          redirect_uri: KAKAO_CONFIG.redirectUri,
          code: code,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`토큰 요청 실패: ${response.status} - ${errorData}`);
      }

      const tokenData = await response.json();
      console.log('✅ 액세스 토큰 받기 성공');
      
      return tokenData;
    } catch (error) {
      console.error('❌ 액세스 토큰 요청 실패:', error);
      throw error;
    }
  },

  // 사용자 정보 요청
  async getUserInfo(accessToken: string): Promise<KakaoUserInfo> {
    try {
      console.log('🔄 사용자 정보 요청 중...');
      
      const response = await fetch(KAKAO_ENDPOINTS.userInfo, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`사용자 정보 요청 실패: ${response.status} - ${errorData}`);
      }

      const userInfo = await response.json();
      console.log('✅ 사용자 정보 받기 성공');
      
      return userInfo;
    } catch (error) {
      console.error('❌ 사용자 정보 요청 실패:', error);
      throw error;
    }
  },

  // 카카오 로그아웃 (선택사항)
  async logout(): Promise<void> {
    try {
      console.log('🔄 카카오 로그아웃...');
      // 카카오 로그아웃은 클라이언트에서 직접 처리할 수 없으므로
      // 앱 내에서 로그아웃 처리만 수행
      console.log('✅ 카카오 로그아웃 완료');
    } catch (error) {
      console.error('❌ 카카오 로그아웃 실패:', error);
      throw error;
    }
  },

  // 설정된 리다이렉트 URI 확인
  getRedirectUri(): string {
    return KAKAO_CONFIG.redirectUri;
  },

  // 설정된 클라이언트 ID 확인
  getClientId(): string {
    return KAKAO_CONFIG.clientId;
  },
};

// 카카오 설정 초기화 (실제 앱 키로 교체)
export const initializeKakao = (restApiKey: string) => {
  KAKAO_CONFIG.clientId = restApiKey;
  console.log('✅ 카카오 설정 초기화 완료');
  console.log('📱 리다이렉트 URI:', KAKAO_CONFIG.redirectUri);
};
