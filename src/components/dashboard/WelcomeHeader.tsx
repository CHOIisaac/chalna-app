import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../lib/utils';
import { MonthlyStats } from '../../types';

interface WelcomeHeaderProps {
  monthlyStats: MonthlyStats | null;
  loading: boolean;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ monthlyStats, loading }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 드롭다운 메뉴 데이터
  const dropdownOptions = [
    { id: 'ko', label: 'KOREA', sublabel: '한국' },
    { id: 'en', label: 'ENGLISH', sublabel: '영어' },
    { id: 'ja', label: 'JAPAN', sublabel: '일본' },
    { id: 'zh', label: 'CHINA', sublabel: '중국' },
  ];

  // 금액 포맷팅 함수
  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  // 증감률 표시 함수
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `전월 대비 ${sign}${change}%`;
  };

  return (
    <View style={styles.container}>
      {/* 상단 네비게이션 바 */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Text style={styles.logoText}>CHALNA</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
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
          <View style={styles.notificationBadge} />
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
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Text style={styles.statValue}>
                    {monthlyStats ? formatAmount(monthlyStats.total_amount) : '0'}원
                  </Text>
                  <Text style={styles.statChange}>
                    {monthlyStats ? formatChange(monthlyStats.total_amount_change) : '전월 대비 0%'}
                  </Text>
                </>
              )}
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>함께할 순간</Text>
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Text style={styles.statValue}>
                    {monthlyStats ? `${monthlyStats.event_count}건` : '0건'}
                  </Text>
                  <Text style={styles.statChange}>
                    {monthlyStats ? `이번 주 ${monthlyStats.this_week_event_count}건` : '이번 주 0건'}
                  </Text>
                </>
              )}
            </View>
          </View>
          
          {/* 프로그레스 바 */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>일정 완료율</Text>
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.progressValue}>
                  {monthlyStats ? `${monthlyStats.completion_rate}%` : '0%'}
                </Text>
              )}
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

      {/* 드롭다운 모달 */}
      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.dropdownMenu}>
            {dropdownOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.dropdownItem,
                  index === 0 && styles.dropdownItemSelected,
                  index === dropdownOptions.length - 1 && styles.dropdownItemLast
                ]}
                onPress={() => {
                  setIsDropdownOpen(false);
                  // 여기에 언어 변경 로직 추가
                  console.log(`Selected language: ${option.label}`);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownItemContent}>
                  <Text style={[
                    styles.dropdownLabel,
                    index === 0 && styles.dropdownLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.dropdownSublabel}>
                    {option.sublabel}
                  </Text>
                </View>
                <Text style={styles.dropdownArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  dropdownArrow: {
    fontSize: 9,
    color: '#000000',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  dropdownMenu: {
    backgroundColor: 'white',
    borderRadius: 0,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    paddingTop: 60,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: {
    borderWidth: 2,
    borderColor: '#000000',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemContent: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  dropdownLabelSelected: {
    fontWeight: '700',
  },
  dropdownSublabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
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
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
});

export default WelcomeHeader;
