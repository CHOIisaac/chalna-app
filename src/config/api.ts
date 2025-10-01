/**
 * API 환경 설정
 * 
 * 폰에서 테스트할 때 주의사항:
 * 1. localhost 대신 실제 개발 머신의 IP 주소를 사용해야 합니다
 * 2. 개발 머신과 폰이 같은 Wi-Fi 네트워크에 연결되어 있어야 합니다
 * 3. 방화벽이 8000 포트를 차단하지 않도록 설정해야 합니다
 * 
 * IP 주소 확인 방법:
 * - Windows: ipconfig
 * - macOS/Linux: ifconfig 또는 ip addr
 * - 보통 192.168.x.x 또는 10.0.x.x 형태입니다
 */

// 개발/운영 환경별 API URL 설정
export const API_CONFIG = {
  // 로컬 개발 서버 (폰에서 접근 가능한 IP로 변경 필요)
  local: 'http://192.168.0.98:8000', // ✅ 실제 개발 머신의 IP 주소
  
  // 개발 서버 (예시)
  development: 'https://dev-api.chalna.com',
  
  // 운영 서버 (예시)
  production: 'https://api.chalna.com',
};

// 환경 변수 또는 설정에 따른 환경 선택
const getEnvironment = (): 'local' | 'development' | 'production' => {
  // 환경 변수에서 ENV 값을 읽어오거나, 기본값 설정
  const env = process.env.EXPO_PUBLIC_ENV || 'local';
  
  if (env === 'production') return 'production';
  if (env === 'development') return 'development';
  return 'local'; // 기본값
};

// 현재 환경에 따른 API URL 선택
export const getApiBaseUrl = (): string => {
  const environment = getEnvironment();
  return API_CONFIG[environment];
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
  SCHEDULE_DETAIL: (id: number) => `/api/v1/schedules/${id}`,
  SCHEDULE_CALENDAR: '/api/v1/schedules/calendar',
  SCHEDULE_BY_DATE: (date: string) => `/api/v1/schedules/date/${date}/`,
  
  // 홈 화면 관련
  HOME_MONTHLY_STATS: '/api/v1/home/monthly-stats',
  HOME_QUICK_STATS: '/api/v1/home/quick-stats',
  HOME_RECENT_LEDGERS: '/api/v1/home/recent-ledgers',
  
  // 통계 관련
  STATS_TOTAL_AMOUNTS: '/api/v1/stats/stats/total-amounts',
  STATS_MONTHLY: '/api/v1/stats/stats/monthly',
  STATS_TOP_ITEMS: '/api/v1/stats/stats/top-items',
  STATS_AMOUNT_DISTRIBUTION: '/api/v1/stats/stats/amount-distribution',
  STATS_RELATIONSHIP_BREAKDOWN: '/api/v1/stats/stats/relationship-breakdown',
  STATS_PERSONAL_DETAILS: '/api/v1/stats/stats/personal-details',
  STATS_EVENT_BREAKDOWN: '/api/v1/stats/event-breakdown',
  STATS_MONTHLY_EVENT_COUNT: '/api/v1/stats/monthly-event-count',
  STATS_EVENTS: '/api/v1/stats/stats/events',
  
  // 인증 관련
  AUTH_LOGIN: '/api/v1/auth/auth/login',
  AUTH_LOGOUT: '/api/v1/auth/logout/',
  AUTH_REFRESH: '/api/v1/auth/refresh/',

  // 알림 관련
  NOTIFICATIONS: '/api/v1/notifications/',
  NOTIFICATION_DETAIL: (id: string) => `/api/v1/notifications/${id}`,
  NOTIFICATION_READ: (id: string) => `/api/v1/notifications/${id}/read`,
  NOTIFICATION_READ_ALL: '/api/v1/notifications/read-all',
  NOTIFICATION_DELETE: (id: string) => `/api/v1/notifications/${id}`,

  // FCM 푸시 알림 관련
  FCM_REGISTER: '/api/v1/fcm/register',
  FCM_UNREGISTER: '/api/v1/fcm/unregister',
  FCM_SEND_TEST: '/api/v1/fcm/send-test',
} as const;

// 타임아웃 설정 (ms)
export const API_TIMEOUT = 30000; // 30초 (폰에서 테스트할 때 네트워크 지연 고려)

// 재시도 설정
export const API_RETRY_COUNT = 3;
export const API_RETRY_DELAY = 1000; // 1초
