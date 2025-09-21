import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { authService } from '../services/api';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    notifications: true,
    autoBackup: true,
  });

  const handleSettingToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              // 로그아웃 성공 시 로그인 화면으로 이동
              // Expo Router에서는 자동으로 라우팅이 처리됩니다
            } catch (error) {
              console.error('로그아웃 오류:', error);
              Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  return (
    <MobileLayout currentPage="settings">
      <View style={styles.container}>
        {/* 고정 헤더 */}
        <View style={styles.fixedHeader}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>설정</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        {/* 스크롤 가능한 컨텐츠 */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="#6B7280" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>김경조님</Text>
                <Text style={styles.profileEmail}>kim.kyungjo@email.com</Text>
                <Text style={styles.profileStatus}>인증된 계정</Text>
              </View>
              <TouchableOpacity 
                style={styles.editButton} 
                activeOpacity={0.8}
                onPress={() => {}}
              >
                <Ionicons name="pencil" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 알림 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>알림</Text>
          </View>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="notifications" size={20} color="#6B7280" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>푸시 알림</Text>
                  <Text style={styles.settingDescription}>새로운 일정과 경조사 알림</Text>
                </View>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={() => handleSettingToggle('notifications')}
                trackColor={{ false: '#e9ecef', true: '#4a5568' }}
                thumbColor={'#ffffff'}
                ios_backgroundColor="#e9ecef"
              />
            </View>

          </View>
        </View>


        {/* 데이터 관리 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>데이터 관리</Text>
          </View>
          
          <View style={styles.settingsList}>
            {/*<View style={styles.settingItem}>*/}
            {/*  <View style={styles.settingLeft}>*/}
            {/*    <View style={styles.settingIconContainer}>*/}
            {/*      <Ionicons name="cloud" size={20} color="#6B7280" />*/}
            {/*    </View>*/}
            {/*    <View style={styles.settingTextContainer}>*/}
            {/*      <Text style={styles.settingTitle}>자동 백업</Text>*/}
            {/*      <Text style={styles.settingDescription}>클라우드 자동 백업</Text>*/}
            {/*    </View>*/}
            {/*  </View>*/}
            {/*  <Switch*/}
            {/*    value={settings.autoBackup}*/}
            {/*    onValueChange={() => handleSettingToggle('autoBackup')}*/}
            {/*    trackColor={{ false: '#e9ecef', true: '#4a5568' }}*/}
            {/*    thumbColor={'#ffffff'}*/}
            {/*    ios_backgroundColor="#e9ecef"*/}
            {/*  />*/}
            {/*</View>*/}

            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="trash" size={20} color="#6B7280" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>데이터 초기화</Text>
                  <Text style={styles.settingDescription}>모든 데이터 삭제 (복구 불가)</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 계정 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>계정</Text>
          </View>
          
          <View style={styles.settingsList}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="log-out-outline" size={20} color="#6B7280" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>로그아웃</Text>
                  <Text style={styles.settingDescription}>계정에서 안전하게 로그아웃</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="person-remove" size={20} color="#6B7280" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>탈퇴하기</Text>
                  <Text style={styles.settingDescription}>계정 및 모든 데이터 삭제</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
        
          {/* 하단 여백 */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </MobileLayout>
  );
}

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
    paddingTop: 60, // 헤더 높이만큼 여백
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
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 22,
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
    paddingTop: 20,
    paddingBottom: 20,
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
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '500',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 섹션 스타일
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // 설정 리스트
  settingsList: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
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

  // 하단 여백
  bottomSpacer: {
    height: 32,
  },
});