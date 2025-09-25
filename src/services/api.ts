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
  }): Promise<ApiResponse<LedgerItem[]>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.entry_type) queryParams.append('entry_type', params.entry_type);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    
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
  }): Promise<ApiResponse<ScheduleItem[]>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.event_type) queryParams.append('event_type', params.event_type);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    
    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.SCHEDULES}?${queryParams.toString()}`
      : API_ENDPOINTS.SCHEDULES;
      
    return apiClient.get<ApiResponse<ScheduleItem[]>>(url);
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

export interface RelationshipStat {
  relationship: string;
  count: number;
  totalAmount: number;
  avgAmount: number;
  color: string;
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

  // 관계별 분석
  async getRelationshipBreakdown(params: {
    entry_type: 'given' | 'received';
  }): Promise<ApiResponse<RelationshipStat[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('entry_type', params.entry_type);
    
    const url = `${API_ENDPOINTS.STATS_RELATIONSHIP_BREAKDOWN}?${queryParams.toString()}`;
    return apiClient.get<ApiResponse<RelationshipStat[]>>(url);
  },

  // 개인별 상세
  async getPersonalDetails(params: {
    entry_type: 'given' | 'received';
  }): Promise<ApiResponse<NetworkData[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('entry_type', params.entry_type);
    
    const url = `${API_ENDPOINTS.STATS_PERSONAL_DETAILS}?${queryParams.toString()}`;
    return apiClient.get<ApiResponse<NetworkData[]>>(url);
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

  // 월별 이벤트 건수
  async getMonthlyEventCount(params: {
    entry_type: 'given' | 'received';
  }): Promise<ApiResponse<MonthlyEventCount[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('entry_type', params.entry_type);
    
    const url = `${API_ENDPOINTS.STATS_MONTHLY_EVENT_COUNT}?${queryParams.toString()}`;
    return apiClient.get<ApiResponse<MonthlyEventCount[]>>(url);
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

// 에러 처리 헬퍼
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return '알 수 없는 오류가 발생했습니다.';
};
