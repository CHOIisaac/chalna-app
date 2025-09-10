import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { colors, shadows } from '../lib/utils';

const More: React.FC = () => {
  const navigation = useNavigation();

  const menuItems = [
    {
      icon: 'bookmark-outline' as keyof typeof Ionicons.glyphMap,
      title: '방명록',
      description: '소중한 인연들의 메시지',
      onPress: () => navigation.navigate('Guestbook' as never),
    },
    {
      icon: 'business-outline' as keyof typeof Ionicons.glyphMap,
      title: '업체 정보',
      description: '웨딩홀, 장례식장 등',
      onPress: () => navigation.navigate('Venues' as never),
    },
    {
      icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
      title: '알림 설정',
      description: '경조사 알림 관리',
      onPress: () => navigation.navigate('Notifications' as never),
    },
    {
      icon: 'settings-outline' as keyof typeof Ionicons.glyphMap,
      title: '설정',
      description: '앱 설정 및 계정 관리',
      onPress: () => navigation.navigate('Settings' as never),
    },
    {
      icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap,
      title: '도움말',
      description: '사용법 및 문의사항',
      onPress: () => {
        // Help screen navigation
      },
    },
    {
      icon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
      title: '앱 정보',
      description: '버전 정보 및 라이선스',
      onPress: () => {
        // App info screen navigation
      },
    },
  ];

  return (
    <MobileLayout currentPage="more">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 무신사 스타일 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>더보기</Text>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings' as never)}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>앱의 모든 기능을 확인하세요</Text>
        </View>

        {/* 사용자 프로필 카드 */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F9FA']}
              style={styles.profileGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.profileContent}>
                <View style={styles.profileInfo}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={24} color={colors.primaryForeground} />
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>김경조님</Text>
                    <Text style={styles.userEmail}>kim.kyungjo@email.com</Text>
                    <View style={styles.userStats}>
                      <Text style={styles.statsText}>총 127명의 소중한 인연</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
                  <Ionicons name="pencil" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* 빠른 통계 */}
        <View style={styles.quickStatsSection}>
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>이번 달 활동</Text>
              <View style={styles.statsBadge}>
                <Text style={styles.statsBadgeText}>활발</Text>
              </View>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>경조사</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>새 인연</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>1.2M</Text>
                <Text style={styles.statLabel}>나눈 마음</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 메인 기능 메뉴 */}
        <View style={styles.menuSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>주요 기능</Text>
          </View>
          
          <View style={styles.menuGrid}>
            {menuItems.slice(0, 4).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuCard}
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={24} color={colors.foreground} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 추가 기능 메뉴 */}
        <View style={styles.additionalMenuSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>기타</Text>
          </View>
          
          <View style={styles.additionalMenuList}>
            {menuItems.slice(4).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.additionalMenuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.additionalMenuContent}>
                  <View style={styles.additionalMenuIcon}>
                    <Ionicons name={item.icon} size={20} color={colors.foreground} />
                  </View>
                  <View style={styles.additionalMenuText}>
                    <Text style={styles.additionalMenuTitle}>{item.title}</Text>
                    <Text style={styles.additionalMenuDescription}>{item.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 앱 정보 */}
        <View style={styles.appInfoSection}>
          <View style={styles.appInfoCard}>
            <View style={styles.appInfoHeader}>
              <View style={styles.appIcon}>
                <Ionicons name="heart" size={24} color={colors.primary} />
              </View>
              <View style={styles.appDetails}>
                <Text style={styles.appName}>Remember My Moments</Text>
                <Text style={styles.appVersion}>버전 1.0.0</Text>
              </View>
            </View>
            <Text style={styles.appDescription}>
              소중한 인연들과의 경조사를 기록하고 관리하는 앱입니다.
            </Text>
          </View>
        </View>

        {/* 로그아웃 버튼 */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.navigate('Login' as never)}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
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
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
  },

  // 프로필 섹션
  profileSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileCard: {
    borderRadius: 16,
    ...shadows.soft,
  },
  profileGradient: {
    padding: 28,
    borderRadius: 16,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  userStats: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a5568',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 빠른 통계 섹션
  quickStatsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statsBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a5568',
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
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e9ecef',
    marginHorizontal: 20,
  },

  // 메뉴 섹션
  menuSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  menuGrid: {
    gap: 12,
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.soft,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },

  // 추가 메뉴 섹션
  additionalMenuSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  additionalMenuList: {
    backgroundColor: 'white',
    borderRadius: 16,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  additionalMenuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  additionalMenuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  additionalMenuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalMenuText: {
    flex: 1,
  },
  additionalMenuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  additionalMenuDescription: {
    fontSize: 14,
    color: '#666',
  },

  // 앱 정보 섹션
  appInfoSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appInfoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
  },
  appDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // 로그아웃 섹션
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.destructive + '40',
    backgroundColor: colors.destructive + '10',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.destructive,
  },
});

export default More;
