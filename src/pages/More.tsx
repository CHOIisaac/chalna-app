import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { shadows } from '../lib/utils';

const More: React.FC = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  // 탭이 포커스될 때마다 스크롤을 맨 위로 이동
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, [])
  );

  const menuItems = [
    {
      title: '엑셀파일로 내보내기',
      description: '경조사 데이터를 엑셀 파일로 저장',
      onPress: () => {
        // TODO: 엑셀 내보내기 기능 구현
        console.log('엑셀 내보내기 기능 실행');
      },
    },
    {
      title: '도움말',
      description: '사용법 및 문의사항',
      onPress: () => {
        // Help screen navigation
      },
    },
    {
      title: '앱 정보',
      description: '버전 정보 및 라이선스',
      onPress: () => {
        // App info screen navigation
      },
    },
  ];

  return (
    <MobileLayout currentPage="more">
      <ScrollView ref={scrollViewRef} style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 사용자 프로필 카드 */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            {/* 설정 버튼 */}
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings' as never)}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={18} color="#1F2937" />
            </TouchableOpacity>
            
            <View style={styles.profileContent}>
              <View style={styles.profileInfo}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={28} color="#6B7280" />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>김경조님</Text>
                  <Text style={styles.userEmail}>kim.kyungjo@email.com</Text>
                  <View style={styles.userStats}>
                    <Ionicons name="people" size={14} color="#9CA3AF" />
                    <Text style={styles.statsText}>127명의 소중한 인연</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 이번 달 활동 */}
        <View style={styles.quickStatsSection}>
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>이번 달 요약</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>참여한 경조사</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>1.2M</Text>
                <Text style={styles.statLabel}>총 지출</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>800K</Text>
                <Text style={styles.statLabel}>총 수입</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 메뉴 항목 */}
        <View style={styles.additionalMenuSection}>
          <View style={styles.additionalMenuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.additionalMenuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.additionalMenuContent}>
                  <View style={styles.additionalMenuText}>
                    <Text style={styles.additionalMenuTitle}>{item.title}</Text>
                    <Text style={styles.additionalMenuDescription}>{item.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 앱 정보 */}
        <View style={styles.appInfoSection}>
          <View style={styles.appInfoCard}>
            <View style={styles.appInfoHeader}>
              <View style={styles.appDetails}>
                <Text style={styles.appName}>찰나</Text>
                <Text style={styles.appVersion}>버전 1.0.0</Text>
              </View>
            </View>
            <Text style={styles.appDescription}>
              소중한 인연들과의 경조사를 기록하고 관리하는 앱입니다.
            </Text>
          </View>
        </View>

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
    paddingTop: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

  // 프로필 섹션
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    ...shadows.soft,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 빠른 통계 섹션
  quickStatsSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    ...shadows.soft,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statsBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },


  // 추가 메뉴 섹션
  additionalMenuSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  additionalMenuList: {
    backgroundColor: 'white',
    borderRadius: 16,
    ...shadows.soft,
  },
  additionalMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  additionalMenuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  additionalMenuText: {
    flex: 1,
  },
  additionalMenuTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  additionalMenuDescription: {
    fontSize: 13,
    color: '#6B7280',
  },

  // 앱 정보 섹션
  appInfoSection: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 16,
  },
  appInfoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    ...shadows.soft,
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  appVersion: {
    fontSize: 13,
    color: '#6B7280',
  },
  appDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

});

export default More;
