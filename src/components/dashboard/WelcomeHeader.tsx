import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../lib/utils';
import { notificationApiService } from '../../services/api';
import { MonthlyStats } from '../../types';

interface WelcomeHeaderProps {
  monthlyStats: MonthlyStats | null;
  loading: boolean;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ monthlyStats, loading }) => {
  const router = useRouter();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [showToast, setShowToast] = useState(false);


  // 금액 포맷팅 함수
  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  // 증감률 표시 함수
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `전월 대비 ${sign}${change}%`;
  };

  // 읽지 않은 알림 확인 함수
  const checkUnreadNotifications = useCallback(async () => {
    try {
      const response = await notificationApiService.getNotifications();
      // API 응답 구조: response.data.notifications
      const notifications = response.data?.notifications || [];
      const hasUnread = notifications.some(notification => !notification.read);
      setHasUnreadNotifications(hasUnread);
    } catch (error) {
      console.error('알림 상태 확인 실패:', error);
      setHasUnreadNotifications(false);
    }
  }, []);

  // 컴포넌트 마운트 시 알림 상태 확인
  useEffect(() => {
    checkUnreadNotifications();
  }, [checkUnreadNotifications]);

  // 홈화면 포커스 시 알림 상태 다시 확인
  useFocusEffect(
    useCallback(() => {
      checkUnreadNotifications();
    }, [checkUnreadNotifications])
  );

  return (
    <View style={styles.container}>
      {/* 상단 네비게이션 바 */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Text style={styles.logoText}>CHALNA</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => {
              // 토스트 메시지 표시
              setShowToast(true);
              setTimeout(() => {
                setShowToast(false);
              }, 2000); // 2초 후 자동 사라짐
            }}
            activeOpacity={0.7}
          >
            <View style={styles.dropdownIcon}>
              <Ionicons name="chevron-down" size={12} color="#000000" />
            </View>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push('/notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.foreground} />
          {hasUnreadNotifications && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>

      {/* 메인 통계 카드 */}
      <View style={styles.mainCard}>
        <LinearGradient
          colors={['#FFFFFF', '#F8F9FA']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>이번 달 현황</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/stats')}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>나눈 마음</Text>
              <>
                <Text style={styles.statValue}>
                  {monthlyStats ? formatAmount(monthlyStats.total_amount) : '0'}원
                </Text>
                <Text style={styles.statChange}>
                  {monthlyStats ? formatChange(monthlyStats.total_amount_change) : '전월 대비 0%'}
                </Text>
              </>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>함께할 순간</Text>
              <>
                <Text style={styles.statValue}>
                  {monthlyStats ? `${monthlyStats.event_count}건` : '0건'}
                </Text>
                <Text style={styles.statChange}>
                  {monthlyStats ? `이번 주 ${monthlyStats.this_week_event_count}건` : '이번 주 0건'}
                </Text>
              </>
            </View>
          </View>
          
          {/* 프로그레스 바 */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>일정 완료율</Text>
              <Text style={styles.progressValue}>
                {monthlyStats ? `${monthlyStats.completion_rate}%` : '0%'}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill, 
                { 
                  width: monthlyStats ? `${monthlyStats.completion_rate}%` : '0%' 
                }
              ]} />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* 토스트 메시지 */}
      {showToast && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>서비스 준비 중입니다</Text>
        </View>
        )}
     </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownButton: {
  },
  dropdownIcon: {
    width: 15,
    height: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  mainCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardGradient: {
    padding: 28,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.cardForeground,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.mutedForeground,
    marginBottom: 6,
    textAlign: 'center',
    lineHeight: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.destructive,
    marginBottom: 6,
    textAlign: 'center',
    lineHeight: 24,
  },
  statChange: {
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 16,
  },
  progressSection: {
    marginTop: 20,
    paddingTop: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 16,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.foreground,
    lineHeight: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    width: '75%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: '50%',
    marginLeft: -100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    width: 200,
  },
  toastText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default WelcomeHeader;
