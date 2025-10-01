/**
 * FCM 푸시 알림 테스트 서비스
 * 개발 및 테스트용 유틸리티 함수
 */

import { getApiBaseUrl } from '../config/api';
import { AuthService } from './auth';
import { fcmNotificationService } from './fcmNotificationService';

export class FCMTestService {
  /**
   * 테스트 푸시 알림 전송 요청
   */
  static async sendTestNotification(
    title: string = '테스트 알림',
    body: string = 'FCM 푸시 알림 테스트입니다.',
    data: Record<string, any> = {}
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const userData = await AuthService.getUserData();
      if (!userData?.id) {
        return { success: false, error: '사용자 정보를 찾을 수 없습니다.' };
      }

      const accessToken = await AuthService.getAccessToken();
      if (!accessToken) {
        return { success: false, error: '인증이 필요합니다.' };
      }

      // 시뮬레이터에서는 서버 호출 건너뛰기
      const fcmToken = fcmNotificationService.getPushToken();
      if (fcmToken === 'simulator-dummy-token') {
        console.log('📱 시뮬레이터 모드: 서버 호출 건너뛰기');
        return { success: true, message: '시뮬레이터 모드 - 서버 호출 건너뛰기' };
      }

      const response = await fetch(`${getApiBaseUrl()}/api/v1/fcm/send-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: userData.id.toString(),
          title,
          body,
          data,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ 테스트 알림 전송 성공:', result);
        return { success: true, message: '테스트 알림이 전송되었습니다.' };
      } else {
        const errorData = await response.json();
        console.log('❌ 테스트 알림 전송 실패:', errorData);
        return { success: false, error: errorData.detail || '알림 전송 실패' };
      }
    } catch (error) {
      console.error('❌ 테스트 알림 전송 중 오류:', error);
      return { success: false, error: '네트워크 오류' };
    }
  }

  /**
   * 경조사 알림 테스트
   */
  static async sendEventTestNotification(
    eventType: 'wedding' | 'funeral' | 'birthday' | 'opening' | 'graduation' | 'promotion' = 'wedding'
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const eventTitles = {
      wedding: '김철수 결혼식',
      funeral: '박영희 어머님 장례식',
      birthday: '이민수 아들 돌잔치',
      opening: '최지훈 개업식',
      graduation: '정수민 졸업식',
      promotion: '강동욱 승진 축하',
    };

    const eventMessages = {
      wedding: '내일 오후 2시에 서울 웨딩홀에서 결혼식이 있습니다.',
      funeral: '오늘 오후 3시에 서울추모공원에서 장례식이 있습니다.',
      birthday: '이번 주 토요일 오후 12시에 돌잔치가 있습니다.',
      opening: '다음 주 월요일 오전 10시에 개업식이 있습니다.',
      graduation: '2월 15일 오전 11시에 졸업식이 있습니다.',
      promotion: '금요일 저녁 7시에 승진 축하 모임이 있습니다.',
    };

    return this.sendTestNotification(
      eventTitles[eventType],
      eventMessages[eventType],
      {
        type: 'event',
        eventType,
        eventId: '123',
      }
    );
  }

  /**
   * 장부 알림 테스트
   */
  static async sendLedgerTestNotification(): Promise<{ success: boolean; message?: string; error?: string }> {
    return this.sendTestNotification(
      '장부 알림',
      '김철수님의 결혼식 축의금 10만원이 기록되었습니다.',
      {
        type: 'ledger',
        ledgerId: '456',
      }
    );
  }

  /**
   * FCM 토큰 상태 확인
   */
  static async checkFCMStatus(): Promise<{
    hasToken: boolean;
    token: string | null;
    registered: boolean;
  }> {
    const token = fcmNotificationService.getPushToken();
    
    return {
      hasToken: !!token,
      token: token,
      registered: !!token,
    };
  }

  /**
   * FCM 토큰 재등록
   */
  static async reregisterFCMToken(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      console.log('🔄 FCM 토큰 재등록 중...');
      
      // 기존 토큰 해제
      await fcmNotificationService.unregisterTokenFromServer();
      
      // 새 토큰 등록
      const token = await fcmNotificationService.registerForPushNotificationsAsync();
      
      if (token) {
        const userData = await AuthService.getUserData();
        if (userData?.id) {
          const result = await fcmNotificationService.registerTokenToServer(userData.id.toString());
          if (result.success) {
            console.log('✅ FCM 토큰 재등록 완료');
            return { success: true, message: 'FCM 토큰이 재등록되었습니다.' };
          } else {
            return { success: false, error: result.error };
          }
        } else {
          return { success: false, error: '사용자 정보를 찾을 수 없습니다.' };
        }
      } else {
        return { success: false, error: 'FCM 토큰을 가져오지 못했습니다.' };
      }
    } catch (error) {
      console.error('❌ FCM 토큰 재등록 실패:', error);
      return { success: false, error: '재등록 중 오류 발생' };
    }
  }

  /**
   * 콘솔에 FCM 정보 출력
   */
  static async printFCMInfo(): Promise<void> {
    console.log('📱 ========== FCM 정보 ==========');
    
    const status = await this.checkFCMStatus();
    console.log('FCM 토큰 보유:', status.hasToken ? '✅' : '❌');
    console.log('FCM 토큰:', status.token || '없음');
    console.log('서버 등록 상태:', status.registered ? '✅' : '❌');
    
    const userData = await AuthService.getUserData();
    console.log('사용자 ID:', userData?.id || '없음');
    console.log('사용자 이름:', userData?.name || '없음');
    
    console.log('================================');
  }
}

// 전역에서 쉽게 접근할 수 있도록 export
export const fcmTest = FCMTestService;

