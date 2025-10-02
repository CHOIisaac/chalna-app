/**
 * API 클라이언트 설정 및 서비스 함수들
 */

import { router } from 'expo-router';
import { API_ENDPOINTS, API_TIMEOUT, getApiBaseUrl } from '../config/api';
import { MonthlyStats, QuickStats, RecentLedger } from '../types';
import { AuthService, LoginResponse, UserData } from './auth';

// API 클라이언트 설정
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // JWT 토큰 자동 추가
    const accessToken = await AuthService.getAccessToken();
    
    // 로그인 API는 토큰 체크 건너뛰기
    const isLoginEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
    
    // 토큰이 없으면 로그인 페이지로 리다이렉트 (로그인 API 제외)
    if (!accessToken && !isLoginEndpoint) {
      console.log('🚪 토큰이 없습니다. 로그인 페이지로 이동합니다.');
      router.replace('/login');
      throw new Error('로그인이 필요합니다.');
    }
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // 토큰이 있으면 Authorization 헤더 추가
    if (accessToken) {
      defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // 401 인증 실패 시 토큰 갱신 시도
        if (response.status === 401) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // 토큰 갱신 성공 시 재시도
            return this.request<T>(endpoint, options);
          } else {
            // 토큰 갱신 실패 시 로그아웃 처리 및 로그인 페이지로 이동
            console.log('🔄 토큰 갱신 실패. 로그인 페이지로 이동합니다.');
            await AuthService.logout();
            router.replace('/login');
            throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
          }
        }
        
        // 403 권한 거부 시에도 로그인 페이지로 이동
        if (response.status === 403) {
          console.log('🚫 권한이 없습니다. 로그인 페이지로 이동합니다.');
          await AuthService.logout();
          router.replace('/login');
          throw new Error('권한이 없습니다. 다시 로그인해주세요.');
        }
        
        // 422 에러 시 상세 정보 포함
        if (response.status === 422) {
          let errorData = null;
          try {
            errorData = await response.json();
            console.error('422 Error Response:', errorData);
            const errorMessage = errorData?.message || errorData?.detail || '데이터 유효성 검사 실패';
            throw new Error(`422 Unprocessable Entity: ${errorMessage}`);
          } catch (e) {
            throw new Error(`422 Unprocessable Entity: 요청 데이터를 확인해주세요.`);
          }
        }
        
        // 500 에러 시 상세 정보 포함
        if (response.status === 500) {
          let errorData = null;
          try {
            errorData = await response.json();
            console.error('500 Error Response:', errorData);
            const errorMessage = errorData?.message || errorData?.detail || '서버 내부 오류';
            throw new Error(`500 Internal Server Error: ${errorMessage}`);
          } catch (e) {
            throw new Error(`500 Internal Server Error: 서버 내부 오류가 발생했습니다.`);
          }
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // 토큰 갱신
  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await AuthService.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.AUTH_REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      if (data.access_token) {
        await AuthService.setTokens(data.access_token, refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      return false;
    }
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 요청
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH 요청
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// API 클라이언트 인스턴스
export const apiClient = new ApiClient();

// API 응답 타입 정의
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 장부 API 응답 타입 (통계 데이터 포함)
export interface LedgerApiResponse<T> extends ApiResponse<T> {
  this_month_stats?: {
    this_month_total_count: number;
    this_month_total_given: number;
    this_month_total_received: number;
  };
}

// 일정 API 응답 타입 (통계 데이터 포함)
export interface ScheduleApiResponse<T> extends ApiResponse<T> {
  this_month_stats?: {
    this_month_total_count: number;
    this_month_upcoming_count: number;
    total_count: number;
  };
}

// 장부 관련 타입
export interface LedgerItem {
  id: number;
  counterparty_name: string;
  counterparty_phone: string;
  amount: number;
  entry_type: 'given' | 'received' | string;
  event_type: string;
  event_date: string;
  relationship_type: string;
  memo: string;
  user_id: number;
  created_at: string;
  updated_at: string | null;
}

export interface LedgerStats {
  totalGiven: number;
  totalReceived: number;
  totalCount: number;
}

// 장부 API 서비스
export const ledgerService = {
  // 장부 목록 조회
  async getLedgers(params?: {
    search?: string;
    entry_type?: 'given' | 'received';
    sort_by?: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
    limit?: number;
    skip?: number;
  }): Promise<LedgerApiResponse<LedgerItem[]>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.entry_type) queryParams.append('entry_type', params.entry_type);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    
    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.LEDGERS}?${queryParams.toString()}`
      : API_ENDPOINTS.LEDGERS;
      
    return apiClient.get<ApiResponse<LedgerItem[]>>(url);
  },

  // 장부 생성
  async createLedger(ledger: Omit<LedgerItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<LedgerItem>> {
    return apiClient.post<ApiResponse<LedgerItem>>(API_ENDPOINTS.LEDGERS, ledger);
  },

  // 장부 수정
  async updateLedger(id: number, ledger: Partial<LedgerItem>): Promise<ApiResponse<LedgerItem>> {
    return apiClient.put<ApiResponse<LedgerItem>>(API_ENDPOINTS.LEDGER_DETAIL(id), ledger);
  },

  // 장부 삭제
  async deleteLedger(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.LEDGER_DETAIL(id));
  },

  // 장부 상세 조회
  async getLedger(id: number): Promise<ApiResponse<LedgerItem>> {
    return apiClient.get<ApiResponse<LedgerItem>>(API_ENDPOINTS.LEDGER_DETAIL(id));
  },

  // 장부 통계 조회
  async getLedgerStats(): Promise<ApiResponse<LedgerStats>> {
    return apiClient.get<ApiResponse<LedgerStats>>(API_ENDPOINTS.LEDGER_STATS);
  },
};

// 일정 관련 타입
export interface ScheduleItem {
  id: number;
  title: string;
  event_type: string;
  event_date: string;
  event_time: string;
  location: string;
  amount?: number;
  memo?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  user_id: number;
  created_at: string;
  updated_at: string | null;
}

// 일정 API 서비스
export const scheduleService = {
  // 일정 목록 조회
  async getSchedules(params?: {
    search?: string;
    status?: 'upcoming' | 'completed';
    event_type?: string;
    sort_by?: 'date_asc' | 'date_desc';
    limit?: number;
    skip?: number;
  }): Promise<ScheduleApiResponse<ScheduleItem[]>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.event_type) queryParams.append('event_type', params.event_type);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    
    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.SCHEDULES}?${queryParams.toString()}`
      : API_ENDPOINTS.SCHEDULES;
      
    return apiClient.get<ScheduleApiResponse<ScheduleItem[]>>(url);
  },

  // 일정 생성
  async createSchedule(schedule: Omit<ScheduleItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<ScheduleItem>> {
    return apiClient.post<ApiResponse<ScheduleItem>>(API_ENDPOINTS.SCHEDULES, schedule);
  },

  // 일정 수정
  async updateSchedule(id: number, schedule: Partial<ScheduleItem>): Promise<ApiResponse<ScheduleItem>> {
    return apiClient.put<ApiResponse<ScheduleItem>>(API_ENDPOINTS.SCHEDULE_DETAIL(id), schedule);
  },

  // 일정 삭제
  async deleteSchedule(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.SCHEDULE_DETAIL(id));
  },

  // 일정 상세 조회
  async getSchedule(id: number): Promise<ApiResponse<ScheduleItem>> {
    return apiClient.get<ApiResponse<ScheduleItem>>(API_ENDPOINTS.SCHEDULE_DETAIL(id));
  },

  // 달력 데이터 조회 (일정 있는 날짜만)
  async getCalendarDates(year: number, month: number): Promise<ApiResponse<{ datesWithEvents: string[] }>> {
    return apiClient.get<ApiResponse<{ datesWithEvents: string[] }>>(`${API_ENDPOINTS.SCHEDULE_CALENDAR}?year=${year}&month=${month}`);
  },

  // 특정 날짜 일정 목록 조회
  async getSchedulesByDate(date: string): Promise<ApiResponse<ScheduleItem[]>> {
    return apiClient.get<ApiResponse<ScheduleItem[]>>(API_ENDPOINTS.SCHEDULE_BY_DATE(date));
  },
};

// 통계 관련 타입
export interface MonthlyData {
  month: string;
  amount: number;
}

// 새로운 통합 월별 데이터 타입
export interface MonthlyDataByType {
  given: MonthlyData[];
  received: MonthlyData[];
}

export interface MonthlyTrendData {
  wedding: MonthlyDataByType;
  condolence: MonthlyDataByType;
  [year: string]: MonthlyDataByType; // 년도별 데이터 (예: "2024", "2025") - 실제 데이터가 있는 연도만
}

export interface TopItem {
  name: string;
  amount: number;
  type: string;
}

export interface TopItemsData {
  given: TopItem[];
  received: TopItem[];
}

export interface NetworkData {
  name: string;
  total: number;
  count: number;
  avg: number;
  relationship: string;
}

export interface NetworkDataByType {
  given: NetworkData[];
  received: NetworkData[];
}

export interface RelationshipStat {
  relationship: string;
  count: number;
  totalAmount: number;
  avgAmount: number;
  color?: string; // color는 프론트엔드에서 추가
}

export interface RelationshipStatsData {
  given: RelationshipStat[];
  received: RelationshipStat[];
}

export interface EventData {
  type: string;
  count: number;
  avgAmount: number;
}

export interface AmountDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface AmountDistributionData {
  given: AmountDistribution[];
  received: AmountDistribution[];
}

export interface MonthlyEventCount {
  month: string;
  count: number;
  highest: string;
  avgAmount: number;
}

export interface MonthlyEventCountData {
  given: MonthlyEventCount[];
  received: MonthlyEventCount[];
}

export interface TotalAmountsData {
  given: {
    wedding: {
      total: number;
      count: number;
    };
    condolence: {
      total: number;
      count: number;
    };
  };
  received: {
    wedding: {
      total: number;
      count: number;
    };
    condolence: {
      total: number;
      count: number;
    };
  };
}

// 홈 화면 API 서비스
export const homeService = {
  // 이번 달 현황
  async getMonthlyStats(): Promise<ApiResponse<MonthlyStats>> {
    return apiClient.get<ApiResponse<MonthlyStats>>(API_ENDPOINTS.HOME_MONTHLY_STATS);
  },

  // 퀵 스탯
  async getQuickStats(): Promise<ApiResponse<QuickStats>> {
    return apiClient.get<ApiResponse<QuickStats>>(API_ENDPOINTS.HOME_QUICK_STATS);
  },

  // 최근 장부 기록
  async getRecentLedgers(): Promise<ApiResponse<RecentLedger[]>> {
    return apiClient.get<ApiResponse<RecentLedger[]>>(API_ENDPOINTS.HOME_RECENT_LEDGERS);
  }
};

// 통계 API 서비스
export const statsService = {
  // 통합 월별 추세 (축의금, 조의금, given, received 모두 포함)
  async getMonthlyTrends(): Promise<ApiResponse<MonthlyTrendData>> {
    return apiClient.get<ApiResponse<MonthlyTrendData>>(API_ENDPOINTS.STATS_MONTHLY);
  },

  // 총액 조회 (given/received 모두 한 번에)
  async getTotalAmounts(): Promise<ApiResponse<TotalAmountsData>> {
    return apiClient.get<ApiResponse<TotalAmountsData>>(API_ENDPOINTS.STATS_TOTAL_AMOUNTS);
  },

  // TOP 5 항목 (given/received 모두 한 번에)
  async getTopItems(params?: {
    limit?: number;
  }): Promise<ApiResponse<TopItemsData>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.STATS_TOP_ITEMS}?${queryParams.toString()}`
      : API_ENDPOINTS.STATS_TOP_ITEMS;
      
    return apiClient.get<ApiResponse<TopItemsData>>(url);
  },

  // 금액대별 분포 (given/received 모두 한 번에)
  async getAmountDistribution(): Promise<ApiResponse<AmountDistributionData>> {
    return apiClient.get<ApiResponse<AmountDistributionData>>(API_ENDPOINTS.STATS_AMOUNT_DISTRIBUTION);
  },

  // 관계별 분석 (given/received 모두 한 번에)
  async getRelationshipBreakdown(): Promise<ApiResponse<RelationshipStatsData>> {
    return apiClient.get<ApiResponse<RelationshipStatsData>>(API_ENDPOINTS.STATS_RELATIONSHIP_BREAKDOWN);
  },

  // 개인별 상세 (given/received 모두 한 번에)
  async getPersonalDetails(): Promise<ApiResponse<NetworkDataByType>> {
    return apiClient.get<ApiResponse<NetworkDataByType>>(API_ENDPOINTS.STATS_PERSONAL_DETAILS);
  },

  // 이벤트별 기록
  async getEventBreakdown(params: {
    entry_type: 'given' | 'received';
  }): Promise<ApiResponse<EventData[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('entry_type', params.entry_type);
    
    const url = `${API_ENDPOINTS.STATS_EVENT_BREAKDOWN}?${queryParams.toString()}`;
    return apiClient.get<ApiResponse<EventData[]>>(url);
  },

  // 월별 이벤트 건수 (given/received 모두 한 번에)
  async getMonthlyEventCount(): Promise<ApiResponse<MonthlyEventCountData>> {
    return apiClient.get<ApiResponse<MonthlyEventCountData>>(API_ENDPOINTS.STATS_MONTHLY_EVENT_COUNT);
  },

  // 이벤트별 기록 통계
  async getEvents(): Promise<ApiResponse<EventData[]>> {
    return apiClient.get<ApiResponse<EventData[]>>(API_ENDPOINTS.STATS_EVENTS);
  }
};

// 인증 API 서비스
export const authService = {
  // 일반 로그인 (토큰 체크 없이 직접 호출)
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    try {
      const url = `${getApiBaseUrl()}${API_ENDPOINTS.AUTH_LOGIN}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (response.ok && data.access_token) {
        // 로그인 성공 시 토큰과 사용자 정보 저장
        await AuthService.setTokens(
          data.access_token,
          data.access_token // refresh_token이 없으므로 access_token 사용
        );
        
        // 사용자 데이터 생성
        const userData = {
          id: data.user_id,
          email: data.email,
          name: data.username
        };
        await AuthService.setUserData(userData);
        
        // 표준 응답 형식으로 변환
        return {
          success: true,
          data: {
            access_token: data.access_token,
            refresh_token: data.access_token,
            user: userData,
            expires_in: 3600
          }
        };
      } else {
        // 로그인 실패
        const errorMessage = data.detail || '로그인에 실패했습니다.';
        return { success: false, error: errorMessage, data: null as any };
      }
    } catch (error) {
      console.error('로그인 API 호출 실패:', error);
      return { success: false, error: '네트워크 오류가 발생했습니다.', data: null as any };
    }
  },

  // 카카오 로그인
  async kakaoLogin(kakaoToken: string): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<any>(
      '/api/v1/auth/kakao-login/',
      { kakao_token: kakaoToken }
    );
    
    // 로그인 성공 시 토큰과 사용자 정보 저장
    if (response.success && response.data) {
      await AuthService.setTokens(
        response.data.access_token,
        response.data.refresh_token
      );
      await AuthService.setUserData(response.data.user);
    }
    
    return response;
  },

  // 로그아웃
  async logout(): Promise<ApiResponse<void>> {
    try {
      // 서버에 로그아웃 요청
      const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.AUTH_LOGOUT);
      
      // 로컬 토큰 삭제
      await AuthService.logout();
      
      return response;
    } catch (error) {
      // 서버 요청 실패해도 로컬 토큰은 삭제
      await AuthService.logout();
      throw error;
    }
  },

  // 현재 사용자 정보 조회
  async getCurrentUser(): Promise<ApiResponse<UserData>> {
    return apiClient.get<ApiResponse<UserData>>('/api/v1/auth/me/');
  },

  // 토큰 갱신
  async refreshToken(): Promise<ApiResponse<{ access_token: string }>> {
    const refreshToken = await AuthService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.');
    }

    const response = await apiClient.post<any>(
      API_ENDPOINTS.AUTH_REFRESH,
      { refresh_token: refreshToken }
    );
    
    // 백엔드 응답 형식에 맞춰 변환
    if (response.access_token) {
      return {
        success: true,
        data: { access_token: response.access_token }
      };
    }
    
    return { success: false, error: '토큰 갱신에 실패했습니다.', data: null as any };
  },
};

// 알림 관련 타입 정의
export interface NotificationData {
  id: string;
  title: string;
  message: string;
  time: string;
  event_type: 'wedding' | 'funeral' | 'birthday' | 'opening' | 'graduation' | 'promotion';
  read: boolean;
  date: string; // ISO 8601 형식
  location: string;
  created_at: string;
  updated_at: string;
}

// 카카오 로그인 관련 타입
export interface KakaoLoginRequest {
  access_token?: string;
  accessToken?: string;
  token?: string;
  kakao_token?: string;
  kakaoToken?: string;
  code?: string;
}

export interface KakaoLoginResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user: {
      id: string;
      email: string;
      name: string;
      profile_image?: string;
    };
  };
  message: string;
}

export interface NotificationDetailData extends NotificationData {
  full_details?: {
    host?: string;
    contact?: string;
    dress_code?: string;
    gift_info?: string;
    additional_info?: string;
  };
}

export interface NotificationsResponse {
  notifications: NotificationData[];
  total_count: number;
}

// 스케줄 관련 타입 정의
export interface ScheduleData {
  id: string;
  title: string;
  event_type: 'wedding' | 'funeral' | 'birthday' | 'opening' | 'graduation' | 'promotion';
  date: string; // ISO 8601 형식
  location: string;
  host?: string;
  contact?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SchedulesResponse {
  schedules: ScheduleData[];
  total_count: number;
}

// 스케줄 서비스
export const scheduleApiService = {
  // 스케줄 목록 조회
  async getSchedules(params?: {
    event_type?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<SchedulesResponse>> {
    const queryParams = new URLSearchParams();
    if (params?.event_type) queryParams.append('event_type', params.event_type);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    
    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.SCHEDULES}?${queryParams.toString()}`
      : API_ENDPOINTS.SCHEDULES;
    
    return apiClient.get<ApiResponse<SchedulesResponse>>(endpoint);
  },

  // 스케줄 상세 조회
  async getScheduleDetail(id: string): Promise<ApiResponse<ScheduleData>> {
    return apiClient.get<ApiResponse<ScheduleData>>(API_ENDPOINTS.SCHEDULE_DETAIL(parseInt(id)));
  },

  // 스케줄 생성
  async createSchedule(scheduleData: Partial<ScheduleData>): Promise<ApiResponse<ScheduleData>> {
    return apiClient.post<ApiResponse<ScheduleData>>(API_ENDPOINTS.SCHEDULES, scheduleData);
  },

  // 스케줄 수정
  async updateSchedule(id: string, scheduleData: Partial<ScheduleData>): Promise<ApiResponse<ScheduleData>> {
    return apiClient.put<ApiResponse<ScheduleData>>(API_ENDPOINTS.SCHEDULE_DETAIL(parseInt(id)), scheduleData);
  },

  // 스케줄 삭제
  async deleteSchedule(id: string): Promise<ApiResponse<{ id: string; deleted: boolean }>> {
    return apiClient.delete<ApiResponse<{ id: string; deleted: boolean }>>(
      API_ENDPOINTS.SCHEDULE_DETAIL(parseInt(id))
    );
  },
};

// 알림 서비스
export const notificationApiService = {
  // 알림 목록 조회
  async getNotifications(params?: {
    event_type?: string;
    read_status?: 'all' | 'read' | 'unread';
  }): Promise<ApiResponse<NotificationsResponse>> {
    const queryParams = new URLSearchParams();
    if (params?.event_type) queryParams.append('event_type', params.event_type);
    if (params?.read_status) queryParams.append('read_status', params.read_status);
    
    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.NOTIFICATIONS}?${queryParams.toString()}`
      : API_ENDPOINTS.NOTIFICATIONS;
    
    return apiClient.get<ApiResponse<NotificationsResponse>>(endpoint);
  },

  // 알림 상세 조회
  async getNotificationDetail(id: string): Promise<ApiResponse<NotificationDetailData>> {
    return apiClient.get<ApiResponse<NotificationDetailData>>(API_ENDPOINTS.NOTIFICATION_DETAIL(id));
  },

  // 알림 읽음 처리
  async markAsRead(id: string, data: { read: boolean }): Promise<ApiResponse<{ id: string; read: boolean; read_at: string }>> {
    return apiClient.patch<ApiResponse<{ id: string; read: boolean; read_at: string }>>(
      API_ENDPOINTS.NOTIFICATION_READ(id),
      data
    );
  },

  // 전체 알림 읽음 처리
  async markAllAsRead(): Promise<ApiResponse<{ updated_count: number }>> {
    return apiClient.put<ApiResponse<{ updated_count: number }>>(API_ENDPOINTS.NOTIFICATION_READ_ALL);
  },

  // 알림 삭제
  async deleteNotification(id: string): Promise<ApiResponse<{ id: string; deleted: boolean }>> {
    return apiClient.delete<ApiResponse<{ id: string; deleted: boolean }>>(
      API_ENDPOINTS.NOTIFICATION_DELETE(id)
    );
  },
};

// 카카오 로그인 API 서비스
export const kakaoApiService = {
  async login(request: KakaoLoginRequest): Promise<ApiResponse<KakaoLoginResponse['data']>> {
    // Request Body로 전송 (보안상 더 안전)
    return apiClient.post<ApiResponse<KakaoLoginResponse['data']>>('/api/v1/kakao/login', request);
  },
};

// 에러 처리 헬퍼
export const handleApiError = (error: any): string => {
  console.log('🔍 에러 상세 정보:', {
    status: error?.response?.status,
    statusText: error?.response?.statusText,
    data: error?.response?.data,
    message: error?.message,
  });
  
  if (error?.response?.status === 422) {
    return `데이터 유효성 오류 (422): ${error?.response?.data?.message || '요청 데이터를 확인해주세요.'}`;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return '알 수 없는 오류가 발생했습니다.';
};
