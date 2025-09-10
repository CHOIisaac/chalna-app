import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/utils';
import MobileLayout from '../components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useNavigation } from '@react-navigation/native';

const Notifications: React.FC = () => {
  const navigation = useNavigation();
  const [notifications] = useState([
    {
      id: 1,
      title: "김철수 결혼식 알림",
      message: "내일 오후 12시 김철수님의 결혼식이 있습니다.",
      time: "1시간 전",
      type: "event",
      read: false,
    },
    {
      id: 2,
      title: "새로운 방명록",
      message: "박영희님이 방명록을 작성했습니다.",
      time: "3시간 전",
      type: "guestbook",
      read: false,
    },
    {
      id: 3,
      title: "경조사 통계",
      message: "이번 달 경조사 통계가 업데이트되었습니다.",
      time: "1일 전",
      type: "stats",
      read: true,
    },
  ]);

  const getNotificationIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'event': return 'calendar';
      case 'guestbook': return 'book';
      case 'stats': return 'bar-chart';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'event': return colors.primary;
      case 'guestbook': return colors.accent;
      case 'stats': return colors.success;
      default: return colors.mutedForeground;
    }
  };

  return (
    <MobileLayout currentPage="notifications">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.title}>알림</Text>
          <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
            <Ionicons name="settings" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* 알림 설정 */}
        <Card style={styles.settingsCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.settingsTitle}>알림 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="calendar" size={20} color={colors.foreground} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>경조사 알림</Text>
                  <Text style={styles.settingDescription}>경조사 1시간 전 알림</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.toggle} activeOpacity={0.7}>
                <View style={styles.toggleActive} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="book" size={20} color={colors.foreground} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>방명록 알림</Text>
                  <Text style={styles.settingDescription}>새 방명록 작성 시 알림</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.toggle} activeOpacity={0.7}>
                <View style={styles.toggleActive} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="bar-chart" size={20} color={colors.foreground} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>통계 알림</Text>
                  <Text style={styles.settingDescription}>월간 통계 업데이트 알림</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.toggle} activeOpacity={0.7}>
                <View style={styles.toggleInactive} />
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* 알림 목록 */}
        <View style={styles.notificationsList}>
          <Text style={styles.sectionTitle}>최근 알림</Text>
          {notifications.map((notification) => {
            const iconName = getNotificationIcon(notification.type);
            const iconColor = getNotificationColor(notification.type);
            
            return (
              <Card key={notification.id} style={styles.notificationCard} shadow="soft">
                <CardContent style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <View style={[styles.notificationIcon, { backgroundColor: iconColor + '20' }]}>
                      <Ionicons name={iconName} size={20} color={iconColor} />
                    </View>
                    <View style={styles.notificationInfo}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                </CardContent>
              </Card>
            );
          })}
        </View>

        {/* 빈 상태 */}
        {notifications.length === 0 && (
          <Card style={styles.emptyCard} shadow="soft">
            <CardContent style={styles.emptyContent}>
              <Ionicons name="notifications-off" size={48} color={colors.mutedForeground} />
              <Text style={styles.emptyTitle}>알림이 없어요</Text>
              <Text style={styles.emptyDescription}>
                새로운 알림이 오면 여기에 표시됩니다.
              </Text>
            </CardContent>
          </Card>
        )}
      </ScrollView>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 16,
    color: colors.foreground,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.muted,
    padding: 2,
  },
  toggleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginLeft: 'auto',
  },
  toggleInactive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  notificationsList: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 16,
  },
  notificationCard: {
    marginBottom: 12,
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.foreground,
    lineHeight: 20,
  },
  emptyCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});

export default Notifications;
