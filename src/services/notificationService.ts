import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getEventMessage } from '../utils/eventMessages';
import { NotificationData as ApiNotificationData, notificationApiService, scheduleApiService, ScheduleData } from './api';

// 알림 핸들러 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  eventType: 'wedding' | 'funeral' | 'birthday' | 'opening' | 'graduation' | 'promotion';
  date: Date;
  location: string;
}

class NotificationService {
  private expoPushToken: string | null = null;

  // 푸시 토큰 등록 (개발 환경에서는 로컬 알림만 사용)
  async registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permission not granted, but local notifications will still work');
        return null;
      }
      
      // 개발 환경에서는 푸시 토큰 등록을 건너뛰고 로컬 알림만 사용
      console.log('Development mode: Using local notifications only');
      console.log('Push token registration skipped for development');
      
      // 개발 환경에서는 더미 토큰 사용
      token = 'development-token';
      this.expoPushToken = token;
    } else {
      console.log('Simulator detected: Local notifications only');
    }

    return token;
  }

  // 로컬 알림 예약
  async scheduleLocalNotification(notificationData: NotificationData): Promise<string> {
    const trigger = {
      date: notificationData.date,
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notificationData.title,
        body: notificationData.message,
        data: {
          id: notificationData.id,
          eventType: notificationData.eventType,
          location: notificationData.location,
        },
        sound: 'default',
      },
      trigger,
    });

    console.log('Scheduled notification:', notificationId);
    return notificationId;
  }

  // 즉시 로컬 알림 발송 (테스트용)
  async sendImmediateNotification(notificationData: NotificationData): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notificationData.title,
        body: notificationData.message,
        data: {
          id: notificationData.id,
          eventType: notificationData.eventType,
          location: notificationData.location,
        },
        sound: 'default',
      },
      trigger: null, // 즉시 발송
    });

    console.log('Sent immediate notification:', notificationId);
    return notificationId;
  }

  // 모든 예약된 알림 취소
  async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled all scheduled notifications');
  }

  // 특정 알림 취소
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Cancelled notification:', notificationId);
  }

  // 알림 리스너 설정
  addNotificationReceivedListener(listener: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // 알림 응답 리스너 설정 (사용자가 알림을 탭했을 때)
  addNotificationResponseReceivedListener(listener: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // 현재 예약된 알림 목록 조회
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // 푸시 토큰 가져오기
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  // 실제 경조사 데이터로 알림 생성 및 예약
  async scheduleNotificationsFromApiData(): Promise<void> {
    try {
      console.log('🔄 API에서 경조사 데이터를 가져와서 알림을 예약합니다...');
      
      // API에서 알림 데이터 조회
      const response = await notificationApiService.getNotifications();
      
      if (!response.success || !response.data) {
        console.log('❌ 알림 데이터를 가져올 수 없습니다.');
        return;
      }

      const notifications = response.data.notifications;
      console.log(`📋 총 ${notifications.length}개의 알림 데이터를 찾았습니다.`);

      // 각 알림에 대해 로컬 알림 예약
      for (const apiNotification of notifications) {
        try {
          // API 데이터를 로컬 알림 형식으로 변환
          const notificationData: NotificationData = {
            id: apiNotification.id,
            title: apiNotification.title,
            message: apiNotification.message,
            eventType: apiNotification.event_type,
            date: new Date(apiNotification.date),
            location: apiNotification.location,
          };

          // 이미 지난 알림은 건너뛰기
          if (notificationData.date <= new Date()) {
            console.log(`⏰ 알림 "${apiNotification.title}"은 이미 지났습니다. 건너뜁니다.`);
            continue;
          }

          // 로컬 알림 예약
          await this.scheduleLocalNotification(notificationData);
          console.log(`✅ 알림 예약 완료: "${apiNotification.title}"`);
          
        } catch (error) {
          console.error(`❌ 알림 예약 실패: "${apiNotification.title}"`, error);
        }
      }

      console.log('🎉 모든 경조사 알림 예약이 완료되었습니다!');
      
    } catch (error) {
      console.error('❌ API에서 알림 데이터를 가져오는 중 오류 발생:', error);
    }
  }

  // 특정 경조사 알림만 예약
  async scheduleNotificationFromApi(notificationId: string): Promise<void> {
    try {
      console.log(`🔄 API에서 알림 ID "${notificationId}"를 가져와서 예약합니다...`);
      
      const response = await notificationApiService.getNotificationDetail(notificationId);
      
      if (!response.success || !response.data) {
        console.log(`❌ 알림 ID "${notificationId}"를 찾을 수 없습니다.`);
        return;
      }

      const apiNotification = response.data;
      
      // API 데이터를 로컬 알림 형식으로 변환
      const notificationData: NotificationData = {
        id: apiNotification.id,
        title: apiNotification.title,
        message: apiNotification.message,
        eventType: apiNotification.event_type,
        date: new Date(apiNotification.date),
        location: apiNotification.location,
      };

      // 이미 지난 알림은 건너뛰기
      if (notificationData.date <= new Date()) {
        console.log(`⏰ 알림 "${apiNotification.title}"은 이미 지났습니다.`);
        return;
      }

      // 로컬 알림 예약
      await this.scheduleLocalNotification(notificationData);
      console.log(`✅ 알림 예약 완료: "${apiNotification.title}"`);
      
    } catch (error) {
      console.error(`❌ 알림 예약 실패: "${notificationId}"`, error);
    }
  }

  // API 알림 데이터를 로컬 알림 형식으로 변환
  convertApiToLocalNotification(apiNotification: ApiNotificationData): NotificationData {
    return {
      id: apiNotification.id,
      title: apiNotification.title,
      message: apiNotification.message,
      eventType: apiNotification.event_type,
      date: new Date(apiNotification.date),
      location: apiNotification.location,
    };
  }

  // 경조사 일정에서 자동 알림 예약 (스케줄 데이터 기반)
  async scheduleNotificationsFromSchedules(): Promise<void> {
    try {
      console.log('🔄 스케줄 데이터에서 경조사를 찾아 알림을 예약합니다...');
      
      let schedules: ScheduleData[] = [];
      
      try {
        // 실제 스케줄 데이터 조회
        const schedulesResponse = await scheduleApiService.getSchedules();
        if (schedulesResponse.success && schedulesResponse.data) {
          schedules = schedulesResponse.data.schedules;
          console.log(`✅ API에서 ${schedules.length}개의 스케줄을 가져왔습니다.`);
        } else {
          throw new Error('스케줄 API 응답 실패');
        }
      } catch (apiError) {
        console.log('❌ 스케줄 API 호출 실패, Mock 데이터를 사용합니다:', apiError);
        
        // Mock 데이터 사용 (개발/테스트용)
        schedules = [
          {
            id: '1',
            title: '김철수 결혼식',
            event_type: 'wedding' as const,
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 내일
            location: '롯데호텔 크리스탈볼룸',
            host: '김철수, 박영희',
            contact: '010-1234-5678',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: '박영희 어머님 장례식',
            event_type: 'funeral' as const,
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 후
            location: '서울추모공원',
            host: '박영희',
            contact: '010-2345-6789',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '3',
            title: '이민수 아들 돌잔치',
            event_type: 'birthday' as const,
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 후
            location: '강남구청 웨딩홀',
            host: '이민수',
            contact: '010-3456-7890',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
      }

      console.log(`📋 총 ${schedules.length}개의 경조사 스케줄을 찾았습니다.`);

      // 각 경조사에 대해 알림 예약
      for (const schedule of schedules) {
        try {
          // 알림 예약 시간 계산 (경조사 1일 전, 1시간 전)
          const eventDate = new Date(schedule.date);
          const oneDayBefore = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
          const oneHourBefore = new Date(eventDate.getTime() - 60 * 60 * 1000);

          console.log(`📅 경조사 처리 중: "${schedule.title}" (${eventDate.toLocaleString()})`);
          
          // 1일 전 알림
          if (oneDayBefore > new Date()) {
            const dayBeforeNotification: NotificationData = {
              id: `${schedule.id}_day_before`,
              title: `${schedule.title} 알림`,
              message: getEventMessage(
                schedule.event_type,
                `${schedule.title} 알림`,
                eventDate,
                schedule.location
              ),
              eventType: schedule.event_type,
              date: oneDayBefore,
              location: schedule.location,
            };

            const notificationId = await this.scheduleLocalNotification(dayBeforeNotification);
            console.log(`✅ 1일 전 알림 예약 완료: "${schedule.title}" (예약시간: ${oneDayBefore.toLocaleString()}, 알림ID: ${notificationId})`);
          } else {
            console.log(`⏰ 1일 전 알림 건너뜀: "${schedule.title}" (이미 지남: ${oneDayBefore.toLocaleString()})`);
          }

          // 1시간 전 알림
          if (oneHourBefore > new Date()) {
            const hourBeforeNotification: NotificationData = {
              id: `${schedule.id}_hour_before`,
              title: `${schedule.title} 알림`,
              message: getEventMessage(
                schedule.event_type,
                `${schedule.title} 알림`,
                eventDate,
                schedule.location
              ),
              eventType: schedule.event_type,
              date: oneHourBefore,
              location: schedule.location,
            };

            const notificationId = await this.scheduleLocalNotification(hourBeforeNotification);
            console.log(`✅ 1시간 전 알림 예약 완료: "${schedule.title}" (예약시간: ${oneHourBefore.toLocaleString()}, 알림ID: ${notificationId})`);
          } else {
            console.log(`⏰ 1시간 전 알림 건너뜀: "${schedule.title}" (이미 지남: ${oneHourBefore.toLocaleString()})`);
          }
          
        } catch (error) {
          console.error(`❌ 알림 예약 실패: "${schedule.title}"`, error);
        }
      }

      console.log('🎉 모든 경조사 알림 예약이 완료되었습니다!');
      
    } catch (error) {
      console.error('❌ 스케줄 데이터에서 알림을 예약하는 중 오류 발생:', error);
    }
  }

  // 특정 경조사에 대한 알림 예약
  async scheduleNotificationForEvent(eventData: {
    id: string;
    title: string;
    event_type: 'wedding' | 'funeral' | 'birthday' | 'opening' | 'graduation' | 'promotion';
    date: Date;
    location: string;
    host?: string;
    contact?: string;
  }): Promise<{ dayBeforeId?: string; hourBeforeId?: string }> {
    try {
      console.log(`🔄 경조사 "${eventData.title}"에 대한 알림을 예약합니다...`);

      const eventDate = new Date(eventData.date);
      const oneDayBefore = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
      const oneHourBefore = new Date(eventDate.getTime() - 60 * 60 * 1000);
      
      const result: { dayBeforeId?: string; hourBeforeId?: string } = {};

      // 1일 전 알림
      if (oneDayBefore > new Date()) {
        const dayBeforeNotification: NotificationData = {
          id: `${eventData.id}_day_before`,
          title: `${eventData.title} 알림`,
          message: getEventMessage(
            eventData.event_type,
            `${eventData.title} 알림`,
            eventDate,
            eventData.location
          ),
          eventType: eventData.event_type,
          date: oneDayBefore,
          location: eventData.location,
        };

        result.dayBeforeId = await this.scheduleLocalNotification(dayBeforeNotification);
        console.log(`✅ 1일 전 알림 예약: "${eventData.title}" (ID: ${result.dayBeforeId})`);
      } else {
        console.log(`⏰ 1일 전 알림 건너뜀: "${eventData.title}" (이미 지남)`);
      }

      // 1시간 전 알림
      if (oneHourBefore > new Date()) {
        const hourBeforeNotification: NotificationData = {
          id: `${eventData.id}_hour_before`,
          title: `${eventData.title} 알림`,
          message: getEventMessage(
            eventData.event_type,
            `${eventData.title} 알림`,
            eventDate,
            eventData.location
          ),
          eventType: eventData.event_type,
          date: oneHourBefore,
          location: eventData.location,
        };

        result.hourBeforeId = await this.scheduleLocalNotification(hourBeforeNotification);
        console.log(`✅ 1시간 전 알림 예약: "${eventData.title}" (ID: ${result.hourBeforeId})`);
      } else {
        console.log(`⏰ 1시간 전 알림 건너뜀: "${eventData.title}" (이미 지남)`);
      }

      console.log(`🎉 경조사 "${eventData.title}" 알림 예약 완료!`);
      return result;
      
    } catch (error) {
      console.error(`❌ 경조사 알림 예약 실패: "${eventData.title}"`, error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const notificationService = new NotificationService();
