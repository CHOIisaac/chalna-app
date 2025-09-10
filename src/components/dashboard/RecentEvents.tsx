import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Event } from '../../types';

const RecentEvents: React.FC = () => {

  // Mock data for recent events
  const recentEvents: Event[] = [
    {
      id: '1',
      type: '결혼식',
      title: '김철수 ♥ 이영희 결혼식',
      date: '2024-08-25',
      location: '강남구 웨딩홀',
      amount: 100000,
      status: '예정',
    },
    {
      id: '2',
      type: '장례식',
      title: '박할머니 빈소',
      date: '2024-08-20',
      location: '서울병원 장례식장',
      amount: 50000,
      status: '완료',
    },
    {
      id: '3',
      type: '돌잔치',
      title: '최준호 돌잔치',
      date: '2024-08-30',
      location: '용산구 컨벤션센터',
      amount: 30000,
      status: '예정',
    },
  ];

  // 날짜 순으로 정렬하고 3개까지만 표시
  const sortedEvents = recentEvents
    .sort((a, b) => {
      // 완료된 것과 예정된 것 분리
      if (a.status === '완료' && b.status === '예정') return -1;
      if (a.status === '예정' && b.status === '완료') return 1;

      // 같은 상태 내에서는 날짜 순으로 정렬
      if (a.status === '완료' && b.status === '완료') {
        // 완료된 것들은 최신 날짜 순 (내림차순)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        // 예정된 것들은 가까운 날짜 순 (오름차순)
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    })
    .slice(0, 3); // 3개까지만 표시


  const getEventIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case '결혼식':
        return 'heart';
      case '장례식':
        return 'rose';
      case '돌잔치':
        return 'sparkles';
      case '생일':
        return 'gift';
      default:
        return 'star';
    }
  };

  const getEventIconColor = (type: string): string => {
    switch (type) {
      case '결혼식':
        return '#e91e63'; // 핑크/빨강
      case '장례식':
        return '#9e9e9e'; // 회색
      case '돌잔치':
        return '#ff9800'; // 오렌지
      default:
        return '#666666'; // 기본 회색
    }
  };


  return (
    <View style={styles.container}>
      {/* 무신사 스타일 헤더 */}

      {/* 무신사 스타일 이벤트 리스트 */}
      <View style={styles.eventsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>최근 함께한 순간</Text>
        </View>

        <View style={styles.eventsList}>
          {sortedEvents.map((event, index) => {
            const IconName = getEventIcon(event.type);
            const iconColor = getEventIconColor(event.type);
            
            return (
              <TouchableOpacity 
                key={event.id} 
                style={styles.eventCard}
                activeOpacity={0.8}
                onPress={() => {}}
              >
                {/* 이벤트 아이콘 영역 */}
                <View style={styles.iconSection}>
                  <View style={styles.eventIconContainer}>
                    <Ionicons name={IconName} size={20} color={iconColor} />
                  </View>
                </View>

                {/* 정보 영역 */}
                <View style={styles.infoSection}>
                  <View style={styles.titleRow}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                  </View>
                  
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={styles.metaText}>{event.date}</Text>
                  </View>
                  
                  <View style={[styles.metaRow, { marginTop: 5 }]}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.metaText}>{event.location}</Text>
                  </View>
                </View>

                {/* 금액 영역 (이벤트 타입 + 금액) */}
                <View style={styles.amountSection}>
                  <View style={[styles.typeTag, { backgroundColor: '#f0f0f0' }]}>
                    <Text style={[styles.typeText, { color: '#666666' }]}>
                      {event.type}
                    </Text>
                  </View>
                  <Text></Text>
                  <Text style={styles.amountText}>{event.amount.toLocaleString()}원</Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
    fontSize: 20,
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

  // 아이콘 섹션
  iconSection: {
    position: 'relative',
    marginRight: 16,
  },
  eventIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
