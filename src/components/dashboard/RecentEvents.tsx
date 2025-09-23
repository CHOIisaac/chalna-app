import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RecentLedger } from '../../types';

interface RecentEventsProps {
  recentLedgers: RecentLedger[];
  loading: boolean;
}

const RecentEvents: React.FC<RecentEventsProps> = ({ recentLedgers, loading }) => {
  // 시간 포맷팅 함수 (HH:MM:SS -> HH:MM)
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:MM만 추출
  };

  // 날짜 포맷팅 함수 (장부 화면과 동일하게 년월일 형태)
  const formatDate = (dateString: string) => {
    return dateString; // API에서 받은 날짜 그대로 사용 (YYYY-MM-DD)
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
          ) : recentLedgers.length > 0 ? (
            recentLedgers.map((ledger, index) => (
              <TouchableOpacity 
                key={ledger.id} 
                style={styles.eventCard}
                activeOpacity={0.8}
                onPress={() => {}}
              >
                {/* 메모 표시 - 카드 모서리 */}
                {ledger.memo && ledger.memo.trim() !== '' && (
                  <View style={styles.memoCorner} />
                )}

                {/* 정보 영역 */}
                <View style={styles.ledgerInfo}>
                  <View style={styles.ledgerHeader}>
                    <Text style={styles.ledgerName}>{ledger.name}</Text>
                  </View>
                  
                  <View style={styles.ledgerDetails}>
                    <Text style={styles.relationshipText}>{ledger.relationship_type}</Text>
                    <Text style={styles.separator}>•</Text>
                    <Text style={styles.eventTypeText}>{ledger.event_type}</Text>
                  </View>
                  
                  <View style={styles.ledgerMeta}>
                    <Text style={styles.dateText}>{formatDate(ledger.event_date)}</Text>
                  </View>
                </View>

                {/* 금액 영역 */}
                <View style={styles.amountSection}>
                  <Text style={[styles.amountText, { color: '#4a5568' }]}>
                    {ledger.amount.toLocaleString()}원
                  </Text>
                  <Text style={[styles.typeLabel, { color: ledger.entry_type === 'given' ? '#4a5568' : '#718096' }]}>
                    {ledger.entry_type === 'given' ? '나눔' : '받음'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            // 데이터가 없을 때
            <View style={styles.eventCard}>
              <View style={styles.ledgerInfo}>
                <Text style={styles.ledgerName}>등록된 장부 기록이 없습니다</Text>
                <Text style={[styles.dateText, { marginTop: 8 }]}>
                  새로운 경조사 장부를 추가해보세요
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
    position: 'relative',
  },

  // 장부 정보 섹션
  ledgerInfo: {
    flex: 1,
  },
  ledgerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ledgerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  ledgerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  relationshipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  eventTypeText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  separator: {
    fontSize: 13,
    color: '#999',
    marginHorizontal: 6,
  },
  ledgerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  memoCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderTopWidth: 20,
    borderTopColor: '#E5E5E5',
    borderLeftWidth: 20,
    borderLeftColor: 'transparent',
    borderTopRightRadius: 16,
  },

  // 금액 섹션
  amountSection: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default RecentEvents;
