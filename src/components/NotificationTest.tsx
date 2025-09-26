import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NotificationData, notificationService } from '../services/notificationService';

const NotificationTest: React.FC = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // 푸시 토큰 등록
    registerForPushNotifications();

    // 알림 리스너 설정
    notificationListener.current = notificationService.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      setNotification(notification);
    });

    // 알림 응답 리스너 설정
    responseListener.current = notificationService.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      const data = response.notification.request.content.data;
      Alert.alert(
        '알림 탭됨',
        `이벤트: ${data.eventType}\n장소: ${data.location}`,
        [{ text: '확인' }]
      );
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const token = await notificationService.registerForPushNotificationsAsync();
      setExpoPushToken(token);
    } catch (error) {
      console.error('Failed to register for push notifications:', error);
      setExpoPushToken('error-token');
    }
  };

  // 테스트용 알림 데이터
  const testNotifications: NotificationData[] = [
    {
      id: 'test1',
      title: '김철수 결혼식 알림',
      message: '💒 결혼식이 곧 다가옵니다!\n\n김철수님의 결혼식이 내일 오후 12시에 진행됩니다.',
      eventType: 'wedding',
      date: new Date(Date.now() + 5000), // 5초 후
      location: '롯데호텔 크리스탈볼룸',
    },
    {
      id: 'test2',
      title: '박영희 어머님 장례식 알림',
      message: '🕊️ 조문 안내\n\n박영희님 어머님의 장례식이 3일 후 오후 2시에 진행됩니다.',
      eventType: 'funeral',
      date: new Date(Date.now() + 10000), // 10초 후
      location: '서울추모공원',
    },
    {
      id: 'test3',
      title: '이민수 아들 돌잔치 알림',
      message: '🎂 돌잔치 초대\n\n이민수님 아들의 돌잔치가 7일 후 오전 11시 30분에 진행됩니다.',
      eventType: 'birthday',
      date: new Date(Date.now() + 15000), // 15초 후
      location: '강남구청 웨딩홀',
    },
  ];

  const sendTestNotification = async (notificationData: NotificationData) => {
    try {
      await notificationService.sendImmediateNotification(notificationData);
      Alert.alert('알림 발송', '테스트 알림이 발송되었습니다!');
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('오류', '알림 발송에 실패했습니다.');
    }
  };

  const scheduleTestNotification = async (notificationData: NotificationData) => {
    try {
      await notificationService.scheduleLocalNotification(notificationData);
      Alert.alert('알림 예약', '알림이 예약되었습니다!');
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('오류', '알림 예약에 실패했습니다.');
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await notificationService.cancelAllScheduledNotifications();
      Alert.alert('알림 취소', '모든 예약된 알림이 취소되었습니다.');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
      Alert.alert('오류', '알림 취소에 실패했습니다.');
    }
  };

  const showScheduledNotifications = async () => {
    try {
      const scheduled = await notificationService.getScheduledNotifications();
      Alert.alert(
        '예약된 알림',
        `총 ${scheduled.length}개의 알림이 예약되어 있습니다.`,
        [{ text: '확인' }]
      );
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알림 테스트</Text>
      
      {/* 푸시 토큰 표시 */}
      <View style={styles.tokenContainer}>
        <Text style={styles.tokenLabel}>푸시 토큰:</Text>
        <Text style={styles.tokenText} numberOfLines={2}>
          {expoPushToken || '토큰을 가져오는 중...'}
        </Text>
      </View>

      {/* 즉시 알림 발송 버튼들 */}
      <Text style={styles.sectionTitle}>즉시 알림 발송</Text>
      {testNotifications.map((notificationData, index) => (
        <TouchableOpacity
          key={notificationData.id}
          style={styles.button}
          onPress={() => sendTestNotification(notificationData)}
        >
          <Ionicons name="notifications" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {notificationData.title} (즉시)
          </Text>
        </TouchableOpacity>
      ))}

      {/* 예약 알림 버튼들 */}
      <Text style={styles.sectionTitle}>예약 알림 설정</Text>
      {testNotifications.map((notificationData, index) => (
        <TouchableOpacity
          key={`schedule-${notificationData.id}`}
          style={[styles.button, styles.scheduleButton]}
          onPress={() => scheduleTestNotification(notificationData)}
        >
          <Ionicons name="time" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {notificationData.title} (예약)
          </Text>
        </TouchableOpacity>
      ))}

      {/* 실제 경조사 알림 기능 */}
      <Text style={styles.sectionTitle}>실제 경조사 알림</Text>
      <TouchableOpacity
        style={[styles.button, styles.apiButton]}
        onPress={async () => {
          try {
            await notificationService.scheduleNotificationsFromApiData();
            Alert.alert('알림 예약', 'API 데이터로부터 알림 예약이 완료되었습니다!');
          } catch (error) {
            console.error('API 알림 예약 실패:', error);
            Alert.alert('오류', 'API 알림 예약에 실패했습니다.');
          }
        }}
      >
        <Ionicons name="cloud-download" size={20} color="#fff" />
        <Text style={styles.buttonText}>API 데이터로 알림 예약</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.scheduleButton]}
        onPress={async () => {
          try {
            console.log('🚀 스케줄 알림 예약 시작...');
            await notificationService.scheduleNotificationsFromSchedules();
            
            // 예약된 알림 수 확인
            const scheduledNotifications = await notificationService.getScheduledNotifications();
            console.log(`📋 현재 예약된 알림 수: ${scheduledNotifications.length}개`);
            
            Alert.alert(
              '알림 예약 완료', 
              `스케줄 데이터로부터 알림 예약이 완료되었습니다!\n\n현재 예약된 알림: ${scheduledNotifications.length}개`,
              [{ text: '확인' }]
            );
          } catch (error) {
            console.error('❌ 스케줄 알림 예약 실패:', error);
            Alert.alert('오류', `스케줄 알림 예약에 실패했습니다.\n\n오류: ${error.message || '알 수 없는 오류'}`);
          }
        }}
      >
        <Ionicons name="calendar" size={20} color="#fff" />
        <Text style={styles.buttonText}>스케줄 데이터로 알림 예약</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.apiButton]}
        onPress={async () => {
          try {
            console.log('🚀 개별 경조사 알림 예약 시작...');
            
            // 테스트용 경조사 데이터
            const testEvent = {
              id: 'test_event_' + Date.now(),
              title: '테스트 결혼식',
              event_type: 'wedding' as const,
              date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2시간 후
              location: '테스트 웨딩홀',
              host: '테스트 호스트',
              contact: '010-0000-0000',
            };
            
            const result = await notificationService.scheduleNotificationForEvent(testEvent);
            
            // 예약된 알림 수 확인
            const scheduledNotifications = await notificationService.getScheduledNotifications();
            console.log(`📋 현재 예약된 알림 수: ${scheduledNotifications.length}개`);
            
            Alert.alert(
              '개별 알림 예약 완료', 
              `개별 경조사 알림 예약이 완료되었습니다!\n\n예약된 알림:\n• 1일 전: ${result.dayBeforeId ? '예약됨' : '건너뜀'}\n• 1시간 전: ${result.hourBeforeId ? '예약됨' : '건너뜀'}\n\n현재 예약된 알림: ${scheduledNotifications.length}개`,
              [{ text: '확인' }]
            );
          } catch (error) {
            console.error('❌ 개별 경조사 알림 예약 실패:', error);
            Alert.alert('오류', `개별 경조사 알림 예약에 실패했습니다.\n\n오류: ${error.message || '알 수 없는 오류'}`);
          }
        }}
      >
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text style={styles.buttonText}>개별 경조사 알림 예약</Text>
      </TouchableOpacity>

      {/* 관리 버튼들 */}
      <Text style={styles.sectionTitle}>알림 관리</Text>
      <TouchableOpacity
        style={[styles.button, styles.manageButton]}
        onPress={showScheduledNotifications}
      >
        <Ionicons name="list" size={20} color="#fff" />
        <Text style={styles.buttonText}>예약된 알림 보기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={cancelAllNotifications}
      >
        <Ionicons name="close-circle" size={20} color="#fff" />
        <Text style={styles.buttonText}>모든 알림 취소</Text>
      </TouchableOpacity>

      {/* 마지막 수신 알림 */}
      {notification && (
        <View style={styles.lastNotification}>
          <Text style={styles.sectionTitle}>마지막 수신 알림:</Text>
          <Text style={styles.notificationText}>
            {notification.request.content.title}
          </Text>
          <Text style={styles.notificationBody}>
            {notification.request.content.body}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  tokenContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  tokenText: {
    fontSize: 12,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  scheduleButton: {
    backgroundColor: '#10B981',
  },
  apiButton: {
    backgroundColor: '#F59E0B',
  },
  manageButton: {
    backgroundColor: '#8B5CF6',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  lastNotification: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  notificationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  notificationBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default NotificationTest;
