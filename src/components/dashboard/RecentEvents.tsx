import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RecentSchedule } from '../../types';

interface RecentEventsProps {
  recentSchedules: RecentSchedule[];
  loading: boolean;
}

const RecentEvents: React.FC<RecentEventsProps> = ({ recentSchedules, loading }) => {
  // 시간 포맷팅 함수 (HH:MM:SS -> HH:MM)
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:MM만 추출
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  return (
    <View style={styles.container}>
      {/* 무신사 스타일 헤더 */}

      {/* 무신사 스타일 이벤트 리스트 */}
      <View style={styles.eventsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>최근 나눈 마음</Text>
        </View>

        <View style={styles.eventsList}>
          {loading ? (
            // 로딩 중일 때는 로딩 카드 표시
            Array.from({ length: 3 }).map((_, index) => (
              <View key={index} style={styles.eventCard}>
                <View style={styles.infoSection}>
                  <View style={styles.titleRow}>
                    <ActivityIndicator size="small" color="#666" />
                    <Text style={[styles.eventTitle, { marginLeft: 8 }]}>로딩 중...</Text>
                  </View>
                </View>
                <View style={styles.amountSection}>
                  <Text style={styles.amountText}>-</Text>
                </View>
              </View>
            ))
          ) : recentSchedules.length > 0 ? (
            recentSchedules.map((schedule, index) => (
              <TouchableOpacity 
                key={schedule.id} 
                style={styles.eventCard}
                activeOpacity={0.8}
                onPress={() => {}}
              >
                {/* 정보 영역 */}
                <View style={styles.infoSection}>
                  <View style={styles.titleRow}>
                    <Text style={styles.eventTitle}>{schedule.title}</Text>
                  </View>
                  
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={styles.metaText}>
                      {formatDate(schedule.event_date)}
                      {schedule.event_time && ` ${formatTime(schedule.event_time)}`}
                    </Text>
                  </View>
                  
                  {schedule.location && (
                    <View style={[styles.metaRow, { marginTop: 5 }]}>
                      <Ionicons name="location-outline" size={14} color="#666" />
                      <Text style={styles.metaText}>{schedule.location}</Text>
                    </View>
                  )}
                </View>

                {/* 이벤트 타입 영역 */}
                <View style={styles.amountSection}>
                  <View style={[styles.typeTag, { backgroundColor: '#f0f0f0' }]}>
                    <Text style={[styles.typeText, { color: '#666666' }]}>
                      {schedule.event_type}
                    </Text>
                  </View>
                  {schedule.memo && (
                    <Text style={[styles.metaText, { marginTop: 4, textAlign: 'right' }]}>
                      {schedule.memo}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            // 데이터가 없을 때
            <View style={styles.eventCard}>
              <View style={styles.infoSection}>
                <Text style={styles.eventTitle}>등록된 일정이 없습니다</Text>
                <Text style={[styles.metaText, { marginTop: 8 }]}>
                  새로운 경조사 일정을 추가해보세요
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  filterButton: {
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

  // 이벤트 섹션
  eventsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sectionCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
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

  // 정보 섹션
  infoSection: {
    flex: 1,
  },
  titleRow: {
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  typeTag: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  typeText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  statusRow: {
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
    marginRight: 6,
  },

  // 금액 섹션
  amountSection: {
    marginLeft: 12,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 6,
  },
});

export default RecentEvents;
