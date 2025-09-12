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

const EventDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // 개별 항목 수정 핸들러
  const handleEditItem = (field: string, currentValue: string) => {
    router.push({
      pathname: '/edit-event-field',
      params: {
        id: id,
        field: field,
        currentValue: currentValue,
        title: eventDetail.title
      }
    });
  };

  // Mock data for event detail
  const eventDetail = {
    id: parseInt(id),
    title: "김철수 ♥ 이영희 결혼식",
    type: "결혼식",
    date: "2024-08-25",
    time: "12:00",
    location: "롯데호텔 크리스탈볼룸",
    amount: 100000,
    status: "예정",
    attendees: 150,
    memo: "신랑 신부 모두 대학교 동기입니다. 신혼여행은 유럽으로 갑니다.",
  };

  return (
    <MobileLayout currentPage="event-detail">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>상세 정보</Text>
            <View style={styles.placeholder} />
          </View>
        </View>


        {/* 일정 정보 수정 섹션 */}
        <View style={styles.editSection}>
          <View style={styles.editCard}>
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('title', eventDetail.title)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>일정명</Text>
                  <Text style={styles.editValue}>{eventDetail.title}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('type', eventDetail.type)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>경조사 타입</Text>
                  <Text style={styles.editValue}>{eventDetail.type}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('date', eventDetail.date)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>날짜</Text>
                  <Text style={styles.editValue}>{eventDetail.date}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('time', eventDetail.time)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>시간</Text>
                  <Text style={styles.editValue}>{eventDetail.time}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('location', eventDetail.location)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>장소</Text>
                  <Text style={styles.editValue}>{eventDetail.location}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('amount', eventDetail.amount.toString())}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>금액</Text>
                  <Text style={styles.editValue}>{eventDetail.amount.toLocaleString()}원</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('status', eventDetail.status)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>상태</Text>
                  <Text style={styles.editValue}>{eventDetail.status}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>

            {/* 메모 */}
            <TouchableOpacity
              style={styles.memoItem}
              activeOpacity={0.7}
              onPress={() => handleEditItem('memo', eventDetail.memo)}
            >
              <View style={styles.memoHeader}>
                <View style={styles.memoInfo}>
                  <Text style={styles.memoLabel}>메모</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </View>
              
              <View style={styles.memoContent}>
                <Text style={styles.memoText} numberOfLines={3}>
                  {eventDetail.memo || '메모가 없습니다'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.secondaryActionButton}
            onPress={() => router.push('/(tabs)/schedules')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryActionText}>일정 보기</Text>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: 'f8f9fa',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 40,
  },

  // 수정 섹션 스타일
  editSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  editCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  // 수정 아이템 스타일
  editItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  lastEditItem: {
    borderBottomWidth: 0,
  },
  editItemLeft: {
    flex: 1,
  },
  editItemContent: {
    flex: 1,
  },
  editLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  editValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },

  // 메모 아이템 스타일
  memoItem: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  memoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memoInfo: {
    flex: 1,
  },
  memoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  memoContent: {
    paddingLeft: 0,
  },
  memoText: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
  },

  // 액션 버튼 스타일
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'f8f9fa',
  },
  secondaryActionButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryActionText: {
    color: '#4a5568',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventDetail;
