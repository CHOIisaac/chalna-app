import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';

const Notifications: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "김철수 결혼식 알림",
      message: "💒 결혼식이 곧 다가옵니다!\n\n김철수님의 결혼식이 내일 오후 12시에 진행됩니다. 축하의 마음을 담아 참석해주시면 감사하겠습니다.",
      time: "1시간 전",
      type: "wedding",
      read: false,
      date: new Date(),
      location: "롯데호텔 크리스탈볼룸",
    },
    {
      id: "2", 
      title: "박영희 어머님 장례식 알림",
      message: "🕊️ 조문 안내\n\n박영희님 어머님의 장례식이 3일 후 오후 2시에 진행됩니다. 조문 시간은 오후 2시부터 4시까지입니다.",
      time: "3시간 전",
      type: "funeral",
      read: false,
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      location: "서울추모공원",
    },
    {
      id: "3",
      title: "이민수 아들 돌잔치 알림", 
      message: "🎂 돌잔치 초대\n\n이민수님 아들의 돌잔치가 7일 후 오전 11시 30분에 진행됩니다. 돌잡이 행사와 함께 진행되니 많은 축하 부탁드립니다.",
      time: "1일 전",
      type: "birthday",
      read: true,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "강남구청 웨딩홀",
    },
    {
      id: "4",
      title: "정수정 개업식 알림",
      message: "🎊 개업식 초대\n\n정수정님의 개업식이 10일 후 오후 3시에 진행됩니다. 새로운 시작을 함께 축하해주시면 감사하겠습니다.",
      time: "2일 전", 
      type: "opening",
      read: true,
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      location: "강남구 신사동 사무실",
    },
    {
      id: "5",
      title: "최영수 결혼식 알림",
      message: "💒 결혼식 알림\n\n최영수님의 결혼식이 15일 후 오후 1시에 진행됩니다. 축하의 마음을 담아 참석해주시면 감사하겠습니다.",
      time: "3일 전",
      type: "wedding", 
      read: false,
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      location: "그랜드하얏트 서울 웨딩홀",
    },
    {
      id: "6",
      title: "김민지 딸 돌잔치 알림",
      message: "🎂 돌잔치 초대\n\n김민지님 딸의 돌잔치가 20일 후 오전 10시 30분에 진행됩니다. 돌잡이 행사와 함께 진행되니 많은 축하 부탁드립니다.",
      time: "5일 전",
      type: "birthday",
      read: true,
      date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      location: "롯데호텔 월드 크리스탈볼룸",
    }
  ]);


  // 개별 알림 카드 클릭 시 읽음으로 처리하고 상세 페이지로 이동
  const handleNotificationPress = (notificationId: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    router.push(`/notification-detail?notificationId=${notificationId}`);
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
      default: return '기타';
    }
  };

  const filteredNotifications = notifications;

  return (
    <MobileLayout currentPage="notifications">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 알림 전용 헤더 */}
        <View style={styles.header}>
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
              <Text style={styles.subtitle}>소중한 순간을 놓치지 마세요</Text>
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


        {/* 알림 요약 카드 */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryTitle}>이번 주 경조사</Text>
                <Text style={styles.summarySubtitle}>
                  {new Date().getFullYear()}년 {new Date().getMonth() + 1}월
                </Text>
              </View>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>{notifications.filter(n => !n.read).length}</Text>
                <Text style={styles.summaryStatLabel}>새 알림</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>{notifications.length}</Text>
                <Text style={styles.summaryStatLabel}>총 알림</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>
                  {notifications.filter(n => {
                    const today = new Date();
                    const eventDate = n.date;
                    const diffTime = eventDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays >= 0 && diffDays <= 7;
                  }).length}
                </Text>
                <Text style={styles.summaryStatLabel}>이번 주</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 알림 목록 */}
        <View style={styles.notificationsSection}>
          
          <View style={styles.notificationsList}>
            {filteredNotifications.map((notification) => {
              const typeStyle = getEventTypeColor(notification.type);
              const isToday = notification.date.toDateString() === new Date().toDateString();
              const isTomorrow = notification.date.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();
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
                          {getEventTypeName(notification.type)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 빈 상태 */}
        {filteredNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={48} color="#ddd" />
            </View>
            <Text style={styles.emptyTitle}>
              알림이 없습니다
            </Text>
            <Text style={styles.emptyDescription}>
              새로운 경조사 알림이 오면 여기에 표시됩니다.
            </Text>
          </View>
        )}
      </ScrollView>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // 헤더 스타일
  header: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
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


  // 요약 섹션
  summarySection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    marginBottom: 20,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#e9ecef',
    marginHorizontal: 16,
  },

  // 알림 섹션
  notificationsSection: {
    paddingHorizontal: 20,
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

