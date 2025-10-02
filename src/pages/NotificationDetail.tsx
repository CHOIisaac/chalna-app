import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { NotificationData } from '../services/api';
import { getEventMessage } from '../utils/eventMessages';

const NotificationDetail: React.FC = () => {
  const router = useRouter();
  const { notificationId, notificationData } = useLocalSearchParams<{ 
    notificationId: string;
    notificationData?: string;
  }>();

  // 목록에서 전달받은 데이터 사용
  const notification: NotificationData = notificationData 
    ? JSON.parse(notificationData)
    : {
        id: notificationId || "1",
        title: "알림 정보를 불러올 수 없습니다",
        message: "알림 데이터가 없습니다.",
        time: "",
        event_type: "wedding",
        read: false,
        date: new Date().toISOString(),
        location: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

  // 경조사 타입에 따른 메시지 생성
  const message = getEventMessage(notification.event_type, notification.title, new Date(notification.date), notification.location);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'wedding': return { bg: '#FFF5F5', text: '#E53E3E', icon: '💒' };
      case 'funeral': return { bg: '#F7FAFC', text: '#4A5568', icon: '🕊️' };
      case 'birthday': return { bg: '#FFFBF0', text: '#DD6B20', icon: '🎂' };
      case 'opening': return { bg: '#F0FFF4', text: '#38A169', icon: '🎊' };
      default: return { bg: '#F7FAFC', text: '#4A5568', icon: '📅' };
    }
  };

  const getEventTypeName = (type: string) => {
    switch (type) {
      case 'wedding': return '결혼식';
      case 'funeral': return '장례식';
      case 'birthday': return '돌잔치';
      case 'opening': return '개업식';
      default: return '경조사';
    }
  };

  const typeInfo = getEventTypeColor(notification.event_type);

  return (
    <MobileLayout>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>알림 상세</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 메인 카드 */}
          <View style={styles.mainCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.typeBadge, { backgroundColor: typeInfo.bg }]}>
                <Text style={styles.typeIcon}>{typeInfo.icon}</Text>
                <Text style={[styles.typeText, { color: typeInfo.text }]}>
                  {getEventTypeName(notification.event_type)}
                </Text>
              </View>
              <Text style={styles.timeText}>{notification.time}</Text>
            </View>

            <Text style={styles.title}>{notification.title}</Text>
            
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{notification.message || message}</Text>
            </View>

            {/* 상세 정보 */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>일시</Text>
                  <Text style={styles.detailValue}>
                    {new Date(notification.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long'
                    })} 오후 12:00
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={20} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>장소</Text>
                  <Text style={styles.detailValue}>{notification.location}</Text>
                </View>
              </View>

            </View>

          </View>

        </ScrollView>
      </View>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  mainCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 32,
  },
  messageContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
});

export default NotificationDetail;
