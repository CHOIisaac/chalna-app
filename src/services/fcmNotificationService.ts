/**
 * FCM 푸시 알림 서비스
 * Firebase Cloud Messaging을 사용한 푸시 알림 관리
 */

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getApiBaseUrl } from '../config/api';
import { AuthService } from './auth';

// 알림 핸들러 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface FCMTokenData {
  token: string;
  deviceId: string;
  platform: string;
  appVersion: string;
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class FCMNotificationService {
  private expoPushToken: string | null = null;

  /**
   * FCM 푸시 알림 권한 요청 및 토큰 등록
   */
  async registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;

    // Android 알림 채널 설정
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: '기본 알림',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        description: '찰나 앱의 기본 알림 채널입니다.',
      });

      // 경조사 알림 전용 채널
      await Notifications.setNotificationChannelAsync('event', {
        name: '경조사 알림',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#FFB900',
        description: '결혼식, 장례식 등 경조사 알림을 받습니다.',
      });

      // 장부 알림 전용 채널
      await Notifications.setNotificationChannelAsync('ledger', {
        name: '장부 알림',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250],
        lightColor: '#00D9FF',
        description: '장부 관련 알림을 받습니다.',
      });
    }

    // 실제 디바이스에서만 푸시 알림 사용 가능
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        console.log('📱 알림 권한 요청 중...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ 알림 권한이 거부되었습니다.');
        return null;
      }
      
      try {
        // Expo Push Token 가져오기
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        
        if (projectId) {
          token = (await Notifications.getExpoPushTokenAsync({
            projectId,
          })).data;
        } else {
          // 개발 환경에서 projectId가 없을 경우
          token = (await Notifications.getExpoPushTokenAsync()).data;
        }
        
        this.expoPushToken = token;
        console.log('✅ FCM 푸시 토큰 등록 완료:', token);
      } catch (error) {
        console.error('❌ FCM 토큰 가져오기 실패:', error);
        return null;
      }
    } else {
      console.log('⚠️ 시뮬레이터에서는 푸시 알림을 사용할 수 없습니다.');
      console.log('실제 디바이스에서 테스트해주세요.');
      
      // 시뮬레이터용 더미 토큰 (테스트용)
      token = 'simulator-dummy-token';
      this.expoPushToken = token;
      console.log('📱 시뮬레이터용 더미 토큰 생성:', token);
    }

    return token;
  }

  /**
   * 서버에 FCM 토큰 등록
   */
  async registerTokenToServer(userId: string): Promise<NotificationResponse> {
    try {
      if (!this.expoPushToken) {
        console.log('❌ FCM 토큰이 없습니다. 먼저 registerForPushNotificationsAsync()를 호출하세요.');
        return { success: false, error: 'FCM 토큰이 없습니다.' };
      }

      const tokenData: FCMTokenData = {
        token: this.expoPushToken,
        deviceId: Device.osInternalBuildId || 'unknown',
        platform: Platform.OS,
        appVersion: Constants.expoConfig?.version || '1.0.0',
      };

      const accessToken = await AuthService.getAccessToken();
      if (!accessToken) {
        console.log('❌ 인증 토큰이 없습니다.');
        return { success: false, error: '인증이 필요합니다.' };
      }

      // 시뮬레이터에서는 서버 등록 건너뛰기
      if (this.expoPushToken === 'simulator-dummy-token') {
        console.log('📱 시뮬레이터 모드: 서버 등록 건너뛰기');
        return { success: true, message: '시뮬레이터 모드 - 서버 등록 건너뛰기' };
      }

      // 백엔드 API 호출하여 토큰 등록
      const response = await fetch(`${getApiBaseUrl()}/api/v1/fcm/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: userId,
          ...tokenData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ 서버에 FCM 토큰 등록 완료');
        return { success: true, message: data.message || '토큰 등록 완료' };
      } else {
        const errorData = await response.json();
        console.log('❌ 서버에 FCM 토큰 등록 실패:', errorData);
        return { success: false, error: errorData.detail || '토큰 등록 실패' };
      }
    } catch (error) {
      console.error('❌ FCM 토큰 등록 중 오류:', error);
      return { success: false, error: '네트워크 오류' };
    }
  }

  /**
   * 알림 리스너 설정
   * @returns cleanup 함수
   */
  setupNotificationListeners() {
    // 포그라운드에서 알림 받을 때
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 포그라운드 알림 수신:', notification);
      console.log('제목:', notification.request.content.title);
      console.log('내용:', notification.request.content.body);
      console.log('데이터:', notification.request.content.data);
    });

    // 알림을 탭했을 때
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 알림 탭:', response);
      this.handleNotificationTap(response);
    });

    // cleanup 함수 반환
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }

  /**
   * 알림 탭 처리 - 특정 화면으로 네비게이션
   */
  private handleNotificationTap(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data;
    
    console.log('🔔 알림 데이터:', data);

    // 알림 타입에 따라 적절한 화면으로 이동
    if (data?.type === 'event' || data?.type === 'schedule') {
      // 일정 상세 화면으로 이동
      const eventId = data.eventId || data.schedule_id;
      if (eventId) {
        console.log(`📅 일정 상세 화면으로 이동: ${eventId}`);
        // router.push(`/schedule-detail?id=${eventId}`);
      }
    } else if (data?.type === 'ledger') {
      // 장부 상세 화면으로 이동
      const ledgerId = data.ledgerId || data.ledger_id;
      if (ledgerId) {
        console.log(`📒 장부 상세 화면으로 이동: ${ledgerId}`);
        // router.push(`/ledger-detail?id=${ledgerId}`);
      }
    } else if (data?.type === 'notification') {
      // 알림 목록 화면으로 이동
      console.log('🔔 알림 목록 화면으로 이동');
      // router.push('/notifications');
    }
  }

  /**
   * 현재 등록된 푸시 토큰 가져오기
   */
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * 서버에서 FCM 토큰 해제
   */
  async unregisterTokenFromServer(): Promise<NotificationResponse> {
    try {
      if (!this.expoPushToken) {
        return { success: false, error: 'FCM 토큰이 없습니다.' };
      }

      const accessToken = await AuthService.getAccessToken();
      if (!accessToken) {
        return { success: false, error: '인증이 필요합니다.' };
      }

      const response = await fetch(`${getApiBaseUrl()}/api/v1/fcm/unregister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          token: this.expoPushToken,
        }),
      });

      if (response.ok) {
        console.log('✅ 서버에서 FCM 토큰 해제 완료');
        this.expoPushToken = null;
        return { success: true, message: '토큰 해제 완료' };
      } else {
        const errorData = await response.json();
        console.log('❌ 서버에서 FCM 토큰 해제 실패:', errorData);
        return { success: false, error: errorData.detail || '토큰 해제 실패' };
      }
    } catch (error) {
      console.error('❌ FCM 토큰 해제 중 오류:', error);
      return { success: false, error: '네트워크 오류' };
    }
  }

  /**
   * 마지막 알림 확인 (테스트용)
   */
  async getLastNotification(): Promise<Notifications.Notification | null> {
    const notifications = await Notifications.getPresentedNotificationsAsync();
    return notifications.length > 0 ? notifications[0] : null;
  }

  /**
   * 배지 카운트 설정
   */
  async setBadgeCount(count: number): Promise<void> {
    if (Platform.OS === 'ios') {
      await Notifications.setBadgeCountAsync(count);
    }
  }

  /**
   * 배지 카운트 초기화
   */
  async clearBadge(): Promise<void> {
    if (Platform.OS === 'ios') {
      await Notifications.setBadgeCountAsync(0);
    }
  }
}

// 싱글톤 인스턴스 생성
export const fcmNotificationService = new FCMNotificationService();

