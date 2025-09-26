import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { NotificationData as ApiNotificationData, handleApiError, notificationApiService } from '../services/api';

const Notifications: React.FC = () => {
  const router = useRouter();
  
  // 상태 관리
  const [notifications, setNotifications] = useState<ApiNotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 알림 데이터 로드
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 알림 데이터를 로드합니다...');
      const response = await notificationApiService.getNotifications();
      
      if (response.success && response.data) {
        setNotifications(response.data.notifications);
        console.log(`✅ ${response.data.notifications.length}개의 알림을 로드했습니다.`);
      } else {
        throw new Error(response.error || '알림 데이터를 가져올 수 없습니다.');
      }
    } catch (err) {
      console.error('❌ 알림 로드 실패:', err);
      setError(handleApiError(err));
      
      // 오류 발생 시 Mock 데이터 사용
      console.log('📱 Mock 데이터를 사용합니다.');
      const mockNotifications: ApiNotificationData[] = [
        {
          id: "1",
          title: "김철수 결혼식 알림",
          message: "💒 결혼식이 곧 다가옵니다!\n\n김철수님이 내일 오후 12시에 진행됩니다. 새로운 시작을 함께 축하해주시면 감사하겠습니다.",
          time: "1시간 전",
          event_type: "wedding",
          read: false,
          date: new Date().toISOString(),
          location: "롯데호텔 크리스탈볼룸",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2", 
          title: "박영희 어머님 장례식 알림",
          message: "🕊️ 조문 안내\n\n박영희님 어머님이 3일 후 오후 2시에 진행됩니다. 고인의 명복을 빌어주시면 감사하겠습니다.",
          time: "3시간 전",
          event_type: "funeral",
          read: false,
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          location: "서울추모공원",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          title: "이민수 아들 돌잔치 알림", 
          message: "🎂 돌잔치 초대\n\n이민수님 아들이 7일 후 오전 11시 30분에 진행됩니다. 아이의 건강한 성장을 함께 축하해주시면 감사하겠습니다.",
          time: "1일 전",
          event_type: "birthday",
          read: true,
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: "강남구청 웨딩홀",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "4",
          title: "정수정 개업식 알림",
          message: "🎊 개업식 초대\n\n정수정님이 10일 후 오후 3시에 진행됩니다. 새로운 시작을 함께 축하해주시면 감사하겠습니다.",
          time: "2일 전", 
          event_type: "opening",
          read: true,
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          location: "강남구 신사동 사무실",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "5",
          title: "최영수 결혼식 알림",
          message: "💒 결혼식이 곧 다가옵니다!\n\n최영수님이 15일 후 오후 1시에 진행됩니다. 새로운 시작을 함께 축하해주시면 감사하겠습니다.",
          time: "3일 전",
          event_type: "wedding", 
          read: false,
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          location: "그랜드하얏트 서울 웨딩홀",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "6",
          title: "김민지 딸 돌잔치 알림",
          message: "🎂 돌잔치 초대\n\n김민지님 딸이 20일 후 오전 10시 30분에 진행됩니다. 아이의 건강한 성장을 함께 축하해주시면 감사하겠습니다.",
          time: "5일 전",
          event_type: "birthday",
          read: true,
          date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          location: "롯데호텔 월드 크리스탈볼룸",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  }, []);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );


  // 개별 알림 카드 클릭 시 읽음으로 처리하고 상세 페이지로 이동
  const handleNotificationPress = async (notificationId: string) => {
    try {
      // API에서 읽음 처리
      await notificationApiService.markAsRead(notificationId);
      
      // 로컬 상태 업데이트
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // 상세 페이지로 이동
      router.push(`/notification-detail?notificationId=${notificationId}`);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
      // API 실패해도 상세 페이지는 이동
      router.push(`/notification-detail?notificationId=${notificationId}`);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'wedding': return { bg: '#f0f0f0', text: '#666666' };
      case 'funeral': return { bg: '#f0f0f0', text: '#666666' };
      case 'birthday': return { bg: '#f0f0f0', text: '#666666' };
      case 'opening': return { bg: '#f0f0f0', text: '#666666' };
      default: return { bg: '#f0f0f0', text: '#666666' };
    }
  };

  const getEventTypeName = (type: string) => {
    switch (type) {
      case 'wedding': return '결혼식';
      case 'funeral': return '장례식';
      case 'birthday': return '돌잔치';
      case 'opening': return '개업식';
      case 'graduation': return '졸업식';
      case 'promotion': return '승진';
      default: return '기타';
    }
  };

  const filteredNotifications = notifications;

  return (
    <MobileLayout currentPage="notifications">
      <View style={styles.container}>
        {/* 고정 헤더 */}
        <View style={styles.fixedHeader}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>알림</Text>
            </View>
            </View>
            <TouchableOpacity 
              style={styles.settingsButton} 
              activeOpacity={0.7}
              onPress={() => {
                // TODO: 알림 설정 페이지로 이동
              }}
            >
              <Ionicons name="settings-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>


        {/* 스크롤 가능한 컨텐츠 */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
          
        {/* 알림 목록 */}
        <View style={styles.notificationsSection}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>알림을 불러오는 중...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#EF4444" />
              <Text style={styles.errorTitle}>알림 로드 실패</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={loadNotifications}
              >
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {filteredNotifications.map((notification) => {
                const typeStyle = getEventTypeColor(notification.event_type);
                const notificationDate = new Date(notification.date);
                const isToday = notificationDate.toDateString() === new Date().toDateString();
                const isTomorrow = notificationDate.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();
                const isUrgent = isToday || isTomorrow;

              return (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    notification.read ? styles.readCard : styles.unreadCard
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleNotificationPress(notification.id)}
                >
                  {/* 알림 아이콘 */}
                  {/*<View style={styles.notificationIconContainer}>*/}
                  {/*  <View style={[*/}
                  {/*    styles.notificationIcon,*/}
                  {/*    { backgroundColor: typeStyle.bg }*/}
                  {/*  ]}>*/}
                  {/*    <Ionicons */}
                  {/*      name="notifications" */}
                  {/*      size={20} */}
                  {/*      color={typeStyle.text} */}
                  {/*    />*/}
                  {/*  </View>*/}
                  {/*  {!notification.read && (*/}
                  {/*    <View style={styles.unreadDot} />*/}
                  {/*  )}*/}
                  {/*</View>*/}

                  {/* 알림 내용 */}
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text 
                        style={[
                          styles.notificationTitle,
                          notification.read ? styles.readTitle : styles.unreadTitle
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {notification.title}
                      </Text>
                      <View style={styles.notificationMeta}>
                        <Text style={styles.notificationTime}>{notification.time}</Text>
                        {isUrgent && (
                          <View style={styles.urgentIndicator}>
                            <Text style={styles.urgentIndicatorText}>
                              {isToday ? '오늘' : '내일'}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <Text 
                      style={[
                        styles.notificationMessage,
                        notification.read ? styles.readMessage : styles.unreadMessage
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {notification.message}
                    </Text>
                    
                    <View style={styles.notificationFooter}>
                      <View style={styles.eventInfo}>
                        <Ionicons name="location-outline" size={14} color="#999" />
                        <Text 
                          style={styles.eventLocation}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {notification.location}
                        </Text>
                      </View>
                      <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg }]}>
                        <Text style={[styles.typeText, { color: typeStyle.text }]}>
                          {getEventTypeName(notification.event_type)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
              })}
            </View>
          )}
        </View>

        {/* 빈 상태 */}
        {!loading && !error && filteredNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={48} color="#ddd" />
            </View>
            <Text style={styles.emptyDescription}>
              알림이 없습니다
            </Text>
          </View>
        )}
        </ScrollView>
      </View>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // 고정 헤더 스타일
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 16,
    zIndex: 1000,
  },
  
  // 스크롤 컨텐츠
  scrollContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 60, // 헤더 높이만큼 여백 (요약카드가 스크롤 안으로 이동했으므로)
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleRow: {
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },



  // 알림 섹션
  notificationsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sectionBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a5568',
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  unreadCard: {
    backgroundColor: '#FFFFFF',
    opacity: 1,
  },
  readCard: {
    backgroundColor: '#F8F9FA',
    opacity: 0.7,
  },

  // 알림 아이콘
  notificationIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 알림 내용
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
    minHeight: 20,
  },
  unreadTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
  },
  readTitle: {
    fontWeight: '500',
    color: '#999999',
  },
  unreadMessage: {
    color: '#666666',
  },
  readMessage: {
    color: '#CCCCCC',
  },
  notificationMeta: {
    alignItems: 'flex-end',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  urgentIndicator: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  urgentIndicatorText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
    minHeight: 40, // 2줄 높이 보장
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  eventLocation: {
    fontSize: 12,
    color: '#999',
    flex: 1,
    minHeight: 16,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // 로딩 상태
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },

  // 에러 상태
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // 빈 상태
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Notifications;

