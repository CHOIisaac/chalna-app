import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../src/components/layout/MobileLayout';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    biometric: false,
    autoBackup: true,
  });

  const handleSettingToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingItems = [
    {
      id: 'profile',
      title: '프로필 설정',
      description: '개인정보 및 계정 관리',
      icon: 'person' as keyof typeof Ionicons.glyphMap,
      onPress: () => {},
    },
    {
      id: 'notifications',
      title: '알림 설정',
      description: '푸시 알림 및 이메일 알림',
      icon: 'notifications' as keyof typeof Ionicons.glyphMap,
      onPress: () => navigation.navigate('Notifications' as never),
    },
    {
      id: 'privacy',
      title: '개인정보 보호',
      description: '데이터 보호 및 개인정보 설정',
      icon: 'shield-checkmark' as keyof typeof Ionicons.glyphMap,
      onPress: () => {},
    },
    {
      id: 'backup',
      title: '데이터 백업',
      description: '클라우드 백업 및 복원',
      icon: 'cloud' as keyof typeof Ionicons.glyphMap,
      onPress: () => {},
    },
    {
      id: 'help',
      title: '도움말 및 지원',
      description: 'FAQ, 문의하기, 앱 정보',
      icon: 'help-circle' as keyof typeof Ionicons.glyphMap,
      onPress: () => {},
    },
  ];

  return (
    <MobileLayout currentPage="settings">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 무신사 스타일 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>설정</Text>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.subtitle}>앱 설정 및 계정 관리</Text>
        </View>

        {/* 프로필 편집 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color="#4a5568" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>김경조님</Text>
                <Text style={styles.profileEmail}>kim.kyungjo@email.com</Text>
              </View>
              <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
                <Ionicons name="pencil" size={16} color="#4a5568" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 앱 설정 */}
        <View style={styles.settingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>앱 설정</Text>
          </View>
          
          <View style={styles.settingsGrid}>
            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingIcon}>
                  <Ionicons name="moon" size={20} color="#4a5568" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>다크 모드</Text>
                  <Text style={styles.settingDescription}>어두운 테마 사용</Text>
                </View>
                <TouchableOpacity
                  style={styles.toggle}
                  onPress={() => handleSettingToggle('darkMode')}
                  activeOpacity={0.7}
                >
                  <View style={settings.darkMode ? styles.toggleActive : styles.toggleInactive} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingIcon}>
                  <Ionicons name="notifications" size={20} color="#4a5568" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>알림</Text>
                  <Text style={styles.settingDescription}>푸시 알림 받기</Text>
                </View>
                <TouchableOpacity
                  style={styles.toggle}
                  onPress={() => handleSettingToggle('notifications')}
                  activeOpacity={0.7}
                >
                  <View style={settings.notifications ? styles.toggleActive : styles.toggleInactive} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingIcon}>
                  <Ionicons name="finger-print" size={20} color="#4a5568" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>생체 인증</Text>
                  <Text style={styles.settingDescription}>지문 또는 Face ID</Text>
                </View>
                <TouchableOpacity
                  style={styles.toggle}
                  onPress={() => handleSettingToggle('biometric')}
                  activeOpacity={0.7}
                >
                  <View style={settings.biometric ? styles.toggleActive : styles.toggleInactive} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingIcon}>
                  <Ionicons name="cloud" size={20} color="#4a5568" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>자동 백업</Text>
                  <Text style={styles.settingDescription}>데이터 자동 백업</Text>
                </View>
                <TouchableOpacity
                  style={styles.toggle}
                  onPress={() => handleSettingToggle('autoBackup')}
                  activeOpacity={0.7}
                >
                  <View style={settings.autoBackup ? styles.toggleActive : styles.toggleInactive} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 계정 관리 */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>계정 관리</Text>
          </View>
          
          <View style={styles.featuresGrid}>
            {settingItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.featureCard}
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <View style={styles.featureIcon}>
                  <Ionicons name={item.icon} size={24} color="#4a5568" />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <Text style={styles.featureDescription}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 로그아웃 버튼 */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.navigate('Login' as never)}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#ff6b6b" />
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MobileLayout>
  );
}

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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 40,
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
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 설정 섹션
  settingsSection: {
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
  settingsGrid: {
    gap: 12,
  },
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e9ecef',
    padding: 2,
  },
  toggleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4a5568',
    marginLeft: 'auto',
  },
  toggleInactive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },

  // 기능 섹션
  featuresSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#666',
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
  },
});
