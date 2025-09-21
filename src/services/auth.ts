/**
 * 인증 서비스 - JWT 토큰 관리
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// 토큰 저장 키
const TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

// 사용자 데이터 타입
export interface UserData {
  id: number;
  email: string;
  name: string;
  phone?: string;
  profileImage?: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserData;
  expires_in: number;
}

// 인증 서비스 클래스
export class AuthService {
  
  // 토큰 저장
  static async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, accessToken),
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
      ]);
    } catch (error) {
      console.error('토큰 저장 실패:', error);
      throw error;
    }
  }

  // 액세스 토큰 가져오기
  static async getAccessToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log('🔑 저장된 토큰:', token ? '있음' : '없음');
      return token;
    } catch (error) {
      console.error('토큰 조회 실패:', error);
      return null;
    }
  }

  // 리프레시 토큰 가져오기
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('리프레시 토큰 조회 실패:', error);
      return null;
    }
  }

  // 사용자 데이터 저장
  static async setUserData(userData: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('사용자 데이터 저장 실패:', error);
      throw error;
    }
  }

  // 사용자 데이터 가져오기
  static async getUserData(): Promise<UserData | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('사용자 데이터 조회 실패:', error);
      return null;
    }
  }

  // 로그인 상태 확인
  static async isLoggedIn(): Promise<boolean> {
    try {
      const token = await AuthService.getAccessToken();
      return !!token;
    } catch (error) {
      console.error('로그인 상태 확인 실패:', error);
      return false;
    }
  }

  // 로그아웃 (모든 토큰 삭제)
  static async logout(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
      ]);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  }

  // 모든 저장된 데이터 삭제 (회원탈퇴 시)
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('데이터 전체 삭제 실패:', error);
      throw error;
    }
  }

  // JWT 토큰 디코딩 (만료 시간 확인용)
  static decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT 디코딩 실패:', error);
      return null;
    }
  }

  // 토큰 만료 확인
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = AuthService.decodeJWT(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('토큰 만료 확인 실패:', error);
      return true;
    }
  }

  // 토큰 자동 갱신 확인 (만료 30분 전)
  static shouldRefreshToken(token: string): boolean {
    try {
      const decoded = AuthService.decodeJWT(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Date.now() / 1000;
      const refreshThreshold = 30 * 60; // 30분
      
      return (decoded.exp - currentTime) < refreshThreshold;
    } catch (error) {
      console.error('토큰 갱신 확인 실패:', error);
      return true;
    }
  }
}

export default AuthService;
