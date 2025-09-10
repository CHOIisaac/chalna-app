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
  const [viewMode, setViewMode] = useState<'all' | 'unread'>('all');
  
  // Mock data for notifications (경조사 알림만)
  const notifications = [
    {
      id: "1",
      title: "김철수 결혼식 알림 - 매우 긴 제목이 들어가도 카드를 벗어나지 않도록 처리됩니다",
      message: "내일 오후 12시 김철수님의 결혼식이 있습니다. 롯데호텔 크리스탈볼룸에서 진행되며, 많은 분들이 참석하실 예정입니다. 축하 인사와 함께 참석해주시면 감사하겠습니다.",
      time: "1시간 전",
      type: "wedding",
      read: false,
      date: new Date(),
      location: "롯데호텔 크리스탈볼룸 - 매우 긴 장소명이 들어가도 카드를 벗어나지 않도록 처리됩니다",
    },
    {
      id: "2", 
      title: "박영희 어머님 장례식 알림 - 긴 제목 테스트를 위한 매우 긴 텍스트가 포함된 알림 제목입니다",
      message: "3일 후 오후 2시 박영희님 어머님의 장례식이 있습니다. 서울추모공원에서 진행되며, 조문 시간은 오후 2시부터 4시까지입니다. 많은 분들이 참석하실 예정이며, 조의금은 현장에서 받으실 수 있습니다.",
      time: "3시간 전",
      type: "funeral",
      read: false,
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      location: "서울추모공원 - 강남구 테헤란로 123번길 45, 6층 대형 예식장",
    },
    {
      id: "3",
      title: "이민수 아들 돌잔치 알림", 
      message: "7일 후 오전 11시 30분 이민수님 아들의 돌잔치가 있습니다. 강남구청 웨딩홀에서 진행되며, 돌잡이 행사와 함께 진행됩니다. 많은 분들이 참석하실 예정이며, 축하 인사와 함께 참석해주시면 감사하겠습니다.",
      time: "1일 전",
      type: "birthday",
      read: true,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "강남구청 웨딩홀 - 서울특별시 강남구 테헤란로 123번길 45",
    },
    {
      id: "4",
      title: "정수정 개업식 알림 - 새로운 사업 시작을 축하하는 개업식 알림입니다",
      message: "10일 후 오후 3시 정수정님의 개업식이 있습니다. 강남구 신사동에 위치한 새로운 사무실에서 진행되며, 많은 분들이 참석하실 예정입니다. 축하 인사와 함께 참석해주시면 감사하겠습니다.",
      time: "2일 전", 
      type: "opening",
      read: true,
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      location: "강남구 신사동 - 서울특별시 강남구 신사동 123-45, 2층 사무실",
    },
    {
      id: "5",
      title: "최영수 결혼식 알림",
      message: "15일 후 오후 1시 최영수님의 결혼식이 있습니다. 웨딩홀에서 진행되며, 많은 분들이 참석하실 예정입니다.",
      time: "3일 전",
      type: "wedding", 
      read: false,
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      location: "그랜드하얏트 서울 웨딩홀",
    },
    {
      id: "6",
      title: "김민지 딸 돌잔치 알림 - 매우 긴 제목이 포함된 돌잔치 알림입니다",
      message: "20일 후 오전 10시 30분 김민지님 딸의 돌잔치가 있습니다. 많은 분들이 참석하실 예정이며, 돌잡이 행사와 함께 진행됩니다.",
      time: "5일 전",
      type: "birthday",
      read: true,
      date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      location: "롯데호텔 월드 - 서울특별시 송파구 올림픽로 300, 2층 크리스탈볼룸",
    }
  ];

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

  const filteredNotifications = viewMode === 'unread' 
    ? notifications.filter(notification => !notification.read)
    : notifications;

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
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
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

        {/* 알림 필터 섹션 */}
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>알림 필터</Text>
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {notifications.filter(n => !n.read).length}개 새 알림
              </Text>
            </View>
          </View>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                viewMode === 'all' && styles.activeFilterButton,
              ]}
              onPress={() => setViewMode('all')}
            >
              <Ionicons
                name="list-outline"
                size={18}
                color={viewMode === 'all' ? 'white' : '#666'}
              />
              <Text style={[
                styles.filterButtonText,
                viewMode === 'all' && styles.activeFilterButtonText
              ]}>전체 알림</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                viewMode === 'unread' && styles.activeFilterButton,
              ]}
              onPress={() => setViewMode('unread')}
            >
              <Ionicons
                name="notifications-outline"
                size={18}
                color={viewMode === 'unread' ? 'white' : '#666'}
              />
              <Text style={[
                styles.filterButtonText,
                viewMode === 'unread' && styles.activeFilterButtonText
              ]}>새 알림만</Text>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>경조사 알림</Text>
          </View>
          
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
                    !notification.read && styles.unreadCard,
                    isUrgent && styles.urgentCard
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    // TODO: 알림 상세 보기 또는 해당 경조사로 이동
                  }}
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
                          !notification.read && styles.unreadTitle
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
                      style={styles.notificationMessage}
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
              {viewMode === 'unread' ? '안읽은 알림이 없습니다' : '알림이 없습니다'}
            </Text>
            <Text style={styles.emptyDescription}>
              {viewMode === 'unread' 
                ? '모든 알림을 확인했습니다.' 
                : '새로운 경조사 알림이 오면 여기에 표시됩니다.'
              }
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
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 필터 섹션
  filterSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  filterBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 6,
  },
  activeFilterButton: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterButtonText: {
    color: 'white',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  urgentCard: {
    borderColor: '#ff6b6b',
    backgroundColor: '#fff5f5',
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
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff6b6b',
    borderWidth: 2,
    borderColor: 'white',
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

