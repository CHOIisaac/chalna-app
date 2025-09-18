import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import {
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { shadows } from '../lib/utils';

const More: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  // 탭이 포커스될 때마다 스크롤을 맨 위로 이동
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, [])
  );

  const quickActions = [
    {
      title: '내 데이터 내보내기',
      description: '경조사 데이터를 파일로 저장',
      icon: 'download-outline',
      color: '#059669',
      onPress: () => {
        // TODO: 내보내기 기능 구현
        console.log('데이터 내보내기 기능 실행');
      },
    },
    {
      title: '공유하기',
      description: '친구에게 앱 추천하기',
      icon: 'share-outline',
      color: '#3b82f6',
      onPress: async () => {
        try {
          // 앱스토어/플레이스토어 링크 (나중에 실제 링크로 교체)
          const appStoreUrl = Platform.select({
            ios: 'https://apps.apple.com/app/chalna',
            android: 'https://play.google.com/store/apps/details?id=com.chalna.app',
          });

          const shareContent = {
            message: `📱 찰나 앱 - 소중한 순간을 놓치지 마세요!

💝 경조사 관리를 쉽고 체계적으로
📅 일정 관리부터 장부 기록까지
🎁 축하금 관리와 인맥 정리까지

지금 바로 다운로드하세요!
${appStoreUrl || ''}`,
            title: '찰나 앱 추천',
            url: appStoreUrl, // iOS에서 링크 미리보기로 표시
          };

          const result = await Share.share(shareContent, {
            dialogTitle: '📱 찰나 앱을 친구에게 추천해보세요!',
            ...(Platform.OS === 'ios' && {
              excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter',
                'com.apple.UIKit.activity.PostToFacebook',
              ],
            }),
          });

          if (result.action === Share.sharedAction) {
            console.log('✅ 공유 완료');
            if (result.activityType) {
              console.log('📤 공유된 앱:', result.activityType);
            }
          } else if (result.action === Share.dismissedAction) {
            console.log('❌ 공유 취소');
          }
        } catch (error) {
          console.error('🚨 공유 실패:', error);
          
          // 에러 발생 시 간단한 텍스트 공유로 폴백
          try {
            const result = await Share.share({
              message: '📱 찰나 앱 - 소중한 순간을 놓치지 마세요!\n경조사 관리를 쉽게 해보세요.',
              title: '찰나 앱 추천',
            });
            
            if (result.action === Share.sharedAction) {
              console.log('✅ 폴백 공유 완료');
            }
          } catch (fallbackError) {
            console.error('🚨 폴백 공유도 실패:', fallbackError);
          }
        }
      },
    },
  ];

  const serviceMenuItems = [
    {
      title: '고객센터',
      description: '문의사항 및 신고하기',
      icon: 'headset-outline',
      onPress: () => {
        // TODO: 고객센터 기능
      },
    },
    {
      title: '공지사항',
      description: '앱 업데이트 및 이벤트 소식',
      icon: 'megaphone-outline',
      onPress: () => {
        // TODO: 공지사항 기능
      },
    },
    {
      title: '이용약관',
      description: '서비스 이용약관 및 정책',
      icon: 'document-text-outline',
      onPress: () => {
        // TODO: 이용약관 기능
      },
    },
  ];

  return (
    <MobileLayout currentPage="more">
      <ScrollView ref={scrollViewRef} style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 사용자 프로필 카드 */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            {/* 설정 버튼 - 우측 상단 */}
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
            
            <View style={styles.profileContent}>
              <View style={styles.profileInfo}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={32} color="#6B7280" />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>김경조님</Text>
                  <Text style={styles.userEmail}>kim.kyungjo@email.com</Text>
                  <Text style={styles.userStatus}>인증된 계정</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 빠른 액션 */}
        <View style={styles.quickActionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>내 서비스</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <View style={styles.quickActionText}>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionDescription}>{action.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>


        {/* 고객지원 */}
        <View style={styles.additionalMenuSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>고객지원</Text>
          </View>
          <View style={styles.additionalMenuList}>
            {serviceMenuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.additionalMenuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.additionalMenuContent}>
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuItemIcon}>
                      <Ionicons name={item.icon as any} size={20} color="#4a5568" />
                    </View>
                    <View style={styles.additionalMenuText}>
                      <Text style={styles.additionalMenuTitle}>{item.title}</Text>
                      <Text style={styles.additionalMenuDescription}>{item.description}</Text>
                    </View>
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingTop: 16,
    paddingBottom: 12,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
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
    justifyContent: 'center',
    marginTop: 10
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
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '500',
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



  // 빠른 액션 섹션
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  quickActionsGrid: {
    backgroundColor: 'white',
    borderRadius: 16,
    ...shadows.soft,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  quickActionDescription: {
    fontSize: 13,
    color: '#6B7280',
  },

  // 추가 메뉴 섹션
  additionalMenuSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    paddingBottom: 20,
  },
  appInfoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
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
