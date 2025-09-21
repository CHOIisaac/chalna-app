/**
 * API 환경 설정
 */

// 개발/운영 환경별 API URL 설정
export const API_CONFIG = {
  // 로컬 개발 서버
  local: 'http://localhost:8000',
  
  // 개발 서버 (예시)
  development: 'https://dev-api.chalna.com',
  
  // 운영 서버 (예시)
  production: 'https://api.chalna.com',
};

// 현재 환경에 따른 API URL 선택
export const getApiBaseUrl = (): string => {
  // Expo 개발 환경에서는 __DEV__ 사용
  if (__DEV__) {
    // 개발 중에는 로컬 서버 사용
    return API_CONFIG.local;
  }
  
  // 운영 환경에서는 운영 서버 사용
  return API_CONFIG.production;
};

// API 버전
export const API_VERSION = 'v1';

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 장부 관련
  LEDGERS: '/api/v1/ledgers/',
  LEDGER_DETAIL: (id: number) => `/api/v1/ledgers/${id}`,
  LEDGER_STATS: '/api/v1/ledgers/stats/',
  
  // 일정 관련
  SCHEDULES: '/api/v1/schedules/',
  SCHEDULE_DETAIL: (id: number) => `/api/v1/schedules/${id}/`,
  SCHEDULE_CALENDAR: '/api/v1/schedules/calendar',
  SCHEDULE_BY_DATE: (date: string) => `/api/v1/schedules/date/${date}/`,
  
  // 인증 관련
  AUTH_LOGIN: '/api/v1/auth/auth/login',
  AUTH_LOGOUT: '/api/v1/auth/logout/',
  AUTH_REFRESH: '/api/v1/auth/refresh/',
} as const;

// 타임아웃 설정 (ms)
export const API_TIMEOUT = 10000; // 10초

// 재시도 설정
export const API_RETRY_COUNT = 3;
export const API_RETRY_DELAY = 1000; // 1초
