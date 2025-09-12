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
import { SafeAreaView } from 'react-native-safe-area-context';
import MobileLayout from '../components/layout/MobileLayout';

const NotificationDetail: React.FC = () => {
  const router = useRouter();
  const { notificationId } = useLocalSearchParams<{ notificationId: string }>();

  // Mock data - 실제로는 notificationId로 데이터를 가져와야 함
  const notification = {
    id: notificationId || "1",
    title: "김철수 결혼식 알림",
    message: "💒 결혼식이 곧 다가옵니다!\n\n김철수님의 결혼식이 내일 오후 12시에 진행됩니다. 축하의 마음을 담아 참석해주시면 감사하겠습니다.\n\n※ 참석 확인 및 축하 인사는 미리 연락 부탁드립니다.",
    time: "1시간 전",
    type: "wedding",
    read: false,
    date: new Date(),
    location: "롯데호텔 크리스탈볼룸",
    fullDetails: {
      host: "김철수, 박영희",
      contact: "010-1234-5678",
      dressCode: "정장/드레스",
      giftInfo: "축하금 또는 선물",
      additionalInfo: "주차장 이용 가능, 지하철 2호선 잠실역 3번 출구 도보 5분"
    }
  };

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

  const typeInfo = getEventTypeColor(notification.type);

  return (
    <MobileLayout>
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
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
                  {getEventTypeName(notification.type)}
                </Text>
              </View>
              <Text style={styles.timeText}>{notification.time}</Text>
            </View>

            <Text style={styles.title}>{notification.title}</Text>
            
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{notification.message}</Text>
            </View>

            {/* 상세 정보 */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>일시</Text>
                  <Text style={styles.detailValue}>
                    {notification.date.toLocaleDateString('ko-KR', {
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

              <View style={styles.detailRow}>
                <Ionicons name="people-outline" size={20} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>주최자</Text>
                  <Text style={styles.detailValue}>{notification.fullDetails.host}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={20} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>연락처</Text>
                  <Text style={styles.detailValue}>{notification.fullDetails.contact}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="shirt-outline" size={20} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>복장</Text>
                  <Text style={styles.detailValue}>{notification.fullDetails.dressCode}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="gift-outline" size={20} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>축하금/선물</Text>
                  <Text style={styles.detailValue}>{notification.fullDetails.giftInfo}</Text>
                </View>
              </View>
            </View>

            {/* 추가 정보 */}
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalInfoTitle}>📝 추가 안내사항</Text>
              <Text style={styles.additionalInfoText}>
                {notification.fullDetails.additionalInfo}
              </Text>
            </View>
          </View>

          {/* 액션 버튼들 */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.primaryButtonText}>참석 확인</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={20} color="#666" />
              <Text style={styles.secondaryButtonText}>연락하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  additionalInfo: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  additionalInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  additionalInfoText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationDetail;
